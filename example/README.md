# Applist Demo (iOS)

A minimal Cordova app that exercises the `cordova-plugin-applist2` iOS port. It probes a list of common URL schemes via `canOpenURL:` and renders which ones are installed.

This folder is the **app**. The plugin itself lives one directory up (`../`) and is referenced from [config.xml](config.xml) via `<plugin name="cordova-plugin-applist2" spec="../" />`.

> **iOS builds require macOS + Xcode.** They cannot be produced on Windows or Linux. Everything below assumes you are sitting at a Mac.

## Prerequisites (Mac side, one time)

1. macOS with Xcode installed from the Mac App Store.
2. Open Xcode once and accept the license: `sudo xcodebuild -license accept`.
3. Node.js 18+ and Cordova: `npm install -g cordova`.
4. CocoaPods: `sudo gem install cocoapods` (or `brew install cocoapods`).
5. An Apple ID signed into Xcode under *Settings -> Accounts*. The free tier is enough for a 7-day on-device build.

## Run on a connected iPhone

From this `example/` directory on the Mac:

```bash
cordova platform add ios
cordova prepare ios
cordova run ios --device
```

First run will fail at the signing step. To fix it:

1. Open `platforms/ios/ApplistDemo.xcworkspace` in Xcode.
2. Select the **ApplistDemo** target -> *Signing & Capabilities*.
3. Tick *Automatically manage signing* and pick your Apple ID team.
4. Plug the iPhone in, trust the computer, then hit Run in Xcode.
5. On the iPhone: *Settings -> General -> VPN & Device Management* -> trust the developer profile.

After the first manual signing, `cordova run ios --device` works directly from the terminal.

## Using the app

Tap **Check installed apps**. The list shows each declared URL scheme with an *Installed* / *Not found* badge.

To probe additional apps:

1. Add the scheme to the `SCHEMES` array in [www/js/index.js](www/js/index.js).
2. Add the same scheme to `LSApplicationQueriesSchemes` in [config.xml](config.xml).
3. Re-run `cordova prepare ios && cordova run ios --device`.

Both lists must agree, otherwise iOS silently returns `installed: false`.

## Why some "obvious" apps return Not found

- The scheme isn't declared in `LSApplicationQueriesSchemes` (the most common cause).
- The app uses a different scheme than you guessed -- search the vendor's docs or [appurlschemes.com](https://appurlschemes.com).
- iOS limits `LSApplicationQueriesSchemes` to **50 entries** per app.

## Limitation vs the Android version

The Android plugin enumerates *every* installed app and caches its icon. iOS deliberately blocks app enumeration, so this port can only answer "is *this specific* app installed?" for schemes you already know about. The Android `createEvent` API is preserved on iOS as a no-op (returns `[]`) so existing code does not break.
