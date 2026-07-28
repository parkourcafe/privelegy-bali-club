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
import com.mapbox.navigation.base.extensions.RouteOptionsExtensions;
import com.mapbox.navigation.base.route.NavigationRoute;
import com.mapbox.navigation.base.route.NavigationRouterCallback;
import com.mapbox.navigation.base.route.RouterFailure;
import com.mapbox.navigation.core.MapboxNavigation;
import com.mapbox.navigation.core.MapboxNavigationProvider;
import com.mapbox.api.directions.v5.DirectionsCriteria;
import com.mapbox.api.directions.v5.models.RouteOptions;
import com.mapbox.geojson.LineString;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

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

    @Override
    public void load() {
        SharedPreferences preferences =
            getContext().getSharedPreferences("offline-mapbox", 0);
        boolean telemetryEnabled = preferences.contains("telemetry-enabled")
            ? preferences.getBoolean("telemetry-enabled", false)
            : false;
        MapProvider.INSTANCE.getMapTelemetryInstance(getContext())
            .setUserTelemetryRequestState(telemetryEnabled);
    }

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

    @Override
    protected void handleOnDestroy() {
        if (MapboxNavigationProvider.isCreated()) {
            MapboxNavigationProvider.destroy();
        }
        navigation = null;
        super.handleOnDestroy();
    }

    @PluginMethod
    public void capability(PluginCall call) {
        JSObject result = new JSObject();
        result.put("available", true);
        result.put("provider", "mapbox");
        result.put("mapTiles", true);
        result.put("gpsOnDownloadedMap", true);
        result.put("onboardRouting", true);
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
                JSObject state = pack(id, version, progress.getCompletedResourceCount(),
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
                        version,
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

    private JSObject pack(
        String id,
        String version,
        long complete,
        long bytes,
        long required
    ) {
        JSObject state = new JSObject();
        state.put("regionId", id);
        state.put("version", version);
        state.put("completedResourceCount", complete);
        state.put("completedResourceSize", bytes);
        state.put("requiredResourceCount", required);
        state.put("progress", required > 0 ? Math.min(1d, (double) complete / required) : 0d);
        return state;
    }

    @PluginMethod
    public void route(PluginCall call) {
        String regionId = call.getString("regionId", "");
        String version = call.getString("version", "");
        String profile = call.getString("profile", "");
        JSObject origin = call.getObject("origin");
        JSObject destination = call.getObject("destination");
        SharedPreferences preferences = getContext().getSharedPreferences("offline-mapbox", 0);
        if (!regionId.matches("[a-z0-9-]{1,100}")
            || !version.equals(preferences.getString(regionId, null))
            || origin == null || destination == null) {
            call.reject("invalid_offline_route_request");
            return;
        }
        double originLatitude = origin.optDouble("latitude", Double.NaN);
        double originLongitude = origin.optDouble("longitude", Double.NaN);
        double destinationLatitude = destination.optDouble("latitude", Double.NaN);
        double destinationLongitude = destination.optDouble("longitude", Double.NaN);
        String mapboxProfile;
        switch (profile) {
            case "driving": mapboxProfile = DirectionsCriteria.PROFILE_DRIVING; break;
            case "walking": mapboxProfile = DirectionsCriteria.PROFILE_WALKING; break;
            case "cycling": mapboxProfile = DirectionsCriteria.PROFILE_CYCLING; break;
            default:
                call.reject("unsupported_offline_route_profile");
                return;
        }
        if (!Double.isFinite(originLatitude) || !Double.isFinite(originLongitude)
            || !Double.isFinite(destinationLatitude) || !Double.isFinite(destinationLongitude)) {
            call.reject("invalid_offline_route_coordinates");
            return;
        }
        Point originPoint = Point.fromLngLat(originLongitude, originLatitude);
        Point destinationPoint = Point.fromLngLat(destinationLongitude, destinationLatitude);
        RouteOptions.Builder builder = RouteOptions.builder()
            .coordinatesList(Arrays.asList(originPoint, destinationPoint))
            .profile(mapboxProfile)
            .overview(DirectionsCriteria.OVERVIEW_FULL)
            .geometries(DirectionsCriteria.GEOMETRY_POLYLINE6)
            .steps(false);
        RouteOptions options = RouteOptionsExtensions.applyDefaultNavigationOptions(builder).build();
        navigation().requestRoutes(options, new NavigationRouterCallback() {
            @Override
            public void onRoutesReady(List<NavigationRoute> routes, String routerOrigin) {
                if (routes.isEmpty()) {
                    call.reject("offline_route_not_found");
                    return;
                }
                com.mapbox.api.directions.v5.models.DirectionsRoute directions =
                    routes.get(0).getDirectionsRoute();
                String encodedGeometry = directions.geometry();
                Double distance = directions.distance();
                Double duration = directions.duration();
                if (encodedGeometry == null || distance == null || duration == null) {
                    call.reject("offline_route_result_incomplete");
                    return;
                }
                List<Point> coordinates =
                    LineString.fromPolyline(encodedGeometry, 6).coordinates();
                if (coordinates.size() < 2 || coordinates.size() > 5000) {
                    call.reject("offline_route_result_invalid");
                    return;
                }
                JSArray geometry = new JSArray();
                geometry.put(new JSObject()
                    .put("latitude", originLatitude)
                    .put("longitude", originLongitude));
                for (int index = 1; index < coordinates.size() - 1; index += 1) {
                    Point point = coordinates.get(index);
                    if (!isWgs84(point.latitude(), point.longitude())) {
                        call.reject("offline_route_result_invalid");
                        return;
                    }
                    geometry.put(new JSObject()
                        .put("latitude", point.latitude())
                        .put("longitude", point.longitude()));
                }
                geometry.put(new JSObject()
                    .put("latitude", destinationLatitude)
                    .put("longitude", destinationLongitude));
                JSObject result = new JSObject();
                result.put("regionId", regionId);
                result.put("version", version);
                result.put("profile", profile);
                result.put("origin", origin);
                result.put("destination", destination);
                result.put("distanceMeters", distance);
                result.put("durationSeconds", duration);
                result.put("geometry", geometry);
                result.put("generatedAt", canonicalTimestamp());
                result.put("trafficAware", false);
                call.resolve(result);
            }

            @Override
            public void onFailure(List<RouterFailure> failures, RouteOptions routeOptions) {
                call.reject("offline_route_failed");
            }

            @Override
            public void onCanceled(RouteOptions routeOptions, String routerOrigin) {
                call.reject("offline_route_cancelled");
            }
        });
    }

    private boolean isWgs84(double latitude, double longitude) {
        return Double.isFinite(latitude) && Double.isFinite(longitude)
            && latitude >= -90 && latitude <= 90
            && longitude >= -180 && longitude <= 180;
    }

    private String canonicalTimestamp() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        return formatter.format(new Date());
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
        tileStore().getAllTileRegions(expected -> {
            if (!expected.isValue()) {
                call.reject("offline_region_list_failed");
                return;
            }
            JSArray packs = new JSArray();
            for (com.mapbox.common.TileRegion region : expected.getValue()) {
                String version = preferences.getString(region.getId(), null);
                if (version == null) continue;
                packs.put(pack(
                    region.getId(),
                    version,
                    region.getCompletedResourceCount(),
                    region.getCompletedResourceSize(),
                    region.getRequiredResourceCount()
                ));
            }
            JSObject result = new JSObject();
            result.put("packs", packs);
            call.resolve(result);
        });
    }

    @PluginMethod
    public void open(PluginCall call) {
        String id = call.getString("regionId", "");
        JSArray routeGeometry = call.getArray("routeGeometry", new JSArray());
        String destinationLabel = call.getString("destinationLabel", "Next stop").trim();
        if (!getContext().getSharedPreferences("offline-mapbox", 0).contains(id)) {
            call.reject("offline_region_not_ready");
            return;
        }
        Intent intent = new Intent(getContext(), OfflineMapActivity.class);
        intent.putExtra("regionId", id);
        intent.putExtra("routeGeometry", routeGeometry.toString());
        intent.putExtra("destinationLabel", boundedLabel(destinationLabel));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
        JSObject result = new JSObject();
        result.put("opened", true);
        call.resolve(result);
    }

    private String boundedLabel(String label) {
        if (label == null || label.isBlank()) return "Next stop";
        String trimmed = label.trim();
        return trimmed.length() > 80 ? trimmed.substring(0, 80) : trimmed;
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
