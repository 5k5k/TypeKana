/**
 * Created by Morladim on 2015/1/28.
 */
function init() {
    stage = new createjs.Stage("mCanvas");
    resetCanvasSize();
    resetKanaWidth();

    kanas = new Array();
    kana = new Kana("a", 100);
    stage.addChild(kana.getInstance());
    stage.update();
    createjs.Ticker.on("tick", tick);
    createjs.Ticker.framerate = fps;

    window.addEventListener("keydown", function (event) {
        event = event || window.event;
        if (event.keyCode === kana.keyCode) {
//            man.jump();
            console.log("a");
            kana.destroy();
        }
    });
}

function tick() {
    currentDate = new Date();

//    if (currentDate - lastDate > appearTime) {
//        kana = new Kana("a", 100);
//        kanas.addChild(kana);
//        stage.addChild(kana.getInstance());
//    }
    if (kana.getInstance() != null) {
//        kana.setY(kana.getY() + 3);
        kana.goNext();
    }

//    console.log("y " + date.getTime());
    stage.update();
}

window.onresize = function () {
    resetCanvasSize();
    resetKanaWidth();
    stage.update();
}

function resetCanvasSize() {
    document.getElementById("mCanvas").width = document.body.clientWidth;
    document.getElementById("mCanvas").height = document.body.clientHeight / 2;
    canvasW = stage.canvas.width;
    canvasH = stage.canvas.height;
}

function resetKanaWidth() {
    kana_d = canvasW / amount;
    kana_r = kana_d / 2;
}

//Kana类
function Kana(name, x) {
    this.name = name;
    this.x = x;
    this.y = -kana_d;
    this.speed = 10;//经过几秒会落到底部
    this.perStepLength = canvasH / this.speed / fps;
//        getPerStepLength();
    this.keyCode = 65;
    this.getInstance = function () {
        return container;
    }
//    this.setY = function (y) {
//        this.y = y;
//        container.y = y;
//    }
//    this.getY = function () {
//        return container.y;
//    }
    this.destroy = function () {
        container.removeAllChildren();
        container = null;
    }
    this.goNext = function () {
//        console.log("a " + this.perStepLength)
        this.y += this.perStepLength;
        container.y = this.y;
    }


    var container = new createjs.Container();
    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, kana_r);
    circle.x = kana_r;
    circle.y = kana_r;
    var text = new createjs.Text(name, "bold " + kana_d + "px Arial", "#ff7700");
    container.addChild(circle);
    container.addChild(text);
    container.x = x;
    container.y = this.y;

//    function getPerStepLength() {
//        console.log("canvasH "+canvasH+" "+this.speed+" "+fps);
//        return  canvasH / this.speed / fps;
//    }
}

var stage, canvasW, canvasH, kana_d, kana_r, kanas;
var amount = 10; //一屏幕宽能同时放多少个假名
var fps = 30;
var appearTime = 1000;//ms
var currentDate, lastDate = 0;