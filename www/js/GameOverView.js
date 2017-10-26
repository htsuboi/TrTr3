var GameOverView = function() {
    this.tsArrayG1 = [];
    this.tsArrayA1 = [];
    this.tsArrayM1 = [];
    this.tsArrayE1 = [];
    this.tsArrayO1 = [];
    this.tsArrayV1 = [];
    this.tsArrayE2 = [];
    this.tsArrayR1 = [];
    this.tsAllArray = [this.tsArrayG1, this.tsArrayA1, this.tsArrayM1, this.tsArrayE1, 
                        this.tsArrayO1, this.tsArrayV1, this.tsArrayE2, this.tsArrayR1];
    this.ENDCOUNTER = 700;// ここに到達するまでは画面作りかけ状態
    this.MAXCOUNTER = 750;// 画面完成後、ENDCOUNTER～MAXCOUNTERまでの値をぐるぐるしてアニメーションさせる
};

GameOverView.prototype.init = function () {
    for (var i = 0; i < tsArrayG.length; i++) {
        this.tsArrayG1[i] = $.extend(true, [], tsArrayG[i]);
    }
    for (var i = 0; i < tsArrayA.length; i++) {
        this.tsArrayA1[i] = $.extend(true, [], tsArrayA[i]);
    }
    for (var i = 0; i < tsArrayM.length; i++) {
        this.tsArrayM1[i] = $.extend(true, [], tsArrayM[i]);
    }
    for (var i = 0; i < tsArrayE.length; i++) {
        this.tsArrayE1[i] = $.extend(true, [], tsArrayE[i]);
        this.tsArrayE2[i] = $.extend(true, [], tsArrayE[i]);
    }
    for (var i = 0; i < tsArrayO.length; i++) {
        this.tsArrayO1[i] = $.extend(true, [], tsArrayO[i]);
    }
    for (var i = 0; i < tsArrayV.length; i++) {
        this.tsArrayV1[i] = $.extend(true, [], tsArrayV[i]);
    }
    for (var i = 0; i < tsArrayR.length; i++) {
        this.tsArrayR1[i] = $.extend(true, [], tsArrayR[i]);
    }
    
    for (var i = 0; i < tsArrayG.length; i++) {
        this.tsArrayG1[i].movex(10);
        this.tsArrayG1[i].movey(60);
    }
    for (var i = 0; i < tsArrayA.length; i++) {
        this.tsArrayA1[i].movex(100);
        this.tsArrayA1[i].movey(60);
    }
    for (var i = 0; i < tsArrayM.length; i++) {
        this.tsArrayM1[i].movex(190);
        this.tsArrayM1[i].movey(60);
    }
    for (var i = 0; i < tsArrayE.length; i++) {
        this.tsArrayE1[i].movex(280);
        this.tsArrayE1[i].movey(60);
    }
    for (var i = 0; i < tsArrayO.length; i++) {
        this.tsArrayO1[i].movex(10);
        this.tsArrayO1[i].movey(260);
    }
    for (var i = 0; i < tsArrayV.length; i++) {
        this.tsArrayV1[i].movex(100);
        this.tsArrayV1[i].movey(260);
    }
    for (var i = 0; i < tsArrayE.length; i++) {
        this.tsArrayE2[i].movex(190);
        this.tsArrayE2[i].movey(260);
    }
    for (var i = 0; i < tsArrayR.length; i++) {
        this.tsArrayR1[i].movex(280);
        this.tsArrayR1[i].movey(260);
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

GameOverView.prototype.calc = function() {
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
}

GameOverView.prototype.paint = function () {
    
    var ctxFlip = CommonView.staticCanvasFlip().getContext('2d');
    ctxFlip.clearRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    ctxFlip.fillStyle = 'rgb(15, 15, 15)';
    ctxFlip.fillRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    
    var totalWidth = $(window).width();
    var totalHeight = $(window).height();
    
    if (TitleStar.titleCounter() >= 650) {
        ctxFlip.fillStyle = 'rgb(63, 63, 63)';
    } else if (TitleStar.titleCounter() > 550) {
        ctxFlip.fillStyle = 'rgb(79, 79, 79)';
    } else if (TitleStar.titleCounter() > 450) {
        ctxFlip.fillStyle = 'rgb(95, 95, 95)';
    } else if (TitleStar.titleCounter() > 350) {
        ctxFlip.fillStyle = 'rgb(111, 111, 111)';
    } else if (TitleStar.titleCounter() > 250) {
        ctxFlip.fillStyle = 'rgb(127, 127, 127)';
    } else if (TitleStar.titleCounter() > 150) {
        ctxFlip.fillStyle = 'rgb(143, 143, 143)';
    } else {
        ctxFlip.fillStyle = 'rgb(159, 159, 159)';
    }
    ctxFlip.fillRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    
    for (var key1 in this.tsAllArray) {
        var eachStars = this.tsAllArray[key1];
        for (var key2 in eachStars) {
            var eachStar = eachStars[key2];
            eachStar.paintMe(ctxFlip);
        }
    }

    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    if (TitleStar.titleCounter() >= 300) {
        for (var i = 0; i < 10; i++) {
            var x = i * totalWidth / 10;
            var downSpeed = (TitleStar.titleCounter() - 300) / 60;
            var height = 15 + Math.min(totalHeight, downSpeed * (TitleStar.titleCounter() - 300) - 6 * i);
            ctxFlip.fillRect(x, 0, totalWidth / 10 + 1, height);
        }
    }
    
    // (全画面共通)アナウンスメッセージ表示
    TitleStar.paintMessage(ctxFlip);
    
    var imageData = ctxFlip.getImageData(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    var ctx = CommonView.staticCanvas().getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}

GameOverView.prototype.clk = function(mouseX, mouseY) {
    return GAMEMODE_TITLE;
}