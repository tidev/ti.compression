# Ti.Compression Module

## Description

Lets you zip and unzip files.

## Getting Started

View the [Using Titanium Modules](http://docs.appcelerator.com/titanium/latest/#!/guide/Using_Titanium_Modules) document for instructions on getting
started with using this module in your application.

## Accessing the Ti.Compression Module

To access this module from JavaScript, you would do the following:

	var Compression = require('ti.compression');

## Functions

### string zip(string archiveFile, string[] fileArray)

Compresses all of the files you pass in "fileArray" to the specified "archiveFile".

#### Arguments

* string archiveFile: The path to the archive file to create
* string[] fileArray: An array of files to compress

Returns the string "success" if the operation succeeded, or an error message if something went wrong.

### string unzip(string destinationFolder, string archiveFile, bool overwrite)

Extracts the files in the archive file into the destination folder, optionally overriding existing files.

#### Arguments

* string destinationFolder: The destination folder for the extracted files
* string archiveFile: The path to an existing compressed archive file
* bool overwrite: Indicates if existing files should be overwritten

Returns the string "success" if the operation succeeded, or an error message if something went wrong.

## Usage

To create an archive:  
    
    var result = Ti.Compression.zip('test.zip', [ 'a.dat', 'b.dat', 'c.dat' ];

To extract an archive:

    var result = Ti.Compression.unzip(Ti.Filesystem.applicationDataDirectory + 'data', 'test.zip', true);

See example for more details.

## Author

Clint Tredway

## Module History

View the [change log](changelog.html) for this module.

## Feedback and Support

Please direct all questions, feedback, and concerns to [info@appcelerator.com](mailto:info@appcelerator.com?subject=iOS%20Compression%20Module).

## License

Copyright(c) 2010-2013 by Appcelerator, Inc. All Rights Reserved. Please see the LICENSE file included in the distribution for further details.
