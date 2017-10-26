var GAMEMODE_TITLE = 0;
var GAMEMODE_GAMEOVER = 1;
var GAMEMODE_BATTLE = 2;

var GAME_DIFFICULTY_NORMAL = 0;
var GAME_DIFFICULTY_HARD = 1;
var GAME_DIFFICULTY_EXPERT = 2;

var TITLEVIEW_NEWGAME_X = 80;
var TITLEVIEW_NEWGAME_Y = 100;
var TITLEVIEW_NEWGAME_WIDTH = 200;
var TITLEVIEW_NEWGAME_HEIGHT = 50;

var TITLEVIEW_CONTGAME_X = 80;
var TITLEVIEW_CONTGAME_Y = 300;
var TITLEVIEW_CONTGAME_WIDTH = 200;
var TITLEVIEW_CONTGAME_HEIGHT = 50;

var BATTLE_MIKATA = 0;
var BATTLE_TEKI = 1;
var BATTLE_OFFENCE = 0;
var BATTLE_DEFENCE = 1;

var BATTLE_SPGAUGE_MAX = 300;

//0雑魚 1ボス 2PC 3NPC
var BATTLE_PSYURUI_ZAKO = 0;
var BATTLE_PSYURUI_BOSS = 1;
var BATTLE_PSYURUI_PC = 2;
var BATTLE_PSYURUI_NPC = 3;

var BATTLE_FIELD_GLASS = 'a';
var BATTLE_FIELD_FOREST = 'b';
var BATTLE_FIELD_ROAD = 'c';
var BATTLE_FIELD_TOWN = 'd';
var BATTLE_FIELD_SEA = 'e';
var BATTLE_FIELD_SNOW = 'f';
var BATTLE_FIELD_SAND = 'g';
var BATTLE_FIELD_MOUNT = 'h';
var BATTLE_FIELD_RIVER = 'i';
var BATTLE_FIELD_FARM = 'j';
var BATTLE_FIELD_LAKE = 'k';

// 味方のマス左上
var BATTLEVIEW_MIKATA_X = 50;
var BATTLEVIEW_MIKATA_Y = 215;
// 敵のマス左上
var BATTLEVIEW_TEKI_X = 160;
var BATTLEVIEW_TEKI_Y = 15;
// 1マスのサイズ
var BATTLEVIEW_SIZE = 66;
// フィールド説明左上
var BATTLEVIEW_FIELDTXT_X = 10;
var BATTLEVIEW_FIELDTXT_Y = 420;
var BATTLEVIEW_FIELDTXT_W = 200;
var BATTLEVIEW_FIELDTXT_H = 50;
// ユニット説明左上
var BATTLEVIEW_UNITTXT_X = 250;
var BATTLEVIEW_UNITTXT_Y = 215;
var BATTLEVIEW_UNITTXT_W = 110;
var BATTLEVIEW_UNITTXT_H = 370;
// 戦闘説明左上
var BATTLEVIEW_BATTLETXT_X = 10;
var BATTLEVIEW_BATTLETXT_Y = 520;
var BATTLEVIEW_BATTLETXT_W = 200;
var BATTLEVIEW_BATTLETXT_H = 120;
// SPゲージ左上
var BATTLEVIEW_SPGAUGE_X = 5;
var BATTLEVIEW_SPGAUGE_Y = 175;
var BATTLEVIEW_SPGAUGE_W = 140;
var BATTLEVIEW_SPGAUGE_H = 30;

//各コマンドボタン
var BATTLEVIEW_COMMANDTXT_W = 40;
var BATTLEVIEW_COMMANDTXT_H = 35;
var BATTLEVIEW_COMMANDTXT_X = 2;
var BATTLEVIEW_COMMANDTXT_Y = BATTLEVIEW_MIKATA_Y - 5;
var BATTLEVIEW_COMMANDINTERVAL = 42;
// 武器選択画面
var BATTLEVIEW_WEAPTYPE_X = 210;
var BATTLEVIEW_WEAPTYPE_W = 35;
var BATTLEVIEW_WEAPTYPE_H = 25;
var BATTLEVIEW_WEAP_X = 250;
var BATTLEVIEW_WEAP_Y = 15;
var BATTLEVIEW_WEAP_W = 120;
var BATTLEVIEW_WEAP_H = 200;
var BATTLEVIEW_WEAP_INTERVAL = 30;

// 戦闘画面の状態
// 手番最初の移動前
var BATTLEVIEW_STATE_FIRSTMOVE = 0;
// 手番最初の移動後、行動前
var BATTLEVIEW_STATE_ACTE = 1;
// 行動後、移動前
var BATTLEVIEW_STATE_SECONDMOVE = 2;

var BATTLEVIEW_COMSTATE_PRECHOICE = 0;
var BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE = 10;
var BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE = 11;
var BATTLEVIEW_COMSTATE_MOVE = 20;
var BATTLEVIEW_COMSTATE_RUN = 30;
var BATTLEVIEW_COMSTATE_WAIT = 40;
var BATTLEVIEW_COMSTATE_CHANGE = 50;


var BATTLEVIEW_UNITPAINT_X = 10;
var BATTLEVIEW_UNITPAINT_Y = 10;

// 「手持ち武器」を表示すべき時を明示するため使用　特定の武器タイプを表現する意味ではない
var ITEM_TYPE_TEMOCHI = 0;

var ITEM_TYPE_SWORD = 1;
var ITEM_SYURUI_SWORD1 = 1;
var ITEM_SYURUI_SWORD2 = 2;
var ITEM_SYURUI_SWORD3 = 3;
var ITEM_SYURUI_SWORD4 = 4;

var ITEM_TYPE_SPEAR = 2;
var ITEM_SYURUI_SPEAR1 = 1;
var ITEM_SYURUI_SPEAR2 = 2;
var ITEM_SYURUI_SPEAR3 = 3;
var ITEM_SYURUI_SPEAR4 = 4;

var ITEM_TYPE_BOW = 3;
var ITEM_SYURUI_BOW1 = 1;
var ITEM_SYURUI_BOW2 = 2;
var ITEM_SYURUI_BOW3 = 3;
var ITEM_SYURUI_BOW4 = 4;

var ITEM_TYPE_HAMMER = 4;
var ITEM_SYURUI_HAMMER1 = 1;
var ITEM_SYURUI_HAMMER2 = 2;
var ITEM_SYURUI_HAMMER3 = 3;
var ITEM_SYURUI_HAMMER4 = 4;

var ITEM_TYPE_KNIFE = 5;
var ITEM_SYURUI_KNIFE1 = 1;
var ITEM_SYURUI_KNIFE2 = 2;
var ITEM_SYURUI_KNIFE3 = 3;
var ITEM_SYURUI_KNIFE4 = 4;

var ITEM_TYPE_PUNCH = 6;
var ITEM_SYURUI_PUNCH1 = 1;
var ITEM_SYURUI_PUNCH2 = 2;
var ITEM_SYURUI_PUNCH3 = 3;
var ITEM_SYURUI_PUNCH4 = 4;

var ITEM_TYPE_SHIELD = 7;
var ITEM_SYURUI_SHIELD1 = 1;
var ITEM_SYURUI_SHIELD2 = 2;
var ITEM_SYURUI_SHIELD3 = 3;
var ITEM_SYURUI_SHIELD4 = 4;

var ITEM_TYPE_FIRE = 8;
var ITEM_SYURUI_FIRE1 = 1;
var ITEM_SYURUI_FIRE2 = 2;
var ITEM_SYURUI_FIRE3 = 3;
var ITEM_SYURUI_FIRE4 = 4;

var ITEM_TYPE_WIND = 9;
var ITEM_SYURUI_WIND1 = 1;
var ITEM_SYURUI_WIND2 = 2;
var ITEM_SYURUI_WIND3 = 3;
var ITEM_SYURUI_WIND4 = 4;

var ITEM_TYPE_WATER = 10;
var ITEM_SYURUI_WATER1 = 1;
var ITEM_SYURUI_WATER2 = 2;
var ITEM_SYURUI_WATER3 = 3;
var ITEM_SYURUI_WATER4 = 4;

var ITEM_TYPE_EARTH = 11;
var ITEM_TYPE_EARTH1 = 1;
var ITEM_TYPE_EARTH2 = 2;
var ITEM_TYPE_EARTH3 = 3;
var ITEM_TYPE_EARTH4 = 4;

var ITEM_TYPE_DOGU = 12;
var ITEM_SYURUI_DOGU1 = 1;
var ITEM_SYURUI_DOGU2 = 2;
var ITEM_SYURUI_DOGU3 = 3;
var ITEM_SYURUI_DOGU4 = 4;

// Type:99 Syurui:0は「素手」
var ITEM_TYPE_SUDE = 99;

var ITEM_EQMAX = 5;//1キャラが装備可能な種類最大値

// 表示などの都合上、1属性の武器、アイテムの種類はこの数字まで
var ITEM_SYURUI_MAX = 8;
// 雑魚
var UNIT_SYURUI_SWORD = 1;
var UNIT_NAMAE_SWORD = "剣兵";
var UNIT_SYURUI_SPEAR = 2;
var UNIT_NAMAE_SPEAR = "槍兵";
var UNIT_SYURUI_BOW = 3;
var UNIT_NAMAE_BOW = "弓兵";
var UNIT_SYURUI_HAMMER = 4;
var UNIT_NAMAE_HAMMER = "槌兵";
var UNIT_SYURUI_KNIFE = 5;
var UNIT_NAMAE_KNIFE = "暗殺兵";
var UNIT_SYURUI_PUNCH = 6;
var UNIT_NAMAE_PUNCH = "格闘兵";
var UNIT_SYURUI_SHIELD = 7;
var UNIT_NAMAE_SHIELD = "重装兵";
var UNIT_SYURUI_MAGIC = 8;
var UNIT_NAMAE_MAGIC = "魔兵";
var UNIT_SYURUI_SPEED = 9;
var UNIT_NAMAE_SPEED = "高機動兵";
var UNIT_SYURUI_SNIPE = 10;
var UNIT_NAMAE_SNIPE = "狙撃兵";
var UNIT_SYURUI_POISON = 11;
var UNIT_NAMAE_POISON = "毒兵";
var UNIT_SYURUI_STUN = 12;
var UNIT_NAMAE_SRUN = "麻痺兵";
var UNIT_SYURUI_JMAGIC = 13;
var UNIT_NAMAE_JMAGIC = "上級魔兵";
var UNIT_SYURUI_SHIKI = 14;
var UNIT_NAMAE_SHIKI = "指揮官兵";
// PC
var UNIT_SYURUI_PRINCESS = 20;
var UNIT_NAMAE_PRINCESS = "ヤナエ";
var UNIT_SYURUI_KNIGHT = 21;
var UNIT_NAMAE_KNIGHT = "サキス";
var UNIT_SYURUI_MUSCLE = 22;
var UNIT_NAMAE_MUSCLE = "ボアード";
var UNIT_SYURUI_TATEO = 23;//盾男
var UNIT_NAMAE_TATEO = "ダフラン";
var UNIT_SYURUI_JC = 24;
var UNIT_NAMAE_JC = "アリィ";
var UNIT_SYURUI_FIGHTER = 25;
var UNIT_NAMAE_FIGHTER = "ゼセル";
var UNIT_SYURUI_GAKUSYA = 26;
var UNIT_NAMAE_GAKUSYA = "エルフレン";
var UNIT_SYURUI_THIEF = 27;
var UNIT_NAMAE_THIEF = "レイガ";
var UNIT_SYURUI_SHIACYAN = 28;
var UNIT_NAMAE_SHIACYAN = "シーア";
var UNIT_SYURUI_MAJYO = 29;
var UNIT_NAMAE_MAJYO = "ミナタ";
var UNIT_SYURUI_KAGE = 30;
var UNIT_NAMAE_KAGE = "デルグ";

// このレベルを超えると成長率が上がる
var UNIT_LVUP_EXLV1 = 10;
var UNIT_LVUP_EXLV2 = 20;

// 1LvUpごとの取得経験値/必要経験値の増加率
var UNIT_LVUP_EX = 1.4;
// どこからでも使用できるようここに記述
var printWarn = function(msg) {
    alert(msg);
}

// 汎用 だんだん明るさが変わる演出用
var getGladColor = function(count) {
    // amari:0～9
    var amari = Math.floor(count) % 10;
    // peakDistance:0～5
    var peakDistance = Math.abs(amari - 5);
    switch(peakDistance) {
        case 0:arguments
            return 'rgb(223, 223, 223)';
        break;
        case 1:arguments
            return 'rgb(207, 207, 207)';
        break;
        case 2:arguments
            return 'rgb(191, 191, 191)';
        break;
        case 3:arguments
            return 'rgb(175, 175, 175)';
        break;
        case 4:arguments
            return 'rgb(159, 159, 159)';
        break;
        case 5:arguments
            return 'rgb(143, 143, 143)';
        break;
        default:arguments
            printWarn('no GladColor peakDistance:' + peakDistance);  
        break;
    }
}

var getGladColorBlue = function(count) {
    // amari:0～9
    var amari = Math.floor(count) % 10;
    // peakDistance:0～5
    var peakDistance = Math.abs(amari - 5);
    switch(peakDistance) {
        case 0:arguments
            return 'rgb(191, 223, 239)';
        break;
        case 1:arguments
            return 'rgb(175, 207, 223)';
        break;
        case 2:arguments
            return 'rgb(159, 191, 207)';
        break;
        case 3:arguments
            return 'rgb(143, 175, 191)';
        break;
        case 4:arguments
            return 'rgb(127, 159, 175)';
        break;
        case 5:arguments
            return 'rgb(111, 143, 159)';
        break;
        default:arguments
            printWarn('no GladColor peakDistance:' + peakDistance);  
        break;
    }
}

var getGladColorRed = function(count) {
    // amari:0～9
    var amari = Math.floor(count) % 10;
    // peakDistance:0～5
    var peakDistance = Math.abs(amari - 5);
    switch(peakDistance) {
        case 0:arguments
            return 'rgb(239, 223, 191)';
        break;
        case 1:arguments
            return 'rgb(223, 207, 175)';
        break;
        case 2:arguments
            return 'rgb(207, 191, 159)';
        break;
        case 3:arguments
            return 'rgb(191, 175, 143)';
        break;
        case 4:arguments
            return 'rgb(175, 159, 127)';
        break;
        case 5:arguments
            return 'rgb(159, 143, 111)';
        break;
        default:arguments
            printWarn('no GladColor peakDistance:' + peakDistance);  
        break;
    }
}