var ItemDefine = function() {
    this.namae = "テスト武器";
    this.text = "";//効果の補足説明
    this.px = 0;// 絵でのX座標
    this.py = 0;// 絵でのY座標
    this.eqType = 0;
    this.eqSyurui = 0;
    this.lv = 0;//武器レベル
    this.money = 0;//買い値
    this.crt = 0;
    this.rat = 0;//割合ダメージ
    this.rdf = 0;//割合軽減
    this.regPoison = 0;//毒耐性
    this.regStun = 0;//麻痺耐性
    this.range = 2;//射程(2:素手 3:短距離武器 4:中距離武器 5:長距離武器)
    this.str = 0;
    this.mag = 0;
    this.def = 0;
    this.mdf = 0;
    this.hit = 0;
    this.avo = 0;
};

ItemDefine.init = function(eqType, eqSyurui, idef) {
    if (eqSyurui >= ITEM_SYURUI_MAX) {
        printWarn('exceed ItemMax eqType;' + eqType + ' eqSyurui:' + eqSyurui);
    }
    switch(eqType) {
    case ITEM_TYPE_SWORD:arguments
        idef.range = 2;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "大量生産の剣";
                idef.price = 130;
                idef.lv = 1;
                idef.str = 5;
                idef.hit = 11;
            break;
            case 1:arguments
                idef.namae = "中級剣";
                idef.price = 400;
                idef.lv = 7;
                idef.str = 9;
                idef.hit = 24;
                idef.rat = 1;
            break;
            case 2:arguments
                idef.namae = "純金製高級剣";
                idef.price = 890;
                idef.lv = 16;
                idef.str = 18;
                idef.hit = 40;
                idef.rat = 2;
            break;
            case 3:arguments
                idef.namae = "純ダイヤ製特級剣";
                idef.price = 1950;
                idef.lv = 30;
                idef.str = 31;
                idef.hit = 54;
                idef.rat = 3;
            break;
        }
        break;
    case ITEM_TYPE_SPEAR:arguments
        idef.range = 3;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "大量生産の槍";
                idef.price = 160;
                idef.lv = 1;
                idef.str = 9;
                idef.hit = 3;
            break;
            case 1:arguments
                idef.namae = "戦士の槍";
                idef.price = 470;
                idef.lv = 9;
                idef.str = 21;
                idef.hit = 8;
            break;
            case 2:arguments
                idef.namae = "良質の槍";
                idef.price = 770;
                idef.lv = 27;
                idef.str = 30;
                idef.hit = 9;
                idef.rat = 2;
            break;
            case 3:arguments
                idef.namae = "秘伝製法の槍";
                idef.price = 2460;
                idef.lv = 33;
                idef.str = 46;
                idef.hit = 15;
                idef.rat = 3;
            break;
        }
        break;
    case ITEM_TYPE_HAMMER:arguments
        idef.range = 2;
        idef.text = "敵の防御力を無視";
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "大量生産の槌";
                idef.price = 90;
                idef.lv = 1;
            break;
            case 1:arguments
                idef.namae = "ビッグクラブ";
                idef.price = 340;
                idef.lv = 6;
                idef.str = 4;
                idef.hit = 4;
            break;
            case 2:arguments
                idef.namae = "ウォーハンマー";
                idef.price = 750;
                idef.lv = 22;
                idef.str = 7;
                idef.hit = 11;
            break;
            case 3:arguments
                idef.namae = "匠の槌";
                idef.price = 1780;
                idef.lv = 34;
                idef.str = 12;
                idef.hit = 15;
                idef.rat = 1;
            break;
        }
        break;
    case ITEM_TYPE_BOW:arguments
        idef.range = 4;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "大量生産の弓";
                idef.price = 160;
                idef.lv = 1;
                idef.str = 2;
            break;
            case 1:arguments
                idef.namae = "クロスボウ";
                idef.price = 440;
                idef.lv = 7;
                idef.str = 12;
            break;
            case 2:arguments
                idef.namae = "大弓";
                idef.price = 920;
                idef.lv = 19;
                idef.str = 26;
            break;
            case 3:arguments
                idef.namae = "特注弓";
                idef.price = 2000;
                idef.lv = 36;
                idef.str = 36;
                idef.rat = 4;
            break;
        }
        break;
    case ITEM_TYPE_KNIFE:arguments
        idef.range = 2;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "大量生産の短剣";
                idef.price = 130;
                idef.lv = 1;
                idef.hit = 5;
                idef.rat = 4;
            break;
            case 1:arguments
                idef.namae = "裏社会の匕首";
                idef.price = 390;
                idef.lv = 8;
                idef.str = 3;
                idef.hit = 12;
                idef.rat = 5;
            break;
            case 2:arguments
                idef.namae = "仕込み杖";
                idef.price = 1000;
                idef.lv = 18;
                idef.str = 12;
                idef.hit = 21;
                idef.rat = 7;
            break;
            case 3:arguments
                idef.namae = "秘毒のナイフ";
                idef.text = "敵使用時毒スキル付加";
                idef.price = 1800;
                idef.lv = 26;
                idef.str = 21;
                idef.hit = 28;
                idef.rat = 8;
            break;
        }
        break;
    case ITEM_TYPE_PUNCH:arguments
        idef.range = 2;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "大量生産の手袋";
                idef.price = 190;
                idef.lv = 1;
                idef.str = 13;
            break;
            case 1:arguments
                idef.namae = "闘士のバンド";
                idef.price = 500;
                idef.lv = 10;
                idef.str = 27;
                idef.hit = 1;
            break;
            case 2:arguments
                idef.namae = "炎のグローブ";
                idef.price = 1130;
                idef.lv = 22;
                idef.str = 43;
                idef.hit = 6;
            break;
            case 3:arguments
                idef.namae = "熱血の手甲";
                idef.price = 1800;
                idef.lv = 33;
                idef.str = 60;
                idef.hit = 14;
            break;
        }
        break;
    case ITEM_TYPE_SHIELD:arguments
        idef.range = 2;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "大量生産の盾";
                idef.price = 200;
                idef.lv = 1;
                idef.def = 7;
            break;
            case 1:arguments
                idef.namae = "青銅の盾";
                idef.price = 490;
                idef.lv = 7;
                idef.def = 15;
                idef.mdf = 2;
                idef.rdf = 1;
            break;
            case 2:arguments
                idef.namae = "金剛の盾";
                idef.price = 1070;
                idef.lv = 21;
                idef.def = 21;
                idef.mdf = 12;
                idef.rdf = 2;
            break;
            case 3:arguments
                idef.namae = "巌の盾";
                idef.price = 2110;
                idef.lv = 31;
                idef.def = 38;
                idef.mdf = 22;
                idef.rdf = 4;
            break;
        }
        break;
    case ITEM_TYPE_FIRE:arguments
        idef.range = 4;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "火の練習帳";
                idef.price = 200;
                idef.lv = 1;
                idef.mat = 8;
            break;
            case 1:arguments
                idef.namae = "赤のオーブ";
                idef.price = 700;
                idef.lv = 9;
                idef.mat = 22;
            break;
            case 2:arguments
                idef.namae = "紅のオーブ";
                idef.price = 1460;
                idef.lv = 20;
                idef.mat = 39;
                idef.rat = 2;
            break;
            case 3:arguments
                idef.namae = "朱のオーブ";
                idef.price = 2840;
                idef.lv = 30;
                idef.mat = 58;
                idef.rat = 3;
            break;
        }
        break;
    case ITEM_TYPE_WATER:arguments
        idef.range = 4;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "水の練習帳";
                idef.price = 260;
                idef.lv = 1;
                idef.mat = 4;
                idef.hit = 3;
            break;
            case 1:arguments
                idef.namae = "豪雨の書";
                idef.price = 800;
                idef.lv = 11;
                idef.mat = 11;
                idef.hit = 11;
            break;
            case 2:arguments
                idef.namae = "渦潮の書";
                idef.price = 1530;
                idef.lv = 22;
                idef.mat = 25;
                idef.hit = 21;
                idef.rat = 1;
            break;
            case 3:arguments
                idef.namae = "清水の書";
                idef.price = 3000;
                idef.lv = 32;
                idef.mat = 39;
                idef.hit = 29;
                idef.rat = 1;
                idef.mdf = 10;
            break;
        }
        break;
    case ITEM_TYPE_WIND:arguments
        idef.range = 4;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "風の練習帳";
                idef.price = 170;
                idef.lv = 1;
                idef.mat = 1;
                idef.hit = 10;
            break;
            case 1:arguments
                idef.namae = "木枯らしの杖";
                idef.price = 630;
                idef.lv = 6;
                idef.mat = 8;
                idef.hit = 23;
            break;
            case 2:arguments
                idef.namae = "吹き荒れる杖";
                idef.price = 1280;
                idef.lv = 20;
                idef.mat = 20;
                idef.hit = 37;
                idef.rat = 1;
            break;
            case 3:arguments
                idef.namae = "嵐の杖";
                idef.price = 2680;
                idef.lv = 28;
                idef.mat = 35;
                idef.hit = 55;
                idef.rat = 2;
            break;
        }
        break;
    case ITEM_TYPE_EARTH:arguments
        idef.range = 4;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "地の練習帳";
                idef.price = 180;
                idef.lv = 1;
                idef.mat = 5;
                idef.mdf = 6;
            break;
            case 1:arguments
                idef.namae = "地の入門帳";
                idef.price = 610;
                idef.lv = 7;
                idef.mat = 14;
                idef.mdf = 18;
                idef.rdf = 1;
            break;
            case 2:arguments
                idef.namae = "地の本番帳";
                idef.price = 1350;
                idef.lv = 23;
                idef.mat = 25;
                idef.def = 6;
                idef.mdf = 22;
                idef.rdf = 2;
            break;
            case 3:arguments
                idef.namae = "地の決戦帳";
                idef.price = 2560;
                idef.lv = 34;
                idef.mat = 37;
                idef.def = 20;
                idef.mdf = 33;
                idef.rdf = 3;
            break;
        }
        break;
    case ITEM_TYPE_DOGU:arguments
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "体力の紅茶";
                idef.text = "1人のHPを全回復する";
                idef.price = 180;
            break;
            case 1:arguments
                idef.namae = "気力の香水";
                idef.text = "1人の気力を全回復する";
                idef.price = 180;
            break;
            case 2:arguments
                idef.namae = "新薬「慈愛」";
                idef.text = "全員のHPを全回復する";
                idef.price = 180;
            break;
            case 3:arguments
                idef.namae = "劇薬「無尽活力」";
                idef.text = "全員の気力を全回復する";
                idef.price = 180;
            break;
        }
        break;
    case ITEM_TYPE_SUDE:arguments
        idef.range = 1;
        switch(eqSyurui) {
            case 0:arguments
                idef.namae = "素手";
                idef.price = 0;
                idef.lv = 0;
            break;
        }
        break;
    }
};

// [X座標、Y座標]の配列で返す
ItemDefine.getItemXY = function(eqType) {
    switch(eqType) {
    case ITEM_TYPE_SWORD:arguments
        return [0, 0];
    case ITEM_TYPE_SPEAR:arguments
        return [64, 0];
    case ITEM_TYPE_HAMMER:arguments
        return [128, 0];
    case ITEM_TYPE_BOW:arguments
        return [192, 0];
    case ITEM_TYPE_KNIFE:arguments
        return [0, 64];
    case ITEM_TYPE_PUNCH:arguments
        return [64, 64];
    case ITEM_TYPE_SHIELD:arguments
        return [128, 64];
    case ITEM_TYPE_FIRE:arguments
        return [0, 128];
    case ITEM_TYPE_WATER:arguments
        return [64, 128];
    case ITEM_TYPE_WIND:arguments
        return [128, 128];
    case ITEM_TYPE_EARTH:arguments
        return [192, 128];
    case ITEM_TYPE_DOGU:arguments
        return [64, 192];
    default:arguments  
        return [0, 192];
    }
};

ItemDefine.getItemText = function(eqType) {
    switch(eqType) {
    case ITEM_TYPE_SWORD:arguments
        return "剣";
    case ITEM_TYPE_SPEAR:arguments
        return "槍";
    case ITEM_TYPE_HAMMER:arguments
        return "槌";
    case ITEM_TYPE_BOW:arguments
        return "弓";
    case ITEM_TYPE_KNIFE:arguments
        return "短剣";
    case ITEM_TYPE_PUNCH:arguments
        return "拳";
    case ITEM_TYPE_SHIELD:arguments
        return "盾";
    case ITEM_TYPE_FIRE:arguments
        return "炎";
    case ITEM_TYPE_WATER:arguments
        return "水";
    case ITEM_TYPE_WIND:arguments
        return "風";
    case ITEM_TYPE_EARTH:arguments
        return "地";
    case ITEM_TYPE_DOGU:arguments
        return "道具";
    default:arguments  
        return [0, 192];
    }
};

// 指定種類の中で、保持しているi番目の武器はなにか?(スタートは0)
ItemDefine.getReverseItemIndex = function(itemMap, eqType, idx) {
    var retEqSyurui = -1;
    var tempIndex = -1;
    for (var i = 0; i < ITEM_SYURUI_MAX; i++) {
        var tempItem = new ItemDefine();
        ItemDefine.init(eqType, i, tempItem);
        var tempItemNum = itemMap.get(tempItem.namae);
                
        if (tempItemNum == null) {
            // 以降、定義されたアイテムなし
            break;
        } else if (tempItemNum.allNum == 0) {
            // このアイテムは持っていない
            continue;
        } else {
            tempIndex++;
            if (idx == tempIndex) {
                retEqSyurui = i;
            }
        }
    }
    return retEqSyurui;// -1の場合「見つからなかった」
}