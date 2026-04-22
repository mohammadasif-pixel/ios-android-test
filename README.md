# cordova-plugin-installed-apps (iOS Only)

Cordova plugin to detect installed payment / UPI wallet apps on iOS.

Uses `UIApplication.canOpenURL:` with `LSApplicationQueriesSchemes` to check which payment apps are installed on the device.

---

## Supported Payment Apps

| App | URL Scheme |
|-----|-----------|
| PhonePe | `phonepe` |
| Google Pay | `gpay` |
| Paytm | `paytm` |
| BHIM | `bhim` |
| Amazon Pay | `amazon` |
| WhatsApp | `whatsapp` |
| CRED | `cred` |
| MobiKwik | `mobikwik` |
| Freecharge | `freecharge` |
| Airtel Payments Bank | `airtel` |
| JioPay | `jiopay` |

---

## Installation

```bash
cordova plugin add https://github.com/<your-org>/cordova-plugin-installed-apps.git
```

Or from local path:

```bash
cordova plugin add ./path-to-plugin
```

---

## API

### `getPaymentApps(success, error)`

Returns installed payment/UPI apps from the built-in catalog.

```js
cordova.plugins.installedApps.getPaymentApps(
    function (apps) {
        console.log(apps);
    },
    function (err) {
        console.error(err);
    }
);
```

**Response:**

```json
[
    {
        "appName": "PhonePe",
        "packageName": "com.phonepe.app",
        "urlScheme": "phonepe",
        "isSystemApp": false,
        "icon": "https://cdn-icons-png.flaticon.com/512/825/825454.png"
    }
]
```

### `getInstalledApps(success, error)`

Returns all apps whose URL scheme is declared in `LSApplicationQueriesSchemes`.

```js
cordova.plugins.installedApps.getInstalledApps(
    function (apps) { console.log(apps); },
    function (err) { console.error(err); }
);
```

### `getAppInfo(bundleId, success, error)`

Returns info for a single app. On iOS, limited to own app's bundle ID due to privacy restrictions.

```js
cordova.plugins.installedApps.getAppInfo("com.example.myapp",
    function (info) { console.log(info); },
    function (err) { console.error(err); }
);
```

---

## OutSystems 11 Integration

Full step-by-step guide: **[outsystems-guide.html](outsystems-guide.html)**

### Quick Setup

**1. Extensibility Configuration** (Service Studio > module > Extensibility Configurations):

```json
{
    "plugin": {
        "url": "https://github.com/<your-org>/cordova-plugin-installed-apps.git",
        "name": "cordova-plugin-installed-apps"
    },
    "preferences": {
        "global": [
            { "name": "mabs-version", "value": "10.0" }
        ]
    }
}
```

**2. Create Structure** `PaymentApp` with attributes:

| Attribute | Type |
|-----------|------|
| AppName | Text |
| UrlScheme | Text |
| PackageName | Text |
| IsSystemApp | Boolean |
| Icon | Text |

**3. Create Client Action** `GetPaymentApps` with JavaScript node:

```js
var done = $resolve;

if (!window.cordova || !cordova.plugins || !cordova.plugins.installedApps) {
    $parameters.AppsJson = "[]";
    $parameters.ErrorMsg = "Plugin not available — run on a real device.";
    return done();
}

cordova.plugins.installedApps.getPaymentApps(
    function (apps) {
        $parameters.AppsJson = JSON.stringify(apps || []);
        $parameters.ErrorMsg = "";
        done();
    },
    function (err) {
        $parameters.AppsJson = "[]";
        $parameters.ErrorMsg = String(err || "unknown error");
        done();
    }
);
```

**4. Wire** JSONDeserialize (Data Type = `PaymentApp List`) > Assign output.

**5. Upload** iOS certificates (.p12 + .mobileprovision) in LifeTime > Generate iOS build.

---

## Plugin Structure

```
plugin.xml
package.json
www/
  InstalledApps.js          # JS bridge (3 methods)
src/
  ios/
    InstalledApps.h          # Objective-C header
    InstalledApps.m          # Native implementation
```

---

## iOS Notes

- **Real device required** — Simulator cannot install third-party apps, `canOpenURL:` always returns false
- **Apple caps `LSApplicationQueriesSchemes` at 50 entries** — this plugin uses 14
- **`canOpenURL:` is NOT a tracked API** under Apple's privacy-manifest requirements (iOS 17+)
- **No special entitlements needed** — standard distribution/ad-hoc profiles work
- **Requires MABS 10+** for async `$resolve` pattern in OutSystems (MABS 9 fallback documented in full guide)

---

## License

MIT

---

**Magenta Mobility**
