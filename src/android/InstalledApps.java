package com.plugin.installedapps;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class InstalledApps extends CordovaPlugin {

    // { displayName, androidPackage, iosScheme, fallbackIcon }
    private static final String[][] PAYMENT_APPS = new String[][] {
        { "PhonePe",              "com.phonepe.app",                        "phonepe",    "https://cdn-icons-png.flaticon.com/512/825/825454.png" },
        { "Google Pay",           "com.google.android.apps.nbu.paisa.user", "gpay",       "https://cdn-icons-png.flaticon.com/512/6124/6124998.png" },
        { "Paytm",                "net.one97.paytm",                        "paytm",      "https://cdn-icons-png.flaticon.com/512/10046/10046638.png" },
        { "BHIM",                 "in.org.npci.upiapp",                     "bhim",       "https://cdn-icons-png.flaticon.com/512/732/732085.png" },
        { "Amazon Pay",           "in.amazon.mShop.android.shopping",       "amazon",     "https://cdn-icons-png.flaticon.com/512/5968/5968202.png" },
        { "WhatsApp",             "com.whatsapp",                           "whatsapp",   "https://cdn-icons-png.flaticon.com/512/3536/3536445.png" },
        { "CRED",                 "com.dreamplug.androidapp",               "cred",       "https://static.wikia.nocookie.net/logopedia/images/d/d7/CRED_Logo.png" },
        { "MobiKwik",             "com.mobikwik_new",                       "mobikwik",   "https://cdn-icons-png.flaticon.com/512/11104/11104192.png" },
        { "Freecharge",           "com.freecharge.android",                 "freecharge", "https://cdn-icons-png.flaticon.com/512/217/217853.png" },
        { "Airtel Payments Bank", "com.myairtelapp",                        "airtel",     "https://cdn-icons-png.flaticon.com/512/5969/5969032.png" },
        { "JioPay",               "com.jio.jiopay",                         "jiopay",     "https://cdn-icons-png.flaticon.com/512/732/732085.png" }
    };

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getInstalledApps")) {
            this.getInstalledApps(callbackContext);
            return true;
        } else if (action.equals("getAppInfo")) {
            String packageName = args.getString(0);
            this.getAppInfo(packageName, callbackContext);
            return true;
        } else if (action.equals("getPaymentApps")) {
            this.getPaymentApps(callbackContext);
            return true;
        }
        return false;
    }

    private void getInstalledApps(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    PackageManager pm = cordova.getActivity().getPackageManager();
                    List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);
                    JSONArray appList = new JSONArray();

                    for (ApplicationInfo app : apps) {
                        JSONObject appInfo = new JSONObject();
                        appInfo.put("appName", pm.getApplicationLabel(app).toString());
                        appInfo.put("packageName", app.packageName);
                        appInfo.put("versionName", "");
                        appInfo.put("versionCode", 0);
                        appInfo.put("isSystemApp", (app.flags & ApplicationInfo.FLAG_SYSTEM) != 0);

                        Drawable icon = pm.getApplicationIcon(app);
                        appInfo.put("icon", drawableToBase64(icon));

                        appList.put(appInfo);
                    }

                    callbackContext.success(appList);
                } catch (Exception e) {
                    callbackContext.error("Error retrieving apps: " + e.getMessage());
                }
            }
        });
    }

    private void getPaymentApps(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    PackageManager pm = cordova.getActivity().getPackageManager();
                    JSONArray appList = new JSONArray();

                    for (String[] entry : PAYMENT_APPS) {
                        String displayName = entry[0];
                        String pkg = entry[1];
                        String scheme = entry[2];
                        String fallbackIcon = entry[3];

                        if (!isPackageInstalled(pm, pkg)) continue;

                        JSONObject appInfo = new JSONObject();
                        String resolvedLabel = displayName;
                        String iconData = fallbackIcon;
                        try {
                            ApplicationInfo ai = pm.getApplicationInfo(pkg, 0);
                            CharSequence label = pm.getApplicationLabel(ai);
                            if (label != null && label.length() > 0) {
                                resolvedLabel = label.toString();
                            }
                            Drawable d = pm.getApplicationIcon(ai);
                            String b64 = drawableToBase64(d);
                            if (b64 != null && b64.length() > 0) {
                                iconData = b64;
                            }
                        } catch (Exception ignore) {
                            // Keep catalog defaults.
                        }

                        appInfo.put("appName", resolvedLabel);
                        appInfo.put("packageName", pkg);
                        appInfo.put("urlScheme", scheme);
                        appInfo.put("isSystemApp", false);
                        appInfo.put("icon", iconData);
                        appList.put(appInfo);
                    }

                    callbackContext.success(appList);
                } catch (Exception e) {
                    callbackContext.error("Error retrieving payment apps: " + e.getMessage());
                }
            }
        });
    }

    private boolean isPackageInstalled(PackageManager pm, String pkg) {
        try {
            pm.getPackageInfo(pkg, 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    private void getAppInfo(String packageName, CallbackContext callbackContext) {
        try {
            PackageManager pm = cordova.getActivity().getPackageManager();
            ApplicationInfo app = pm.getApplicationInfo(packageName, 0);

            JSONObject appInfo = new JSONObject();
            appInfo.put("appName", pm.getApplicationLabel(app).toString());
            appInfo.put("packageName", app.packageName);
            appInfo.put("isSystemApp", (app.flags & ApplicationInfo.FLAG_SYSTEM) != 0);
            appInfo.put("icon", drawableToBase64(pm.getApplicationIcon(app)));

            callbackContext.success(appInfo);
        } catch (Exception e) {
            callbackContext.error("App not found: " + e.getMessage());
        }
    }

    private String drawableToBase64(Drawable drawable) {
        if (drawable == null) return "";
        Bitmap bitmap;

        if (drawable instanceof BitmapDrawable) {
            BitmapDrawable bitmapDrawable = (BitmapDrawable) drawable;
            if (bitmapDrawable.getBitmap() != null) {
                bitmap = bitmapDrawable.getBitmap();
            } else {
                bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);
            }
        } else {
            if (drawable.getIntrinsicWidth() <= 0 || drawable.getIntrinsicHeight() <= 0) {
                bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);
            } else {
                bitmap = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
            }
            Canvas canvas = new Canvas(bitmap);
            drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
            drawable.draw(canvas);
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return "data:image/png;base64," + Base64.encodeToString(byteArray, Base64.NO_WRAP);
    }
}
