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
        //container.name = i;
        //console.log("        container.name " + container.name);

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

var freedomItemWidth, freedomItemHeight;
var dataArea = [true, true, false, false, false, false];//五十平，五十片，浊平，浊片，拗平，拗片
var freedomItems = ["正/平", "正/片", "浊/平", "浊/片", "拗/平", "拗/片"];
var freedomItemTextSize;
var freedomMItems = ["开始", "范围", "速度", "间隔"];
var freedomMContainers;

function drawFreedom() {
    stage.removeAllChildren();
    //window.addEventListener("click", handleFreedom);
    freedomItemContainers = new Array();
    freedomMContainers = new Array();
    if (canvasW > canvasH / 4 * 3) {//横版
        var virtulWidth = canvasW > freedomMaxWidth ? freedomMaxWidth : canvasW;
        virtulWidth = virtulWidth > canvasH / 3 * 4 ? canvasH / 3 * 4 : virtulWidth;

        freedomItemWidth = virtulWidth * 0.8 / 4;
        freedomItemHeight = canvasH * 0.4 - 2 * virtulWidth * 0.1;
        freedomItemTextSize = freedomItemHeight * 0.625 / 3;
        for (var i = 0; i < 6; i++) {

            var container = new createjs.Container();
            var shape = new createjs.Shape();
            shape.graphics.beginFill(getFreedomItemBGColor(dataArea[i])).drawRect(freedomItemWidth / 10, 0, freedomItemWidth / 5 * 4, freedomItemHeight * 0.625);
            shape.shadow = new createjs.Shadow("#454", 0, 5, 4);

            var text = new createjs.Text(freedomItems[i], "bold " + freedomItemTextSize + "px 楷体", freedomItemTextColor);
            text.x = freedomItemWidth / 2 - freedomItemTextSize * 1.25;
            text.y = freedomItemTextSize;

            container.addChild(shape);
            container.addChild(text);
            container.x = (Math.floor(i / 2) + 1) * freedomItemWidth + virtulWidth * 0.1 + (canvasW - virtulWidth) / 2;
            container.y = i % 2 * freedomItemHeight + virtulWidth * 0.1;

            freedomItemContainers.push(container);
            stage.addChild(container);

            container.addEventListener("click", (function (num) {
                    return function (event) {
                        var flag = false;
                        for (var j = 0; j < dataArea.length; j++) {
                            if (dataArea[j] && j != num) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            return;
                        }
                        dataArea[num] ? dataArea[num] = false : dataArea[num] = true;
                        freedomItemContainers[num].getChildAt(0).graphics.beginFill(getFreedomItemBGColor(dataArea[num]))
                            .drawRect(freedomItemWidth / 10, 0, freedomItemWidth / 5 * 4, freedomItemHeight * 0.625);
                        stage.update();
                    }
                })(i)
            );
        }

        var startText = new createjs.Text(freedomMItems[0], "bold " + freedomItemTextSize + "px 楷体", freedomItemTextColor);
        startText.x = freedomItemWidth * 1.5 / 2 - freedomItemTextSize;
        startText.y = freedomItemTextSize;
        var startShape = new createjs.Shape();
        startShape.graphics.beginFill(freedomStartBGColor).drawRoundRect(0, 0, freedomItemWidth * 1.5, freedomItemHeight * 0.625, freedomItemHeight / 4);
        startShape.shadow = new createjs.Shadow("#454", 0, 5, 4);
        var startContainer = new createjs.Container();
        startContainer.addChild(startShape);
        startContainer.addChild(startText);
        startContainer.x = canvasW / 2 - freedomItemWidth * 1.5 / 2;
        startContainer.y = canvasH * 0.8 ;//+ (canvasH * 0.2 - freedomItemHeight * 0.625) / 2
        stage.addChild(startContainer);

        startContainer.addEventListener("click", function (e) {
            resetChooseMap();
            stage.removeAllChildren();
            state = inGameScreen;
            drawInGame();
        });
        freedomMContainers.push(startContainer);

        freedomAddMContainersToScreen(virtulWidth * 0.1 + (canvasW - virtulWidth) / 2, virtulWidth * 0.1, freedomMItems[1]);
        freedomAddMContainersToScreen(virtulWidth * 0.1 + (canvasW - virtulWidth) / 2, canvasH * 0.4 + (canvasH * 0.2 - freedomItemHeight * 0.625) / 2, freedomMItems[2]);
        freedomAddMContainersToScreen(virtulWidth * 0.1 + (canvasW - virtulWidth) / 2, canvasH * 0.6 + (canvasH * 0.2 - freedomItemHeight * 0.625) / 2, freedomMItems[3]);

    } else {//竖版

    }
    stage.update();
}

function freedomAddMContainersToScreen(x, y, textContent) {
    var text = new createjs.Text(textContent, "bold " + freedomItemTextSize + "px 楷体", freedomItemTextColor);
    text.x = freedomItemWidth / 2 - freedomItemTextSize;
    text.y = freedomItemTextSize;
    var container = new createjs.Container();
    container.addChild(text);
    container.x = x;
    container.y = y;
    stage.addChild(container);
    freedomMContainers.push(container);
}

function handleFreedom(e) {
    state = inGameScreen;
    //window.removeEventListener("click", handleFreedom);
    drawInGame();
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
        var kana = new Kana(chooseMap.keys[getRandom(chooseMap.size())]);
        //var kana = new Kana(chooseKana[getRandom(chooseKana.length)]);
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
    this.x = getRandom(canvasW - kana_d * 2);//*2兼容拗音
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

    //hiragana = [
    //    "あ", "い", "う", "え", "お",
    //    "か", "き", "く", "け", "こ",
    //    "さ", "し", "す", "せ", "そ",
    //    "た", "ち", "つ", "て", "と",
    //    "な", "に", "ぬ", "ね", "の",
    //    "は", "ひ", "ふ", "へ", "ほ",
    //    "ま", "み", "む", "め", "も",
    //    "や", "ゆ", "よ",
    //    "ら", "り", "る", "れ", "ろ",
    //    "わ", "を",
    //    "ん"
    //];

    //katakana = [
    //    "ア", "イ", "ウ", "エ", "オ",
    //    "カ", "キ", "ク", "ケ", "コ",
    //    "サ", "シ", "ス", "セ", "ソ",
    //    "タ", "チ", "ツ", "テ", "ト",
    //    "ナ", "ニ", "ヌ", "ネ", "ノ",
    //    "ハ", "ヒ", "フ", "ヘ", "ホ",
    //    "マ", "ミ", "ム", "メ", "モ",
    //    "ヤ", "ユ", "ヨ",
    //    "ラ", "リ", "ル", "レ", "ロ",
    //    "ワ", "ヲ",
    //    "ン"
    //];

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

    //sonant_h = [
    //    "が", "ぎ", "ぐ", "げ", "ご",
    //    "ざ", "じ", "ず", "ぜ", "ぞ",
    //    "だ", "ぢ", "づ", "で", "ど",
    //    "ば", "び", "ぶ", "べ", "ぼ",
    //    "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"
    //];

    //sonant_k = [
    //    "ガ", "ギ", "グ", "ゲ", "ゴ",
    //    "ザ", "ジ", "ズ", "ゼ", "ゾ",
    //    "ダ", "ヂ", "ヅ", "デ", "ド",
    //    "バ", "ビ", "ブ", "ベ", "ボ",
    //    "パ", "ピ", "プ", "ペ", "ポ"
    //];

    //bendSound_h = [
    //    "きゃ", "きゅ", "きょ",
    //    "しゃ", "しゅ", "しょ",
    //    "ちゃ", "ちゅ", "ちょ",
    //    "にゃ", "にゅ", "にょ",
    //    "ひゃ", "ひゅ", "ひょ",
    //    "みゃ", "みゅ", "みょ",
    //    "りゃ", "りゅ", "りょ",
    //    "ぎゃ", "ぎゅ", "ぎょ",
    //    "じゃ", "じゅ", "じょ",
    //    "びゃ", "びゅ", "びょ",
    //    "ぴゃ", "ぴゅ", "ぴょ"
    //];

    sonantMap_h = new Map();
    sonantMap_h.set("が", [[71, 65]]);//ga
    sonantMap_h.set("ぎ", [[71, 73]]);//gi
    sonantMap_h.set("ぐ", [[71, 85]]);//gu
    sonantMap_h.set("げ", [[71, 69]]);//ge
    sonantMap_h.set("ご", [[71, 79]]);//go

    sonantMap_h.set("ざ", [[90, 65]]);//za
    sonantMap_h.set("じ", [[74, 73]]);//ji
    sonantMap_h.set("ず", [[90, 85]]);//zu
    sonantMap_h.set("ぜ", [[90, 69]]);//ze
    sonantMap_h.set("ぞ", [[90, 79]]);//zo

    sonantMap_h.set("だ", [[68, 65]]);//da
    sonantMap_h.set("ぢ", [[68, 73]]);//di
    sonantMap_h.set("づ", [[68, 85]]);//du
    sonantMap_h.set("で", [[68, 69]]);//de
    sonantMap_h.set("ど", [[68, 79]]);//do

    sonantMap_h.set("ば", [[66, 65]]);//ba
    sonantMap_h.set("び", [[66, 73]]);//bi
    sonantMap_h.set("ぶ", [[66, 85]]);//bu
    sonantMap_h.set("べ", [[66, 69]]);//be
    sonantMap_h.set("ぼ", [[66, 79]]);//bo

    sonantMap_h.set("ぽ", [[80, 65]]);//pa
    sonantMap_h.set("ぴ", [[80, 73]]);//pi
    sonantMap_h.set("ぷ", [[80, 85]]);//pu
    sonantMap_h.set("ぺ", [[80, 69]]);//pe
    sonantMap_h.set("ぽ", [[80, 79]]);//po

    bendSoundMap_h = new Map();
    bendSoundMap_h.set("きゃ", [[75, 89, 65]]);//kya
    bendSoundMap_h.set("きゅ", [[75, 89, 85]]);//kyu
    bendSoundMap_h.set("きょ", [[75, 89, 79]]);//kyo

    bendSoundMap_h.set("しゃ", [[83, 72, 65]]);//sha
    bendSoundMap_h.set("しゅ", [[83, 72, 85]]);//shu
    bendSoundMap_h.set("しょ", [[83, 72, 79]]);//sho

    bendSoundMap_h.set("ちゃ", [[67, 72, 65]]);//cha
    bendSoundMap_h.set("ちゅ", [[67, 72, 85]]);//chu
    bendSoundMap_h.set("ちょ", [[67, 72, 79]]);//cho

    bendSoundMap_h.set("にゃ", [[78, 89, 65]]);//nya
    bendSoundMap_h.set("にゅ", [[78, 89, 85]]);//nyu
    bendSoundMap_h.set("にょ", [[78, 89, 79]]);//nyo

    bendSoundMap_h.set("ひゃ", [[72, 89, 65]]);//hya
    bendSoundMap_h.set("ひゅ", [[72, 89, 85]]);//hyu
    bendSoundMap_h.set("ひょ", [[72, 89, 79]]);//hyo

    bendSoundMap_h.set("みゃ", [[77, 89, 65]]);//mya
    bendSoundMap_h.set("みゅ", [[77, 89, 85]]);//myu
    bendSoundMap_h.set("みょ", [[77, 89, 79]]);//myo

    bendSoundMap_h.set("りゃ", [[82, 89, 65]]);//rya
    bendSoundMap_h.set("りゅ", [[82, 89, 85]]);//ryu
    bendSoundMap_h.set("りょ", [[82, 89, 79]]);//ryo

    bendSoundMap_h.set("ぎゃ", [[71, 89, 65]]);//gya
    bendSoundMap_h.set("ぎゅ", [[71, 89, 85]]);//gyu
    bendSoundMap_h.set("ぎょ", [[71, 89, 79]]);//gyo

    bendSoundMap_h.set("じゃ", [[74, 65]]);//ja
    bendSoundMap_h.set("じゅ", [[74, 85]]);//ju
    bendSoundMap_h.set("じょ", [[74, 79]]);//yo

    bendSoundMap_h.set("びゃ", [[66, 89, 65]]);//bya
    bendSoundMap_h.set("びゅ", [[66, 89, 85]]);//byu
    bendSoundMap_h.set("びょ", [[66, 89, 79]]);//byo

    bendSoundMap_h.set("ぴゃ", [[80, 89, 65]]);//pya
    bendSoundMap_h.set("ぴゅ", [[80, 89, 85]]);//pyu
    bendSoundMap_h.set("ぴょ", [[80, 89, 79]]);//pyo

    sonantMap_k = new Map();
    sonantMap_k.set("ガ", [[71, 65]]);//ga
    sonantMap_k.set("ギ", [[71, 73]]);//gi
    sonantMap_k.set("グ", [[71, 85]]);//gu
    sonantMap_k.set("ゲ", [[71, 69]]);//ge
    sonantMap_k.set("ゴ", [[71, 79]]);//go

    sonantMap_k.set("ザ", [[90, 65]]);//za
    sonantMap_k.set("ジ", [[74, 73]]);//ji
    sonantMap_k.set("ズ", [[90, 85]]);//zu
    sonantMap_k.set("ゼ", [[90, 69]]);//ze
    sonantMap_k.set("ゾ", [[90, 79]]);//zo

    sonantMap_k.set("ダ", [[68, 65]]);//da
    sonantMap_k.set("ヂ", [[68, 73]]);//di
    sonantMap_k.set("ヅ", [[68, 85]]);//du
    sonantMap_k.set("デ", [[68, 69]]);//de
    sonantMap_k.set("ド", [[68, 79]]);//do

    sonantMap_k.set("バ", [[66, 65]]);//ba
    sonantMap_k.set("ビ", [[66, 73]]);//bi
    sonantMap_k.set("ブ", [[66, 85]]);//bu
    sonantMap_k.set("ベ", [[66, 69]]);//be
    sonantMap_k.set("ボ", [[66, 79]]);//bo

    sonantMap_k.set("パ", [[80, 65]]);//pa
    sonantMap_k.set("ピ", [[80, 73]]);//pi
    sonantMap_k.set("プ", [[80, 85]]);//pu
    sonantMap_k.set("ペ", [[80, 69]]);//pe
    sonantMap_k.set("ポ", [[80, 79]]);//po

    bendSoundMap_k = new Map();
    bendSoundMap_k.set("キャ", [[75, 89, 65]]);//kya
    bendSoundMap_k.set("キュ", [[75, 89, 85]]);//kyu
    bendSoundMap_k.set("キョ", [[75, 89, 79]]);//kyo

    bendSoundMap_k.set("シャ", [[83, 72, 65]]);//sha
    bendSoundMap_k.set("シュ", [[83, 72, 85]]);//shu
    bendSoundMap_k.set("ショ", [[83, 72, 79]]);//sho

    bendSoundMap_k.set("チャ", [[67, 72, 65]]);//cha
    bendSoundMap_k.set("チュ", [[67, 72, 85]]);//chu
    bendSoundMap_k.set("チョ", [[67, 72, 79]]);//cho

    bendSoundMap_k.set("ニャ", [[78, 89, 65]]);//nya
    bendSoundMap_k.set("ニュ", [[78, 89, 85]]);//nyu
    bendSoundMap_k.set("ニョ", [[78, 89, 79]]);//nyo

    bendSoundMap_k.set("ヒャ", [[72, 89, 65]]);//hya
    bendSoundMap_k.set("ヒュ", [[72, 89, 85]]);//hyu
    bendSoundMap_k.set("ヒョ", [[72, 89, 79]]);//hyo

    bendSoundMap_k.set("ミャ", [[77, 89, 65]]);//mya
    bendSoundMap_k.set("ミュ", [[77, 89, 85]]);//myu
    bendSoundMap_k.set("ミョ", [[77, 89, 79]]);//myo

    bendSoundMap_k.set("リャ", [[82, 89, 65]]);//rya
    bendSoundMap_k.set("リュ", [[82, 89, 85]]);//ryu
    bendSoundMap_k.set("リョ", [[82, 89, 79]]);//ryo

    bendSoundMap_k.set("ギャ", [[71, 89, 65]]);//gya
    bendSoundMap_k.set("ギュ", [[71, 89, 85]]);//gyu
    bendSoundMap_k.set("ギョ", [[71, 89, 79]]);//gyo

    bendSoundMap_k.set("ジャ", [[74, 65]]);//ja
    bendSoundMap_k.set("ジュ", [[74, 85]]);//ju
    bendSoundMap_k.set("ジョ", [[74, 79]]);//yo

    bendSoundMap_k.set("ビャ", [[66, 89, 65]]);//bya
    bendSoundMap_k.set("ビュ", [[66, 89, 85]]);//byu
    bendSoundMap_k.set("ビョ", [[66, 89, 79]]);//byo

    bendSoundMap_k.set("パｙ", [[80, 89, 65]]);//pya
    bendSoundMap_k.set("ピュ", [[80, 89, 85]]);//pyu
    bendSoundMap_k.set("ピョ", [[80, 89, 79]]);//pyo

    allMaps = [hiraganaMap, katakanaMap, sonantMap_h, sonantMap_k, bendSoundMap_h, bendSoundMap_k];

    keycodes = [-1, -1, -1];

    chooseMap = new Map();
    //chooseMap.keys = katakanaMap.keys.concat(hiraganaMap.keys);
    //chooseMap.data = katakanaMap.data.concat(hiraganaMap.data);
    //chooseKana = katakana.concat(hiragana);

    for (var i = 0; i < katakanaMap.keys.length; i++) {
        chooseMap.set(katakanaMap.keys[i], katakanaMap.get(katakanaMap.keys[i]));
    }

    for (var i = 0; i < hiraganaMap.keys.length; i++) {
        chooseMap.set(hiraganaMap.keys[i], hiraganaMap.get(hiraganaMap.keys[i]));
    }

    //for (var i = 0; i < chooseKana.length; i++) {
    //    console.log("choose " + chooseKana[i]);
    //}

    //chooseMap = katakanaMap;
    //chooseKana = katakana;
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

function addMapToChooseMap(map) {
    for (var i = 0; i < map.keys.length; i++) {
        chooseMap.set(map.keys[i], map.get(map.keys[i]));
    }
}

function resetChooseMap() {
    chooseMap = new Map();
    for (var i = 0; i < dataArea.length; i++) {
        if (dataArea[i]) {
            addMapToChooseMap(allMaps[i]);
        }
    }
}

function getFreedomItemBGColor(bool) {
    return bool ? freedomItemBGSelectColor : freedomItemBGUnSelectColor;
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

function Map() {
    this.keys = new Array();
    this.data = new Array();

    this.set = function (key, value) {
        if (this.data[key] == null) {
            this.keys.push(key);
        }
        this.data[key] = value;
    };

    this.get = function (key) {
        return this.data[key];
    };

    this.remove = function (key) {
        this.keys.remove(key);
        this.data[key] = null;
    };

    this.isEmpty = function () {
        return this.keys.length == 0;
    };

    this.size = function () {
        return this.keys.length;
    };
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
var allMaps;

//menuScreen
var oneItemMaxWidth = 300;//menu item max width
var menuItemBGColor = "#CCFFFF", menuItemTextColor = "#000000";
var menuItemTextSize, version, versionText = "ver.0.2.0";
var menuItemContainers;

//freedomScreen
var freedomItemBGSelectColor = "#00ff00", freedomItemBGUnSelectColor = "#e4eaf2";
var freedomItemTextColor = "#000000";
var freedomMaxWidth = 980;
var freedomItemContainers;
var freedomStartBGColor = "#ff0033";