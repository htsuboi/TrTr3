//「具体的な画面クラス」のすべてに優先して定義される、画面系汎用メソッド定義クラス

var CommonView = function(x, y, border, appearTime) {

    // 汎用アナウンスメッセージ表示用
    var printMsg = new Array();//アナウンスメッセージ
    var printMsgCount = 0;// >0のときアナウンスメッセージ表示
};

CommonView.staticCanvas = function() {
    if (typeof arguments.callee.cv == 'undefined') {
        arguments.callee.cv = document.getElementById('gameCanvas');
        arguments.callee.cv.style.visibility = "visible";
    }
    return arguments.callee.cv;
};

CommonView.staticCanvasFlip = function() {
    if (typeof arguments.callee.cvForFlip == 'undefined') {
        arguments.callee.cvForFlip = document.getElementById('gameCanvasFlip');
        arguments.callee.cvForFlip.style.visibility = "hidden";
    }
    return arguments.callee.cvForFlip;
};

// 全画面汎用のアナウンスメッセージカウンタ
CommonView.msgCounter = function(v) {
    if (typeof arguments.callee.msgCount == 'undefined') {
        arguments.callee.msgCount = 0;
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.msgCount = v;
    }
    return arguments.callee.msgCount;
};

// 全画面汎用のアナウンスメッセージ配列
CommonView.messages = function(v) {
    if (typeof arguments.callee.msgArray == 'undefined') {
        arguments.callee.msgArray = [];
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.msgArray = v;
    }
    return arguments.callee.msgArray;
};

// 全画面共通のアナウンスメッセージ表示
CommonView.paintMessage = function(ctxFlip) {
    var nowMsgCounter = CommonView.msgCounter();
    var nowMessages = CommonView.messages();
    //if (1) {// アナウンスメッセージを表示すべき
    if (nowMsgCounter > 0) {// アナウンスメッセージを表示すべき
        var MESSAGE_X = 100;
        var MESSAGE_Y = 100;
        var MESSAGE_W = 200;
        var MESSAGE_H = 150;
        ctxFlip.fillStyle = 'rgb(239, 0, 0)';
        ctxFlip.fillRect(MESSAGE_X - 1, MESSAGE_Y - 1, MESSAGE_W + 3, MESSAGE_H + 3);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(MESSAGE_X, MESSAGE_Y, MESSAGE_W, MESSAGE_H);
        ctxFlip.font = "16px 'MS Pゴシック'";
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        for (var i = 0; i < nowMessages.length; i++) {
            ctxFlip.fillText(nowMessages[i], MESSAGE_X, MESSAGE_Y + 20 + 20 * i);
        }

        // カウンタをデクリメント
        CommonView.msgCounter(nowMsgCounter - 1);
    } else {
        CommonView.messages([]);// エラーメッセージのクリア
    }
}

CommonView.addMessage = function(addMsg, printCount) {
	if (printCount <= 0) {
		// デフォルト引数のかわり
		printCount = 60;
	}
    var nowMessages = CommonView.messages();
    nowMessages.push(addMsg);
    // メッセージが7個以上になったら最も古いものを削除
    if (nowMessages.length > 6) {
        nowMessages.shift();
    }
    // printCountに指定したフレームだけメッセージ表示
    CommonView.msgCounter(printCount);
}