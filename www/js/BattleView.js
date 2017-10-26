// 操作キャンセル時に戻すデータを保管
var returnableData = function() {
    this.x = 0;
    this.y = 0;
    this.spGauge = 0;
}

var BattleView = function() {
    this.counter = 0;
    this.ENDCOUNTER = 180;// ここに到達するまでは画面作りかけ状態
    this.MAXCOUNTER = 780;// 画面完成後、ENDCOUNTER～MAXCOUNTERまでの値をぐるぐるしてアニメーションさせる
    this.bar = [0, 0, 0, 0, 0, 0, 0];// 演出用の棒の長さ
    this.fieldDefine = new FieldDefine;
    this.fieldMsg = "";
    this.spGauge = [200, 200];// 味方、敵のspゲージ
    this.spGaugePaint = [0, 0];// 味方、敵のspゲージ(表示用　実際のゲージはspGauge)
    this.field = 0;//どのフィールドか
    this.infoUnit = null;// どのユニットの情報を表示するか
    this.focus = 0;//手番ユニット(0～5)
    this.state = BATTLEVIEW_STATE_FIRSTMOVE;
    this.commandState = BATTLEVIEW_COMSTATE_PRECHOICE;
    this.cantOpCounter = 0;// 演出のため操作不能な時間
    this.battleFields = new Array();
    // 手持ち武器の選択時、tempEquipTypeForPaintは「ITEM_TYPE_TEMOCHI」だが、tempEqTypeForEquipは手持ち武器の種類により変わる
    // それ以外の状況では下記2変数は一致している
    this.tempEqTypeForPaint = ITEM_TYPE_TEMOCHI;//どの属性の武器を画面表示するか
    this.tempEqTypeForEquip = 0;//どの属性の武器を暫定的に装備しているか
    this.tempEqSyurui = 0;//カーソルが合っている武器種類
    this.tempY = 0;// 移動演出のため使用
    for (var i = 0; i <= 1; i++) {
        this.battleFields[i] = new Array();
        for (var j = 0; j <= 2; j++) {
            this.battleFields[i][j] = new Array();
            for (var k = 0; k <= 2; k ++) {
                this.battleFields[i][j][k] = new BattleField();
            }
        }
    }
};

BattleView.prototype.init = function (position, isAttack) {
    this.counter = 0;
    this.fieldDefine.init(position);
    this.field = position;
    this.infoUnit = null;// どのユニットの情報を表示するか
    this.focus = 0;//手番ユニット(0～5)
    this.state = BATTLEVIEW_STATE_FIRSTMOVE;
    this.commandState = BATTLEVIEW_COMSTATE_PRECHOICE;
    this.cantOpCounter = 0;// 演出のため操作不能な時間
    this.tempEqTypeForPaint = ITEM_TYPE_TEMOCHI;//表示している武器タイプ
    this.tempEqTypeForEquip = -1;//暫定装備している武器タイプ
    this.tempEqSyurui = -1;//カーソルが合っている=暫定装備している武器種類
    this.tempTargetEnemy = -1;//暫定攻撃ターゲット　もう一回選択すると実際に攻撃
    this.tempY = 0;// 移動演出のため使用
    for (var j = 0; j <= 2; j++) {
        for (var k = 0; k <= 2; k ++) {
            if (isAttack) {
                this.battleFields[BATTLE_MIKATA][j][k].init(this.fieldDefine.ofMap[3 * j + k]);
                this.battleFields[BATTLE_TEKI][j][k].init(this.fieldDefine.dfMap[3 * j + k]);
            } else {
                this.battleFields[BATTLE_MIKATA][j][k].init(this.fieldDefine.dfMap[3 * j + k]);
                this.battleFields[BATTLE_TEKI][j][k].init(this.fieldDefine.ofMap[3 * j + k]);
            }
        }
    }
    
}

BattleView.prototype.calc = function(ud, itemMap) {
    // SPゲージ見た目を実際に近づける
    for (var i = 0; i <= 1; i++) {
        var diffSP = this.spGaugePaint[i] - this.spGauge[i];
        if (Math.abs(diffSP) <= 5){
            this.spGaugePaint[i] = this.spGauge[i];
        } else if (Math.abs(diffSP) <= 25) {
            this.spGaugePaint[i] += (this.spGaugePaint[i] > this.spGauge[i] ? -5 : 5);
        } else if (Math.abs(diffSP) <= 70) {
            this.spGaugePaint[i] += (this.spGaugePaint[i] > this.spGauge[i] ? -12 : 12);
        } else {
            this.spGaugePaint[i] += (this.spGaugePaint[i] > this.spGauge[i] ? -25 : 25);
        }
    }
    
    if (this.cantOpCounter > 0) {
        this.cantOpCounter--;
    } else {
        var unitAtFocus = this.getUnitAtFocus(ud);
        if (unitAtFocus != null) {
            this.tempY = unitAtFocus.y;
        }
    }
    
    this.counter ++;
    if (this.counter == this.MAXCOUNTER) {
        this.counter = this.ENDCOUNTER;
    }
    if (this.counter >= this.ENDCOUNTER) {
        // 画面作成完了を意味
        return 1;
    } else {
        // 画面作りかけを意味
        return 0;
    }
}

BattleView.prototype.paint = function (ud, itemMap) {

    var totalWidth = $(window).width();
    var totalHeight = $(window).height();
    
    var ctxFlip = CommonView.staticCanvasFlip().getContext('2d');
    ctxFlip.clearRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.fillRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    
    if (this.counter <= 90) {
        ctxFlip.fillStyle = 'rgb(191, 239, 191)';
        for (var i = 0; i < 10; i++) {
            var width = Math.max(Math.min(3 * this.counter - 7 * Math.abs(i - 4.5), totalWidth / 2), 0);
            var y = totalHeight / 10 * i;
            var height = totalHeight / 10 + 1;
            ctxFlip.fillRect(0, y, width, height);
        }
        ctxFlip.fillStyle = 'rgb(239, 191, 191)';
        for (var i = 0; i < 10; i++) {
            var width = Math.max(Math.min(3 * this.counter - 7 * Math.abs(i - 4.5), totalWidth / 2), 0);
            var y = totalHeight / 10 * i;
            var height = totalHeight / 10 + 1;
            ctxFlip.fillRect(totalWidth - width, y, width, height);
        }
    } else if (this.counter < this.ENDCOUNTER ){
        ctxFlip.fillStyle = 'rgb(191, 239, 191)';
        ctxFlip.fillRect(0, 0, totalWidth / 2, totalHeight);
        ctxFlip.fillStyle = 'rgb(239, 191, 191)';
        ctxFlip.fillRect(totalWidth / 2, 0, totalWidth / 2, totalHeight);
        ctxFlip.fillStyle = 'rgb(191, 191, 191)';
        for (var i = 0; i < 10; i++) {
            var width = Math.max(Math.min(6 * (this.counter - 100) - 14 * Math.abs(i - 4.5), totalWidth), 0);
            var y = totalHeight / 10 * i;
            var height = totalHeight / 10 + 1;
            ctxFlip.fillRect((totalWidth - width) / 2, y, width, height);
        }
    } else {
        // バトルのメイン状態
        ctxFlip.fillStyle = 'rgb(191, 191, 191)';
        ctxFlip.fillRect(0, 0, totalWidth, totalHeight);
        for (var i = 0; i < this.bar.length; i++) {
            var oldLength = this.bar[i];
            var diff = ((this.counter + i * 2 - this.ENDCOUNTER) % 60 - 30) / 10;
            this.bar[i] += diff;
            if (this.bar[i] < 20) {
                this.bar[i] = 20;
            }
            if (this.bar[i] > 70) {
                this.bar[i] = 70;
            }
            if (diff > 0) {
                ctxFlip.fillStyle = 'rgb(223, 159, 159)';
            } else {
                ctxFlip.fillStyle = 'rgb(159, 159, 223)';
            }
            ctxFlip.fillRect(40 * i, 100, 20, this.bar[i]);
            ctxFlip.fillRect(40 * i, 300 - this.bar[i], 20, this.bar[i]);
        }
        if (this.MAXCOUNTER - this.counter <= 90) {
            if (this.MAXCOUNTER - this.counter >= 30) {
                var r = 3 * (95 - (this.MAXCOUNTER - this.counter));
                ctxFlip.beginPath();
                ctxFlip.fillStyle = 'rgb(159, 191, 159)';
                ctxFlip.arc(totalWidth / 2, totalHeight / 2, r, 0, 2 * Math.PI, true);
                ctxFlip.fill();
                r -= 7;
                if (r > 0) {
                    ctxFlip.beginPath();
                    ctxFlip.fillStyle = 'rgb(183, 223, 183)';
                    ctxFlip.arc(totalWidth / 2, totalHeight / 2, r, 0, 2 * Math.PI, true);
                    ctxFlip.fill();
                }
                r -= 7;
                if (r > 0) {
                    ctxFlip.beginPath();
                    ctxFlip.fillStyle = 'rgb(207, 255, 207)';
                    ctxFlip.arc(totalWidth / 2, totalHeight / 2, r, 0, 2 * Math.PI, true);
                    ctxFlip.fill();
                }
            } else {
                var r = 195;
                ctxFlip.beginPath();
                var firstWidth = 6 * (this.MAXCOUNTER - this.counter);
                ctxFlip.lineWidth = firstWidth;
                ctxFlip.strokeStyle = 'rgb(207, 255, 207)';
                ctxFlip.arc(totalWidth / 2, totalHeight / 2, r - ctxFlip.lineWidth / 2, 0, 2 * Math.PI, true);
                ctxFlip.stroke();
            }
        }
        ctxFlip.strokeStyle = 'rgb(0, 0, 0)';
        ctxFlip.lineWidth = 1;
        // フィールド描画
        // i = 0は「前衛」。「左端」ではない。
        // j = 0は「前列」。「上端」ではない。
        for (var i = 0; i <= 2; i++) {
            for (var j = 0; j <= 2; j++) {
                ctxFlip.strokeRect(BATTLEVIEW_MIKATA_X + BATTLEVIEW_SIZE * (2 - i), BATTLEVIEW_MIKATA_Y + BATTLEVIEW_SIZE * j, BATTLEVIEW_SIZE - 2, BATTLEVIEW_SIZE - 2);
                this.battleFields[BATTLE_MIKATA][i][j].paintMe(ctxFlip, BATTLEVIEW_MIKATA_X + 66 * (2 - i), BATTLEVIEW_MIKATA_Y + 66 * j);
                // 移動チェック中
                if (this.commandState == BATTLEVIEW_COMSTATE_MOVE) {
                    var unitAtFocus = this.getUnitAtFocus(ud);
                    var moveCost = this.checkMoveCost(BATTLE_MIKATA, unitAtFocus.x, unitAtFocus.y, BATTLE_MIKATA, i, j);
                    // フォーカスユニットと同一列
                    if (moveCost > 0) {
                        var sideColor = 'rgb(0, 0, 0)';
                        switch(moveCost) {
                        case 1:arguments
                            sideColor = 'rgb(0, 0, 239)';
                            break;
                        case 2:arguments
                            sideColor = 'rgb(239, 239, 0)';
                            break;
                        default:arguments
                            //移動不可能
                            sideColor = 'rgb(239, 0, 0)'; 
                            break;
                        }
                        var decorateWidth = 2 + (Math.abs((this.counter - this.ENDCOUNTER) / 6) % 11 - 5);//this.counter - this.ENDCOUNTERは0～599
                        this.decorateSide(ctxFlip, BATTLEVIEW_MIKATA_X + 66 * (2 - i), BATTLEVIEW_MIKATA_Y + 66 * j, sideColor, decorateWidth);
                    }
                }
            }
        }
        for (var i = 0; i <= 2; i++) {
            for (var j = 0; j <= 2; j++) {
                ctxFlip.strokeRect(BATTLEVIEW_TEKI_X + BATTLEVIEW_SIZE * i, BATTLEVIEW_TEKI_Y + BATTLEVIEW_SIZE * (2 - j), BATTLEVIEW_SIZE - 2, BATTLEVIEW_SIZE - 2);
                this.battleFields[BATTLE_TEKI][i][j].paintMe(ctxFlip, BATTLEVIEW_TEKI_X + BATTLEVIEW_SIZE * i, BATTLEVIEW_TEKI_Y + BATTLEVIEW_SIZE * (2 - j));
                // ターゲット選択中
                if (this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE) {
                    var unitAtFocus = this.getUnitAtFocus(ud);
                    // 手番ユニットと当該マスの距離
                    var distance = unitAtFocus.x + unitAtFocus.y + i + j;
                    // TODO:レンジ計算
                    var range = 2;
 
                    var sideColor = 'rgb(0, 0, 0)';
                    if (range >= distance) {
                        // 普通に届く
                        sideColor = 'rgb(0, 0, 255)';
                    } else if (range == distance - 1) {
                        // 射程伸ばしで届く
                        sideColor = 'rgb(255, 255, 0)';
                    } else {
                        // 射程伸ばしでも届かない
                        sideColor = 'rgb(255, 0, 0)';
                    }
                        
                    var decorateWidth = 2 + (Math.abs((this.counter - this.ENDCOUNTER) / 6) % 11 - 5);//this.counter - this.ENDCOUNTERは0～599
                    this.decorateSide(ctxFlip, BATTLEVIEW_TEKI_X + 66 * i, BATTLEVIEW_TEKI_Y + 66 * (2 - j), sideColor, decorateWidth);
                }
            }
        }
        
        // 地形メッセージ表示
        ctxFlip.fillStyle = getGladColor((this.MAXCOUNTER - this.counter) / 6);
        ctxFlip.fillRect(BATTLEVIEW_FIELDTXT_X - 2, BATTLEVIEW_FIELDTXT_Y - 2, BATTLEVIEW_FIELDTXT_W + 5, BATTLEVIEW_FIELDTXT_H + 5);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(BATTLEVIEW_FIELDTXT_X, BATTLEVIEW_FIELDTXT_Y, BATTLEVIEW_FIELDTXT_W, BATTLEVIEW_FIELDTXT_H);
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        ctxFlip.font = "11px 'MS Pゴシック'";
        ctxFlip.fillText(this.fieldMsg, BATTLEVIEW_FIELDTXT_X, BATTLEVIEW_FIELDTXT_Y + 20);
        
        // 戦闘メッセージ表示
        ctxFlip.fillStyle = getGladColor((this.MAXCOUNTER - this.counter) / 6);
        ctxFlip.fillRect(BATTLEVIEW_BATTLETXT_X - 2, BATTLEVIEW_BATTLETXT_Y - 2, BATTLEVIEW_BATTLETXT_W + 5, BATTLEVIEW_BATTLETXT_H + 5);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(BATTLEVIEW_BATTLETXT_X, BATTLEVIEW_BATTLETXT_Y, BATTLEVIEW_BATTLETXT_W, BATTLEVIEW_BATTLETXT_H);
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        ctxFlip.font = "11px 'MS Pゴシック'";
        ctxFlip.fillText(this.fieldMsg, BATTLEVIEW_FIELDTXT_X, BATTLEVIEW_FIELDTXT_Y + 20);
        
        // SPゲージ表示
        ctxFlip.fillStyle = 'rgb(223, 223, 55)';
        ctxFlip.fillRect(BATTLEVIEW_SPGAUGE_X - 2, BATTLEVIEW_SPGAUGE_Y - 2, BATTLEVIEW_SPGAUGE_W + 5, BATTLEVIEW_SPGAUGE_H + 5);
        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
        ctxFlip.fillRect(BATTLEVIEW_SPGAUGE_X, BATTLEVIEW_SPGAUGE_Y, BATTLEVIEW_SPGAUGE_W, BATTLEVIEW_SPGAUGE_H);
        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
        ctxFlip.fillText("P:", BATTLEVIEW_SPGAUGE_X, BATTLEVIEW_SPGAUGE_Y + 10);
        ctxFlip.fillText(this.spGauge[BATTLE_MIKATA], BATTLEVIEW_SPGAUGE_X + 105, BATTLEVIEW_SPGAUGE_Y + 10);
        ctxFlip.fillText("E:", BATTLEVIEW_SPGAUGE_X, BATTLEVIEW_SPGAUGE_Y + 25);
        ctxFlip.fillText(this.spGauge[BATTLE_TEKI], BATTLEVIEW_SPGAUGE_X + 105, BATTLEVIEW_SPGAUGE_Y + 25);
        ctxFlip.fillStyle = 'rgb(0, 0, 239)';
        ctxFlip.fillRect(BATTLEVIEW_SPGAUGE_X + 15, BATTLEVIEW_SPGAUGE_Y + 4, 80 * this.spGaugePaint[BATTLE_MIKATA] / BATTLE_SPGAUGE_MAX, 5);
        ctxFlip.fillStyle = 'rgb(239, 0, 0)';
        ctxFlip.fillRect(BATTLEVIEW_SPGAUGE_X + 15, BATTLEVIEW_SPGAUGE_Y + 19, 80 * this.spGaugePaint[BATTLE_TEKI] / BATTLE_SPGAUGE_MAX, 5);
        // ユニット情報表示
        var focusUnit = this.getUnitAtFocus(ud);
        for (var i = 0; i < ud.length; i++) {
            var u = ud[i];
            if (u.field == this.field) {
                var paintXY = ItemDefine.getItemXY(u.eqType);
                var targetXY = this.getDestXY(u);
                // 移動中
                if (focusUnit === u && this.cantOpCounter > 0 && this.tempY != focusUnit.y) {
                    var orgDestY = BATTLEVIEW_MIKATA_Y + BATTLEVIEW_SIZE * this.tempY;
                    targetXY[1] = (targetXY[1] * (20 - this.cantOpCounter) + orgDestY * this.cantOpCounter) / 20;
                }
                ctxFlip.drawImage(BattleField.getWeaponsImg(), paintXY[0], paintXY[1], 64, 64, targetXY[0], targetXY[1], 64, 64);
                // ターゲット選択中
                if (this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE && u.side == BATTLE_TEKI) {
                    var adjust = ((this.MAXCOUNTER - this.counter) / 3) % 40;// EndCounter～MaxCounterは0～600
                    ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 6);
                    ctxFlip.fillRect(targetXY[0] + 6 - 1, targetXY[1] + adjust - 1, 54, 14);
                    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                    ctxFlip.fillRect(targetXY[0] + 6, targetXY[1] + adjust, 52, 12);
                    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                    ctxFlip.font = "10px 'MS Pゴシック'";
                    ctxFlip.fillText("ENEMY", targetXY[0] + 10, targetXY[1] + adjust + 10);
                    if (u.equalUnit(this.tempTargetEnemy)) {
                        for (var j = 0; j <= 2; j++) {
                            var targetCounter = (Math.floor((this.counter - this.ENDCOUNTER) / 3)) % 20;//this.counter - this.ENDCOUNTERは0～599
                            ctxFlip.beginPath();
                            var firstWidth = 6 * (this.MAXCOUNTER - this.counter);
                            var r = 23 - targetCounter + 6 * j;
                            ctxFlip.lineWidth = 2;
                            switch(j) {
                            case 0:arguments
                                ctxFlip.strokeStyle = 'rgb(191, 0, 0)';
                            break;
                            case 1:arguments
                                ctxFlip.strokeStyle = 'rgb(223, 0, 0)';
                            break;
                            case 2:arguments
                                ctxFlip.strokeStyle = 'rgb(255, 0, 0)';
                            break;
                            }
                            ctxFlip.arc(targetXY[0] + 32, targetXY[1] + 32, r, 0, 2 * Math.PI, false);
                            ctxFlip.stroke();
                        }
                    }
                }
            }
        }
        
        // 手番ユニットの強調
        for (var i = 0; i <= 4; i++) {
            var focusCounter = (Math.floor((this.counter - this.ENDCOUNTER) / 6)) % 20;//this.counter - this.ENDCOUNTERは0～599
            ctxFlip.beginPath();
            var firstWidth = 6 * (this.MAXCOUNTER - this.counter);
            var r = 28 - focusCounter;
            ctxFlip.lineWidth = 3;
            switch(i) {
            case 0:arguments
                ctxFlip.strokeStyle = 'rgb(223, 55, 0)';
                break;
            case 1:arguments
                ctxFlip.strokeStyle = 'rgb(0, 223, 111)';
                break;
            case 2:arguments
                ctxFlip.strokeStyle = 'rgb(111, 111, 223)';
                break;
            case 3:arguments
                ctxFlip.strokeStyle = 'rgb(159, 159, 159)';
                break;
            case 4:arguments
                ctxFlip.strokeStyle = 'rgb(223, 223, 0)';
                break;
            }
            var destX = this.getDestXY(focusUnit)[0];
            var destY = this.getDestXY(focusUnit)[1];
            ctxFlip.arc(destX + BATTLEVIEW_SIZE / 2 + r * Math.cos((-0.5 + 0.4 * i) * Math.PI), destY + BATTLEVIEW_SIZE / 2 + r * Math.sin((-0.5 + 0.4 * i) * Math.PI), r / 3, 0, 2 * Math.PI, true);
            ctxFlip.stroke();
        }
        
        // ユニットステータス表示
        if (this.infoUnit != null) {
            this.unitMsg(this.infoUnit, ctxFlip);
        }
        
        if (this.commandState == BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE) {
            // 装備可能なアイテム選択(i == 0は「手持ち」)
            for (var i = 0; i <= ITEM_EQMAX; i++) {
                var tempY = BATTLEVIEW_WEAP_Y + BATTLEVIEW_WEAP_INTERVAL * i;
                var tempEqType = ITEM_TYPE_TEMOCHI;// tempEqType:0は「手持ち」
                if (i >= 1) {
                    tempEqType = focusUnit.getReverseItemIndex(i - 1);
                    if (tempEqType == -1) {
                        break;
                    }
                }
                if (this.tempEqTypeForPaint == tempEqType) {
                    ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
                    ctxFlip.fillRect(BATTLEVIEW_WEAPTYPE_X - 2, tempY - 2, BATTLEVIEW_WEAPTYPE_W + 10 + 4, BATTLEVIEW_WEAPTYPE_H + 4);
                    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                    ctxFlip.fillRect(BATTLEVIEW_WEAPTYPE_X, tempY, BATTLEVIEW_WEAPTYPE_W + 10, BATTLEVIEW_WEAPTYPE_H);
                } else {
                    ctxFlip.fillStyle = 'rgb(127, 127, 127)';
                    ctxFlip.fillRect(BATTLEVIEW_WEAPTYPE_X - 1, tempY - 1, BATTLEVIEW_WEAPTYPE_W + 2, BATTLEVIEW_WEAPTYPE_H + 2);
                    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                    ctxFlip.fillRect(BATTLEVIEW_WEAPTYPE_X, tempY, BATTLEVIEW_WEAPTYPE_W, BATTLEVIEW_WEAPTYPE_H);
                }
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                ctxFlip.font = "10px 'MS Pゴシック'";
                var textY = tempY + 10;
                if (i == 0) {
                    ctxFlip.fillText("手持ち", BATTLEVIEW_WEAPTYPE_X, textY);
                } else {
                    ctxFlip.fillText(ItemDefine.getItemText(tempEqType), BATTLEVIEW_WEAPTYPE_X, textY);
                }
            }
            // 武器選択表示
            ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
            ctxFlip.fillRect(BATTLEVIEW_WEAP_X - 2, BATTLEVIEW_WEAP_Y - 2, BATTLEVIEW_WEAP_W + 5, BATTLEVIEW_WEAP_H + 5);
            ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            ctxFlip.fillRect(BATTLEVIEW_WEAP_X, BATTLEVIEW_WEAP_Y, BATTLEVIEW_WEAP_W, BATTLEVIEW_WEAP_H);
            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            ctxFlip.font = "10px 'MS Pゴシック'";
            var textY = BATTLEVIEW_WEAP_Y + 10;
            if (this.tempEqTypeForPaint == ITEM_TYPE_TEMOCHI) {
                // 手持ち武器の表示
                for (var j = 0; j < focusUnit.handEquip.length; j++) {
                    var tempHandEquip = focusUnit.handEquip[j];
                    var tempItem = new ItemDefine();
                    ItemDefine.init(tempHandEquip.eqType, tempHandEquip.eqSyurui, tempItem);
                    if (tempHandEquip.eqSyurui == this.tempEqSyurui) {
                        // 選択中の武器を強調
                        ctxFlip.fillStyle = 'rgb(255, 255, 0)';
                        ctxFlip.fillRect(BATTLEVIEW_WEAP_X, textY - 10, BATTLEVIEW_WEAP_W, 15);
                        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                    }
                    ctxFlip.fillText(tempItem.namae, BATTLEVIEW_WEAP_X, textY);
                    textY += BATTLEVIEW_WEAP_INTERVAL;
                }
            } else {
                // 手持ちでない武器の表示
                for (var i = 0; i < ITEM_SYURUI_MAX; i++) {
                    var tempEqSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempEqTypeForPaint, i);
                    if (tempEqSyurui == -1) {
                        // 表示すべきアイテムはすべて表示した
                        break;
                    } else {
                        var tempItem = new ItemDefine();
                        ItemDefine.init(this.tempEqTypeForEquip, tempEqSyurui, tempItem);
                        var tempItemNum = itemMap.get(tempItem.namae);
                        if (tempEqSyurui == this.tempEqSyurui) {
                            // 選択中の武器を強調
                            ctxFlip.fillStyle = 'rgb(255, 255, 0)';
                            ctxFlip.fillRect(BATTLEVIEW_WEAP_X, textY - 10, BATTLEVIEW_WEAP_W, 15);
                            ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                        }
                        ctxFlip.fillText(tempItem.namae, BATTLEVIEW_WEAP_X, textY);
                        ctxFlip.fillText(tempItemNum.allNum + "(空き"  + (tempItemNum.allNum - tempItemNum.equipNum) + ")", BATTLEVIEW_WEAP_X + 80, textY);
                        textY += BATTLEVIEW_WEAP_INTERVAL;
                    }
                }
            }   
        }
        
        // コマンド表示
        for (var i = 0; i <= 4; i++) {
            // 選択可能 or 選択中のみ色を変える
            var isHighLight = this.isSelected(i);
            if (isHighLight > 0) {
                ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
            } else {
                ctxFlip.fillStyle = 'rgb(31, 31, 31)';
            }
            var txtX = BATTLEVIEW_COMMANDTXT_X;
            var txtY = BATTLEVIEW_COMMANDTXT_Y + i * BATTLEVIEW_COMMANDINTERVAL;
            ctxFlip.fillRect(txtX - 1, txtY - 1, BATTLEVIEW_COMMANDTXT_W + 3, BATTLEVIEW_COMMANDTXT_H + 3);
            ctxFlip.fillStyle = 'rgb(255, 255, 255)';
            ctxFlip.fillRect(txtX, txtY, BATTLEVIEW_COMMANDTXT_W, BATTLEVIEW_COMMANDTXT_H);
            if (isHighLight > 0) {
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';
            } else {
                ctxFlip.fillStyle = 'rgb(127, 127, 127)';
            }
            ctxFlip.font = "16px 'MS Pゴシック'";
            var commandTxt = "";
            switch(i) {
            case 0:arguments
                commandTxt = "行動";
                break;
            case 1:arguments
                commandTxt = "移動";
                break;
            case 2:arguments
                commandTxt = "逃亡";
                break;
            case 3:arguments
                commandTxt = "待機";
                break;
            case 4:arguments
                commandTxt = "交代";
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

BattleView.prototype.getDestXY = function(u) {
    var destX = 0;
    var destY = 0;
    if (u.side == BATTLE_MIKATA) {
        destX = BATTLEVIEW_MIKATA_X + BATTLEVIEW_SIZE * (2 - u.x);
        destY = BATTLEVIEW_MIKATA_Y + BATTLEVIEW_SIZE * u.y;
    } else {
        destX = BATTLEVIEW_TEKI_X + BATTLEVIEW_SIZE * u.x;
        destY = BATTLEVIEW_TEKI_Y + BATTLEVIEW_SIZE * (2 - u.y);
    }
    return [destX, destY];
}

BattleView.prototype.decorateSide = function(ctxFlip, x, y, color, width) {
    ctxFlip.fillStyle = color;
    ctxFlip.fillRect(x, y, width, 64);
    ctxFlip.fillRect(x + 64 - width, y, width, 64);
};

// 各コマンドボタンが選択可能/選択中か?
BattleView.prototype.isSelected = function(i) {
    if (this.commandState == BATTLEVIEW_COMSTATE_PRECHOICE) {
        return 1;
    }
    if (Math.floor(this.commandState / 10) == i + 1) {
        return 2;
    }
    return 0;
}

// 現在手番のユニットを取得
BattleView.prototype.getUnitAtFocus = function(ud) {    
    for (var i = 0; i < ud.length; i++) {
        var u = ud[i];
        if (u.field == this.field &&  u.side == (this.focus % 2) && u.x == Math.floor(this.focus / 2)) {
            return u; 
        }
    }
    return null;
}

BattleView.prototype.unitMsg = function (u, ctxFlip) {
    ctxFlip.fillStyle = getGladColorBlue((this.MAXCOUNTER - this.counter) / 6);
    ctxFlip.fillRect(BATTLEVIEW_UNITTXT_X - 1, BATTLEVIEW_UNITTXT_Y - 1, BATTLEVIEW_UNITTXT_W + 3, BATTLEVIEW_UNITTXT_H + 3);
    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
    ctxFlip.fillRect(BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y, BATTLEVIEW_UNITTXT_W, BATTLEVIEW_UNITTXT_H);
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.font = "11px 'MS Pゴシック'";
    var battleStatus = u.calcBattleStr();// 装備品込みのステータスと装備名を取得
    var focusUnit = this.getUnitAtFocus(ud);
    if (focusUnit.x == u.x && (this.commandState == BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE || this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE)) {
        // 武器選択中/ターゲット選択中の手番ユニットのみ、実装備武器でなく「装備予定武器」を装備したステータス表示
        if (this.tempEqSyurui == -1) {
            // 表示中の武器タイプで、装備可能なアイテムすべて非所持→現在の装備品のステータスを出す
        } else {
            battleStatus = u.calcBattleStr(this.tempEqTypeForEquip, this.tempEqSyurui);
        }
    }
    
    var yInterval = 12;//1行の高さ
    var lineCount = 1;//何行目か
    ctxFlip.fillText(u.namae, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20);
    ctxFlip.fillText("Lv" + u.lv, BATTLEVIEW_UNITTXT_X + 75, BATTLEVIEW_UNITTXT_Y + 20);//Lv
    ctxFlip.fillText(battleStatus.namae, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);//装備品
    ctxFlip.fillText("ドロップアイテム", BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);//ドロップアイテム
    ctxFlip.fillText("HP:" + u.hp + "/" + u.mhpObj.now, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    //ctxFlip.fillText("HP:" + u.hp + "/" + u.mhp, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + 3 * yInterval);
    if (u.side == BATTLE_MIKATA) {
        ctxFlip.fillText("気力:" + u.sp + "/" + u.msp, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    } else {
        lineCount++;//見た目合わせのためlineCount++だけは必要
    }
    ctxFlip.fillText("力　:" + u.strObj.now + "→" + battleStatus.str, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("魔力:" + u.magObj.now + "→" + battleStatus.mag, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("守備:" + u.defObj.now + "→" + battleStatus.def, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("魔防:" + u.mdfObj.now + "→" + battleStatus.mdf, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("命中:" + u.hitObj.now + "→" + battleStatus.hit, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("回避:" + u.avoObj.now + "→" + battleStatus.avo, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("割合攻撃:" + u.rat + "→" + battleStatus.rat, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    ctxFlip.fillText("割合軽減:" + u.rdf + "→" + battleStatus.rdf, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    if (u.side == BATTLE_MIKATA) {
        ctxFlip.fillText("耐毒:" + u.regPoison, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
        ctxFlip.fillText("耐痺:" + u.regPoison, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    } else {
        lineCount += 2;
    }
    ctxFlip.fillText("移動1:" + u.m1Cost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("移動2:" + u.m2Cost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("射程+:" + u.rangeCost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("再行動:" + u.exAtCost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("スキル1:" + u.exAtCost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 15);
    ctxFlip.fillText("スキル2:" + u.exAtCost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 15);
    ctxFlip.fillText("スキル3:" + u.exAtCost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 15);

    ctxFlip.fillText("Exp:" + u.exp, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 25 + lineCount++ * yInterval + 15);
    if (u.side == BATTLE_MIKATA) {
        for (var i = ITEM_TYPE_SWORD; i <= ITEM_TYPE_EARTH; i++) {
            if (u.getItemIndex(i) >= 0) {
                ctxFlip.fillText(ItemDefine.getItemText(i) + ":" + u.weaps[i], BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 30 + lineCount++ * yInterval + 15);
            }
            //if (u.weaps[i] > 0) {
            //    ctxFlip.fillText(ItemDefine.getItemText(i) + ":" + u.weaps[i], BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 30 + lineCount++ * yInterval + 15);
            //}
        }
    }
    // ユニット顔グラ表示
    ctxFlip.drawImage(UnitDefine.getCharaImg(u.pSyurui), u.px, u.py, 256, 320, BATTLEVIEW_UNITPAINT_X, BATTLEVIEW_UNITPAINT_Y, 128, 160);
}

BattleView.prototype.moveCheckComState = function(cState, cComState) {
    this.state = cState;
    this.commandState = cComState;
    var checkRet = 1; 
}

// 各マスごとに、移動可能かどうかチェック
// -1…そもそも列orSide違い 0…同一マス それ以外…移動コスト 
BattleView.prototype.checkMoveCost = function(orgSide, orgX, orgY, checkSide, checkX, checkY) {
    if (orgSide != checkSide || orgX != checkX) {
        return -2;
    }
    if (checkY == orgY) {
        return 0;
    }
    if (Math.abs(checkY - orgY) == 1) {
        return this.battleFields[checkSide][checkX][checkY].move;
    }
    // 残るのはcheckY:2 orgY:0かcheckY:0 orgY:2のみ
    if (checkY == 2 && orgY == 0) {
        return this.battleFields[checkSide][checkX][checkY - 1].move + this.battleFields[checkSide][checkX][checkY].move;
    } else {
        return this.battleFields[checkSide][checkX][checkY + 1].move + this.battleFields[checkSide][checkX][checkY].move;
    }
}

BattleView.prototype.searchAtXY = function(x, y, ud) {
    var retU = null;
    for (var i = 0; i < ud.length; i++) {
        var u = ud[i];
        if (u.field == this.field) {
            // destX, destYは描画時(左端、上端)と違いX座標、Y座標の中央
            var destX = 0;
            var destY = 0;
            if (u.side == BATTLE_MIKATA) {
                destX = BATTLEVIEW_MIKATA_X + BATTLEVIEW_SIZE * (2 - u.x) + BATTLEVIEW_SIZE / 2;
                destY = BATTLEVIEW_MIKATA_Y + BATTLEVIEW_SIZE * u.y + BATTLEVIEW_SIZE / 2;
            } else {
                destX = BATTLEVIEW_TEKI_X + BATTLEVIEW_SIZE * u.x + BATTLEVIEW_SIZE / 2;
                destY = BATTLEVIEW_TEKI_Y + BATTLEVIEW_SIZE * (2 - u.y) + BATTLEVIEW_SIZE / 2;
            }
     
            if (Math.abs(destX - x) < BATTLEVIEW_SIZE / 2 && Math.abs(destY - y) < BATTLEVIEW_SIZE / 2) {
                retU = u;
            }
        }
    }
    return retU;
}

BattleView.prototype.clk = function(mouseX, mouseY, ud, itemMap) {
    //演出中
    if (this.cantOpCounter > 0) {
        return;
    }
    
    // 味方マスチェック中
    if (mouseX >= BATTLEVIEW_MIKATA_X && mouseX <= BATTLEVIEW_MIKATA_X + 3 * BATTLEVIEW_SIZE &&
        mouseY >= BATTLEVIEW_MIKATA_Y && mouseY <= BATTLEVIEW_MIKATA_Y + 3 * BATTLEVIEW_SIZE) {
        var searchX = Math.floor((mouseX - BATTLEVIEW_MIKATA_X) / BATTLEVIEW_SIZE);
        var searchY = Math.floor((mouseY - BATTLEVIEW_MIKATA_Y) / BATTLEVIEW_SIZE);
        this.fieldMsg = this.battleFields[BATTLE_MIKATA][2 - searchX][searchY].explainMsg();
        // ユニット移動もここで行う
        if (this.commandState == BATTLEVIEW_COMSTATE_MOVE) {
            var unitAtFocus = this.getUnitAtFocus(ud);
            var moveCost = this.checkMoveCost(BATTLE_MIKATA, unitAtFocus.x, unitAtFocus.y, BATTLE_MIKATA, 2 - searchX, searchY);
            if (moveCost == 1 || moveCost == 2) {
                var requireCost = (moveCost == 1 ? unitAtFocus.m1Cost : unitAtFocus.m2Cost);
                if (this.spGauge[BATTLE_MIKATA] >= requireCost) {
                    // 移動
                    this.cantOpCounter = 20;
                    this.spGauge[BATTLE_MIKATA] -= requireCost;
                    unitAtFocus.y = searchY;   
                } else {
                    CommonView.addMessage("SPゲージが足りません");
                }
                
            }                    
        }
    }
    // 敵マスチェック中
    if (mouseX >= BATTLEVIEW_TEKI_X && mouseX <= BATTLEVIEW_TEKI_X + 3 * BATTLEVIEW_SIZE &&
        mouseY >= BATTLEVIEW_TEKI_Y && mouseY <= BATTLEVIEW_TEKI_Y + 3 * BATTLEVIEW_SIZE) {
        var searchX = Math.floor((mouseX - BATTLEVIEW_TEKI_X) / BATTLEVIEW_SIZE);
        var searchY = Math.floor((mouseY - BATTLEVIEW_TEKI_Y) / BATTLEVIEW_SIZE);
        this.fieldMsg = this.battleFields[BATTLE_TEKI][searchX][2 - searchY].explainMsg();
    }
    
    var focusUnit = this.getUnitAtFocus(ud);
    if (this.commandState == BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE) {
        // 武器タイプ選択
        if (mouseX >= BATTLEVIEW_WEAPTYPE_X && mouseX <= BATTLEVIEW_WEAPTYPE_X + BATTLEVIEW_WEAPTYPE_W) {
            var tempY = Math.floor((mouseY - BATTLEVIEW_WEAP_Y) / BATTLEVIEW_WEAP_INTERVAL);
            if (tempY == 0) {
                // tempY = 0は「手持ち」が入る
                this.tempEqTypeForPaint = ITEM_TYPE_TEMOCHI;
                // とりあえず最初の武器を暫定装備(必ず「素手」)
                var handEquip0 = focusUnit.handEquip[0];
                this.tempEqTypeForEquip = handEquip0.eqType;
                this.tempEqSyurui = handEquip0.eqSyurui;
            } else {
                var weapTypeIndex = focusUnit.getReverseItemIndex(tempY - 1);
                // -1は「見つからなかった」の意味
                if (weapTypeIndex != -1) {
                    this.tempEqTypeForPaint = weapTypeIndex;
                    this.tempEqTypeForEquip = weapTypeIndex;
                    // とりあえず最初の武器を表示、暫定装備
                    this.tempEqSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempEqTypeForEquip, 0);
                }
            }
        }
        // 武器種類選択
        if (mouseX >= BATTLEVIEW_WEAP_X && mouseX <= BATTLEVIEW_WEAP_X + BATTLEVIEW_WEAP_W) {
            // 上から何番目の武器を選択したか
            var tempY = Math.floor((mouseY - BATTLEVIEW_WEAP_Y) / BATTLEVIEW_WEAP_INTERVAL);
            if (this.tempEqTypeForPaint == ITEM_TYPE_TEMOCHI) {
                if (tempY < focusUnit.handEquip.length){
                    var handEquipSelected = focusUnit.handEquip[tempY];
                    this.tempEqTypeForEquip = handEquipSelected.eqType;
                    if (this.tempEqSyurui = handEquip0.eqSyurui) {
                        // 選択済みの武器に決定
                        this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE);
                        this.tempTargetEnemy = -1;
                    } else {
                        // 武器選択
                        this.tempEqSyurui = handEquip0.eqSyurui;
                    }
                }
            } else {
                var tempEqSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempEqTypeForPaint, tempY);
                if (tempEqSyurui != -1) {
                    if (this.tempEqSyurui == tempEqSyurui) {
                        // 選択済みの武器に決定
                        this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE);
                    } else {
                        // 表示すべきアイテムあり
                        this.tempEqSyurui = tempEqSyurui;
                    }
                } 
            }
        }
    }
    if (this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE) {
        var tempUnit = this.searchAtXY(mouseX, mouseY, ud);   
        // 敵をクリックしていたらターゲットに設定
        if (tempUnit != null && tempUnit.side == BATTLE_TEKI) {
            if (tempUnit.equalUnit(this.tempTargetEnemy)) {
                // 既に選択済みの敵を再選択したら、攻撃
                CommonView.addMessage("攻撃します!");
            } else {
                // 別のターゲットに移る
                this.tempTargetEnemy = tempUnit;
            }
        } else {
            // ターゲット解除
            this.tempTargetEnemy = null;
        }
    }
    // 戦闘コマンド選択
    if (mouseX >= BATTLEVIEW_COMMANDTXT_X && mouseX <= BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W) {
        var commandNum = Math.floor((mouseY - BATTLEVIEW_COMMANDTXT_Y) / BATTLEVIEW_COMMANDINTERVAL);
        var isSelectable = this.isSelected(commandNum);
        if (isSelectable == 0) {
            // コマンド選択に戻す
            this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_PRECHOICE);
        } else {
            switch(commandNum) {
                case 0:arguments//行動
                    // とりあえず手持ち武器を表示
                    this.tempEqTypeForPaint = ITEM_TYPE_TEMOCHI;
                    // とりあえず最初の武器を暫定装備(必ず「素手」)
                    var handEquip0 = focusUnit.handEquip[0];
                    this.tempEqTypeForEquip = handEquip0.eqType;
                    this.tempEqSyurui = handEquip0.eqSyurui;
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE);
                break;
                case 1:arguments//移動
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_MOVE);
                break;
                case 2:arguments//逃亡
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_RUN);
                break;
                case 3:arguments//待機
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_WAIT);
                break;
                case 4:arguments//交代
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_CHANGE);
                break;
            }
        }
    }
    
    // ユニット情報(詳細ステータス)表示
    this.infoUnit = null;
    // 武器選択中は常に手番ユニット情報を表示
    if (this.commandState == BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE) {
        this.infoUnit = focusUnit;
    } else {
        var tempUnit = this.searchAtXY(mouseX, mouseY, ud);
        // クリック先にユニットがいたら表示ユニット更新
        this.infoUnit = (tempUnit != null ? tempUnit : this.infoUnit);
    }
    //var u2 = new UnitDefine();
    //this.infoUnit = u2;
    // ゲームステータス変更なし
    return -1;
    //TitleStar.titleCounter(0);
    //return GAMEMODE_GAMEOVER;
}