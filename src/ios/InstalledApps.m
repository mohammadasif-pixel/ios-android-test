#import "InstalledApps.h"
#import <UIKit/UIKit.h>

@implementation InstalledApps

// Canonical payment-app catalog shared across platforms.
// { name, iosScheme, androidPackage, icon }
+ (NSArray<NSDictionary *> *)paymentAppCatalog
{
    return @[
        @{ @"name": @"PhonePe",                 @"iosScheme": @"phonepe",        @"androidPackage": @"com.phonepe.app",                        @"icon": @"https://cdn-icons-png.flaticon.com/512/825/825454.png" },
        @{ @"name": @"Google Pay",              @"iosScheme": @"gpay",           @"androidPackage": @"com.google.android.apps.nbu.paisa.user", @"icon": @"https://cdn-icons-png.flaticon.com/512/6124/6124998.png" },
        @{ @"name": @"Paytm",                   @"iosScheme": @"paytm",          @"androidPackage": @"net.one97.paytm",                        @"icon": @"https://cdn-icons-png.flaticon.com/512/10046/10046638.png" },
        @{ @"name": @"BHIM",                    @"iosScheme": @"bhim",           @"androidPackage": @"in.org.npci.upiapp",                     @"icon": @"https://cdn-icons-png.flaticon.com/512/732/732085.png" },
        @{ @"name": @"Amazon Pay",              @"iosScheme": @"amazon",         @"androidPackage": @"in.amazon.mShop.android.shopping",       @"icon": @"https://cdn-icons-png.flaticon.com/512/5968/5968202.png" },
        @{ @"name": @"WhatsApp",                @"iosScheme": @"whatsapp",       @"androidPackage": @"com.whatsapp",                           @"icon": @"https://cdn-icons-png.flaticon.com/512/3536/3536445.png" },
        @{ @"name": @"CRED",                    @"iosScheme": @"cred",           @"androidPackage": @"com.dreamplug.androidapp",               @"icon": @"https://static.wikia.nocookie.net/logopedia/images/d/d7/CRED_Logo.png" },
        @{ @"name": @"MobiKwik",                @"iosScheme": @"mobikwik",       @"androidPackage": @"com.mobikwik_new",                       @"icon": @"https://cdn-icons-png.flaticon.com/512/11104/11104192.png" },
        @{ @"name": @"Freecharge",              @"iosScheme": @"freecharge",     @"androidPackage": @"com.freecharge.android",                 @"icon": @"https://cdn-icons-png.flaticon.com/512/217/217853.png" },
        @{ @"name": @"Airtel Payments Bank",    @"iosScheme": @"airtel",         @"androidPackage": @"com.myairtelapp",                        @"icon": @"https://cdn-icons-png.flaticon.com/512/5969/5969032.png" },
        @{ @"name": @"JioPay",                  @"iosScheme": @"jiopay",         @"androidPackage": @"com.jio.jiopay",                         @"icon": @"https://cdn-icons-png.flaticon.com/512/732/732085.png" }
    ];
}

- (void)getInstalledApps:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        NSMutableArray *appList = [NSMutableArray array];
        UIApplication *app = [UIApplication sharedApplication];

        NSArray *schemes = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"LSApplicationQueriesSchemes"];
        if (schemes == nil) {
            schemes = @[];
        }

        for (NSString *scheme in schemes) {
            if (![scheme isKindOfClass:[NSString class]]) continue;
            if (scheme.length == 0) continue;

            NSString *normalized = [scheme stringByAppendingString:@"://"];
            NSURL *url = [NSURL URLWithString:normalized];

            if (url != nil && [app canOpenURL:url]) {
                [appList addObject:@{
                    @"appName":      [scheme capitalizedString],
                    @"bundleId":     @"",
                    @"urlScheme":    scheme,
                    @"isSystemApp":  @(NO),
                    @"icon":         @""
                }];
            }
        }

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:appList];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)getPaymentApps:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        NSMutableArray *appList = [NSMutableArray array];
        UIApplication *app = [UIApplication sharedApplication];

        for (NSDictionary *entry in [InstalledApps paymentAppCatalog]) {
            NSString *scheme = entry[@"iosScheme"];
            if (scheme.length == 0) continue;

            NSURL *url = [NSURL URLWithString:[scheme stringByAppendingString:@"://"]];
            if (url != nil && [app canOpenURL:url]) {
                [appList addObject:@{
                    @"appName":     entry[@"name"] ?: scheme,
                    @"packageName": entry[@"androidPackage"] ?: @"",
                    @"urlScheme":   scheme,
                    @"isSystemApp": @(NO),
                    @"icon":        entry[@"icon"] ?: @""
                }];
            }
        }

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:appList];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)getAppInfo:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        NSString* bundleId = nil;
        if (command.arguments.count > 0 && [command.arguments[0] isKindOfClass:[NSString class]]) {
            bundleId = command.arguments[0];
        }

        NSString *myBundleId = [[NSBundle mainBundle] bundleIdentifier];
        if ([myBundleId isEqualToString:bundleId]) {
            NSString *appName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"] ?: [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleName"];
            NSString *version = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
            NSString *build = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"];

            NSDictionary *appInfo = @{
                @"appName": appName ?: @"Unknown",
                @"bundleId": myBundleId ?: @"",
                @"versionName": version ?: @"",
                @"versionCode": build ?: @"",
                @"isSystemApp": @(NO),
                @"icon": @""
            };
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:appInfo];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        } else {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Cannot get info for other apps on iOS due to privacy restrictions."];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
    }];
}

@end
