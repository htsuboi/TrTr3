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
var intervalId;
intervalId = setInterval(calcAndPaint, 10);

// calcはデータ計算のみ、paintは描画のみ
function calcAndPaint() {
    var next = {nextGameMode: -1};
    try {
        switch(gameMode) {
            case GAMEMODE_TITLE:arguments
                tv.calc();
                tv.paint();
                break;
            case GAMEMODE_BATTLE:arguments
                bv.calc(ud, itemMap, next, ev);
                bv.paint(ud, itemMap, ev);
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
    catch (e) {
        alert(e);
    //    CommonView.addWarn(e);
    }
    if (next.nextGameMode >= 0) {
        gameMode = next.nextGameMode;
        switch(gameMode) {
            case GAMEMODE_TITLE:arguments
                tv.init();
                break;
            case GAMEMODE_GAMEOVER:arguments
                gov.init();
                break;
        }
    }
}

function clickPage(e) {
    var nextGameMode = -1;
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    //(全画面共通)
    if (CommonView.printTutorialFlag() == true) {
        // チュートリアル表示時はそれを消す
        CommonView.printTutorialFlag(false);
        return -1;
    }
    
    if (CommonView.printWarnFlag() == true) {
        // 警告表示時はそれを消す
        CommonView.printWarnFlag(false);
        return -1;
    }
    try {
        switch(gameMode) {
            case GAMEMODE_TITLE:arguments
                nextGameMode = tv.clk(mouseX, mouseY, ev, ud, itemMap);
                break;
            case GAMEMODE_BATTLE:arguments
                nextGameMode = bv.clk(mouseX, mouseY, ev, ud, itemMap);
                break;
            case GAMEMODE_GAMEOVER:arguments
                nextGameMode = gov.clk(mouseX, mouseY);
                break;
            case GAMEMODE_EVENT:arguments
                nextGameMode = ev.clk(mouseX, mouseY, bv, ud, itemMap);
                break;
        }
    }
    catch (e) {
        alert(e);
        //CommonView.addWarn(e);
    }
    if (nextGameMode >= 0) {
        gameMode = nextGameMode;
        switch(gameMode) {
            case GAMEMODE_TITLE:arguments
                tv.init();
                break;
            case GAMEMODE_GAMEOVER:arguments
                gov.init();
                break;
            case GAMEMODE_EVENT:arguments
                //ev.init(EVENTVIEW_EVENTID_OP);
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