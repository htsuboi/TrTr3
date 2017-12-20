var TutorialMessage = function() {
};

TutorialMessage.getMessage = function(tutorialID, message) {
    switch(tutorialID) {
        case COMMONVIEW_TUTORIALID_GSTART:arguments
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
    }
}