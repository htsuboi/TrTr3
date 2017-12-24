// 操作キャンセル時に戻すデータを保管
var returnableData = function() {
    this.x = 0;
    this.y = 0;
    this.spGauge = 0;
};

// 攻撃実行時の結果保管
var battleResult = function() {
    this.isHit = false;
    this.isCrt = false;
    this.isPoison = false;
    this.isStun = false;
    this.damage = 0;
};

var BattleView = function() {
    this.counter = 0;
    this.INITIALCOUNTER = 180;// ここに到達するまでは画面作りかけ状態(this.turnはBATTLEVIEW_TURN_INITIAL)
    this.WINCOUNTER = 90;// 戦闘勝利演出(this.turnはBATTLEVIEW_TURN_WINBATTLE)
    this.LOSECOUNTER = 90;// 戦闘敗北演出(this.turnはBATTLEVIEW_TURN_LOSEBATTLE)
    this.MAXCOUNTER = 600;// 画面完成後、0～MAXCOUNTERまでの値をぐるぐるしてアニメーションさせる
    this.bar = [0, 0, 0, 0, 0, 0, 0];// 演出用の棒の長さ
    this.fieldDefine = new FieldDefine();
    this.fieldMsg = "";
    this.battleMsg = ["", "", "", ""];
    this.tempMikata = null;// 最初の参戦ユニット決定時にのみ使用
    this.spGauge = [0, 0];// 味方、敵のspゲージ
    this.spGaugePaint = [0, 0];// 味方、敵のspゲージ(表示用　実際のゲージはspGauge)
    this.field = 0;//どのフィールドか
    this.isOffence = false;
    this.infoUnit = null;// どのユニットの情報を表示するか
    this.focus = 0;//手番ユニット(0～5)
    this.turn = BATTLEVIEW_TURN_INITIAL;
    this.state = BATTLEVIEW_STATE_FIRSTMOVE;
    this.commandState = BATTLEVIEW_COMSTATE_PRECHOICE;
    this.cantOpCounter = 0;// 演出のため操作不能な時間
    this.battleFields = new Array();
    this.tempResult = new battleResult();
    this.winExp = 0;//戦闘勝利時のExp
    this.winMoney = 0;//戦闘勝利時の金
    // 手持ち武器の選択時、tempEquipTypeForPaintは「ITEM_TYPE_TEMOCHI」だが、tempEqTypeForEquipは手持ち武器の種類により変わる
    // それ以外の状況では下記2変数は一致している
    this.tempEqTypeForPaint = ITEM_TYPE_TEMOCHI;//どの属性の武器を画面表示するか
    this.tempEqTypeForEquip = 0;//どの属性の武器を暫定的に装備しているか
    this.tempEqSyurui = 0;//カーソルが合っている武器種類
    this.tempTargetUnit = null;//暫定攻撃ターゲット
    this.tempTargetUnitY = -1;//暫定移動Y座標
    this.originalUnitY = 0;// 移動演出のため使用
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

BattleView.prototype.init = function(position, isOffence) {
    this.counter = 0;
    this.fieldDefine.init(position);
    this.fieldMsg = "";
    this.battleMsg = ["", "", "", ""];
    this.tempMikata = null;// 最初の参戦ユニット決定時にのみ使用
    this.spGauge = [0, 0];// 味方、敵のspゲージ
    this.spGaugePaint = [0, 0];// 味方、敵のspゲージ(表示用　実際のゲージはspGauge)
    this.field = position;
    this.isOffence = isOffence;
    this.infoUnit = null;// どのユニットの情報を表示するか
    this.focus = 0;//手番ユニット(0～5)
    this.turn = BATTLEVIEW_TURN_INITIAL;
    this.state = BATTLEVIEW_STATE_FIRSTMOVE;
    this.commandState = BATTLEVIEW_COMSTATE_PRECHOICE;
    this.cantOpCounter = 0;// 演出のため操作不能な時間
    this.spGauge = [0, 0];// 味方、敵のspゲージ
    this.tempMikata = new Array();// 最初の参戦ユニット決定時にのみ使用
    this.spGaugePaint = [0, 0];// 味方、敵のspゲージ(表示用　実際のゲージはspGauge)
    this.winExp = 0;//戦闘勝利時のExp
    this.winMoney = 0;//戦闘勝利時の金
    // 手持ち武器の選択時、tempEquipTypeForPaintは「ITEM_TYPE_TEMOCHI」だが、tempEqTypeForEquipは手持ち武器の種類により変わる
    // それ以外の状況では下記2変数は一致している
    this.tempEqTypeForPaint = ITEM_TYPE_TEMOCHI;//どの属性の武器を画面表示するか
    this.tempEqTypeForEquip = 0;//どの属性の武器を暫定的に装備しているか
    this.tempEqSyurui = 0;//カーソルが合っている武器種類
    this.tempTargetUnit = null;//暫定攻撃ターゲット
    this.tempTargetUnitY = -1;//暫定移動Y座標
    this.originalUnitY = 0;// 移動前のY座標
    for (var j = 0; j <= 2; j++) {
        for (var k = 0; k <= 2; k ++) {
            if (isOffence) {
                this.battleFields[BATTLE_MIKATA][j][k].init(this.fieldDefine.ofMap[3 * j + k]);
                this.battleFields[BATTLE_TEKI][j][k].init(this.fieldDefine.dfMap[3 * j + k]);
            } else {
                this.battleFields[BATTLE_MIKATA][j][k].init(this.fieldDefine.dfMap[3 * j + k]);
                this.battleFields[BATTLE_TEKI][j][k].init(this.fieldDefine.ofMap[3 * j + k]);
            }
        }
    }    
};

BattleView.prototype.initTurn = function (ud) {
    this.state = BATTLEVIEW_STATE_FIRSTMOVE;
    this.commandState = BATTLEVIEW_COMSTATE_PRECHOICE;
    this.cantOpCounter = 0;// 演出のため操作不能な時間
    if (this.turn == BATTLE_MIKATA) {
        this.spGauge[BATTLE_MIKATA] = Math.min(this.spGauge[BATTLE_MIKATA] + BATTLE_SPGAUGE_CHARGE, BATTLE_SPGAUGE_MAX);
    } else {
        this.spGauge[BATTLE_TEKI] = Math.min(this.spGauge[BATTLE_TEKI] + BATTLE_SPGAUGE_CHARGE, BATTLE_SPGAUGE_MAX);
    }
    this.infoUnit = this.getUnitAtFocus(ud);
    this.initAct();
};

// 1ターン中に行動終了のたびにコール
BattleView.prototype.initAct = function () {
    this.tempEqTypeForPaint = ITEM_TYPE_TEMOCHI;//表示している武器タイプ
    this.tempEqTypeForEquip = -1;//暫定装備している武器タイプ
    this.tempEqSyurui = -1;//カーソルが合っている=暫定装備している武器種類
    this.tempTargetUnit = null;//攻撃ターゲット
    this.tempTargetUnitY = -1;//暫定移動Y座標
    this.tempResult.isHit = false;
    this.tempResult.isCrt = false;
    this.tempResult.isPoison = false;
    this.tempResult.isStun = false;
    this.tempResult.damage = 0;
    this.originalUnitY = 0;// 移動前のY座標
    this.battleMsg = ["", "", "", ""];
};

BattleView.prototype.calc = function(ud, itemMap, next, ev) {
    if (CommonView.printTutorialFlag() == true) {
        // チュートリアル表示中はなにもせず画面を固める
        return;
    }
    
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
    
    var unitAtFocus = this.getUnitAtFocus(ud);
    if (this.cantOpCounter > 0) {
        this.cantOpCounter--;
    } else {
        if (unitAtFocus != null) {
            // originUnitYは「移動演出中の移動元座標」にしか使用しないので、使用後は移動先にあわせる
            this.originalUnitY = unitAtFocus.y;
        }
    }
    
    if (this.turn == BATTLEVIEW_TURN_SKILLSELECT && this.cantOpCounter == 1) {
        this.turn = BATTLEVIEW_TURN_MIKATA;
        this.initTurn(ud);
    }
    
    if ((this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE || 
       (this.turn == BATTLEVIEW_TURN_TEKI && this.state == BATTLEVIEW_STATE_ACTSTART)) && this.cantOpCounter > 0) {
        // 攻撃処理中
        var tempIndex = 0;
        // trueなら攻撃、falseならアイテム使用/なにもしない
        var isAttack = (this.tempEqTypeForEquip != ITEM_TYPE_DOGU && this.tempEqTypeForEquip != ITEM_TYPE_NOTHING ? true :false);
        var tempItem = new ItemDefine();
        ItemDefine.init(this.tempEqTypeForEquip, this.tempEqSyurui, tempItem);
        if (this.cantOpCounter > BATTLE_BATTLEMSG_SECOND + 5) {
            this.battleMsg = ["", "", "", ""];
        }
        if (this.cantOpCounter <= BATTLE_BATTLEMSG_SECOND + 5) {
            if (isAttack) {
                this.battleMsg[tempIndex++] = unitAtFocus.namae + "は" + this.tempTargetUnit.namae + "に攻撃した。";
            } else {
                if (this.tempEqTypeForEquip == ITEM_TYPE_DOGU) {
                    //アイテム使用
                    this.battleMsg[tempIndex++] = unitAtFocus.namae + "は" + tempItem.namae + "を使った。";
                }
                if (this.tempEqTypeForEquip == ITEM_TYPE_NOTHING) {
                    this.battleMsg[tempIndex++] = unitAtFocus.namae + "は何もしなかった。";
                }
            }
        }
        if (this.cantOpCounter <= BATTLE_BATTLEMSG_SECOND) {
            if (isAttack) {
                if (!this.tempResult.isHit) {
                    this.battleMsg[tempIndex++] = this.tempTargetUnit.namae + "は攻撃をかわした。";
                } else {
                    if (this.tempResult.isCrt) {
                       this.battleMsg[tempIndex++] = "クリティカル!"; 
                    }
                    if (this.tempResult.damage == 0) {
                        this.battleMsg[tempIndex++] = "ダメージが通らない!";
                    } else {
                        this.battleMsg[tempIndex++] = this.tempResult.damage + "ダメージ!";
                    }
                }
            }
        }
        if (this.cantOpCounter == BATTLE_BATTLEMSG_THIRD) {
            if (isAttack && this.tempResult.isHit) {
                // ダメージ・毒・麻痺
                if (unitAtFocus.hasSkill(ud, SKILL_SYONETSU)) {
                    for (var i = 0; i < ud.length; i++) {
                        var u = ud[i];
                        if (u.side == this.tempTargetUnit.side && u.field == this.tempTargetUnit.field && !u.equalUnit(this.tempTargetUnit)) {
                            u.hp = Math.max(u.hp - Math.floor(0.01 * SKILL_SYONETSU_RATE * this.tempResult.damage), 1);
                        }
                    }
                }
                this.tempTargetUnit.hp = Math.max(this.tempTargetUnit.hp - this.tempResult.damage, 0);
                if (this.tempTargetUnit.hp == 0) {
                    this.battleMsg[tempIndex++] = this.tempTargetUnit.namae + "は倒れた!";
                } else {
                    if (this.tempResult.isPoison && this.tempResult.isStun) {
                        this.tempTargetUnit.isPoison = true;
                        this.tempTargetUnit.isStun = true;
                        this.battleMsg[tempIndex++] = this.tempTargetUnit.namae + "は毒と麻痺を受けた!";
                    } else if (this.tempResult.isPoison) {
                        this.tempTargetUnit.isPoison = true;
                        this.battleMsg[tempIndex++] = this.tempTargetUnit.namae + "は毒を受けた!";
                    } else if (this.tempResult.isStun) {
                        this.tempTargetUnit.isStun = true;
                        this.battleMsg[tempIndex++] = this.tempTargetUnit.namae + "は麻痺を受けた!";
                    } 
                }
            } 
            if (!isAttack){
                if (this.tempEqTypeForEquip == ITEM_TYPE_DOGU) {
                    //アイテム使用
                    var tempItemNum = itemMap.get(tempItem.namae);
                    // 1個消費する
                    itemMap.set(tempItem.namae, tempItemNum - 1);
                    switch(this.tempEqSyurui) {
                    case ITEM_SYURUI_KOUCHA:arguments
                        this.battleMsg[tempIndex++] = this.tempTargetUnit.namae + "のHPが全快した。";
                        this.tempTargetUnit.hp = this.tempTargetUnit.mhpObj.now;
                        break;
                    case ITEM_SYURUI_KOUSUI:arguments
                        this.battleMsg[tempIndex++] = this.tempTargetUnit.namae + "の気力が全快した。";
                        this.tempTargetUnit.sp = this.tempTargetUnit.msp;
                        break;
                    case ITEM_SYURUI_JIAI:arguments
                        this.battleMsg[tempIndex++] = "全員のHPが全快した。";
                        UnitDefine.allTargetSyori(ud, ITEM_SYURUI_JIAI, this);
                        break;
                    case ITEM_SYURUI_MUJIN:arguments
                        this.battleMsg[tempIndex++] = "全員の気力が全快した。";
                        UnitDefine.allTargetSyori(ud, ITEM_SYURUI_MUJIN, this);
                        break;
                    }
                }
                if (this.tempEqTypeForEquip == ITEM_TYPE_NOTHING) {
                    unitAtFocus.isPoison = false;
                    unitAtFocus.isStun = false;
                    this.battleMsg[tempIndex++] = "ステータス異常が全快した。";
                }
            }
        }
        if (isAttack && this.tempResult.isHit && this.cantOpCounter == 1) {
            if (this.tempTargetUnit.hp == 0) {
                this.infoUnit = null;// 必ず「今倒した敵」を表示しているはずなので、その表示をやめる
                var shibouSide = this.tempTargetUnit.side;
                this.shibouUnit(this.tempTargetUnit, ud);
            }
        }
        if (this.cantOpCounter == 1) {
            var endCheck = this.endBattleCheck(ud);
            if (endCheck == -1) {
                // 決着がついていない
                this.initAct();
                this.moveCheckComState(BATTLEVIEW_STATE_SECONDMOVE, BATTLEVIEW_COMSTATE_PRECHOICE);
            }
        }
    }
    
    if (this.turn == BATTLEVIEW_TURN_TEKI && this.cantOpCounter == 0) {
        // 敵の行動決定
        switch(this.state) {
        // 最初の移動、行動後の移動
        case BATTLEVIEW_STATE_FIRSTMOVE:arguments
        case BATTLEVIEW_STATE_SECONDMOVE:arguments
            var moveCheck = 0;
            if (this.state == BATTLEVIEW_STATE_FIRSTMOVE) {
                moveCheck = unitAtFocus.decideFirstMove(ud, this);
            } else {
                // 再行動実行時はここでACTSTARTに遷移させる
                if (unitAtFocus.decideAgain(ud, this)) {
                    this.spGauge[BATTLE_TEKI] -= unitAtFocus.exAtCost;
                    this.moveCheckComState(BATTLEVIEW_STATE_ACTSTART, BATTLEVIEW_COMSTATE_PRECHOICE);
                    return -1;
                }
                moveCheck = unitAtFocus.decideSecondMove(ud, this);
            }
            if (moveCheck == 0) {
                if (this.state == BATTLEVIEW_STATE_FIRSTMOVE) {
                    this.cantOpCounter = 20;
                    this.state = BATTLEVIEW_STATE_ACTSTART;
                } else {
                    this.endTurn(ud);
                }
            } else if (moveCheck > 0){
                this.cantOpCounter = 20;
                this.spGauge[BATTLE_TEKI] -= (moveCheck == 1 ? unitAtFocus.m1Cost : unitAtFocus.m2Cost);
                unitAtFocus.y -= 1;
                this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_MOVE);
            } else if (moveCheck < 0){
                this.cantOpCounter = 20;
                this.spGauge[BATTLE_TEKI] -= (moveCheck == -1 ? unitAtFocus.m1Cost : unitAtFocus.m2Cost);
                unitAtFocus.y += 1;
                this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_MOVE);
            }
            break;
        case BATTLEVIEW_STATE_ACTSTART:arguments
            var actCheck = unitAtFocus.decideAttack(ud, this);
            if (actCheck == null) {
                // 攻撃ターゲットなし
                this.cantOpCounter = 20;
                this.state = BATTLEVIEW_STATE_SECONDMOVE;
            } else {
                this.cantOpCounter = BATTLE_BATTLEMSG_MAX;
                this.tempTargetUnit = actCheck;
                var range = UnitDefine.calcRange(unitAtFocus, ud, unitAtFocus.eqType, unitAtFocus.eqSyurui);
                var dist = unitAtFocus.x + unitAtFocus.y + this.tempTargetUnit.x + this.tempTargetUnit.y;
                if (range < dist) {
                    // 射程伸ばし
                    this.spGauge[BATTLE_TEKI] -= unitAtFocus.rangeCost;
                }
                var randomForHit = Math.floor(Math.random() * 100);//0～99
                var hitRate = UnitDefine.calcHit(unitAtFocus, this.tempTargetUnit, ud, unitAtFocus.eqType, unitAtFocus.eqSyurui);
                this.tempResult.isHit = hitRate > randomForHit;
                var randomForCrt = Math.floor(Math.random() * 100);//0～99
                var crtRate = UnitDefine.calcCrt(unitAtFocus, this.tempTargetUnit, ud, unitAtFocus.eqType, unitAtFocus.eqSyurui);
                this.tempResult.isCrt = crtRate > randomForCrt;

                var basicDamage = UnitDefine.calcBasicDamage(unitAtFocus, this.tempTargetUnit, ud, unitAtFocus.eqType, unitAtFocus.eqSyurui);
                var chikeiRate = UnitDefine.calcChikei(unitAtFocus, this.tempTargetUnit, ud, this.battleFields, unitAtFocus.eqType, unitAtFocus.eqSyurui);
                var rateDamage = UnitDefine.calcRateDamage(unitAtFocus, this.tempTargetUnit, ud, unitAtFocus.eqType, unitAtFocus.eqSyurui);
                var totalDamage = Math.floor(basicDamage * (100 - chikeiRate) / 100 + rateDamage);
                var randomForPlus = 0.01 * Math.random() * LUCK_RATE * unitAtFocus.luck;
                var randomForKeigen = 0.01 * Math.random() * LUCK_RATE * this.tempTargetUnit.luck;
                this.tempResult.damage = Math.floor(totalDamage * (1 + randomForPlus) * (1 - randomForKeigen));
                if (this.tempResult.isCrt) {
                    // クリティカル時のダメージ増加
                    var crtDamage = UnitDefine.calcCrtDamage(unitAtFocus, this.tempTargetUnit, ud, unitAtFocus.eqType, unitAtFocus.eqSyurui);
                    this.tempResult.damage += crtDamage;
                }
                // かまいたちで確保すべきダメージ
                var kamaitachiDMG = SKILL_YOROI_RATE * unitAtFocus.lv;
                if ((!this.tempResult.isHit || this.tempResult.damage < kamaitachiDMG) && unitAtFocus.hasSkill(ud, SKILL_KAMAITACHI)) {
                    CommonView.addMessage(SkillDefine.getSkillName(SKILL_KAMAITACHI) + "発動!", 40);
                    this.tempResult.isHit = true;
                    this.tempResult.isCrt = false;
                    this.tempResult.damage = kamaitachiDMG;
                }
                var isPoison = UnitDefine.calcPoison(unitAtFocus, this.tempTargetUnit, ud);
                // 攻撃がヒット時のみ毒を受ける
                this.tempResult.isPoison = isPoison && this.tempResult.isHit;
                var isStun = UnitDefine.calcStun(unitAtFocus, this.tempTargetUnit, ud);
                // 攻撃がヒット時のみ麻痺を受ける
                this.tempResult.isStun = isStun && this.tempResult.isHit;
            }
            break;
        }
    }
    
    if (this.commandState == BATTLEVIEW_COMSTATE_MOVE && this.cantOpCounter > 0) {
        // 移動処理中
        if (this.cantOpCounter == 1) {
            if (this.state == BATTLEVIEW_STATE_FIRSTMOVE) {
                this.originalUnitY = unitAtFocus.y;
                this.moveCheckComState(BATTLEVIEW_STATE_ACTSTART, BATTLEVIEW_COMSTATE_PRECHOICE);
            }
            if (this.state == BATTLEVIEW_STATE_SECONDMOVE) {
                this.endTurn(ud);
            }
        }
    }
    
    if (this.turn == BATTLEVIEW_TURN_INITIAL) {
        if (this.counter >= this.INITIALCOUNTER) {
            // TODO:不戦敗時処理
            this.counter = 0;
            this.turn = BATTLEVIEW_TURN_UNITSELECT;
            // 画面作成完了を意味
            return 1;
        }
    }
    if (this.turn == BATTLEVIEW_TURN_WINBATTLE) {
        // カウンタインクリメント不要
        if (this.counter >= this.WINCOUNTER) {
            for (var i = 0; i < ud.length; i++) {
                var u = ud[i];
                while (u.exp >= u.calcExp(u.lv + 1)) {
                    u.lv++;
                    u.lvUp(u.lv);
                }
            }
            return;
        }
    }
    if (this.turn == BATTLEVIEW_TURN_LOSEBATTLE) {
        // カウンタインクリメント不要
        if (this.counter >= this.LOSECOUNTER) {
            return;
        }
    }
    this.counter ++;
    if (this.counter == this.MAXCOUNTER) {
        this.counter = 0;
    }
};

BattleView.prototype.paint = function (ud, itemMap) {

    var totalWidth = $(window).width();
    var totalHeight = $(window).height();
    
    var ctxFlip = CommonView.staticCanvasFlip().getContext('2d');
    ctxFlip.clearRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.fillRect(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    
    if (this.turn == BATTLEVIEW_TURN_INITIAL) {
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
        } else if (this.counter < this.INITIALCOUNTER ){
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
        }
    } else {
        // バトルのメイン状態
        ctxFlip.fillStyle = 'rgb(191, 191, 191)';
        ctxFlip.fillRect(0, 0, totalWidth, totalHeight);
        // ユニット情報表示
        var focusUnit = null;
        if (this.turn == BATTLEVIEW_TURN_MIKATA || this.turn == BATTLEVIEW_TURN_TEKI) {
            focusUnit = this.getUnitAtFocus(ud);
        }
        for (var i = 0; i < this.bar.length; i++) {
            var oldLength = this.bar[i];
            var diff = ((this.counter + i * 2 - this.INITIALCOUNTER) % 60 - 30) / 10;
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
        // ここまで背景演出
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
                    var moveCost = this.checkMoveCost(BATTLE_MIKATA, focusUnit.x, focusUnit.y, BATTLE_MIKATA, i, j);
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
                        var decorateWidth = 2 + (Math.abs((this.counter - this.INITIALCOUNTER) / 6) % 11 - 5);//this.counter - this.INITIALCOUNTERは0～599
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
                if (this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE && (this.tempEqTypeForEquip != ITEM_TYPE_DOGU && this.tempEqTypeForEquip != ITEM_TYPE_NOTHING)) {
                    var unitAtFocus = this.getUnitAtFocus(ud);
                    // 手番ユニットと当該マスの距離
                    var distance = unitAtFocus.x + unitAtFocus.y + i + j;
                    var range = UnitDefine.calcRange(unitAtFocus, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
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
                        
                    var decorateWidth = 2 + (Math.abs((this.counter - this.INITIALCOUNTER) / 6) % 11 - 5);//this.counter - this.INITIALCOUNTERは0～599
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
        for (var i = 0; i < this.battleMsg.length; i++) {
            ctxFlip.fillText(this.battleMsg[i], BATTLEVIEW_BATTLETXT_X, BATTLEVIEW_BATTLETXT_Y + 20 + 12 * i);
        }
        // 仲間一覧表示
        if (this.turn == BATTLEVIEW_TURN_UNITSELECT) {
            ctxFlip.fillStyle = 'rgb(119, 239, 239)';
            ctxFlip.fillRect(BATTLEVIEW_UNITSELECT_X - 6, BATTLEVIEW_UNITSELECT_Y - 6, 2 * BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL + 12, 7 * BATTLEVIEW_UNITSELECT_H + 6 * BATTLEVIEW_UNITSELECT_HINTERVAL + 12);
            var mikataUd = UnitDefine.getMikataList(ud);
            // 1列に7人表示
            for (var i = 0; i < mikataUd.length; i++) {
                var u = mikataUd[i];
                var x = BATTLEVIEW_UNITSELECT_X + (i >= 7 ? BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL : 0);
                var y = BATTLEVIEW_UNITSELECT_Y + (BATTLEVIEW_UNITSELECT_H + BATTLEVIEW_UNITSELECT_HINTERVAL) * ((i >= 7 ? i - 7 : i));
                ctxFlip.fillStyle = getGladColor((this.MAXCOUNTER - this.counter) / 6);
                ctxFlip.fillRect(x - 1, y - 1, BATTLEVIEW_UNITSELECT_W + 2, BATTLEVIEW_UNITSELECT_H + 2);
                ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                ctxFlip.fillRect(x, y, BATTLEVIEW_UNITSELECT_W, BATTLEVIEW_UNITSELECT_H);
                var checkRes = this.checkTempMikata(u);
                ctxFlip.font = "11px 'MS Pゴシック'";
                var unitText = "";
                // 参戦予定
                if (checkRes >= 0) {
                    ctxFlip.fillStyle = 'rgb(59, 119, 89)';
                    var unitText = (checkRes + 1) + u.namae;                 
                } else {
                    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                    unitText = u.namae;
                }                
                ctxFlip.fillText(unitText, x, y + 11);
            }
        }
        
        // スキル一覧表示
        if (this.turn == BATTLEVIEW_TURN_SKILLSELECT) {
            var tempY = BATTLEVIEW_UNITSELECT_Y;
            for (var i = 0; i < this.tempMikata.length; i++) {
                switch (i) {
                    case 0:arguments
                        ctxFlip.fillStyle = 'rgb(223, 223, 255)';
                    break;
                    case 1:arguments
                        ctxFlip.fillStyle = 'rgb(239, 239, 239)';
                    break;
                    case 2:arguments
                        ctxFlip.fillStyle = 'rgb(223, 255, 223)';
                    break;
                }
                ctxFlip.fillRect(BATTLEVIEW_UNITSELECT_X - 6, tempY - 5, 2 * BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL + 12, 2 * BATTLEVIEW_UNITSELECT_H + BATTLEVIEW_UNITSELECT_HINTERVAL + 10);
                var u = this.tempMikata[i];
                ctxFlip.font = "11px 'MS Pゴシック'";
                ctxFlip.fillStyle = 'rgb(0, 0, 0)';           
                ctxFlip.fillText("【" + u.namae + "】", BATTLEVIEW_UNITSELECT_X, tempY + 11);
                for (var j = 0; j < 3; j++) {
                    var x = BATTLEVIEW_UNITSELECT_X;
                    if (j > 0) {
                        x += BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL;
                    }
                    var y = tempY;
                    if (j == 0 || j == 2) {
                        y += BATTLEVIEW_UNITSELECT_H + BATTLEVIEW_UNITSELECT_HINTERVAL;
                    }
                    ctxFlip.fillStyle = (u.skillON[j] == true ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 255)');
                    ctxFlip.font = "11px 'MS Pゴシック'";
                    ctxFlip.fillText(SkillDefine.getSkillName(u.skills[j]), x, y + 11);
                    ctxFlip.font = "8px 'MS Pゴシック'";
                    ctxFlip.fillText((u.skillON[j] == true ? "ON" : "OFF"), x + 30, y + 11 + 11);
                }
                tempY += 2 * BATTLEVIEW_UNITSELECT_H + 2 * BATTLEVIEW_UNITSELECT_HINTERVAL;
            }
        }
        
        // SPゲージ表示
        if (this.turn == BATTLEVIEW_TURN_MIKATA || this.turn == BATTLEVIEW_TURN_TEKI) {
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
        }

        for (var i = 0; i < ud.length; i++) {
            var u = ud[i];
            if (u.field == this.field) {
                if (u.hp == 0 && this.cantOpCounter % 2 == 0) {
                    // 死にかけユニットの点滅
                    continue;
                }
                var paintXY = ItemDefine.getItemXY(u.eqType);
                var targetXY = this.getDestXY(u);
                // 移動中
                if (focusUnit === u && this.cantOpCounter > 0 && this.originalUnitY != focusUnit.y) {
                    var orgDestY = 0;
                    if (focusUnit.side == BATTLE_MIKATA) {
                        orgDestY = BATTLEVIEW_MIKATA_Y + BATTLEVIEW_SIZE * this.originalUnitY;
                    } else {
                        orgDestY = BATTLEVIEW_TEKI_Y + BATTLEVIEW_SIZE * (2 - this.originalUnitY);
                    }
                    targetXY[1] = (targetXY[1] * (20 - this.cantOpCounter) + orgDestY * this.cantOpCounter) / 20;
                }
                // 被ダメージ中
                if (((this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE) ||
                 (this.turn == BATTLEVIEW_TURN_TEKI && this.state == BATTLEVIEW_STATE_ACTSTART))&& this.cantOpCounter > 0) {
                    if (this.cantOpCounter <= BATTLE_BATTLEMSG_SECOND && u.equalUnit(this.tempTargetUnit)) {
                        if (this.tempResult.isHit && this.tempResult.damage > 0) {
                            targetXY[0] = targetXY[0] + 3 * (Math.abs((this.cantOpCounter % 9) - 4) - 2);
                        }
                    }
                }
                ctxFlip.drawImage(BattleField.getWeaponsImg(), paintXY[0], paintXY[1], 64, 64, targetXY[0], targetXY[1], 64, 64);
                // レベルアップ中
                if (this.turn == BATTLEVIEW_TURN_WINBATTLE && u.exp >= u.calcExp(u.lv + 1)) {
                    var lvUpDestY = 256;
                    if (this.counter > 10) {
                        lvUpDestY = 272;
                    }
                    if (this.counter > 20) {
                        lvUpDestY = 288;
                    }
                    var lvUpTargetY = targetXY[1] + Math.max(0, 32 - this.counter);
                    ctxFlip.drawImage(BattleField.getWeaponsImg(), 0, lvUpDestY, 64, 16, targetXY[0], lvUpTargetY, 64, 16);
                }
                if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_MOVE && this.cantOpCounter == 0 && this.tempTargetUnitY != -1) {
                    // 移動選択中
                    var pointNum = 5;
                    ctxFlip.lineWidth = 7;
                    for (var i = 0; i < pointNum; i++) {
                        ctxFlip.beginPath();
                        var moveCounter = (Math.floor((this.counter - this.INITIALCOUNTER) / 12) + (pointNum - i)) % 5;//this.counter - this.INITIALCOUNTERは0～599
                        switch(moveCounter) {
                        case 0:arguments
                            ctxFlip.strokeStyle = 'rgb(0, 239, 59)';
                        break;
                        case 1:arguments
                            ctxFlip.strokeStyle = 'rgb(0, 223, 55)';
                        break;
                        case 2:arguments
                            ctxFlip.strokeStyle = 'rgb(0, 207, 51)';
                        break;
                        case 3:arguments
                            ctxFlip.strokeStyle = 'rgb(0, 191, 47)';
                        break;
                        case 4:
                            ctxFlip.strokeStyle = 'rgb(0, 175, 43)';
                        break;
                        }
                        var destX = this.getDestXY(focusUnit)[0];
                        var destY = Math.floor(((pointNum - i) * this.getDestXY(focusUnit)[1] + i * this.getDestXYByXY(focusUnit.x, this.tempTargetUnitY, BATTLE_MIKATA)[1]) / pointNum);
                        var r = 2 + 2 * i;
                        ctxFlip.arc(destX + BATTLEVIEW_SIZE / 2, destY + BATTLEVIEW_SIZE / 2, r, 0, 2 * Math.PI, false);
                        ctxFlip.stroke();
                    }
                }
                // ターゲット選択中
                if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE && this.cantOpCounter == 0 &&
                    ((this.tempEqTypeForEquip != ITEM_TYPE_DOGU && u.side == BATTLE_TEKI) || (this.tempEqTypeForEquip == ITEM_TYPE_DOGU && u.side == BATTLE_MIKATA))) {
                    var adjust = ((this.MAXCOUNTER - this.counter) / 3) % 40;// INITIALCOUNTER～MaxCounterは0～600
                    ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 6);
                    ctxFlip.fillRect(targetXY[0] + 6 - 1, targetXY[1] + adjust - 1, 54, 14);
                    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                    ctxFlip.fillRect(targetXY[0] + 6, targetXY[1] + adjust, 52, 12);
                    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                    ctxFlip.font = "10px 'MS Pゴシック'";
                    if (this.tempEqTypeForEquip != ITEM_TYPE_DOGU) {
                        ctxFlip.fillText("ENEMY", targetXY[0] + 10, targetXY[1] + adjust + 10);
                    } else {
                        ctxFlip.fillText("TARGET", targetXY[0] + 10, targetXY[1] + adjust + 10);
                    }
                    if (u.equalUnit(this.tempTargetUnit)) {
                        for (var j = 0; j <= 2; j++) {
                            var targetCounter = (Math.floor((this.counter - this.INITIALCOUNTER) / 3)) % 20;//this.counter - this.INITIALCOUNTERは0～599
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
                // 被ダメージ中
                if (((this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE) ||
                   (this.turn == BATTLEVIEW_TURN_TEKI && this.state == BATTLEVIEW_STATE_ACTSTART)) && this.cantOpCounter > 0) {
                    if (this.cantOpCounter <= BATTLE_BATTLEMSG_SECOND && u.equalUnit(this.tempTargetUnit)) {
                        if (this.tempResult.isHit && this.tempResult.damage > 0) {
                            ctxFlip.fillStyle = 'rgb(255, 0, 0)';
                            for (var j = 0; j <= 5; j++) {
                                var halfWidth = 2;
                                var halfHeight = (BATTLE_BATTLEMSG_SECOND / 2) - Math.abs(this.cantOpCounter - (BATTLE_BATTLEMSG_SECOND / 2)) + 3 * (2 - Math.abs(j - 4));
                                ctxFlip.fillRect(targetXY[0] + 48 - this.cantOpCounter + 2 * halfWidth * j, targetXY[1] + 32 - halfHeight, 2 * halfWidth, 2 * halfHeight);
                            }
                            if (this.tempResult.isCrt) {
                                for (var j = 0; j <= 7; j++) {
                                    ctxFlip.beginPath();
                                    var tempColorCounter = (this.cantOpCounter + j) % 5;
                                    switch (tempColorCounter) {
                                        case 0:arguments
                                            ctxFlip.strokeStyle = 'rgb(255, 0, 0)';
                                        break;
                                        case 1:arguments
                                            ctxFlip.strokeStyle = 'rgb(255, 63, 63)';
                                        break;
                                        case 2:arguments
                                            ctxFlip.strokeStyle = 'rgb(255, 127, 127)';
                                        break;
                                        case 3:arguments
                                            ctxFlip.strokeStyle = 'rgb(255, 191, 191)';
                                        break;
                                        case 4:arguments
                                            ctxFlip.strokeStyle = 'rgb(255, 255, 255)';
                                        break;
                                    }
                                    var rMin = 15 - this.cantOpCounter / 2;
                                    var rMax = rMin + 12 + (30 - this.cantOpCounter);
                                    var rad = 0.25 * j + 0.1 * this.cantOpCounter;
                                    ctxFlip.moveTo(targetXY[0] + 32 + rMin * Math.cos(rad * Math.PI), targetXY[1] + 32 + rMin * Math.sin(rad * Math.PI));
                                    ctxFlip.lineTo(targetXY[0] + 32 + rMax * Math.cos(rad * Math.PI), targetXY[1] + 32 + rMax * Math.sin(rad * Math.PI));
                                    ctxFlip.stroke();
                                }
                            }
                        }
                    }
                }
                // 敵の毒/麻痺警告、味方の毒/麻痺表示
                if (this.turn == BATTLEVIEW_TURN_MIKATA) {
                    var poiStunY = targetXY[1];
                    var poiStunW = 12;
                    var poiStunH = 12;
                    if (u.hasPoison(ud) || u.isPoison) {
                        var poisonX = targetXY[0] + 5;
                        ctxFlip.fillStyle = getGladColorBlue((this.MAXCOUNTER - this.counter) / 6);
                        ctxFlip.fillRect(poisonX - 1, poiStunY - 1, poiStunW + 1, poiStunH + 1);
                        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                        ctxFlip.fillRect(poisonX, poiStunY, poiStunW, poiStunH);
                        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                        ctxFlip.font = "10px 'MS Pゴシック'";
                        ctxFlip.fillText("毒", poisonX, poiStunY + 9);
                        for (var j = 0; j < ud.length; j++) {
                            var targetU = ud[j];
                            if (targetU.field == this.field && targetU.hp > 0 && targetU.side == BATTLE_MIKATA && UnitDefine.calcPoison(u, targetU, ud)) {
                                var targetXY2 = this.getDestXY(targetU);
                                this.drawWarn(ctxFlip, targetXY[0] + 16, targetXY[1] + 32, targetXY2[0] + 16, targetXY2[1] + 32, "毒", 'rgb(255, 223, 223)');
                            }
                        }
                    }
                    if (u.hasStun(ud) || u.isStun) {
                        var stunX = targetXY[0] + 45;
                        ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 6);
                        ctxFlip.fillRect(stunX - 1, poiStunY - 1, poiStunW + 1, poiStunH + 1);
                        ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                        ctxFlip.fillRect(stunX, poiStunY, poiStunW, poiStunH);
                        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                        ctxFlip.font = "10px 'MS Pゴシック'";
                        ctxFlip.fillText("痺", stunX, poiStunY + 9);
                        for (var j = 0; j < ud.length; j++) {
                            var targetU = ud[j];
                            if (targetU.field == this.field && targetU.hp > 0 && targetU.side == BATTLE_MIKATA && UnitDefine.calcStun(u, targetU, ud)) {
                                var targetXY2 = this.getDestXY(targetU);
                                this.drawWarn(ctxFlip, targetXY[0] + 48, targetXY[1] + 32, targetXY2[0] + 48, targetXY2[1] + 32, "痺", 'rgb(223, 223, 255)');
                            }
                        }
                    }
                }
            }
        }
        
        // 手番ユニットの強調
        if (this.turn == BATTLEVIEW_TURN_MIKATA || this.turn == BATTLEVIEW_TURN_TEKI) {
            for (var i = 0; i <= 4; i++) {
                var focusCounter = (Math.floor((this.counter - this.INITIALCOUNTER) / 6)) % 20;//this.counter - this.INITIALCOUNTERは0～599
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
                for (var j = 0; j < focusUnit.handEquip.length + 1; j++) {
                    var tempItem = new ItemDefine();
                    var tempHandEquip = null;
                    if (j < focusUnit.handEquip.length) {
                        tempHandEquip = focusUnit.handEquip[j];
                    } else {
                        // 「なにもしない」を末尾に表示
                        tempHandEquip = {eqType:ITEM_TYPE_NOTHING, eqSyurui: 0};
                    }
                    ItemDefine.init(tempHandEquip.eqType, tempHandEquip.eqSyurui, tempItem);
                    if (tempHandEquip.eqType == this.tempEqTypeForEquip && tempHandEquip.eqSyurui == this.tempEqSyurui) {
                        // 選択中の武器を強調
                        ctxFlip.fillStyle = 'rgb(255, 255, 0)';
                        ctxFlip.fillRect(BATTLEVIEW_WEAP_X, textY - 10, BATTLEVIEW_WEAP_W, 15);
                        ctxFlip.fillStyle = 'rgb(0, 0, 0)';
                    }
                    ctxFlip.fillText(tempItem.namae, BATTLEVIEW_WEAP_X, textY);
                    var itemCost = focusUnit.calcKiryoku(tempItem);
                    if (itemCost == 999) {
                        ctxFlip.fillText("×", BATTLEVIEW_WEAP_X + 90, textY);
                    } else {
                        ctxFlip.fillText("気力"  + itemCost, BATTLEVIEW_WEAP_X + 90, textY);
                    }
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
                        var tempEquipNum = this.calcEquipNum(ud, tempItem.eqType, tempItem.eqSyurui);
                        var itemCost = focusUnit.calcKiryoku(tempItem);
                        if (itemCost == 999) {
                            ctxFlip.fillText("×", BATTLEVIEW_WEAP_X + 90, textY);
                        } else {
                            ctxFlip.fillText("気力"  + itemCost, BATTLEVIEW_WEAP_X + 90, textY);
                        }
                        ctxFlip.fillText(tempItemNum + "(空き"  + (tempItemNum - tempEquipNum) + ")", BATTLEVIEW_WEAP_X + 80, textY + 14);
                        textY += BATTLEVIEW_WEAP_INTERVAL;
                    }
                }
            }   
        }
        
        if (this.shouldDecideCancel()) {
            // コマンド表示
            for (var i = 0; i <= 1; i++) {
                ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
                var txtX = BATTLEVIEW_COMMANDTXT_X;
                var txtY = BATTLEVIEW_COMMANDTXT_Y + i * BATTLEVIEW_COMMANDINTERVAL;
                ctxFlip.fillRect(txtX - 1, txtY - 1, BATTLEVIEW_COMMANDTXT_W + 3, BATTLEVIEW_COMMANDTXT_H + 3);
                ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                ctxFlip.fillRect(txtX, txtY, BATTLEVIEW_COMMANDTXT_W, BATTLEVIEW_COMMANDTXT_H);
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
        if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_PRECHOICE) {
            // コマンド表示
            for (var i = 0; i <= 4; i++) {
                // 選択可能 or 選択中のみ色を変える
                var isHighLight = this.isSelected(ud, i);
                if (isHighLight > 0) {
                    ctxFlip.fillStyle = getGladColorRed((this.MAXCOUNTER - this.counter) / 3);
                } else {
                    ctxFlip.fillStyle = 'rgb(31, 31, 31)';
                }
                var txtX = BATTLEVIEW_COMMANDTXT_X;
                var txtY = BATTLEVIEW_COMMANDTXT_Y + i * BATTLEVIEW_COMMANDINTERVAL;
                ctxFlip.fillRect(txtX - 1, txtY - 1, BATTLEVIEW_COMMANDTXT_W + 3, BATTLEVIEW_COMMANDTXT_H + 3);
                ctxFlip.fillStyle = 'rgb(255, 255, 255)';
                if (isHighLight == 0) {
                    ctxFlip.fillStyle = 'rgb(191, 191, 191)';
                }
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
        // 戦闘開始時演出
        if (this.turn == BATTLEVIEW_TURN_SKILLSELECT && this.cantOpCounter > 0) {
            var left = 0;
            var right = CommonView.staticCanvasFlip().width;
            var centerX = Math.floor((left + right) / 2);
            var centerY = Math.floor(CommonView.staticCanvasFlip().height / 2);
            var top = centerY - 60;
            var bottom = centerY + 60;
            if (this.cantOpCounter > 40) {
                var len = Math.min((BATTLEVIEW_FIRSTTURN_COUNTER - this.cantOpCounter) / (BATTLEVIEW_FIRSTTURN_COUNTER - 60), 1);
                
                ctxFlip.strokeStyle = 'rgb(0, 0, 255)';
                ctxFlip.lineWidth = 5;
                if (this.cantOpCounter < BATTLEVIEW_FIRSTTURN_COUNTER / 1.2) {
                    ctxFlip.strokeStyle = 'rgb(63, 127, 255)';
                    ctxFlip.lineWidth = 10;
                }
                if (this.cantOpCounter < BATTLEVIEW_FIRSTTURN_COUNTER / 1.4) {
                    ctxFlip.strokeStyle = 'rgb(127, 191, 255)';
                    ctxFlip.lineWidth = 20;
                }
                ctxFlip.beginPath();
                ctxFlip.moveTo(left, bottom);
                var destX = left + len * (centerX - left);
                var destY = bottom + len * (centerY - bottom);
                ctxFlip.lineTo(destX, destY);
                ctxFlip.closePath();
                ctxFlip.stroke();
                
                ctxFlip.strokeStyle = 'rgb(255, 0, 0)';
                ctxFlip.lineWidth = 5;
                if (this.cantOpCounter < BATTLEVIEW_FIRSTTURN_COUNTER / 1.2) {
                    ctxFlip.strokeStyle = 'rgb(255, 127, 63)';
                    ctxFlip.lineWidth = 10;
                }
                if (this.cantOpCounter < BATTLEVIEW_FIRSTTURN_COUNTER / 1.4) {
                    ctxFlip.strokeStyle = 'rgb(255, 191, 127)';
                    ctxFlip.lineWidth = 20;
                }
                ctxFlip.beginPath();
                ctxFlip.moveTo(right, top);
                var destX = right - len * (right - centerX);
                var destY = top - len * (top - centerY);
                ctxFlip.lineTo(destX, destY);
                ctxFlip.closePath();
                ctxFlip.stroke();
            } else {
                var circleNum = 10;
                var r = 3 + Math.floor(this.cantOpCounter / 2);
                for (var i = 0; i < circleNum; i++) {
                    if (Math.abs(circleNum / 2 - i) < (40 - this.cantOpCounter) / 10) {
                        continue;
                    }
                    ctxFlip.beginPath();
                    if (i < circleNum / 2) {
                        ctxFlip.fillStyle = 'rgb(127, 191, 255)';
                    } else {
                        ctxFlip.fillStyle = 'rgb(255, 191, 127)';
                    }
                    ctxFlip.lineWidth = Math.floor(r / 2);
                    var circleX = Math.floor((left * (circleNum - i) + right * i) / circleNum);
                    var circleY = Math.floor((bottom * (circleNum - i) + top * i) / circleNum);
                    ctxFlip.arc(circleX, circleY, r, 0, 2 * Math.PI, false);
                    ctxFlip.fill();
                }
            }
        }
    }
    
    // (全画面共通)アナウンスメッセージ表示
    CommonView.paintMessage(ctxFlip);
    
    var imageData = ctxFlip.getImageData(0, 0, CommonView.staticCanvasFlip().width, CommonView.staticCanvasFlip().height);
    var ctx = CommonView.staticCanvas().getContext('2d');
    ctx.putImageData(imageData, 0, 0);
};

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
};

// 上の引数違い。
BattleView.prototype.getDestXYByXY = function(x, y, side) {
    var destX = 0;
    var destY = 0;
    if (side == BATTLE_MIKATA) {
        destX = BATTLEVIEW_MIKATA_X + BATTLEVIEW_SIZE * (2 - x);
        destY = BATTLEVIEW_MIKATA_Y + BATTLEVIEW_SIZE * y;
    } else {
        destX = BATTLEVIEW_TEKI_X + BATTLEVIEW_SIZE * x;
        destY = BATTLEVIEW_TEKI_Y + BATTLEVIEW_SIZE * (2 - y);
    }
    return [destX, destY];
};

BattleView.prototype.decorateSide = function(ctxFlip, x, y, color, width) {
    ctxFlip.fillStyle = color;
    ctxFlip.fillRect(x, y, width, 64);
    ctxFlip.fillRect(x + 64 - width, y, width, 64);
};

// 各コマンドボタンが選択可能/選択中か?(1:選択可能 2:選択中 0:選択不能)
// iは「0行動 1移動 2逃亡 3待機 4交代」
BattleView.prototype.isSelected = function(ud, i) {
    if (this.commandState == BATTLEVIEW_COMSTATE_PRECHOICE) {
        if (this.state == BATTLEVIEW_STATE_FIRSTMOVE) {
            // 全コマンド選択可
            return 1;
        }
        if (this.state == BATTLEVIEW_STATE_ACTSTART) {
            if (i == BATTLEVIEW_COMMANDNUM_ACT || i == BATTLEVIEW_COMMANDNUM_WAIT) {
                return 1;
            } else {
                return 0;
            }
        }
        if (this.state == BATTLEVIEW_STATE_SECONDMOVE) {
            if (i == BATTLEVIEW_COMMANDNUM_ACT || i == BATTLEVIEW_COMMANDNUM_MOVE || i == BATTLEVIEW_COMMANDNUM_WAIT) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    return 0;
};

// 現在手番のユニットを取得(フォーカス未設定ならnull)
BattleView.prototype.getUnitAtFocus = function(ud) {    
    for (var i = 0; i < ud.length; i++) {
        var u = ud[i];
        if (u.field == this.field &&  u.side == (this.focus % 2) && u.x == Math.floor(this.focus / 2)) {
            return u; 
        }
    }
    return null;
};

// ターン終了処理 & 次の手番のユニットに回す
BattleView.prototype.endTurn = function(ud) {
    var nowFocus = this.getUnitAtFocus(ud);
    if (nowFocus.isPoison) {
        nowFocus.hp = 1;
        CommonView.addMessage(nowFocus.namae + "は毒のダメージ!", 90);
    }
    if (nowFocus.side == BATTLE_MIKATA) {
        // 気力を減らす
        for (var i = 0; i < 3; i++) {
            if (nowFocus.skillON[i] == true) {
                var minusSP = SkillDefine.getSkillCost(nowFocus.skills[i]);
                nowFocus.sp -= minusSP;
            }
        }
        if (nowFocus.sp < 0) {
            // スキルを維持できない
            for (var i = 0; i < 3; i++) {
                nowFocus.skillON[i] = false;
            }
            nowFocus.sp = 0;
        }
    }
    
    var nextFocusUnit = null;
    while(nextFocusUnit == null) {
        this.focus++;
        if (this.focus == 6) {
            // 1周してもどる
            this.focus = 0;
        }
        for (var i = 0; i < ud.length; i++) {
            var u = ud[i];
            if (u.field == this.field &&  u.side == (this.focus % 2) && u.x == Math.floor(this.focus / 2)) {
                // ユニットが見つかった(確実に見つかる)
                nextFocusUnit = u;
            }
        }
    }
    // 次の手番の初期化
    if (nextFocusUnit.side == BATTLE_MIKATA) {
        this.turn = BATTLEVIEW_TURN_MIKATA;
    } else {
        this.turn = BATTLEVIEW_TURN_TEKI;
    }
    this.initTurn(ud);
    return nextFocusUnit;
};

BattleView.prototype.unitMsg = function (u, ctxFlip) {
    ctxFlip.fillStyle = getGladColorBlue((this.MAXCOUNTER - this.counter) / 6);
    ctxFlip.fillRect(BATTLEVIEW_UNITTXT_X - 1, BATTLEVIEW_UNITTXT_Y - 1, BATTLEVIEW_UNITTXT_W + 3, BATTLEVIEW_UNITTXT_H + 3);
    ctxFlip.fillStyle = 'rgb(255, 255, 255)';
    ctxFlip.fillRect(BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y, BATTLEVIEW_UNITTXT_W, BATTLEVIEW_UNITTXT_H);
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.font = "11px 'MS Pゴシック'";
    
    var battleStatus = u.calcBattleStr();// 装備品込みのステータスと装備名を取得
    var focusUnit = this.getUnitAtFocus(ud); 
    if (this.turn == BATTLEVIEW_TURN_UNITSELECT || this.turn == BATTLEVIEW_TURN_SKILLSELECT) {
        // ユニット、スキル選択時…なにも装備しないステータス
    }
    else if (focusUnit.x == u.x && (this.commandState == BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE || this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE)) {
        // 武器選択中/ターゲット選択中の手番ユニットのみ、実装備武器でなく「装備予定武器」を装備したステータス表示
        if (this.tempEqSyurui == -1) {
            // 表示中の武器タイプで、装備可能なアイテムすべて非所持→現在の装備品のステータスを出す
        } else {
            battleStatus = u.calcBattleStr(this.tempEqTypeForEquip, this.tempEqSyurui);
        }
    }
    
    var yInterval = BATTLEVIEW_UNITTXT_YINTERVAL;//1行の高さ
    var lineCount = 1;//何行目か
    ctxFlip.fillText(u.namae, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20);
    ctxFlip.fillText("Lv" + u.lv, BATTLEVIEW_UNITTXT_X + 75, BATTLEVIEW_UNITTXT_Y + 20);//Lv
    ctxFlip.fillText(battleStatus.namae, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);//装備品
    ctxFlip.fillText("ドロップアイテム", BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);//ドロップアイテム
    ctxFlip.fillText("HP:" + u.hp + "/" + u.mhpObj.now, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
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
        ctxFlip.fillText("耐痺:" + u.regStun, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval);
    } else {
        lineCount += 2;
    }
    ctxFlip.fillText("移動1:" + u.m1Cost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("移動2:" + u.m2Cost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("射程+:" + u.rangeCost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 7);
    ctxFlip.fillText("再行動:" + u.exAtCost, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 7);
    
    for (var i = 0; i < 3; i++) {
        ctxFlip.fillStyle = (u.skillON[i] == true ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 255)');
        ctxFlip.fillText((u.side == BATTLE_MIKATA ? "消費" + SkillDefine.getSkillCost(u.skills[i]) : ""), BATTLEVIEW_UNITTXT_X + 65, BATTLEVIEW_UNITTXT_Y + 20 + lineCount * yInterval + 15);
        ctxFlip.fillText(SkillDefine.getSkillName(u.skills[i]), BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 20 + lineCount++ * yInterval + 15);
    }
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.fillText("Exp:" + u.exp, BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 25 + lineCount++ * yInterval + 15);
    if (u.side == BATTLE_MIKATA && u.lv < MAX_LV) {
        ctxFlip.fillText("(Next:" + u.calcExp(u.lv + 1) + ")", BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 25 + lineCount++ * yInterval + 15);
    }
    if (u.side == BATTLE_MIKATA) {
        for (var i = ITEM_TYPE_SWORD; i <= ITEM_TYPE_EARTH; i++) {
            if (u.getItemIndex(i) >= 0) {
                ctxFlip.fillText(ItemDefine.getItemText(i) + ":" + u.weaps[i], BATTLEVIEW_UNITTXT_X, BATTLEVIEW_UNITTXT_Y + 30 + lineCount++ * yInterval + 15);
            }
        }
    }
    if (this.turn != BATTLEVIEW_TURN_UNITSELECT && this.turn != BATTLEVIEW_TURN_SKILLSELECT) {
        // ユニット顔グラ表示
        ctxFlip.drawImage(UnitDefine.getCharaImg(u.pSyurui), u.px, u.py, 256, 320, BATTLEVIEW_UNITPAINT_X, BATTLEVIEW_UNITPAINT_Y, 128, 160);
    }
};

BattleView.prototype.moveCheckComState = function(cState, cComState) {
    this.state = cState;
    this.commandState = cComState;
    var checkRet = 1; 
};

// 各マスごとに、移動可能かどうかチェック
// -2…そもそも列orSide違い -1…チェック先がフィールド外 0…同一マス それ以外…移動コスト 
BattleView.prototype.checkMoveCost = function(orgSide, orgX, orgY, checkSide, checkX, checkY) {
    if (orgSide != checkSide || orgX != checkX) {
        return -2;
    }
    if (checkX < 0 || checkY < 0 || checkX > 2 || checkY > 2) {
        return -1;
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
};

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
};

// 勝利側を返す
BattleView.prototype.endBattleCheck = function(ud) {
    var shibouSide = this.isZenmetsu(ud);
    if (shibouSide == BATTLE_TEKI) {
        CommonView.addMessage("戦闘に勝利した! 経験値:" + this.winExp, 60);
        var remainMikata = this.calcRemain(BATTLE_MIKATA, ud);
        var getExp = this.winExp;
        switch(remainMikata) {
        case 2:arguments
            getExp = Math.floor(getExp * EXP_FOR2);
            break;
        case 3:arguments
            getExp = Math.floor(getExp * EXP_FOR3);
            break;
        }
        for (var i = 0; i < ud.length; i++) {
            var u = ud[i];
            if (u.field == this.field &&  u.side == BATTLE_MIKATA && u.hp > 0) {
                u.exp += getExp; 
            }
        }
        this.turn = BATTLEVIEW_TURN_WINBATTLE;
        this.counter = 0;
        return BATTLE_MIKATA;
    }
    if (shibouSide == BATTLE_MIKATA) {
        CommonView.addMessage("戦闘に敗北した!", 60);
        this.turn = BATTLEVIEW_TURN_LOSEBATTLE;
        this.counter = 0;
        return BATTLE_TEKI;
    }
    return -1;
} 

BattleView.prototype.isZenmetsu = function(ud) {
    // 全滅側を返す
    var mikataRemain = this.calcRemain(BATTLE_MIKATA, ud);
    var tekiRemain = this.calcRemain(BATTLE_TEKI, ud);
    if (mikataRemain == 0) {
        return BATTLE_MIKATA;
    }
    if (tekiRemain == 0) {
        return BATTLE_TEKI;
    }
    return -1;
};

BattleView.prototype.calcRemain = function(side, ud) {
    // ユニットの生存人数カウント
    var remain = 0;//同陣営の残り人数
    for (var i = 0; i < ud.length; i++) {
        var u = ud[i];
        if (u.hp > 0 && u.side == side && u.field == this.field) {
            remain++;
        }
    }
    return remain;
};

BattleView.prototype.shibouUnit = function(deadU, ud) {
    // ユニット死亡時の処理
    for (var i = 0; i < ud.length; i++) {
        var u = ud[i];var mikataUd = UnitDefine
        if (u.hp > 0 && u.side == deadU.side && u.field == this.field) {
            if (u.x > deadU.x) {
                u.x--;
            }
        }
    }
    if (deadU.side == BATTLE_MIKATA) {
        // TODO:装備解除
        deadU.field = -1;
    } else {
        this.winExp += deadU.exp;
        // TODO:winMoney計算
        this.winMoney += 10;
        
        // udから死亡ユニットを消す
        var deleteIndex = ud.indexOf(deadU);
        ud.splice(deleteIndex, 1);
    }
    return;
};

BattleView.prototype.clk = function(mouseX, mouseY, ev, ud, itemMap) {
    
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
    
    if (this.turn == BATTLEVIEW_TURN_WINBATTLE && this.counter >= this.WINCOUNTER) {
        var eventId = ev.decideNextEvent(true);
        ev.init(eventId);
        return GAMEMODE_EVENT;
    }
    
    if (this.turn == BATTLEVIEW_TURN_LOSEBATTLE && this.counter >= this.LOSECOUNTER) {
        var eventId = ev.decideNextEvent(false);
        ev.init(eventId);
        return GAMEMODE_EVENT;
    }
    
    // 操作可能なターン以外
    if (this.turn != BATTLEVIEW_TURN_MIKATA &&
        this.turn != BATTLEVIEW_TURN_SKILLSELECT &&
        this.turn != BATTLEVIEW_TURN_UNITSELECT) {
        return -1;
    }
    
    // battleMsgに「スキル説明」を入れる
    if (this.infoUnit != null && mouseX >= BATTLEVIEW_UNITTXT_X && mouseX <= BATTLEVIEW_UNITTXT_X + BATTLEVIEW_UNITTXT_W
        && mouseY >= BATTLEVIEW_UNITTXT_Y && mouseY <= BATTLEVIEW_UNITTXT_Y + BATTLEVIEW_UNITTXT_H) {
        var mouseYIndex = Math.floor((mouseY - (BATTLEVIEW_UNITTXT_Y + 25)) / BATTLEVIEW_UNITTXT_YINTERVAL);
        // mouseYIndex:19～21にスキル説明が来ているのは完全に現在のステータス画面実装依存
        if (19 <= mouseYIndex && mouseYIndex <= 21) {
            this.battleMsg = ["", "", "", ""];
            var skillIndex = mouseYIndex - 19;
            var skillTxt = SkillDefine.getMessage(this.infoUnit.skills[skillIndex]);
            for (var i = 0; i < skillTxt.length; i++) {
                this.battleMsg[i] = skillTxt[i];
            }
        }
        // infoUnitを触っている時点で、infoUnit表示内容を変えたくないと思われるので、ここでリターン
        return -1;
    } else {
        this.battleMsg = ["", "", "", ""];
    }
    
    // 仲間選択
    if (this.turn == BATTLEVIEW_TURN_UNITSELECT && mouseX >= BATTLEVIEW_UNITSELECT_X && mouseX <= BATTLEVIEW_UNITSELECT_X + 2 * BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL &&
        mouseY >= BATTLEVIEW_UNITSELECT_Y && mouseY <= BATTLEVIEW_UNITSELECT_Y + 7 * BATTLEVIEW_UNITSELECT_H + 6 * BATTLEVIEW_UNITSELECT_HINTERVAL) {
        var xIndex = Math.floor((mouseX - BATTLEVIEW_UNITSELECT_X) / (BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL));
        var yIndex = Math.floor((mouseY - BATTLEVIEW_UNITSELECT_Y) / (BATTLEVIEW_UNITSELECT_H + BATTLEVIEW_UNITSELECT_HINTERVAL));
        var unitIndex = 7 * xIndex + yIndex;
        var mikataUd = UnitDefine.getMikataList(ud);
        if (mikataUd.length > unitIndex) {
            var tempUnit = mikataUd[unitIndex];
            var checkRes = this.checkTempMikata(tempUnit);
            this.infoUnit = tempUnit;
            // 参戦予定に未登録
            if (checkRes == -1) {
                if (tempUnit.hp <= 0) {
                    CommonView.addWarn("戦闘不能ユニットです。");
                    return -1;
                }
                if (this.tempMikata.length < 3) {
                    // 空きがないと入れない
                    this.tempMikata.push(tempUnit);
                }
            } else {
                // 参戦予定に登録済みなのを解除
                this.tempMikata.splice(checkRes, 1);
            }
        }
        return -1;
    }
    // スキル選択
    if (this.turn == BATTLEVIEW_TURN_SKILLSELECT && mouseX >= BATTLEVIEW_UNITSELECT_X && mouseX <= BATTLEVIEW_UNITSELECT_X + 2 * BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL &&
        mouseY >= BATTLEVIEW_UNITSELECT_Y && mouseY <= BATTLEVIEW_UNITSELECT_Y + 7 * BATTLEVIEW_UNITSELECT_H + 6 * BATTLEVIEW_UNITSELECT_HINTERVAL) {
        var xIndex = Math.floor((mouseX - BATTLEVIEW_UNITSELECT_X) / (BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL));
        var yIndex = Math.floor((mouseY - BATTLEVIEW_UNITSELECT_Y) / (BATTLEVIEW_UNITSELECT_H + BATTLEVIEW_UNITSELECT_HINTERVAL));
        var unitIndex = Math.floor(yIndex / 2);//2行ごとに別のユニットのスキル選択になる
        if (this.tempMikata.length > unitIndex) {
            var tempUnit = this.tempMikata[unitIndex];
            var skillIndex = xIndex * 2 + (yIndex % 2) - 1;//ユニット名をクリックすることがあるが、このときskillIndexは-1
            if (skillIndex >= 0) {
                if (tempUnit.skillON[skillIndex] == false) {
                    tempUnit.skillON[skillIndex] = true;
                } else {
                    tempUnit.skillON[skillIndex] = false;
                }
            }
        }
        return -1;
    }
    // 決定、戻るボタンを押す
    if (this.shouldDecideCancel() && mouseX >= BATTLEVIEW_COMMANDTXT_X && mouseX <= BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W) {
        var commandNum = Math.floor((mouseY - BATTLEVIEW_COMMANDTXT_Y) / BATTLEVIEW_COMMANDINTERVAL);
        switch(commandNum) {
            case 0:arguments//次へ
                this.decide(mouseX, mouseY, ud, itemMap);
                return -1;
            break;
            case 1:arguments//戻る
                this.cancel(mouseX, mouseY, ud, itemMap);
                return -1;
            break;
            default:arguments
                // ボタンのない場所をクリックした場合ここ
                return -1;
            break;
        }
    }
    var focusUnit = null;
    if (this.turn == BATTLEVIEW_TURN_MIKATA) { 
        focusUnit = this.getUnitAtFocus(ud);
    }
    // 味方マスチェック中
    if (mouseX >= BATTLEVIEW_MIKATA_X && mouseX <= BATTLEVIEW_MIKATA_X + 3 * BATTLEVIEW_SIZE &&
        mouseY >= BATTLEVIEW_MIKATA_Y && mouseY <= BATTLEVIEW_MIKATA_Y + 3 * BATTLEVIEW_SIZE) {
        var searchX = Math.floor((mouseX - BATTLEVIEW_MIKATA_X) / BATTLEVIEW_SIZE);
        var searchY = Math.floor((mouseY - BATTLEVIEW_MIKATA_Y) / BATTLEVIEW_SIZE);
        this.fieldMsg = this.battleFields[BATTLE_MIKATA][2 - searchX][searchY].explainMsg();
        // ユニット移動もここで行う
        if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_MOVE) {
            var moveCost = this.checkMoveCost(BATTLE_MIKATA, focusUnit.x, focusUnit.y, BATTLE_MIKATA, 2 - searchX, searchY);
            if (moveCost == 1 || moveCost == 2) {
                var requireCost = (moveCost == 1 ? focusUnit.m1Cost : focusUnit.m2Cost);
                if (this.spGauge[BATTLE_MIKATA] >= requireCost) {
                    this.tempTargetUnitY = searchY;//暫定移動Y座標
                    return -1;
                } else {
                    CommonView.addWarn("SPゲージが移動コストに足りません。");
                    return -1;
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
    
    if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE) {
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
                return -1;
            } else {
                if (focusUnit.isStun) {
                    CommonView.addWarn("麻痺時は「なにもしない」しか選べません。");
                    return -1;
                }
                var weapTypeIndex = focusUnit.getReverseItemIndex(tempY - 1);
                // -1は「見つからなかった」の意味
                if (weapTypeIndex != -1) {
                    this.tempEqTypeForPaint = weapTypeIndex;
                    this.tempEqTypeForEquip = weapTypeIndex;
                    // とりあえず最初の武器を表示、暫定装備(その種類の武器がなければ-1)
                    this.tempEqSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempEqTypeForEquip, 0);
                    return -1;
                }
            }
        }
        // 武器種類選択
        if (mouseX >= BATTLEVIEW_WEAP_X && mouseX <= BATTLEVIEW_WEAP_X + BATTLEVIEW_WEAP_W) {
            // 上から何番目の武器を選択したか
            var tempY = Math.floor((mouseY - BATTLEVIEW_WEAP_Y) / BATTLEVIEW_WEAP_INTERVAL);
            // 手持ち武器から選択
            if (this.tempEqTypeForPaint == ITEM_TYPE_TEMOCHI) {
                if (tempY <= focusUnit.handEquip.length) {
                    var handEquipSelected = null;
                    if (tempY == focusUnit.handEquip.length){
                        // なにもしない、を選択
                        handEquipSelected = {eqType:ITEM_TYPE_NOTHING, eqSyurui: 0};
                    } else {
                        if (focusUnit.isStun) {
                            CommonView.addWarn("麻痺時は「なにもしない」しか選べません。");
                            return -1;
                        }
                        handEquipSelected = focusUnit.handEquip[tempY];
                    }

                    // 武器選択
                    this.tempEqTypeForEquip = handEquipSelected.eqType;
                    this.tempEqSyurui = handEquipSelected.eqSyurui;
                    return -1;
                }
            } else {
                // 手持ち武器以外から選択
                var tempEqSyurui = ItemDefine.getReverseItemIndex(itemMap, this.tempEqTypeForPaint, tempY);
                if (tempEqSyurui != -1) {
                    // 表示すべきアイテムあり
                    this.tempEqSyurui = tempEqSyurui;
                    return -1;
                } 
            }
        }
    }
    if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE) {
        var tempUnit = this.searchAtXY(mouseX, mouseY, ud);
        var unitAtFocus = this.getUnitAtFocus(ud);
        // 基本的には敵がターゲットだが、アイテムは味方がターゲット
        var targetSide = (this.tempEqTypeForEquip != ITEM_TYPE_DOGU ? BATTLE_TEKI :BATTLE_MIKATA);
        // 該当する側のユニットをクリックしていたらターゲットに設定
        if (tempUnit != null && tempUnit.side == targetSide) {
            this.tempTargetUnit = tempUnit;
            var hitRate = UnitDefine.calcHit(unitAtFocus, this.tempTargetUnit, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
            var basicDamage = UnitDefine.calcBasicDamage(unitAtFocus, this.tempTargetUnit, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
            var chikeiRate = UnitDefine.calcChikei(unitAtFocus, this.tempTargetUnit, ud, this.battleFields, this.tempEqTypeForEquip, this.tempEqSyurui);
            var rateDamage = UnitDefine.calcRateDamage(unitAtFocus, this.tempTargetUnit, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
            var totalDamage = Math.floor(basicDamage * (100 - chikeiRate) / 100 + rateDamage);
            if (this.tempEqTypeForEquip != ITEM_TYPE_DOGU) {
                this.battleMsg[0] = "命中" + hitRate + " " + basicDamage + "×" + (100 - chikeiRate) + "%+" + rateDamage + "=" + totalDamage + "ダメージ";
            }
            // clickの後続で新ターゲットのデータ表示が必要なので、ここでreturnしてはいけない
        } else {
            // ターゲット解除
            this.tempTargetUnit = null;
            // clickの後続で旧ターゲットのデータ非表示が必要なので、ここでreturnしてはいけない
        }
    }
    // 戦闘コマンド選択
    if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_PRECHOICE &&
        mouseX >= BATTLEVIEW_COMMANDTXT_X && mouseX <= BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W) {
        var commandNum = Math.floor((mouseY - BATTLEVIEW_COMMANDTXT_Y) / BATTLEVIEW_COMMANDINTERVAL);
        var isSelectable = this.isSelected(ud, commandNum);
        if (isSelectable == 0) {
            // 選択不能をクリック
            return -1;
        } else {
            switch(commandNum) {
                case BATTLEVIEW_COMMANDNUM_ACT:arguments//行動
                    var requireCost = (this.state == BATTLEVIEW_STATE_SECONDMOVE ? focusUnit.exAtCost : 0);
                    if (this.spGauge[BATTLE_MIKATA] >= requireCost) {
                        this.spGauge[BATTLE_MIKATA] -= requireCost;
                        // とりあえず手持ち武器を表示
                        this.tempEqTypeForPaint = ITEM_TYPE_TEMOCHI;
                        if (focusUnit.eqType != -1 && focusUnit.eqSyurui != -1) {
                            // 前回の武器を暫定装備
                            this.tempEqTypeForEquip = focusUnit.eqType;
                            this.tempEqSyurui = focusUnit.eqSyurui;
                        } else {
                            // とりあえず最初の武器を暫定装備(必ず「素手」)
                            var handEquip0 = focusUnit.handEquip[0];
                            this.tempEqTypeForEquip = handEquip0.eqType;
                            this.tempEqSyurui = handEquip0.eqSyurui;
                        }
                        this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE);
                    } else {
                        CommonView.addWarn("SPゲージが再行動コストに足りません");
                        return -1;
                    }
                break;
                case BATTLEVIEW_COMMANDNUM_MOVE:arguments//移動
                    this.tempTargetUnitY = -1;
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_MOVE);
                    return -1;
                break;
                case BATTLEVIEW_COMMANDNUM_RUN:arguments//逃亡
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_RUN);
                    return -1;
                break;
                case BATTLEVIEW_COMMANDNUM_WAIT:arguments//待機
                    this.endTurn(ud);
                    return -1;
                break;
                case BATTLEVIEW_COMMANDNUM_CHANGE:arguments//交代
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_CHANGE);
                    return -1;
                break;
                default:arguments
                    // ボタンのない場所をクリックした場合ここ
                    return -1;
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
    // ゲームステータス変更なし
    return -1;
};

// 決定、戻るボタンを出すべきか
BattleView.prototype.shouldDecideCancel = function() {
    if (this.turn == BATTLEVIEW_TURN_UNITSELECT || this.turn == BATTLEVIEW_TURN_SKILLSELECT ||
        (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState != BATTLEVIEW_COMSTATE_PRECHOICE)) {
        return true;
    }
    return false;
}

BattleView.prototype.decide = function(mouseX, mouseY, ud, itemMap) {
    var focusUnit = null;
    if (this.turn == BATTLEVIEW_TURN_MIKATA || this.turn == BATTLEVIEW_TURN_TEKI) {
        focusUnit = this.getUnitAtFocus(ud);
    }
    if (this.turn == BATTLEVIEW_TURN_UNITSELECT && mouseX >= BATTLEVIEW_COMMANDTXT_X && mouseX <= BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W) {
        if (this.tempMikata.length > 0) {
            this.turn = BATTLEVIEW_TURN_SKILLSELECT;
            return -1;
        } else {
            CommonView.addWarn("参戦ユニットがいません。");
            return -1;
        }
    } else if (this.turn == BATTLEVIEW_TURN_SKILLSELECT && mouseX >= BATTLEVIEW_COMMANDTXT_X && mouseX <= BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W) {
        // 参戦ユニットをこのタイミングでフィールドにもってくる
        var unitX = 0;
        for (var i = 0; i < this.tempMikata.length; i++) {
            var u = this.tempMikata[i];
            u.field = this.field;
            u.x = unitX++;
            u.y = FieldDefine.calcUnitY(u.field, (this.isOffence ? BATTLE_OFFENCE : BATTLE_DEFENCE), u.x);
        }
        var mikataUd = UnitDefine.getMikataList(ud);
        // 参戦以外の味方のスキルをOFFにする
        for (var i = 0; i < mikataUd.length; i++) {
            var u = mikataUd[i];
            if (u.field != this.field) {
                for (var j = 0; j < 3 ; j++) {
                    u.skillON[j] = false;
                }
            }
        }
        /*this.turn = BATTLEVIEW_TURN_MIKATA;
        this.initTurn(ud);*/
        this.cantOpCounter = BATTLEVIEW_FIRSTTURN_COUNTER;
        return -1;
    } else if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE) {
        if (this.tempEqTypeForPaint == ITEM_TYPE_TEMOCHI) {
            // 手持ち武器から選択
            if (this.tempEqTypeForEquip != ITEM_TYPE_NOTHING && focusUnit.isStun) {
                CommonView.addWarn("麻痺時は「なにもしない」しか選べません。");
                return -1;
            }
            
            var tempItem = new ItemDefine();
            ItemDefine.init(this.tempEqTypeForEquip, this.tempEqSyurui, tempItem);
            var itemCost = focusUnit.calcKiryoku(tempItem);
            if (focusUnit.sp < itemCost) {
                if (itemCost == 999) {
                    CommonView.addWarn("使用可能レベルに達していません。");
                } else {
                    CommonView.addWarn("気力が足りません。");
                }
                return -1;
            }
            if (ItemDefine.isAllTarget(tempItem.eqType, tempItem.eqSyurui)) {
                // ターゲット選択を飛ばしていきなり戦闘処理に進む
                this.cantOpCounter = BATTLE_BATTLEMSG_MAX;
                this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE);
            } else {
                // 選択済みの武器に決定
                this.tempTargetUnit = null;
                this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE);
            }
        } else {
            // 手持ち武器以外から選択
            if (this.tempEqSyurui != -1) {
                var equipCheck = focusUnit.isHandEquip(this.tempEqTypeForPaint, this.tempEqSyurui);
                var handEquipSize = focusUnit.handEquip.length;
                var tempItem = new ItemDefine();
                ItemDefine.init(this.tempEqTypeForPaint, this.tempEqSyurui, tempItem);
                var allNum = itemMap.get(tempItem.namae);
                var tempEquipNum = this.calcEquipNum(ud, this.tempEqTypeForPaint, this.tempEqSyurui);
                if (equipCheck >= 0) {
                    // 手持ち武器と同じものをリストから選択→なにもチェックしない
                } else {
                    if (allNum - tempEquipNum <= 0) {
                        CommonView.addWarn("この武器には空きがありません。");
                        return -1;
                    }
                    if (handEquipSize >= ITEM_TEMOCHIMAX) {
                        CommonView.addWarn("これ以上武器を持てません。");
                        CommonView.addWarn("手持ち武器から選んでください。");
                        return -1;
                    }
                }
                var itemCost = focusUnit.calcKiryoku(tempItem);
                if (focusUnit.sp < itemCost) {
                    if (itemCost == 999) {
                        CommonView.addWarn("使用可能レベルに達していません。");
                    } else {
                        CommonView.addWarn("気力が足りません。");
                    }
                    return -1;
                }
                if (ItemDefine.isAllTarget(tempItem.eqType, tempItem.eqSyurui)) {
                    // ターゲット選択を飛ばしていきなり戦闘処理に進む
                    this.cantOpCounter = BATTLE_BATTLEMSG_MAX;
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE);
                } else {
                    // 選択済みの武器に決定
                    this.tempTargetUnit = null;
                    this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE);
                }
                return -1;
            } else {
                CommonView.addWarn("武器かアイテムを選択してください。");
                return -1;
            } 
        }
    } else if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE) {
        // 基本的には敵がターゲットだが、アイテムは味方がターゲット
        var targetSide = (this.tempEqTypeForEquip != ITEM_TYPE_DOGU ? BATTLE_TEKI :BATTLE_MIKATA);
        if (this.tempTargetUnit != null) {
            if (targetSide == BATTLE_TEKI) {
                // 攻撃
                var distance = focusUnit.x + focusUnit.y + this.tempTargetUnit.x + this.tempTargetUnit.y;
                var range = UnitDefine.calcRange(focusUnit, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
                if (range >= distance) {
                    // 普通に届く(なにもしない)
                } else if (range == distance - 1) {
                    // 射程伸ばしで届く
                    var rangeCost = focusUnit.rangeCost;
                    if(this.spGauge[focusUnit.side] >= rangeCost) {
                        this.spGauge[focusUnit.side] -= rangeCost;
                    } else {
                        // 射程伸ばしでも届かない
                        CommonView.addWarn("射程範囲外です。");
                        CommonView.addWarn("伸ばすにはSPゲージが足りません。");
                        return -1;    
                    }
                } else {
                    // 射程伸ばしでも届かない
                    CommonView.addWarn("射程範囲外です。");
                    return -1;
                }
                // 手持ち武器に追加すべきか?
                var equipCheck = focusUnit.isHandEquip(this.tempEqTypeForEquip, this.tempEqSyurui);
                if (equipCheck < 0) {
                    var newEquipItem = {eqType: this.tempEqTypeForEquip, eqSyurui: this.tempEqSyurui};
                    focusUnit.handEquip.push(newEquipItem);
                }
                focusUnit.eqType = this.tempEqTypeForEquip;
                focusUnit.eqSyurui = this.tempEqSyurui;
                // 武器の消費気力分気力を減らす(ここに入ったら確実に減らせる)
                var tempItem = new ItemDefine();
                ItemDefine.init(focusUnit.eqType, focusUnit.eqSyurui, tempItem);
                var itemCost = focusUnit.calcKiryoku(tempItem);
                focusUnit.sp -= itemCost;
                    
                this.cantOpCounter = BATTLE_BATTLEMSG_MAX;
                var randomForHit = Math.floor(Math.random() * 100);//0～99
                var hitRate = UnitDefine.calcHit(focusUnit, this.tempTargetUnit, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
                this.tempResult.isHit = hitRate > randomForHit;
                var randomForCrt = Math.floor(Math.random() * 100);//0～99
                var crtRate = UnitDefine.calcCrt(focusUnit, this.tempTargetUnit, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
                this.tempResult.isCrt = crtRate > randomForCrt;
                var basicDamage = UnitDefine.calcBasicDamage(focusUnit, this.tempTargetUnit, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
                var chikeiRate = UnitDefine.calcChikei(focusUnit, this.tempTargetUnit, ud, this.battleFields, this.tempEqTypeForEquip, this.tempEqSyurui);
                var rateDamage = UnitDefine.calcRateDamage(focusUnit, this.tempTargetUnit, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
                var totalDamage = Math.floor(basicDamage * (100 - chikeiRate) / 100 + rateDamage);
                var randomForPlus = 0.01 * Math.random() * LUCK_RATE * focusUnit.luck;
                var randomForKeigen = 0.01 * Math.random() * LUCK_RATE * this.tempTargetUnit.luck;
                this.tempResult.damage = Math.floor(totalDamage * (1 + randomForPlus) * (1 - randomForKeigen));
                if (this.tempResult.isCrt) {
                    // クリティカル時のダメージ増加
                    var crtDamage = UnitDefine.calcCrtDamage(focusUnit, this.tempTargetUnit, ud, this.tempEqTypeForEquip, this.tempEqSyurui);
                    this.tempResult.damage += crtDamage;
                }
                // かまいたちで確保すべきダメージ
                var kamaitachiDMG = SKILL_YOROI_RATE * focusUnit.lv;
                if ((!this.tempResult.isHit || this.tempResult.damage < kamaitachiDMG) && focusUnit.hasSkill(ud, SKILL_KAMAITACHI)) {
                    CommonView.addMessage(SkillDefine.getSkillName(SKILL_KAMAITACHI) + "発動!", 40);
                    this.tempResult.isHit = true;
                    this.tempResult.isCrt = false;
                    this.tempResult.damage = kamaitachiDMG;
                }
            } else {
                // アイテム使用時はここで行う処理なし
                this.cantOpCounter = BATTLE_BATTLEMSG_MAX;
            }
            return -1;
        } else {
            CommonView.addWarn("ターゲットを選んでください。");
            return -1;
        }
    } else if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_MOVE) {
        var moveCost = this.checkMoveCost(BATTLE_MIKATA, focusUnit.x, focusUnit.y, BATTLE_MIKATA, focusUnit.x, this.tempTargetUnitY);
        if (moveCost == 1 || moveCost == 2) {
            var requireCost = (moveCost == 1 ? focusUnit.m1Cost : focusUnit.m2Cost);
            // 移動(この場合確実に移動できる)
            this.cantOpCounter = 20;
            this.spGauge[BATTLE_MIKATA] -= requireCost;
            focusUnit.y = this.tempTargetUnitY;//暫定移動Y座標;
            return -1;       
        }                    
    }
}

BattleView.prototype.cancel = function(mouseX, mouseY, ud, itemMap) {
    if (this.turn == BATTLEVIEW_TURN_UNITSELECT && mouseX >= BATTLEVIEW_COMMANDTXT_X) {
        //戻る
        //this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_MOVE);
    } else if (this.turn == BATTLEVIEW_TURN_SKILLSELECT) {
        this.turn = BATTLEVIEW_TURN_UNITSELECT;
    } else if (this.turn == BATTLEVIEW_TURN_MIKATA && 
        (this.commandState == BATTLEVIEW_COMSTATE_MOVE || this.commandState == BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE)) {
        this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_PRECHOICE);
    } else if (this.turn == BATTLEVIEW_TURN_MIKATA && this.commandState == BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE) {
        this.tempTargetUnit = null;
        this.moveCheckComState(this.state, BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE);
    }
}

// 味方内で当該アイテムが装備されている数を返す
BattleView.prototype.calcEquipNum = function(ud, eqType, eqSyurui) {
    var allEquipNum = 0;
    for (var i = 0; i < ud.length; i++) {
        var u = ud[i];
        if (u.side == BATTLE_MIKATA) {
            for (var j = 0; j < u.handEquip.length; j++) {
                var tempHandEquip = u.handEquip[j];
                if (tempHandEquip.eqType == eqType && tempHandEquip.eqSyurui == eqSyurui) {
                    allEquipNum++;
                }
            }
        }
    }

    return allEquipNum;
};

// 毒、麻痺の警告表示
BattleView.prototype.drawWarn = function(ctxFlip, orgX, orgY, destX, destY, text, fillColor) {
    var maxNum = 10;
    var index = Math.floor(this.counter / 15) % (maxNum + 1);
    var tempX = (orgX * (maxNum - index) + destX * index) / maxNum;
    var tempY = (orgY * (maxNum - index) + destY * index) / maxNum;
    ctxFlip.beginPath();
    ctxFlip.fillStyle = fillColor;
    ctxFlip.arc(tempX, tempY, 9, 0, 2 * Math.PI, true);
    ctxFlip.fill();
    ctxFlip.fillStyle = 'rgb(0, 0, 0)';
    ctxFlip.font = "10px 'MS Pゴシック'";
    ctxFlip.fillText(text, tempX - 2, tempY + 1);
};

// tempMikataに当該ユニットが登録されているか(登録されてるなら何番目かを返す)
BattleView.prototype.checkTempMikata = function(tempUnit) {
    var ret = -1;
    for (var i = 0; i < this.tempMikata.length; i++) {
        var u = this.tempMikata[i];
        if (tempUnit.equalUnit(u)) {
            return i;
        }
    }
    return ret;
};

BattleView.prototype.selectTutorial = function() {
    if (this.turn == BATTLEVIEW_TURN_UNITSELECT) {
        return COMMONVIEW_TUTORIALID_UNITSELECT;   
    }
    if (this.turn == BATTLEVIEW_TURN_SKILLSELECT) {
        return COMMONVIEW_TUTORIALID_SKILLSELECT;   
    }
    return -1;
}