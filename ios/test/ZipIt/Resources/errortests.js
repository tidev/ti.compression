var compression = require('ti.compression');
Ti.API.info("module is => " + compression);

var window = Ti.UI.currentWindow;

var button1 = Ti.UI.createButton({
    title:"Spaces in path",
    width:200,
    height:40,
    top:20
});
window.add(button1);

var button2 = Ti.UI.createButton({
    title:"Not enough args",
    width:200,
    height:40,
    top:80
});
window.add(button2);

var button3 = Ti.UI.createButton({
    title:"Invalid 2nd arg",
    width:200,
    height:40,
    top:140
});
window.add(button3);

var label = Ti.UI.createLabel({
  text:"Ready to test",
  font:{fontSize:24},
  textAlign:"center",
  top:200
});
window.add(label);

var breakIt1 = function () {
    // Should fail because of spaces in URL formatted path
    var result = compression.zip(
        "file://localhost/test test.zip",
        [
            'a c b [dk ^&'
        ]
    );
    alert(result);
};

var breakIt2 = function () {
     // Should throw exception because of not enough parameters
     try {       
        var result = compression.zip(
            "test.dat"
        );
    } catch (ex) {
        alert('Exception\n' + ex.message);
    }
};

var breakIt3 = function () {
    // Should throw exception because 2nd parameters is not an array
    try {
        var test3 = compression.zip(
            "test.dat", "badarray", true
        );
    } catch (ex) {
        alert('Exception\n' + ex.message);
    }
};

button1.addEventListener('click',breakIt1);
button2.addEventListener('click',breakIt2);
button3.addEventListener('click',breakIt3);
