package com.otherbali.offlinemapbox;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.FrameLayout;
import android.app.Activity;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.mapbox.maps.CameraOptions;
import com.mapbox.maps.MapView;
import com.mapbox.maps.MapboxMapsOptions;
import com.mapbox.maps.Style;
import com.mapbox.maps.plugin.Plugin;
import com.mapbox.maps.plugin.locationcomponent.LocationComponentPlugin;

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
        mapView.getMapboxMap().loadStyleUri(Style.OUTDOORS);
        mapView.getMapboxMap().setCamera(
            new CameraOptions.Builder().center(com.mapbox.geojson.Point.fromLngLat(115.19, -8.54)).zoom(9.0).build()
        );
        FrameLayout root = new FrameLayout(this);
        root.addView(mapView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        enableLocationPuck();
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
