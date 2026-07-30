package com.otherbali.offlinemapbox;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.app.Activity;
import android.graphics.Color;
import android.view.Gravity;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.mapbox.maps.CameraOptions;
import com.mapbox.maps.MapView;
import com.mapbox.maps.MapboxMapsOptions;
import com.mapbox.maps.Style;
import com.mapbox.bindgen.Value;
import com.mapbox.maps.LayerPosition;
import com.mapbox.maps.plugin.Plugin;
import com.mapbox.maps.plugin.locationcomponent.LocationComponentPlugin;
import com.mapbox.geojson.LineString;
import com.mapbox.geojson.Point;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class OfflineMapActivity extends Activity {
    private static final int LOCATION_PERMISSION_REQUEST = 41;
    private MapView mapView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MapboxMapsOptions.setTileStore(
            com.mapbox.common.TileStore.create(getFilesDir() + "/mapbox-offline-v1")
        );
        mapView = new MapView(this);
        String routeGeometry = getIntent().getStringExtra("routeGeometry");
        String destinationLabel = getIntent().getStringExtra("destinationLabel");
        mapView.getMapboxMap().loadStyleUri(Style.OUTDOORS, style ->
            renderGeoJsonSourceAndLineLayer(style, routeGeometry)
        );
        mapView.getMapboxMap().setCamera(
            new CameraOptions.Builder().center(com.mapbox.geojson.Point.fromLngLat(115.19, -8.54)).zoom(9.0).build()
        );
        FrameLayout root = new FrameLayout(this);
        root.addView(mapView, new FrameLayout.LayoutParams(-1, -1));
        TextView nextStop = new TextView(this);
        nextStop.setText(destinationLabel == null || destinationLabel.isBlank()
            ? "Next stop"
            : destinationLabel);
        nextStop.setTextColor(Color.BLACK);
        nextStop.setBackgroundColor(Color.WHITE);
        nextStop.setPadding(24, 16, 24, 16);
        FrameLayout.LayoutParams labelLayout =
            new FrameLayout.LayoutParams(-2, -2, Gravity.TOP | Gravity.CENTER_HORIZONTAL);
        labelLayout.topMargin = 64;
        root.addView(nextStop, labelLayout);
        setContentView(root);
        enableLocationPuck();
    }

    private void renderGeoJsonSourceAndLineLayer(Style style, String routeGeometry) {
        if (routeGeometry == null || routeGeometry.isBlank()) return;
        try {
            JSONArray raw = new JSONArray(routeGeometry);
            if (raw.length() > 5000) return;
            List<Point> points = new ArrayList<>();
            for (int index = 0; index < raw.length(); index += 1) {
                JSONObject point = raw.getJSONObject(index);
                double longitude = point.getDouble("longitude");
                double latitude = point.getDouble("latitude");
                if (!isWgs84(latitude, longitude)) return;
                points.add(Point.fromLngLat(
                    longitude,
                    latitude
                ));
            }
            if (points.size() < 2) return;
            LineString line = LineString.fromLngLats(points);
            String sourceJson = new JSONObject()
                .put("type", "geojson")
                .put("data", new JSONObject(line.toJson()))
                .toString();
            String layerJson = new JSONObject()
                .put("id", "offline-route-line")
                .put("type", "line")
                .put("source", "offline-route-source")
                .put("paint", new JSONObject()
                    .put("line-color", "#0D9488")
                    .put("line-width", 5))
                .toString();
            style.addStyleSource(
                "offline-route-source",
                Value.fromJson(sourceJson).getValue()
            );
            style.addStyleLayer(
                Value.fromJson(layerJson).getValue(),
                new LayerPosition(null, null, null)
            );
        } catch (Exception ignored) {
            // Invalid route geometry is fail-closed: the downloaded map remains usable.
        }
    }

    private boolean isWgs84(double latitude, double longitude) {
        return Double.isFinite(latitude) && Double.isFinite(longitude)
            && latitude >= -90 && latitude <= 90
            && longitude >= -180 && longitude <= 180;
    }

    private void enableLocationPuck() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
            != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                new String[] {
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                },
                LOCATION_PERMISSION_REQUEST
            );
            return;
        }
        LocationComponentPlugin location = mapView.getPlugin(
            Plugin.MAPBOX_LOCATION_COMPONENT_PLUGIN_ID
        );
        if (location != null) {
            location.setEnabled(true);
            location.setPuckBearingEnabled(true);
        }
    }

    @Override
    public void onRequestPermissionsResult(
        int requestCode,
        String[] permissions,
        int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST) enableLocationPuck();
    }

    @Override
    protected void onStart() {
        super.onStart();
        mapView.onStart();
    }

    @Override
    protected void onStop() {
        mapView.onStop();
        super.onStop();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mapView.onLowMemory();
    }

    @Override
    protected void onDestroy() {
        mapView.onDestroy();
        super.onDestroy();
    }
}
