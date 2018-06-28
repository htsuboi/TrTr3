var EventView = function() {
    this.gameStart();
};

EventView.prototype.gameStart = function () {
    this.counter = 0;
    this.state = EVENTVIEW_STATE_COMMAND;
    this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
    this.stage = 0;// 何ステージまでクリアしたか(減少はしない)
    this.tempBuySellType = ITEM_TYPE_SWORD;// 売買時、どの武器を表示するか
    this.tempBuySellSyurui = 0;
    this.tempBuySellNum = -1;
    this.tempProcMap = -1;
    this.tempUnitIndex = 0;//誰を表示するか
    this.tempRingIndex = 0;//どのリングを表示するか
    this.tempSaveNum = -1;//何番にセーブするか
    this.tempMapNum = -1;//どのマップにカーソルをあわせるか
    this.tempBookNum = -1;//どの本を読むか
    this.ENDCOUNTER = 1000;// ここに到達するまでは画面作りかけ状態
    this.MAXCOUNTER = 1100;// 画面完成後、ENDCOUNTER～MAXCOUNTERまでの値をぐるぐるしてアニメーションさせる
    this.cantOpCounter = 0;
    this.textCounter = 0;// イベント画面で文字列をだんだん表示
    this.message = new Array();// 今回のイベントの全メッセージを格納(表示される毎に無くなっていく)
    this.nextEvent = new Array();//次ターン開始時イベントIDが入る
    this.nowEvent = new Array();//現在実行すべきイベントIDが入る(nextEventから移動)
    this.doneEvent = new Array();//実行済みのイベントIDが入る
    this.haveBook = new Array();//所持している本のイベントIDが入る
    this.haveRing = new Array();//所持しているリングのリングIDが入る
    this.printMsg = ["", "", "", "", "", "", ""];// 現在イベントビューに出すべき文字列
    this.money = 200;// 「所持金」データはここに保持
    this.turn = 0;// 「ターン」データはここに保持
    this.eventID = -1;// 現在のイベント
    this.px = -1;//イベント用の顔グラの場所(-1は「表示しない」)
    this.py = -1;//イベント用の顔グラの場所(-1は「表示しない」)
    this.pSyurui = -1;//イベント用の顔グラの場所(-1は「表示しない」)
    // fontIDについて、「これまで」各行をどのフォントで表示していたかと、「今」どのフォントで表示すべきかは分けて管理しないといけない
    this.fontID = [EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL, EVENTVIEW_EVENTFONT_NORMAL];//イベント文字列の書体
    this.nowFontID = EVENTVIEW_EVENTFONT_NORMAL;
    this.fieldMap = new Map();
    for (var i = 0; i < EVENTVIEW_MAP_MAX; i++) {
        var tempField = new FieldDefine();
        var ret = tempField.init(i);
        if (ret == 0) {
            this.fieldMap.set(i, tempField);
        }
    }
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
        this.tempMapNum = -1;
        this.tempBuySellType = ITEM_TYPE_SWORD;// 売買時、どの武器を表示するか
        this.tempBuySellSyurui = -1;
        this.tempBuySellNum = -1;
        this.tempProcMap = -1;
        this.tempUnitIndex = 0;//誰を表示するか
        this.tempRingIndex = 0;//どのリングを表示するか
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
                if (tempField.isBoss) {
                    r = 4;//ボスの拠点は大きくする
                }
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
                        if (tempField.isBoss) {
                            r = 7;//ボスの拠点は大きくする
                        }
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
                        // 進攻選択中
                        if (i == this.tempMapNum) {
                            for (var j = -1; j <= 1; j++) {
                                ctxFlip.strokeStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 12);
                                ctxFlip.lineWidth = 4 - 2 * Math.abs(j);
                                ctxFlip.beginPath();
                                ctxFlip.moveTo(centerX, centerY);
                                var len = 30 - 20 * Math.abs(j);
                                var destX = centerX + len * Math.cos((0.7 + 0.15 * j) * Math.PI);
                                var destY = centerY + len * Math.sin((0.7 + 0.15 * j) * Math.PI);
                                ctxFlip.lineTo(destX, destY);
                                ctxFlip.closePath();
                                ctxFlip.stroke();
                            }
                        }
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
                    tempEqSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, i, this);
                } else {
                    tempEqSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, i);
                }
                
                if (tempEqSyurui == -1) {
                    // 表示すべきアイテムはすべて表示した
                    break;
                } else {
                    var tempItem = new ItemDefine();
                    ItemDefine.init(this.tempBuySellType, tempEqSyurui, this.turn, tempItem);
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
        if (this.comState == EVENTVIEW_COMSTATE_UNITCHECK) {
            var x = EVENTVIEW_UNITINFO_X;
            var y = EVENTVIEW_UNITINFO_Y;
            var w = EVENTVIEW_UNITINFO_W;
            var h = EVENTVIEW_UNITINFO_H;
            
            ctxFlip.fillStyle = 'rgb(63, 63, 63)';
            ctxFlip.fillRect(x - 1, y - 1, w + 2, h + 2);
            ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            ctxFlip.fillRect(x, y, w, h);
            
            var mikataUd = UnitDefine.getMikataList(ud);
            for (var i = 0; i < mikataUd.length; i++) {
                if (i == this.tempUnitIndex) {
                    ctxFlip.fillStyle = 'rgb(255, 255, 0)';
                    ctxFlip.fillRect(x, y + EVENTVIEW_UNITINFO_INTERVAL * i, w, EVENTVIEW_UNITINFO_INTERVAL);
                }
                var tempU = mikataUd[i];
                ctxFlip.font = "12px 'MS Pゴシック'";
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                ctxFlip.fillText(tempU.namae, x, y + EVENTVIEW_UNITINFO_INTERVAL - 2 + EVENTVIEW_UNITINFO_INTERVAL * i);
            }

            var mikataUd = UnitDefine.getMikataList(ud);
            var infoUnit = mikataUd[this.tempUnitIndex];
            CommonView.unitMsg(infoUnit, ctxFlip, this.MAXCOUNTER, this.counter, null, true, false, false, this, null);
            
            var x2 = EVENTVIEW_RINGINFO_X;
            var y2 = EVENTVIEW_RINGINFO_Y;
            var w2 = EVENTVIEW_RINGINFO_W;
            var h2 = EVENTVIEW_RINGINFO_H;
            
            ctxFlip.fillStyle = 'rgb(63, 63, 63)';
            ctxFlip.fillRect(x2 - 1, y2 - 1, w2 + 2, h2 + 2);
            ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            ctxFlip.fillRect(x2, y2, w2, h2);
            
            for (var i = 0; i < this.haveRing.length; i++) {
                if (i == this.tempRingIndex) {
                    ctxFlip.fillStyle = 'rgb(255, 255, 0)';
                    ctxFlip.fillRect(x2, y2 + EVENTVIEW_RINGINFO_INTERVAL * i, w2, EVENTVIEW_RINGINFO_INTERVAL);
                }
                var tempRing = this.haveRing[i];
                ctxFlip.font = "10px 'MS Pゴシック'";
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                var isMastered = RingDefine.isRingMaster(infoUnit, tempRing);
                var ringTxt = RingDefine.getRingName(tempRing.id);
                if (isMastered) {
                    ringTxt += "(M)";
                    ctxFlip.fillStyle = 'rgb(63, 63, 63)';
                }
                ctxFlip.fillText(ringTxt, x2, y2 + EVENTVIEW_RINGINFO_INTERVAL - 12 + EVENTVIEW_RINGINFO_INTERVAL * i);
                ctxFlip.fillText(tempRing.unitNamae, x2 + 30, y2 + EVENTVIEW_RINGINFO_INTERVAL - 1 + EVENTVIEW_RINGINFO_INTERVAL * i);
                
                var aptitude = RingDefine.getRingAptitude(infoUnit, tempRing.id);
                ctxFlip.drawImage(BattleField.getWeaponsImg(), 16 * (1 - aptitude), 304, 16, 16, x2 - 16, y2 + EVENTVIEW_RINGINFO_INTERVAL * i, 16, 16);
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
        if (this.comState == EVENTVIEW_COMSTATE_PROC_MAPCHOICE) {
            if (this.tempMapNum != -1) {
                var tempField = this.fieldMap.get(this.tempMapNum);
                var interval = 20;
                var index = 0;
                ctxFlip.fillText("【" + tempField.text + "】", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                if (tempField.items[0] != null) {
                    if(tempField.items[0].itemType != -1) {
                        for (var i = 0; i < ITEM_MAP_MAX; i++) {
                            if (tempField.items[i] != null) {
                                var tempItem = new ItemDefine();
                                ItemDefine.init(tempField.items[i].itemType, tempField.items[i].itemSyurui, this.turn, tempItem);
                                ctxFlip.fillText(tempItem.namae + "購入可", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                                index++;
                            }
                        }
                    } else if (tempField.items[0].itemSyurui != -1) {
                        ctxFlip.fillText(RingDefine.getRingName(tempField.items[0].itemSyurui) + "入手", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);                    
                    }
                }
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE || this.comState == EVENTVIEW_COMSTATE_SELL_WEAPCHOICE){
            if (this.tempBuySellSyurui != -1) {
                var tempItem = new ItemDefine();
                ItemDefine.init(this.tempBuySellType, this.tempBuySellSyurui, this.turn, tempItem);
                var interval = 20;
                var index = 0;
                ctxFlip.fillText("【" + tempItem.namae + "】", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText(tempItem.text, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【射程】　　" + (tempItem.range + 1), EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【装備レベル】" + tempItem.lv, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【力】　　　" + tempItem.str, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【魔力】　　" + tempItem.mag, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【命中】　　" + tempItem.hit, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【回避】　　" + tempItem.avo, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【守備】　　" + tempItem.def, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【魔防】　　" + tempItem.mdf, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【割合攻撃】" + tempItem.rat, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
                ctxFlip.fillText("【割合軽減】" + tempItem.rdf, EVENTVIEW_TEXT_X + 130, EVENTVIEW_TEXT_Y + 15 + interval * index++);
                ctxFlip.fillText("【価格】　　" + this.adjustItemPrice(this.tempBuySellType, this.tempBuySellSyurui) + "(定価" + tempItem.price + ")", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15 + interval * index);
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_WAITCHECK){
            ctxFlip.font = "18px 'MS Pゴシック'";
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.fillText("進攻せずターン終了します。", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15);
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
        if (this.comState == EVENTVIEW_COMSTATE_UNITCHECK) {
            if (this.tempUnitIndex >= 0 && this.tempRingIndex >= 0) {
                var mikataUd = UnitDefine.getMikataList(ud);
                var tempRing = this.haveRing[this.tempRingIndex];
                var aptitude = RingDefine.getRingAptitude(infoUnit, tempRing.id);
                for (var i = 0; i < 3; i++) {
                    ctxFlip.drawImage(BattleField.getWeaponsImg(), 16 * i, 304, 16, 16, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 50 * i, 16, 16);
                    ctxFlip.font = "14px 'MS Pゴシック'";
                    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                    ctxFlip.fillText("マスター必要勝利数:" + RingDefine.getMasterCount(tempRing.id, 1 - i), EVENTVIEW_TEXT_X + 30, EVENTVIEW_TEXT_Y + 50 * i + 15);
                    var ringMsg = new Array();
                    RingDefine.getSetsumei(tempRing.id, 1 - i, ringMsg);
                    for (var j = 0; j < ringMsg.length; j++) {
                        ctxFlip.fillText(ringMsg[0], EVENTVIEW_TEXT_X + 30, EVENTVIEW_TEXT_Y + 50 * i + 33 + 15 * j);
                    }
                }
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
                var decideRet = this.decide(mouseX, mouseY, bv, ud, itemMap);
                return decideRet;
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
                        this.tempMapNum = -1;
                    break;
                    case EVENTVIEW_COMMANDNUM_BUY:arguments
                        this.tempBuySellType = ITEM_TYPE_SWORD;// とりあえず剣を表示
                        this.tempBuySellSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0, this);
                        this.tempBuySellNum = -1;
                        this.comState = EVENTVIEW_COMSTATE_BUY_WEAPCHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_SELL:arguments
                        this.tempBuySellType = ITEM_TYPE_SWORD;// とりあえず剣を表示
                        this.tempBuySellSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0);
                        this.tempBuySellNum = -1;
                        this.comState = EVENTVIEW_COMSTATE_SELL_WEAPCHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_CHECK:arguments
                        this.tempUnitIndex = 0;
                        this.tempRingIndex = (this.haveRing.length > 0 ? 0 : -1);
                        this.comState = EVENTVIEW_COMSTATE_UNITCHECK;
                    break;
                    case EVENTVIEW_COMMANDNUM_WAIT:arguments
                        this.comState = EVENTVIEW_COMSTATE_WAITCHECK;
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
                if (tempField != null) {
                    var centerX = EVENTVIEW_MAP_X + EVENTVIEW_MAP_EXTEND * tempField.x;
                    var centerY = EVENTVIEW_MAP_Y + EVENTVIEW_MAP_EXTEND * tempField.y;
                    if (Math.abs(mouseX - centerX) < 5 && Math.abs(mouseY - centerY) < 5){                    
                        this.tempMapNum = i;
                        return -1;
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
                    this.tempBuySellSyurui = (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE ? ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0, this) : ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0));
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
                    this.tempBuySellSyurui = (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE ? ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0, this) : ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0));
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
                    newSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, y, this);
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
        if (this.comState == EVENTVIEW_COMSTATE_UNITCHECK) {
            if (mouseX >= EVENTVIEW_UNITINFO_X && mouseX <= EVENTVIEW_UNITINFO_X + EVENTVIEW_UNITINFO_W) {
                var y = Math.floor((mouseY - EVENTVIEW_UNITINFO_Y) / EVENTVIEW_UNITINFO_INTERVAL);
                var nowIndex = -1;
                if (y >= 0 && y < UnitDefine.getMikataList(ud).length) {
                    nowIndex = y;
                }
    
                if (nowIndex != -1) {    
                    this.tempUnitIndex = nowIndex;
                }
            }
            if (mouseX >= EVENTVIEW_RINGINFO_X && mouseX <= EVENTVIEW_RINGINFO_X + EVENTVIEW_RINGINFO_W) {
                var y = Math.floor((mouseY - EVENTVIEW_RINGINFO_Y) / EVENTVIEW_RINGINFO_INTERVAL);
                var nowIndex = -1;
                if (y >= 0 && y < this.haveRing.length) {
                    nowIndex = y;
                }
    
                if (nowIndex != -1) {
                    this.tempRingIndex = nowIndex;
                }
            }
            return -1;
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
            if (mouseX >= EVENTVIEW_BOOK_X && mouseX <= EVENTVIEW_BOOK_X + EVENTVIEW_BOOK_W) {
                var y = Math.floor((mouseY - EVENTVIEW_BOOK_Y) / (EVENTVIEW_BOOK_H + EVENTVIEW_BOOK_INTERVAL));
                var nowIndex = -1;
                if (y >= 0 && y < this.haveBook.length) {
                    nowIndex = y;
                }
    
                this.tempBookNum = nowIndex;
            }
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
    ItemDefine.init(eqType, eqSyurui, this.turn, tempItem);
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
            u.initCommon(ud, UNIT_SYURUI_PRINCESS, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 1, SKILL_KEIKAI, SKILL_KIYOME, SKILL_GAIKA);
            ud.push(u);
            
            var tempField = this.fieldMap.get(fieldNum);
            tempField.createEnemy(ud);
            
            var tempItem = new ItemDefine();
            ItemDefine.init(ITEM_TYPE_SWORD, 0, this.turn, tempItem);
            itemMap.set(tempItem.namae, 1);
            ItemDefine.init(ITEM_TYPE_WATER, 0, this.turn, tempItem);
            itemMap.set(tempItem.namae, 1);
            return GAMEMODE_BATTLE;
        case EVENTVIEW_EVENTID_OP_WIN:arguments
            var fieldNum = 0;
            bv.init(fieldNum, true);
            // ヤナエを全回復
            UnitDefine.recoverMikata(ud);
            
            u = new UnitDefine();
            u.initCommon(ud, UNIT_SYURUI_KNIGHT, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 1, SKILL_HIGHHIT, SKILL_SYONETSU, SKILL_GUARD);
            ud.push(u);
            //var tempField = this.fieldMap.get(0);
            //tempField.createEnemy(ud);
            // createEnemyは1フィールドにつき1回しか使えない
            var u2 = new UnitDefine();
            u2.initTeki(ud, UNIT_SYURUI_SWORD, BATTLE_TEKI, BATTLE_DEFENCE, fieldNum, 1, 0, 0, 0, ITEM_TYPE_SWORD, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_BACK + BATTLEAI_SM_NO, 1.2, -1, -1);
            ud.push(u2);
            var u3 = new UnitDefine();
            u3.initTeki(ud, UNIT_SYURUI_BOW, BATTLE_TEKI, BATTLE_DEFENCE, fieldNum, 1, 0, 0, 0, ITEM_TYPE_BOW, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MAXDM + BATTLEAI_SM_NO, 1.4, -1, -1);
            ud.push(u3);
            
            var tempItem = new ItemDefine();
            ItemDefine.init(ITEM_TYPE_SWORD, 0, this.turn, tempItem);
            var tempItemNum = itemMap.get(tempItem.namae);
            itemMap.set(tempItem.namae, tempItemNum + 1);
            
            ItemDefine.init(ITEM_TYPE_SPEAR, 0, this.turn, tempItem);
            itemMap.set(tempItem.namae, 1);
            return GAMEMODE_BATTLE;
        case EVENTVIEW_EVENTID_OP_WIN2:arguments
            // ヤナエ、サキスを全回復
            UnitDefine.recoverMikata(ud);
            this.endTurn(ud);
            this.pushBook(EVENTVIEW_BOOKID_KINGDEATH);
            this.pushBook(EVENTVIEW_BOOKID_KINGKANRI);
            this.pushBook(EVENTVIEW_BOOKID_ENEMY);
            this.pushBook(EVENTVIEW_BOOKID_PREKING);
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
        case EVENTVIEW_EVENTID_STAGE1_1STBATTLE:arguments
            var fieldNum = 3;
            bv.init(fieldNum, true);
            
            var tempField = this.fieldMap.get(fieldNum);
            tempField.createEnemy(ud);
            return GAMEMODE_BATTLE;
        case EVENTVIEW_EVENTID_STAGE1_YAKUNIN:arguments
            this.endTurn(ud);
            break;
        case EVENTVIEW_EVENTID_JOIN_MUSCLE:arguments
            u = new UnitDefine();
            u.initCommon(ud, UNIT_SYURUI_MUSCLE, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 2, SKILL_YOROI, SKILL_KYOEN, SKILL_OTOKO);
            ud.push(u);
            break;
        case EVENTVIEW_EVENTID_FIRST_RING:arguments
            this.pushRing(RING_KIRYOKU);
            /*this.pushRing(RING_ECO);
            this.pushRing(RING_RECOVER);*/
            break;
        case EVENTVIEW_EVENTID_JOIN_JC:arguments
            u = new UnitDefine();
            u.initCommon(ud, UNIT_SYURUI_JC, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 4, SKILL_KEIKAI, SKILL_KENJITSU, SKILL_AKIRA);
            ud.push(u);
            break;
        case EVENTVIEW_EVENTID_STAGE1_BOSS:arguments
            var fieldNum = 9;
            bv.init(fieldNum, true);
            
            var tempField = this.fieldMap.get(fieldNum);
            tempField.createEnemy(ud);
            return GAMEMODE_BATTLE;
        case EVENTVIEW_EVENTID_STAGE2_YAKUNIN:arguments
            this.pushRing(RING_TAISEI);
            CommonView.addWarn("【ステータス異常について】");
            CommonView.addWarn("　一部の兵種やスキル保持の敵は");
            CommonView.addWarn("攻撃に毒および麻痺の効果があります。");
            CommonView.addWarn("・毒→自ターン終了時、HPが1になる");
            CommonView.addWarn("・麻痺→行動時「なにもしない」しか選べない");
            CommonView.addWarn("どちらも行動時「なにもしない」選択で治ります。");
            CommonView.addWarn("　そのような敵のHPが、最大HPと比較して");
            CommonView.addWarn("・毒→「毒耐性」%より多い");
            CommonView.addWarn("・麻痺→「100-麻痺耐性」%未満");
            CommonView.addWarn("場合、ステータス異常を受けます。");
            break;
        case EVENTVIEW_EVENTID_JOIN_THIEF:arguments
            u = new UnitDefine();
            u.initCommon(ud, UNIT_SYURUI_THIEF, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 5, SKILL_HIGHHIT, SKILL_HIGHAVO, SKILL_THIEF);
            ud.push(u);
            break;
        case EVENTVIEW_EVENTID_JOIN_SHIACYAN:arguments
            u = new UnitDefine();
            u.initCommon(ud, UNIT_SYURUI_SHIACYAN, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 6, SKILL_KENJITSU, SKILL_KAMAITACHI, SKILL_TAIEN);
            ud.push(u);
            break;
        case EVENTVIEW_EVENTID_JOIN_YOUHEI:arguments
            u = new UnitDefine();
            u.initCommon(ud, UNIT_SYURUI_KENSHI, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 9, SKILL_KEIKAI, SKILL_AKURO, SKILL_DEATH);
            ud.push(u);
            break;
        case EVENTVIEW_EVENTID_JOIN_FIGHTER:arguments
            u = new UnitDefine();
            u.initCommon(ud, UNIT_SYURUI_FIGHTER, BATTLE_MIKATA, BATTLE_OFFENCE, -1, 10, SKILL_HIGHHIT, SKILL_YOROI, SKILL_KOGUN);
            ud.push(u);
            break;
    }
    // イベント実行したので、nowEventから消す
    var nowEventIndex = this.nowEvent.indexOf(this.eventID);
    if (nowEventIndex != -1) {
        this.nowEvent.splice(nowEventIndex, 1);
    }
    
    // まだ発生させるべきイベントがある
    if (this.nowEvent.length > 0) {
        var nextEvent = this.nowEvent[0];
        this.init(nextEvent);
    } else {
        // イベント終了
        this.state = EVENTVIEW_STATE_COMMAND;
        // 連打時にいきなり処理に進まないよう、一瞬操作不能にする
        this.cantOpCounter = 20;
    }
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
        case UNIT_SYURUI_SPEAR:arguments
            this.px = 0 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            break;
        case UNIT_SYURUI_BOW:arguments
            this.px = 2 * 256;
            this.py = 2 * 320;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            break;
        case UNIT_SYURUI_HAMMER:arguments
            this.px = 1 * 256;
            this.py = 0 * 320;
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
        case UNIT_SYURUI_POISON:arguments
            this.px = 0 * 256;
            this.py = 3 * 320;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            break;
        case UNIT_SYURUI_KNIFE:arguments
            this.px = 0 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            break;
        case UNIT_SYURUI_PUNCH:arguments
            this.px = 2 * 256;
            this.py = 1 * 320;
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
        case UNIT_SYURUI_MUSCLE:arguments
            this.px = 0 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
        case UNIT_SYURUI_JC:arguments
            this.px = 2 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
        case UNIT_SYURUI_THIEF:arguments
            this.px = 2 * 256;
            this.py = 2 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
        case UNIT_SYURUI_SHIACYAN:arguments
            this.px = 3 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
        case UNIT_SYURUI_KENSHI:arguments
            this.px = 3 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
        case UNIT_SYURUI_TATEO:arguments
            this.px = 0 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
        case UNIT_SYURUI_FIGHTER:arguments
            this.px = 2 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
        case UNIT_SYURUI_GAKUSYA:arguments
            this.px = 0 * 256;
            this.py = 2 * 320;
            this.pSyurui = BATTLE_PSYURUI_PC;
            break;
        case UNIT_SYURUI_YOUNGMAN:arguments
            this.px = 0 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_NPC;
            break;
        case UNIT_SYURUI_OLDMAN:arguments
            this.px = 1 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_NPC;
            break;
        case UNIT_SYURUI_LADY:arguments
            this.px = 0 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_NPC;
            break;
        case UNIT_SYURUI_BOY:arguments
            this.px = 2 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_NPC;
            break;
        case UNIT_SYURUI_GIRL:arguments
            this.px = 1 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_NPC;
            break;
        case UNIT_SYURUI_YAKUNIN:arguments
            this.px = 2 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_NPC;
            break;
        case UNIT_SYURUI_IINA:arguments
            this.px = 0 * 256;
            this.py = 2 * 320;
            this.pSyurui = BATTLE_PSYURUI_NPC;
            break;
        case UNIT_SYURUI_RIVAL:arguments
            this.px = 1 * 256;
            this.py = 2 * 320;
            this.pSyurui = BATTLE_PSYURUI_NPC;
            break;
        case UNIT_SYURUI_S1BOSS:arguments
            this.px = 1 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_BOSS;
            break;
        case UNIT_SYURUI_S2BOSS:arguments
            this.px = 0 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_BOSS;
            break;
        case UNIT_SYURUI_S3BOSS:arguments
            this.px = 2 * 256;
            this.py = 0 * 320;
            this.pSyurui = BATTLE_PSYURUI_BOSS;
            break;
        case UNIT_SYURUI_S4BOSS:arguments
            this.px = 0 * 256;
            this.py = 1 * 320;
            this.pSyurui = BATTLE_PSYURUI_BOSS;
            break;
    }
}

EventView.prototype.setFieldColor = function(ctxFlip, fieldState, isFirst, index) {
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
    
    if (this.comState == EVENTVIEW_COMSTATE_PROC_MAPCHOICE) {
        if (this.tempMapNum == -1) {
            CommonView.addWarn("進攻マスを選んでください。");
            return -1;
        } else {
            var tempField = this.fieldMap.get(this.tempMapNum);
            if (tempField.fieldState == EVENTVIEW_FIELD_TEKI) {
                if (!this.isNearBy(tempField.x, tempField.y)) {
                    CommonView.addWarn("味方(青)マスに隣接した");
                    CommonView.addWarn("敵(赤)マスしか進攻できません。");
                    return -1;
                }
            } else if (tempField.fieldState == EVENTVIEW_FIELD_MIKATA) {
                CommonView.addWarn("味方(青)マスに隣接した");
                CommonView.addWarn("敵(赤)マスしか進攻できません。");
                return -1;
            }
            if (this.checkFieldEvent(this.tempMapNum)) {
                // イベント後に戦闘。処理はendEvent側に記述
                this.tempMapNum = -1;
                this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
                return -1;
            } else {
                tempField.createEnemy(ud);// 最初の進攻時はこれで敵が作られる。取り返すときは、もともと攻めてきた敵を倒す
                bv.init(this.tempMapNum, true);
                this.tempMapNum = -1;
                this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
                return GAMEMODE_BATTLE;
            }
        }
    }
    
    
    if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE) {
        if (this.tempBuySellSyurui != -1 && this.tempBuySellNum > 0) {
            var tempItem = new ItemDefine();
            ItemDefine.init(this.tempBuySellType, this.tempBuySellSyurui, this.turn, tempItem);
            var onePrice = this.adjustItemPrice(this.tempBuySellType, this.tempBuySellSyurui);
            var needPrice = onePrice * this.tempBuySellNum;
            if (this.money < needPrice) {
                CommonView.addWarn("所持金が足りません。");
                return -1;
            }
            // 所持数追加
            var tempItemNum = itemMap.get(tempItem.namae);
            itemMap.set(tempItem.namae, tempItemNum + this.tempBuySellNum);
            this.tempBuySellSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0, this);
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
            ItemDefine.init(this.tempBuySellType, this.tempBuySellSyurui, this.turn, tempItem);
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
    
    if (this.comState == EVENTVIEW_COMSTATE_UNITCHECK) {
        if (this.tempUnitIndex >= 0 && this.tempRingIndex >= 0) {
            var mikataUd = UnitDefine.getMikataList(ud);
            var tempUnit = mikataUd[this.tempUnitIndex];
            if (RingDefine.getEquipRing(tempUnit, this) != null) {
                CommonView.addWarn("既にリングを装着中です。");
                return -1;
            }
            var tempRing = this.haveRing[this.tempRingIndex];
            if (RingDefine.isRingMaster(tempUnit, tempRing)) {
                CommonView.addWarn("そのリングはマスター済みです。");
                return -1;
            }
            if (tempRing.unitNamae != "") {
                CommonView.addWarn("そのリングは他ユニットが装着中です。");
                return -1;
            }
            CommonView.addMessage("リングを装着しました。", 120);
            RingDefine.apply(tempRing.id, tempUnit);
            tempRing.unitNamae = tempUnit.namae;
            var aptitude = RingDefine.getRingAptitude(tempUnit, tempRing.id);
            tempRing.unitRemain = RingDefine.getMasterCount(tempRing.id, aptitude);
        }
        return -1;
    }
    if (this.comState == EVENTVIEW_COMSTATE_WAITCHECK) {
        CommonView.addMessage("1ターン待機しました。", 120);
        this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
        this.endTurn(ud);
        return -1;
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

// 戦闘突入時のチェック。イベント発生するならtrue
EventView.prototype.checkFieldEvent = function(fieldNum) {
    switch(fieldNum) {
        case 1:arguments
        return this.trueIfAbsent(EVENTVIEW_EVENTID_STAGE1_KANRIKA);
        case 3:arguments
        return this.trueIfAbsent(EVENTVIEW_EVENTID_STAGE1_1STBATTLE);
        case EVENTVIEW_MAP_STAGE1_BOSS:arguments
        return this.trueIfAbsent(EVENTVIEW_EVENTID_STAGE1_BOSS);
    }
}

// イベント未発生ならtrueを返しイベント発生
EventView.prototype.trueIfAbsent = function(eventNum) {
    if (this.nowEvent.indexOf(eventNum) != -1 ||
        this.nextEvent.indexOf(eventNum) != -1 ||
        this.doneEvent.indexOf(eventNum) != -1) {
        return false;
    }
    this.init(eventNum);
    return true;
}

EventView.prototype.decideNextEvent = function(isWin, fieldNum) {
    var tempField = this.fieldMap.get(fieldNum);
    if (isWin) {
        // 戦闘勝利
        if (tempField.fieldState == EVENTVIEW_FIELD_TEKI) {
            tempField.fieldState = EVENTVIEW_FIELD_CHANGING;
        }
        // 即イベントに遷移ではないが、イベント発生条件を満たした
        if (tempField.position == 4 || tempField.position == 6) {
            this.pushNextEvent(EVENTVIEW_EVENTID_FIRST_RING);
        }
        if (tempField.position == 3) {
            this.pushNextEvent(EVENTVIEW_EVENTID_JOIN_MUSCLE);
        }
        if (tempField.position == 7 || tempField.position == 8) {
            this.pushNextEvent(EVENTVIEW_EVENTID_JOIN_JC);
        }
        
        if (this.doneEvent.indexOf(EVENTVIEW_EVENTID_OP_WIN) == -1) {
            return EVENTVIEW_EVENTID_OP_WIN;
        } else if (this.doneEvent.indexOf(EVENTVIEW_EVENTID_OP_WIN2) == -1) {
            return EVENTVIEW_EVENTID_OP_WIN2;
        } else if (this.doneEvent.indexOf(EVENTVIEW_EVENTID_STAGE1_YAKUNIN) == -1) {
            return EVENTVIEW_EVENTID_STAGE1_YAKUNIN;
            // ここまでは実質オープニングなのでイベント発生は決め打ち
        } else {
            // STAGE1 クリア
            if (tempField.position == EVENTVIEW_MAP_STAGE1_BOSS && this.doneEvent.indexOf(EVENTVIEW_EVENTID_STAGE1_BOSS_END) == -1) {
                // stageが0なら1にする
                this.stage = Math.max(this.stage, 1);
                return EVENTVIEW_EVENTID_STAGE1_BOSS_END;
            }
        }
    } else {
        // 戦闘敗北
        tempField.fieldState = EVENTVIEW_FIELD_TEKI;
        if (this.doneEvent.indexOf(EVENTVIEW_EVENTID_OP_WIN) == -1) {
            return EVENTVIEW_EVENTID_OP_LOSE;
        } else if (this.doneEvent.indexOf(EVENTVIEW_EVENTID_STAGE1_YAKUNIN) == -1) {
            return EVENTVIEW_EVENTID_OP_LOSE2;
        }
    }
    // イベントが何も発生しない場合
    // TODO:防衛戦に行く or endTurnで次ターンの選択
    this.endTurn(ud);
    return -1;
}

EventView.prototype.selectTutorial = function() {
    if (this.state == EVENTVIEW_STATE_EVENT) {
        return COMMONVIEW_TUTORIALID_EVENT;   
    }
    if (this.state == EVENTVIEW_STATE_COMMAND) {
        if (this.comState == EVENTVIEW_COMSTATE_PRECHOICE) {
            return COMMONVIEW_TUTORIALID_COMMAND;   
        }
        if (this.comState == EVENTVIEW_COMSTATE_PROC_MAPCHOICE) {
            return COMMONVIEW_TUTORIALID_MAPCHOICE;   
        }
        if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE) {
            return COMMONVIEW_TUTORIALID_BUY;   
        }
        if (this.comState == EVENTVIEW_COMSTATE_UNITCHECK) {
            return COMMONVIEW_TUTORIALID_UNITCHECK;   
        }
        if (this.comState == EVENTVIEW_COMSTATE_BOOKCHOICE) {
            return COMMONVIEW_TUTORIALID_BOOKCHOICE;   
        }
    }
    return -1;
}

// 指定した本を持っていない場合のみ追加
EventView.prototype.pushBook = function(bookId) {
    if (this.haveBook.indexOf(bookId) == -1) {
        CommonView.addMessage("書籍を入手しました!", 120);
        this.haveBook.push(bookId);   
    }
    return -1;
}

// 指定したリングを持っていない場合のみ追加
EventView.prototype.pushRing = function(ringId) {
    if (this.haveRing.indexOf(ringId) == -1) {
        var rd = new RingDefine();
        rd.init(ringId);
        CommonView.addMessage("リングを入手しました!", 120);
        this.haveRing.push(rd);   
    }
    return -1;
}

// 指定したイベントが未実施の場合のみ追加
EventView.prototype.pushNextEvent = function(eventId) {
    if (this.nowEvent.indexOf(eventId) == -1 &&
       this.nextEvent.indexOf(eventId) == -1 &&
       this.doneEvent.indexOf(eventId) == -1) {
        this.nextEvent.push(eventId);
    }
    return -1;
}

// いずれかの味方マスに隣接しているか
EventView.prototype.isNearBy = function(x, y) {
    for (var i = 0; i < EVENTVIEW_MAP_MAX; i++) {
        var tempField = this.fieldMap.get(i);
        if (tempField != null && tempField.fieldState == EVENTVIEW_FIELD_MIKATA) {
            if ((Math.abs(tempField.x - x) + Math.abs(tempField.y - y)) <= EVENTVIEW_MAP_INTERVAL) { 
                return true;
            }
        }
    }
    return false;
}

// 味方マスの数を返す
EventView.prototype.numOfMikata = function() {
    var sum = 0;
    for (var i = 0; i < EVENTVIEW_MAP_MAX; i++) {
        var tempField = this.fieldMap.get(i);
        if (tempField != null && tempField.fieldState == EVENTVIEW_FIELD_MIKATA) {
            sum++;
        }
    }
    return sum;
}

// 当該アイテムを購入可能な味方マスの数
EventView.prototype.buyAbleNum = function(itemType, itemSyurui) {
    var sum = 0;
    for (var i = 0; i < EVENTVIEW_MAP_MAX; i++) {
        var tempField = this.fieldMap.get(i);
        if (tempField != null && tempField.fieldState == EVENTVIEW_FIELD_MIKATA) {
            for (var j = 0; j < ITEM_MAP_MAX; j++) {
                if (tempField.items[j] != null && tempField.items[j].itemType == itemType && tempField.items[j].itemSyurui == itemSyurui) {
                    sum++;
                }
                
            }
        }
    }
    return sum;
}

// buyAbleNumを意識した価格補正
EventView.prototype.adjustItemPrice = function(itemType, itemSyurui) {
    var buyAbleNum = this.buyAbleNum(itemType, itemSyurui);
    var tempItem = new ItemDefine();
    ItemDefine.init(itemType, itemSyurui, this.turn, tempItem);
    var orgPrice = tempItem.price;
    var adjustRate = 1.0;
    if (buyAbleNum > 1) {
        adjustRate = Math.max(0.55, 1.0 - ITEM_ADJUST_RATE * (buyAbleNum - 1));
    }

    return Math.floor(adjustRate * orgPrice);
}

// 味方マスの数と進行ステージから、戦勝時の取得金額を返す
EventView.prototype.calcWinMoney = function() {
    if (ev.doneEvent.indexOf(EVENTVIEW_EVENTID_STAGE1_YAKUNIN) == -1) {
        // 最序盤は戦闘勝利してもお金をもらえない
        return 0;
    }
    var basicKeisu = 2;
    var numMikataKeisu = 5 + this.numOfMikata();
    var stageKeisu = 4 + this.stage;
    return Math.floor(basicKeisu * numMikataKeisu * stageKeisu);
}

// ターン終了時
EventView.prototype.endTurn = function(ud) {
    this.turn++;
    for (var i = 0; i < EVENTVIEW_MAP_MAX; i++) {
        var tempField = this.fieldMap.get(i);
        if (tempField != null && tempField.fieldState == EVENTVIEW_FIELD_CHANGING) {
            if (tempField.items[0] != null && tempField.items[0].itemType == -1 && tempField.items[0].itemSyurui != -1) {
                this.pushRing(tempField.items[0].itemSyurui);
            }
            tempField.fieldState = EVENTVIEW_FIELD_MIKATA;
        }
    }
    var mikataUd = UnitDefine.getMikataList(ud);
    // 全味方のスキルをOFFにし、手持ち武器解除
    for (var i = 0; i < mikataUd.length; i++) {
        var u = mikataUd[i];
        for (var j = 0; j < 3 ; j++) {
            u.skillON[j] = false;
        }
        u.handEquip = new Array();//手持ち武器
        u.eqType = -1;
        u.eqSyurui = -1;
        var sude = {eqType: ITEM_TYPE_SUDE, eqSyurui: 0};
        // 手持ち武器に「素手」を追加
        u.handEquip.push(sude);
        if (u.field == -1) {
            // このターン戦闘していないユニットのみ回復
            if (u.hp == 0) {
                u.hp = 1;
            } else {
                var recoverRate = u.recoverRate;
                u.hp = Math.min(u.mhpObj.now, u.hp + Math.floor(recoverRate * u.mhpObj.now));
                u.sp = Math.min(u.msp, u.sp + Math.floor(recoverRate * u.msp));
            }
        } else {
            u.field = -1;
        }
        
    }
    // 「次ターン実施すべきイベント」を、「今回実施すべきイベント」に移動
    Array.prototype.push.apply(this.nowEvent, this.nextEvent);
    this.nextEvent = [];
    if (this.nowEvent.length > 0) {
        var nextEvent = this.nowEvent[0];
        this.init(nextEvent);
    }
    return;
}