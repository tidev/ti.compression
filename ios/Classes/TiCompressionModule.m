/**
 * Ti.Compression Module
 * Copyright (c) 2010-2013 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE included with this distribution for details.
 */

#import "TiCompressionModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"

@implementation TiCompressionModule

#pragma mark Internal

// this is generated for your module, please do not change it
-(id)moduleGUID
{
	return @"c129f5f7-ace8-4cca-be47-b226f8b29f78";
}

// this is generated for your module, please do not change it
-(NSString*)moduleId
{
	return @"ti.compression";
}

#pragma mark Lifecycle

-(void)startup
{
	// this method is called when the module is first loaded
	// you *must* call the superclass
	[super startup];
	
	NSLog(@"[INFO] %@ loaded",self);
}

-(void)shutdown:(id)sender
{
	// this method is called when the module is being unloaded
	// typically this is during shutdown. make sure you don't do too
	// much processing here or the app will be quit forceably
	
	// you *must* call the superclass
	[super shutdown:sender];
}

#pragma mark Cleanup 

-(void)dealloc
{
	// release any resources that have been retained by the module
	[super dealloc];
}

#pragma mark Internal Memory Management

-(void)didReceiveMemoryWarning:(NSNotification*)notification
{
	// optionally release any resources that can be dynamically
	// reloaded once memory is available - such as caches
	[self fireEvent:@"lowmemory"];
	[super didReceiveMemoryWarning:notification];
}

#pragma mark Helper Methods

-(NSString*)getNormalizedPath:(NSString*)source
{
	// NOTE: File paths may contain URL prefix as of release 1.7 of the SDK
	if ([source hasPrefix:@"file:/"]) {
		NSURL* url = [NSURL URLWithString:source];
		return [url path];
	}
	
	// NOTE: Here is where you can perform any other processing needed to
	// convert the source path. For example, if you need to handle
	// tilde, then add the call to stringByExpandingTildeInPath
	
	return source;
}

#pragma mark Public APIs

-(id)unzip:(id)args
{
	// unzip API requires 3 parameters:
	//   location:string - folder location to unzip the files
	//   filename:string - path to the zip file
	//   overwrite:bool  - indicates if existing files should be overwritten

	enum unzipArgs {
		kUnzipArgLocation  = 0,
		kUnzipArgFileName  = 1,
		kUnzipArgOverwrite = 2,
		kUnzipArgCount
	};	
	
	// Validate arguments
	ENSURE_ARG_COUNT(args, kUnzipArgCount);

	NSString* msg = @"";
	
	// Get and validate the folder location
	NSString* folderLocationIn = [args objectAtIndex:kUnzipArgLocation];
	NSString* folderLocation = [self getNormalizedPath:folderLocationIn];
	if (folderLocation == nil) {
		msg = [NSString stringWithFormat:@"Invalid folder location [%@]", folderLocationIn];
		NSLog(@"[ERROR] %@", msg);
		return msg;
	}
	
	// Get and validate the zip file name
	NSString* zipFileNameIn = [args objectAtIndex:kUnzipArgFileName];
	NSString* zipFileName = [self getNormalizedPath:zipFileNameIn];
	if (zipFileName == nil) {
		msg = [NSString stringWithFormat:@"Invalid archive file name [%@]", zipFileNameIn];
		NSLog(@"[ERROR] %@", msg);
		return msg;
	}
	
	BOOL overWrite = [TiUtils boolValue:[args objectAtIndex:kUnzipArgOverwrite] def:NO];
	
	ZipArchive* zip = [[ZipArchive alloc] init];		
	if ([zip UnzipOpenFile:zipFileName]) {
		// We have successfully opened the zip file
		if ([zip UnzipFileTo:folderLocation overWrite:overWrite]) {
			msg = @"success";
			NSLog(@"[INFO] Archive file [%@] successfully extracted", zipFileName);
		} 
		else {
			msg = [NSString stringWithFormat:@"Failed to extract archive file [%@], may be password protected", zipFileName];
			NSLog(@"[ERROR] %@", msg);
		}
		
		[zip UnzipCloseFile];
	} 
	else {
		msg = [NSString stringWithFormat:@"Unable to open archive file [%@]", zipFileName];
		NSLog(@"[ERROR] %@", msg);
	} 

	[zip release];
	
	return msg;
}

// Define the interval at which the autorelease pool will be drained. This value can be tuned to accommodate
// optimal memory usage. If memory needs to be released more frequently then set to a lower value; less 
// frequently then set to a higher value;
static const int kAutoReleaseInterval = 100;

// Create a zip file
-(id)zip:(id)args
{ 
	// zip API requires 2 parameters:
	//   filename:string - path to the zip file to create
	//   filearray:arrray - array of file paths to add to the zip

	enum zipArgs {
		kZipArgFileName  = 0,
		kZipArgFileArray = 1,
		kZipArgCount
	};
	
	// Validate arguments
	ENSURE_ARG_COUNT(args, kZipArgCount);

	NSString* msg = @"";
	
	// Get and validate the zip file name
	NSString* zipFileNameIn = [args objectAtIndex:kZipArgFileName];
	NSString* zipFileName = [self getNormalizedPath:zipFileNameIn];
	if (zipFileName == nil) {
		msg = [NSString stringWithFormat:@"Invalid archive file name [%@]", zipFileNameIn];
		NSLog(@"[ERROR] %@", msg);
		return msg;
	}
	
	// Get the array of files to add to the zip archive
	NSArray* fileArray = [args objectAtIndex:kZipArgFileArray];
	ENSURE_ARRAY(fileArray);
		
	ZipArchive* zip = [[ZipArchive alloc] init];
	if ([zip CreateZipFile2:zipFileName]) {
		
		// Loop through each of the files specified in the file array. Since several
		// auto-released objects are getting created during the processing of each loop,
		// we need to manage our memory in this tight loop. For very large lists of files to
		// zip, we could end up with a large number of objects in the auto-release pool. To
		// better manage this case, we create a local auto-release pool and we drain the
		// pool every kAutoReleaseInterval objects. We could drain the pool every time through
		// the loop but we can drain them in groups to make it a little more efficient.
		
		int n, cnt, successCount=0;
		NSAutoreleasePool* pool = nil;
		for (n=0,cnt=[fileArray count]; n<cnt; ++n) {
			if ((n % kAutoReleaseInterval) == 0) {
				[pool drain];
				pool = [[NSAutoreleasePool alloc] init];
			}
			
			// Get and validate the next file to add
			NSString* filePathIn = [fileArray objectAtIndex:n];
			NSString* filePath = [self getNormalizedPath:filePathIn];
			if (filePath == nil) {
				NSLog(@"[ERROR] File path [%@] is invalid", filePathIn);
			}
			else if ([zip addFileToZip:filePath newname:[filePath lastPathComponent]]) {
				successCount++;
			}
			else {
				NSLog(@"[ERROR] Failed to add file [%@] to archive", filePath);
			}
		}
		[pool drain];
		[zip CloseZipFile2];
						
		NSLog(@"[INFO] Archive file [%@] created with %d/%d files", zipFileName, successCount, cnt);
		msg = @"success";
	}
	else {
		msg = [NSString stringWithFormat:@"Unable to create archive file [%@]", zipFileName];
		NSLog(@"[ERROR] %@", msg);
	}
	
	[zip release];
	
	return msg;
}

@end
