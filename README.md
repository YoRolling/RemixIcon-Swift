# RemixIcon For Swift

![License](https://img.shields.io/badge/license-MIT-green)

`RemixIcon-swift` is a Swift package that extends the usage of [RemixIcon](https://remixicon.com/) icons for your iOS, macOS, and SwiftUI projects. 

> Remix Icon is a set of open-source neutral-style system symbols for designers and developers. Unlike a patchwork icon library, 2800+ icons are all elaborately crafted so that they are born with the genes of readability, consistency, and perfect pixels. Each icon was designed in "Outlined" and "Filled" styles based on a 24x24 grid. Of course, all the icons are free for both personal and commercial use.  
> 

## Features

- Easily use RemixIcon icons as `UIImage` and `Image` objects in your UIKit and SwiftUI projects
- Access to all 1000+ icons from the RemixIcon library
- Easy integration with your existing iOS or macOS projects
- MIT licensed, open-source, and free to use

## Requirements

- iOS 13+
- macOS 10.15+
- Swift 5+

## Installation

To add `RemixIcon-swift` to your Xcode project, follow these steps:

1. In Xcode, open your project and navigate to _File_ > _Swift Packages_ > _Add Package Dependency..._
2. Enter the repository URL: `https://github.com/YoRolling/RemixIcon-Swift.git`
3. Choose the branch or version you want to add, and click _Next_.
4. Select the target where you want to use the package, then click _Finish_.

## Usage

### UIKit

```swift
import UIKit
import RemixIcon

let imageView = UIImageView(image: RemixIcon.home.asUIImage)
```

### SwiftUI

```swift
import SwiftUI
import RemixIcon

struct ContentView: View {
    var body: some View {
        RemixIcon.home.asImage
            .foregroundColor(.blue)
    }
}
```

## Original RemixIcon Project

RemixIcon-swift is built on top of the original [RemixIcon](https://remixicon.com/) project. You can access the full library of icons, as well as additional packages and usage instructions, at the [RemixIcon GitHub repository](https://github.com/Remix-Design/RemixIcon#readme).

## License

RemixIcon-swift is released under the [MIT License](https://opensource.org/license/mit/).

## Thanks

Thanks to the [RemixIcon](https://remixicon.com/) team for creating such a great icon library!  
Thanks to the [iconoir-swift](https://github.com/iconoir-icons/iconoir-swift) project for providing the inspiration to create this package.
