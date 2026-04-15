package com.plugin.installedapps;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class InstalledApps extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getInstalledApps")) {
            this.getInstalledApps(callbackContext);
            return true;
        } else if (action.equals("getAppInfo")) {
            String packageName = args.getString(0);
            this.getAppInfo(packageName, callbackContext);
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
                        // Exclude system apps if desired, but here we include all visible apps
                        JSONObject appInfo = new JSONObject();
                        appInfo.put("appName", pm.getApplicationLabel(app).toString());
                        appInfo.put("packageName", app.packageName);
                        appInfo.put("versionName", ""); // PackageManager can provide this via getPackageInfo
                        appInfo.put("versionCode", 0);
                        appInfo.put("isSystemApp", (app.flags & ApplicationInfo.FLAG_SYSTEM) != 0);
                        
                        // Get Icon as Base64
                        Drawable icon = pm.getApplicationIcon(app);
                        appInfo.put("icon", drawableToSql(icon));

                        appList.put(appInfo);
                    }

                    callbackContext.success(appList);
                } catch (Exception e) {
                    callbackContext.error("Error retrieving apps: " + e.getMessage());
                }
            }
        });
    }

    private void getAppInfo(String packageName, CallbackContext callbackContext) {
        try {
            PackageManager pm = cordova.getActivity().getPackageManager();
            ApplicationInfo app = pm.getApplicationInfo(packageName, 0);
            
            JSONObject appInfo = new JSONObject();
            appInfo.put("appName", pm.getApplicationLabel(app).toString());
            appInfo.put("packageName", app.packageName);
            appInfo.put("isSystemApp", (app.flags & ApplicationInfo.FLAG_SYSTEM) != 0);
            appInfo.put("icon", drawableToSql(pm.getApplicationIcon(app)));

            callbackContext.success(appInfo);
        } catch (Exception e) {
            callbackContext.error("App not found: " + e.getMessage());
        }
    }

    private String drawableToSql(Drawable drawable) {
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
