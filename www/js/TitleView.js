var TitleView = function() {
    this.tsArrayT1 = [];
    this.tsArrayR1 = [];
    this.tsArrayI1 = [];
    this.tsArrayT2 = [];
    this.tsArrayR2 = [];
    this.tsArrayU1 = [];
    this.tsArrayS1 = [];
    this.tsArrayT3 = [];
    this.tsArray31 = [];
    this.tsAllArray = [this.tsArrayT1, this.tsArrayR1, this.tsArrayI1, this.tsArrayT2, this.tsArrayR2, 
                        this.tsArrayU1, this.tsArrayS1, this.tsArrayT3, this.tsArray31];
    this.ENDCOUNTER = 1000;// ここに到達するまでは画面作りかけ状態
    this.MAXCOUNTER = 1100;// 画面完成後、ENDCOUNTER～MAXCOUNTERまでの値をぐるぐるしてアニメーションさせる
    this.state = TITLEVIEW_STATE_MAIN;
    this.tempLoadNum = -1;
};

TitleView.prototype.init = function () {
    for (var i = 0; i < tsArrayT.length; i++) {
        this.tsArrayT1[i] = $.extend(true, [], tsArrayT[i]);
        this.tsArrayT2[i] = $.extend(true, [], tsArrayT[i]);
        this.tsArrayT3[i] = $.extend(true, [], tsArrayT[i]);
    }
    for (var i = 0; i < tsArrayR.length; i++) {
        this.tsArrayR1[i] = $.extend(true, [], tsArrayR[i]);
        this.tsArrayR2[i] = $.extend(true, [], tsArrayR[i]);
    }
    for (var i = 0; i < tsArrayI.length; i++) {
        this.tsArrayI1[i] = $.extend(true, [], tsArrayI[i]);
    }
    for (var i = 0; i < tsArrayU.length; i++) {
        this.tsArrayU1[i] = $.extend(true, [], tsArrayU[i]);
    }
    for (var i = 0; i < tsArrayS.length; i++) {
        this.tsArrayS1[i] = $.extend(true, [], tsArrayS[i]);
    }
    for (var i = 0; i < tsArray3.length; i++) {
        this.tsArray31[i] = $.extend(true, [], tsArray3[i]);
    }
    
    for (var i = 0; i < tsArrayT.length; i++) {
        this.tsArrayT1[i].movex(30);
        this.tsArrayT1[i].movey(60);
    }
    for (var i = 0; i < tsArrayR.length; i++) {
        this.tsArrayR1[i].movex(155);
        this.tsArrayR1[i].movey(60);
        this.tsArrayR1[i].moveAppearTime(40);
    }
    for (var i = 0; i < tsArrayI.length; i++) {
        this.tsArrayI1[i].movex(280);
        this.tsArrayI1[i].movey(60);
        this.tsArrayI1[i].moveAppearTime(80);
    }
    for (var i = 0; i < tsArrayT.length; i++) {
        this.tsArrayT2[i].movex(5);
        this.tsArrayT2[i].movey(260);
        this.tsArrayT2[i].moveAppearTime(320);
    }
    for (var i = 0; i < tsArrayR.length; i++) {
        this.tsArrayR2[i].movex(80);
        this.tsArrayR2[i].movey(260);
        this.tsArrayR2[i].moveAppearTime(360);
    }
    for (var i = 0; i < tsArrayU.length; i++) {
        this.tsArrayU1[i].movex(155);
        this.tsArrayU1[i].movey(260);
        this.tsArrayU1[i].moveAppearTime(400);
    }
    for (var i = 0; i < tsArrayS.length; i++) {
        this.tsArrayS1[i].movex(230);
        this.tsArrayS1[i].movey(260);
        this.tsArrayS1[i].moveAppearTime(440);
    }
    for (var i = 0; i < tsArrayT.length; i++) {
        this.tsArrayT3[i].movex(305);
        this.tsArrayT3[i].movey(260);
        this.tsArrayT3[i].moveAppearTime(480);
    }
    for (var i = 0; i < tsArray3.length; i++) {
        this.tsArray31[i].movex(140);
        this.tsArray31[i].movey(450);
        this.tsArray31[i].moveAppearTime(600);
    }
    TitleStar.titleCounter(0);
    for (var key1 in this.tsAllArray) {
        var eachStars = this.tsAllArray[key1];
        for (var key2 in eachStars) {
            var eachStar = eachStars[key2];
            eachStar.init();
        }
    }
    this.state = TITLEVIEW_STATE_MAIN;
    this.tempLoadNum = -1;
}

TitleView.prototype.calc = function() {
    TitleStar.titleCounter(TitleStar.titleCounter() + 1);
    if (this.MAXCOUNTER == TitleStar.titleCounter()) {
        TitleStar.titleCounter(this.ENDCOUNTER);
    }
    for (var key1 in this.tsAllArray) {
        var eachStars = this.tsAllArray[key1];
        for (var key2 in eachStars) {
            var eachStar = eachStars[key2];
            eachStar.calc();
        }
    }
    return this.checkCalc();
}

TitleView.prototype.checkCalc = function() {
    if (TitleStar.titleCounter() >= this.ENDCOUNTER) {
        return 1;
    } else {
        return 0;
    }
}

TitleView.prototype.paint = function () {
    
    var ctxFlip = CommonView.staticCanvasFlip().getContext('2d');
    ctxFlip.clearRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    ctxFlip.fillStyle = 'rgb(15, 15, 15)';
    ctxFlip.fillRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    
    var totalWidth = $(window).width();
    var totalHeight = $(window).height();
    
    if (TitleStar.titleCounter() >= 1000) {
        if (Math.abs(TitleStar.titleCounter() - 1025) < 2) {
            ctxFlip.fillStyle = 'rgb(239, 239, 239)';
        } else if (Math.abs(TitleStar.titleCounter() - 1025) < 3) {
            ctxFlip.fillStyle = 'rgb(207, 215, 215)';
        } else if (Math.abs(TitleStar.titleCounter() - 1025) < 5) {
            ctxFlip.fillStyle = 'rgb(175, 191, 191)';
        } else if (Math.abs(TitleStar.titleCounter() - 1025) < 8) {
            ctxFlip.fillStyle = 'rgb(143, 167, 167)';
        } else {
            ctxFlip.fillStyle = 'rgb(111, 143, 143)';
        }
        ctxFlip.fillRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    } else if (TitleStar.titleCounter() > 250) {
        ctxFlip.fillStyle = 'rgb(191, 223, 223)';
        for (var i = 0; i < 10; i++) {
            var left = totalWidth / 2;
            var top = totalHeight / 10 * i;
            var halfWidth = Math.min(5 * i + (TitleStar.titleCounter() - 250) / 3, totalWidth / 2 + 1);
            ctxFlip.fillRect(left - halfWidth, top, 2 * halfWidth, totalHeight / 10);
        }
        ctxFlip.fillStyle = 'rgb(111, 143, 143)';
        for (var i = 0; i < 10; i++) {
            if (TitleStar.titleCounter() > 270) {
                var left = totalWidth / 2;
                var top = totalHeight / 10 * i;
                var halfWidth = Math.min(5 * i + (TitleStar.titleCounter() - 270) / 3, totalWidth / 2 + 1);
                ctxFlip.fillRect(left - halfWidth, top, 2 * halfWidth, totalHeight / 10);
            }
        }
    } else if (TitleStar.titleCounter() > 100) {
        ctxFlip.fillStyle = 'rgb(191, 223, 223)';
        for (var i = 0; i < Math.min((TitleStar.titleCounter() - 100) / 10, 10); i++) {
            var left = totalWidth / 2;
            var top = totalHeight / 10 * i;
            ctxFlip.fillRect(left, top, 3, totalHeight / 10);
        }
    }
    
    for (var key1 in this.tsAllArray) {
        var eachStars = this.tsAllArray[key1];
        for (var key2 in eachStars) {
            var eachStar = eachStars[key2];
            eachStar.paintMe(ctxFlip);
        }
    }
    
    if (this.state == TITLEVIEW_STATE_MAIN) {
        ctxFlip.font = 'bold 24px Century Gothic';
        ctxFlip.strokeStyle = 'rgb(239, 31, 0)';
        if (TitleStar.titleCounter() >= this.ENDCOUNTER) {
            ctxFlip.fillStyle = 'rgb(239, 63, 31)';
            ctxFlip.fillRect(TITLEVIEW_NEWGAME_X - 2, TITLEVIEW_NEWGAME_Y - 1, TITLEVIEW_NEWGAME_WIDTH + 3, TITLEVIEW_NEWGAME_HEIGHT + 3);
            ctxFlip.fillStyle = 'rgb(31, 63, 239)';
            ctxFlip.fillRect(TITLEVIEW_CONTGAME_X - 2, TITLEVIEW_CONTGAME_Y - 1, TITLEVIEW_CONTGAME_WIDTH + 3, TITLEVIEW_CONTGAME_HEIGHT + 3);
            ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            ctxFlip.fillRect(TITLEVIEW_NEWGAME_X, TITLEVIEW_NEWGAME_Y, TITLEVIEW_NEWGAME_WIDTH, TITLEVIEW_NEWGAME_HEIGHT);
            ctxFlip.fillRect(TITLEVIEW_CONTGAME_X, TITLEVIEW_CONTGAME_Y, TITLEVIEW_CONTGAME_WIDTH, TITLEVIEW_CONTGAME_HEIGHT);
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.font = "20px 'MS Pゴシック'";
            ctxFlip.fillText('NEW GAME', TITLEVIEW_NEWGAME_X, TITLEVIEW_NEWGAME_Y + 30);
            ctxFlip.fillText('CONTINUE', TITLEVIEW_CONTGAME_X, TITLEVIEW_CONTGAME_Y + 30);
        }
    }
    
    if (this.state == TITLEVIEW_STATE_LOAD) {
        ctxFlip.fillStyle = 'rgb(63, 63, 223)';
        ctxFlip.fillRect(EVENTVIEW_COMMAND_X - 3, EVENTVIEW_BUYSELLCOMMAND_Y - 5, (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST) * 6 + 10, EVENTVIEW_COMMAND_H * 2 + EVENTVIEW_BUYSELLCOMMAND_INTERVAL + 10);
        // 1～6までと7～12で表示段を分ける
        var maxI = 12;
        for (var i = 1; i <= maxI; i++) {
            var x = EVENTVIEW_COMMAND_X + (i - 1) * (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST);
            var y = EVENTVIEW_BUYSELLCOMMAND_Y;
            if (i > 6) {
                x = EVENTVIEW_COMMAND_X + (i - 7) * (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST);
                y = EVENTVIEW_BUYSELLCOMMAND_Y + EVENTVIEW_COMMAND_H + EVENTVIEW_BUYSELLCOMMAND_INTERVAL;
            }
            var w = EVENTVIEW_COMMAND_W;
            var h = EVENTVIEW_COMMAND_H;
            
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            var isHighLight = (i == this.tempLoadNum);
            if (isHighLight > 0) {
                ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - TitleStar.titleCounter()) / 3);
            }
            ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
            var checks = SaveFileIO.checkFile(i);
            if ("timeStamp" in checks) {
                ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            } else {
                ctxFlip.fillStyle = 'rgb(191, 191, 191)';
            }
            ctxFlip.fillRect(x, y, w, h);
            ctxFlip.font = "12px 'MS Pゴシック'";
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.fillText(i, x + 10, y + 17);
        }
        
        //メッセージウィンドウの表示
        ctxFlip.fillStyle = 'rgb(239, 15, 239)';
        var textMargin = 2 + Math.floor((TitleStar.titleCounter() % 50 - 25) / 10);
        ctxFlip.fillRect(EVENTVIEW_TEXT_X - textMargin, EVENTVIEW_TEXT_Y - textMargin, EVENTVIEW_TEXT_W + 2 * textMargin, EVENTVIEW_TEXT_H / 2 + 2 * textMargin);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y, EVENTVIEW_TEXT_W, EVENTVIEW_TEXT_H / 2);
    
        ctxFlip.font = "16px 'MS Pゴシック'";
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        var checks = SaveFileIO.checkFile(this.tempLoadNum);
        if ("timeStamp" in checks) {
            ctxFlip.fillText(checks.timeStamp, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15);
        } else {
            ctxFlip.fillText("ファイルがありません。", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15);
        }
        
        // コマンド表示
        for (var i = 0; i <= 1; i++) {
            ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - TitleStar.titleCounter()) / 3);
            var txtX = EVENTVIEW_COMMANDTXT_X;
            var txtY = EVENTVIEW_COMMANDTXT_Y + i * EVENTVIEW_COMMANDINTERVAL;
            ctxFlip.fillRect(txtX - 1, txtY - 1, EVENTVIEW_COMMANDTXT_W + 3, EVENTVIEW_COMMANDTXT_H + 3);
            ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            ctxFlip.fillRect(txtX, txtY, EVENTVIEW_COMMANDTXT_W, EVENTVIEW_COMMANDTXT_H);
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.font = "16px 'MS Pゴシック'";
            var commandTxt = "";
            switch(i) {
            case 0:arguments
                commandTxt = "決定";
                break;
            case 1:arguments
                commandTxt = "戻る";
                break;
            }
            ctxFlip.fillText(commandTxt, txtX, txtY + 20);
        }
    }
    // (全画面共通)アナウンスメッセージ表示
    CommonView.paintMessage(ctxFlip);
    
    var imageData = ctxFlip.getImageData(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    var ctx = CommonView.staticCanvas().getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}

TitleView.prototype.clk = function(mouseX, mouseY, ev, ud, itemMap) {
    if (mouseX >= ALLVIEW_TUTORIALFLAG_X && mouseX <= ALLVIEW_TUTORIALFLAG_X + ALLVIEW_TUTORIALFLAG_W &&
        mouseY >= ALLVIEW_TUTORIALFLAG_Y && mouseY <=ALLVIEW_TUTORIALFLAG_Y + ALLVIEW_TUTORIALFLAG_H) {
        // (全画面共通)初回チュートリアル表示非表示の切り替え
        CommonView.shouldTutorialFlag(!CommonView.shouldTutorialFlag());
        return -1;
    }
    if (1 != this.checkCalc()) {
        // 演出を飛ばす
        for (;;) {
            var retCalc = 0;
            retCalc = this.calc();
            if (1 == retCalc){
                break;
            }
        }
        return -1;
    }
    if (this.state == TITLEVIEW_STATE_MAIN) {
        if (mouseX >= TITLEVIEW_NEWGAME_X && 
            mouseX <= TITLEVIEW_NEWGAME_X + TITLEVIEW_NEWGAME_WIDTH &&
            mouseY >= TITLEVIEW_NEWGAME_Y &&
            mouseY <= TITLEVIEW_NEWGAME_Y + TITLEVIEW_NEWGAME_HEIGHT) {
            // ゲーム新規開始
            ev.gameStart();
            //ev.init(EVENTVIEW_EVENTID_STAGE2_YAKUNIN);
            ev.init(EVENTVIEW_EVENTID_OP);
            ud.length = 0;
            itemMap.clear();
            var tempItem = new ItemDefine();
            for (var i = ITEM_TYPE_SWORD; i <= ITEM_TYPE_DOGU; i++) {
                for (var j = 0; j < ITEM_SYURUI_MAX; j++) {
                    ItemDefine.init(i, j, tempItem);
                    itemMap.set(tempItem.namae, 0);
                }
            }
            if (CommonView.addTutorial(COMMONVIEW_TUTORIALID_GSTART, true)) {
                // チュートリアル初回表示時は、なにもせずリターン
                return -1;   
            }
            return GAMEMODE_EVENT;
        } else if (mouseX >= TITLEVIEW_CONTGAME_X && 
            mouseX <= TITLEVIEW_CONTGAME_X + TITLEVIEW_CONTGAME_WIDTH &&
            mouseY >= TITLEVIEW_CONTGAME_Y &&
            mouseY <= TITLEVIEW_CONTGAME_Y + TITLEVIEW_CONTGAME_HEIGHT){
            this.state = TITLEVIEW_STATE_LOAD;
            this.tempLoadNum = -1;
            return -1;
        }
    }
    if (this.state == TITLEVIEW_STATE_LOAD) {
        if (mouseX >= EVENTVIEW_COMMAND_X && mouseX <= EVENTVIEW_COMMAND_X + 6 * EVENTVIEW_COMMAND_W + 5 * EVENTVIEW_COMMAND_DIST &&
           mouseY >= EVENTVIEW_BUYSELLCOMMAND_Y && mouseY <= EVENTVIEW_BUYSELLCOMMAND_Y + EVENTVIEW_COMMAND_H * 2 + EVENTVIEW_BUYSELLCOMMAND_INTERVAL) {
            var x = Math.floor((mouseX - EVENTVIEW_COMMAND_X) / (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST));
            var nowIndex = -1;
            // セーブファイル選択(1～6)
            if (mouseY >= EVENTVIEW_BUYSELLCOMMAND_Y && mouseY <= EVENTVIEW_BUYSELLCOMMAND_Y + EVENTVIEW_COMMAND_H) {
                if (x >= 0 && x <= 5) {
                    nowIndex = x + 1;
                }
            }
            // セーブファイル選択(7～12)
            if (mouseY >= EVENTVIEW_BUYSELLCOMMAND_Y + EVENTVIEW_COMMAND_H + EVENTVIEW_BUYSELLCOMMAND_INTERVAL && mouseY <= EVENTVIEW_BUYSELLCOMMAND_Y + 2 * EVENTVIEW_COMMAND_H + EVENTVIEW_BUYSELLCOMMAND_INTERVAL) {
                if (x >= 0 && x <= 5) {
                    nowIndex = x + 7;
                }
            }
            var checks = SaveFileIO.checkFile(nowIndex);
            if (!("timeStamp" in checks)) {
                CommonView.addWarn("その番号のファイルがありません!");
                return -1;
            }
            this.tempLoadNum = nowIndex;
            return -1;
        }
        // 決定、戻るボタンを押す
        if (mouseX >= EVENTVIEW_COMMANDTXT_X && mouseX <= EVENTVIEW_COMMANDTXT_X + EVENTVIEW_COMMANDTXT_W &&
           mouseY >= EVENTVIEW_COMMANDTXT_Y && mouseY <= EVENTVIEW_COMMANDTXT_Y + EVENTVIEW_COMMANDTXT_H * 2 + EVENTVIEW_COMMANDINTERVAL) {
            var commandNum = Math.floor((mouseY - EVENTVIEW_COMMANDTXT_Y) / EVENTVIEW_COMMANDINTERVAL);
            switch(commandNum) {
                case 0:arguments//次へ
                    if (this.tempLoadNum >= 0) {
                        ev.gameStart();
                        SaveFileIO.loadFile(this.tempLoadNum, ev, ud, itemMap);
                        ev.comState = EVENTVIEW_COMSTATE_PRECHOICE;
                        return GAMEMODE_EVENT;
                    } else {
                        CommonView.addWarn("正しいファイル番号を選んでください。");
                        return -1;
                    }
                break;
                case 1:arguments//戻る
                    this.state = TITLEVIEW_STATE_MAIN;
                    return -1;
                break;
                default:arguments
                    // なにもせず先に進む
                break;
            }
        }
    }
}