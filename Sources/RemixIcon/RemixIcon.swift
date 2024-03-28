// Created by: YoRolling
// License: MIT
// Version: 4.2.0
#if canImport(UIKit)
    import UIKit

    public extension RemixIcon {
        /// Returns a UIImage of the RemixIcon icon.
        var asUIImage: UIImage? {
            return UIImage(named: rawValue, in: Bundle.module, compatibleWith: nil)
        }

        /// Returns an image, from the RemixIcon bundle, if there is a matching key, otheriwse nil.
        /// - Parameter string: key that matches RemixIcon icon.
        /// - Returns: UIKit UIImage
        static func uiImage(from string: String) -> UIImage? {
            return UIImage(named: string, in: Bundle.module, compatibleWith: nil)
        }
    }
#endif

#if canImport(SwiftUI)
    import SwiftUI

    @available(iOS 13, macOS 10.15, *)
    public extension RemixIcon {
        /// Returns a SwiftUI Image of the RemixIcon icon.
        var asImage: Image {
            return Image(rawValue, bundle: Bundle.module)
                .renderingMode(.template)
        }

        /// Returns an image, from the RemixIcon bundle, if there is a matching key.
        /// - Parameter string: key that matches RemixIcon icon.
        /// - Returns: SwiftUI Image
        static func image(from string: String) -> Image {
            return Image(string, bundle: Bundle.module)
                .renderingMode(.template)
        }
    }
#endif
