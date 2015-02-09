/**
 * Created by Morladim on 2015/1/28.
 */
function init() {
    initData();
    stage = new createjs.Stage("mCanvas");
    resetCanvasSize();
    resetKanaWidth();
    initText();

    createjs.Ticker.on("tick", tick);
    createjs.Ticker.framerate = fps;

    window.addEventListener("keydown", function (event) {
        event = event || window.event;
        for (var i = keycodes.length - 1; i > 0; i--) {
            keycodes[i] = keycodes[i - 1];
        }
        keycodes[0] = event.keyCode;

//        console.log(keycodes);
        for (var i = 0; i < kanas.length; i++) {
            for (var j = 0; j < kanas[i].keyCodes.length; j++) {
                var k1 = kanas[i].keyCodes[j];
                var k2 = keycodes.slice(0, kanas[i].keyCodes[j].length).reverse();
//                console.log("k1 " + );
//                console.log("k2 " +);
                var equal = true;

                for (var k = 0; k < k1.length; k++) {
                    if (k1[k] != k2[k]) {
                        equal = false;
                        break;
                    }
                }
                if (equal) {
                    console.log("hit");
//                    for (var i = keycodes.length - 1; i >= 0; i--) {
//                        keycodes[i] = -1;
//                    }
                    kanas[i].destroy();
                    kanas.splice(i, 1);
                    greatNum++;
                    break;
                }
            }
        }
        key.text = keyText + changeKeycodesToChars();
        great.text = greatText + greatNum;
    });

//    console.log(Hiragana.keys[0][0]);
//    console.log(Hiragana.keys.length);
//    console.log(Hiragana.keys[7]);
//    console.log(Hiragana.keys[9]);
//    Hiragana = new Map();
//    Hiragana.set("aa",["bb","cc"]);

//    console.log(    Hiragana.get("aa")[0]);
}

function tick() {
    currentDate = new Date();
//    var kana = null;
    if (currentDate - lastDate > appearTime) {
        lastDate = currentDate;
//        console.log(hiragana[getRandom(hiragana.length)]);

//        console.log(canvasH + " " + kana_d);
        var kana = new Kana(hiragana[getRandom(hiragana.length)]);
        kanas[kanas.length] = kana;
        stage.addChild(kana.getInstance());
    }

//    if (currentDate - lastDate > appearTime) {
//        kana = new Kana("a", 100);
//        kanas.addChild(kana);
//        stage.addChild(kana.getInstance());
//    }
//    if (kana != null && kana.getInstance() != null) {
////        kana.setY(kana.getY() + 3);
//        kana.goNext();
//    }

    for (var i = 0; i < kanas.length; i++) {
        if (kanas[i] != null && kanas[i].getInstance() != null) {
            kanas[i].goNext();
//            xx
            if (kanas[i].checkDied()) {
                kanas[i].destroy();
                kanas.splice(i, 1);
                missNum++;
                miss.text = missText + missNum;
            }
        }
    }


//    kanas.forEach(function (value, index, ar) {
//        var k = value;
//        if (k != null && k.getInstance() != null) {
//            k.goNext();
//            console.log(1);
//        }
//    });

//    console.log("y " + date.getTime());
    stage.update();


}

window.onresize = function () {
    resetCanvasSize();
    resetKanaWidth();
    stage.update();
};

function resetCanvasSize() {
    document.getElementById("mCanvas").width = document.body.clientWidth;
    document.getElementById("mCanvas").height = document.body.clientHeight/10*9;
//    document.getElementById("mCanvas").height = document.body.clientHeight / 2;
    canvasW = stage.canvas.width;
    canvasH = stage.canvas.height;
}

function resetKanaWidth() {
    kana_d = canvasW / amount;
    kana_r = kana_d / 2;
}

//Kana类
function Kana(name) {
    this.name = name;
    this.x = getRandom(canvasW - kana_d);
//    this.x = x;
    this.y = -kana_d;
    this.speed = 10;//经过几秒会落到底部
    this.perStepLength = canvasH / this.speed / fps;
//        getPerStepLength();
    console.log(name);
    this.keyCodes = hiraganaMap.get(name);
//    console.log(this.keyCodes);

    this.getInstance = function () {
        return container;
    };
    this.destroy = function () {
        container.removeAllChildren();
        container = null;
    };
    this.goNext = function () {
        this.y += this.perStepLength;
        container.y = this.y;
    };
    this.checkDied = function () {
        if (container.y + kana_d > canvasH) {
            return true;
        } else {
            return false;
        }
    };

    var container = new createjs.Container();
//    var circle = new createjs.Shape();
//    circle.graphics.beginFill("red").drawCircle(0, 0, kana_r);
//    circle.x = kana_r;
//    circle.y = kana_r;
    var text = new createjs.Text(name, "bold " + kana_d + "px Arial", "#000000");
//    container.addChild(circle);
    container.addChild(text);
    container.x = this.x;
    container.y = this.y;
}

function Map() {
    this.keys = new Array();
    this.data = new Array();
    //添加键值对
    this.set = function (key, value) {
        if (this.data[key] == null) {//如键不存在则身【键】数组添加键名
//            this.keys.push(key);
            this.keys.push(value);
        }
        this.data[key] = value;//给键赋值
    };
    //获取键对应的值
    this.get = function (key) {
        return this.data[key];
    };
    //去除键值，(去除键数据中的键名及对应的值)
    this.remove = function (key) {
        this.keys.remove(key);
        this.data[key] = null;
    };
    //判断键值元素是否为空
    this.isEmpty = function () {
        return this.keys.length == 0;
    };
    //获取键值元素大小
    this.size = function () {
        return this.keys.length;
    };
}

function initData() {
    kanas = new Array();

    hiraganaMap = new Map();
    hiraganaMap.set("あ", [
        [65]
    ]);//a
    hiraganaMap.set("い", [
        [73]
    ]);//i
    hiraganaMap.set("う", [
        [85]
    ]);//u
    hiraganaMap.set("え", [
        [69]
    ]);//e
    hiraganaMap.set("お", [
        [79]
    ]);//o

    hiraganaMap.set("か", [
        [75, 65]
    ]);//ka
    hiraganaMap.set("き", [
        [75, 73]
    ]);//ki
    hiraganaMap.set("く", [
        [75, 85]
    ]);//ku
    hiraganaMap.set("け", [
        [75, 69]
    ]);//ke
    hiraganaMap.set("こ", [
        [75, 79]
    ]);//ko

    hiraganaMap.set("さ", [
        [83, 65]
    ]);//sa
    hiraganaMap.set("し", [
        [83, 72, 73]
    ]);//shi
    hiraganaMap.set("す", [
        [83, 85]
    ]);//su
    hiraganaMap.set("せ", [
        [83, 69]
    ]);//se
    hiraganaMap.set("そ", [
        [83, 79]
    ]);//so

    hiraganaMap.set("た", [
        [84, 65]
    ]);//ta
    hiraganaMap.set("ち", [
        [67, 72, 73]
    ]);//chi
    hiraganaMap.set("つ", [
        [84, 83, 85]
    ]);//tsu
    hiraganaMap.set("て", [
        [84, 69]
    ]);//te
    hiraganaMap.set("と", [
        [84, 79]
    ]);//to

    hiraganaMap.set("な", [
        [78, 65]
    ]);//na
    hiraganaMap.set("に", [
        [78, 73]
    ]);//ni
    hiraganaMap.set("ぬ", [
        [78, 85]
    ]);//nu
    hiraganaMap.set("ね", [
        [78, 69]
    ]);//ne
    hiraganaMap.set("の", [
        [78, 79]
    ]);//no

    hiraganaMap.set("は", [
        [72, 65]
    ]);//ha
    hiraganaMap.set("ひ", [
        [72, 73]
    ]);//hi
    hiraganaMap.set("ふ", [
        [70, 85]
    ]);//fu
    hiraganaMap.set("へ", [
        [72, 69]
    ]);//he
    hiraganaMap.set("ほ", [
        [72, 79]
    ]);//ho

    hiraganaMap.set("ま", [
        [77, 65]
    ]);//ma
    hiraganaMap.set("み", [
        [77, 73]
    ]);//mi
    hiraganaMap.set("む", [
        [77, 85]
    ]);//mu
    hiraganaMap.set("め", [
        [77, 69]
    ]);//me
    hiraganaMap.set("も", [
        [77, 79]
    ]);//mo

    hiraganaMap.set("や", [
        [89, 65]
    ]);//ya
    hiraganaMap.set("ゆ", [
        [89, 85]
    ]);//yu
    hiraganaMap.set("よ", [
        [89, 79]
    ]);//yo

    hiraganaMap.set("ら", [
        [82, 65]
    ]);//ra
    hiraganaMap.set("り", [
        [82, 73]
    ]);//ri
    hiraganaMap.set("る", [
        [82, 85]
    ]);//ru
    hiraganaMap.set("れ", [
        [82, 69]
    ]);//re
    hiraganaMap.set("ろ", [
        [82, 79]
    ]);//ro

    hiraganaMap.set("わ", [
        [87, 65]
    ]);//wa

    hiraganaMap.set("ん", [
        [78, 78]
    ]);//nn

    hiragana = [
        "あ", "い", "う", "え", "お"
        ,
        "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ",
        "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の",
        "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も",
        "や", "ゆ", "よ",
        "ら", "り", "る", "れ", "ろ",
        "わ",
        "ん"
    ];

    keycodes = [-1, -1, -1];
}

function initText() {
    key = new createjs.Text(keyText, "bold " + keyTextSize + "px Arial", "#000000");
    key.x = keyX;
    key.y = canvasH - keyTextSize;
    stage.addChild(key);

    great = new createjs.Text(greatText + greatNum, "bold " + keyTextSize + "px Arial", "#000000");
    great.x = greatX;
    great.y = canvasH - keyTextSize;
    stage.addChild(great);

    miss = new createjs.Text(missText + missNum, "bold " + keyTextSize + "px Arial", "#000000");
    miss.x = missX;
    miss.y = canvasH - keyTextSize;
    stage.addChild(miss);
}
function changeKeycodesToChars() {
    var str = "";
    for (var i = keycodes.length - 1; i >= 0; i--) {

        if (keycodes[i] > 64 && keycodes[i] < 91) {
            str += String.fromCharCode(keycodes[i] + 32);
        }
    }
    return str;
}

function getRandom(length) {
    return   Math.floor(Math.random() * length);
}

var stage, canvasW, canvasH, kana_d, kana_r, kanas;
var amount = 10; //一屏幕宽能同时放多少个假名
var fps = 30;
var appearTime = 10000;//ms
var currentDate = 0, lastDate = 0;

var hiraganaMap, hiragana;
var keycodes;
var key;
var keyText = "key:";
var keyTextSize = 16;
var great, miss;
var greatText = "hit:", missText = "miss:";
var keyX = 0, greatX = 80, missX = 140;
var greatNum = 0, missNum = 0;

var Katakana;