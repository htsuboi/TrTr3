var EventView = function() {
    this.gameStart();
};

EventView.prototype.gameStart = function () {
    this.counter = 0;
    this.state = EVENTVIEW_STATE_COMMAND;
    this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
    this.tempBuySellType = ITEM_TYPE_SWORD;// 売買時、どの武器を表示するか
    this.tempBuySellSyurui = 0;
    this.tempBuySellNum = -1;
    this.tempProcMap = -1;
    this.tempSaveNum = -1;//何番にセーブするか
    this.tempBookNum = -1;//どの本を読むか
    this.ENDCOUNTER = 1000;// ここに到達するまでは画面作りかけ状態
    this.MAXCOUNTER = 1100;// 画面完成後、ENDCOUNTER～MAXCOUNTERまでの値をぐるぐるしてアニメーションさせる
    this.cantOpCounter = 0;
    this.textCounter = 0;// イベント画面で文字列をだんだん表示
    this.message = new Array();// 今回のイベントの全メッセージを格納(表示される毎に無くなっていく)
    this.doneEvent = new Array();//実行済みのイベントIDが入る
    this.haveBook = new Array();//所持している本のイベントIDが入る
    this.haveBook.push(EVENTVIEW_BOOKID_KINGDEATH);
    this.printMsg = ["", "", "", "", "", "", ""];// 現在イベントビューに出すべき文字列
    this.money = 400;// 「所持金」データはここに保持
    this.turn = 0;// 「ターン」データはここに保持
    this.eventID = -1;// 現在のイベント
    this.px = -1;//イベント用の顔グラの場所(-1は「表示しない」)
    this.py = -1;//イベント用の顔グラの場所(-1は「表示しない」)
    this.pSyurui = -1;//イベント用の顔グラの場所(-1は「表示しない」)
    // fontIDについて、「これまで」各行をどのフォントで表示していたかと、「今」どのフォントで表示すべきかは分けて管理しないといけない
    this.fontID = [EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL];//イベント文字列の書体
    this.nowFontID = EVENTVIEW_EVENTFONT_NORMAL;
    this.fieldMap = new Map();
};

EventView.prototype.init = function (eventID) {
    this.counter = 0;
    if (eventID >= 0) {
        this.state = EVENTVIEW_STATE_EVENT;
        this.eventID = eventID;// 現在のイベント
        this.message = [];
        EventMessage.getMessage(eventID, this.message);
    } else {
        this.state = EVENTVIEW_STATE_COMMAND;
        this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
        this.tempBuySellType = ITEM_TYPE_SWORD;// 売買時、どの武器を表示するか
        this.tempBuySellSyurui = -1;
        this.tempBuySellNum = -1;
        this.tempProcMap = -1;
        this.tempSaveNum = 1;//何番にセーブするか
        this.message = [];
    }
    this.cantOpCounter = 0;
    this.textCounter = 0;
    this.printMsg = ["", "", "", "", "", "", ""];// 現在イベントビューに出すべき文字列
    this.px = -1;//イベント用の顔グラの場所(-1は「表示しない」)
    this.py = -1;//イベント用の顔グラの場所(-1は「表示しない」)
    this.pSyurui = -1;//イベント用の顔グラの場所(-1は「表示しない」)
    this.fontID = [EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL];//イベント文字列の書体
    this.nowFontID = EVENTVIEW_EVENTFONT_NORMAL;
    for (var i = 0; i < EVENTVIEW_MAP_MAX; i++) {
        var tempField = new FieldDefine();
        var ret = tempField.init(i);
        if (ret == 0) {
            this.fieldMap.set(i, tempField);
        }
    }
}

EventView.prototype.calc = function(ud, itemMap) {
    if (CommonView.printTutorialFlag() == true) {
        // チュートリアル表示中はなにもせず画面を固める
        return;
    }
    
    this.counter++;
    if (this.counter > this.MAXCOUNTER) {
        this.counter = this.ENDCOUNTER;
    }
    
    if (this.cantOpCounter > 0) {
        this.cantOpCounter--;
    }
    
    if (this.state == EVENTVIEW_STATE_EVENT) {
        this.textCounter++;
        if (this.textCounter > EVENTVIEW_TEXT_W_EVENT) {
            this.textCounter = EVENTVIEW_TEXT_W_EVENT;
        }
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
    
    if (this.state == EVENTVIEW_STATE_EVENT) {
        // マップ表示(引き延ばしなし)
        ctxFlip.fillStyle = 'rgb(63, 63, 223)';
        ctxFlip.fillRect(EVENTVIEW_MAP_X - 5, EVENTVIEW_MAP_Y - 3, 224 + 10, 160 + 6);
        ctxFlip.drawImage(EventView.getMapImg(), 0, 0, 224, 160, EVENTVIEW_MAP_X, EVENTVIEW_MAP_Y, 224, 160);
        for (var i = 0; i < EVENTVIEW_MAP_MAX; i++) {
            var tempField = this.fieldMap.get(i);
            if (tempField != null && tempField.fieldState != EVENTVIEW_FIELD_HIDDEN) {
                var r = 2;
                var centerX = EVENTVIEW_MAP_X + tempField.x;
                var centerY = EVENTVIEW_MAP_Y + tempField.y;        
                ctxFlip.beginPath();
                ctxFlip.lineWidth = 2;
                this.setFieldColor(ctxFlip, tempField.fieldState, true);
                ctxFlip.arc(centerX, centerY, r, 0, 2 * Math.PI, true);
                ctxFlip.stroke();
                this.setFieldColor(ctxFlip, tempField.fieldState, false);
                ctxFlip.arc(centerX, centerY, r / 2, 0, 2 * Math.PI, true);
                ctxFlip.stroke();
            }
        }
        
        var x = EVENTVIEW_SKIP_X;
        var y = EVENTVIEW_SKIP_Y;
        var w = EVENTVIEW_SKIP_W;
        var h = EVENTVIEW_SKIP_H;
        // スキップボタン
        ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
        ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(x, y, w, h);
        ctxFlip.font = "16px 'MS Pゴシック'";
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        ctxFlip.fillText("SKIP", x, y + 16);
        if (this.px != -1) {
            // ユニット顔グラ表示
            ctxFlip.drawImage(UnitDefine.getCharaImg(this.pSyurui), this.px, this.py, 256, 320, EVENTVIEW_UNITPAINT_X, EVENTVIEW_UNITPAINT_Y, EVENTVIEW_UNITPAINT_W, EVENTVIEW_UNITPAINT_H);
        }
    }
    
    if (this.shouldDecideCancel()) {
        // コマンド表示
        for (var i = 0; i <= 1; i++) {
            ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
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
    
    if (this.state == EVENTVIEW_STATE_COMMAND) {
        ctxFlip.fillStyle = 'rgb(191, 63, 191)';
        ctxFlip.fillRect(EVENTVIEW_COMMAND_X - 3, EVENTVIEW_COMMAND_Y - 5, EVENTVIEW_COMMAND_W * 8 + EVENTVIEW_COMMAND_DIST * 7 + 10, EVENTVIEW_COMMAND_H + 10);
        for (var i = 0; i < 8; i ++) {
            var x = EVENTVIEW_COMMAND_X + i * (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST);
            var y = EVENTVIEW_COMMAND_Y;
            var w = EVENTVIEW_COMMAND_W;
            var h = EVENTVIEW_COMMAND_H;
            
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            var isHighLight = this.isSelected(ud, i);
            if (isHighLight > 0) {
                ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
            } else {
                ctxFlip.fillStyle = 'rgb(31, 31, 31)';
            }
            ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
            ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            if (isHighLight == 0) {
                ctxFlip.fillStyle = 'rgb(191, 191, 191)';
            }
            ctxFlip.fillRect(x, y, w, h);
            var text = "";
            switch(i) {
            case EVENTVIEW_COMMANDNUM_PROC:arguments
                text = "進攻";
                break;
            case EVENTVIEW_COMMANDNUM_BUY:arguments
                text = "購入";
                break;
            case EVENTVIEW_COMMANDNUM_SELL:arguments
                text = "売却";
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
            case EVENTVIEW_COMMANDNUM_BOOK:arguments
                text = "書籍";
                break;
            default:arguments
                break;
            }
            ctxFlip.font = "12px 'MS Pゴシック'";
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.fillText(text, x, y + 10);
        }
        // マップ表示
        if (this.comState == EVENTVIEW_COMSTATE_PROC_MAPCHOICE) {
            // 非表示部分
            var kezuriX = 3 * this.cantOpCounter;
            ctxFlip.fillStyle = 'rgb(63, 63, 223)';
            ctxFlip.fillRect(EVENTVIEW_MAP_X - 5 + kezuriX, EVENTVIEW_MAP_Y - 3, EVENTVIEW_MAP_EXTEND * 224 - 2 * kezuriX + 10, EVENTVIEW_MAP_EXTEND * 160 + 6);
            ctxFlip.drawImage(EventView.getMapImg(), kezuriX, 0, 224 - 2 * kezuriX, 160, EVENTVIEW_MAP_X + kezuriX, EVENTVIEW_MAP_Y, EVENTVIEW_MAP_EXTEND * 224 - 2 * kezuriX, EVENTVIEW_MAP_EXTEND * 160);
            
            if (this.cantOpCounter == 0) {
                for (var i = 0; i < EVENTVIEW_MAP_MAX; i++) {
                    var tempField = this.fieldMap.get(i);
                    if (tempField != null && tempField.fieldState != EVENTVIEW_FIELD_HIDDEN) {
                        var r = 4;
                        var centerX = EVENTVIEW_MAP_X + EVENTVIEW_MAP_EXTEND * tempField.x;
                        var centerY = EVENTVIEW_MAP_Y + EVENTVIEW_MAP_EXTEND * tempField.y;
                        ctxFlip.beginPath();
                        ctxFlip.lineWidth = 2;
                        this.setFieldColor(ctxFlip, tempField.fieldState, true);
                        ctxFlip.arc(centerX, centerY, r, 0, 2 * Math.PI, true);
                        ctxFlip.stroke();
                        this.setFieldColor(ctxFlip, tempField.fieldState, false);
                        ctxFlip.arc(centerX, centerY, r / 2, 0, 2 * Math.PI, true);
                        ctxFlip.stroke();
                    }
                }
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE || this.comState == EVENTVIEW_COMSTATE_SELL_WEAPCHOICE) {
            ctxFlip.fillStyle = 'rgb(63, 63, 223)';
            ctxFlip.fillRect(EVENTVIEW_COMMAND_X - 3, EVENTVIEW_BUYSELLCOMMAND_Y - 5, (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST) * 6 + 10, EVENTVIEW_COMMAND_H * 2 + EVENTVIEW_BUYSELLCOMMAND_INTERVAL + 10);
            // 剣～拳までと盾～道具/土魔法までで表示段を分ける
            // 道具は購入のみ可能
            var maxI = (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE ? ITEM_TYPE_DOGU : ITEM_TYPE_EARTH);
            for (var i = ITEM_TYPE_SWORD; i <= maxI; i++) {
                var x = EVENTVIEW_COMMAND_X + (i - ITEM_TYPE_SWORD) * (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST);
                var y = EVENTVIEW_BUYSELLCOMMAND_Y;
                if (i > ITEM_TYPE_PUNCH) {
                    x = EVENTVIEW_COMMAND_X + (i - ITEM_TYPE_SHIELD) * (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST);
                    y = EVENTVIEW_BUYSELLCOMMAND_Y + EVENTVIEW_COMMAND_H + EVENTVIEW_BUYSELLCOMMAND_INTERVAL;
                }
                var w = EVENTVIEW_COMMAND_W;
                var h = EVENTVIEW_COMMAND_H;
            
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                var isHighLight = (i == this.tempBuySellType);
                if (isHighLight > 0) {
                    ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
                } else {
                    ctxFlip.fillStyle = 'rgb(31, 31, 31)';
                }
                ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
                ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                ctxFlip.fillRect(x, y, w, h);
                var text = ItemDefine.getItemText(i);
                ctxFlip.font = "12px 'MS Pゴシック'";
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                ctxFlip.fillText(text, x, y + 17);
            }
            ctxFlip.fillStyle = 'rgb(63, 223, 63)';
            ctxFlip.fillRect(EVENTVIEW_COMMAND_X - 3, EVENTVIEW_BUYSELLCOMMANDNUM_Y - 5, (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST) * 7 + 10, EVENTVIEW_COMMAND_H + 10);
            // 購入/売却数
            for (var i = 0; i < 7; i++) {
                var x = EVENTVIEW_COMMAND_X + i * (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST);
                var y = EVENTVIEW_BUYSELLCOMMANDNUM_Y;
                var w = EVENTVIEW_COMMAND_W;
                var h = EVENTVIEW_COMMAND_H;
                var maxNum = this.maxBuySell(itemMap, this.tempBuySellType, this.tempBuySellSyurui, this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE);
            
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                var isHighLight = ((i + 1) == this.tempBuySellNum);
                if (isHighLight > 0) {
                    ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
                } else {
                    ctxFlip.fillStyle = 'rgb(31, 31, 31)';
                }
                ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
                if ((i + 1) > maxNum) {
                    ctxFlip.fillStyle = 'rgb(191, 191, 191)';
                } else {
                    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                }
                ctxFlip.fillRect(x, y, w, h);
                ctxFlip.font = "12px 'MS Pゴシック'";
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                ctxFlip.fillText((i + 1) + "個", x + 12, y + 17);
            }
            var x = EVENTVIEW_BUYSELLWIN_X;
            var y = EVENTVIEW_BUYSELLWIN_Y;
            var w = EVENTVIEW_BUYSELLWIN_W;
            var h = EVENTVIEW_BUYSELLWIN_H;
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
            ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            ctxFlip.fillRect(x, y, w, h);
            ctxFlip.font = "12px 'MS Pゴシック'";
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            var textY = y + 12;
            // 購入/売却可能なアイテム一覧表示
            for (var i = 0; i < ITEM_SYURUI_MAX; i++) {
                var tempEqSyurui = -1;
                if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE) {
                    tempEqSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, i);    
                } else {
                    tempEqSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, i);
                }
                
                if (tempEqSyurui == -1) {
                    // 表示すべきアイテムはすべて表示した
                    break;
                } else {
                    var tempItem = new ItemDefine();
                    ItemDefine.init(this.tempBuySellType, tempEqSyurui, tempItem);
                    var tempItemNum = itemMap.get(tempItem.namae);
                    if (tempEqSyurui == this.tempBuySellSyurui) {
                        // 選択中の武器を強調
                        ctxFlip.fillStyle = 'rgb(255, 255, 0)';
                        ctxFlip.fillRect(x, textY - 12, w, EVENTVIEW_WEAP_INTERVAL);                        
                        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                    }
                    ctxFlip.fillText(tempItem.namae, x, textY);
                    ctxFlip.fillText("所持数 " + tempItemNum, x + 180, textY);
                    textY += EVENTVIEW_WEAP_INTERVAL;
                }
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_SAVE_FILECHOICE || this.comState == EVENTVIEW_COMSTATE_LOAD_FILECHOICE) {
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
                var isHighLight = (i == this.tempSaveNum);
                if (isHighLight > 0) {
                    ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
                }
                ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
                var checks = SaveFileIO.checkFile(i);
                if ("timeStamp" in checks || this.comState == EVENTVIEW_COMSTATE_SAVE_FILECHOICE) {
                    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                } else {
                    ctxFlip.fillStyle = 'rgb(191, 191, 191)';
                }
                ctxFlip.fillRect(x, y, w, h);
                ctxFlip.font = "12px 'MS Pゴシック'";
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                ctxFlip.fillText(i, x + 10, y + 17);
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_BOOKCHOICE){
            for (var i = 0; i < this.haveBook.length; i++) {
                var x = EVENTVIEW_BOOK_X;
                var y = EVENTVIEW_BOOK_Y + (EVENTVIEW_BOOK_H + EVENTVIEW_BOOK_INTERVAL) * i;
                var w = EVENTVIEW_BOOK_W;
                var h = EVENTVIEW_BOOK_H;
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                var isHighLight = (i == this.tempBookNum);
                if (isHighLight > 0) {
                    ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
                }
                ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
                ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                ctxFlip.fillRect(x, y, w, h);
                ctxFlip.font = "12px 'MS Pゴシック'";
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                var eventID = this.haveBook[i];
                var tempMessage = [];
                EventMessage.getMessage(eventID, tempMessage);
                // 本の内容の最初を表示(1行目、2行目はメタ文字なので3行目)
                ctxFlip.fillText(tempMessage[2], x + 5, y + 12);
            }
        }
    }
    
    //メッセージウィンドウの表示
    ctxFlip.fillStyle = 'rgb(15, 15, 15)';
    var textMargin = 2 + Math.floor((this.counter % 50 - 25) / 10);
    var textX = (this.state == EVENTVIEW_STATE_COMMAND ? EVENTVIEW_TEXT_X : EVENTVIEW_TEXT_X_EVENT);
    var textW = (this.state == EVENTVIEW_STATE_COMMAND ? EVENTVIEW_TEXT_W : EVENTVIEW_TEXT_W_EVENT);    
    ctxFlip.fillRect(textX - textMargin, EVENTVIEW_TEXT_Y - textMargin, textW + 2 * textMargin, EVENTVIEW_TEXT_H + 2 * textMargin);
    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
    ctxFlip.fillRect(textX, EVENTVIEW_TEXT_Y, textW, EVENTVIEW_TEXT_H);
    if (this.state == EVENTVIEW_STATE_EVENT) {
        ctxFlip.font = "14px 'MS Pゴシック'";
        for (var i = 0; i < EVENTVIEW_EVENT_MSGNUM; i++) {
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            if (this.fontID[i] == EVENTVIEW_EVENTFONT_KAIWA) {
                ctxFlip.fillStyle = 'rgb(0, 127, 0)';
            }
            var interval = 25;
            ctxFlip.fillText(this.printMsg[i], textX, EVENTVIEW_TEXT_Y + 18 + interval * i);
            if (i == EVENTVIEW_EVENT_MSGNUM - 1 || this.printMsg[i + 1].length == 0) {
                ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                ctxFlip.fillRect(textX + this.textCounter, EVENTVIEW_TEXT_Y + interval * i, EVENTVIEW_TEXT_W_EVENT - this.textCounter, interval);
            }
        }
    }
    if (this.state == EVENTVIEW_STATE_COMMAND) {
        ctxFlip.font = "14px 'MS Pゴシック'";
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE || this.comState == EVENTVIEW_COMSTATE_SELL_WEAPCHOICE){
            if (this.tempBuySellSyurui != -1) {
                var tempItem = new ItemDefine();
                ItemDefine.init(this.tempBuySellType, this.tempBuySellSyurui, tempItem);
                var interval = 20;
                var index = 0;
                ctxFlip.fillText("【" + tempItem.namae + "】", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText(tempItem.text, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【射程】　　" + tempItem.range, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【装備レベル】" + tempItem.lv, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【力】　　　" + tempItem.str, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【魔力】　　" + tempItem.mag, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【命中】　　" + tempItem.hit, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【回避】　　" + tempItem.avo, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【守備】　　" + tempItem.def, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【魔防】　　" + tempItem.mdf, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【割合攻撃】" + tempItem.rat, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【割合軽減】" + tempItem.rdf, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【価格】　　" + tempItem.price, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_SAVE_FILECHOICE || this.comState == EVENTVIEW_COMSTATE_LOAD_FILECHOICE){
            ctxFlip.font = "16px 'MS Pゴシック'";
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            var checks = SaveFileIO.checkFile(this.tempSaveNum);
            if ("timeStamp" in checks) {
                ctxFlip.fillText(checks.timeStamp, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15);
            } else {
                ctxFlip.fillText("ファイルがありません。", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15);
            }
        }
        ctxFlip.font = "14px 'MS Pゴシック'";
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        ctxFlip.fillText("所持金　" + this.money + "ウォッツ", EVENTVIEW_TEXT_X + 10, EVENTVIEW_TEXT_Y + EVENTVIEW_TEXT_H - 20);
        ctxFlip.fillText("ターン　" + this.turn, EVENTVIEW_TEXT_X + 200, EVENTVIEW_TEXT_Y + EVENTVIEW_TEXT_H - 20);
    }
    
    // (全画面共通)アナウンスメッセージ表示
    CommonView.paintMessage(ctxFlip);
    
    var imageData = ctxFlip.getImageData(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    var ctx = CommonView.staticCanvas().getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}

EventView.prototype.clk = function(mouseX, mouseY, bv, ud, itemMap) {
    //演出中
    if (this.cantOpCounter > 0) {
        return -1;
    }
    
    if (mouseX >= ALLVIEW_TUTORIALFLAG_X && mouseX <= ALLVIEW_TUTORIALFLAG_X + ALLVIEW_TUTORIALFLAG_W &&
        mouseY >= ALLVIEW_TUTORIALFLAG_Y && mouseY <=ALLVIEW_TUTORIALFLAG_Y + ALLVIEW_TUTORIALFLAG_H) {
        // (全画面共通)初回チュートリアル表示非表示の切り替え
        CommonView.shouldTutorialFlag(!CommonView.shouldTutorialFlag());
        return -1;
    }
    
    var tutorialID = this.selectTutorial();
    if (tutorialID != -1) {
        // チュートリアルを表示すべきなら、表示してリターン
        if (CommonView.addTutorial(tutorialID, true)) {
            return -1;
        }
    }
    
    // 決定、戻るボタンを押す
    if (this.shouldDecideCancel() && mouseX >= EVENTVIEW_COMMANDTXT_X && mouseX <= EVENTVIEW_COMMANDTXT_X + EVENTVIEW_COMMANDTXT_W &&
        mouseY >= EVENTVIEW_COMMANDTXT_Y && mouseY <= EVENTVIEW_COMMANDTXT_Y + EVENTVIEW_COMMANDTXT_H * 2 + EVENTVIEW_COMMANDINTERVAL) {
        var commandNum = Math.floor((mouseY - EVENTVIEW_COMMANDTXT_Y) / EVENTVIEW_COMMANDINTERVAL);
        switch(commandNum) {
            case 0:arguments//次へ
                this.decide(mouseX, mouseY, bv, ud, itemMap);
                return -1;
            break;
            case 1:arguments//戻る
                this.cancel(mouseX, mouseY, bv, ud, itemMap);
                return -1;
            break;
            default:arguments
                // なにもせず先に進む
            break;
        }
    }
            
    
    if (this.state == EVENTVIEW_STATE_EVENT) {
        if (this.message.length == 0) {
            if (this.textCounter < EVENTVIEW_TEXT_W_EVENT) {
                // イベント最終行を表示しきっていない場合、表示しきってreturn
                this.textCounter = EVENTVIEW_TEXT_W_EVENT;
                return -1;
            }
            var ret = this.endEvent(ud, bv, itemMap);
            return ret;
        } else {
            // 取り出す文章あり
            if (mouseX >= EVENTVIEW_SKIP_X && mouseX <= EVENTVIEW_SKIP_X + EVENTVIEW_SKIP_W &&
                mouseY >= EVENTVIEW_SKIP_Y && mouseY <= EVENTVIEW_SKIP_Y + EVENTVIEW_SKIP_H) {
                // スキップ
                while(this.message.length > 0) {
                    this.printOneMsg();
                }
                var ret = this.endEvent(ud, bv, itemMap);
                return ret;
            } else {
                this.textCounter = 0;
                var isAddMsg = this.printOneMsg();
                // printOneMsgの結果がメタ文字(実質的な文章追加でない)な場合、文章追加までprintOneMsg
                while (!isAddMsg) {
                    isAddMsg = this.printOneMsg();
                }
                // 連打時にいきなり処理に進まないよう、一瞬操作不能にする
                this.cantOpCounter = 10;
                return -1;
            }
        }
    }
    
    if (this.state == EVENTVIEW_STATE_COMMAND) {
        // 全体コマンド選択
        if (this.comState == EVENTVIEW_COMSTATE_PRECHOICE && mouseY >= EVENTVIEW_COMMAND_Y && mouseY <= EVENTVIEW_COMMAND_Y + EVENTVIEW_COMMAND_H) {
            var commandNum = Math.floor((mouseX - EVENTVIEW_COMMAND_X) / (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST));
            var isSelectable = this.isSelected(ud, commandNum);
            if (isSelectable == 1) {
                switch(commandNum) {
                    case EVENTVIEW_COMMANDNUM_PROC:arguments
                        this.cantOpCounter = EVENTVIEW_PROC_MAXCOUNTER;
                        this.comState = EVENTVIEW_COMSTATE_PROC_MAPCHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_BUY:arguments
                        this.tempBuySellType = ITEM_TYPE_SWORD;// とりあえず剣を表示
                        this.tempBuySellSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0);
                        this.tempBuySellNum = -1;
                        this.comState = EVENTVIEW_COMSTATE_BUY_WEAPCHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_SELL:arguments
                        this.tempBuySellType = ITEM_TYPE_SWORD;// とりあえず剣を表示
                        this.tempBuySellSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0);
                        this.tempBuySellNum = -1;
                        this.comState = EVENTVIEW_COMSTATE_SELL_WEAPCHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_SAVE:arguments
                        this.tempSaveNum = -1;
                        this.comState = EVENTVIEW_COMSTATE_SAVE_FILECHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_LOAD:arguments
                        this.tempSaveNum = -1;
                        this.comState = EVENTVIEW_COMSTATE_LOAD_FILECHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_BOOK:arguments
                        this.tempBookNum = -1;
                        this.comState = EVENTVIEW_COMSTATE_BOOKCHOICE;
                    break;
                    default:arguments
                        // ボタンのない場所をクリックした場合ここ
                        return -1;
                    break;
                }
                return -1;
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_PROC_MAPCHOICE) {
            for (var i = 0; i < EVENTVIEW_MAP_MAX; i++) {
                var tempField = this.fieldMap.get(i);
                if (tempField != null && tempField.fieldState == EVENTVIEW_FIELD_TEKI) {
                    var centerX = EVENTVIEW_MAP_X + EVENTVIEW_MAP_EXTEND * tempField.x;
                    var centerY = EVENTVIEW_MAP_Y + EVENTVIEW_MAP_EXTEND * tempField.y;
                    if (Math.abs(mouseX - centerX) < 5 && Math.abs(mouseY - centerY) < 5){
                        if (this.checkFieldEvent(i)) {
                            // イベント後に戦闘。処理はendEvent側に記述
                            return;
                        } else {
                            var tempField = this.fieldMap.get(i);
                            tempField.createEnemy(ud);// 最初の進攻時はこれで敵が作られる。取り返すときは、もともと攻めてきた敵を倒す
                            bv.init(i, true);
                            return GAMEMODE_BATTLE;
                        }
                    }
                }
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE || this.comState == EVENTVIEW_COMSTATE_SELL_WEAPCHOICE) {
            var x = Math.floor((mouseX - EVENTVIEW_COMMAND_X) / (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST));
            // アイテムタイプ選択(剣～拳)
            if (mouseY >= EVENTVIEW_BUYSELLCOMMAND_Y && mouseY <= EVENTVIEW_BUYSELLCOMMAND_Y + EVENTVIEW_COMMAND_H) {
                if (x >= 0 && x <= 5) {
                    this.tempBuySellType = x + ITEM_TYPE_SWORD;
                    this.tempBuySellSyurui = (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE ? ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0) : ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0));
                    this.tempBuySellNum = -1;
                    return -1;
                }
                return -1;
            }
            // アイテムタイプ選択(盾～道具/土魔法)
            if (mouseY >= EVENTVIEW_BUYSELLCOMMAND_Y + EVENTVIEW_COMMAND_H + EVENTVIEW_BUYSELLCOMMAND_INTERVAL && mouseY <= EVENTVIEW_BUYSELLCOMMAND_Y + 2 * EVENTVIEW_COMMAND_H + EVENTVIEW_BUYSELLCOMMAND_INTERVAL) {
                // 道具は購入のみ可能
                var maxX = (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE ? 5 : 4);
                if (x >= 0 && x <= maxX) {
                    this.tempBuySellType = x + ITEM_TYPE_SHIELD;
                    this.tempBuySellSyurui = (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE ? ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0) : ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0));
                    this.tempBuySellNum = -1;
                    return -1;
                }
                return -1;
            }
            // アイテム種類選択(表示タイプの中で)
            if (mouseY >= EVENTVIEW_BUYSELLWIN_Y && mouseY <= EVENTVIEW_BUYSELLWIN_Y + EVENTVIEW_BUYSELLWIN_H) {
                var y = Math.floor((mouseY - EVENTVIEW_BUYSELLWIN_Y) / (EVENTVIEW_WEAP_INTERVAL));
                var newSyurui = -1;
                if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE) {
                    newSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, y);
                } else {
                    newSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, y);
                }
                if (newSyurui != -1) {
                    this.tempBuySellSyurui = newSyurui;
                    this.tempBuySellNum = -1;
                    return -1;
                }
                return -1;
            }
            // アイテム個数選択
            if (mouseY >= EVENTVIEW_BUYSELLCOMMANDNUM_Y && mouseY <= EVENTVIEW_BUYSELLCOMMANDNUM_Y + EVENTVIEW_COMMAND_H) {
                if (this.tempBuySellSyurui != -1) {
                    if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE) {
                        var maxNum = this.maxBuySell(itemMap, this.tempBuySellType, this.tempBuySellSyurui, true);
                        if ((x + 1) > maxNum) {
                            CommonView.addWarn("所持数は" + (this.tempBuySellType == ITEM_TYPE_DOGU ? 1 : 7) + "個までです。");
                            return -1;
                        } else {
                            this.tempBuySellNum = x + 1;
                            return -1;
                        }
                    } else {
                        var maxNum = this.maxBuySell(itemMap, this.tempBuySellType, this.tempBuySellSyurui, false);
                        if ((x + 1) > maxNum) {
                            CommonView.addWarn("所持数より多く売却できません。");
                            return -1;
                        } else {
                            this.tempBuySellNum = x + 1;
                            return -1;
                        }
                    }
                }
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_SAVE_FILECHOICE || this.comState == EVENTVIEW_COMSTATE_LOAD_FILECHOICE) {
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
            if (!("timeStamp" in checks) && this.comState == EVENTVIEW_COMSTATE_LOAD_FILECHOICE) {
                CommonView.addWarn("その番号のファイルがありません!");
                return -1;
            }
            this.tempSaveNum = nowIndex;
            return -1;
        }
        if (this.comState == EVENTVIEW_COMSTATE_BOOKCHOICE) {
            var y = Math.floor((mouseY - EVENTVIEW_BOOK_Y) / (EVENTVIEW_BOOK_H + EVENTVIEW_BOOK_INTERVAL));
            var nowIndex = -1;
            if (y >= 0 && y < this.haveBook.length) {
                nowIndex = y;
            }

            this.tempBookNum = nowIndex;
            return -1;
        }
    }
}

EventView.prototype.isSelected = function(ud, i) {
    if (this.comState == EVENTVIEW_COMSTATE_PRECHOICE) {
        // 全コマンド選択可
        return 1;
    } else {
        if (Math.floor(this.comState / 10) == i) {
            // 選択中
            return 2;
        }
    }
    return 0;
}

// 最大何個まで買える/売れるか
EventView.prototype.maxBuySell = function(itemMap, eqType, eqSyurui, isBuy) {
    var tempItem = new ItemDefine();
    ItemDefine.init(eqType, eqSyurui, tempItem);
    // 現在の所持数
    var tempItemNum = itemMap.get(tempItem.namae);
    // 消費アイテムは1個のみ、武器は7個まで保持可能
    var maxNum = (eqType == ITEM_TYPE_DOGU ? 1 : 7);
    if (isBuy) {
        return maxNum - tempItemNum;
    } else {
        return tempItemNum;
    }
}

EventView.getMapImg = function() {
    if (typeof arguments.callee.mapImg == 'undefined') {
        arguments.callee.mapImg = new Image();
        arguments.callee.mapImg.src = "img/map.png";
    }
    return arguments.callee.mapImg;
};

// 戻り値は「実質的な文章が追加されたか?」
EventView.prototype.printOneMsg = function() {
    var tempMsg = this.message.shift();
    if (tempMsg.charAt(0) == '@') {
        // フォント変更を意味するメタ文字
        var fontID = parseInt(tempMsg.substr(1), 10);
        this.nowFontID = fontID;
        return false;
    }
    if (tempMsg.charAt(0) == '#') {
        // 顔グラを設定するメタ文字
        var faceID = parseInt(tempMsg.substr(1), 10);
        this.setFace(faceID);
        return false;
    }
    var index = -1;
    for (var i = 0; i < EVENTVIEW_EVENT_MSGNUM; i++) {
        if (this.printMsg[i] === "") {
            // 空きがあるので、その行に表示する。既存行に影響なし
            index = i;
            break;
        }    
    }
    if (index != -1) {
        // 空きがあるので、その行に内容追加する。既存行に影響なし
        this.fontID[index] = this.nowFontID;
        this.printMsg[index] = tempMsg;
    } else {
        for (var i = 1; i < EVENTVIEW_EVENT_MSGNUM; i++) {
            // 既存行を1行ずつずらす
            this.fontID[i - 1] = this.fontID[i];
            this.printMsg[i - 1] = this.printMsg[i];
        }
        // 最終行に今回のメッセージを設定
        this.fontID[EVENTVIEW_EVENT_MSGNUM - 1] = this.nowFontID;
        this.printMsg[EVENTVIEW_EVENT_MSGNUM - 1] = tempMsg;
    }
    return true;
}

// 戻り値は「別の画面に遷移」を意味
EventView.prototype.endEvent = function(ud, bv, itemMap) {
    this.doneEvent.push(this.eventID);
    switch(this.eventID) {
        case EVENTVIEW_EVENTID_OP:arguments
            var fieldNum = 0;
            bv.init(fieldNum, true);
            u = new UnitDefine();
            u.initCommon(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_PRINCESS, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 1, SKILL_KEIKAI, SKILL_KIYOME, SKILL_KENJITSU);
            ud.push(u);
            
            var tempField = this.fieldMap.get(fieldNum);
            tempField.createEnemy(ud);
            
            var tempItem = new ItemDefine();
            ItemDefine.init(ITEM_TYPE_SWORD, 0, tempItem);
            itemMap.set(tempItem.namae, 1);
            ItemDefine.init(ITEM_TYPE_WATER, 0, tempItem);
            itemMap.set(tempItem.namae, 1);
            return GAMEMODE_BATTLE;
        case EVENTVIEW_EVENTID_OP_WIN:arguments
            var fieldNum = 0;
            bv.init(fieldNum, true);
            // ヤナエを全回復
            UnitDefine.recoverMikata(ud);
            
            u = new UnitDefine();
            u.initCommon(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_KNIGHT, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 1, SKILL_HIGHHIT, SKILL_SYONETSU, SKILL_KENJITSU);
            ud.push(u);
            //var tempField = this.fieldMap.get(0);
            //tempField.createEnemy(ud);
            // createEnemyは1フィールドにつき1回しか使えない
            var u2 = new UnitDefine();
            u2.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_SWORD, BATTLE_TEKI, BATTLE_DEFENCE, fieldNum, 1, 0, 0, 0, ITEM_TYPE_SWORD, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_BACK + BATTLEAI_SM_NO, 1.2, -1);
            ud.push(u2);
            var u3 = new UnitDefine();
            u3.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_BOW, BATTLE_TEKI, BATTLE_DEFENCE, fieldNum, 1, 0, 0, 0, ITEM_TYPE_BOW, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MAXDM + BATTLEAI_SM_NO, 1.4, -1);
            ud.push(u3);
            
            var tempItem = new ItemDefine();
            ItemDefine.init(ITEM_TYPE_SWORD, 0, tempItem);
            var tempItemNum = itemMap.get(tempItem.namae);
            itemMap.set(tempItem.namae, tempItemNum + 1);
            
            ItemDefine.init(ITEM_TYPE_SPEAR, 0, tempItem);
            itemMap.set(tempItem.namae, 1);
            return GAMEMODE_BATTLE;
        case EVENTVIEW_EVENTID_OP_WIN2:arguments
            // ヤナエ、サキスを全回復
            UnitDefine.recoverMikata(ud);
            break;
        case EVENTVIEW_EVENTID_OP_LOSE:arguments
        case EVENTVIEW_EVENTID_OP_LOSE2:arguments
            return GAMEMODE_GAMEOVER;
        case EVENTVIEW_EVENTID_STAGE1_KANRIKA:arguments
            var fieldNum = 1;
            bv.init(fieldNum, true);
            
            var tempField = this.fieldMap.get(fieldNum);
            tempField.createEnemy(ud);
            return GAMEMODE_BATTLE;
    }
    // イベント終了
    this.state = EVENTVIEW_STATE_COMMAND;
    // 連打時にいきなり処理に進まないよう、一瞬操作不能にする
    this.cantOpCounter = 20;
    return -1;
}

EventView.prototype.setFace = function(faceId) {
    // UnitDefine.prototype.initNamePaintと重複してるが、こちらはモブキャラデータも含む
    switch(faceId) {
        case UNIT_SYURUI_NOFACE:arguments
            this.px = -1;
            this.py = -1;
            this.pSyurui = -1;
            break;
        case UNIT_SYURUI_SWORD:arguments
            this.px = 2 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            break;
        case UNIT_SYURUI_BOW:arguments
            this.px = 2 * 256;
            this.py = 2 * 320;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            break;
        case UNIT_SYURUI_SHIELD:arguments
            this.px = 1 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            break;
        case UNIT_SYURUI_MAGIC:arguments
            this.px = 3 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            break;
        case UNIT_SYURUI_PRINCESS:arguments
            this.px = 1 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
        case UNIT_SYURUI_KNIGHT:arguments
            this.px = 1 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
    }
}

EventView.prototype.setFieldColor = function(ctxFlip, fieldState, isFirst) {
    var gladColor = (Math.floor(this.counter / 20)) % 6;
    switch(fieldState) {
    case EVENTVIEW_FIELD_MIKATA:arguments
        if (isFirst) {
            ctxFlip.strokeStyle = 'rgb(0, 0, 239)';
        } else {
            ctxFlip.strokeStyle = 'rgb(119, 119, 239)';
            if (gladColor == 1 || gladColor == 5) {
                ctxFlip.strokeStyle = 'rgb(149, 149, 239)';
            }
            if (gladColor == 2 || gladColor == 4) {
                ctxFlip.strokeStyle = 'rgb(179, 179, 239)';
            }
            if (gladColor == 3) {
                ctxFlip.strokeStyle = 'rgb(209, 209, 239)';
            }
        }
        break;
    case EVENTVIEW_FIELD_TEKI:arguments
        if (isFirst) {
            ctxFlip.strokeStyle = 'rgb(239, 0, 0)';
        } else {
            ctxFlip.strokeStyle = 'rgb(239, 119, 119)';
            if (gladColor == 1 || gladColor == 5) {
                ctxFlip.strokeStyle = 'rgb(239, 149, 149)';
            }
            if (gladColor == 2 || gladColor == 4) {
                ctxFlip.strokeStyle = 'rgb(239, 179, 179)';
            }
            if (gladColor == 3) {
                ctxFlip.strokeStyle = 'rgb(239, 209, 209)';
            }
        }
        break;
    case EVENTVIEW_FIELD_CHANGING:arguments
        if (isFirst) {
            ctxFlip.strokeStyle = 'rgb(0, 239, 0)';
        } else {
            ctxFlip.strokeStyle = 'rgb(119, 239, 119)';
            if (gladColor == 1 || gladColor == 5) {
                ctxFlip.strokeStyle = 'rgb(149, 239, 149)';
            }
            if (gladColor == 2 || gladColor == 4) {
                ctxFlip.strokeStyle = 'rgb(179, 239, 179)';
            }
            if (gladColor == 3) {
                ctxFlip.strokeStyle = 'rgb(209, 239, 209)';
            }
        }
        break;
    }
}

// 決定、戻るボタンを出すべきか
EventView.prototype.shouldDecideCancel = function() {
    if (this.state == EVENTVIEW_STATE_COMMAND && this.comState != EVENTVIEW_COMSTATE_PRECHOICE) {
        return true;
    }
    return false;
}

EventView.prototype.decide = function(mouseX, mouseY, bv, ud, itemMap) {
    if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE) {
        if (this.tempBuySellSyurui != -1 && this.tempBuySellNum > 0) {
            var tempItem = new ItemDefine();
            ItemDefine.init(this.tempBuySellType, this.tempBuySellSyurui, tempItem);
            var needPrice = tempItem.price * this.tempBuySellNum;
            if (this.money < needPrice) {
                CommonView.addWarn("所持金が足りません。");
                return -1;
            }
            // 所持数追加
            var tempItemNum = itemMap.get(tempItem.namae);
            itemMap.set(tempItem.namae, tempItemNum + this.tempBuySellNum);
            this.tempBuySellSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0);
            this.money -= needPrice;
            this.tempBuySellNum = -1;
            CommonView.addWarn("購入しました。");
        } else if (this.tempBuySellSyurui == -1) {
            CommonView.addWarn("購入アイテムを選んでください。");
            return -1;
        }
    }
    if (this.comState == EVENTVIEW_COMSTATE_SELL_WEAPCHOICE) {
        if (this.tempBuySellSyurui != -1 && this.tempBuySellNum > 0) {
            var tempItem = new ItemDefine();
            ItemDefine.init(this.tempBuySellType, this.tempBuySellSyurui, tempItem);
            // 所持数削減
            var tempItemNum = itemMap.get(tempItem.namae);
            itemMap.set(tempItem.namae, tempItemNum - this.tempBuySellNum);
            this.tempBuySellSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0);
            this.money += Math.floor(EVENTVIEW_SELL_RATE * tempItem.price * this.tempBuySellNum);
            this.tempBuySellNum = -1;
            CommonView.addWarn("売却しました。");
            return -1;
        } else if (this.tempBuySellSyurui == -1) {
            CommonView.addWarn("売却アイテムを選んでください。");
            return -1;
        }
    }
    
    if (this.comState == EVENTVIEW_COMSTATE_SAVE_FILECHOICE) {
        if (this.tempSaveNum >= 0) {
            SaveFileIO.saveFile(this.tempSaveNum, this, ud, itemMap);
            this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
            return -1;
        } else {
            CommonView.addWarn("正しいファイル番号を選んでください。");
            return -1;
        }
    }
    if (this.comState == EVENTVIEW_COMSTATE_LOAD_FILECHOICE) {
        if (this.tempSaveNum >= 0) {
            SaveFileIO.loadFile(this.tempSaveNum, this, ud, itemMap);
            this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
            return -1;
        } else {
            CommonView.addWarn("正しいファイル番号を選んでください。");
            return -1;
        }
    }
    if (this.comState == EVENTVIEW_COMSTATE_BOOKCHOICE) {
        if (this.tempBookNum >= 0) {
            this.init(this.haveBook[this.tempBookNum]);
            return -1;
        } else {
            CommonView.addWarn("読みたい本を選んでください。");
            return -1;
        }
    }
}

EventView.prototype.cancel = function(mouseX, mouseY, bv, ud, itemMap) {
    this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
    return -1;
}

// イベント発生するならtrue
EventView.prototype.checkFieldEvent = function(fieldNum) {
    switch(fieldNum) {
        case 1:arguments
        return this.trueIfAbsent(EVENTVIEW_EVENTID_STAGE1_KANRIKA);
    }
}

// イベント未発生ならtrueを返しイベント発生
EventView.prototype.trueIfAbsent = function(eventNum) {
    if (this.doneEvent.indexOf(eventNum) != -1) {
        return false;
    }
    this.init(eventNum);
    return true;
}

EventView.prototype.decideNextEvent = function(isWin) {
    if (isWin) {
        // 戦闘勝利
        if (this.doneEvent.indexOf(EVENTVIEW_EVENTID_OP_WIN) == -1) {
            return EVENTVIEW_EVENTID_OP_WIN;
        } else if (this.doneEvent.indexOf(EVENTVIEW_EVENTID_OP_WIN2) == -1) {
            return EVENTVIEW_EVENTID_OP_WIN2;
        }
    } else {
        // 戦闘敗北
        if (this.doneEvent.indexOf(EVENTVIEW_EVENTID_OP_WIN) == -1) {
            return EVENTVIEW_EVENTID_OP_LOSE;
        } else if (this.doneEvent.indexOf(EVENTVIEW_EVENTID_OP_WIN2) == -1) {
            return EVENTVIEW_EVENTID_OP_LOSE2;
        }
    }
    return -1;
}

EventView.prototype.selectTutorial = function() {
    if (this.state == EVENTVIEW_STATE_EVENT) {
        return COMMONVIEW_TUTORIALID_EVENT;   
    }
    return -1;
}