//セーブファイル管理クラス

var SaveFileIO = function(x, y, border, appearTime) {
 
    // 汎用アナウンスメッセージ表示用
    var printMsg = new Array();//アナウンスメッセージ
    var printMsgCount = 0;// >0のときアナウンスメッセージ表示
};
    
SaveFileIO.saveFile = function(fileNo, ev, ud, itemMap) {
    var nowTime = new Date();
    var timeStamp = nowTime.getFullYear() + "/" + (nowTime.getMonth() + 1) + "/" + nowTime.getDate() + " " + nowTime.getHours() + ":" + nowTime.getMinutes() + ":" + nowTime.getSeconds();
    localStorage.setItem("TrTr3TimeStamp" + fileNo, timeStamp);
    localStorage.setItem("TrTr3unitData" + fileNo, JSON.stringify(ud));
    localStorage.setItem("TrTr3eventView" + fileNo, JSON.stringify(ev));
    // Mapはローカルストレージ保存できないので、単なる連想配列にする
    var plainMap = {};
    for (var [key, value] of itemMap) {
        plainMap[key] = value;
    }
    localStorage.setItem("TrTr3itemMap" + fileNo, JSON.stringify(plainMap));
    CommonView.addWarn(fileNo + "番にセーブしました。");
};

SaveFileIO.loadFile = function(fileNo, ev, ud, itemMap) {
    // 今のデータを空にする
    ev.gameStart();
    ud.splice(0, ud.length);
    itemMap.clear();
    var tempEv = JSON.parse(localStorage.getItem("TrTr3eventView" + fileNo));
    for (var name in tempEv) {
        ev[name] = tempEv[name];
    }
    var plainUD = JSON.parse(localStorage.getItem("TrTr3unitData" + fileNo));
    for (var name in plainUD) {
        ud.push(name);
    }
    var plainIM = JSON.parse(localStorage.getItem("TrTr3itemMap" + fileNo));
    for (var name in plainIM) {
        itemMap.set(name, plainIM[name]);
    }
    CommonView.addWarn(fileNo + "番をロードしました。");
};

SaveFileIO.checkFile = function(fileNo) {
    var checks = {};
    var timeString = localStorage.getItem("TrTr3TimeStamp" + fileNo);
    if (timeString != null) {
        checks["timeStamp"] = timeString;
    }
    return checks;
};