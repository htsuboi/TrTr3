//オブジェクトとしては9×2(敵味方)の18個だけ存在。中身を都度書き換える
var FieldDefine = function() {
    this.position = -1;//どこの地形か
    this.ofMap = "";// 攻撃側地形
    this.dfMap = "";// 防御側地形
    this.side = 0;
    this.x = 0;//全体マップでのX座標(Max224)
    this.y = 0//全体マップでのY座標(Max160)
    this.ofY = 0;//攻撃側の初期配置Y座標(3桁の数字で表記 後衛/中衛/前衛の位置)
    this.dfY = 0;//防御側の初期配置Y座標(3桁の数字で表記 後衛/中衛/前衛の位置)
    this.isBoss = false;//ボス出現するか
    this.fieldState = EVENTVIEW_FIELD_HIDDEN;
    this.isEnemyAppear = false;//敵出現したか(最初の進攻戦用の敵)
    this.itemType = -1;//ここを保持すると購入可能なアイテム(グループ)
    this.itemSyurui = -1;//ここを保持すると購入可能なアイテム(固有種類)
};

// a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
FieldDefine.prototype.init = function(position) {
    this.position = position;
    switch(position) {
        case 0:arguments
            // 前衛前列→前衛中列→前衛後列→中衛前列…
            this.ofMap = "cabcbbadd";
            this.dfMap = "caachbhbh";
            this.x = EVENTVIEW_STAGE1_X;
            this.y = EVENTVIEW_STAGE1_Y;
            this.fieldState = EVENTVIEW_FIELD_MIKATA;
            this.ofY = 211;
            this.dfY = 111;
        break;
        case 1:arguments
            this.ofMap = "dcbdcaccb";
            this.dfMap = "dahbchahh";
            this.x = EVENTVIEW_STAGE1_X;
            this.y = EVENTVIEW_STAGE1_Y - EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 312;
            this.dfY = 123;
        break;
        default:arguments
            // この番号にマップなし
            return -1;
        break;
    }
    return 0;
}

// その場所の敵を作成
FieldDefine.prototype.createEnemy = function(ud) {
    if (this.isEnemyAppear) {
        return;
    }
    this.isEnemyAppear = true;
    switch(this.position) {
        case 0:arguments
            var u = new UnitDefine();
            u.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_SWORD, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 1, 0, 0, 0, ITEM_TYPE_SWORD, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_BACK + BATTLEAI_SM_NO, 1.2, -1);
            ud.push(u);
        break;
        case 1:arguments
            var u = new UnitDefine();
            u.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_SHIELD, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 2, 0, 0, 0, ITEM_TYPE_SHIELD, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_FIRST + BATTLEAI_SM_NO, 1.2, -1);
            ud.push(u);
            var u2 = new UnitDefine();
            u2.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_MAGIC, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 1, 0, 0, 0, ITEM_TYPE_FIRE, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MAXDM + BATTLEAI_SM_NO, 1.2, -1);
            ud.push(u2);
        break;
        default:arguments
            // この番号にマップなし
            return -1;
        break;
    }
    return 0;
}

FieldDefine.prototype.paintMe = function(ctxFlip, x, y) {
    ctxFlip.drawImage(FieldDefine.getFieldImg(), this.x, this.y, 64, 64, x, y, 64, 64);
    //ctxFlip.globalCompositeOperation = 'source-over';
    ctxFlip.drawImage(FieldDefine.getWeaponsImg(), 0, 0, 64, 64, x, y, 64, 64);
};

FieldDefine.getFieldImg = function() {
    if (typeof arguments.callee.fieldImg == 'undefined') {
        arguments.callee.fieldImg = new Image();
        arguments.callee.fieldImg.src = "img/fields.jpg";
    }
    return arguments.callee.fieldImg;
};

FieldDefine.getWeaponsImg = function() {
    if (typeof arguments.callee.weaponsImg == 'undefined') {
        arguments.callee.weaponsImg = new Image();
        arguments.callee.weaponsImg.src = "img/weapons.png";
    }
    return arguments.callee.weaponsImg;
};


FieldDefine.calcUnitY = function(field, ofOrDf, x) {
    var fd = new FieldDefine();
    fd.init(field);
    // 例 攻撃側でofYが「123」なら、前衛Yは「2」、中衛Yは「1」、後衛Yは「0」
    var denominator = (ofOrDf == BATTLE_OFFENCE ? fd.ofY : fd.dfY);
    var divisor = Math.pow(10, x);
    return Math.floor(denominator / divisor) % 10 - 1;
}