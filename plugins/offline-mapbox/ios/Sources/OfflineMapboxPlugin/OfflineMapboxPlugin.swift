import Foundation
import UIKit
import CoreLocation
import Capacitor
import MapboxMaps
import MapboxNavigationCore
import Turf

@objc(OfflineMapboxPlugin)
public class OfflineMapboxPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "OfflineMapboxPlugin"
    public let jsName = "OfflineMapbox"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "capability", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "download", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "open", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "list", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setTelemetryConsent", returnType: CAPPluginReturnPromise)
    ]

    private static let quota = 1_073_741_824
    private let navigationProvider = MapboxNavigationProvider(coreConfig: CoreConfig())
    private var tileStore: TileStore {
        navigationProvider.coreConfig.tilestoreConfig.navigatorLocation.tileStore
    }

    @objc override public func load() {
        let defaults = UserDefaults.standard
        let telemetryEnabled = defaults.object(
            forKey: "offline-mapbox.telemetry-enabled"
        ) != nil
            ? defaults.bool(forKey: "offline-mapbox.telemetry-enabled")
            : false
        defaults.set(telemetryEnabled, forKey: "MGLMapboxMetricsEnabled")
    }

    @objc func capability(_ call: CAPPluginCall) {
        call.resolve([
            "available": true,
            "provider": "mapbox",
            "mapTiles": true,
            "gpsOnDownloadedMap": true,
            "onboardRouting": false,
            "telemetryOptOutAvailable": true,
            "maxDeviceBytes": Self.quota
        ])
    }

    @objc func download(_ call: CAPPluginCall) {
        guard let id = call.getString("id"),
              id.range(of: #"^[a-z0-9-]{1,100}$"#, options: .regularExpression) != nil,
              let version = call.getString("version"), !version.isEmpty,
              let west = call.getDouble("west"), let south = call.getDouble("south"),
              let east = call.getDouble("east"), let north = call.getDouble("north"),
              west < east, south < north else {
            call.reject("invalid_offline_region")
            return
        }
        let ring = [
            CLLocationCoordinate2D(latitude: south, longitude: west),
            CLLocationCoordinate2D(latitude: south, longitude: east),
            CLLocationCoordinate2D(latitude: north, longitude: east),
            CLLocationCoordinate2D(latitude: north, longitude: west),
            CLLocationCoordinate2D(latitude: south, longitude: west)
        ]
        let geometry = Geometry.polygon(Polygon([ring]))
        let manager = OfflineManager()
        let mapsDescriptor = manager.createTilesetDescriptor(
            for: TilesetDescriptorOptions(
                styleURI: .outdoors,
                zoomRange: 0...15,
                tilesets: nil
            )
        )
        let routingDescriptor = navigationProvider.getLatestNavigationTilesetDescriptor()
        guard let options = TileRegionLoadOptions(
            geometry: geometry,
            descriptors: [mapsDescriptor, routingDescriptor],
            acceptExpired: false
        ) else {
            call.reject("offline_region_options_failed")
            return
        }
        tileStore.loadTileRegion(forId: id, loadOptions: options) { [weak self] progress in
            let required = max(1, progress.requiredResourceCount)
            self?.notifyListeners("progress", data: [
                "regionId": id,
                "completedResourceCount": progress.completedResourceCount,
                "completedResourceSize": progress.completedResourceSize,
                "requiredResourceCount": required,
                "progress": min(1, Double(progress.completedResourceCount) / Double(required))
            ])
        } completion: { result in
            switch result {
            case .success(let region):
                UserDefaults.standard.set(version, forKey: "offline-mapbox.\(id)")
                let required = max(1, region.requiredResourceCount)
                call.resolve([
                    "regionId": id,
                    "completedResourceCount": region.completedResourceCount,
                    "completedResourceSize": region.completedResourceSize,
                    "requiredResourceCount": required,
                    "progress": min(1, Double(region.completedResourceCount) / Double(required))
                ])
            case .failure:
                call.reject("offline_region_download_failed")
            }
        }
    }

    @objc func remove(_ call: CAPPluginCall) {
        guard let id = call.getString("regionId") else {
            call.reject("region_id_required")
            return
        }
        tileStore.removeTileRegion(forId: id)
        UserDefaults.standard.removeObject(forKey: "offline-mapbox.\(id)")
        call.resolve()
    }

    @objc func list(_ call: CAPPluginCall) {
        let packs = UserDefaults.standard.dictionaryRepresentation().keys
            .filter {
                $0.hasPrefix("offline-mapbox.")
                    && $0 != "offline-mapbox.telemetry-enabled"
            }
            .map { key -> [String: Any] in
                [
                    "regionId": String(key.dropFirst("offline-mapbox.".count)),
                    "completedResourceCount": 1,
                    "completedResourceSize": 1,
                    "requiredResourceCount": 1,
                    "progress": 1
                ]
            }
        call.resolve(["packs": packs])
    }

    @objc func open(_ call: CAPPluginCall) {
        guard let id = call.getString("regionId"),
              UserDefaults.standard.object(forKey: "offline-mapbox.\(id)") != nil else {
            call.reject("offline_region_not_ready")
            return
        }
        DispatchQueue.main.async { [weak self] in
            let controller = OfflineMapViewController(tileStore: self?.tileStore)
            controller.modalPresentationStyle = .fullScreen
            self?.bridge?.viewController?.present(controller, animated: true) {
                call.resolve(["opened": true])
            }
        }
    }

    @objc func setTelemetryConsent(_ call: CAPPluginCall) {
        let enabled = call.getBool("enabled", false)
        UserDefaults.standard.set(enabled, forKey: "MGLMapboxMetricsEnabled")
        UserDefaults.standard.set(enabled, forKey: "offline-mapbox.telemetry-enabled")
        call.resolve()
    }
}

private final class OfflineMapViewController: UIViewController {
    private let tileStore: TileStore?
    private let locationManager = CLLocationManager()
    init(tileStore: TileStore?) {
        self.tileStore = tileStore
        super.init(nibName: nil, bundle: nil)
    }
    required init?(coder: NSCoder) { nil }

    override func viewDidLoad() {
        super.viewDidLoad()
        let options = MapInitOptions(
            mapOptions: MapOptions(),
            cameraOptions: CameraOptions(center: CLLocationCoordinate2D(latitude: -8.54, longitude: 115.19), zoom: 9),
            styleURI: .outdoors
        )
        let map = MapView(frame: view.bounds, mapInitOptions: options)
        map.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        map.location.options.puckType = .puck2D(.makeDefault(showBearing: true))
        map.location.options.puckBearing = .course
        map.location.options.puckBearingEnabled = true
        view.addSubview(map)
        if locationManager.authorizationStatus == .notDetermined {
            locationManager.requestWhenInUseAuthorization()
        }
        let close = UIButton(type: .system)
        close.setTitle("Close", for: .normal)
        close.backgroundColor = .white
        close.layer.cornerRadius = 18
        close.frame = CGRect(x: 20, y: 56, width: 84, height: 40)
        close.addTarget(self, action: #selector(closeMap), for: .touchUpInside)
        view.addSubview(close)
    }
    @objc private func closeMap() { dismiss(animated: true) }
}
