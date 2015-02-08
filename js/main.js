/**
 * Created by Morladim on 2015/1/28.
 */
function init() {
    stage = new createjs.Stage("mCanvas");
    resetCanvasSize();
    resetKanaWidth();

    containers = new Array();
    containers[0] = createKana();
    stage.addChild(containers[0]);
    stage.update();
    createjs.Ticker.on("tick", tick);

}

function tick() {
    containers[0].y += 3;
    console.log("y "+    containers[0].y);
    stage.update();
}


function createKana() {
    var container = new createjs.Container();
//    var circle =new createjs.shape().graphics.f("green").dc(0,0,50);
//    circle.x=200;
//    circle.y=200;
    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, kana_r);
    circle.x = kana_r;
    circle.y = kana_r;

    var text = new createjs.Text("a", "bold " + kana_d + "px Arial", "#ff7700");
    container.addChild(circle);
    container.addChild(text);

    container.x = 100;
    container.y = -kana_d;
    return container;
}

window.onresize = function () {
    resetCanvasSize();
    resetKanaWidth();

    stage.update();

//    console.log("a C_W " + C_W + " C_H" + C_H);
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

var stage, canvasW, canvasH, kana_d, kana_r, containers;
var amount = 10; //一屏幕宽能同时放多少个假名