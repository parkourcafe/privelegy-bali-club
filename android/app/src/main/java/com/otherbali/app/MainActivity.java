package com.otherbali.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Defensive runtime guard: the shell must never expose a native action bar
        // over the light web UI, even if a platform theme variant is selected.
        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }
        if (getActionBar() != null) {
            getActionBar().hide();
        }
        hideNativeActionBarView();

        getWindow().setStatusBarColor(Color.parseColor("#FAF6EF"));
        getWindow().setNavigationBarColor(Color.parseColor("#FAF6EF"));
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                        | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideNativeActionBarView();
        }
    }

    private void hideNativeActionBarView() {
        int actionBarId = getResources().getIdentifier(
                "action_bar_container", "id", getPackageName());
        if (actionBarId == 0) {
            actionBarId = getResources().getIdentifier(
                    "action_bar_container", "id", "android");
        }
        View actionBar = actionBarId == 0
                ? null
                : getWindow().getDecorView().findViewById(actionBarId);
        if (actionBar != null) {
            actionBar.setVisibility(View.GONE);
        }
    }
}
