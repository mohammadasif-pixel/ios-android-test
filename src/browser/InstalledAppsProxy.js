var browser = {
    getInstalledApps: function (success, error) {
        console.log("InstalledAppsProxy: Simulating list for browser...");
        setTimeout(function() {
            success([
                { appName: "PhonePe", urlScheme: "phonepe", icon: "https://cdn-icons-png.flaticon.com/512/825/825454.png" },
                { appName: "Google Pay", urlScheme: "gpay", icon: "https://cdn-icons-png.flaticon.com/512/6124/6124998.png" },
                { appName: "Paytm", urlScheme: "paytm", icon: "https://cdn-icons-png.flaticon.com/512/10046/10046638.png" },
                { appName: "WhatsApp", urlScheme: "whatsapp", icon: "https://cdn-icons-png.flaticon.com/512/3536/3536445.png" },
                { appName: "Amazon", urlScheme: "amazon", icon: "https://cdn-icons-png.flaticon.com/512/5968/5968202.png" },
                { appName: "CRED", urlScheme: "cred", icon: "https://static.wikia.nocookie.net/logopedia/images/d/d7/CRED_Logo.png" },
                { appName: "Airtel", urlScheme: "airtel", icon: "https://cdn-icons-png.flaticon.com/512/5969/5969032.png" },
                { appName: "MobiKwik", urlScheme: "mobikwik", icon: "https://cdn-icons-png.flaticon.com/512/11104/11104192.png" }
            ]);
        }, 800);
    },

    getAppInfo: function (success, error, args) {
        var packageName = args[0];
        success({
            appName: packageName,
            packageName: packageName,
            icon: ""
        });
    }
};

require("cordova/exec/proxy").add("InstalledApps", browser);
