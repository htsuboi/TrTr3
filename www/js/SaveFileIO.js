//セーブファイル管理クラス

var SaveFileIO = function(x, y, border, appearTime) {
 
    // 汎用アナウンスメッセージ表示用
    var printMsg = new Array();//アナウンスメッセージ
    var printMsgCount = 0;// >0のときアナウンスメッセージ表示
};
    
SaveFileIO.saveFile = function() {
    localStorage.foo = "bar";
};

SaveFileIO.loadFile = function() {
    CommonView.addMessage(localStorage.foo);
};