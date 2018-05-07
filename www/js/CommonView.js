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

// 演出用カウンタ
CommonView.paintCounter = function(v) {
    if (typeof arguments.callee.paintCount == 'undefined') {
        arguments.callee.paintCount = 0;
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.paintCount = v;
    }
    return arguments.callee.paintCount;
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

// チュートリアル表示中の紫枠座標(-1は表示しない)
CommonView.purplePoint = function(v) {
    if (typeof arguments.callee.purplePoint == 'undefined') {
        arguments.callee.purplePoint = {x: -1, y: -1, w: -1, h: -1};
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.purplePoint = v;
    }
    return arguments.callee.purplePoint;
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
    CommonView.paintCounter(CommonView.paintCounter() + 1);
    if (CommonView.paintCounter() == ALLVIEW_PAINTCOUNTER_MAX) {
        CommonView.paintCounter(0);
    }
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
        var MESSAGE_W = 320;
        var MESSAGE_H = Math.max(150, 20 * (warnMessages.length + 1) + 5);
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
        ctxFlip.fillStyle = 'rgb(127, 127, 127)';
        if ((Math.floor(CommonView.paintCounter() / 24) % 2) == 1) {
            ctxFlip.fillStyle = 'rgb(191, 191, 191)';
        }
        
        var margin = Math.abs((Math.floor(CommonView.paintCounter() / 12) % 5 - 2));
        ctxFlip.fillRect(MESSAGE_X - 2 * margin, MESSAGE_Y - 2 * margin, MESSAGE_W + 4 * margin, MESSAGE_H + 4 * margin);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(MESSAGE_X, MESSAGE_Y, MESSAGE_W, MESSAGE_H);
        ctxFlip.font = "14px 'MS Pゴシック'";
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        for (var i = 0; i < tutorialMessages.length; i++) {
            ctxFlip.fillText(tutorialMessages[i], MESSAGE_X, MESSAGE_Y + 20 + 20 * i);
        }
        ctxFlip.fillText("【確認したら画面をタッチしてください。】", MESSAGE_X, MESSAGE_Y + 20 + 20 * tutorialMessages.length);
        
        if (CommonView.redPoint().x != -1) {
            var red_X = CommonView.redPoint().x - margin;
            var red_Y = CommonView.redPoint().y - margin;
            var red_W = CommonView.redPoint().w + 2 * margin;
            var red_H = CommonView.redPoint().h + 2 * margin;
            ctxFlip.strokeStyle = 'rgb(239, 0, 0)';
            ctxFlip.strokeRect(red_X, red_Y, red_W, red_H);
        }
        
        if (CommonView.bluePoint().x != -1) {
            var blue_X = CommonView.bluePoint().x - margin;
            var blue_Y = CommonView.bluePoint().y - margin;
            var blue_W = CommonView.bluePoint().w + 2 * margin;
            var blue_H = CommonView.bluePoint().h + 2 * margin;
            ctxFlip.strokeStyle = 'rgb(0, 0, 239)';
            ctxFlip.strokeRect(blue_X, blue_Y, blue_W, blue_H);
        }
        
        if (CommonView.purplePoint().x != -1) {
            var purple_X = CommonView.purplePoint().x - margin;
            var purple_Y = CommonView.purplePoint().y - margin;
            var purple_W = CommonView.purplePoint().w + 2 * margin;
            var purple_H = CommonView.purplePoint().h + 2 * margin;
            ctxFlip.strokeStyle = 'rgb(239, 0, 239)';
            ctxFlip.strokeRect(purple_X, purple_Y, purple_W, purple_H);
        }
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

    /*ctxFlip.fillStyle = 'rgb(127, 127, 127)';
    ctxFlip.fillRect(ALLVIEW_TUTORIALFLAG_X - 1, ALLVIEW_TUTORIALFLAG_Y_PRINT - 1, ALLVIEW_TUTORIALFLAG_W + 2, ALLVIEW_TUTORIALFLAG_H + 2);
    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
    ctxFlip.fillRect(ALLVIEW_TUTORIALFLAG_X, ALLVIEW_TUTORIALFLAG_Y_PRINT, ALLVIEW_TUTORIALFLAG_W, ALLVIEW_TUTORIALFLAG_H);
    ctxFlip.font = "11px 'MS Pゴシック'";
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.fillText("説明表示", ALLVIEW_TUTORIALFLAG_X, ALLVIEW_TUTORIALFLAG_Y_PRINT + 10);*/
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
    CommonView.paintCounter(0);
    var warnMessages = CommonView.warns();
    warnMessages.push(addWarn);
    // メッセージが11個以上になったら最も古いものを削除
    if (warnMessages.length > 10) {
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
    CommonView.paintCounter(0);
    
    // 既に表示済みの場合、手動でなく「初回自動表示」のチュートリアルは表示しない
    if (onlyFirst && CommonView.printedTutorial().indexOf(tutorialID) != -1) {
        return false;
    }
    CommonView.tutorials([]);
    // 各表示位置を初期化
    CommonView.tutorialPoint({x: -1, y: -1, w: -1, h: -1});
    CommonView.redPoint({x: -1, y: -1, w: -1, h: -1});
    CommonView.bluePoint({x: -1, y: -1, w: -1, h: -1});
    CommonView.purplePoint({x: -1, y: -1, w: -1, h: -1});
    TutorialMessage.getMessage(tutorialID, CommonView.tutorials());
    CommonView.printTutorialFlag(true);
    // 表示済みのチュートリアルに追加
    CommonView.printedTutorial().push(tutorialID);
    return true;
}

// BattleView, EventView双方で使用するためここで記述
CommonView.unitMsg = function (u, ctxFlip, maxCounter, counter, focusUnit, isNoAdjust, isFace, isBattleView, ev, bv) {
    var x = (isBattleView ? BATTLEVIEW_UNITTXT_X : EVENTVIEW_UNITTXT_X);
    var y = (isBattleView ? BATTLEVIEW_UNITTXT_Y : EVENTVIEW_UNITTXT_Y);
    var w = (isBattleView ? BATTLEVIEW_UNITTXT_W : EVENTVIEW_UNITTXT_W);
    var h = (isBattleView ? BATTLEVIEW_UNITTXT_H : EVENTVIEW_UNITTXT_H);
    ctxFlip.fillStyle = getGladColorBlue((maxCounter - counter) / 6);
    ctxFlip.fillRect(x - 1, y - 1, w + 3, h + 3);
    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
    ctxFlip.fillRect(x, y, w, h);
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.font = "11px 'MS Pゴシック'";
    var battleStatus = u.calcBattleStr();// 装備品込みのステータスと装備名を取得
    if (isNoAdjust) {
        // なにも装備しないステータス(EventViewからコールされた場合こちら)
    } else if (focusUnit == null) {
        // 上記以外でfocusUnit == nullはユニット逃亡中など非常に異例なので、なにも表示しなくていい
        return;
    } else if (focusUnit.equalUnit(u) && (bv.commandState == BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE || bv.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE)) {
        // 武器選択中/ターゲット選択中の手番ユニットのみ、実装備武器でなく「装備予定武器」を装備したステータス表示
        if (bv.tempEqSyurui == -1) {
            // 表示中の武器タイプで、装備可能なアイテムすべて非所持→現在の装備品のステータスを出す
        } else {
            battleStatus = u.calcBattleStr(bv.tempEqTypeForEquip, bv.tempEqSyurui);
        }
    }
    
    var yInterval = BATTLEVIEW_UNITTXT_YINTERVAL;//1行の高さ
    var lineCount = 1;//何行目か
    ctxFlip.fillText(u.namae, x, y + 20);
    ctxFlip.fillText("Lv" + u.lv, x + 75, y + 20);//Lv
    ctxFlip.fillText(battleStatus.namae, x, y + 20 + lineCount++ * yInterval);//装備品
    if (u.side == BATTLE_MIKATA) {
        var equipRing = RingDefine.getEquipRing(u, ev);
        var ringData = "";
        if (equipRing != null) {
            ringData = RingDefine.getRingName(equipRing.id) + "(" + equipRing.unitRemain + ")";
        }
        ctxFlip.fillText(ringData, x, y + 20 + lineCount++ * yInterval);//ドロップアイテム
    } else {
        var dropItemText = " ";
        if (u.dropItem != -1) {
            var tempItem = new ItemDefine();
            ItemDefine.init(ITEM_TYPE_DOGU, u.dropItem, tempItem);
            dropItemText = "盗:" + tempItem.namae;
        }
        ctxFlip.fillText(dropItemText, x, y + 20 + lineCount++ * yInterval);//ドロップアイテム
    }
    if (u.hp == 0) {
        ctxFlip.fillStyle = 'rgb(255, 0, 0)';
    }
    ctxFlip.fillText("HP:" + u.hp + "/" + u.mhpObj.now, x, y + 20 + lineCount++ * yInterval);
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    if (u.side == BATTLE_MIKATA) {
        ctxFlip.fillText("気力:" + u.sp + "/" + u.msp, x, y + 20 + lineCount++ * yInterval);
    } else {
        lineCount++;//見た目合わせのためlineCount++だけは必要
    }
    ctxFlip.fillText("力　:" + u.strObj.now + "→" + battleStatus.str, x, y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("魔力:" + u.magObj.now + "→" + battleStatus.mag, x, y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("守備:" + u.defObj.now + "→" + battleStatus.def, x, y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("魔防:" + u.mdfObj.now + "→" + battleStatus.mdf, x, y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("命中:" + u.hitObj.now + "→" + battleStatus.hit, x, y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("回避:" + u.avoObj.now + "→" + battleStatus.avo, x, y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("割合攻撃:" + u.rat + "→" + battleStatus.rat, x, y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("割合軽減:" + u.rdf + "→" + battleStatus.rdf, x, y + 20 + lineCount++ * yInterval);
    if (u.side == BATTLE_MIKATA) {
        ctxFlip.fillText("耐毒:" + u.regPoison, x, y + 20 + lineCount++ * yInterval);
        ctxFlip.fillText("耐痺:" + u.regStun, x, y + 20 + lineCount++ * yInterval);
    } else {
        lineCount += 2;
    }
    ctxFlip.fillText("移動1:" + u.m1Cost, x, y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("移動2:" + u.m2Cost, x, y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("射程+:" + u.rangeCost, x, y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("再行動:" + u.exAtCost, x, y + 20 + lineCount++ * yInterval + 7);
    
    for (var i = 0; i < 3; i++) {
        ctxFlip.fillStyle = (u.skillON[i] == true ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 255)');
        ctxFlip.fillText((u.side == BATTLE_MIKATA ? "消費" + SkillDefine.getSkillCost(u.skills[i]) : ""), x + 65, y + 20 + lineCount * yInterval + 15);
        ctxFlip.fillText(SkillDefine.getSkillName(u.skills[i]), x, y + 20 + lineCount++ * yInterval + 15);
    }
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.fillText("Exp:" + u.exp, x, y + 25 + lineCount++ * yInterval + 15);
    if (u.side == BATTLE_MIKATA && u.lv < MAX_LV) {
        ctxFlip.fillText("(Next:" + u.calcExp(u.lv + 1) + ")", x, y + 25 + lineCount++ * yInterval + 15);
    }
    if (u.side == BATTLE_MIKATA) {
        for (var i = ITEM_TYPE_SWORD; i <= ITEM_TYPE_EARTH; i++) {
            if (u.getItemIndex(i) >= 0) {
                ctxFlip.fillText(ItemDefine.getItemText(i) + ":" + u.weaps[i], x, y + 30 + lineCount++ * yInterval + 15);
            }
        }
    }
    if (isFace) {
        // ユニット顔グラ表示
        ctxFlip.drawImage(UnitDefine.getCharaImg(u.pSyurui), u.px, u.py, 256, 320, BATTLEVIEW_UNITPAINT_X, BATTLEVIEW_UNITPAINT_Y, 128, 160);
    }
};