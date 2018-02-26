//オブジェクトとしては9×2(敵味方)の18個だけ存在。中身を都度書き換える
var FieldDefine = function() {
    this.position = -1;//どこの地形か
    this.ofMap = "";// 攻撃側地形
    this.dfMap = "";// 防御側地形
    this.text = "";//ステージ表示
    this.stage = 0;//何ステージまで攻略したら出現するか
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

FieldDefine.prototype.init = function(position) {
    this.position = position;
    switch(position) {
        case 0:arguments
            this.text = "1-1";
            // 前衛前列→前衛中列→前衛後列→中衛前列…
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "cabcbbadd";
            this.dfMap = "caachbhbh";
            this.x = EVENTVIEW_STAGE1_X;
            this.y = EVENTVIEW_STAGE1_Y;
            this.fieldState = EVENTVIEW_FIELD_MIKATA;
            this.ofY = 211;
            this.dfY = 111;
        break;
        case 1:arguments
            this.text = "1-2";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "dcbdcaccb";
            this.dfMap = "dahbchahh";
            this.x = EVENTVIEW_STAGE1_X;
            this.y = EVENTVIEW_STAGE1_Y - EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 312;
            this.dfY = 123;
        break;
        case 2:arguments
            this.text = "1-3";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "abhiikbaa";
            this.dfMap = "aicaacahc";
            this.x = EVENTVIEW_STAGE1_X - EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE1_Y - 2 * EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 133;
            this.dfY = 211;
        break;
        case 3:arguments
            this.text = "1-4";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "bibcibaib";
            this.dfMap = "ibabbahab";
            this.x = EVENTVIEW_STAGE1_X;
            this.y = EVENTVIEW_STAGE1_Y - 2 * EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 112;
            this.dfY = 113;
        break;
        case 4:arguments
            this.text = "1-5";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "abaabbaii";
            this.dfMap = "baacccahb";
            this.x = EVENTVIEW_STAGE1_X + EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE1_Y - 2 * EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 222;
            this.dfY = 233;
        break;
        case 5:arguments
            this.text = "1-6";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "cbacabcbd";
            this.dfMap = "abhbaaaic";
            this.x = EVENTVIEW_STAGE1_X - EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE1_Y - 3 * EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 231;
            this.dfY = 312;
        break;
        case 6:arguments
            this.text = "1-7";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "caicbicba";
            this.dfMap = "habhhabic";
            this.x = EVENTVIEW_STAGE1_X;
            this.y = EVENTVIEW_STAGE1_Y - 3 * EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 211;
            this.dfY = 112;
        break;
        case 7:arguments
            this.text = "1-8";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "aabcdciik";
            this.dfMap = "abbahabcd";
            this.x = EVENTVIEW_STAGE1_X + EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE1_Y - 3 * EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 311;
            this.dfY = 331;
        break;
        case 8:arguments
            this.text = "1-9";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "abbcahcab";
            this.dfMap = "dcbbckbcb";
            this.x = EVENTVIEW_STAGE1_X;
            this.y = EVENTVIEW_STAGE1_Y - 4 * EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 311;
            this.dfY = 221;
        break;
        case EVENTVIEW_MAP_STAGE1_BOSS:arguments
            this.text = "1-10";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "ahacchbdb";
            this.dfMap = "bchbabaab";
            this.x = EVENTVIEW_STAGE1_X + EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE1_Y - 4 * EVENTVIEW_MAP_INTERVAL;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 211;
            this.dfY = 121;
            this.isBoss = true;
        break;
        case 20:arguments
            this.text = "2-1";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "bbeaeebae";
            this.dfMap = "abacccahb";
            this.x = EVENTVIEW_STAGE2_X;
            this.y = EVENTVIEW_STAGE2_Y;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 211;
            this.dfY = 131;
        break;
        case 21:arguments
            this.text = "2-2";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "bbeadeiie";
            this.dfMap = "abcbaaahi";
            this.x = EVENTVIEW_STAGE2_X + EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 333;
            this.dfY = 232;
        break;
        case 22:arguments
            this.text = "2-3";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "acbachikh";
            this.dfMap = "idhbchhbh";
            this.x = EVENTVIEW_STAGE2_X + EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y + EVENTVIEW_MAP_INTERVAL;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 121;
            this.dfY = 122;
        break;
        case 23:arguments
            this.text = "2-4";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "aabdjabca";
            this.dfMap = "baahaaccc";
            this.x = EVENTVIEW_STAGE2_X + 2 * EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 313;
            this.dfY = 131;
        break;
        case 24:arguments
            this.text = "2-5";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "aibciacia";
            this.dfMap = "aadabahaa";
            this.x = EVENTVIEW_STAGE2_X + 2 * EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y + EVENTVIEW_MAP_INTERVAL;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 222;
            this.dfY = 132;
        break;
        case 25:arguments
            this.text = "2-6";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "kiaaibjia";
            this.dfMap = "abbabeaee";
            this.x = EVENTVIEW_STAGE2_X + 3 * EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y - EVENTVIEW_MAP_INTERVAL;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 121;
            this.dfY = 232;
        break;
        case 26:arguments
            this.text = "2-7";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "haahabccc";
            this.dfMap = "ccdijakba";
            this.x = EVENTVIEW_STAGE2_X + 3 * EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 311;
            this.dfY = 311;
        break;
        case 27:arguments
            this.text = "2-8";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "jabjbahhh";
            this.dfMap = "dcciabiaa";
            this.x = EVENTVIEW_STAGE2_X + 3 * EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y + EVENTVIEW_MAP_INTERVAL;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 232;
            this.dfY = 211;
        break;
        case 28:arguments
            this.text = "2-9";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "adebaebbe";
            this.dfMap = "aeebbehee";
            this.x = EVENTVIEW_STAGE2_X + 4 * EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y - EVENTVIEW_MAP_INTERVAL;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 333;
            this.dfY = 213;
        break;
        case 29:arguments
            this.text = "2-10";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "abchackjj";
            this.dfMap = "ajjbjaaij";
            this.x = EVENTVIEW_STAGE2_X + 4 * EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 121;
            this.dfY = 332;
        break;
        case EVENTVIEW_MAP_STAGE2_BOSS:arguments
            this.text = "2-11";
            // a草 b森 c道 d町 e海 f雪 g砂 h山 i川 j畑 k湖
            this.ofMap = "bheheeaee";
            this.dfMap = "ahecbejee";
            this.x = EVENTVIEW_STAGE2_X + 5 * EVENTVIEW_MAP_INTERVAL;
            this.y = EVENTVIEW_STAGE2_Y - EVENTVIEW_MAP_INTERVAL;
            this.stage = 1;
            this.fieldState = EVENTVIEW_FIELD_TEKI;
            this.ofY = 123;
            this.dfY = 211;
            this.isBoss = true;
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
            u.initTeki(ud, UNIT_SYURUI_SWORD, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 1, 0, 0, 0, ITEM_TYPE_SWORD, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_BACK + BATTLEAI_SM_NO, 1.2, -1);
            ud.push(u);
        break;
        case 1:arguments
            var u = new UnitDefine();
            u.initTeki(ud, UNIT_SYURUI_SHIELD, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 2, 0, 0, 0, ITEM_TYPE_SHIELD, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_FIRST + BATTLEAI_SM_NO, 1.2, -1);
            ud.push(u);
            var u2 = new UnitDefine();
            u2.initTeki(ud, UNIT_SYURUI_MAGIC, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 1, 0, 0, 0, ITEM_TYPE_FIRE, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MAXDM + BATTLEAI_SM_NO, 1.2, -1);
            ud.push(u2);
        break;
        case 2:arguments
            var u = new UnitDefine();
            u.initTeki(ud, UNIT_SYURUI_SPEAR, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 2, SKILL_KEIKAI, 0, 0, ITEM_TYPE_SPEAR, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MINHP + BATTLEAI_SM_BACK, 1.1, -1);
            ud.push(u);
        break;
        case 3:arguments
            var u = new UnitDefine();
            u.initTeki(ud, UNIT_SYURUI_BOW, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 1, 0, 0, 0, ITEM_TYPE_BOW, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MAXDM + BATTLEAI_SM_BACK, 1.2, -1);
            ud.push(u);
            var u2 = new UnitDefine();
            u2.initTeki(ud, UNIT_SYURUI_HAMMER, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 2, 0, 0, 0, ITEM_TYPE_HAMMER, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MAXDM, 1.1, -1);
            ud.push(u2);
        break;
        case 4:arguments
            var u = new UnitDefine();
            u.initTeki(ud, UNIT_SYURUI_PUNCH, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 2, 0, 0, 0, ITEM_TYPE_PUNCH, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_BACK + BATTLEAI_SM_BACK, 1.5, -1);
            ud.push(u);
        break;
        case 5:arguments
            var u = new UnitDefine();
            u.initTeki(ud, UNIT_SYURUI_SWORD, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 2, SKILL_HIGHHIT, 0, 0, ITEM_TYPE_SWORD, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_BACK + BATTLEAI_SM_BACK, 1.3, -1);
            ud.push(u);
            var u2 = new UnitDefine();
            u2.initTeki(ud, UNIT_SYURUI_SPEAR, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 2, 0, 0, 0, ITEM_TYPE_SPEAR, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_FIRST, 1.6, -1);
            ud.push(u2);
        break;
        case 6:arguments
            var u = new UnitDefine();
            u.initTeki(ud, UNIT_SYURUI_MAGIC, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 3, SKILL_KAMAITACHI, 0, 0, ITEM_TYPE_WIND, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MAXDM, 1.2, -1);
            ud.push(u);
        break;
        case 7:arguments
            var u = new UnitDefine();
            u.initTeki(ud, UNIT_SYURUI_PUNCH, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 4, SKILL_HIGHAVO, 0, 0, ITEM_TYPE_PUNCH, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MINHP, 1.3, 2.0);
            ud.push(u);
        break;
        case 8:arguments
            var u = new UnitDefine();
            u.initTeki(ud, UNIT_SYURUI_MAGIC, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 4, SKILL_KEIKAI, SKILL_HIGHHIT, 0, ITEM_TYPE_EARTH, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_FIRST, 1.2, -1);
            ud.push(u);
            var u2 = new UnitDefine();
            u2.initTeki(ud, UNIT_SYURUI_BOW, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 3, 0, 0, 0, ITEM_TYPE_BOW, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MAXDM, 1.1, 1.5);
            ud.push(u2);
        break;
        case EVENTVIEW_MAP_STAGE1_BOSS:arguments
            var u = new UnitDefine();
            u.initTeki(ud, UNIT_SYURUI_S1BOSS, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 5, 0, 0, 0, ITEM_TYPE_SWORD, 1, BATTLEAI_FM_FRONT + BATTLEAI_AT_FIRST, 1.1, 0.5);
            ud.push(u);
            var u2 = new UnitDefine();
            u2.initTeki(ud, UNIT_SYURUI_SPEAR, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 3, 0, 0, 0, ITEM_TYPE_SPEAR, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_BACK + BATTLEAI_SM_BACK, 1.6, -1);
            ud.push(u2);
            var u3 = new UnitDefine();
            u3.initTeki(ud, UNIT_SYURUI_BOW, BATTLE_TEKI, BATTLE_DEFENCE, this.position, 4, 0, 0, 0, ITEM_TYPE_BOW, 0, BATTLEAI_FM_FRONT + BATTLEAI_AT_MINHP, 1.3, -1);
            ud.push(u3);
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