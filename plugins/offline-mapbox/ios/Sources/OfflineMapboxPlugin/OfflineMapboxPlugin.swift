import Capacitor

@objc(OfflineMapboxPlugin)
public class OfflineMapboxPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "OfflineMapboxPlugin"
    public let jsName = "OfflineMapbox"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "capability", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "download", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "route", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "open", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "list", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setTelemetryConsent", returnType: CAPPluginReturnPromise)
    ]

    @objc func capability(_ call: CAPPluginCall) {
        call.resolve([
            "available": false,
            "provider": "mapbox",
            "mapTiles": false,
            "gpsOnDownloadedMap": false,
            "onboardRouting": false,
            "telemetryOptOutAvailable": false,
            "maxDeviceBytes": 0
        ])
    }

    @objc func route(_ call: CAPPluginCall) {
        call.reject("offline_mapbox_unavailable")
    }

    @objc func download(_ call: CAPPluginCall) {
        call.reject("offline_mapbox_unavailable")
    }

    @objc func remove(_ call: CAPPluginCall) {
        guard let regionId = call.getString("regionId"),
              !regionId.isEmpty,
              regionId.count <= 100,
              regionId.allSatisfy({
                  $0.isLowercase || $0.isNumber || $0 == "-"
              }) else {
            call.reject("region_id_required")
            return
        }
        call.resolve()
    }

    @objc func list(_ call: CAPPluginCall) {
        call.resolve(["packs": []])
    }

    @objc func open(_ call: CAPPluginCall) {
        call.reject("offline_mapbox_unavailable")
    }

    @objc func setTelemetryConsent(_ call: CAPPluginCall) {
        call.resolve()
    }
}
