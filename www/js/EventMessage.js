var EventMessage = function() {
};

EventMessage.getMessage = function(eventNum, message) {
    switch(eventNum) {
        case EVENTVIEW_EVENTID_OP:arguments
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push("　ここは" + EVENTVIEW_COUNTRY + "の国。");
            message.push("西側で大国カパーランドに接する");
            message.push("人口100万人ほどの小国である。");
            message.push("　この国の王家は、世界の歴史愛好家から");
            message.push("2つの点で知られている。");
            message.push("　一つは、賞賛。");
            message.push("この200年間で、隣国カパーランドをはじめ");
            message.push("多くの国で王制が廃止されていくなか");
            message.push("1000年以上前から唯一残っている王族だから。");
            message.push("　そして、もう一つは冷笑。");
            message.push("世界で最も影が薄い王族だから。");
            message.push("9割の国民は、自国が『王国』とすら知らず");
            message.push("王族という語は、歴史教科書にのみ存在すると");
            message.push("信じて疑っていないのだから。");
            message.push("　");
            message.push("　" + EVENTVIEW_COUNTRY + "西の地方都市、オルト。");
            message.push("初秋の、そろそろ日付も変わろうとする真夜中。");
            message.push("街を見下ろす高台の公園に、一つの人影があった。");
            message.push(EVENTVIEW_COUNTRY + "最後の王族、王女" + UNIT_NAMAE_PRINCESS + "だった。");
            message.push("#" + UNIT_SYURUI_PRINCESS);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【" + UNIT_NAMAE_PRINCESS + "】");
            message.push("(夏休みの数学の宿題と、剣術のけいこで");
            message.push("すっかり遅くなってしまいました。");
            message.push("ですが、今からでもやるしかありません。");
            message.push("それが王女のつとめ…。");
            message.push("今の私の唯一の、王女の証なのですから。)");
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push("　公園の中央にある掲示板。");
            message.push("そこには商品の宣伝から、猫の捜索願いまで");
            message.push("無数の貼り紙が貼られている。");
            message.push(UNIT_NAMAE_PRINCESS + "はその前に立ち、一つ一つ眺めはじめた。");
            message.push("#" + UNIT_SYURUI_PRINCESS);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【" + UNIT_NAMAE_PRINCESS + "】");
            message.push("(これとこれと、多分これもですね。)");
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push("　いくつかの貼り紙を手際よく剥がし");
            message.push("持参したゴミ袋に入れていく。");
            message.push("それらには、すべて");
            message.push("「" + EVENTVIEW_SOSHIKI + "」という語があった。");
            message.push("#" + UNIT_SYURUI_PRINCESS);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【" + UNIT_NAMAE_PRINCESS + "】");
            message.push("「ふぅ・・・。」");
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push(UNIT_NAMAE_PRINCESS + "は少し手を休め、眼下に広がる");
            message.push("夜のオルトを見下ろした。");
            message.push("今ごろ子供は暖かいベッドで眠っているだろう。");
            message.push("今ごろ多くの学生は");
            message.push("週末の自由を謳歌しているだろう。");
            message.push("街の飲食店街が黄色く光っているのは");
            message.push("明日は休日だからと、大勢で");
            message.push("夜更けまで飲んでいるのだろう。");
            message.push(UNIT_NAMAE_PRINCESS + "の口から言葉が漏れる。");
            message.push("#" + UNIT_SYURUI_PRINCESS);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【" + UNIT_NAMAE_PRINCESS + "】");
            message.push("「こういう仕事は嫌ではありません。");
            message.push("けれど、こういう毎日を過ごしていれば");
            message.push("いつか、" + EVENTVIEW_COUNTRY + "の王家として");
            message.push("恥じない者になれるのでしょうか?");
            message.push("私…は。」");
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push("答えはなかった。");
            message.push("　");
            message.push("　かわりに、" + UNIT_NAMAE_PRINCESS + "は後ろに一つの気配を感じた。");
            message.push("敵意、害意…いや、殺気!");
            message.push("剣術と魔法で鍛えた身のこなしで");
            message.push("振り向き、身構える。");
            message.push("#" + UNIT_SYURUI_SWORD);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【男】");
            message.push("「なーにやってんだ、てめぇ!");
            message.push("俺達が苦労して貼ったのを、全部剥がすとはよ。」");
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push("男の顔は怒りに満ちていた。");
            message.push(UNIT_NAMAE_PRINCESS + "は必死で言い返す。");
            message.push("#" + UNIT_SYURUI_PRINCESS);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【" + UNIT_NAMAE_PRINCESS + "】");
            message.push("「この掲示板は市民の交流のためのもの。");
            message.push("政治色を含んだものは、禁止の決まりです!」");
            message.push("#" + UNIT_SYURUI_SWORD);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【男】");
            message.push("「なるほどな。");
            message.push("じゃ、何でてめえは");
            message.push(EVENTVIEW_SOSHIKI + "のポスターだけ剥がすんだ?");
            message.push("他の団体だって、いくらでも貼り紙してるってのに。」");
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push("答えられない" + UNIT_NAMAE_PRINCESS + "。");
            message.push("#" + UNIT_SYURUI_SWORD);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【男】");
            message.push("「まあ、黙るしかねえよな。");
            message.push("悪いがこっちは全部調べてんだ。");
            message.push("おめぇが王女様ってことも、");
            message.push("おめぇの毎日は、ただひたすらに");
            message.push("王室管理課の命令に従ってるだけってのも。」");
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push(UNIT_NAMAE_PRINCESS + "の視線が、わずかにうつむく。");
            message.push("#" + UNIT_SYURUI_SWORD);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【男】");
            message.push("「まあいい、俺も手荒なことは");
            message.push("できればしたくねえ。");
            message.push("今夜剥がしたポスターを元通りにして");
            message.push("これから二度と、こんな事をしねえなら");
            message.push("今回だけは見逃してやるぜ。」");
            message.push("#" + UNIT_SYURUI_PRINCESS);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【" + UNIT_NAMAE_PRINCESS + "】");
            message.push("「嫌です!」");
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push("今度は" + UNIT_NAMAE_PRINCESS + "は、間髪入れず答えた。");
            message.push("#" + UNIT_SYURUI_PRINCESS);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【" + UNIT_NAMAE_PRINCESS + "】");
            message.push("「王女として、人を裏切ることはできません!」");
            message.push("#" + UNIT_SYURUI_NOFACE);
            message.push("@" + EVENTVIEW_EVENTFONT_NORMAL);
            message.push("少しの間、沈黙が流れた。");
            message.push("男はゆっくりと剣を抜き、構える。");
            message.push("それを見た" + UNIT_NAMAE_PRINCESS + "も、勇気を奮い起こして構える。");
            message.push("#" + UNIT_SYURUI_SWORD);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【男】");
            message.push("「あんな連中に義理立てする理由が");
            message.push("俺にはわからんが…。");
            message.push("そういうことなら、痛い目にあってもらうぜ!」");
            message.push("#" + UNIT_SYURUI_PRINCESS);
            message.push("@" + EVENTVIEW_EVENTFONT_KAIWA);
            message.push("【" + UNIT_NAMAE_PRINCESS + "】");
            message.push("「くっ…暴力には、負けません!」");
            break;
    }
}