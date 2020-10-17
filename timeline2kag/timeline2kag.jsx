// original author @k-wth
// Ref: https://qiita.com/k-wth/items/258ea157f0cd2dde8591
// Note: all functions only work for CURRENT layer

// 配置されたスマートオブジェクトの4角の点を取得する
function getRectPoints(){
  var ref = new ActionReference();
  ref.putEnumerated(app.charIDToTypeID("Lyr "),app.charIDToTypeID("Ordn"),app.charIDToTypeID("Trgt"));
  var d = app.executeActionGet(ref);
  var obj = d.getObjectValue(app.stringIDToTypeID('smartObjectMore'));
  var points = [];
  if (obj.hasKey(app.stringIDToTypeID('transform'))){
    var t_list = obj.getList(app.stringIDToTypeID('transform'));
    for(var i=0;i<t_list.count;i=i+2){
      points.push({
        x : t_list.getDouble(i)|0,
        y : t_list.getDouble(i+1)|0
      });
    }
  }
  return points;
}

// 角度(angle)の取得
// ベクトルの角度計算で求めます
function getScale (p){
  var ref = new ActionReference();
  ref.putEnumerated(app.charIDToTypeID("Lyr "),app.charIDToTypeID("Ordn"),app.charIDToTypeID("Trgt"));
  var d = app.executeActionGet(ref);
  var obj = d.getObjectValue(app.stringIDToTypeID('smartObjectMore'));
  if (obj.hasKey(app.stringIDToTypeID('size'))){
    var t = obj.getObjectValue(app.stringIDToTypeID('size'));
    var width = t.getDouble(app.stringIDToTypeID("width"));
    var height = t.getDouble(app.stringIDToTypeID("height"));
    var l_width = Math.sqrt(
        Math.pow(p[1].x-p[0].x, 2)
      + Math.pow(p[1].y-p[0].y, 2));
    var l_height = Math.sqrt(
        Math.pow(p[2].x-p[1].x, 2)
      + Math.pow(p[2].y-p[1].y, 2));
    var scale = {
      x : l_width / width * 100|0,
      y : l_height / height * 100|0,
    };
  }
  return scale;
}

// 拡大率(scale)の取得
function getAngle(p){  
  var x = p[1].x - p[0].x;
  var y = p[1].y - p[0].y;
  var angle = Math.atan2(y, x) * (180/Math.PI)|0;
  return angle;
}

function getLayerNum(layerId){
  var layers = app.activeDocument.layers;
  for(var i=0; i < layers.length; ++i){
      // revert i becasue layer[0] is the highest index layer 
      if(layers[i].id == layerId) return layers.length- i-1;
  }
  return -1;
}