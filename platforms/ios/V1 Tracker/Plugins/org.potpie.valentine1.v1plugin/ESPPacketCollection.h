//
//  ESPPacketCollection.h
//  Valentine
//
//  Copyright (c) 2013 Valentine Research, Inc. All rights reserved.
//

/** This class is designed to encapsulate a collection of ESP Packets returned by the Valentine One.
 
 */

#import <Foundation/Foundation.h>
#import "ESPPacket.h"

@interface ESPPacketCollection : NSObject

@property (nonatomic) NSMutableArray *packets;
@property (nonatomic) int totalPackets;

/** Call this method to initialize the collection with a packet.
 */
- (id) initWithPacket:(ESPPacket*)packet;
/** Call this method to add a packet to the collection.
 */
- (void) addPacket:(ESPPacket*)packet;
/** Call this method to determine if the collection is complete.
 */
- (bool) isComplete;
/** Call this method to return a complete packet to send to the Valentine One.
 */
- (ESPPacket*) getCompletedPacket;

@end
