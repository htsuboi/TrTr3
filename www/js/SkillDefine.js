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
    default:arguments  
        return "";
    }
};

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
    default:arguments  
        return 0;
    }
};