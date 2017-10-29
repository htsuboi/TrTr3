// タイトル画面とゲームオーバー画面での星クラス

var TitleStar = function(x, y, border, appearTime) {
    arguments.callee.getHeight = function() {
        return TitleStar.getHalfHeight() * 2;
    }

    arguments.callee.getWidth = function() {
        return TitleStar.getHalfWidth() * 2;
    }

    this.x = x * TitleStar.getWidth();
    this.y = y * TitleStar.getHeight();
    this.border = border;
    this.subCounter = 0;
    this.counter = 0;
    // このタイミング以降描画される
    this.appearTime = appearTime;

};

// タイトル画面全体のカウンタ
TitleStar.titleCounter = function(v) {
    if (typeof arguments.callee.titleCount == 'undefined') {
        arguments.callee.titleCount = 0;
    }
    if (typeof(v) != 'undefined') {
        arguments.callee.titleCount = v;
    }
    return arguments.callee.titleCount;
};

TitleStar.getStarCounterMax = function() {
    if (typeof arguments.callee.starMax == 'undefined') {
        arguments.callee.starCounterMax = 120;
    }
    return arguments.callee.starCounterMax;
};

TitleStar.getHalfWidth = function() {
    if (typeof arguments.callee.starMax == 'undefined') {
        arguments.callee.halfWidth = 7;
    }
    return arguments.callee.halfWidth;
};

TitleStar.getHalfHeight = function() {
    if (typeof arguments.callee.halfHeight == 'undefined') {
        arguments.callee.halfHeight = 15;
    }
    return arguments.callee.halfHeight;
};

TitleStar.prototype.incrementCounter = function() {
    if (this.appearTime > TitleStar.titleCounter()) {
        return;
    }
    if (this.counter < TitleStar.getStarCounterMax() - 20) {
        this.counter++;
    } else if (this.counter < TitleStar.getStarCounterMax() - 10){
        this.subCounter++;
        if (3 == this.subCounter) {
            this.counter++;
            this.subCounter = 0;
        }
    } else if (this.counter < TitleStar.getStarCounterMax()){
        this.subCounter++;
        if (5 == this.subCounter) {
            this.counter++;
            this.subCounter = 0;
        }
    }
};

TitleStar.prototype.movex = function(x) {
    this.x += x;
}

TitleStar.prototype.movey = function(y) {
    this.y += y;
}

TitleStar.prototype.moveAppearTime = function(appearTime) {
    this.appearTime += appearTime;
}

TitleStar.prototype.calc = function() {
    this.incrementCounter();
}

TitleStar.prototype.init = function() {
    this.counter = 0;
    this.subCounter = 0;
};

TitleStar.prototype.paintMe = function(ctxFlip) {
    if (this.appearTime > TitleStar.titleCounter()) {
        return;
    }

    ctxFlip.strokeStyle = 'rgb(0, 255, 0)';
    if (this.counter >= TitleStar.getStarCounterMax() || this.counter % 10 == 5) {
        ctxFlip.fillStyle = 'rgb(223, 239, 239)';
    } else if (this.counter % 10 < 5) {
        ctxFlip.fillStyle = 'rgb(159, 159, 159)';
    } else {
        ctxFlip.fillStyle = 'rgb(63, 63, 63)';
    }

    ctxFlip.beginPath();

    var halfWidth = (this.counter >= TitleStar.getStarCounterMax() ? TitleStar.getHalfWidth() : Math.abs(TitleStar.getHalfWidth() - (TitleStar.getHalfWidth() / 5) * this.counter % 10) + 1);
    var halfHeight = TitleStar.getHalfHeight();
    //ctxFlip.arc(this.x, this.y, (this.counter * 3 + 2), 0, Math.PI * 2, true);
    ctxFlip.fillRect(this.x - halfWidth, this.y - halfHeight, halfWidth * 2, halfHeight * 2);

    if (this.counter >= TitleStar.getStarCounterMax()) {
        ctxFlip.strokeStyle = 'rgb(0, 255, 0)';
        // left border
        if ((this.border & parseInt("1", 2 )) != 0) {
            ctxFlip.strokeRect(this.x - halfWidth, this.y - halfHeight, 1, halfHeight * 2);
        }
        // right border
        if ((this.border & parseInt("10", 2 )) != 0) {
            ctxFlip.strokeRect(this.x + halfWidth, this.y - halfHeight, 1, halfHeight * 2);
        }
        // top border
        if ((this.border & parseInt("100", 2 )) != 0) {
            ctxFlip.strokeRect(this.x - halfWidth, this.y - halfHeight, halfWidth * 2, 1);
        }
        // bottom border
        if ((this.border & parseInt("1000", 2 )) != 0) {
            ctxFlip.strokeRect(this.x - halfWidth, this.y + halfHeight, halfWidth * 2, 1);
        }
    }
};

// borderは下上右左
var tsArrayT = [new TitleStar(0, 0, parseInt("1101", 2 ),  0),
                new TitleStar(1, 0, parseInt("1100", 2 ),  15),
                new TitleStar(2, 0, parseInt("0100", 2 ),  30),
                new TitleStar(3, 0, parseInt("1100", 2 ),  45),
                new TitleStar(4, 0, parseInt("1110", 2 ),  60),
                new TitleStar(2, 1, parseInt("0011", 2 ),  60),
                new TitleStar(2, 2, parseInt("0011", 2 ),  75),
                new TitleStar(2, 3, parseInt("0011", 2 ),  90),
                new TitleStar(2, 4, parseInt("1011", 2 ),  105)]
var tsArrayR = [new TitleStar(0, 0, parseInt("0101", 2 ),  0),
                new TitleStar(1, 0, parseInt("1100", 2 ),  15),
                new TitleStar(2, 0, parseInt("1100", 2 ),  30),
                new TitleStar(3, 0, parseInt("1110", 2 ),  45),
                new TitleStar(4, 1, parseInt("1111", 2 ),  60),
                new TitleStar(3, 2, parseInt("1110", 2 ),  75),
                new TitleStar(2, 2, parseInt("0100", 2 ),  60),
                new TitleStar(1, 2, parseInt("1100", 2 ),  45),
                new TitleStar(0, 1, parseInt("0011", 2 ),  15),
                new TitleStar(0, 2, parseInt("0001", 2 ),  30),
                new TitleStar(0, 3, parseInt("0011", 2 ),  45),
                new TitleStar(0, 4, parseInt("1011", 2 ),  60),
                new TitleStar(2, 3, parseInt("1011", 2 ),  75),
                new TitleStar(3, 4, parseInt("1111", 2 ),  90)]
var tsArrayI = [new TitleStar(1, 0, parseInt("1101", 2 ),  0),
                new TitleStar(2, 0, parseInt("0100", 2 ),  15),
                new TitleStar(3, 0, parseInt("0110", 2 ),  30),
                new TitleStar(2, 1, parseInt("0011", 2 ),  30),
                new TitleStar(2, 2, parseInt("0011", 2 ),  45),
                new TitleStar(2, 3, parseInt("0011", 2 ),  60),
                new TitleStar(2, 4, parseInt("1000", 2 ),  75),
                new TitleStar(1, 4, parseInt("1101", 2 ),  90),
                new TitleStar(3, 4, parseInt("1110", 2 ),  90)]
var tsArrayU = [new TitleStar(0, 0, parseInt("0111", 2 ),  0),
                new TitleStar(0, 1, parseInt("0011", 2 ),  15),
                new TitleStar(0, 2, parseInt("0011", 2 ),  30),
                new TitleStar(0, 3, parseInt("1011", 2 ),  45),
                new TitleStar(1, 4, parseInt("1101", 2 ),  60),
                new TitleStar(2, 4, parseInt("1100", 2 ),  75),
                new TitleStar(3, 4, parseInt("1110", 2 ),  90),
                new TitleStar(4, 3, parseInt("1011", 2 ),  105),
                new TitleStar(4, 2, parseInt("0011", 2 ),  120),
                new TitleStar(4, 1, parseInt("0011", 2 ),  135),
                new TitleStar(4, 0, parseInt("0111", 2 ),  150)]
var tsArrayS = [new TitleStar(3, 0, parseInt("1110", 2 ),  0),
                new TitleStar(2, 0, parseInt("1100", 2 ),  15),
                new TitleStar(1, 0, parseInt("1101", 2 ),  30),
                new TitleStar(0, 1, parseInt("1111", 2 ),  45),
                new TitleStar(1, 2, parseInt("1101", 2 ),  60),
                new TitleStar(2, 2, parseInt("1100", 2 ),  75),
                new TitleStar(3, 2, parseInt("1110", 2 ),  90),
                new TitleStar(4, 3, parseInt("1111", 2 ),  105),
                new TitleStar(3, 4, parseInt("1110", 2 ),  120),
                new TitleStar(2, 4, parseInt("1100", 2 ),  135),
                new TitleStar(1, 4, parseInt("1101", 2 ),  150)]
var tsArray3 = [new TitleStar(0, 0, parseInt("1101", 2 ),  0),
                new TitleStar(1, 0, parseInt("0100", 2 ),  15),
                new TitleStar(2, 0, parseInt("1100", 2 ),  30),
                new TitleStar(3, 0, parseInt("0100", 2 ),  45),
                new TitleStar(4, 0, parseInt("1100", 2 ),  60),
                new TitleStar(5, 0, parseInt("0100", 2 ),  75),
                new TitleStar(6, 0, parseInt("1110", 2 ),  90),
                new TitleStar(1, 1, parseInt("0011", 2 ),  30),
                new TitleStar(1, 2, parseInt("0011", 2 ),  45),
                new TitleStar(1, 3, parseInt("0011", 2 ),  60),
                new TitleStar(3, 1, parseInt("0011", 2 ),  60),
                new TitleStar(3, 2, parseInt("0011", 2 ),  75),
                new TitleStar(3, 3, parseInt("0011", 2 ),  90),
                new TitleStar(5, 1, parseInt("0011", 2 ),  90),
                new TitleStar(5, 2, parseInt("0011", 2 ),  105),
                new TitleStar(5, 3, parseInt("0011", 2 ),  120),
                new TitleStar(0, 4, parseInt("1101", 2 ),  105),
                new TitleStar(1, 4, parseInt("1000", 2 ),  120),
                new TitleStar(2, 4, parseInt("1100", 2 ),  135),
                new TitleStar(3, 4, parseInt("1000", 2 ),  150),
                new TitleStar(4, 4, parseInt("1100", 2 ),  165),
                new TitleStar(5, 4, parseInt("1000", 2 ),  180),
                new TitleStar(6, 4, parseInt("1110", 2 ),  195)]

var tsArrayG = [new TitleStar(2, 2, parseInt("1101", 2 ),  0),
                new TitleStar(3, 2, parseInt("1010", 2 ),  15),
                new TitleStar(3, 1, parseInt("0011", 2 ),  30),
                new TitleStar(3, 0, parseInt("0110", 2 ),  45),
                new TitleStar(2, 0, parseInt("1100", 2 ),  60),
                new TitleStar(1, 0, parseInt("1100", 2 ),  60),
                new TitleStar(0, 0, parseInt("0101", 2 ),  75),
                new TitleStar(0, 1, parseInt("0011", 2 ),  90),
                new TitleStar(0, 2, parseInt("0011", 2 ),  105),
                new TitleStar(0, 3, parseInt("0011", 2 ),  120),
                new TitleStar(0, 4, parseInt("1001", 2 ),  135),
                new TitleStar(1, 4, parseInt("1100", 2 ),  150),
                new TitleStar(2, 4, parseInt("1100", 2 ),  165),
                new TitleStar(3, 4, parseInt("1100", 2 ),  180),
                new TitleStar(4, 4, parseInt("1010", 2 ),  195),
                new TitleStar(4, 3, parseInt("0111", 2 ),  210)]
var tsArrayA = [new TitleStar(2, 0, parseInt("1111", 2 ),  0),
                new TitleStar(1, 1, parseInt("0111", 2 ),  15),
                new TitleStar(3, 1, parseInt("0111", 2 ),  15),
                new TitleStar(0, 2, parseInt("0101", 2 ),  30),
                new TitleStar(4, 2, parseInt("0110", 2 ),  30),
                new TitleStar(1, 2, parseInt("1000", 2 ),  45),
                new TitleStar(3, 2, parseInt("1000", 2 ),  45),
                new TitleStar(2, 2, parseInt("1100", 2 ),  60),
                new TitleStar(0, 3, parseInt("0011", 2 ),  45),
                new TitleStar(4, 3, parseInt("0011", 2 ),  45),
                new TitleStar(0, 4, parseInt("1011", 2 ),  60),
                new TitleStar(4, 4, parseInt("1011", 2 ),  60)]
var tsArrayM = [new TitleStar(0, 4, parseInt("1011", 2 ),  0),
                new TitleStar(0, 3, parseInt("0011", 2 ),  15),
                new TitleStar(0, 2, parseInt("0011", 2 ),  30),
                new TitleStar(0, 1, parseInt("0001", 2 ),  45),
                new TitleStar(0, 0, parseInt("0111", 2 ),  60),
                new TitleStar(1, 1, parseInt("1110", 2 ),  75),
                new TitleStar(2, 2, parseInt("1111", 2 ),  90),
                new TitleStar(3, 1, parseInt("1101", 2 ),  105),
                new TitleStar(4, 0, parseInt("0111", 2 ),  120),
                new TitleStar(4, 1, parseInt("0010", 2 ),  135),
                new TitleStar(4, 2, parseInt("0011", 2 ),  150),
                new TitleStar(4, 3, parseInt("0011", 2 ),  165),
                new TitleStar(4, 4, parseInt("1011", 2 ),  180)]
var tsArrayE = [new TitleStar(0, 0, parseInt("0101", 2 ),  0),
                new TitleStar(1, 0, parseInt("1100", 2 ),  15),
                new TitleStar(2, 0, parseInt("1100", 2 ),  30),
                new TitleStar(3, 0, parseInt("1100", 2 ),  45),
                new TitleStar(4, 0, parseInt("1110", 2 ),  60),
                new TitleStar(0, 1, parseInt("0011", 2 ),  15),
                new TitleStar(0, 2, parseInt("0001", 2 ),  30),
                new TitleStar(0, 3, parseInt("0011", 2 ),  45),
                new TitleStar(0, 4, parseInt("1001", 2 ),  60),
                new TitleStar(1, 2, parseInt("1100", 2 ),  45),
                new TitleStar(2, 2, parseInt("1100", 2 ),  60),
                new TitleStar(3, 2, parseInt("1110", 2 ),  75),
                new TitleStar(1, 4, parseInt("1100", 2 ),  75),
                new TitleStar(2, 4, parseInt("1100", 2 ),  90),
                new TitleStar(3, 4, parseInt("1100", 2 ),  105),
                new TitleStar(4, 4, parseInt("1110", 2 ),  120)]
var tsArrayO = [new TitleStar(0, 1, parseInt("0111", 2 ),  0),
                new TitleStar(0, 2, parseInt("0011", 2 ),  15),
                new TitleStar(0, 3, parseInt("1011", 2 ),  30),
                new TitleStar(1, 4, parseInt("1101", 2 ),  45),
                new TitleStar(2, 4, parseInt("1100", 2 ),  60),
                new TitleStar(3, 4, parseInt("1110", 2 ),  75),
                new TitleStar(4, 3, parseInt("1011", 2 ),  90),
                new TitleStar(4, 2, parseInt("0011", 2 ),  105),
                new TitleStar(4, 1, parseInt("0111", 2 ),  120),
                new TitleStar(3, 0, parseInt("1110", 2 ),  135),
                new TitleStar(2, 0, parseInt("1100", 2 ),  150),
                new TitleStar(1, 0, parseInt("1101", 2 ),  165)]
var tsArrayV = [new TitleStar(0, 0, parseInt("0111", 2 ),  0),
                new TitleStar(0, 1, parseInt("1011", 2 ),  15),
                new TitleStar(1, 2, parseInt("0111", 2 ),  30),
                new TitleStar(1, 3, parseInt("1011", 2 ),  45),
                new TitleStar(2, 4, parseInt("1111", 2 ),  60),
                new TitleStar(3, 3, parseInt("1011", 2 ),  75),
                new TitleStar(3, 2, parseInt("0111", 2 ),  90),
                new TitleStar(4, 1, parseInt("1011", 2 ),  105),
                new TitleStar(4, 0, parseInt("0111", 2 ),  120)]