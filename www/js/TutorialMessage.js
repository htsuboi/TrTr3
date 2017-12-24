var TutorialMessage = function() {
};

TutorialMessage.getMessage = function(tutorialID, message) {
    switch(tutorialID) {
        case COMMONVIEW_TUTORIALID_GSTART:arguments
            CommonView.redPoint({x: ALLVIEW_TUTORIALFLAG_X, y: ALLVIEW_TUTORIALFLAG_Y, w: ALLVIEW_TUTORIALFLAG_W, h: ALLVIEW_TUTORIALFLAG_H});
            CommonView.bluePoint({x: ALLVIEW_TUTORIALFLAG_X, y: ALLVIEW_TUTORIALFLAG_Y_PRINT, w: ALLVIEW_TUTORIALFLAG_W, h: ALLVIEW_TUTORIALFLAG_H});
            message.push("【はじめに】");
            message.push(" Tri Trust3をプレイしていただき");
            message.push("ありがとうございます。");
            message.push(" このゲームでは、ほとんどの場面で");
            message.push("各操作が最初に必要になったときに");
            message.push("このようなチュートリアルが表示されます。");
            message.push("(右上の「初回は説明」をタッチすると");
            message.push("この機能のON/OFFが切り替わります。)");
            message.push(" また、右上の「説明表示」をタッチしても");
            message.push("同様のチュートリアルを確認できます。");
            break;
        case COMMONVIEW_TUTORIALID_EVENT:arguments
            CommonView.tutorialPoint({x: -1, y: -1, w: -1, h: 150});
            CommonView.redPoint({x: EVENTVIEW_SKIP_X, y: EVENTVIEW_SKIP_Y, w: EVENTVIEW_SKIP_W, h: EVENTVIEW_SKIP_H});
            message.push("【イベント】");
            message.push(" イベントシーンでは、画面をタッチすると");
            message.push("文章を進めることができます。");
            message.push(" また、「SKIP」をタッチすると");
            message.push("イベントの終わりまでスキップします。");
            break;
        case COMMONVIEW_TUTORIALID_UNITSELECT:arguments
            CommonView.tutorialPoint({x: BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W + 10, y: BATTLEVIEW_COMMANDTXT_Y - 20, w: 295, h: -1});
            CommonView.redPoint({x: BATTLEVIEW_UNITSELECT_X, y: BATTLEVIEW_UNITSELECT_Y, w: 2 * BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL, h: 7 * BATTLEVIEW_UNITSELECT_H + 6 * BATTLEVIEW_UNITSELECT_HINTERVAL});
            CommonView.bluePoint({x: BATTLEVIEW_COMMANDTXT_X, y: BATTLEVIEW_COMMANDTXT_Y, w: BATTLEVIEW_COMMANDTXT_W, h: BATTLEVIEW_COMMANDTXT_H + BATTLEVIEW_COMMANDINTERVAL});            
            message.push("【ユニット選択】");
            message.push(" 戦闘開始時は、まず参戦ユニットを決めます。");
            message.push("左上のユニット一覧から");
            message.push("最大3人までの参戦ユニットを選びます。");
            message.push("選んだ順に、戦闘時の");
            message.push("前衛・中衛・後衛となります。");
            message.push("　");
            message.push(" 選び終わったら、左の");
            message.push("「決定」をタッチしてください。");
            break;
        case COMMONVIEW_TUTORIALID_SKILLSELECT:arguments
            CommonView.tutorialPoint({x: BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W + 10, y: BATTLEVIEW_COMMANDTXT_Y - 20, w: 295, h: -1});
            CommonView.redPoint({x: BATTLEVIEW_UNITSELECT_X, y: BATTLEVIEW_UNITSELECT_Y, w: 2 * BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL, h: 7 * BATTLEVIEW_UNITSELECT_H + 6 * BATTLEVIEW_UNITSELECT_HINTERVAL});
            CommonView.bluePoint({x: BATTLEVIEW_COMMANDTXT_X, y: BATTLEVIEW_COMMANDTXT_Y, w: BATTLEVIEW_COMMANDTXT_W, h: BATTLEVIEW_COMMANDTXT_H + BATTLEVIEW_COMMANDINTERVAL});            
            message.push("【スキル選択】");
            message.push(" 各ユニットは、戦闘を有利にする。");
            message.push("スキルを3個ずつ持っています。");
            message.push("この画面でONにすることによって");
            message.push("そのスキルは有効になります。");
            message.push("ただし、「消費気力」に規定された分だけ");
            message.push("毎ターン終了時に気力を消費します。");
            message.push(" ");
            message.push("　左上のスキル一覧から");
            message.push("ONにしたいスキルをタッチしてください。");
            message.push(" 終わったら、左の");
            message.push("「決定」をタッチしてください。");
            break;
    }
}