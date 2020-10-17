//@include "config.jsx";
//@include "timeline2kag.jsx";

var doc = app.activeDocument;
var currLayer = app.activeDocument.activeLayer;

var p = getRectPoints();
var scale = getScale(p);
var angle = getAngle(p);
var opacity = 255*currLayer.opacity/100;
var layer = getLayerNum(currLayer.id);

var kag = [
    "@move",
    "storage=" + currLayer.name,
    "layer=" + layer,
    'path=(' + 
        p[0].x+ ',' +
        p[0].y+ ',' +
        opacity+ ',' +
        scale.x+ ',' +
        angle + ')',
    "time=100",
    '\r'
]

$.write(doc.path.fsName.toString()+'\r');
$.write(kag.join(' '))

//var outfile = new File(filename);
// outfile.open("a");