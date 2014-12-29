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
#import "Valentine1Plugin.h"
#import "SendRequest.h"

@implementation Valentine1Plugin

- (void)pluginInitialize {
    [[BTDiscovery sharedInstance] setV1ComDelegate:self];
    [[BTDiscovery sharedInstance] setDiscoveryDelegate:self];
    [[BTDiscovery sharedInstance] setNotFoundDelegate:self];
    [[PacketAction sharedInstance] setDeviceInformationDelegate:self];
    [[PacketAction sharedInstance] setInfoDisplayDelegate:self];
    [[PacketAction sharedInstance] setAlertOutDelegate:self];
    [[PacketAction sharedInstance] setUserSetupOptionsDelegate:self];
    //[[PacketAction sharedInstance] setCustomSweepDelegate:self];
    [[PacketAction sharedInstance] setMiscellaneousPacketDelegate:self];
}

- (void)connect:(CDVInvokedUrlCommand*)command {
    self.connectionCommand = command;
    CBPeripheral *per = [[BTDiscovery sharedInstance] getConnectedV1Device];
    if ( per == nil ){
        self.alertsInitialized = false;
        [[BTDiscovery sharedInstance] startScanningForUUIDString:kV1ConnectionLEServiceUUIDString];
    } else {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"connected"];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.connectionCommand.callbackId];
    }
}

- (void)disconnect:(CDVInvokedUrlCommand*)command {
    self.connectionCommand = command;

    CBPeripheral *per = [[BTDiscovery sharedInstance] getConnectedV1Device];
    if ( per != nil ){
        [[BTDiscovery sharedInstance] disconnectPeripheral:per];
    }
}

- (void)getVersion:(CDVInvokedUrlCommand*)command {
    self.latestCommand = command;
    [[SendRequest new] reqVersion:[[BTDiscovery sharedInstance] getConnectedService].destination];
}

- (void)getSerialNum:(CDVInvokedUrlCommand*)command {
    self.latestCommand = command;
    [[SendRequest new] reqSerial:[[BTDiscovery sharedInstance] getConnectedService].destination];
}

- (void)startAlerts:(CDVInvokedUrlCommand*)command {
    self.alertCommand = command;
    [[SendRequest new] reqStartAlertData];
}

- (void)stopAlerts:(CDVInvokedUrlCommand*)command {
    [[SendRequest new] reqStopAlertData];
    self.alertCommand = nil;
}

- (void)startDisplay:(CDVInvokedUrlCommand*)command {
    self.displayCommand = command;
}

- (void)stopDisplay:(CDVInvokedUrlCommand*)command {
    self.displayCommand = nil;
}

- (void)getOptions:(CDVInvokedUrlCommand*)command {
    self.latestCommand = command;
    [[SendRequest new] reqUserBytes];
}

- (void)setOptions:(CDVInvokedUrlCommand*)command {
    NSString* jsonStr = [command.arguments objectAtIndex:0];
    NSError *e;
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData: [jsonStr dataUsingEncoding:NSUTF8StringEncoding]
                                    options: NSJSONReadingMutableContainers
                                    error: &e];
    UserBytes *userBytes = [UserBytes alloc];
    
    [userBytes SetXbandOn:[json valueForKey:@"XbandOn"]];
    [userBytes SetKbandOn:[json valueForKey:@"KbandOn" ]];
    [userBytes SetKAbandOn:[json valueForKey:@"KAbandOn"]];
    [userBytes SetKUBandOn:[json valueForKey:@"KUBandOn"]];
    [userBytes SetLaserOn:[json valueForKey:@"LaserOn"]];
    [userBytes SetBargraphNormalResponsive:[json valueForKey:@"BargraphNormalResponsive"]];
    [userBytes SetKAFalseGuardOn:[json valueForKey:@"KAFalseGuardOn"]];
    [userBytes SetKMutingOn:[json valueForKey:@"KMutingOn"]];
    [userBytes SetMuteVolumeLeverZero:[json valueForKey:@"MuteVolumeLeverZero"]];
    [userBytes SetPostMuteBogeyLockVolumeKnobLever:[json valueForKey:@"PostMuteBogeyLockVolumeLeverKnob"]];
    [userBytes SetKMuteTimer:[[json valueForKey:@"KMuteTimer"] intValue]];
    [userBytes SetKInitialUnmute4Lights:[json valueForKey:@"KInitialUnmute4Lights"]];
    [userBytes SetKPersistantUnmute6Lights:[json valueForKey:@"KPersistantUnmute6Lights"]];
    [userBytes SetKRearMuteOn:[json valueForKey:@"KRearMuteOn"]];
    [userBytes SetPopOn:[json valueForKey:@"PopOn"]];
    [userBytes SetEuroOn:[json valueForKey:@"EuroOn"]];
    [userBytes SetEuroXBandOn:[json valueForKey:@"EuroXBandOn"]];
    [userBytes SetFilterOn:[json valueForKey:@"FilterOn"]];
    [userBytes SetForceLegacyCD:[json valueForKey:@"ForceLegacyCD"]];
     
    [[SendRequest new] reqWriteUserBytes:userBytes];
}

-(void)startInfoListener:(CDVInvokedUrlCommand*)command {
    self.infoListenerCommand = command;
}

-(void)stopInfoListener:(CDVInvokedUrlCommand*)command {
    self.infoListenerCommand = nil;
}

- (void) discoveryConnected:(CBPeripheral *)per {
    NSString* state;
    switch ([per state]) {
        case CBPeripheralStateDisconnected:
            state = @"disconnected";
            break;
        case CBPeripheralStateConnected:
            state = @"connected";
            break;
        case CBPeripheralStateConnecting:
            state = @"connecting";
            break;
    }

    NSDictionary *jsonObj = [[NSDictionary alloc]
                             initWithObjectsAndKeys :
                             [per name], @"name",
                             state, @"state",
                             nil];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary : jsonObj];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.connectionCommand.callbackId];
}

- (void) discoveryDisconnected {
    NSDictionary *jsonObj = [[NSDictionary alloc]
                             initWithObjectsAndKeys :
                             @"unknown", @"name",
                             @"disconnected", @"state",
                             nil];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.connectionCommand.callbackId];
}

- (void) discoveryStatePoweredOff {
    NSDictionary *jsonObj = [[NSDictionary alloc]
                             initWithObjectsAndKeys :
                             @"unknown", @"name",
                             @"poweredoff", @"state",
                             nil];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.connectionCommand.callbackId];
}

- (void) deviceNotFound {
    NSDictionary *jsonObj = [[NSDictionary alloc]
                             initWithObjectsAndKeys :
                             @"unknown", @"name",
                             @"notfound", @"state",
                             nil];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.connectionCommand.callbackId];
}

#pragma mark - Info Display Delegate

- (void) didRecieveDisplayData:(DisplayData *)displayData {
    if (self.displayCommand != nil && displayData != nil) {
        NSDictionary *jsonObj = [[NSDictionary alloc]
                                 initWithObjectsAndKeys :
                                 [NSNumber numberWithInt:[displayData X]], @"xOn",
                                 [NSNumber numberWithInt:[displayData K]], @"kOn",
                                 [NSNumber numberWithInt:[displayData Ka]], @"kaOn",
                                 [NSNumber numberWithInt:[displayData Laser]], @"laserOn",
                                 [NSNumber numberWithInt:[displayData Front]], @"frontOn",
                                 [NSNumber numberWithInt:[displayData Side]], @"rearOn",
                                 [NSNumber numberWithInt:[displayData Rear]], @"segmentA",
                                 [NSNumber numberWithInt:[displayData SegmentA]], @"segmentA",
                                 [NSNumber numberWithInt:[displayData SegmentB]], @"segmentB",
                                 [NSNumber numberWithInt:[displayData SegmentC]], @"segmentC",
                                 [NSNumber numberWithInt:[displayData SegmentD]], @"segmentD",
                                 [NSNumber numberWithInt:[displayData SegmentE]], @"segmentE",
                                 [NSNumber numberWithInt:[displayData SegmentF]], @"segmentF",
                                 [NSNumber numberWithInt:[displayData SegmentG]], @"segmentG",
                                 [NSNumber numberWithInt:[displayData b0]], @"b0",
                                 [NSNumber numberWithInt:[displayData b1]], @"b1",
                                 [NSNumber numberWithInt:[displayData b2]], @"b2",
                                 [NSNumber numberWithInt:[displayData b3]], @"b3",
                                 [NSNumber numberWithInt:[displayData b4]], @"b4",
                                 [NSNumber numberWithInt:[displayData b5]], @"b5",
                                 [NSNumber numberWithInt:[displayData b6]], @"b6",
                                 [NSNumber numberWithInt:[displayData b7]], @"b7",
                                 [NSNumber numberWithBool:[displayData Soft]], @"soft",
                                 [NSNumber numberWithBool:[displayData TSHoldOff]], @"TSHoldOff",
                                 [NSNumber numberWithBool:[displayData SystemStatus]], @"SystemStatus",
                                 [NSNumber numberWithBool:[displayData DisplayOn]], @"DisplayOn",
                                 [NSNumber numberWithBool:[displayData EuroMode]], @"EuroMode",
                                 [NSNumber numberWithBool:[displayData Legacy]], @"Legacy",
                                 nil];
        CDVPluginResult *pluginResult = [CDVPluginResult
                                         resultWithStatus : CDVCommandStatus_OK
                                         messageAsDictionary : jsonObj];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.displayCommand.callbackId];
    }
}

#pragma mark - Alert Out Delegate

- (void)didRecieveAlertTable:(AlertCollection *)collection {
    if (self.alertCommand != nil) {
        int alertCnt = [collection totalAlerts];
        if (alertCnt < 1) {
            if (self.alertsInitialized == false) {
                self.alertsInitialized = true;
                CDVPluginResult *pluginResult = [CDVPluginResult
                                                 resultWithStatus : CDVCommandStatus_OK];
                [pluginResult setKeepCallbackAsBool:true];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:self.alertCommand.callbackId];
            }
            return;
        }
        
        NSMutableArray *jsonAlerts = [[NSMutableArray alloc] init];
        
        for (AlertData* alert in collection.alerts) {
            NSString* bandStr;
            NSString* directionStr;
            switch ([alert getBand]) {
                case badBand:
                    bandStr = @"Unknown band";
                    break;
                case laser:
                    bandStr = @"Laser";
                    break;
                case ka:
                    bandStr = @"Ka";
                    break;
                case k:
                    bandStr = @"K";
                    break;
                case x:
                    bandStr = @"X";
                    break;
                case ku:
                    bandStr = @"Ku";
                    break;
            }
            switch ([alert getDirection]) {
                case badDir:
                    directionStr = @"Unknown direction";
                    break;
                case front:
                    directionStr = @"Front";
                    break;
                case side:
                    directionStr = @"Side";
                    break;
                case rear:
                    directionStr = @"Rear";
                    break;
            }
            NSDictionary *jsonObj = [[NSDictionary alloc]
                                     initWithObjectsAndKeys :
                                     [NSNumber numberWithInt:[alert getFrequency]], @"frequency",
                                     [NSNumber numberWithInt:[alert getFrontSignalStrength]], @"frontSignalStrength",
                                     [NSNumber numberWithInt:[alert getRearSignalStrength]], @"rearSignalStrength",
                                     directionStr, @"direction",
                                     bandStr, @"band",
                                     [NSNumber numberWithUnsignedChar:[alert getNormalizedSignalStregth]], @"normalizedSignalStregth",
                                     [NSNumber numberWithInt:[alert getDevience]], @"devience",
                                     [NSNumber numberWithBool:[alert isPriority]], @"isPriority",
                                     [NSNumber numberWithInt:[alert getWindowUpper]], @"windowUpper",
                                     [NSNumber numberWithInt:[alert getWindowLower]], @"windowLower",
                                     [NSNumber numberWithBool:[alert active]], @"active",
                                     [NSNumber numberWithBool:[alert isNew]], @"isNew",
                                     [NSNumber numberWithBool:[alert isProxy]], @"isProxy",
                                     [NSNumber numberWithDouble:[alert lastDetectTimestamp]], @"lastDetectTimestamp",
                                     [NSNumber numberWithInt:[alert getIndex]], @"index",
                                     [NSNumber numberWithInt:[alert getCount]], @"count",
                                     nil];
            [jsonAlerts addObject:jsonObj];
        }
        NSDictionary *jsonObj = [[NSDictionary alloc]
                                 initWithObjectsAndKeys :
                                 [NSNumber numberWithInt:alertCnt], @"alertCnt",
                                 [NSNumber numberWithBool:[collection isComplete]], @"isComplete",
                               jsonAlerts, @"alerts",
                               nil];
                                      
        CDVPluginResult *pluginResult = [CDVPluginResult
                                         resultWithStatus : CDVCommandStatus_OK
                                         messageAsDictionary : jsonObj];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.alertCommand.callbackId];
    }
}

#pragma mark - DeviceInformation Protocol

- (void) DidRecieveSerialNumber:(NSString*)serial withOrigin:(char)origin {
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:serial];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.latestCommand.callbackId];
}

- (void) DidRecieveFirmwareVersion:(NSString*)firmware withOrigin:(char)origin {
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:firmware];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.latestCommand.callbackId];
}

- (void) BatteryVoltageReturned:(double)voltage {
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:voltage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.latestCommand.callbackId];
}

- (void) didRecieveUserBytes:(UserBytes*)userBytes {
    NSDictionary *jsonObj = [[NSDictionary alloc]
                             initWithObjectsAndKeys :
                             [NSNumber numberWithBool:[userBytes XbandOn]], @"XbandOn",
                             [NSNumber numberWithBool:[userBytes KbandOn]], @"KbandOn",
                             [NSNumber numberWithBool:[userBytes KAbandOn]], @"KAbandOn",
                             [NSNumber numberWithBool:[userBytes KUBandOn]], @"KUBandOn",
                             [NSNumber numberWithBool:[userBytes LaserOn]], @"LaserOn",
                             [NSNumber numberWithBool:[userBytes BargraphNormalResponsive]], @"BargraphNormalResponsive",
                             [NSNumber numberWithBool:[userBytes KAFalseGuardOn]], @"KAFalseGuardOn",
                             [NSNumber numberWithBool:[userBytes KMutingOn]], @"KMutingOn",
                             [NSNumber numberWithBool:[userBytes MuteVolumeLeverZero]], @"MuteVolumeLeverZero",
                             [NSNumber numberWithBool:[userBytes PostMuteBogeyLockVolumeLeverKnob]], @"PostMuteBogeyLockVolumeLeverKnob",
                             [NSNumber numberWithInt:[userBytes KMuteTimer]], @"KMuteTimer",
                             [NSNumber numberWithBool:[userBytes KInitialUnmute4Lights]], @"KInitialUnmute4Lights",
                             [NSNumber numberWithBool:[userBytes KPersistantUnmute6Lights]], @"KPersistantUnmute6Lights",
                             [NSNumber numberWithBool:[userBytes KRearMuteOn]], @"KRearMuteOn",
                             [NSNumber numberWithBool:[userBytes PopOn]], @"PopOn",
                             [NSNumber numberWithBool:[userBytes EuroOn]], @"EuroOn",
                             [NSNumber numberWithBool:[userBytes EuroXBandOn]], @"EuroXBandOn",
                             [NSNumber numberWithBool:[userBytes FilterOn]], @"FilterOn",
                             [NSNumber numberWithBool:[userBytes ForceLegacyCD]], @"ForceLegacyCD",
                             nil];
    CDVPluginResult *pluginResult = [CDVPluginResult
                                     resultWithStatus : CDVCommandStatus_OK
                                     messageAsDictionary : jsonObj];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.latestCommand.callbackId];
    
}

- (void) DidRecieveDataAcknowledgement:(ESPPacket *)ack {
    if (self.infoListenerCommand != nil) {
        NSDictionary *jsonObj = [[NSDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"DataAcknowledgement", @"info",
                                 nil];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.infoListenerCommand.callbackId];
    }
}

- (void) UnsupportedPacketReturned:(ESPPacket *)packet {
    if (self.infoListenerCommand != nil) {
        NSDictionary *jsonObj = [[NSDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"UnsupportedPacketReturned", @"info",
                                 nil];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.infoListenerCommand.callbackId];
    }
}

- (void) RequestNotProcessed:(ESPPacket *)packet {
    if (self.infoListenerCommand != nil) {
        NSDictionary *jsonObj = [[NSDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"RequestNotProcessed", @"info",
                                 nil];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.infoListenerCommand.callbackId];
    }
}

- (void) V1Busy:(NSData *)packetsToBeProcessed {
    if (self.infoListenerCommand != nil) {
        NSDictionary *jsonObj = [[NSDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"V1Busy", @"info",
                                 nil];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.infoListenerCommand.callbackId];
    }
}

- (void) DataErrorPacketReturned:(ESPPacket *)packet {
    if (self.infoListenerCommand != nil) {
        NSDictionary *jsonObj = [[NSDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"DataErrorPacketReturned", @"info",
                                 nil];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.infoListenerCommand.callbackId];
    }
}


/*
 -(void)didRecieveSweepSections:(NSArray*)returnedSections {
 
 }
 
 -(void)didRecieveMaxSweepIndex:(int)index {
 
 }
 
 -(void)didRecieveSweepDefinition:(CustomSweepObject*)csd {
 
 }
 
 -(void)didRecieveSweepWriteResult:(bool)success {
 
 }
 */

@end