var EventView = function() {
    this.state = EVENTVIEW_COMSTATE_PRECHOICE;
    this.ENDCOUNTER = 1000;// ここに到達するまでは画面作りかけ状態
    this.MAXCOUNTER = 1100;// 画面完成後、ENDCOUNTER～MAXCOUNTERまでの値をぐるぐるしてアニメーションさせる
};

EventView.prototype.init = function () {
    this.counter = 0;
    this.state = EVENTVIEW_COMSTATE_PRECHOICE;
}

EventView.prototype.calc = function(ud, itemMap) {
    this.counter++;
    if (this.counter > this.MAXCOUNTER) {
        this.counter = this.ENDCOUNTER;
    }
}

EventView.prototype.paint = function(ud, itemMap) {
    
    var ctxFlip = CommonView.staticCanvasFlip().getContext('2d');
    ctxFlip.clearRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    ctxFlip.fillStyle = 'rgb(239, 239, 239)';
    ctxFlip.fillRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    for (var i = 0; i < 10; i ++) {
        var x = 50 + (10 + Math.abs(this.counter % 100 - 50) / 30) * i + Math.floor(Math.abs(this.counter % 100 - 50) / 5);
        var y = x;
        var w = CommonView.staticCanvasFlip().width - 2 * x;
        var h = CommonView.staticCanvasFlip().height - 2 * y;
        if (i % 4 == 2) {
            ctxFlip.fillStyle = 'rgb(179, 219, 239)';
        } else if (i % 4 == 0) {
            ctxFlip.fillStyle = 'rgb(239, 239, 239)';
        } else {
            ctxFlip.fillStyle = 'rgb(219, 239, 239)';
        }
        ctxFlip.fillRect(x, y, w, h);
    }
    var xy2 = 50 + Math.floor(Math.abs(this.counter % 100 - 50) / 5);
    ctxFlip.fillStyle = 'rgb(239, 209, 179)';
    ctxFlip.fillRect(0, 0, CommonView.staticCanvasFlip().width - xy2 , xy2);
    ctxFlip.fillStyle = 'rgb(239, 239, 179)';
    ctxFlip.fillRect(CommonView.staticCanvasFlip().width - xy2, 0, xy2 , CommonView.staticCanvasFlip().height - xy2);
    ctxFlip.fillStyle = 'rgb(209, 239, 209)';
    ctxFlip.fillRect(xy2, CommonView.staticCanvasFlip().height - xy2, CommonView.staticCanvasFlip().width - xy2 , xy2); 
    ctxFlip.fillStyle = 'rgb(179, 179, 239)';
    ctxFlip.fillRect(0, xy2, xy2 , CommonView.staticCanvasFlip().height - xy2);    
    
    if (this.state == EVENTVIEW_COMSTATE_PRECHOICE) {
        for (var i = 0; i < 7; i ++) {
            var x = EVENTVIEW_COMMAND_X + i * (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST);
            var y = EVENTVIEW_COMMAND_Y;
            var w = EVENTVIEW_COMMAND_W;
            var h = EVENTVIEW_COMMAND_H;
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
            ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            ctxFlip.fillRect(x, y, w, h);
            var text = "";
            switch(i) {
            case EVENTVIEW_COMMANDNUM_PROC:arguments
                text = "進攻";
                break;
            case EVENTVIEW_COMMANDNUM_SELL:arguments
                text = "売却";
                break;
            case EVENTVIEW_COMMANDNUM_BUY:arguments
                text = "購入";
                break;
            case EVENTVIEW_COMMANDNUM_CHECK:arguments
                text = "確認";
                break;
            case EVENTVIEW_COMMANDNUM_WAIT:arguments
                text = "待機";
                break;
            case EVENTVIEW_COMMANDNUM_SAVE:arguments
                text = "セーブ";
                break;
            case EVENTVIEW_COMMANDNUM_LOAD:arguments
                text = "ロード";
                break;
            default:arguments
                break;
            }
            ctxFlip.font = "12px 'MS Pゴシック'";
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.fillText(text, x, y + 10);
        }
    }
    //ctxFlip.fillStyle = getGladColor((this.MAXCOUNTER - this.counter) / 6);
    ctxFlip.fillStyle = 'rgb(15, 15, 15)';
    var textMargin = 1 + Math.floor((this.counter % 50 - 25) / 10);
    ctxFlip.fillRect(EVENTVIEW_TEXT_X - textMargin, EVENTVIEW_TEXT_Y - textMargin, EVENTVIEW_TEXT_W + 2 * textMargin, EVENTVIEW_TEXT_H + 2 * textMargin);
    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
    ctxFlip.fillRect(EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y, EVENTVIEW_TEXT_W, EVENTVIEW_TEXT_H);
    // (全画面共通)アナウンスメッセージ表示
    CommonView.paintMessage(ctxFlip);
    
    var imageData = ctxFlip.getImageData(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    var ctx = CommonView.staticCanvas().getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}

EventView.prototype.clk = function(mouseX, mouseY) {
    
}