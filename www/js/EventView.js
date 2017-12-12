var EventView = function() {
    this.counter = 0;
    this.state = EVENTVIEW_STATE_COMMAND;
    this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
    this.tempBuySellType = ITEM_TYPE_SWORD;// 売買時、どの武器を表示するか
    this.tempBuySellSyurui = 0;
    this.tempBuySellNum = 1;
    this.tempProcMap = -1;
    this.tempSaveNum = 1;//何番にセーブするか
    this.ENDCOUNTER = 1000;// ここに到達するまでは画面作りかけ状態
    this.MAXCOUNTER = 1100;// 画面完成後、ENDCOUNTER～MAXCOUNTERまでの値をぐるぐるしてアニメーションさせる
    this.cantOpCounter = 0;
    this.money = 0;// 「所持金」データはここに保持
    this.turn = 0;// 「ターン」データはここに保持
};

EventView.prototype.init = function () {
    this.counter = 0;
    this.state = EVENTVIEW_STATE_COMMAND;
    this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
    this.tempBuySellType = ITEM_TYPE_SWORD;// 売買時、どの武器を表示するか
    this.tempBuySellSyurui = 0;
    this.tempBuySellNum = 1;
    this.tempProcMap = -1;
    this.tempSaveNum = 1;//何番にセーブするか
    this.cantOpCounter = 0;
    this.money = 0;// 「所持金」データはここに保持
    this.turn = 0;
}

EventView.prototype.calc = function(ud, itemMap) {
    this.counter++;
    if (this.counter > this.MAXCOUNTER) {
        this.counter = this.ENDCOUNTER;
    }
    
    if (this.cantOpCounter > 0) {
        this.cantOpCounter--;
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
    
    if (this.state == EVENTVIEW_STATE_COMMAND) {
        ctxFlip.fillStyle = 'rgb(191, 63, 191)';
        ctxFlip.fillRect(EVENTVIEW_COMMAND_X - 3, EVENTVIEW_COMMAND_Y - 5, (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST) * 7 + 10, EVENTVIEW_COMMAND_H + 10);
        for (var i = 0; i < 7; i ++) {
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
            default:arguments
                break;
            }
            ctxFlip.font = "12px 'MS Pゴシック'";
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.fillText(text, x, y + 10);
        }
        if (this.comState == EVENTVIEW_COMSTATE_PROC_MAPCHOICE) {
            // 非表示部分
            var kezuriX = 3 * this.cantOpCounter;
            ctxFlip.fillStyle = 'rgb(63, 63, 223)';
            ctxFlip.fillRect(EVENTVIEW_MAP_X - 5 + kezuriX, EVENTVIEW_MAP_Y - 3, EVENTVIEW_MAP_EXTEND * 224 - 2 * kezuriX + 10, EVENTVIEW_MAP_EXTEND * 160 + 6);
            ctxFlip.drawImage(EventView.getMapImg(), kezuriX, 0, 224 - 2 * kezuriX, 160, EVENTVIEW_MAP_X + kezuriX, EVENTVIEW_MAP_Y, EVENTVIEW_MAP_EXTEND * 224 - 2 * kezuriX, EVENTVIEW_MAP_EXTEND * 160);
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
    }
    
    //メッセージウィンドウの表示
    ctxFlip.fillStyle = 'rgb(15, 15, 15)';
    var textMargin = 2 + Math.floor((this.counter % 50 - 25) / 10);
    ctxFlip.fillRect(EVENTVIEW_TEXT_X - textMargin, EVENTVIEW_TEXT_Y - textMargin, EVENTVIEW_TEXT_W + 2 * textMargin, EVENTVIEW_TEXT_H + 2 * textMargin);
    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
    ctxFlip.fillRect(EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y, EVENTVIEW_TEXT_W, EVENTVIEW_TEXT_H);
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
            var checks = SaveFileIO.checkFile(this.tempSaveNum);
            if ("timeStamp" in checks) {
                ctxFlip.fillText(checks.timeStamp, EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15);
            } else {
                ctxFlip.fillText("ファイルがありません。", EVENTVIEW_TEXT_X, EVENTVIEW_TEXT_Y + 15);
            }
        }
        ctxFlip.fillText("所持金　" + this.money + "ウォッツ", EVENTVIEW_TEXT_X + 10, EVENTVIEW_TEXT_Y + EVENTVIEW_TEXT_H - 20);
        ctxFlip.fillText("ターン　" + this.turn, EVENTVIEW_TEXT_X + 200, EVENTVIEW_TEXT_Y + EVENTVIEW_TEXT_H - 20);
    }
    
    // (全画面共通)アナウンスメッセージ表示
    CommonView.paintMessage(ctxFlip);
    
    var imageData = ctxFlip.getImageData(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    var ctx = CommonView.staticCanvas().getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}

EventView.prototype.clk = function(mouseX, mouseY) {
    if (CommonView.printWarnFlag() == true) {
        // 警告表示時はそれを消す
        CommonView.printWarnFlag(false);
        return -1;
    }
    
    //演出中
    if (this.cantOpCounter > 0) {
        return -1;
    }
    
    if (this.state == EVENTVIEW_STATE_COMMAND) {
        // 全体コマンド選択
        if (mouseY >= EVENTVIEW_COMMAND_Y && mouseY <= EVENTVIEW_COMMAND_Y + EVENTVIEW_COMMAND_H) {
            var commandNum = Math.floor((mouseX - EVENTVIEW_COMMAND_X) / (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST));
            var isSelectable = this.isSelected(ud, commandNum);
            if (isSelectable == 0) {
                // 選択不能をクリック→最初の選択に戻す
                this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
                return -1;
            } else {
                switch(commandNum) {
                    case EVENTVIEW_COMMANDNUM_PROC:arguments
                        this.tempBuySellNum = 1;
                        this.cantOpCounter = EVENTVIEW_PROC_MAXCOUNTER;
                        this.comState = EVENTVIEW_COMSTATE_PROC_MAPCHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_BUY:arguments
                        this.tempBuySellType = ITEM_TYPE_SWORD;// とりあえず剣を表示
                        this.tempBuySellSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0);
                        this.tempBuySellNum = 1;
                        this.comState = EVENTVIEW_COMSTATE_BUY_WEAPCHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_SELL:arguments
                        this.tempBuySellType = ITEM_TYPE_SWORD;// とりあえず剣を表示
                        this.tempBuySellSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0);
                        this.tempBuySellNum = 1;
                        this.comState = EVENTVIEW_COMSTATE_SELL_WEAPCHOICE;
                    break;
                    case EVENTVIEW_COMMANDNUM_SAVE:arguments
                        this.comState = EVENTVIEW_COMSTATE_SAVE_FILECHOICE;
                        //SaveFileIO.saveFile(2, this, itemMap);
                    break;
                    case EVENTVIEW_COMMANDNUM_LOAD:arguments
                        this.comState = EVENTVIEW_COMSTATE_LOAD_FILECHOICE;
                        //SaveFileIO.loadFile(2, this, itemMap);
                    break;
                    default:arguments
                        // ボタンのない場所をクリックした場合ここ
                        return -1;
                    break;
                }
                return -1;
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE || this.comState == EVENTVIEW_COMSTATE_SELL_WEAPCHOICE) {
            var x = Math.floor((mouseX - EVENTVIEW_COMMAND_X) / (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST));
            // アイテムタイプ選択(剣～拳)
            if (mouseY >= EVENTVIEW_BUYSELLCOMMAND_Y && mouseY <= EVENTVIEW_BUYSELLCOMMAND_Y + EVENTVIEW_COMMAND_H) {
                if (x >= 0 && x <= 5) {
                    this.tempBuySellType = x + ITEM_TYPE_SWORD;
                    this.tempBuySellSyurui = (this.comState == EVENTVIEW_COMSTATE_BUY_WEAPCHOICE ? ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0) : ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0));
                    this.tempBuySellNum = 1;
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
                    this.tempBuySellNum = 1;
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
                    this.tempBuySellNum = 1;
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
                            var tempItem = new ItemDefine();
                            ItemDefine.init(this.tempBuySellType, this.tempBuySellSyurui, tempItem);
                            var needPrice = tempItem.price * this.tempBuySellNum;
                            if (this.money < needPrice) {
                                CommonView.addWarn("所持金が足りません。");
                                return -1;
                            }
                            // 残った所持数
                            var tempItemNum = itemMap.get(tempItem.namae);
                            itemMap.set(tempItem.namae, tempItemNum + this.tempBuySellNum);
                            this.tempBuySellSyurui = ItemDefine.getReverseItemIndexForBuy(itemMap, this.tempBuySellType, 0);
                            this.money -= needPrice;
                            this.tempBuySellNum = 1;
                            CommonView.addWarn("購入しました。");
                            return -1;
                        }
                    } else {
                        var maxNum = this.maxBuySell(itemMap, this.tempBuySellType, this.tempBuySellSyurui, false);
                        if ((x + 1) > maxNum) {
                            CommonView.addWarn("所持数より多く売却できません。");
                            return -1;
                        } else {
                            if (this.tempBuySellNum == x + 1) {
                                var tempItem = new ItemDefine();
                                ItemDefine.init(this.tempBuySellType, this.tempBuySellSyurui, tempItem);
                                // 残った所持数
                                var tempItemNum = itemMap.get(tempItem.namae);
                                itemMap.set(tempItem.namae, tempItemNum - this.tempBuySellNum);
                                this.tempBuySellSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempBuySellType, 0);
                                this.money += Math.floor(EVENTVIEW_SELL_RATE * tempItem.price * this.tempBuySellNum);
                                this.tempBuySellNum = 1;
                                CommonView.addWarn("売却しました。");
                                return -1;
                            } else {
                                this.tempBuySellNum = x + 1;
                                return -1;
                            }
                        }
                    }
                }
            }
        }
        if (this.comState == EVENTVIEW_COMSTATE_SAVE_FILECHOICE || this.comState == EVENTVIEW_COMSTATE_LOAD_FILECHOICE) {
            var x = Math.floor((mouseX - EVENTVIEW_COMMAND_X) / (EVENTVIEW_COMMAND_W + EVENTVIEW_COMMAND_DIST));
            var doSaveLoad = false;
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
            if (this.tempSaveNum == nowIndex) {
                doSaveLoad = true;
            } else {
                this.tempSaveNum = nowIndex;
                return -1;
            }
            if (doSaveLoad) {
                if (this.comState == EVENTVIEW_COMSTATE_SAVE_FILECHOICE) {
                    SaveFileIO.saveFile(this.tempSaveNum, this, itemMap);
                } else {
                    SaveFileIO.loadFile(this.tempSaveNum, this, itemMap);
                }
                this.comState = EVENTVIEW_COMSTATE_PRECHOICE;
                return -1;
            }
        }
    }
}

EventView.prototype.isSelected = function(ud, i) {
    if (this.comState == EVENTVIEW_COMSTATE_PRECHOICE) {
        // 全コマンド選択可
        return 1;
    } else {
        if (Math.floor(this.comState / 10) == i) {
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