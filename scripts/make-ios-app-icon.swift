import CoreGraphics
import Foundation
import ImageIO

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
    fputs("Usage: swift scripts/make-ios-app-icon.swift <source.png> <output.png>\n", stderr)
    exit(64)
}

let sourceURL = URL(fileURLWithPath: arguments[1]) as CFURL
let outputURL = URL(fileURLWithPath: arguments[2]) as CFURL

guard
    let sourceContainer = CGImageSourceCreateWithURL(sourceURL, nil),
    let source = CGImageSourceCreateImageAtIndex(sourceContainer, 0, nil)
else {
    fputs("Could not read the source icon.\n", stderr)
    exit(1)
}

let width = source.width
let height = source.height
let bytesPerRow = width * 4
let colorSpace = CGColorSpaceCreateDeviceRGB()
let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.noneSkipLast.rawValue)

guard let context = CGContext(
    data: nil,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: bytesPerRow,
    space: colorSpace,
    bitmapInfo: bitmapInfo.rawValue
) else {
    fputs("Could not create the RGB icon canvas.\n", stderr)
    exit(1)
}

// Match the existing icon artwork so its rounded transparent edge disappears
// into a full-square canvas. Apple applies the final platform mask itself.
context.setFillColor(red: 14 / 255, green: 116 / 255, blue: 144 / 255, alpha: 1)
context.fill(CGRect(x: 0, y: 0, width: width, height: height))
context.draw(source, in: CGRect(x: 0, y: 0, width: width, height: height))

guard
    let flattened = context.makeImage(),
    let destination = CGImageDestinationCreateWithURL(outputURL, "public.png" as CFString, 1, nil)
else {
    fputs("Could not create the output icon.\n", stderr)
    exit(1)
}

CGImageDestinationAddImage(destination, flattened, nil)
guard CGImageDestinationFinalize(destination) else {
    fputs("Could not write the output icon.\n", stderr)
    exit(1)
}
