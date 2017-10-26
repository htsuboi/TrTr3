var UnitDefine = function() {
    this.unitSyurui = 0;
    this.namae = "テスト兵士";
    this.px = 0;// 絵でのX座標
    this.py = 0;// 絵でのY座標
    this.pSyurui = 0;//どのファイルに絵があるか 0雑魚 1ボス 2PC 3NPC
    this.field = 1;// どこのフィールドにいるか
    this.x = 0;//戦闘画面でのX座標(0…2)
    this.y = 0//戦闘画面でのY座標(0…2)
    this.lv = 1;
    this.side = BATTLE_MIKATA;//BATTLE_MIKATA or BATTLE_TEKI
    this.isBoss = false;
    this.eqType = 0;
    this.eqSyurui = 0;
    this.crt = 0;
    this.luck = 0;
    this.rat = 0;//割合ダメージ
    this.rdf = 0;//割合軽減
    this.regPoison = 0;//毒耐性
    this.regStun = 0;//麻痺耐性
    this.m1Cost = 0;//1移動コスト
    this.m2Cost = 0;//2移動コスト
    this.rangeCost = 0;//射程伸ばしコスト
    this.exAtCost = 0;//再行動コスト
    this.aiType = 0;//AI行動(敵専用)
    this.skills = [0, 0, 0];
    this.handEquip = new Array();//手持ち武器
    var sude = {eqType: ITEM_TYPE_SUDE, eqSyurui: 0};
    // 手持ち武器に「素手」を追加
    this.handEquip.push(sude);
    this.weaps = {};//装備可能武器(味方のみ)
    this.hp = -1;
    this.exp = 0;//経験値
    this.sp = -1;
    this.msp = -1;
    // LvUpで成長するパラはlvUpStatusで参照渡しするためオブジェクト化
    // now:Lv1での初期値 amari:小数点 up, upup, upupup:成長率(÷10して使用 余りはamariを加算)
    this.mhpObj = {now:-1, amari:0, up:0, upup:0, upupup:0};
    this.strObj = {now:-1, amari:0, up:0, upup:0, upupup:0};
    this.magObj = {now:-1, amari:0, up:0, upup:0, upupup:0};
    this.defObj = {now:-1, amari:0, up:0, upup:0, upupup:0};
    this.mdfObj = {now:-1, amari:0, up:0, upup:0, upupup:0};
    this.dexObj = {now:-1, amari:0, up:0, upup:0, upupup:0};
    this.avoObj = {now:-1, amari:0, up:0, upup:0, upupup:0};
};

// field, px, pyが等しければtrue 死んだユニットは比較対象から外すつもりだが、一応HP > 0もつける
UnitDefine.prototype.equalUnit = function(u){
    if (u == null) return false;
    if (this.hp > 0 && u.hp > 0 && this.x == u.x && this.y == u.y && this.field == u.field && this.side == u.side) {
        return true;
    }
    return false;
}

// 敵味方共通の初期化
// ud…既に存在しているユニットが入ったArray。今作成しているユニットは入っていない
UnitDefine.prototype.initCommon = function(ud, difficulty, unitSyurui, side, ofOrDf, field, lv, skill1, skill2, skill3, eqType, eqSyurui) {
    this.unitSyurui = unitSyurui;
    this.skills[0] = skill1;
    this.skills[1] = skill2;
    this.skills[2] = skill3;
    this.eqType = eqType;
    this.eqSyurui = eqSyurui;
    this.initNamePaint(unitSyurui);
    this.side = side;
    this.x = 0;
    for (var i = 0; i < ud.length; i++) {
        var u = ud[i];
        // 同じフィールドで、敵味方が同一のユニットがいたらx座標が右にずれる
        if (u.field == field && u.side == side) {
            this.x++;
        }
    }
    this.y = FieldDefine.calcUnitY(field, ofOrDf, this.x);
    switch(unitSyurui) {
        case UNIT_SYURUI_SWORD:arguments
            this.crt = 4 + (difficulty > GAME_DIFFICULTY_HARD ? 2 : 0);
            this.luck = 2;
            this.rat = 4 + (difficulty > GAME_DIFFICULTY_NORMAL ? 1 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 1 : 0);//割合ダメージ
            this.rdf = 2;//割合軽減
            this.m1Cost = 20;//1移動コスト
            this.m2Cost = 55;//2移動コスト
            this.rangeCost = 75;//射程伸ばしコスト
            this.exAtCost = 200;//再行動コスト
            this.exp = 10;//経験値
            this.mhpObj = {now:72, amari:0, up:48, upup:8 + (difficulty > GAME_DIFFICULTY_NORMAL ? 10 : 0), upupup:11 + (difficulty > GAME_DIFFICULTY_HARD ? 8 : 0)};
            this.strObj = {now:35, amari:0, up:25, upup:5, upupup:15};
            this.magObj = {now:6, amari:0, up:10, upup:6, upupup:9};
            this.defObj = {now:10, amari:0, up:12, upup:10, upupup:1 + (difficulty > GAME_DIFFICULTY_HARD ? 9 : 0)};
            this.mdfObj = {now:8, amari:0, up:10, upup:13 + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0), upupup:7};
            this.hitObj = {now:97 + (difficulty > GAME_DIFFICULTY_NORMAL ? 3 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), amari:0, up:32 + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0), upup:12 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0), upupup:19};
            this.avoObj = {now:17, amari:0, up:18, upup:12, upupup:5};
        break;
        case UNIT_SYURUI_SPEAR:arguments
            this.crt = 3 + (difficulty > GAME_DIFFICULTY_HARD ? 2 : 0);
            this.luck = 2;
            this.rat = 3 + (difficulty > GAME_DIFFICULTY_NORMAL ? 1 : 0);//割合ダメージ
            this.rdf = 2;//割合軽減
            this.m1Cost = 35;//1移動コスト
            this.m2Cost = 70;//2移動コスト
            this.rangeCost = 60;//射程伸ばしコスト
            this.exAtCost = 230;//再行動コスト
            this.exp = 11;//経験値
            this.mhpObj = {now:79, amari:0, up:55, upup:16, upupup:20 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0)};
            this.strObj = {now:39, amari:0, up:29, upup:6 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0), upupup:20 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0)};
            this.magObj = {now:3, amari:0, up:4, upup:5, upupup:3};
            this.defObj = {now:13 + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), amari:0, up:18 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), upup:10, upupup:12};
            this.mdfObj = {now:6, amari:0, up:11, upup:13 + (difficulty > GAME_DIFFICULTY_NORMAL ? 3 : 0), upupup:8 + (difficulty > GAME_DIFFICULTY_HARD ? 11 : 0)};
            this.hitObj = {now:87, amari:0, up:24 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), upup:9, upupup:12};
            this.avoObj = {now:13, amari:0, up:15, upup:7, upupup:12 + (difficulty > GAME_DIFFICULTY_HARD ? 10 : 0)};
        break;
        case UNIT_SYURUI_BOW:arguments
            this.crt = 2 + (difficulty > GAME_DIFFICULTY_HARD ? 1 : 0);
            this.luck = 2;
            this.rat = 2;//割合ダメージ
            this.rdf = 5;//割合軽減
            this.m1Cost = 40;//1移動コスト
            this.m2Cost = 60;//2移動コスト
            this.rangeCost = 70;//射程伸ばしコスト
            this.exAtCost = 210;//再行動コスト
            this.exp = 13;//経験値
            this.mhpObj = {now:74, amari:0, up:50 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0), upup:11 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), upupup:23};
            this.strObj = {now:36, amari:0, up:35 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), upup:3 + (difficulty > GAME_DIFFICULTY_NORMAL ? 3 : 0), upupup:13};
            this.magObj = {now:7, amari:0, up:10, upup:0, upupup:12};
            this.defObj = {now:13, amari:0, up:18 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), upup:10, upupup:12};
            this.mdfObj = {now:8 + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0), amari:0, up:13 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0), upup:13, upupup:7};
            this.hitObj = {now:94, amari:0, up:27, upup:10 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0), upupup:17 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0)};
            this.avoObj = {now:15, amari:0, up:20, upup:8, upupup:2};
        break;
        case UNIT_SYURUI_HAMMER:arguments
            this.crt = 2;
            this.luck = 2;
            this.rat = 2;//割合ダメージ
            this.rdf = 0;//割合軽減
            this.m1Cost = 20;//1移動コスト
            this.m2Cost = 90;//2移動コスト
            this.rangeCost = 40;//射程伸ばしコスト
            this.exAtCost = 270;//再行動コスト
            this.exp = 11;//経験値
            this.mhpObj = {now:85, amari:0, up:58 + (difficulty > GAME_DIFFICULTY_HARD ? 7 : 0), upup:17, upupup:21 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0)};
            this.strObj = {now:43, amari:0, up:32, upup:12 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0), upupup:23 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0)};
            this.magObj = {now:0, amari:0, up:10, upup:2, upupup:20};
            this.defObj = {now:13 + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), amari:0, up:18 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), upup:10, upupup:12};
            this.mdfObj = {now:4, amari:0, up:8, upup:11 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0), upupup:17};
            this.hitObj = {now:80, amari:0, up:18, upup:10 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), upupup:24};
            this.avoObj = {now:8, amari:0, up:15, upup:7, upupup:12};
        break;
        case UNIT_SYURUI_KNIFE:arguments
            this.crt = 15 + (difficulty > GAME_DIFFICULTY_NORMAL ? 3 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0);
            this.luck = 2;
            this.rat = 8 + (difficulty > GAME_DIFFICULTY_NORMAL ? 2 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 2 : 0);//割合ダメージ
            this.rdf = 5 + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0) ;//割合軽減
            this.m1Cost = 25;//1移動コスト
            this.m2Cost = 50;//2移動コスト
            this.rangeCost = 100;//射程伸ばしコスト
            this.exAtCost = 250;//再行動コスト
            this.exp = 14;//経験値
            this.mhpObj = {now:71, amari:0, up:44, upup:7, upupup:12 + (difficulty > GAME_DIFFICULTY_NORMAL ? 12 : 0)};
            this.strObj = {now:26, amari:0, up:20 + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), upup:8, upupup:10};
            this.magObj = {now:8, amari:0, up:12, upup:0, upupup:0};
            this.defObj = {now:10, amari:0, up:12, upup:10, upupup:1 + (difficulty > GAME_DIFFICULTY_HARD ? 9 : 0)};
            this.mdfObj = {now:14, amari:0, up:14, upup:12, upupup:9};
            this.hitObj = {now:93, amari:0, up:29 + (difficulty > GAME_DIFFICULTY_HARD ? 2 : 0), upup:21, upupup:6 + (difficulty > GAME_DIFFICULTY_HARD ? 10 : 0)};
            this.avoObj = {now:20, amari:0, up:22, upup:14 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), upupup:12 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0)};
        break;
        case UNIT_SYURUI_PUNCH:arguments
            this.crt = 2;
            this.luck = 2;
            this.rat = 2;//割合ダメージ
            this.rdf = 4;//割合軽減
            this.m1Cost = 40;//1移動コスト
            this.m2Cost = 50;//2移動コスト
            this.rangeCost = 120;//射程伸ばしコスト
            this.exAtCost = 160;//再行動コスト
            this.exp = 13;//経験値
            this.mhpObj = {now:88 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0), amari:0, up:55, upup:24 + (difficulty > GAME_DIFFICULTY_NORMAL ? 12 : 0), upupup:23 + (difficulty > GAME_DIFFICULTY_HARD ? 7 : 0)};
            this.strObj = {now:44 + (difficulty > GAME_DIFFICULTY_NORMAL ? 2 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), amari:0, up:36  + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), upup:15, upupup:25 + (difficulty > GAME_DIFFICULTY_NORMAL ? 9 : 0)};
            this.magObj = {now:10, amari:0, up:0, upup:15, upupup:0};
            this.defObj = {now:14, amari:0, up:15 + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), upup:15 + (difficulty > GAME_DIFFICULTY_NORMAL ? 8 : 0), upupup:13};
            this.mdfObj = {now:12, amari:0, up:10 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0), upup:19, upupup:15 + (difficulty > GAME_DIFFICULTY_HARD ? 12 : 0)};
            this.hitObj = {now:88, amari:0, up:26 + (difficulty > GAME_DIFFICULTY_NORMAL ? 3 : 0), upup:18, upupup:20};
            this.avoObj = {now:18, amari:0, up:17 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0), upup:10, upupup:18 + (difficulty > GAME_DIFFICULTY_NORMAL ? 10 : 0)};
        break;
        case UNIT_SYURUI_SHIELD:arguments
            this.crt = 0;
            this.luck = 2;
            this.rat = 3;//割合ダメージ
            this.rdf = 1;//割合軽減
            this.m1Cost = 45;//1移動コスト
            this.m2Cost = 60;//2移動コスト
            this.rangeCost = 70;//射程伸ばしコスト
            this.exAtCost = 170;//再行動コスト
            this.exp = 13;//経験値
            this.mhpObj = {now:88 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0), amari:0, up:55, upup:24 + (difficulty > GAME_DIFFICULTY_NORMAL ? 12 : 0), upupup:23 + (difficulty > GAME_DIFFICULTY_HARD ? 7 : 0)};
            this.strObj = {now:44 + (difficulty > GAME_DIFFICULTY_NORMAL ? 2 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), amari:0, up:36  + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), upup:15, upupup:25 + (difficulty > GAME_DIFFICULTY_NORMAL ? 9 : 0)};
            this.magObj = {now:10, amari:0, up:0, upup:15, upupup:0};
            this.defObj = {now:19 + (difficulty > GAME_DIFFICULTY_NORMAL ? 3 : 0), amari:0, up:24 + (difficulty > GAME_DIFFICULTY_HARD ? 7 : 0), upup:17 + (difficulty > GAME_DIFFICULTY_NORMAL ? 8 : 0), upupup:15 + (difficulty > GAME_DIFFICULTY_HARD ? 13 : 0)};
            this.mdfObj = {now:7, amari:0, up:9, upup:13, upupup:18};
            this.hitObj = {now:90, amari:0, up:27 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0), upup:20 + (difficulty > GAME_DIFFICULTY_EXPERT ? 6 : 0), upupup:28 + (difficulty > GAME_DIFFICULTY_HARD ? 10 : 0)};
            this.avoObj = {now:10, amari:0, up:14, upup:18, upupup:6};
        break;
        case UNIT_SYURUI_MAGIC:arguments
            this.crt = 6 + (difficulty > GAME_DIFFICULTY_HARD ? 2 : 0);
            this.luck = 2;
            this.rat = 6;//割合ダメージ
            this.rdf = 5;//割合軽減
            this.m1Cost = 50;//1移動コスト
            this.m2Cost = 65;//2移動コスト
            this.rangeCost = 120;//射程伸ばしコスト
            this.exAtCost = 180;//再行動コスト
            this.exp = 13;//経験値
            this.mhpObj = {now:68, amari:0, up:39, upup:10, upupup:16};
            this.strObj = {now:6, amari:0, up:11, upup:4, upupup:8};
            this.magObj = {now:25 + (difficulty > GAME_DIFFICULTY_NORMAL ? 2 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0), amari:0, up:19 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0), upup:13 + (difficulty > GAME_DIFFICULTY_HARD ? 8 : 0), upupup:11};
            this.defObj = {now:5, amari:0, up:9, upup:14, upupup:10};
            this.mdfObj = {now:20 + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), amari:0, up:18, upup:13 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0), upupup:8 + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0)};
            this.hitObj = {now:87, amari:0, up:24 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0), upup:15 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), upupup:8};
            this.avoObj = {now:10, amari:0, up:14, upup:15, upupup:10 + (difficulty > GAME_DIFFICULTY_HARD ? 10 : 0)};
        break;
        case UNIT_SYURUI_SPEED:arguments
            this.crt = 7 + (difficulty > GAME_DIFFICULTY_NORMAL ? 2 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 1 : 0);
            this.luck = 3;
            this.rat = 7 + (difficulty > GAME_DIFFICULTY_HARD ? 2 : 0);//割合ダメージ
            this.rdf = 4;//割合軽減
            this.m1Cost = 25;//1移動コスト
            this.m2Cost = 35;//2移動コスト
            this.rangeCost = 80;//射程伸ばしコスト
            this.exAtCost = 145;//再行動コスト
            this.exp = 15;//経験値
            this.mhpObj = {now:83, amari:0, up:49 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0), upup:11 + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), upupup:10};
            this.strObj = {now:39, amari:0, up:29, upup:14 + (difficulty > GAME_DIFFICULTY_HARD ? 7 : 0), upupup:14 + (difficulty > GAME_DIFFICULTY_NORMAL ? 8 : 0)};
            this.magObj = {now:11, amari:0, up:12, upup:0, upupup:13};
            this.defObj = {now:10, amari:0, up:20 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0), upup:11, upupup:13 + (difficulty > GAME_DIFFICULTY_HARD ? 10 : 0)};
            this.mdfObj = {now:20 + (difficulty > GAME_DIFFICULTY_NORMAL ? 3 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0), amari:0, up:19, upup:15 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0), upupup:7 + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0)};
            this.hitObj = {now:90, amari:0, up:30 + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), upup:14 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0), upupup:15 + (difficulty > GAME_DIFFICULTY_HARD ? 13 : 0)};
            this.avoObj = {now:25, amari:0, up:16 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0), upup:18, upupup:23};
        break;
        case UNIT_SYURUI_SNIPE:arguments
            this.crt = 11 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0);
            this.luck = 3;
            this.rat = 5;//割合ダメージ
            this.rdf = 4;//割合軽減
            this.m1Cost = 30;//1移動コスト
            this.m2Cost = 55;//2移動コスト
            this.rangeCost = 100;//射程伸ばしコスト
            this.exAtCost = 185;//再行動コスト
            this.exp = 17;//経験値
            this.mhpObj = {now:80, amari:0, up:54 + (difficulty > GAME_DIFFICULTY_HARD ? 8 : 0), upup:14, upupup:26 + (difficulty > GAME_DIFFICULTY_NORMAL ? 10 : 0)};
            this.strObj = {now:40 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 2 : 0), amari:0, up:40, upup:9, upupup:18 + (difficulty > GAME_DIFFICULTY_NORMAL ? 9 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0)};
            this.magObj = {now:4, amari:0, up:10, upup:0, upupup:1};
            this.defObj = {now:15, amari:0, up:21 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0), upup:9 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0), upupup:4};
            this.mdfObj = {now:9, amari:0, up:18, upup:15 + (difficulty > GAME_DIFFICULTY_NORMAL ? 8 : 0), upupup:11 + (difficulty > GAME_DIFFICULTY_HARD ? 11 : 0)};
            this.hitObj = {now:99, amari:0, up:30 + (difficulty > GAME_DIFFICULTY_NORMAL ? 8 : 0), upup:13, upupup:20 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0)};
            this.avoObj = {now:22 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0), amari:0, up:25, upup:14 + (difficulty > GAME_DIFFICULTY_HARD ? 7 : 0), upupup:10};
        break;
        case UNIT_SYURUI_POISON:arguments
            this.crt = 0;
            this.luck = 3;
            this.rat = 3;//割合ダメージ
            this.rdf = 7;//割合軽減
            this.m1Cost = 40;//1移動コスト
            this.m2Cost = 60;//2移動コスト
            this.rangeCost = 70;//射程伸ばしコスト
            this.exAtCost = 140;//再行動コスト
            this.exp = 18;//経験値
            this.mhpObj = {now:90 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), amari:0, up:52, upup:15 + (difficulty > GAME_DIFFICULTY_NORMAL ? 10 : 0), upupup:10};
            this.strObj = {now:37, amari:0, up:32, upup:7 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0), upupup:11 + (difficulty > GAME_DIFFICULTY_HARD ? 10 : 0)};
            this.magObj = {now:7, amari:0, up:12, upup:8, upupup:6};
            this.defObj = {now:15, amari:0, up:23, upup:10 + (difficulty > GAME_DIFFICULTY_NORMAL ? 10 : 0), upupup:11};
            this.mdfObj = {now:12, amari:0, up:18, upup:13, upupup:14 + (difficulty > GAME_DIFFICULTY_NORMAL ? 11 : 0)};
            this.hitObj = {now:95, amari:0, up:29, upup:11 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0), upupup:16};
            this.avoObj = {now:15, amari:0, up:21, upup:13, upupup:10 + (difficulty > GAME_DIFFICULTY_NORMAL ? 10 : 0)};
        break;
        case UNIT_SYURUI_STUN:arguments
            this.crt = 2;
            this.luck = 3;
            this.rat = 9;//割合ダメージ
            this.rdf = 1;//割合軽減
            this.m1Cost = 40;//1移動コスト
            this.m2Cost = 55;//2移動コスト
            this.rangeCost = 65;//射程伸ばしコスト
            this.exAtCost = 160;//再行動コスト
            this.exp = 19;//経験値
            this.mhpObj = {now:100 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0), amari:0, up:57 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), upup:28, upupup:15};
            this.strObj = {now:34, amari:0, up:26, upup:6 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), upupup:14};
            this.magObj = {now:2, amari:0, up:3, upup:10, upupup:6};
            this.defObj = {now:12, amari:0, up:18, upup:10, upupup:15 + (difficulty > GAME_DIFFICULTY_HARD ? 11 : 0)};
            this.mdfObj = {now:15 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0), amari:0, up:20 + (difficulty > GAME_DIFFICULTY_HARD ? 8 : 0), upup:22, upupup:14 + (difficulty > GAME_DIFFICULTY_NORMAL ? 11 : 0)};
            this.hitObj = {now:96, amari:0, up:31 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0), upup:15, upupup:20};
            this.avoObj = {now:13, amari:0, up:15, upup:8 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0), upupup:9};
        break;
        case UNIT_SYURUI_JMAGIC:arguments
            this.crt = 9;
            this.luck = 3;
            this.rat = 7;//割合ダメージ
            this.rdf = 7;//割合軽減
            this.m1Cost = 40;//1移動コスト
            this.m2Cost = 50;//2移動コスト
            this.rangeCost = 90;//射程伸ばしコスト
            this.exAtCost = 160;//再行動コスト
            this.exp = 20;//経験値
            this.mhpObj = {now:74 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0), amari:0, up:43 + (difficulty > GAME_DIFFICULTY_HARD ? 5 : 0), upup:15 + (difficulty > GAME_DIFFICULTY_NORMAL ? 8 : 0), upupup:20};
            this.strObj = {now:8, amari:0, up:13, upup:8, upupup:7};
            this.magObj = {now:31 , amari:0, up:27, upup:17 + (difficulty > GAME_DIFFICULTY_HARD ? 10 : 0), upupup:12 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0)};
            this.defObj = {now:8, amari:0, up:13, upup:15 + (difficulty > GAME_DIFFICULTY_HARD ? 7 : 0), upupup:10};
            this.mdfObj = {now:22 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0), amari:0, up:22, upup:10 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0), upupup:13 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0)};
            this.hitObj = {now:94, amari:0, up:32, upup:20 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0), upupup:9};
            this.avoObj = {now:15, amari:0, up:18 + (difficulty > GAME_DIFFICULTY_NORMAL ? 4 : 0), upup:21, upupup:14 + (difficulty > GAME_DIFFICULTY_NORMAL ? 9 : 0)};
        break;
        case UNIT_SYURUI_SHIKI:arguments
            this.crt = 10 + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0);
            this.luck = 3;
            this.rat = 10;//割合ダメージ
            this.rdf = 6;//割合軽減
            this.m1Cost = 50;//1移動コスト
            this.m2Cost = 60;//2移動コスト
            this.rangeCost = 60;//射程伸ばしコスト
            this.exAtCost = 155;//再行動コスト
            this.exp = 21;//経験値
            this.mhpObj = {now:107, amari:0, up:61 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0), upup:6, upupup:10 + (difficulty > GAME_DIFFICULTY_HARD ? 8 : 0)};
            this.strObj = {now:36 + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0), amari:0, up:31, upup:11 + (difficulty > GAME_DIFFICULTY_NORMAL ? 6 : 0), upupup:20 + (difficulty > GAME_DIFFICULTY_HARD ? 8 : 0)};
            this.magObj = {now:9, amari:0, up:11, upup:0, upupup:12};
            this.defObj = {now:14 + (difficulty > GAME_DIFFICULTY_HARD ? 4 : 0), amari:0, up:20, upup:20 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0), upupup:20 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0)};
            this.mdfObj = {now:14, amari:0, up:27, upup:14, upupup:16 + (difficulty > GAME_DIFFICULTY_HARD ? 10 : 0)};
            this.hitObj = {now:98 + (difficulty > GAME_DIFFICULTY_NORMAL ? 5 : 0), amari:0, up:37, upup:17, upupup:20 + (difficulty > GAME_DIFFICULTY_NORMAL ? 7 : 0) + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0)};
            this.avoObj = {now:15 + (difficulty > GAME_DIFFICULTY_HARD ? 3 : 0), amari:0, up:19 + (difficulty > GAME_DIFFICULTY_HARD ? 6 : 0), upup:15, upupup:10 + (difficulty > GAME_DIFFICULTY_NORMAL ? 8 : 0)};
        break;
        
        case UNIT_SYURUI_PRINCESS:arguments
            this.msp = 19;
            this.crt = 6;
            this.luck = 4;
            this.rat = 4;//割合ダメージ
            this.rdf = 5;//割合軽減
            this.m1Cost = 30;//1移動コスト
            this.m2Cost = 50;//2移動コスト
            this.rangeCost = 80;//射程伸ばしコスト
            this.exAtCost = 145;//再行動コスト
            this.regPoison = 85;
            this.regStun = 30;
            this.mhpObj = {now:76, amari:0, up:43, upup:17, upupup:15};
            this.strObj = {now:29, amari:0, up:27, upup:15, upupup:9};
            this.magObj = {now:28, amari:0, up:24, upup:22, upupup:14};
            this.defObj = {now:20, amari:0, up:22, upup:16, upupup:13};
            this.mdfObj = {now:21, amari:0, up:18, upup:20, upupup:13};
            this.hitObj = {now:97, amari:0, up:34, upup:21, upupup:25};
            this.avoObj = {now:15, amari:0, up:23, upup:16, upupup:20};
            this.weaps[ITEM_TYPE_SWORD] = 27;
            this.weaps[ITEM_TYPE_WATER] = 32;
            this.weaps[ITEM_TYPE_WIND] = 14;
        break;
        case UNIT_SYURUI_KNIGHT:arguments
            this.msp = 22;
            this.crt = 5;
            this.luck = 3;
            this.rat = 3;//割合ダメージ
            this.rdf = 7;//割合軽減
            this.m1Cost = 40;//1移動コスト
            this.m2Cost = 50;//2移動コスト
            this.rangeCost = 70;//射程伸ばしコスト
            this.exAtCost = 160;//再行動コスト
            this.regPoison = 75;
            this.regStun = 25;
            this.mhpObj = {now:80, amari:0, up:47, upup:23, upupup:14};
            this.strObj = {now:35, amari:0, up:31, upup:20, upupup:12};
            this.magObj = {now:8, amari:0, up:5, upup:11, upupup:8};
            this.defObj = {now:25, amari:0, up:29, upup:16, upupup:17};
            this.mdfObj = {now:18, amari:0, up:18, upup:15, upupup:9};
            this.hitObj = {now:100, amari:0, up:38, upup:9, upupup:16};
            this.avoObj = {now:11, amari:0, up:19, upup:22, upupup:13};
            this.weaps[ITEM_TYPE_SWORD] = 21;
            this.weaps[ITEM_TYPE_SPEAR] = 24;
            this.weaps[ITEM_TYPE_SHIELD] = 20;
        break;
        case UNIT_SYURUI_MUSCLE:arguments
            this.msp = 23;
            this.crt = 3;
            this.luck = 3;
            this.rat = 3;//割合ダメージ
            this.rdf = 3;//割合軽減
            this.m1Cost = 35;//1移動コスト
            this.m2Cost = 80;//2移動コスト
            this.rangeCost = 50;//射程伸ばしコスト
            this.exAtCost = 180;//再行動コスト
            this.regPoison = 65;
            this.regStun = 20;
            this.mhpObj = {now:93, amari:0, up:52, upup:26, upupup:17};
            this.strObj = {now:40, amari:0, up:36, upup:10, upupup:21};
            this.magObj = {now:3, amari:0, up:4, upup:0, upupup:5};
            this.defObj = {now:28, amari:0, up:21, upup:16, upupup:23};
            this.mdfObj = {now:15, amari:0, up:13, upup:17, upupup:5};
            this.hitObj = {now:90, amari:0, up:29, upup:10, upupup:14};
            this.avoObj = {now:10, amari:0, up:12, upup:20, upupup:16};
            this.weaps[ITEM_TYPE_SWORD] = 5;
            this.weaps[ITEM_TYPE_HAMMER] = 36;
            this.weaps[ITEM_TYPE_PUNCH] = 17;
        break;
        case UNIT_SYURUI_TATEO:arguments
            this.msp = 20;
            this.crt = 2;
            this.luck = 2;
            this.rat = 3;//割合ダメージ
            this.rdf = 2;//割合軽減
            this.m1Cost = 45;//1移動コスト
            this.m2Cost = 80;//2移動コスト
            this.rangeCost = 60;//射程伸ばしコスト
            this.exAtCost = 150;//再行動コスト
            this.regPoison = 75;
            this.regStun = 40;
            this.mhpObj = {now:96, amari:0, up:41, upup:28, upupup:20};
            this.strObj = {now:38, amari:0, up:33, upup:11, upupup:15};
            this.magObj = {now:2, amari:0, up:10, upup:8, upupup:5};
            this.defObj = {now:30, amari:0, up:31, upup:12, upupup:15};
            this.mdfObj = {now:13, amari:0, up:18, upup:10, upupup:18};
            this.hitObj = {now:84, amari:0, up:22, upup:12, upupup:20};
            this.avoObj = {now:6, amari:0, up:10, upup:20, upupup:9};
            this.weaps[ITEM_TYPE_SPEAR] = 10;
            this.weaps[ITEM_TYPE_HAMMER] = 22;
            this.weaps[ITEM_TYPE_SHIELD] = 38;
        break;
        case UNIT_SYURUI_JC:arguments
            this.msp = 19;
            this.crt = 4;
            this.luck = 4;
            this.rat = 3;//割合ダメージ
            this.rdf = 1;//割合軽減
            this.m1Cost = 25;//1移動コスト
            this.m2Cost = 70;//2移動コスト
            this.rangeCost = 190;//射程伸ばしコスト
            this.exAtCost = 120;//再行動コスト
            this.regPoison = 65;
            this.regStun = 45;
            this.mhpObj = {now:82, amari:0, up:34, upup:24, upupup:27};
            this.strObj = {now:35, amari:0, up:31, upup:20, upupup:15};
            this.magObj = {now:10, amari:0, up:11, upup:0, upupup:4};
            this.defObj = {now:18, amari:0, up:20, upup:11, upupup:17};
            this.mdfObj = {now:15, amari:0, up:18, upup:13, upupup:8};
            this.hitObj = {now:91, amari:0, up:32, upup:9, upupup:15};
            this.avoObj = {now:16, amari:0, up:19, upup:22, upupup:10};
            this.weaps[ITEM_TYPE_SWORD] = 28;
            this.weaps[ITEM_TYPE_PUNCH] = 31;
        break;
        default:arguments
            printWarn('no UnitName unitType:' + unitType);
        break;
    }
    // 指定Lvまでレベルアップ
    while(this.lv < lv) {
        this.lv++;
        this.exp = Math.floor(UNIT_LVUP_EX * this.exp)
        this.lvUp(this.lv);
    }
    this.hp = this.mhpObj.now;
    this.sp = this.msp;
}

// 描画はBattleViewで行う

// 名前/絵の初期化
UnitDefine.prototype.initNamePaint = function(unitSyurui) {
    switch(unitSyurui) {
        case UNIT_SYURUI_SWORD:arguments
            this.namae = UNIT_NAMAE_SWORD; 
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 2 * 256;
            this.py = 0 * 320;
        break;
        case UNIT_SYURUI_SPEAR:arguments
            this.namae = UNIT_NAMAE_SPEAR;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 0 * 256;
            this.py = 1 * 320;
        break;
        case UNIT_SYURUI_BOW:arguments
            this.namae = UNIT_NAMAE_BOW;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 2 * 256;
            this.py = 2 * 320;
        break;
        case UNIT_SYURUI_HAMMER:arguments
            this.namae = UNIT_NAMAE_HAMMER;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 1 * 256;
            this.py = 0 * 320;
        break;
        case UNIT_SYURUI_KNIFE:arguments
            this.namae = UNIT_NAMAE_KNIFE;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 0 * 256;
            this.py = 0 * 320;
        break;
        case UNIT_SYURUI_PUNCH:arguments
            this.namae = UNIT_NAMAE_PUNCH
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 2 * 256;
            this.py = 1 * 320;
        break;
        case UNIT_SYURUI_SHIELD:arguments
            this.namae = UNIT_NAMAE_SHIELD; 
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 1 * 256;
            this.py = 1 * 320;
        break;
        case UNIT_SYURUI_MAGIC:arguments
            this.namae = UNIT_NAMAE_MAGIC; 
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 3 * 256;
            this.py = 0 * 320;
        break;
        case UNIT_SYURUI_SPEED:arguments
            this.namae = UNIT_NAMAE_SPEED; 
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 3 * 256;
            this.py = 1 * 320;
        break;
        case UNIT_SYURUI_SNIPE:arguments
            this.namae = UNIT_NAMAE_SNIPE;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 0 * 256;
            this.py = 2 * 320;
        break;
        case UNIT_SYURUI_POISON:arguments
            this.namae = UNIT_NAMAE_POISON;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 0 * 256;
            this.py = 3 * 320;
        break;
        case UNIT_SYURUI_STUN:arguments
            this.namae = UNIT_NAMAE_STUN;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 1 * 256;
            this.py = 3 * 320;
        break;
        case UNIT_SYURUI_JMAGIC:arguments
            this.namae = UNIT_NAMAE_JMAGIC;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 3 * 256;
            this.py = 2 * 320;
        break;
        case UNIT_SYURUI_SHIKI:arguments
            this.namae = UNIT_NAMAE_SHIKI;
            this.pSyurui = BATTLE_PSYURUI_ZAKO;
            this.px = 1 * 256;
            this.py = 2 * 320;
        break;
        // PC
        case UNIT_SYURUI_PRINCESS:arguments
            this.namae = UNIT_NAMAE_PRINCESS; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 1 * 256;
            this.py = 1 * 320;
        break;
        case UNIT_SYURUI_KNIGHT:arguments
            this.namae = UNIT_NAMAE_KNIGHT; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 1 * 256;
            this.py = 0 * 320;
        break;
        case UNIT_SYURUI_MUSCLE:arguments
            this.namae = UNIT_NAMAE_MUSCLE; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 0 * 256;
            this.py = 0 * 320;
        break;
        case UNIT_SYURUI_TATEO:arguments
            this.namae = UNIT_NAMAE_TATEO; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 0 * 256;
            this.py = 1 * 320;
        break;
        case UNIT_SYURUI_JC:arguments
            this.namae = UNIT_NAMAE_JC; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 2 * 256;
            this.py = 1 * 320;
        break;
        case UNIT_SYURUI_FIGHTER:arguments
            this.namae = UNIT_NAMAE_FIGHTER; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 2 * 256;
            this.py = 0 * 320;
        break;
        case UNIT_SYURUI_GAKUSYA:arguments
            this.namae = UNIT_NAMAE_GAKUSYA; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 0 * 256;
            this.py = 2 * 320;
        break;
        case UNIT_SYURUI_THIEF:arguments
            this.namae = UNIT_NAMAE_THIEF; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 2 * 256;
            this.py = 2 * 320;
        break;
        case UNIT_SYURUI_SHIACYAN:arguments
            this.namae = UNIT_NAMAE_SHIACYAN; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 3 * 256;
            this.py = 1 * 320;
        break;
        case UNIT_SYURUI_MAJYO:arguments
            this.namae = UNIT_NAMAE_MAJYO; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 1 * 256;
            this.py = 2 * 320;
        break;
        case UNIT_SYURUI_KAGE:arguments
            this.namae = UNIT_NAMAE_KAGE; 
            this.pSyurui = BATTLE_PSYURUI_PC;
            this.px = 2 * 256;
            this.py = 2 * 320;
        break;
        default:arguments
            printWarn('no UnitName unitType:' + unitType);  
        break;
    }
    return;
}

UnitDefine.prototype.lvUp = function(lv){
    var orgAmari = {org:this.mhp, amari:this.hpAmari};
    this.lvUpStatus(this.lv, orgAmari, this.hpUp, this.hpUpUp, this.hpUpUpUp);
    this.mhp = orgAmari.org;
    this.hpAmari = orgAmari.amari;
    this.lvUpStatus(this.lv, this.mhpObj);
    this.lvUpStatus(this.lv, this.strObj);
    this.lvUpStatus(this.lv, this.magObj);
    this.lvUpStatus(this.lv, this.defObj);
    this.lvUpStatus(this.lv, this.mdfObj);
    this.lvUpStatus(this.lv, this.hitObj);
    this.lvUpStatus(this.lv, this.avoObj);
}

// 該当武器が装備可能武器の何番目か?(スタートは0)
UnitDefine.prototype.getItemIndex = function(eqType){
    var idx = -1;
    // 装備不可
    if (this.weaps[eqType] == null) {
        return idx;
    }
    for (var i = ITEM_TYPE_SWORD; i <= ITEM_TYPE_DOGU; i++) {
        if (this.weaps[i] != null && this.weaps[i] > 0) {
            idx++;
        }
        if (i == eqType) {
            break;
        }
    }
    return idx;
}

// 装備可能武器のi番目の武器はなにか?(スタートは0)
UnitDefine.prototype.getReverseItemIndex = function(idx){
    var tempIdx = -1;
    for (var i = ITEM_TYPE_SWORD; i <= ITEM_TYPE_DOGU; i++) {
        if ((this.weaps[i] != null && this.weaps[i] > 0) || i == ITEM_TYPE_DOGU) {
            tempIdx++;
        }
        if (tempIdx == idx) {
            return i;
        }
    }
    return -1;
}

UnitDefine.prototype.lvUpStatus = function(lv, paramObj) {
    // orgValue:ゲームで使用する値
    // amari:orgValueの小数点1桁(ゲーム内非表示、戦闘では使用しない)
    // up1, up2, up3は÷10した値が実際の成長率で、orgValueとamariに加算される
    var totalUp = paramObj.up;
    // Lvが一定値を超えていれば成長率上昇
    if (lv > UNIT_LVUP_EXLV1) {
        totalUp += paramObj.upup;
    }
    if (lv > UNIT_LVUP_EXLV2) {
        totalUp += paramObj.upupup;
    }
    var orgValueTotal = 10 * paramObj.now + paramObj.amari;
    var lvUpValueTotal = orgValueTotal + totalUp;
    paramObj.now = Math.floor(lvUpValueTotal / 10);
    paramObj.amari = lvUpValueTotal % 10;
}

// 以下、素のステータス+装備補正を返す。ついでに装備武器名も取得
UnitDefine.prototype.calcBattleStr = function(eqType, eqSyurui) {
    if (eqType != undefined && eqSyurui != undefined) {
        // どちらも指定済みならなにもしない
    } else if (eqType == undefined && eqSyurui == undefined) {
        // どちらかが未指定なら装備品はメンバ変数から取得
        eqType = this.eqType;
        eqSyurui = this.eqSyurui;
    } else {
        // どちらかのみ未指定はエラー
        printWarn('no calcBattleStr eqType:' + eqType + ' eqSyurui:' + eqSyurui);  
    }
    var equip = new ItemDefine();
    ItemDefine.init(eqType, eqSyurui, equip);
    // orgValue:ゲームで使用する値
    // amari:orgValueの小数点1桁(ゲーム内非表示、戦闘では使用しない)
    // up1, up2, up3は÷10した値が実際の成長率で、orgValueとamariに加算される
    return {namae: equip.namae,
           str: this.strObj.now + equip.str,
           mag: this.magObj.now + equip.mag,
           def: this.defObj.now + equip.def,
           mdf: this.mdfObj.now + equip.mdf,
           hit: this.hitObj.now + equip.hit,
           avo: this.avoObj.now + equip.avo,
           rat: this.rat + equip.rat,
           rdf: this.rdf + equip.rdf};
}

UnitDefine.getCharaImg = function(pSyurui) {
    //0雑魚 1ボス 2PC 3NPC
    switch(pSyurui) {
    case BATTLE_PSYURUI_ZAKO:arguments
        if (typeof arguments.callee.zakoImg == 'undefined') {
            arguments.callee.zakoImg = new Image();
            arguments.callee.zakoImg.src = "img/Zako.png";
        }
        return arguments.callee.zakoImg;
    case BATTLE_PSYURUI_PC:arguments
        if (typeof arguments.callee.pcImg == 'undefined') {
            arguments.callee.pcImg = new Image();
            arguments.callee.pcImg.src = "img/PC.png";
        }
        return arguments.callee.pcImg;
    default:arguments
        printWarn('no CharaImg : pSyurui' + pSyurui);  
    return null;
    }
};