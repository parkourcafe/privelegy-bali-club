package com.otherbali.offlinemapbox;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.mapbox.bindgen.Value;
import com.mapbox.common.TileRegionLoadOptions;
import com.mapbox.common.TileStore;
import com.mapbox.common.TileStoreOptions;
import com.mapbox.common.TilesetDescriptor;
import com.mapbox.geojson.Point;
import com.mapbox.geojson.Polygon;
import com.mapbox.maps.OfflineManager;
import com.mapbox.maps.MapProvider;
import com.mapbox.maps.Style;
import com.mapbox.maps.TilesetDescriptorOptions;
import com.mapbox.navigation.base.options.NavigationOptions;
import com.mapbox.navigation.base.options.RoutingTilesOptions;
import com.mapbox.navigation.core.MapboxNavigation;
import com.mapbox.navigation.core.MapboxNavigationProvider;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@CapacitorPlugin(
    name = "OfflineMapbox",
    permissions = {
        @Permission(alias = "location", strings = {
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        })
    }
)
public class OfflineMapboxPlugin extends Plugin {
    private static final long QUOTA = 1_073_741_824L;
    private TileStore tileStore;
    private MapboxNavigation navigation;

    private TileStore tileStore() {
        if (tileStore == null) {
            File directory = new File(getContext().getFilesDir(), "mapbox-offline-v1");
            tileStore = TileStore.create(directory.getAbsolutePath());
            tileStore.setOption(TileStoreOptions.DISK_QUOTA, new Value(QUOTA));
        }
        return tileStore;
    }

    private MapboxNavigation navigation() {
        if (navigation == null) {
            RoutingTilesOptions routing = new RoutingTilesOptions.Builder()
                .tileStore(tileStore())
                .build();
            navigation = MapboxNavigationProvider.create(
                new NavigationOptions.Builder(getContext()).routingTilesOptions(routing).build()
            );
        }
        return navigation;
    }

    @PluginMethod
    public void capability(PluginCall call) {
        JSObject result = new JSObject();
        result.put("available", true);
        result.put("provider", "mapbox");
        result.put("mapTiles", true);
        result.put("gpsOnDownloadedMap", true);
        result.put("onboardRouting", false);
        result.put("telemetryOptOutAvailable", true);
        result.put("maxDeviceBytes", QUOTA);
        call.resolve(result);
    }

    @PluginMethod
    public void download(PluginCall call) {
        String id = call.getString("id", "");
        String version = call.getString("version", "");
        Double west = call.getDouble("west");
        Double south = call.getDouble("south");
        Double east = call.getDouble("east");
        Double north = call.getDouble("north");
        if (!id.matches("[a-z0-9-]{1,100}") || version.isBlank()
            || west == null || south == null || east == null || north == null
            || west >= east || south >= north) {
            call.reject("invalid_offline_region");
            return;
        }

        List<Point> ring = Arrays.asList(
            Point.fromLngLat(west, south),
            Point.fromLngLat(east, south),
            Point.fromLngLat(east, north),
            Point.fromLngLat(west, north),
            Point.fromLngLat(west, south)
        );
        Polygon geometry = Polygon.fromLngLats(List.of(ring));
        TilesetDescriptor maps = new OfflineManager().createTilesetDescriptor(
            new TilesetDescriptorOptions.Builder()
                .styleURI(Style.OUTDOORS)
                .minZoom((byte) 0)
                .maxZoom((byte) 15)
                .build()
        );
        TilesetDescriptor routes = navigation().getTilesetDescriptorFactory().getLatest();
        ArrayList<TilesetDescriptor> descriptors = new ArrayList<>();
        descriptors.add(maps);
        descriptors.add(routes);
        TileRegionLoadOptions options = new TileRegionLoadOptions.Builder()
            .geometry(geometry)
            .descriptors(descriptors)
            .acceptExpired(false)
            .build();

        tileStore().loadTileRegion(
            id,
            options,
            progress -> {
                JSObject state = pack(id, progress.getCompletedResourceCount(),
                    progress.getCompletedResourceSize(), progress.getRequiredResourceCount());
                notifyListeners("progress", state);
            },
            expected -> {
                if (expected.isValue()) {
                    com.mapbox.common.TileRegion region = expected.getValue();
                    getContext().getSharedPreferences("offline-mapbox", 0).edit()
                        .putString(id, version).apply();
                    call.resolve(pack(
                        id,
                        region.getCompletedResourceCount(),
                        region.getCompletedResourceSize(),
                        region.getRequiredResourceCount()
                    ));
                } else {
                    call.reject("offline_region_download_failed");
                }
            }
        );
    }

    private JSObject pack(String id, long complete, long bytes, long required) {
        JSObject state = new JSObject();
        state.put("regionId", id);
        state.put("completedResourceCount", complete);
        state.put("completedResourceSize", bytes);
        state.put("requiredResourceCount", required);
        state.put("progress", required > 0 ? Math.min(1d, (double) complete / required) : 0d);
        return state;
    }

    @PluginMethod
    public void remove(PluginCall call) {
        String id = call.getString("regionId", "");
        tileStore().removeTileRegion(id);
        getContext().getSharedPreferences("offline-mapbox", 0).edit().remove(id).apply();
        call.resolve();
    }

    @PluginMethod
    public void list(PluginCall call) {
        SharedPreferences preferences = getContext().getSharedPreferences("offline-mapbox", 0);
        JSArray packs = new JSArray();
        for (String id : preferences.getAll().keySet()) packs.put(pack(id, 1, 1, 1));
        JSObject result = new JSObject();
        result.put("packs", packs);
        call.resolve(result);
    }

    @PluginMethod
    public void open(PluginCall call) {
        String id = call.getString("regionId", "");
        if (!getContext().getSharedPreferences("offline-mapbox", 0).contains(id)) {
            call.reject("offline_region_not_ready");
            return;
        }
        Intent intent = new Intent(getContext(), OfflineMapActivity.class);
        intent.putExtra("regionId", id);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
        JSObject result = new JSObject();
        result.put("opened", true);
        call.resolve(result);
    }

    @PluginMethod
    public void setTelemetryConsent(PluginCall call) {
        boolean enabled = Boolean.TRUE.equals(call.getBoolean("enabled"));
        MapProvider.INSTANCE.getMapTelemetryInstance(getContext())
            .setUserTelemetryRequestState(enabled);
        getContext().getSharedPreferences("offline-mapbox", 0).edit()
            .putBoolean("telemetry-enabled", enabled).apply();
        call.resolve();
    }
}
