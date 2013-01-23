var compression = require('ti.compression');
Ti.API.info("module is => " + compression);

var window = Ti.UI.currentWindow;

var buttonZip = Ti.UI.createButton({
    title:"Zip",
    width:150,
    height:40,
    top:20
});
window.add(buttonZip);

var buttonUnzip = Ti.UI.createButton({
    title:"Unzip",
    width:150,
    height:40,
    top:80
});
window.add(buttonUnzip);

var buttonTest = Ti.UI.createButton({
    title:"Loop",
    width:150,
    height:40,
    top:140
});
window.add(buttonTest);

var label = Ti.UI.createLabel({
  text:"Ready to zip!",
  font:{fontSize:24},
  textAlign:"center",
  top:200
});
window.add(label);

// Version 1.7 of SDK has the trailing backslash on the directory
// For pre-1.7 support we need to add the backslash
var zipFileName = Ti.Filesystem.applicationDataDirectory + '/test.zip';
var dataFolder = Ti.Filesystem.applicationDataDirectory + '/data';
var timer = null;
var zipIt, unzipIt;

var zipIt = function () {
    var result = compression.zip(
        zipFileName, 
        [ 
            // Change this list to include files on your system
            Ti.Filesystem.resourcesDirectory + '/a.dat',
            Ti.Filesystem.resourcesDirectory + '/b.dat',
            'c.dat',
            'd.dat',
            'e.dat',
            'f.dat',
            'g.dat',
            'h.dat',
            'i.dat',
            'j.dat',
            'k.dat',
            'l.dat',
            'm.dat',
            'n.dat',
            'o.dat',
            'p.dat',
            'q.dat',
            'r.dat',
            's.dat',
            't.dat',
            'u.dat',
            'v.dat',
            'w.dat',
            'x.dat',
            'y.dat',
            'z.dat'
        ]
    );

    Ti.API.info("Result is => " + result);
    label.text = "Zip result is " + result;
    
    var file = Ti.Filesystem.getFile(zipFileName);
    Ti.API.info("File size is " + file.size);

    if (timer != null)
    {
        clearInterval(timer);
        timer = setInterval(unzipIt,5000);
    }
};

var unzipIt = function () {
    var result = compression.unzip(
        dataFolder, 
        zipFileName, 
        true
    );
    Ti.API.info("Result is => " + result);
    Ti.API.info("Archive file is =>" + zipFileName);
    Ti.API.info("Data folder is => " + dataFolder);
    
    label.text = "Unzip result is " + result;
    
    if (timer != null)
    {
        clearInterval(timer);
        timer = setInterval(zipIt,5000);
    }
};

buttonTest.addEventListener('click',function(){
    if (timer == null) {
        timer = setInterval(zipIt,1000);
    }
    else {
        clearInterval(timer);
        timer = null;
    };
});

buttonZip.addEventListener('click',zipIt);
buttonUnzip.addEventListener('click',unzipIt);
