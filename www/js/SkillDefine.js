var SkillDefine = function() {
}

// スキル名を返す
SkillDefine.getSkillName = function(skill) {
    switch(skill) {
    case SKILL_HIGHHIT:arguments
        return "高命中";
    case SKILL_HIGHAVO:arguments
        return "高回避";
    case SKILL_KENJITSU:arguments
        return "堅実";
    case SKILL_KEIKAI:arguments
        return "警戒";
    case SKILL_KAMAITACHI:arguments
        return "かまいたち";
    case SKILL_YOROI:arguments
        return "鎧通し";
    case SKILL_KYOEN:arguments
        return "狂宴";
    case SKILL_SYONETSU:arguments
        return "焦熱波";
    case SKILL_AKURO:arguments
        return "悪路踏破";
    case SKILL_TAIEN:arguments
        return "対遠防御";
    case SKILL_KIYOME:arguments
        return "清き祈り";
    case SKILL_POISON:arguments
        return "毒の呪い";
    case SKILL_STUN:arguments
        return "呪縛の闇";
    case SKILL_TAMASHII:arguments
        return "魂削り";
    case SKILL_SURI:arguments
        return "スリ";
    case SKILL_HEDGEHOG:arguments
        return "ハリネズミ";
    case SKILL_THIEF:arguments
        return "盗む";
    case SKILL_GAIKA:arguments
        return "勝利の凱歌";
    case SKILL_GUARD:arguments
        return "最後の防御";
    case SKILL_OTOKO:arguments
        return "男の闘い";
    case SKILL_AKIRA:arguments
        return "諦めないっ";
    case SKILL_SYOKI:arguments
        return "瘴気";
    case SKILL_MANSHIN:arguments
        return "慢心狩り";
    case SKILL_SYOMEN:arguments
        return "正面対決";
    case SKILL_JUKUREN:arguments
        return "武器熟練";
    case SKILL_DEATH:arguments
        return "避けえぬ死";
    case SKILL_JIDOU:arguments
        return "自動回復";
    case SKILL_KOGUN:arguments
        return "孤軍奮闘";
    default:arguments  
        return "";
    }
};

// スキルの説明を返す(スキル名含めて4行まで)
SkillDefine.getMessage = function(skill) {
    var skillTxt = new Array()
    skillTxt.push("【" + SkillDefine.getSkillName(skill) + "】");
    switch(skill) {
    case SKILL_HIGHHIT:arguments
        skillTxt.push("命中率" + SKILL_HIGHHIT_RATE + "%");
        break;
    case SKILL_HIGHAVO:arguments
        skillTxt.push("回避率" + SKILL_HIGHAVO_RATE + "%");
        break;
    case SKILL_KENJITSU:arguments
        skillTxt.push("命中率" + (100 - SKILL_KENJITSU_RATE) + "以上の攻撃を全命中");
        skillTxt.push("命中率" + SKILL_KENJITSU_RATE + "以下の敵の攻撃を全回避");
        break;
    case SKILL_KEIKAI:arguments
        skillTxt.push("敵のクリティカルを防ぐ");
        break;
    case SKILL_KAMAITACHI:arguments
        skillTxt.push("最低限レベル ×" + SKILL_KAMAITACHI_RATE + "ダメージを与える");
        skillTxt.push("(回避もされない)");
        break;
    case SKILL_YOROI:arguments
        skillTxt.push("基本ダメージをレベル ×" + SKILL_YOROI_RATE + "追加");
        break;
    case SKILL_KYOEN:arguments
        skillTxt.push("クリティカル率" + SKILL_KYOEN_RATE + "倍");
        break;
    case SKILL_SYONETSU:arguments
        skillTxt.push("ダメージの" + SKILL_SYONETSU_RATE + "%をターゲット以外の");
        skillTxt.push("敵に与える(トドメ不可)");
        break;
    case SKILL_AKURO:arguments
        skillTxt.push("止まった地形の悪影響を受けない");
        break;
    case SKILL_TAIEN:arguments
        skillTxt.push("HPが2以上あれば");
        skillTxt.push("射程4以上の攻撃で死なない");
        break;
    case SKILL_KIYOME:arguments
        skillTxt.push("敵の毒と麻痺を防ぐ");
        break;
    case SKILL_POISON:arguments
        skillTxt.push("攻撃に毒を付加");
        break;
    case SKILL_STUN:arguments
        skillTxt.push("攻撃に麻痺を付加");
        break;
    case SKILL_TAMASHII:arguments
        var minusPoint = 2;
        skillTxt.push("攻撃ヒット時、気力を" + minusPoint + "奪う");
        break;
    case SKILL_SURI:arguments
        var minusPoint = 3;
        skillTxt.push("攻撃ヒット時、所持金をレベル × " + minusPoint + "奪う");
        break;
    /*case SKILL_HEDGEHOG:arguments
        return "ハリネズミ";*/
    case SKILL_THIEF:arguments
        skillTxt.push((100 * SKILL_THIEF_RATE) + "%以上のオーバーキル時");
        skillTxt.push("敵が所持しているアイテムを盗む");
        break;
    case SKILL_GAIKA:arguments
        skillTxt.push("勝利時、リングのマスター回数が-2");
        break;
    case SKILL_GUARD:arguments
        skillTxt.push("SPゲージが300の場合のみ死亡しない");
        skillTxt.push("(SPゲージは0になる)");
        break;
    case SKILL_OTOKO:arguments
        skillTxt.push("2射程以内の敵への基本ダメージ+" + (100 * SKILL_OTOKO_RATE) + "%");
        skillTxt.push("2射程以内の敵からの基本ダメージ-" + (100 * SKILL_OTOKO_RATE) + "%");
        break;
    case SKILL_AKIRA:arguments
        skillTxt.push("HP減少率に応じて消費SP減少");
        skillTxt.push("(最大-" + (100 * SKILL_AKIRA_RATE) + "%)");
        break;
    case SKILL_SYOKI:arguments
        skillTxt.push("相手の各スキルの消費気力+1");
        break;
    case SKILL_MANSHIN:arguments
        skillTxt.push("気力が全快の敵に基本ダメージ+" + (100 * SKILL_MANSHIN_RATE) + "%");
        break;
    case SKILL_SYOMEN:arguments
        skillTxt.push("正面以外の敵からの基本ダメージを" + (100 * SKILL_SYOMEN_RATE) + "%減");
        break;
    case SKILL_JUKUREN:arguments
        skillTxt.push("武器の命中と威力+" + (100 * SKILL_JUKUREN_RATE) + "%");
        break;
    case SKILL_DEATH:arguments
        skillTxt.push("HP" + (100 * SKILL_DEATH_RATE) + "%未満の敵に攻撃必中");
        break;
    case SKILL_JIDOU:arguments
        skillTxt.push("ターン終了時HPが" + (100 * SKILL_JIDOU_RATE) + "%回復");
        break;
    case SKILL_KOGUN:arguments
        skillTxt.push("敵より人数が少ないとき");
        skillTxt.push("回避ステータスを" + (100 * SKILL_KOGUN_RATE) + "%増");
        break;
    default:arguments  
        break;
    }
    return skillTxt;
}

// スキルの消費気力を返す
SkillDefine.getSkillCost = function(skill) {
    switch(skill) {
    case SKILL_HIGHHIT:arguments
        return 2;
    case SKILL_HIGHAVO:arguments
        return 2;
    case SKILL_KENJITSU:arguments
        return 1;
    case SKILL_KEIKAI:arguments
        return 2;
    case SKILL_KAMAITACHI:arguments
        return 1;
    case SKILL_YOROI:arguments
        return 2;
    case SKILL_KYOEN:arguments
        return 2;
    case SKILL_SYONETSU:arguments
        return 3;
    case SKILL_AKURO:arguments
        return 2;
    case SKILL_TAIEN:arguments
        return 2;
    case SKILL_KIYOME:arguments
        return 3;
    case SKILL_POISON:arguments
        return 0;
    case SKILL_STUN:arguments
        return 0;
    case SKILL_TAMASHII:arguments
        return 0;
    case SKILL_SURI:arguments
        return 0;
    case SKILL_HEDGEHOG:arguments
        return 0;
    case SKILL_THIEF:arguments
        return 2;
    case SKILL_GAIKA:arguments
        return 3;
    case SKILL_GUARD:arguments
        return 1;
    case SKILL_OTOKO:arguments
        return 2;
    case SKILL_AKIRA:arguments
        return 2;
    case SKILL_SYOMEN:arguments
        return 1;
    case SKILL_JUKUREN:arguments
        return 2;
    case SKILL_DEATH:arguments
        return 1;
    case SKILL_KOGUN:arguments
        return 3;
    default:arguments  
        return 0;
    }
};