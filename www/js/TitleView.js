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
    return this.checkCalc()
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
    
    // (全画面共通)アナウンスメッセージ表示
    CommonView.paintMessage(ctxFlip);
    
    var imageData = ctxFlip.getImageData(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    var ctx = CommonView.staticCanvas().getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}

TitleView.prototype.clk = function(mouseX, mouseY) {
    if (1 != this.checkCalc()) {
        // 演出を飛ばす
        for (;;) {
            var retCalc = 0;
            retCalc = this.calc();
            if (1 == retCalc){
                break;
            }
        }
    } else if (mouseX >= TITLEVIEW_NEWGAME_X && 
        mouseX <= TITLEVIEW_NEWGAME_X + TITLEVIEW_NEWGAME_WIDTH &&
        mouseY >= TITLEVIEW_NEWGAME_Y &&
        mouseY <= TITLEVIEW_NEWGAME_Y + TITLEVIEW_NEWGAME_HEIGHT) {
        return GAMEMODE_BATTLE;
        //SaveFileIO.loadFile();
        //return -1;
    } else if (mouseX >= TITLEVIEW_CONTGAME_X && 
        mouseX <= TITLEVIEW_CONTGAME_X + TITLEVIEW_CONTGAME_WIDTH &&
        mouseY >= TITLEVIEW_CONTGAME_Y &&
        mouseY <= TITLEVIEW_CONTGAME_Y + TITLEVIEW_CONTGAME_HEIGHT){
        return GAMEMODE_GAMEOVER;
        //SaveFileIO.saveFile();
        //return -1;
    }
}