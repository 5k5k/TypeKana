/**
 * Created by Morladim on 2015/1/28.
 */
function init() {
    stage = new createjs.stage("mCanvas");
    C_W = stage.canvas.width;
    C_H = stage.canvas.height;

    createjs.Ticker.on("tick", tick);
}

function tick(){

}

var stage, C_W, C_H;