//
//  SavvyStatus.h
//  ESPLibrary
//
//  Copyright (c) 2013 Valentine Research, Inc. All rights reserved.
//

/** This class is designed to encapsulate the data provided to and from the Savvy.
 
 */

#import <Foundation/Foundation.h>

@interface SavvyStatus : NSObject
@property (nonatomic) NSMutableData *savvyData;
@property (nonatomic) BOOL mph;

/** Call this method to intialize the Custom Sweep with recieved custom sweep data from the Valentine One.
 
 */
-(id)initWithData:(NSData*)data;
-(int)getThresholdKPH;
-(int)getThresholdMPH;
-(bool)overriddenByUser;
-(bool)unmuteEnabled;
-(void)setThresholdKPH:(int)kph;
-(void)setThresholdMPH:(int)mph;
-(void)setOverriddenByUser:(bool)on;
-(void)setUnmuteEnabled:(bool)on;


@end
