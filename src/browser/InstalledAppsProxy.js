var PAYMENT_APPS = [
    { appName: "PhonePe",              packageName: "com.phonepe.app",                        urlScheme: "phonepe",    icon: "https://cdn-icons-png.flaticon.com/512/825/825454.png" },
    { appName: "Google Pay",           packageName: "com.google.android.apps.nbu.paisa.user", urlScheme: "gpay",       icon: "https://cdn-icons-png.flaticon.com/512/6124/6124998.png" },
    { appName: "Paytm",                packageName: "net.one97.paytm",                        urlScheme: "paytm",      icon: "https://cdn-icons-png.flaticon.com/512/10046/10046638.png" },
    { appName: "BHIM",                 packageName: "in.org.npci.upiapp",                     urlScheme: "bhim",       icon: "https://cdn-icons-png.flaticon.com/512/732/732085.png" },
    { appName: "Amazon Pay",           packageName: "in.amazon.mShop.android.shopping",       urlScheme: "amazon",     icon: "https://cdn-icons-png.flaticon.com/512/5968/5968202.png" },
    { appName: "WhatsApp",             packageName: "com.whatsapp",                           urlScheme: "whatsapp",   icon: "https://cdn-icons-png.flaticon.com/512/3536/3536445.png" },
    { appName: "CRED",                 packageName: "com.dreamplug.androidapp",               urlScheme: "cred",       icon: "https://static.wikia.nocookie.net/logopedia/images/d/d7/CRED_Logo.png" },
    { appName: "MobiKwik",             packageName: "com.mobikwik_new",                       urlScheme: "mobikwik",   icon: "https://cdn-icons-png.flaticon.com/512/11104/11104192.png" },
    { appName: "Freecharge",           packageName: "com.freecharge.android",                 urlScheme: "freecharge", icon: "https://cdn-icons-png.flaticon.com/512/217/217853.png" },
    { appName: "Airtel Payments Bank", packageName: "com.myairtelapp",                        urlScheme: "airtel",     icon: "https://cdn-icons-png.flaticon.com/512/5969/5969032.png" },
    { appName: "JioPay",               packageName: "com.jio.jiopay",                         urlScheme: "jiopay",     icon: "https://cdn-icons-png.flaticon.com/512/732/732085.png" }
];

var browser = {
    getInstalledApps: function (success, error) {
        console.log("InstalledAppsProxy: browser mock (all apps = payment set)");
        setTimeout(function () { success(PAYMENT_APPS.slice()); }, 400);
    },

    getPaymentApps: function (success, error) {
        console.log("InstalledAppsProxy: browser mock (payment apps)");
        setTimeout(function () { success(PAYMENT_APPS.slice()); }, 400);
    },

    getAppInfo: function (success, error, args) {
        var packageName = args && args[0];
        var match = PAYMENT_APPS.filter(function (a) { return a.packageName === packageName || a.urlScheme === packageName; })[0];
        if (match) { success(match); } else { success({ appName: packageName, packageName: packageName, icon: "" }); }
    }
};

require("cordova/exec/proxy").add("InstalledApps", browser);
