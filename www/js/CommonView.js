//「具体的な画面クラス」のすべてに優先して定義される、画面系汎用メソッド定義クラス

var CommonView = function(x, y, border, appearTime) {
};

CommonView.staticCanvas = function() {
    if (typeof arguments.callee.cv == 'undefined') {
        arguments.callee.cv = document.getElementById('gameCanvas');
        arguments.callee.cv.setAttribute('width', window.innerWidth);
        arguments.callee.cv.setAttribute('height', window.innerHeight);
        arguments.callee.cv.style.visibility = "visible";
    }
    return arguments.callee.cv;
};

CommonView.staticCanvasFlip = function() {
    if (typeof arguments.callee.cvForFlip == 'undefined') {
        arguments.callee.cvForFlip = document.getElementById('gameCanvasFlip');
        arguments.callee.cvForFlip.setAttribute('width', window.innerWidth);
        arguments.callee.cvForFlip.setAttribute('height', window.innerHeight);
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

CommonView.printTutorialFlag = function(v) {
    if (typeof arguments.callee.printTutorialFlag == 'undefined') {
        arguments.callee.printTutorialFlag = false;
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.printTutorialFlag = v;
    }
    return arguments.callee.printTutorialFlag;
};

// チュートリアルを初回は表示するか?
CommonView.shouldTutorialFlag = function(v) {
    if (typeof arguments.callee.shouldTutorialFlag == 'undefined') {
        arguments.callee.shouldTutorialFlag = true;
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.shouldTutorialFlag = v;
    }
    return arguments.callee.shouldTutorialFlag;
};

// チュートリアル表示座標(-1はデフォルト)
CommonView.tutorialPoint = function(v) {
    if (typeof arguments.callee.tutorialPoint == 'undefined') {
        arguments.callee.tutorialPoint = {x: -1, y: -1, w: -1, h: -1};
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.tutorialPoint = v;
    }
    return arguments.callee.tutorialPoint;
};

// チュートリアル表示中の赤枠座標(-1は表示しない)
CommonView.redPoint = function(v) {
    if (typeof arguments.callee.redPoint == 'undefined') {
        arguments.callee.redPoint = {x: -1, y: -1, w: -1, h: -1};
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.redPoint = v;
    }
    return arguments.callee.redPoint;
};

// チュートリアル表示中の青枠座標(-1は表示しない)
CommonView.bluePoint = function(v) {
    if (typeof arguments.callee.bluePoint == 'undefined') {
        arguments.callee.bluePoint = {x: -1, y: -1, w: -1, h: -1};
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.bluePoint = v;
    }
    return arguments.callee.bluePoint;
};

// 表示済みのチュートリアルを格納
CommonView.printedTutorial = function(v) {
    if (typeof arguments.callee.printedTutorial == 'undefined') {
        arguments.callee.printedTutorial = new Array();
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.printedTutorial = v;
    }
    return arguments.callee.printedTutorial;
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

// 全画面汎用のチュートリアルメッセージ配列
CommonView.tutorials = function(v) {
    if (typeof arguments.callee.tutorialArray == 'undefined') {
        arguments.callee.tutorialArray = [];
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.tutorialArray = v;
    }
    return arguments.callee.tutorialArray;
};

// 全画面共通のアナウンスメッセージ表示 およびチュートリアル制御ボタン表示
CommonView.paintMessage = function(ctxFlip) {
    var nowMsgCounter = CommonView.msgCounter();
    var nowMessages = CommonView.messages();
    var warnMessages = CommonView.warns();
    var tutorialMessages = CommonView.tutorials();
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
        ctxFlip.fillText("【確認したら画面をタッチしてください。】", MESSAGE_X, MESSAGE_Y + 20 + 20 * warnMessages.length);
    }
    
    if (CommonView.printTutorialFlag() == true) {// チュートリアルメッセージを表示すべき
        var MESSAGE_X = (CommonView.tutorialPoint().x == -1 ? 20 : CommonView.tutorialPoint().x);
        var MESSAGE_Y = (CommonView.tutorialPoint().y == -1 ? 100 : CommonView.tutorialPoint().y);
        var MESSAGE_W = (CommonView.tutorialPoint().w == -1 ? 310 : CommonView.tutorialPoint().w);
        var MESSAGE_H = (CommonView.tutorialPoint().h == -1 ? 300 : CommonView.tutorialPoint().h);
        ctxFlip.fillStyle = 'rgb(239, 0, 0)';
        ctxFlip.fillRect(MESSAGE_X - 1, MESSAGE_Y - 1, MESSAGE_W + 3, MESSAGE_H + 3);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(MESSAGE_X, MESSAGE_Y, MESSAGE_W, MESSAGE_H);
        ctxFlip.font = "14px 'MS Pゴシック'";
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        for (var i = 0; i < tutorialMessages.length; i++) {
            ctxFlip.fillText(tutorialMessages[i], MESSAGE_X, MESSAGE_Y + 20 + 20 * i);
        }
        ctxFlip.fillText("【確認したら画面をタッチしてください。】", MESSAGE_X, MESSAGE_Y + 20 + 20 * tutorialMessages.length);
    }
    
    ctxFlip.fillStyle = 'rgb(127, 127, 127)';
    ctxFlip.fillRect(ALLVIEW_TUTORIALFLAG_X - 1, ALLVIEW_TUTORIALFLAG_Y - 1, ALLVIEW_TUTORIALFLAG_W + 2, ALLVIEW_TUTORIALFLAG_H + 2);
    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
    ctxFlip.fillRect(ALLVIEW_TUTORIALFLAG_X, ALLVIEW_TUTORIALFLAG_Y, ALLVIEW_TUTORIALFLAG_W, ALLVIEW_TUTORIALFLAG_H);
    ctxFlip.font = "11px 'MS Pゴシック'";
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    var txt = "初回に説明:";
    if (CommonView.shouldTutorialFlag() == true) {
        txt = txt + "ON";
    } else {
        ctxFlip.fillStyle = 'rgb(63, 63, 63)';
        txt = txt + "OFF";
    }
    ctxFlip.fillText(txt, ALLVIEW_TUTORIALFLAG_X, ALLVIEW_TUTORIALFLAG_Y + 10);

    ctxFlip.fillStyle = 'rgb(127, 127, 127)';
    ctxFlip.fillRect(ALLVIEW_TUTORIALFLAG_X - 1, ALLVIEW_TUTORIALFLAG_Y_PRINT - 1, ALLVIEW_TUTORIALFLAG_W + 2, ALLVIEW_TUTORIALFLAG_H + 2);
    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
    ctxFlip.fillRect(ALLVIEW_TUTORIALFLAG_X, ALLVIEW_TUTORIALFLAG_Y_PRINT, ALLVIEW_TUTORIALFLAG_W, ALLVIEW_TUTORIALFLAG_H);
    ctxFlip.font = "11px 'MS Pゴシック'";
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.fillText("説明表示", ALLVIEW_TUTORIALFLAG_X, ALLVIEW_TUTORIALFLAG_Y_PRINT + 10);
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

// クリックするまでチュートリアル表示(戻り値は実際に表示したか)
// onlyFirst…2回目以降は表示しない
CommonView.addTutorial = function(tutorialID, onlyFirst) {
    // 初回表示OFFの場合、手動でなく「初回自動表示」のチュートリアルは表示しない
    if (onlyFirst && !CommonView.shouldTutorialFlag()) {
        return false;
    }
    
    // 既に表示済みの場合、手動でなく「初回自動表示」のチュートリアルは表示しない
    if (onlyFirst && CommonView.printedTutorial().indexOf(tutorialID) != -1) {
        return false;
    }
    CommonView.tutorials([]);
    // 各表示位置を初期化
    CommonView.tutorialPoint({x: -1, y: -1, w: -1, h: -1});
    CommonView.redPoint({x: -1, y: -1, w: -1, h: -1});
    CommonView.bluePoint({x: -1, y: -1, w: -1, h: -1});
    TutorialMessage.getMessage(tutorialID, CommonView.tutorials());
    CommonView.printTutorialFlag(true);
    // 表示済みのチュートリアルに追加
    CommonView.printedTutorial().push(tutorialID);
    return true;
}