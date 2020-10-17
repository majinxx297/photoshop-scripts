//@include "config.jsx";
//@include "timeline2kag.jsx";

var currLayer = app.activeDocument.activeLayer;

var p = getRectPoints();
var scale = getScale(p);
var angle = getAngle(p);
var opacity = 255*currLayer.opacity/100;
var layer = getLayerNum(currLayer.id);

var kag =[
    "@image",
    "storage=" + currLayer.name,
    "page=fore",
    "visivle=true",
    "left=" + p[0].x,
    "top=" + p[0].y,
    "\r"
]

$.write(kag.join(' '))