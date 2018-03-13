//オブジェクトとしては9×2(敵味方)の18個だけ存在。中身を都度書き換える
var BattleField = function() {
    this.x = 0;// field.jpg上でのX位置
    this.y = 0;// field.jpg上でのY位置
    this.side = 0;
    this.namae = ""//名前
    this.def = 0;//防御効果
    this.weap = 0;//武器レベル
    this.move = 0;//移動コスト
};

BattleField.prototype.init = function(type) {
    this.type = type;
    this.move = 1;// 移動コストは基本1
    switch(type) {
        case BATTLE_FIELD_GLASS:arguments
            this.namae = "草原";
            this.x = 0;
            this.y = 0;
            this.def = 10;
            this.weap = 5;
        break;
        case BATTLE_FIELD_FOREST:arguments
            this.namae = "森　";
            this.x = 64;
            this.y = 0;
            this.def = 20;
            this.weap = 10;
        break;
        case BATTLE_FIELD_ROAD:arguments
            this.namae = "道　";
            this.x = 2 * 64;
            this.y = 0;
            this.def = 0;
            this.weap = 1;
        break;
        case BATTLE_FIELD_TOWN:arguments
            this.namae = "町　";
            this.x = 3 * 64;
            this.y = 0;
            this.def = 15;
            this.weap = 3;
        break;
        case BATTLE_FIELD_SEA:arguments
            this.namae = "海　";
            this.x = 0;
            this.y = 64;
            this.def = 5;
            this.weap = 12;
            this.move = 2;
        break;
        case BATTLE_FIELD_SNOW:arguments
            this.namae = "雪原";
            this.x = 64;
            this.y = 64;
            this.def = 20;
            this.weap = 7;
        break;
        case BATTLE_FIELD_SAND:arguments
            this.namae = "砂地";
            this.x = 2 * 64;
            this.y = 64;
            this.def = 5;
            this.weap = 2;
        break;
        case BATTLE_FIELD_MOUNT:arguments
            this.namae = "山　";
            this.x = 3 * 64;
            this.y = 64;
            this.def = 35;
            this.weap = 8;
            this.move = 2;
        break;
        case BATTLE_FIELD_RIVER:arguments
            this.namae = "川　";
            this.x = 0;
            this.y = 2 * 64;
            this.def = 25;
            this.weap = 16;
        break;
        case BATTLE_FIELD_FARM:arguments
            this.namae = "畑　";
            this.x = 64;
            this.y = 2 * 64;
            this.def = 20;
            this.weap = 9;
        break;
        case BATTLE_FIELD_LAKE:arguments
            this.namae = "湖　";
            this.x = 2 * 64;
            this.y = 2 * 64;
            this.def = 30;
            this.weap = 20;
            this.move = 2;
        break;
        default:arguments
            printWarn('no battleField type:' + type);  
        break;
    }
}

BattleField.prototype.paintMe = function(ctxFlip, x, y) {
    ctxFlip.drawImage(BattleField.getFieldImg(), this.x, this.y, 64, 64, x, y, 64, 64);
};

BattleField.prototype.decorateSide = function(ctxFlip, x, y, color, width) {
    ctxFlip.fillStyle = color;
    ctxFlip.fillRect(x, y, width, 64);
    ctxFlip.fillRect(x + 64 - width, y, width, 64);
};

BattleField.getFieldImg = function() {
    if (typeof arguments.callee.fieldImg == 'undefined') {
        arguments.callee.fieldImg = new Image();
        arguments.callee.fieldImg.src = "../www/img/fields.jpg";
    }
    return arguments.callee.fieldImg;
};

BattleField.getWeaponsImg = function() {
    if (typeof arguments.callee.weaponsImg == 'undefined') {
        arguments.callee.weaponsImg = new Image();
        arguments.callee.weaponsImg.src = "../www/img/weapons.png";
    }
    return arguments.callee.weaponsImg;
};

BattleField.prototype.explainMsg = function() {
    return this.namae + " 防御:" + this.def + " 武コスト:" + this.weap + " 移コスト:" + this.move;
};