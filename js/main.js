/**
 * Created by Morladim on 2015/1/28.
 */
function init() {
    initData();
    stage = new createjs.Stage("mCanvas");
    resetCanvasSize();

    initScreen();
    //resetKanaWidth();
    //initText();

    //createjs.Ticker.on("tick", tick);
    //createjs.Ticker.framerate = fps;

    window.addEventListener("keydown", function (event) {
        event = event || window.event;
        for (var i = keycodes.length - 1; i > 0; i--) {
            keycodes[i] = keycodes[i - 1];
        }
        keycodes[0] = event.keyCode;

        //        console.log(keycodes);
        for (var i = 0; i < kanas.length; i++) {
            for (var j = 0; j < kanas[i].keyCodes.length; j++) {
                //                var k1 = kanas[i].keyCodes[j];
                //                var k2 = keycodes.slice(0, kanas[i].keyCodes[j].length).reverse();
                ////                console.log("k1 " + );
                ////                console.log("k2 " +);
                var equal = true;
                for (var k = 0; k < kanas[i].keyCodes[j].length; k++) {
                    if (kanas[i].keyCodes[j][k] != keycodes.slice(0, kanas[i].keyCodes[j].length).reverse()[k]) {
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

    //为了解决最小化不走onblur和onfocus，不能删除
    document.addEventListener('msvisibilitychange', function () {
        //        console.log(document.msVisibilityState);
    });

    document.addEventListener('mozvisibilitychange', function () {
        //        console.log(document.mozVisibilityState);
    });

    document.addEventListener('webkitvisibilitychange', function () {
        //        console.log(document.webkitVisibilityState);
    });
}

var menuItems = ["闯关模式", "自由模式", "更多设置", "关于信息"];
var backText = "返回";
var oneItemHeight, oneItemWidth;

function initScreen() {
    state = menuScreen;
    oneItemHeight = canvasH / (menuItems.length + 2 - 0.375);
    oneItemWidth = canvasW / 2;
    oneItemWidth = oneItemWidth > oneItemMaxWidth ? oneItemMaxWidth : oneItemWidth;
    menuItemTextSize = oneItemHeight * 0.625 / 3;

    drawMenu();
}

function drawMenu() {
    stage.removeAllChildren();
    menuItemContainers = new Array();
    for (var i = 0; i < menuItems.length; i++) {
        var container = new createjs.Container();

        var shape = new createjs.Shape();
        shape.graphics.beginFill(menuItemBGColor).drawRect(0, 0, oneItemWidth, oneItemHeight * 0.625);
        shape.shadow = new createjs.Shadow("#454", 0, 5, 4);

        var text = new createjs.Text(menuItems[i], "bold " + menuItemTextSize + "px 楷体", menuItemTextColor);
        text.x = oneItemWidth / 2 - menuItemTextSize * 2;
        text.y = menuItemTextSize;

        container.addChild(shape);
        container.addChild(text);
        container.x = (canvasW - oneItemWidth) / 2;
        container.y = (i + 1) * oneItemHeight;
        container.name = i;
        console.log("        container.name " + container.name);

        menuItemContainers.push(container);
        stage.addChild(container);

        container.addEventListener("click", (function (num) {
                return function (event) {
                    console.log("this.name " + num);
                    switch (num) {
                    case 0:
                        drawLevels();
                        break;
                    case 1:
                        state = freedomScreen;
                        drawFreedom();
                        break;
                    case 2:
                        drawSet();
                        break;
                    case 3:
                        drawAbout();
                        break;
                    }
                }
            })(i)
        );

    }

    version = new createjs.Text(versionText, "bold " + menuItemTextSize / 2 + "px 楷体", menuItemTextColor);
    version.x = 0;
    version.y = canvasH - menuItemTextSize / 2;
    stage.addChild(version);
    stage.update();
}

function drawLevels() {

}

function drawFreedom() {
    stage.removeAllChildren();
    window.addEventListener("click", function (e) {
        state = inGameScreen;
        drawInGame();
    });

    stage.update();
}

function drawInGame() {
    resetKanaWidth();
    initText();

    createjs.Ticker.on("tick", tick);
    createjs.Ticker.framerate = fps;
}

function tick(event) {
    if (event.paused) {
        return;
    }
    currentDate = new Date();
    //    var kana = null;
    if (currentDate - lastDate - createjs.Ticker.getTime(false) + createjs.Ticker.getTime(true) > appearTime) {
        lastDate = currentDate - createjs.Ticker.getTime(false) + createjs.Ticker.getTime(true);
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
    //resetKanaWidth();
    //resetTexts();
    if (state == inGameScreen) {
        resetKanaWidth();
        resetTexts();
    }
    stage.update();
};

window.onblur = function (e) {
    e = e || window.event;
    if (window.ActiveXObject && /MSIE/.test(navigator.userAgent)) {  //IE
        //如果 blur 事件是窗口内部的点击所产生，返回 false, 也就是说这是一个假的 blur
        var x = e.clientX;
        var y = e.clientY;
        var w = document.body.clientWidth;
        var h = document.body.clientHeight;

        if (x >= 0 && x <= w && y >= 0 && y <= h) {
            window.focus();
            return false;
        }
    }

    //    var paused = !createjs.Ticker.getPaused();
    //    createjs.Ticker.setPaused(paused);
    createjs.Ticker.paused = true;
    console.log("onblur");
}

window.onfocus = function () {
    createjs.Ticker.paused = false;
    console.log("onfocus");
}

function resetCanvasSize() {
    document.getElementById("mCanvas").width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    document.getElementById("mCanvas").height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    canvasW = stage.canvas.width;
    canvasH = stage.canvas.height;
}

function resetKanaWidth() {
    kana_d = (canvasW > canvasH ? canvasH : canvasW) / amount;
    kana_r = kana_d / 2;
}

//Kana类
function Kana(name) {
    this.name = name;
    this.x = getRandom(canvasW - kana_d);
    this.y = -kana_d;
    this.speed = 10;//经过几秒会落到底部
    this.perStepLength = canvasH / this.speed / fps;
    //        getPerStepLength();
    console.log("create " + name);
    this.keyCodes = chooseMap.get(name);

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
    hiraganaMap.set("あ", [[65]]);//a
    hiraganaMap.set("い", [[73]]);//i
    hiraganaMap.set("う", [[85]]);//u
    hiraganaMap.set("え", [[69]]);//e
    hiraganaMap.set("お", [[79]]);//o

    hiraganaMap.set("か", [[75, 65]]);//ka
    hiraganaMap.set("き", [[75, 73]]);//ki
    hiraganaMap.set("く", [[75, 85]]);//ku
    hiraganaMap.set("け", [[75, 69]]);//ke
    hiraganaMap.set("こ", [[75, 79]]);//ko

    hiraganaMap.set("さ", [[83, 65]]);//sa
    hiraganaMap.set("し", [[83, 72, 73], [83, 73]]);//shi si
    hiraganaMap.set("す", [[83, 85]]);//su
    hiraganaMap.set("せ", [[83, 69]]);//se
    hiraganaMap.set("そ", [[83, 79]]);//so

    hiraganaMap.set("た", [[84, 65]]);//ta
    hiraganaMap.set("ち", [[67, 72, 73], [67, 73]]);//chi ti
    hiraganaMap.set("つ", [[84, 83, 85], [84, 85]]);//tsu tu
    hiraganaMap.set("て", [[84, 69]]);//te
    hiraganaMap.set("と", [[84, 79]]);//to

    hiraganaMap.set("な", [[78, 65]]);//na
    hiraganaMap.set("に", [[78, 73]]);//ni
    hiraganaMap.set("ぬ", [[78, 85]]);//nu
    hiraganaMap.set("ね", [[78, 69]]);//ne
    hiraganaMap.set("の", [[78, 79]]);//no

    hiraganaMap.set("は", [[72, 65]]);//ha
    hiraganaMap.set("ひ", [[72, 73]]);//hi
    hiraganaMap.set("ふ", [[70, 85], [72, 85]]);//fu hu
    hiraganaMap.set("へ", [[72, 69]]);//he
    hiraganaMap.set("ほ", [[72, 79]]);//ho

    hiraganaMap.set("ま", [[77, 65]]);//ma
    hiraganaMap.set("み", [[77, 73]]);//mi
    hiraganaMap.set("む", [[77, 85]]);//mu
    hiraganaMap.set("め", [[77, 69]]);//me
    hiraganaMap.set("も", [[77, 79]]);//mo

    hiraganaMap.set("や", [[89, 65]]);//ya
    hiraganaMap.set("ゆ", [[89, 85]]);//yu
    hiraganaMap.set("よ", [[89, 79]]);//yo

    hiraganaMap.set("ら", [[82, 65]]);//ra
    hiraganaMap.set("り", [[82, 73]]);//ri
    hiraganaMap.set("る", [[82, 85]]);//ru
    hiraganaMap.set("れ", [[82, 69]]);//re
    hiraganaMap.set("ろ", [[82, 79]]);//ro

    hiraganaMap.set("わ", [[87, 65]]);//wa
    hiraganaMap.set("を", [[87, 79]]);//wo

    hiraganaMap.set("ん", [[78, 78]]);//nn

    hiragana = [
        "あ", "い", "う", "え", "お",
        "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ",
        "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の",
        "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も",
        "や", "ゆ", "よ",
        "ら", "り", "る", "れ", "ろ",
        "わ", "を",
        "ん"
    ];

    katakana = [
        "ア", "イ", "ウ", "エ", "オ",
        "カ", "キ", "ク", "ケ", "コ",
        "サ", "シ", "ス", "セ", "ソ",
        "タ", "チ", "ツ", "テ", "ト",
        "ナ", "ニ", "ヌ", "ネ", "ノ",
        "ハ", "ヒ", "フ", "ヘ", "ホ",
        "マ", "ミ", "ム", "メ", "モ",
        "ヤ", "ユ", "ヨ",
        "ラ", "リ", "ル", "レ", "ロ",
        "ワ", "ヲ",
        "ン"
    ];

    katakanaMap = new Map();
    katakanaMap.set("ア", [[65]]);//a
    katakanaMap.set("イ", [[73]]);//i
    katakanaMap.set("ウ", [[85]]);//u
    katakanaMap.set("エ", [[69]]);//e
    katakanaMap.set("オ", [[79]]);//o

    katakanaMap.set("カ", [[75, 65]]);//ka
    katakanaMap.set("キ", [[75, 73]]);//ki
    katakanaMap.set("ク", [[75, 85]]);//ku
    katakanaMap.set("ケ", [[75, 69]]);//ke
    katakanaMap.set("コ", [[75, 79]]);//ko

    katakanaMap.set("サ", [[83, 65]]);//sa
    katakanaMap.set("シ", [[83, 72, 73], [83, 73]]);//shi si
    katakanaMap.set("ス", [[83, 85]]);//su
    katakanaMap.set("セ", [[83, 69]]);//se
    katakanaMap.set("ソ", [[83, 79]]);//so

    katakanaMap.set("ナ", [[84, 65]]);//ta
    katakanaMap.set("チ", [[67, 72, 73], [67, 73]]);//chi ti
    katakanaMap.set("ツ", [[84, 83, 85], [84, 85]]);//tsu tu
    katakanaMap.set("テ", [[84, 69]]);//te
    katakanaMap.set("ト", [[84, 79]]);//to

    katakanaMap.set("ナ", [[78, 65]]);//na
    katakanaMap.set("ニ", [[78, 73]]);//ni
    katakanaMap.set("ヌ", [[78, 85]]);//nu
    katakanaMap.set("ネ", [[78, 69]]);//ne
    katakanaMap.set("ノ", [[78, 79]]);//no

    katakanaMap.set("ハ", [[72, 65]]);//ha
    katakanaMap.set("ヒ", [[72, 73]]);//hi
    katakanaMap.set("フ", [[70, 85], [72, 85]]);//fu hu
    katakanaMap.set("ヘ", [[72, 69]]);//he
    katakanaMap.set("ホ", [[72, 79]]);//ho

    katakanaMap.set("マ", [[77, 65]]);//ma
    katakanaMap.set("ミ", [[77, 73]]);//mi
    katakanaMap.set("ム", [[77, 85]]);//mu
    katakanaMap.set("メ", [[77, 69]]);//me
    katakanaMap.set("モ", [[77, 79]]);//mo

    katakanaMap.set("ヤ", [[89, 65]]);//ya
    katakanaMap.set("ユ", [[89, 85]]);//yu
    katakanaMap.set("ヨ", [[89, 79]]);//yo

    katakanaMap.set("ラ", [[82, 65]]);//ra
    katakanaMap.set("リ", [[82, 73]]);//ri
    katakanaMap.set("ル", [[82, 85]]);//ru
    katakanaMap.set("レ", [[82, 69]]);//re
    katakanaMap.set("ロ", [[82, 79]]);//ro

    katakanaMap.set("ワ", [[87, 65]]);//wa
    katakanaMap.set("ヲ", [[87, 79]]);//wo

    katakanaMap.set("ン", [[78, 78]]);//nn

    sonant_h = [
        "が", "ぎ", "ぐ", "げ", "ご",
        "ざ", "じ", "ず", "ぜ", "ぞ",
        "だ", "ぢ", "づ", "で", "ど",
        "ば", "び", "ぶ", "べ", "ぼ",
        "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"
    ];

    sonant_k = [
        "ガ", "ギ", "グ", "ゲ", "ゴ",
        "ザ", "ジ", "ズ", "ゼ", "ゾ",
        "ダ", "ヂ", "ヅ", "デ", "ド",
        "バ", "ビ", "ブ", "ベ", "ボ",
        "パ", "ピ", "プ", "ペ", "ポ"
    ];

    bendSound_h = [
        "きゃ", "きゅ", "きょ",
        "しゃ", "しゅ", "しょ",
        "ちゃ", "ちゅ", "ちょ",
        "にゃ", "にゅ", "にょ",
        "ひゃ", "ひゅ", "ひょ",
        "みゃ", "みゅ", "みょ",
        "りゃ", "りゅ", "りょ",
        "ぎゃ", "ぎゅ", "ぎょ",
        "じゃ", "じゅ", "じょ",
        "びゃ", "びゅ", "びょ",
        "ぴゃ", "ぴゅ", "ぴょ"
    ];

    keycodes = [-1, -1, -1];

    chooseMap = katakanaMap;
    chooseKana = katakana;
    //    chooseMap = hiraganaMap;
    //    chooseKana = hiragana;
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

function resetTexts() {
    key.y = canvasH - keyTextSize;
    great.y = canvasH - keyTextSize;
    miss.y = canvasH - keyTextSize;
    for (var i = 0; i < kanas.length; i++) {
        kanas[i].getInstance().getChildAt(0).font = "bold " + kana_d + "px Arial";
    }
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
    return Math.floor(Math.random() * length);
}

var stage, canvasW, canvasH, kana_d, kana_r, kanas;
var amount = 10; //一屏幕宽能同时放多少个假名
var fps = 30;
var appearTime = 3000;//ms
var currentDate = 0, lastDate = 0;
var state, menuScreen = 0, inGameScreen = 1, levelsScreen = 2, freedomScreen = 3, setScreen = 4, aboutScreen = 5;

var keycodes;
var key;
var keyText = "key:";
var keyTextSize = 16;
var great, miss;
var greatText = "hit:", missText = "miss:";
var keyX = 0, greatX = 80, missX = 140;
var greatNum = 0, missNum = 0;

var hiraganaMap, hiragana;
var chooseMap, chooseKana;
var katakanaMap, katakana;
var sonantMap_h, sonant_h;//浊音
var bendSoundMap_h, bendSound_h;//拗音
var sonantMap_k, sonant_k;//浊音
var bendSoundMap_k, bendSound_k;//拗音

var oneItemMaxWidth = 300;
var menuItemBGColor = "#CCFFFF", menuItemTextColor = "#000000";
var menuItemTextSize, version, versionText = "ver.0.2.0";
var menuItemContainers;