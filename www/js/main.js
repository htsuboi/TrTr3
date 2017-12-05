var tv = new TitleView();
var gov = new GameOverView();
var ev = new EventView();
var bv = new BattleView();

var ud = new Array();//ユニットデータ格納
//所持アイテム格納 キー:アイテム名(「{eqType, eqSyurui}の組のオブジェクト」はget時等価比較しにくいのでやめた) 値:手持ち数、全体数
var itemMap = new Map();

var gameMode = GAMEMODE_TITLE;//0:タイトル 1:ゲームオーバー
var prevGameMode = GAMEMODE_GAMEOVER;
tv.init();
bv.init(1, true);
ev.init();
gov.init();
var u = new UnitDefine();
u.initCommon(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_KNIGHT, BATTLE_MIKATA, BATTLE_OFFENCE, 1, 20, SKILL_HIGHHIT, SKILL_SYONETSU, SKILL_KENJITSU);
ud.push(u);
var u2 = new UnitDefine();
u2.initCommon(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_MUSCLE, BATTLE_MIKATA, BATTLE_OFFENCE, 1, 15, SKILL_KEIKAI, SKILL_YOROI, SKILL_KAMAITACHI);
ud.push(u2);
var u3 = new UnitDefine();
u3.initCommon(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_TATEO, BATTLE_MIKATA, BATTLE_OFFENCE, 1, 25, SKILL_HIGHAVO, SKILL_KYOEN, SKILL_KIYOME);
ud.push(u3);
var intervalId;
intervalId = setInterval(calcAndPaint, 20);
var u4 = new UnitDefine();
//u4.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_HAMMER, BATTLE_TEKI, BATTLE_DEFENCE, 1, 20, 0, 0, 0, ITEM_TYPE_HAMMER, 1, BATTLEAI_FM_FRONT + BATTLEAI_AT_BACK + BATTLEAI_SM_BACK);
u4.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_POISON, BATTLE_TEKI, BATTLE_DEFENCE, 1, 20, 0, 0, 0, ITEM_TYPE_SWORD, 1, BATTLEAI_FM_FRONT + BATTLEAI_AT_BACK + BATTLEAI_SM_NO, 1.2, 0.1);
ud.push(u4);
var u5 = new UnitDefine();
//u5.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_PUNCH, BATTLE_TEKI, BATTLE_DEFENCE, 1, 20, 0, 0, 0, ITEM_TYPE_PUNCH, 1, BATTLEAI_FM_FRONT + BATTLEAI_AT_FIRST + BATTLEAI_SM_BACK);
u5.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_STUN, BATTLE_TEKI, BATTLE_DEFENCE, 1, 20, 0, 0, 0, ITEM_TYPE_PUNCH, 1, BATTLEAI_FM_FRONT + BATTLEAI_AT_FIRST + BATTLEAI_SM_NO, 1.1, 0.05);
ud.push(u5);
var u6 = new UnitDefine();
u6.initTeki(ud, GAME_DIFFICULTY_NORMAL, UNIT_SYURUI_KNIFE, BATTLE_TEKI, BATTLE_DEFENCE, 1, 20, 0, 0, 0, ITEM_TYPE_KNIFE, 1, BATTLEAI_FM_FRONT + BATTLEAI_AT_MAXDM + BATTLEAI_SM_NO, 1.2, 0.2);
ud.push(u6);

//itemMap.set({eqType:ITEM_TYPE_SWORD, eqSyurui:ITEM_SYURUI_SWORD1}, {equipNum: 2, allNum:3});
var tempItem = new ItemDefine();
ItemDefine.init(ITEM_TYPE_SWORD, 0, tempItem);
itemMap.set(tempItem.namae, 1);
ItemDefine.init(ITEM_TYPE_SWORD, 1, tempItem);
itemMap.set(tempItem.namae, 3);
ItemDefine.init(ITEM_TYPE_SWORD, 2, tempItem);
itemMap.set(tempItem.namae, 4);
ItemDefine.init(ITEM_TYPE_SWORD, 3, tempItem);
itemMap.set(tempItem.namae, 4);
ItemDefine.init(ITEM_TYPE_SPEAR, 0, tempItem);
itemMap.set(tempItem.namae, 0);
ItemDefine.init(ITEM_TYPE_SPEAR, 1, tempItem);
itemMap.set(tempItem.namae, 2);
ItemDefine.init(ITEM_TYPE_DOGU, ITEM_SYURUI_KOUCHA, tempItem);
itemMap.set(tempItem.namae, 1);
ItemDefine.init(ITEM_TYPE_DOGU, ITEM_SYURUI_KOUSUI, tempItem);
itemMap.set(tempItem.namae, 1);
ItemDefine.init(ITEM_TYPE_DOGU, ITEM_SYURUI_JIAI, tempItem);
itemMap.set(tempItem.namae, 1);
ItemDefine.init(ITEM_TYPE_DOGU, ITEM_SYURUI_MUJIN, tempItem);
itemMap.set(tempItem.namae, 1);
//itemMap.set({eqType:ITEM_TYPE_SWORD, eqSyurui:ITEM_SYURUI_SWORD2}, {equipNum: 4, allNum:5});

var intervalId;
intervalId = setInterval(calcAndPaint, 20);

// calcはデータ計算のみ、paintは描画のみ
function calcAndPaint() {
    switch(gameMode) {
        case GAMEMODE_TITLE:arguments
            tv.calc();
            tv.paint();
            break;
        case GAMEMODE_BATTLE:arguments
            bv.calc(ud, itemMap);
            bv.paint(ud, itemMap);
            break;
        case GAMEMODE_EVENT:arguments
            ev.calc(ud, itemMap);
            ev.paint(ud, itemMap);
            break;
        case GAMEMODE_GAMEOVER:arguments
            gov.calc();
            gov.paint();
            break;
    }
}

function clickPage(e) {
    var nextGameMode = -1;
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    //var mouseX = 15;
    //var mouseY = 20;
    switch(gameMode) {
        case GAMEMODE_TITLE:arguments
            nextGameMode = tv.clk(mouseX, mouseY);
            break;
        case GAMEMODE_BATTLE:arguments
            nextGameMode = bv.clk(mouseX, mouseY, ud, itemMap);
            break;
        case GAMEMODE_GAMEOVER:arguments
            nextGameMode = gov.clk(mouseX, mouseY);
            break;
        case GAMEMODE_EVENT:arguments
            nextGameMode = ev.clk(mouseX, mouseY);
            break;
    }
    if (nextGameMode >= 0) {
        gameMode = nextGameMode;
        switch(gameMode) {
            case GAMEMODE_TITLE:arguments
                tv.init();
                break;
            case GAMEMODE_BATTLE:arguments
                bv.init(1, true);
                break;
            case GAMEMODE_GAMEOVER:arguments
                gov.init();
                break;
            case GAMEMODE_EVENT:arguments
                ev.init();
                break;
        }
    }
}

$(document).on('click', 'canvas#gameCanvas', clickPage);

//$(document).on('click', 'gameCanvasFlip', function(){
//    alert("click Flip success");  
//});

//$(document).on('click', 'p', function(){
//    alert("click success");  
//});