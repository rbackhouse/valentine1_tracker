/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Richard Backhouse
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
#import <Cordova/CDV.h>
#import "BTDiscovery.h"
#import "DisplayAndAudio.h"
#import "DeviceInformation.h"

@interface Valentine1Plugin : CDVPlugin<V1ComProtocol,
BTDiscoveryDelegate,
BTDeviceNotFoundProtocol,
InfoDisplayProtocol,
AlertOutProtocol,
DeviceInformationProtocol,
MiscellaneousPacketProtocol,
//CustomSweepProtocol,
UserSetupOptionsProtocol>

- (void)connect:(CDVInvokedUrlCommand*)command;
- (void)disconnect:(CDVInvokedUrlCommand*)command;
- (void)getVersion:(CDVInvokedUrlCommand*)command;
- (void)getSerialNum:(CDVInvokedUrlCommand*)command;
- (void)startAlerts:(CDVInvokedUrlCommand*)command;
- (void)stopAlerts:(CDVInvokedUrlCommand*)command;
- (void)startDisplay:(CDVInvokedUrlCommand*)command;
- (void)stopDisplay:(CDVInvokedUrlCommand*)command;
- (void)getOptions:(CDVInvokedUrlCommand*)command;
- (void)setOptions:(CDVInvokedUrlCommand*)command;
- (void)startInfoListener:(CDVInvokedUrlCommand*)command;
- (void)stopInfoListener:(CDVInvokedUrlCommand*)command;
- (void)mute:(CDVInvokedUrlCommand*)command;
- (void)unmute:(CDVInvokedUrlCommand*)command;

@property (strong, nonatomic) CDVInvokedUrlCommand* latestCommand;
@property (strong, nonatomic) CDVInvokedUrlCommand* alertCommand;
@property (strong, nonatomic) CDVInvokedUrlCommand* displayCommand;
@property (strong, nonatomic) CDVInvokedUrlCommand* connectionCommand;
@property (strong, nonatomic) CDVInvokedUrlCommand* infoListenerCommand;
@property bool alertsInitialized;

@end