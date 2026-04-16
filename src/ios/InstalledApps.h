#import <Cordova/CDVPlugin.h>

@interface InstalledApps : CDVPlugin

- (void)getInstalledApps:(CDVInvokedUrlCommand*)command;
- (void)getAppInfo:(CDVInvokedUrlCommand*)command;
- (void)getPaymentApps:(CDVInvokedUrlCommand*)command;

@end
