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
        if ((this.border & 0b1) != 0) {
            ctxFlip.strokeRect(this.x - halfWidth, this.y - halfHeight, 1, halfHeight * 2);
        }
        // right border
        if ((this.border & 0b10) != 0) {
            ctxFlip.strokeRect(this.x + halfWidth, this.y - halfHeight, 1, halfHeight * 2);
        }
        // top border
        if ((this.border & 0b100) != 0) {
            ctxFlip.strokeRect(this.x - halfWidth, this.y - halfHeight, halfWidth * 2, 1);
        }
        // bottom border
        if ((this.border & 0b1000) != 0) {
            ctxFlip.strokeRect(this.x - halfWidth, this.y + halfHeight, halfWidth * 2, 1);
        }
    }
};

// borderは下上右左
var tsArrayT = [new TitleStar(0, 0, 0b1101, 0), 
                new TitleStar(1, 0, 0b1100, 15),
                new TitleStar(2, 0, 0b0100, 30), 
                new TitleStar(3, 0, 0b1100, 45),
                new TitleStar(4, 0, 0b1110, 60),
                new TitleStar(2, 1, 0b0011, 60), 
                new TitleStar(2, 2, 0b0011, 75), 
                new TitleStar(2, 3, 0b0011, 90), 
                new TitleStar(2, 4, 0b1011, 105)]
var tsArrayR = [new TitleStar(0, 0, 0b0101, 0), 
                new TitleStar(1, 0, 0b1100, 15),
                new TitleStar(2, 0, 0b1100, 30),
                new TitleStar(3, 0, 0b1110, 45),
                new TitleStar(4, 1, 0b1111, 60),
                new TitleStar(3, 2, 0b1110, 75),
                new TitleStar(2, 2, 0b0100, 60),
                new TitleStar(1, 2, 0b1100, 45),
                new TitleStar(0, 1, 0b0011, 15), 
                new TitleStar(0, 2, 0b0001, 30), 
                new TitleStar(0, 3, 0b0011, 45), 
                new TitleStar(0, 4, 0b1011, 60),
                new TitleStar(2, 3, 0b1011, 75), 
                new TitleStar(3, 4, 0b1111, 90)]
var tsArrayI = [new TitleStar(1, 0, 0b1101, 0), 
                new TitleStar(2, 0, 0b0100, 15),
                new TitleStar(3, 0, 0b0110, 30),
                new TitleStar(2, 1, 0b0011, 30),
                new TitleStar(2, 2, 0b0011, 45), 
                new TitleStar(2, 3, 0b0011, 60), 
                new TitleStar(2, 4, 0b1000, 75),
                new TitleStar(1, 4, 0b1101, 90),
                new TitleStar(3, 4, 0b1110, 90)]
var tsArrayU = [new TitleStar(0, 0, 0b0111, 0), 
                new TitleStar(0, 1, 0b0011, 15), 
                new TitleStar(0, 2, 0b0011, 30),
                new TitleStar(0, 3, 0b1011, 45), 
                new TitleStar(1, 4, 0b1101, 60), 
                new TitleStar(2, 4, 0b1100, 75),
                new TitleStar(3, 4, 0b1110, 90),
                new TitleStar(4, 3, 0b1011, 105),
                new TitleStar(4, 2, 0b0011, 120), 
                new TitleStar(4, 1, 0b0011, 135), 
                new TitleStar(4, 0, 0b0111, 150)]
var tsArrayS = [new TitleStar(3, 0, 0b1110, 0), 
                new TitleStar(2, 0, 0b1100, 15), 
                new TitleStar(1, 0, 0b1101, 30),
                new TitleStar(0, 1, 0b1111, 45), 
                new TitleStar(1, 2, 0b1101, 60), 
                new TitleStar(2, 2, 0b1100, 75),
                new TitleStar(3, 2, 0b1110, 90),
                new TitleStar(4, 3, 0b1111, 105),
                new TitleStar(3, 4, 0b1110, 120), 
                new TitleStar(2, 4, 0b1100, 135), 
                new TitleStar(1, 4, 0b1101, 150)]
var tsArray3 = [new TitleStar(0, 0, 0b1101, 0), 
                new TitleStar(1, 0, 0b0100, 15), 
                new TitleStar(2, 0, 0b1100, 30),
                new TitleStar(3, 0, 0b0100, 45), 
                new TitleStar(4, 0, 0b1100, 60),
                new TitleStar(5, 0, 0b0100, 75),
                new TitleStar(6, 0, 0b1110, 90),
                new TitleStar(1, 1, 0b0011, 30),
                new TitleStar(1, 2, 0b0011, 45),
                new TitleStar(1, 3, 0b0011, 60),
                new TitleStar(3, 1, 0b0011, 60),
                new TitleStar(3, 2, 0b0011, 75),
                new TitleStar(3, 3, 0b0011, 90),
                new TitleStar(5, 1, 0b0011, 90),
                new TitleStar(5, 2, 0b0011, 105),
                new TitleStar(5, 3, 0b0011, 120),
                new TitleStar(0, 4, 0b1101, 105), 
                new TitleStar(1, 4, 0b1000, 120), 
                new TitleStar(2, 4, 0b1100, 135),
                new TitleStar(3, 4, 0b1000, 150), 
                new TitleStar(4, 4, 0b1100, 165),
                new TitleStar(5, 4, 0b1000, 180),
                new TitleStar(6, 4, 0b1110, 195)]
                
var tsArrayG = [new TitleStar(2, 2, 0b1101, 0), 
                new TitleStar(3, 2, 0b1010, 15),
                new TitleStar(3, 1, 0b0011, 30), 
                new TitleStar(3, 0, 0b0110, 45),
                new TitleStar(2, 0, 0b1100, 60),
                new TitleStar(1, 0, 0b1100, 60), 
                new TitleStar(0, 0, 0b0101, 75), 
                new TitleStar(0, 1, 0b0011, 90), 
                new TitleStar(0, 2, 0b0011, 105),
                new TitleStar(0, 3, 0b0011, 120),
                new TitleStar(0, 4, 0b1001, 135),
                new TitleStar(1, 4, 0b1100, 150),
                new TitleStar(2, 4, 0b1100, 165),
                new TitleStar(3, 4, 0b1100, 180),
                new TitleStar(4, 4, 0b1010, 195),
                new TitleStar(4, 3, 0b0111, 210)]
var tsArrayA = [new TitleStar(2, 0, 0b1111, 0), 
                new TitleStar(1, 1, 0b0111, 15),
                new TitleStar(3, 1, 0b0111, 15), 
                new TitleStar(0, 2, 0b0101, 30),
                new TitleStar(4, 2, 0b0110, 30),
                new TitleStar(1, 2, 0b1000, 45), 
                new TitleStar(3, 2, 0b1000, 45), 
                new TitleStar(2, 2, 0b1100, 60), 
                new TitleStar(0, 3, 0b0011, 45),
                new TitleStar(4, 3, 0b0011, 45),
                new TitleStar(0, 4, 0b1011, 60),
                new TitleStar(4, 4, 0b1011, 60)]
var tsArrayM = [new TitleStar(0, 4, 0b1011, 0), 
                new TitleStar(0, 3, 0b0011, 15),
                new TitleStar(0, 2, 0b0011, 30), 
                new TitleStar(0, 1, 0b0001, 45),
                new TitleStar(0, 0, 0b0111, 60),
                new TitleStar(1, 1, 0b1110, 75), 
                new TitleStar(2, 2, 0b1111, 90), 
                new TitleStar(3, 1, 0b1101, 105), 
                new TitleStar(4, 0, 0b0111, 120),
                new TitleStar(4, 1, 0b0010, 135),
                new TitleStar(4, 2, 0b0011, 150),
                new TitleStar(4, 3, 0b0011, 165),
                new TitleStar(4, 4, 0b1011, 180)]
var tsArrayE = [new TitleStar(0, 0, 0b0101, 0), 
                new TitleStar(1, 0, 0b1100, 15),
                new TitleStar(2, 0, 0b1100, 30), 
                new TitleStar(3, 0, 0b1100, 45),
                new TitleStar(4, 0, 0b1110, 60),
                new TitleStar(0, 1, 0b0011, 15), 
                new TitleStar(0, 2, 0b0001, 30), 
                new TitleStar(0, 3, 0b0011, 45), 
                new TitleStar(0, 4, 0b1001, 60),
                new TitleStar(1, 2, 0b1100, 45),
                new TitleStar(2, 2, 0b1100, 60),
                new TitleStar(3, 2, 0b1110, 75),
                new TitleStar(1, 4, 0b1100, 75),
                new TitleStar(2, 4, 0b1100, 90),
                new TitleStar(3, 4, 0b1100, 105),
                new TitleStar(4, 4, 0b1110, 120)]
var tsArrayO = [new TitleStar(0, 1, 0b0111, 0), 
                new TitleStar(0, 2, 0b0011, 15),
                new TitleStar(0, 3, 0b1011, 30), 
                new TitleStar(1, 4, 0b1101, 45),
                new TitleStar(2, 4, 0b1100, 60),
                new TitleStar(3, 4, 0b1110, 75), 
                new TitleStar(4, 3, 0b1011, 90), 
                new TitleStar(4, 2, 0b0011, 105), 
                new TitleStar(4, 1, 0b0111, 120),
                new TitleStar(3, 0, 0b1110, 135),
                new TitleStar(2, 0, 0b1100, 150),
                new TitleStar(1, 0, 0b1101, 165)]
var tsArrayV = [new TitleStar(0, 0, 0b0111, 0), 
                new TitleStar(0, 1, 0b1011, 15),
                new TitleStar(1, 2, 0b0111, 30), 
                new TitleStar(1, 3, 0b1011, 45),
                new TitleStar(2, 4, 0b1111, 60),
                new TitleStar(3, 3, 0b1011, 75), 
                new TitleStar(3, 2, 0b0111, 90), 
                new TitleStar(4, 1, 0b1011, 105), 
                new TitleStar(4, 0, 0b0111, 120)]