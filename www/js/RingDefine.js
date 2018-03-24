var RingDefine = function() {
    this.id = -1;
    this.unitNamae = "";//装備ユニット名(""なら「誰も装備していない」)
    this.unitRemain = 0;//あと何回でマスターするか
    this.masterUnit = new Array();// マスター済みユニットの名前が入る
};

RingDefine.prototype.init = function(ringId) {
    this.id = ringId;
}

// リング名を返す
RingDefine.getRingName = function(ringId) {
    switch(ringId) {
    case RING_KIRYOKU:arguments
        return "気力のリング";
    case RING_ECO:arguments
        return "エコリング";
    case RING_TAISEI:arguments
        return "耐性のリング";
    case RING_RECOVER:arguments
        return "回復のリング";
    case RING_JUKUREN:arguments
        return "熟練のリング";
    case RING_ATTACK:arguments
        return "攻撃のリング";
    case RING_DEFENCE:arguments
        return "防御のリング";
    default:arguments  
        return "";
    }
};

// 装備時の効果(コールされると素ステに修正がかかるので、2回以上コールしてはいけない)
RingDefine.apply = function(ringId, u) {
    var aptitude = this.getRingAptitude(u, ringId);
    switch(ringId) {
    case RING_KIRYOKU:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                u.msp += 7;
                break;
            case 0:arguments//普通
                u.msp += 4;
                break;
            case -1:arguments//相性悪
                u.msp += 2;
                break;
        }
        break;
    case RING_ECO:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                u.m1Cost -= 15;
                u.m2Cost -= 15;
                u.rangeCost -= 15;
                u.exAtCost -= 15;
                break;
            case 0:arguments//普通
                u.m1Cost -= 7;
                u.m2Cost -= 7;
                u.rangeCost -= 7;
                u.exAtCost -= 7;
                break;
            case -1:arguments//相性悪
                u.m1Cost -= 3;
                u.m2Cost -= 3;
                u.rangeCost -= 3;
                u.exAtCost -= 3;
                break;
        }
        break;
    case RING_TAISEI:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                u.regPoison += 25;
                u.regStun += 25;
                break;
            case 0:arguments//普通
                u.regPoison += 15;
                u.regStun += 15;
                break;
            case -1:arguments//相性悪
                u.regPoison += 10;
                u.regStun += 10;
                break;
        }
        u.regPoison = Math.min(100, u.regPoison);
        u.regStun = Math.min(100, u.regStun);
        break;
    case RING_RECOVER:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                u.recoverRate += 0.2;
                break;
            case 0:arguments//普通
                u.recoverRate += 0.12;
                break;
            case -1:arguments//相性悪
                u.recoverRate += 0.07;
                break;
        }
        break;
    case RING_JUKUREN:arguments
        var addPoint = 0;
        switch(aptitude) {
            case 1:arguments//好相性
                addPoint = 20;
                break;
            case 0:arguments//普通
                addPoint = 10;
                break;
            case -1:arguments//相性悪
                addPoint = 5;
                break;
        }
        for (var i = ITEM_TYPE_SWORD; i <= ITEM_TYPE_EARTH; i++) {
            if (u.getItemIndex(i) >= 0) {
                u.weaps[i] += addPoint;
            }
        }
        break;
    case RING_ATTACK:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                u.rat += 4;
                break;
            case 0:arguments//普通
                u.rat += 2;
                break;
            case -1:arguments//相性悪
                u.rat += 1;
                break;
        }
        break;
    case RING_DEFENCE:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                u.rdf += 4;
                break;
            case 0:arguments//普通
                u.rdf += 2;
                break;
            case -1:arguments//相性悪
                u.rdf += 1;
                break;
        }
        break;
    }
}

// 装備時の説明
RingDefine.getSetsumei = function(ringId, aptitude, message) {
    switch(ringId) {
    case RING_KIRYOKU:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                message.push("最大気力+7");
                break;
            case 0:arguments//普通
                message.push("最大気力+4");
                break;
            case -1:arguments//相性悪
                message.push("最大気力+2");
                break;
        }
        break;
    case RING_ECO:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                message.push("各コスト-15");
                break;
            case 0:arguments//普通
                message.push("各コスト-7");
                break;
            case -1:arguments//相性悪
                message.push("各コスト-3");
                break;
        }
        break;
    case RING_TAISEI:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                message.push("各耐性+25");
                break;
            case 0:arguments//普通
                message.push("各耐性+15");
                break;
            case -1:arguments//相性悪
                message.push("各耐性+10");
                break;
        }
        break;
    case RING_RECOVER:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                message.push("ターン終了時回復割合+20%");
                break;
            case 0:arguments//普通
                message.push("ターン終了時回復割合+12%");
                break;
            case -1:arguments//相性悪
                message.push("ターン終了時回復割合+7%");
                break;
        }
        break;
    case RING_JUKUREN:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                message.push("装備可能武器の得意レベル+20");
                break;
            case 0:arguments//普通
                message.push("装備可能武器の得意レベル+10");
                break;
            case -1:arguments//相性悪
                message.push("装備可能武器の得意レベル+5");
                break;
        }
        break;
    case RING_ATTACK:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                message.push("割合ダメージ+4%");
                break;
            case 0:arguments//普通
                message.push("割合ダメージ+2%");
                break;
            case -1:arguments//相性悪
                message.push("割合ダメージ+1%");
                break;
        }
        break;
    case RING_DEFENCE:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                message.push("割合軽減+4%");
                break;
            case 0:arguments//普通
                message.push("割合軽減+2%");
                break;
            case -1:arguments//相性悪
                message.push("割合軽減+1%");
                break;
        }
        break;
    }
}

// マスターまでの回数
RingDefine.getMasterCount = function(ringId, aptitude) {
    switch(ringId) {
    case RING_KIRYOKU:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                return 5;
            case 0:arguments//普通
                return 4;
            case -1:arguments//相性悪
                return 3;
        }
    case RING_ECO:arguments
    case RING_RECOVER:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                return 6;
            case 0:arguments//普通
                return 5;
            case -1:arguments//相性悪
                return 4;
        }
    case RING_JUKUREN:arguments
    case RING_ATTACK:arguments
    case RING_DEFENCE:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                return 3;
            case 0:arguments//普通
                return 2;
            case -1:arguments//相性悪
                return 1;
        }
    default:arguments
        switch(aptitude) {
            case 1:arguments//好相性
                return 4;
            case 0:arguments//普通
                return 3;
            case -1:arguments//相性悪
                return 2;
        }
    }
}

// 好相性なら1 悪相性なら-1 それ以外なら0
RingDefine.getRingAptitude = function(unit, ringId) {
    if (unit.goodRing.indexOf(ringId) != -1) {
        return 1;
    }
    else if (unit.badRing.indexOf(ringId) != -1) {
        return -1;
    }
    return 0;
}

// 装備しているリングを返す。装備していなければnull
RingDefine.getEquipRing = function(unit, ev) {
    for (var i = 0; i < ev.haveRing.length; i++) {
        var tempRing = ev.haveRing[i];
        if (unit.namae == tempRing.unitNamae) {
            return tempRing;
        }
    }
    return null;
}

// そのリングをマスターしていればtrue
RingDefine.isRingMaster = function(unit, ring) {
    if (ring.masterUnit.indexOf(unit.namae) != -1) {
        return true;
    }
    return false;
}