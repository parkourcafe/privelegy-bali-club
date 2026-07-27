// swift-tools-version: 5.9
import PackageDescription
let package = Package(
    name: "OtherBaliOfflineMapbox",
    platforms: [.iOS(.v15)],
    products: [.library(name: "OtherBaliOfflineMapbox", targets: ["OfflineMapboxPlugin"])],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        .package(url: "https://github.com/mapbox/mapbox-navigation-ios.git", exact: "3.26.0")
    ],
    targets: [
        .target(
            name: "OfflineMapboxPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "MapboxNavigationCore", package: "mapbox-navigation-ios")
            ],
            path: "ios/Sources/OfflineMapboxPlugin"
        )
    ]
)
