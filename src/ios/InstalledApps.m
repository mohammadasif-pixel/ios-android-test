#import "InstalledApps.h"
#import <UIKit/UIKit.h>

@implementation InstalledApps

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
            // Cannot get info for other apps on iOS
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Cannot get info for other apps on iOS due to privacy restrictions."];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
    }];
}

@end
