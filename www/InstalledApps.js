var exec = require('cordova/exec');

var InstalledApps = {
    /**
     * Get list of all installed apps
     * @param {Function} successCallback - Success callback with apps array
     * @param {Function} errorCallback - Error callback
     */
    getInstalledApps: function (successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'InstalledApps', 'getInstalledApps', []);
    },

    /**
     * Get app info by bundle ID (iOS)
     * @param {String} bundleId - Bundle ID
     * @param {Function} successCallback - Success callback with app info
     * @param {Function} errorCallback - Error callback
     */
    getAppInfo: function (packageName, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'InstalledApps', 'getAppInfo', [packageName]);
    },

    /**
     * Get list of installed payment apps only (UPI / wallets).
     * Works on iOS.
     * @param {Function} successCallback - Success callback with payment apps array
     * @param {Function} errorCallback - Error callback
     */
    getPaymentApps: function (successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'InstalledApps', 'getPaymentApps', []);
    }
};

module.exports = InstalledApps;
