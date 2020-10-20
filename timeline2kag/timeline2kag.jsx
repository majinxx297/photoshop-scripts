//@include "config.jsx";

function getLayerNum(layerId) {
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; ++i) {
        // revert i becasue layer[0] is the highest index layer 
        if (layers[i].id == layerId) return layers.length - i - 1;
    }
    return -1;
}

function getKagMode(mode) {
    switch (mode) {
        case "linearDodge":
            return "psadd";
        case "linearBurn":
            return "pssub";
        case "multiply":
            return "psmul";
        case "screen":
            return "psscreen";
        case "overlay":
            return "psoverlay";
        case "hardLight":
            return "pshlight";
        case "softLight":
            return "psslight";
        case "colorDodge":
            return "psdodge";
        case "colorBurn":
            return "psburn";
        case "lighten":
            return "pslighten";
        case "darken":
            return "psdarken";
        case "difference":
            return "psdiff";
        case "exclusion":
            return "psexcl";
    }
    return "";
}

function rgbToHex(r, g, b, opa) {
    return (opa << 24) + (r << 16) + (g << 8) + b;
}

function getColorInfo() {
    var res;
    var ref = new ActionReference();
    ref.putEnumerated(
        app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"),
        app.charIDToTypeID("Trgt"));
    var desc = app.executeActionGet(ref).getObjectValue(app.stringIDToTypeID('layerEffects')).getObjectValue(app.stringIDToTypeID('solidFill'));
    switch (app.activeDocument.mode) {
        case DocumentMode.RGB:
            var opacity = desc.getInteger(app.stringIDToTypeID('opacity'));
            var color = desc.getObjectValue(app.stringIDToTypeID('color'));
            var red = color.getDouble(app.stringIDToTypeID('red'));
            var blue = color.getDouble(app.stringIDToTypeID('blue'));
            var green = color.getDouble(app.stringIDToTypeID('green'));
            var mode = app.typeIDToStringID(
                desc.getEnumerationValue(app.stringIDToTypeID('mode')));
            res = {
                lightcolor: rgbToHex(red, green, blue, opacity),
                lighttype: mode
            };
            break;
    }
    return res;
}

// functions get position info of current layer
// original author @k-wth
// Ref: https://qiita.com/k-wth/items/258ea157f0cd2dde8591
// 配置されたスマートオブジェクトの4角の点を取得する
function getRectPoints() {
    var ref = new ActionReference();
    ref.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
    var d = app.executeActionGet(ref);
    var obj = d.getObjectValue(app.stringIDToTypeID('smartObjectMore'));
    var points = [];
    if (obj.hasKey(app.stringIDToTypeID('transform'))) {
        var t_list = obj.getList(app.stringIDToTypeID('transform'));
        for (var i = 0; i < t_list.count; i = i + 2) {
            points.push({
                x: t_list.getDouble(i) | 0,
                y: t_list.getDouble(i + 1) | 0
            });
        }
    }
    return points;
}

// 角度(angle)の取得
// ベクトルの角度計算で求めます
function getScale(p) {
    var ref = new ActionReference();
    ref.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
    var d = app.executeActionGet(ref);
    var obj = d.getObjectValue(app.stringIDToTypeID('smartObjectMore'));
    if (obj.hasKey(app.stringIDToTypeID('size'))) {
        var t = obj.getObjectValue(app.stringIDToTypeID('size'));
        var width = t.getDouble(app.stringIDToTypeID("width"));
        var height = t.getDouble(app.stringIDToTypeID("height"));
        var l_width = Math.sqrt(
            Math.pow(p[1].x - p[0].x, 2)
            + Math.pow(p[1].y - p[0].y, 2));
        var l_height = Math.sqrt(
            Math.pow(p[2].x - p[1].x, 2)
            + Math.pow(p[2].y - p[1].y, 2));
        var scale = {
            x: l_width / width * 100 | 0,
            y: l_height / height * 100 | 0,
        };
    }
    return scale;
}

// 拡大率(scale)の取得
function getAngle(p) {
    var x = p[1].x - p[0].x;
    var y = p[1].y - p[0].y;
    var angle = Math.atan2(y, x) * (180 / Math.PI) | 0;
    return angle;
}

function kag_image(isFore) {
    var currLayer = app.activeDocument.activeLayer;
    var layer = getLayerNum(currLayer.id);
    var p = getRectPoints();
    var scale = getScale(p);
    var angle = getAngle(p);
    var opacity = 255 * currLayer.opacity / 100;
    var page = isFore ? "fore" : "back";

    var style = getColorInfo();
    var lightcolor = style.lightcolor;
    var lighttype = getKagMode(style.lighttype);

    var kag = [
        "@image",
        "storage=" + currLayer.name,
        "layer=" + layer,
        "page=" + page,
        "visivle=true",
        "left=" + p[0].x,
        "top=" + p[0].y
    ]

    if (lightcolor & 0xff000000) {
        kag.push("lightcolor=0x" + lightcolor.toString(16));
        kag.push("lighttype=" + lighttype);
    }

    return kag;
}

function kag_trans() {
    var currLayer = app.activeDocument.activeLayer;
    var layer = getLayerNum(currLayer.id);

    var kag = kag_image(false);
    kag = kag.concat([
        '\r',
        "@trans",
        "layer=" + layer,
        "method=crossfade",
        "time=100"
    ])
    return kag.join(' ');
}

function kag_move() {
    var currLayer = app.activeDocument.activeLayer;

    var p = getRectPoints();
    var scale = getScale(p);
    var angle = getAngle(p);
    var opacity = 255 * currLayer.opacity / 100;
    var layer = getLayerNum(currLayer.id);

    var kag = [
        "@move",
        "storage=" + currLayer.name,
        "layer=" + layer,
        'path=(' +
        p[0].x + ',' +
        p[0].y + ',' +
        opacity + ',' +
        scale.x + ',' +
        angle + ')',
        "time=100",
        '\r'
    ]
    return kag.join(' ');
}

// UI
function showDialog() {
    var dlg = new Window("dialog", "KAG script", undefined, { closeButton: true });
    dlg.spacing = 10;
    //dlg.alignChildren = "center";

    var line1 = dlg.add("group");
    line1.alignment = "left";
    var text1 = line1.add("statictext", undefined, "Select KAG tag");
    var list = line1.add("dropdownlist", undefined, ["image", "trans", "move"]);
    list.selection = 0;
    list.minimumSize.width = 200;
    var check = line1.add("checkbox", undefined, "all layers");

    var line2 = dlg.add("group");
    line2.alignment = "left";
    var text2 = line2.add("statictext", undefined, "Save to");
    var input = line2.add("edittext", undefined, decodeURI(defaultfile));
    input.characters = 25;
    var button2 = line2.add("button", undefined, "Browse");
    button2.onClick = function () {
        var myDefault = new Folder(filename);
        var myFiles = myDefault.selectDlg();    
        if(myFiles) input.text = decodeURI(myFiles.toString());        
    }

    var line3 = dlg.add("group");
    var botton31 = line3.add("button", undefined, "OK");
    var botton32 = line3.add("button", undefined, "Cancle");
    botton32.onClick = function (){dlg.close()};
    dlg.show();
}

//showDialog();
$.write(app.activeDocument.path.fsName.toString() + '\r');
//$.write(kag_move());
//var outfile = new File(filename);
// outfile.open("a");