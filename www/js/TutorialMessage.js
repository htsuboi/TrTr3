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
        case COMMONVIEW_TUTORIALID_MAPCHOICE:arguments
            CommonView.tutorialPoint({x: -1, y: -1, w: -1, h: 330});
            CommonView.redPoint({x: EVENTVIEW_COMMANDTXT_X, y: EVENTVIEW_COMMANDTXT_Y, w: EVENTVIEW_COMMANDTXT_W, h: EVENTVIEW_COMMANDTXT_H + EVENTVIEW_COMMANDINTERVAL});
            message.push("【進攻】");
            message.push(" 敵(赤)マスに進出し、戦闘を行います。");
            message.push("戦闘に勝利すると、そのマスが");
            message.push("味方(青)マスとなります。");
            message.push(" ゲーム序盤以外は、進攻戦の後");
            message.push("防衛戦を行うことになります。");
            message.push("防衛戦に十分な戦力を残せない場合は");
            message.push("このターンは【進攻】せずに");
            message.push("【待機】することも重要です。");
            message.push("");
            message.push(" 味方マスと隣接した");
            message.push("敵マスをタッチしてください。");
            message.push(" 終わったら、左の");
            message.push("「決定」をタッチしてください。");
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
            message.push(" 選び終わったら、左の");
            message.push("「決定」をタッチしてください。");
            break;
        case COMMONVIEW_TUTORIALID_SKILLSELECT:arguments
            CommonView.tutorialPoint({x: BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W + 10, y: BATTLEVIEW_COMMANDTXT_Y - 30, w: 295, h: 295});
            CommonView.redPoint({x: BATTLEVIEW_UNITSELECT_X, y: BATTLEVIEW_UNITSELECT_Y, w: 2 * BATTLEVIEW_UNITSELECT_W + BATTLEVIEW_UNITSELECT_WINTERVAL, h: 7 * BATTLEVIEW_UNITSELECT_H + 6 * BATTLEVIEW_UNITSELECT_HINTERVAL});
            CommonView.bluePoint({x: BATTLEVIEW_COMMANDTXT_X, y: BATTLEVIEW_COMMANDTXT_Y, w: BATTLEVIEW_COMMANDTXT_W, h: BATTLEVIEW_COMMANDTXT_H + BATTLEVIEW_COMMANDINTERVAL});            
            CommonView.purplePoint({x: BATTLEVIEW_UNITTXT_X, y: BATTLEVIEW_UNITTXT_Y + 21 *BATTLEVIEW_UNITTXT_YINTERVAL, w: BATTLEVIEW_UNITTXT_W, h: 3 * BATTLEVIEW_UNITTXT_YINTERVAL});            
            message.push("【スキル選択】");
            message.push(" 各味方ユニットは、戦闘を有利にする");
            message.push("スキルを3個ずつ持っています。");
            message.push("この画面でONにすることで有効になります。");
            message.push("ただし、「消費気力」に規定された分だけ");
            message.push("手番終了時に気力を消費します。");
            message.push("　左上のスキル一覧から");
            message.push("ONにしたいスキルをタッチしてください。");
            message.push(" 終わったら、左の");
            message.push("「決定」をタッチしてください。");
            message.push(" なお、戦闘中のすべての画面では");
            message.push("右下のユニット情報の、スキル名を");
            message.push("タッチすると説明が表示されます。");
            break;
        case COMMONVIEW_TUTORIALID_BATTLEMAIN:arguments
            CommonView.tutorialPoint({x: BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W + 5, y: BATTLEVIEW_SPGAUGE_Y + BATTLEVIEW_SPGAUGE_H + 10, w: 305, h: 350});
            CommonView.redPoint({x: BATTLEVIEW_COMMANDTXT_X, y: BATTLEVIEW_COMMANDTXT_Y, w: BATTLEVIEW_COMMANDTXT_W, h: 5 * BATTLEVIEW_COMMANDINTERVAL});
            CommonView.bluePoint({x: BATTLEVIEW_SPGAUGE_X, y: BATTLEVIEW_SPGAUGE_Y, w: BATTLEVIEW_SPGAUGE_W, h: BATTLEVIEW_SPGAUGE_H});
            message.push("【戦闘システム】");
            message.push(" 戦闘は、味方前衛→敵前衛→");
            message.push("味方中衛→…と手番が回っていく");
            message.push("ターン制バトルです。");
            message.push("自分の手番の開始時に");
            message.push("移動や再行動などに使用できる");
            message.push("「SPゲージ」が100回復します。");
            message.push("");
            message.push(" 味方手番時は、左の5個のコマンドから");
            message.push("選択したいコマンドをタッチします。");
            message.push("それぞれのコマンドの詳細は");
            message.push("各コマンドをタッチすると確認できます。");
            message.push("(最初は「行動」で攻撃、を覚えましょう。)");
            message.push("");
            message.push(" また、フィールド内のユニットをタッチすると");
            message.push("ユニットの情報が確認できます。");
            break;
        case COMMONVIEW_TUTORIALID_BATTLEMOVE:arguments
            CommonView.tutorialPoint({x: BATTLEVIEW_COMMANDTXT_X + BATTLEVIEW_COMMANDTXT_W + 5, y: 40, w: 305, h: 390});
            CommonView.redPoint({x: BATTLEVIEW_COMMANDTXT_X, y: BATTLEVIEW_COMMANDTXT_Y, w: BATTLEVIEW_COMMANDTXT_W, h: 2 * BATTLEVIEW_COMMANDINTERVAL});
            CommonView.bluePoint({x: BATTLEVIEW_UNITTXT_X, y: BATTLEVIEW_UNITTXT_Y + 20 + 15 *BATTLEVIEW_UNITTXT_YINTERVAL, w: BATTLEVIEW_UNITTXT_W, h: 2 * BATTLEVIEW_UNITTXT_YINTERVAL});
            message.push("【移動】");
            message.push(" 上下方向に移動します。");
            message.push("「防御」の高い地形なら被ダメージを軽減でき");
            message.push("「武コスト」の低い地形なら");
            message.push("攻撃時の気力消費を抑えられます。");
            message.push("");
            message.push(" フィールドの地形ごとに「移コスト」が");
            message.push("設定されています。");
            message.push("移動先への移コストが「1」なら");
            message.push("各ユニットの「移動1」の値だけ、");
            message.push("移動先への移コストが「2」なら");
            message.push("各ユニットの「移動2」の値だけ、");
            message.push("SPゲージを消費します。");
            message.push("(移コスト「3」以上のマスへは");
            message.push("移動できません。)");
            message.push(" ");
            message.push("移動先のマスをタッチ後");
            message.push("左の「決定」をタッチしてください。");
            break;
    }
}