//「具体的な画面クラス」のすべてに優先して定義される、画面系汎用メソッド定義クラス

var CommonView = function(x, y, border, appearTime) {
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

CommonView.printWarnFlag = function(v) {
    if (typeof arguments.callee.printWarnFlag == 'undefined') {
        arguments.callee.printWarnFlag = false;
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.printWarnFlag = v;
    }
    return arguments.callee.printWarnFlag;
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

// 全画面汎用の警告メッセージ配列
CommonView.warns = function(v) {
    if (typeof arguments.callee.warnArray == 'undefined') {
        arguments.callee.warnArray = [];
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.warnArray = v;
    }
    return arguments.callee.warnArray;
};

// 全画面共通のアナウンスメッセージ表示
CommonView.paintMessage = function(ctxFlip) {
    var nowMsgCounter = CommonView.msgCounter();
    var nowMessages = CommonView.messages();
    var warnMessages = CommonView.warns();
    if (nowMsgCounter > 0) {// アナウンスメッセージを表示すべき
        var MESSAGE_X = 20;
        var MESSAGE_Y = 100;
        var MESSAGE_W = 310;
        var MESSAGE_H = 150;
        ctxFlip.fillStyle = 'rgb(239, 0, 0)';
        ctxFlip.fillRect(MESSAGE_X - 1, MESSAGE_Y - 1, MESSAGE_W + 3, MESSAGE_H + 3);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(MESSAGE_X, MESSAGE_Y, MESSAGE_W, MESSAGE_H);
        ctxFlip.font = "14px 'MS Pゴシック'";
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        for (var i = 0; i < nowMessages.length; i++) {
            ctxFlip.fillText(nowMessages[i], MESSAGE_X, MESSAGE_Y + 20 + 20 * i);
        }

        // カウンタをデクリメント
        CommonView.msgCounter(nowMsgCounter - 1);
    } else {
        CommonView.messages([]);// 通知メッセージのクリア
    }
    
    if (CommonView.printWarnFlag() == true) {// 警告メッセージを表示すべき
        var MESSAGE_X = 20;
        var MESSAGE_Y = 100;
        var MESSAGE_W = 310;
        var MESSAGE_H = 150;
        ctxFlip.fillStyle = 'rgb(239, 0, 0)';
        ctxFlip.fillRect(MESSAGE_X - 1, MESSAGE_Y - 1, MESSAGE_W + 3, MESSAGE_H + 3);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(MESSAGE_X, MESSAGE_Y, MESSAGE_W, MESSAGE_H);
        ctxFlip.font = "14px 'MS Pゴシック'";
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        for (var i = 0; i < warnMessages.length; i++) {
            ctxFlip.fillText(warnMessages[i], MESSAGE_X, MESSAGE_Y + 20 + 20 * i);
        }
        ctxFlip.fillText("(確認したら画面をクリックしてください)", MESSAGE_X, MESSAGE_Y + 20 + 20 * warnMessages.length);
    }
}

// 一定時間で消える情報連絡
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

// クリックするまで消えない情報連絡
CommonView.addWarn = function(addWarn) {
    if (CommonView.printWarnFlag() == false) {
        // 警告非表示状態からの最初のメッセージなら、古いメッセージクリア
        // (2行以上のメッセージ表示時の2行目以降なら、このifはfalse)
        CommonView.warns([]);
    }
    var warnMessages = CommonView.warns();
    warnMessages.push(addWarn);
    // メッセージが7個以上になったら最も古いものを削除
    if (warnMessages.length > 6) {
        warnMessages.shift();
    }
    CommonView.printWarnFlag(true);
}