// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.

var tabGroup = Ti.UI.createTabGroup();
var win1 = Ti.UI.createWindow({
    title:'Zip Tests',
    backgroundColor:'#ffff',
    url:'ziptests.js'
});
var tab1 = Ti.UI.createTab({
    title:'Zip Tests',
    window:win1
});

var win2 = Ti.UI.createWindow({
    title:'Error Tests',
    backgroundColor:'#ffff',
    url:'errortests.js'
});
var tab2 = Ti.UI.createTab({
    title:'Error Tests',
    window:win2
});

tabGroup.addTab(tab1);
tabGroup.addTab(tab2);

tabGroup.open();
