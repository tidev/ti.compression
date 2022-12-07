/* eslint-disable no-alert */
/**
 * This example demonstrates how to zip and unzip files.
 *
 * We'll demonstrate this in two different ways:
 *  - Zipping files.
 *  - Unzipping an archive.
 */
var win = Ti.UI.createWindow({
	layout: "vertical"
});
win.open();

var Compression = require('ti.compression');
var outputDirectory = Ti.Filesystem.applicationDataDirectory;
var inputDirectory = Ti.Filesystem.resourcesDirectory + 'data/';

/**
 * The following lines zip the a.txt and b.txt from the "data"
 * directory in your resources to the data directory of your app.
 */
var zipFiles = Ti.UI.createButton({
	title: 'Zip a.txt and b.txt',
	top: 10,
	left: 20,
	right: 20,
	height: 40
});
var zipFiles2 = Ti.UI.createButton({
	title: 'Zip a.txt and b.txt (fast)',
	top: 10,
	left: 20,
	right: 20,
	height: 40
});
zipFiles.addEventListener('click', function() {
	var startTime = new Date();
	var writeToZip = outputDirectory + '/zipFiles.zip';
	var file = Ti.Filesystem.getFile(writeToZip);
	if (file.exists()) {
		file.deleteFile();
	}
	var result = Compression.zip(writeToZip, [
		inputDirectory + 'a.txt',
		inputDirectory + 'b.txt',
		inputDirectory + 'file1.dat',
		inputDirectory + 'file2.dat',
		inputDirectory + 'file3.dat',
		inputDirectory + 'file4.dat',
		inputDirectory + 'file5.dat',
		inputDirectory + 'file6.dat',
		inputDirectory + 'file7.dat',
		inputDirectory + 'icon1.png',
		inputDirectory + 'icon2.png',
		inputDirectory + 'icon3.png'
	]);
	Ti.API.info(status.text = 'Zip Files: ' + result + ', to: ' + writeToZip);

	// eslint-disable-next-line eqeqeq
	if (result == 'success') {
		var file = Ti.Filesystem.getFile(writeToZip);
		if (!file.exists()) {
			alert('FAIL: The target zip does not exist!');
		} else {
			alert('PASS: The target zip exists!\nFile size: ' + file.size + "\nTime: " + (new Date() - startTime));
		}
	}
});
zipFiles2.addEventListener('click', function() {
	var writeToZip = outputDirectory + '/zipFiles.zip';

	var file = Ti.Filesystem.getFile(writeToZip);
	if (file.exists()) {
		file.deleteFile();
	}
	var startTime = new Date();
	var result = Compression.zip(writeToZip, [
		inputDirectory + 'a.txt',
		inputDirectory + 'b.txt',
		inputDirectory + 'file1.dat',
		inputDirectory + 'file2.dat',
		inputDirectory + 'file3.dat',
		inputDirectory + 'file4.dat',
		inputDirectory + 'file5.dat',
		inputDirectory + 'file6.dat',
		inputDirectory + 'file7.dat',
		inputDirectory + 'icon1.png',
		inputDirectory + 'icon2.png',
		inputDirectory + 'icon3.png'
	], {
		compression: Compression.BEST_SPEED
	});
	Ti.API.info(status.text = 'Zip Files: ' + result + ', to: ' + writeToZip);

	if (result == 'success') {
		var file = Ti.Filesystem.getFile(writeToZip);
		if (!file.exists()) {
			alert('FAIL: The target zip does not exist!');
		} else {
			alert('PASS: The target zip exists!\nFile size: ' + file.size + "\nTime: " + (new Date() - startTime));
		}
	}
});
win.add([zipFiles, zipFiles2]);

/**
 * The following lines extract the contents of the "a+b.zip" file
 * from the "data" directory in your resources to the data directory
 * of your app.
 */
var unzipArchive = Ti.UI.createButton({
	title: 'Unzip ab.zip',
	top: 10,
	left: 20,
	right: 20,
	height: 40
});
unzipArchive.addEventListener('click', function() {
	var zipFileName = inputDirectory + 'ab.zip';
	var result = Compression.unzip(outputDirectory, zipFileName, true);
	Ti.API.info(status.text = 'Unzip: ' + result + ', to: ' + outputDirectory);

	if (result == 'success') {
		if (!Ti.Filesystem.getFile(outputDirectory, 'a.txt').exists()) {
			alert('FAIL: The unzipped a.txt does not exist!');
		} else {
			alert('PASS: ' + Ti.Filesystem.getFile(outputDirectory, 'a.txt').read());
		}
	}
});
win.add(unzipArchive);

var status = Ti.UI.createLabel({
	text: 'Hit one of the buttons above, and the result will display here.',
	top: 10,
	left: 20,
	right: 20
});
win.add(status);
