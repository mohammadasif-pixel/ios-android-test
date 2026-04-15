#import <Cordova/CDVPlugin.h>

@interface InstalledApps : CDVPlugin

- (void)getInstalledApps:(CDVInvokedUrlCommand*)command;
- (void)getAppInfo:(CDVInvokedUrlCommand*)command;

@end
