//
//  BTDiscovery.h
//  Valentine
//
//  Copyright (c) 2013 Valentine Research, Inc. All rights reserved.
//

/** This class is designed to encapsulate the process of creating a bluetooth connection to a V1Connect dongle.
 
 */

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "ValentineCommunicationService.h"


@protocol BTDiscoveryDelegate <NSObject>
/** This method will be called when a peripheral is connected and returned to any class assigned as the delegate.
 
 */
- (void) discoveryConnected:(CBPeripheral *)per;
/** This method will be called when a peripheral is disconnected on any class assigned as the delegate.
 
 */
- (void) discoveryDisconnected;
/** This method will be called on any class assigned as the delegate when the bluetooth becomes powered off.
 
 */
- (void) discoveryStatePoweredOff;

@end

@protocol BTDeviceNotFoundProtocol <NSObject>
/** This method will be called on any class assigned as the delegate if no device is found.
 
 */
- (void) deviceNotFound;

@end

@interface BTDiscovery : NSObject

/** This method will return a singleton instance of this class.
 
 */
+ (id) sharedInstance;


//Delegate
@property (nonatomic, assign) id<BTDiscoveryDelegate> discoveryDelegate;
@property (nonatomic, assign) id<V1ComProtocol> v1ComDelegate;

//Actions
/** This method will start scanning for a bluetooth device whose UUID matches the provided string.
 
 */
- (void) startScanningForUUIDString:(NSString *)uuidString;
/** This method will stop the manager from scanning for a bluetooth device.
 
 */
- (void) stopScanning;

/** This method will make an attempt to connect to the provided peripheral.
 
 */
- (void) connectPeripheral:(CBPeripheral*)peripheral;
/** This method will make an attempt to disconnect to the provided peripheral.
 
 */
- (void) disconnectPeripheral:(CBPeripheral*)peripheral;

- (void)removeConnectedServices;

//Device Access
@property (retain, nonatomic) NSMutableArray    *foundPeripherals;
@property (retain, nonatomic) NSMutableArray    *rememberedPeripherals;
@property (retain, nonatomic) NSMutableArray	*connectedServices;

/** This method will return a connected service.
 @return An instance of ValentineCommunicationService if connected. Nil if not connected.
 */
-(ValentineCommunicationService *)getConnectedService;
/** This method will return a list of connected services.
 @return An instance of CBPeriperal if connected. Nil if not connected.
 */
-(CBPeripheral*)getConnectedV1Device;
/** This method will assign the delegate for a not found delegate call.
 */
-(void)setNotFoundDelegate:(id<BTDeviceNotFoundProtocol>)delegate;

@end
