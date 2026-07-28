import Foundation
import UIKit
import CoreLocation
import Capacitor
import MapboxMaps
import MapboxNavigationCore
import MapboxDirections
import Turf

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
            "onboardRouting": true,
            "telemetryOptOutAvailable": true,
            "maxDeviceBytes": Self.quota
        ])
    }

    @objc func route(_ call: CAPPluginCall) {
        guard let regionId = call.getString("regionId"),
              let version = call.getString("version"),
              UserDefaults.standard.string(forKey: "offline-mapbox.\(regionId)") == version,
              let profile = call.getString("profile"),
              let origin = call.getObject("origin"),
              let destination = call.getObject("destination"),
              let originLatitude = origin["latitude"] as? Double,
              let originLongitude = origin["longitude"] as? Double,
              let destinationLatitude = destination["latitude"] as? Double,
              let destinationLongitude = destination["longitude"] as? Double else {
            call.reject("invalid_offline_route_request")
            return
        }
        guard Self.isWgs84(latitude: originLatitude, longitude: originLongitude),
              Self.isWgs84(latitude: destinationLatitude, longitude: destinationLongitude) else {
            call.reject("invalid_offline_route_coordinates")
            return
        }
        let profileIdentifier: ProfileIdentifier
        switch profile {
        case "driving": profileIdentifier = .automobile
        case "walking": profileIdentifier = .walking
        case "cycling": profileIdentifier = .cycling
        default:
            call.reject("unsupported_offline_route_profile")
            return
        }
        let originCoordinate = CLLocationCoordinate2D(
            latitude: originLatitude,
            longitude: originLongitude
        )
        let destinationCoordinate = CLLocationCoordinate2D(
            latitude: destinationLatitude,
            longitude: destinationLongitude
        )
        let options = NavigationRouteOptions(
            coordinates: [originCoordinate, destinationCoordinate],
            profileIdentifier: profileIdentifier
        )
        Task { [weak self] in
            guard let self else {
                call.reject("offline_route_provider_unavailable")
                return
            }
            do {
                let routes = try await self.navigationProvider.routingProvider()
                    .calculateRoutes(options: options).value
                let route = routes.mainRoute.route
                guard let coordinates = route.shape?.coordinates,
                      coordinates.count >= 2,
                      coordinates.count <= 5_000,
                      coordinates.allSatisfy({
                          Self.isWgs84(latitude: $0.latitude, longitude: $0.longitude)
                      }) else {
                    call.reject("offline_route_result_incomplete")
                    return
                }
                let geometry = [originCoordinate]
                    + coordinates.dropFirst().dropLast()
                    + [destinationCoordinate]
                call.resolve([
                    "regionId": regionId,
                    "version": version,
                    "profile": profile,
                    "origin": origin,
                    "destination": destination,
                    "distanceMeters": route.distance,
                    "durationSeconds": route.expectedTravelTime,
                    "geometry": geometry.map {
                        ["latitude": $0.latitude, "longitude": $0.longitude]
                    },
                    "generatedAt": Self.canonicalTimestamp(),
                    "trafficAware": false
                ])
            } catch {
                call.reject("offline_route_failed")
            }
        }
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
            let required = progress.requiredResourceCount
            self?.notifyListeners("progress", data: [
                "regionId": id,
                "version": version,
                "completedResourceCount": progress.completedResourceCount,
                "completedResourceSize": progress.completedResourceSize,
                "requiredResourceCount": required,
                "progress": required > 0
                    ? min(1, Double(progress.completedResourceCount) / Double(required))
                    : 0
            ])
        } completion: { result in
            switch result {
            case .success(let region):
                UserDefaults.standard.set(version, forKey: "offline-mapbox.\(id)")
                let required = region.requiredResourceCount
                call.resolve([
                    "regionId": id,
                    "version": version,
                    "completedResourceCount": region.completedResourceCount,
                    "completedResourceSize": region.completedResourceSize,
                    "requiredResourceCount": required,
                    "progress": required > 0
                        ? min(1, Double(region.completedResourceCount) / Double(required))
                        : 0
                ])
            case .failure:
                call.reject("offline_region_download_failed")
            }
        }
    }

    private static func canonicalTimestamp() -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter.string(from: Date())
    }

    private static func isWgs84(latitude: Double, longitude: Double) -> Bool {
        latitude.isFinite && longitude.isFinite
            && latitude >= -90 && latitude <= 90
            && longitude >= -180 && longitude <= 180
    }

    private static func boundedLabel(_ value: String?) -> String {
        let trimmed = (value ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return "Next stop" }
        return String(trimmed.prefix(80))
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
        tileStore.allTileRegions { result in
            switch result {
            case .success(let regions):
                let packs = regions.compactMap { region -> [String: Any]? in
                    guard let version = UserDefaults.standard.string(
                        forKey: "offline-mapbox.\(region.id)"
                    ) else { return nil }
                    let required = region.requiredResourceCount
                    return [
                        "regionId": region.id,
                        "version": version,
                        "completedResourceCount": region.completedResourceCount,
                        "completedResourceSize": region.completedResourceSize,
                        "requiredResourceCount": required,
                        "progress": required > 0
                            ? min(1, Double(region.completedResourceCount) / Double(required))
                            : 0
                    ]
                }
                call.resolve(["packs": packs])
            case .failure:
                call.reject("offline_region_list_failed")
            }
        }
    }

    @objc func open(_ call: CAPPluginCall) {
        guard let id = call.getString("regionId"),
              UserDefaults.standard.object(forKey: "offline-mapbox.\(id)") != nil else {
            call.reject("offline_region_not_ready")
            return
        }
        let rawRouteGeometry = call.getArray("routeGeometry") ?? []
        guard rawRouteGeometry.count <= 5_000 else {
            call.reject("invalid_route_geometry")
            return
        }
        let routeGeometry = rawRouteGeometry.compactMap { item -> CLLocationCoordinate2D? in
            guard let point = item as? [String: Any],
                  let latitude = point["latitude"] as? Double,
                  let longitude = point["longitude"] as? Double else { return nil }
            guard Self.isWgs84(latitude: latitude, longitude: longitude) else { return nil }
            return CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
        }
        guard routeGeometry.count == rawRouteGeometry.count else {
            call.reject("invalid_route_geometry")
            return
        }
        let destinationLabel = Self.boundedLabel(call.getString("destinationLabel"))
        DispatchQueue.main.async { [weak self] in
            let controller = OfflineMapViewController(
                tileStore: self?.tileStore,
                routeGeometry: routeGeometry,
                destinationLabel: destinationLabel
            )
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
    private let routeGeometry: [CLLocationCoordinate2D]
    private let destinationLabel: String
    private let locationManager = CLLocationManager()
    private var routeAnnotationManager: PolylineAnnotationManager?
    init(
        tileStore: TileStore?,
        routeGeometry: [CLLocationCoordinate2D],
        destinationLabel: String
    ) {
        self.tileStore = tileStore
        self.routeGeometry = routeGeometry
        self.destinationLabel = destinationLabel
        super.init(nibName: nil, bundle: nil)
    }
    required init?(coder: NSCoder) { nil }

    override func viewDidLoad() {
        super.viewDidLoad()
        MapboxMapsOptions.tileStoreUsageMode = .readOnly
        MapboxMapsOptions.tileStore = tileStore
        let options = MapInitOptions(
            cameraOptions: CameraOptions(center: CLLocationCoordinate2D(latitude: -8.54, longitude: 115.19), zoom: 9),
            styleURI: .outdoors
        )
        let map = MapView(frame: view.bounds, mapInitOptions: options)
        map.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        map.location.options.puckType = .puck2D(.makeDefault(showBearing: true))
        map.location.options.puckBearing = .course
        map.location.options.puckBearingEnabled = true
        view.addSubview(map)
        if routeGeometry.count >= 2 {
            let manager = map.annotations.makePolylineAnnotationManager()
            var routeLine = PolylineAnnotation(lineCoordinates: routeGeometry)
            routeLine.lineColor = StyleColor(.systemTeal)
            routeLine.lineWidth = 5
            manager.annotations = [routeLine]
            routeAnnotationManager = manager
        }
        let nextStop = UILabel()
        nextStop.text = destinationLabel
        nextStop.textColor = .black
        nextStop.backgroundColor = .white
        nextStop.textAlignment = .center
        nextStop.layer.cornerRadius = 12
        nextStop.layer.masksToBounds = true
        nextStop.frame = CGRect(x: 100, y: 56, width: 220, height: 40)
        view.addSubview(nextStop)
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
