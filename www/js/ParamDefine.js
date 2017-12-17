var GAMEMODE_TITLE = 0;
var GAMEMODE_GAMEOVER = 1;
var GAMEMODE_BATTLE = 2;
var GAMEMODE_EVENT = 3;

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

var BATTLE_SPGAUGE_CHARGE = 100;
var BATTLE_SPGAUGE_MAX = 300;

// 攻撃時にメッセージ表示する総時間
var BATTLE_BATTLEMSG_MAX = 100;
// 攻撃時に2文目メッセージを表示する時間
var BATTLE_BATTLEMSG_SECOND = 70;
// 攻撃時に3文目メッセージを表示する時間
var BATTLE_BATTLEMSG_THIRD = 40;

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

// ユニット選択
var BATTLEVIEW_UNITSELECT_X = 7;
var BATTLEVIEW_UNITSELECT_Y = 10;
var BATTLEVIEW_UNITSELECT_W = 70;
var BATTLEVIEW_UNITSELECT_H = 18;
var BATTLEVIEW_UNITSELECT_WINTERVAL = 5;
var BATTLEVIEW_UNITSELECT_HINTERVAL = 10;

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
var BATTLEVIEW_UNITTXT_H = 390;
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
var BATTLEVIEW_TURN_MIKATA = 0;
var BATTLEVIEW_TURN_TEKI = 1;
var BATTLEVIEW_TURN_INITIAL = 2;
var BATTLEVIEW_TURN_UNITSELECT = 3;
var BATTLEVIEW_TURN_SKILLSELECT = 4;
var BATTLEVIEW_TURN_WINBATTLE = 5;
var BATTLEVIEW_TURN_LOSEBATTLE = 6;

// 手番最初の移動前
var BATTLEVIEW_STATE_FIRSTMOVE = 0;
// 手番最初の移動後、行動前
var BATTLEVIEW_STATE_ACTSTART = 1;
// 行動後、移動前
var BATTLEVIEW_STATE_SECONDMOVE = 2;

var BATTLEVIEW_COMSTATE_PRECHOICE = 0;
var BATTLEVIEW_COMSTATE_ACT_WEAPCHOICE = 10;
var BATTLEVIEW_COMSTATE_ACT_TARGETCHOICE = 11;
var BATTLEVIEW_COMSTATE_MOVE = 20;
var BATTLEVIEW_COMSTATE_RUN = 30;
var BATTLEVIEW_COMSTATE_WAIT = 40;
var BATTLEVIEW_COMSTATE_CHANGE = 50;

var BATTLEVIEW_COMMANDNUM_ACT = 0;
var BATTLEVIEW_COMMANDNUM_MOVE = 1;
var BATTLEVIEW_COMMANDNUM_RUN = 2;
var BATTLEVIEW_COMMANDNUM_WAIT = 3;
var BATTLEVIEW_COMMANDNUM_CHANGE = 4;

var BATTLEVIEW_UNITPAINT_X = 10;
var BATTLEVIEW_UNITPAINT_Y = 10;

// 敵AI
// 手番最初
var BATTLEAI_FM_NO = 0;//なにもしない 
var BATTLEAI_FM_FRONT = 100;//必ず前進 
var BATTLEAI_FM_BACK = 200;//必ず後退
var BATTLEAI_FM_FRGTARGET = 300;//ターゲットが増えるなら前進 

// 攻撃
var BATTLEAI_AT_FIRST = 0;//前衛攻撃 
var BATTLEAI_AT_BACK = 10;//後衛攻撃 
var BATTLEAI_AT_MAXDM = 20;//最大ダメージ期待値
var BATTLEAI_AT_MINHP = 30;//最小HPを攻撃

// 行動後
var BATTLEAI_SM_NO = 0;//なにもしない 
var BATTLEAI_SM_FRONT = 1;//必ず前進 
var BATTLEAI_SM_BACK = 2;//必ず後退
var BATTLEAI_SM_FRGCHIKEI = 3;//地形効果がよいなら前進
var BATTLEAI_SM_BKGCHIKEI = 4;//地形効果がよいなら後退

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
var ITEM_SYURUI_KOUCHA = 0;
var ITEM_SYURUI_KOUSUI = 1;
var ITEM_SYURUI_JIAI = 2;
var ITEM_SYURUI_MUJIN = 3;

// Type:99 Syurui:0は「素手」
var ITEM_TYPE_SUDE = 99;
// Type:100 Syurui:0は「なにもしない」
var ITEM_TYPE_NOTHING = 100;

var ITEM_EQMAX = 5;//1キャラが装備可能な武器属性最大値(手持ち、アイテム含む)
var ITEM_TEMOCHIMAX = 4;//1キャラが装備可能な手持ち最大値(素手含む)

// 表示などの都合上、1属性の武器、アイテムの種類はこの数字まで
var ITEM_SYURUI_MAX = 8;

// SKILL配列0は「スキルなし」
var SKILL_HIGHHIT = 1;//Done
var SKILL_HIGHHIT_RATE = 20;
var SKILL_HIGHAVO = 2;//Done
var SKILL_HIGHAVO_RATE = 15;
var SKILL_KENJITSU = 3;//Done
var SKILL_KENJITSU_RATE = 10;
var SKILL_KEIKAI = 4;//Done
var SKILL_KAMAITACHI = 5;//Done
var SKILL_KAMAITACHI_RATE = 1;
var SKILL_YOROI = 6;//Done
var SKILL_YOROI_RATE = 1;
var SKILL_KYOEN = 7;//Done
var SKILL_KYOEN_RATE = 2;
var SKILL_SYONETSU = 8;//Done
var SKILL_SYONETSU_RATE = 10;
var SKILL_AKURO = 9;
var SKILL_TAIEN = 10;
var SKILL_KIYOME = 11;//Done
var SKILL_POISON = 12;
var SKILL_STUN = 13;
var SKILL_TAMASHII = 14;
var SKILL_SURI = 15;
var SKILL_HEDGEHOG = 16;
var SKILL_THIEF = 17;

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
var UNIT_NAMAE_STUN = "麻痺兵";
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

var UNIT_SYURUI_NOFACE = 99;//イベントシーンで顔グラを出さないという意味

// このレベルを超えると成長率が上がる
var UNIT_LVUP_EXLV1 = 10;
var UNIT_LVUP_EXLV2 = 20;

// Lv1からLv2になるのに必要な経験値
var FIRST_EXP = 10;
// 1LvUpごとの取得経験値/必要経験値の増加率
var UNIT_LVUP_EXP = 1.4;
// ゲーム中の最大レベル
var MAX_LV = 35;

// 2人/3人での勝利時の経験値補正
var EXP_FOR2 = 0.8;
var EXP_FOR3 = 0.6;

// 幸運1で最大何%ダメージ増加/軽減するか
var LUCK_RATE = 3;

// クリティカルで最大HPのどれだけダメージ増加するか
var CRT_RATE = 0.3;

var EVENTVIEW_STATE_COMMAND = 0;
var EVENTVIEW_STATE_EVENT = 1;

var EVENTVIEW_EVENT_MSGNUM = 7;//1画面に何行表示するか

var EVENTVIEW_SKIP_X = 10;
var EVENTVIEW_SKIP_Y = 400;
var EVENTVIEW_SKIP_W = 50;
var EVENTVIEW_SKIP_H = 30;

var EVENTVIEW_UNITPAINT_X = 160;
var EVENTVIEW_UNITPAINT_Y = 190;
var EVENTVIEW_UNITPAINT_W = 192;
var EVENTVIEW_UNITPAINT_H = 240;

var EVENTVIEW_COMSTATE_PRECHOICE = -1;
var EVENTVIEW_COMSTATE_PROC_MAPCHOICE = 0;
var EVENTVIEW_COMSTATE_BUY_WEAPCHOICE = 10;
var EVENTVIEW_COMSTATE_SELL_WEAPCHOICE = 20;
var EVENTVIEW_COMSTATE_SAVE_FILECHOICE = 50;
var EVENTVIEW_COMSTATE_LOAD_FILECHOICE = 60;

var EVENTVIEW_PROC_MAXCOUNTER = 30;
var EVENTVIEW_MAP_X = 10;
var EVENTVIEW_MAP_Y = 10;
var EVENTVIEW_MAP_EXTEND = 2;//サイズの関係上元の絵をを引き延ばし

var EVENTVIEW_COMMAND_X = 10;
var EVENTVIEW_COMMAND_Y = 400;
var EVENTVIEW_COMMAND_W = 35;
var EVENTVIEW_COMMAND_H = 30;
var EVENTVIEW_COMMAND_DIST = 15;

// 売買用武器種類表示をどこから並べるか
var EVENTVIEW_BUYSELLCOMMAND_Y = 300;
var EVENTVIEW_BUYSELLCOMMAND_INTERVAL = 10;
// 売買個数表示をどこから並べるか
var EVENTVIEW_BUYSELLCOMMANDNUM_Y = 260;

// 売却時何割で引き取るか
var EVENTVIEW_SELL_RATE = 0.5;

// 売買商品を表示
var EVENTVIEW_BUYSELLWIN_X = 20;
var EVENTVIEW_BUYSELLWIN_Y = 50;
var EVENTVIEW_BUYSELLWIN_W = 300;
var EVENTVIEW_BUYSELLWIN_H = 200;
var EVENTVIEW_WEAP_INTERVAL = 20;

var EVENTVIEW_TEXT_X = 10;
var EVENTVIEW_TEXT_Y = 450;
var EVENTVIEW_TEXT_W = 350;
var EVENTVIEW_TEXT_H = 200;

var EVENTVIEW_COMMANDNUM_PROC = 0;
var EVENTVIEW_COMMANDNUM_BUY = 1;
var EVENTVIEW_COMMANDNUM_SELL = 2;
var EVENTVIEW_COMMANDNUM_CHECK = 3;
var EVENTVIEW_COMMANDNUM_WAIT = 4;
var EVENTVIEW_COMMANDNUM_SAVE = 5;
var EVENTVIEW_COMMANDNUM_LOAD = 6;

// イベント画面でフォントを変える
var EVENTVIEW_EVENTFONT_NORMAL = 0;
var EVENTVIEW_EVENTFONT_KAIWA = 1;

// イベントIDは10おきに振る(追加で間を埋められるように)
var EVENTVIEW_EVENTID_OP = 0;

var EVENTVIEW_FIELD_MIKATA = 0;
var EVENTVIEW_FIELD_TEKI = 1;
var EVENTVIEW_FIELD_HIDDEN = 2;
var EVENTVIEW_FIELD_CHANGING = 3;//敵から味方に変化中

var EVENTVIEW_MAP_MAX = 100;
var EVENTVIEW_MAP_INTERVAL = 12;
var EVENTVIEW_STAGE1_X = 20;
var EVENTVIEW_STAGE1_Y = 65;
// 以下、イベントでしか登場しない固有名詞
var EVENTVIEW_COUNTRY = "エーセン";
var EVENTVIEW_SOSHIKI = "正しきエーセンの会";

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
            printWarn('no GladColor peakDistance:' + peakDistance + ' count:' + count);
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
            printWarn('no GladColorBlue peakDistance:' + peakDistance + ' count:' + count);   
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
            printWarn('no GladColorRed peakDistance:' + peakDistance + ' count:' + count); 
        break;
    }
}