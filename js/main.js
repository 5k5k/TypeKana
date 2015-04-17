/**
 * Created by Morladim on 2015/1/28.
 */
function init() {
    initData();
    stage = new createjs.Stage("mCanvas");
    resetCanvasSize();
    initScreen();
    addWindowListeners();
}

function addWindowListeners() {
    window.addEventListener("keydown", function (event) {
        event = event || window.event;
        if (state == levelsScreen) {
            cheatCodeArray.push(event.keyCode);
            console.log(event.keyCode);
            if (cheatCodeArray.length >= cheatCodes.length) {
                for (var i = cheatCodeArray.length - cheatCodes.length, j = 0; i < cheatCodeArray.length; i++, j++) {
                    console.log("cheatCodes " + cheatCodes[j]);
                    if (cheatCodeArray[i] != cheatCodes[j]) {
                        return;
                    }
                }

                console.log("cheat mode on");
                cheatMode = true;
                levelProgress = loadProgress();
                drawLevels();
                stage.update();
            }
        }
        if (state != inGameScreen) {
            return;
        }

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
                    great.text = greatText + greatNum;
                    resetHitRate();
                    currentComboNum++;
                    if (currentComboNum > maxComboNum) {
                        maxComboNum = currentComboNum;
                    }
                    currentCombo.text = currentComboText + currentComboNum;
                    maxCombo.text = maxComboText + maxComboNum;
                    break;
                }
            }
        }
        key.text = keyText + changeKeycodesToChars();
        //great.text = greatText + greatNum;
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

function initScreen() {
    state = menuScreen;
    initMenuData();
    drawMenu();
}

function initMenuData() {
    oneItemHeight = canvasH / (menuItems.length + 2 - 0.375);
    oneItemWidth = canvasW / 2;
    oneItemWidth = oneItemWidth > oneItemMaxWidth ? oneItemMaxWidth : oneItemWidth;
    menuItemTextSize = oneItemHeight * 0.625 / 3;
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

        container.addEventListener("click", (function (num) {
            return function (event) {
                //console.log("this.name " + num);
                switch (num) {
                case 0:
                    state = levelsScreen;
                    cheatCodeArray = new Array();
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
        })(i));

        menuItemContainers.push(container);
        stage.addChild(container);
    }

    version = new createjs.Text(versionText, "bold " + menuItemTextSize / 2 + "px 楷体", menuItemTextColor);
    version.x = 0;
    version.y = canvasH - menuItemTextSize;
    stage.addChild(version);
    stage.update();
}

//levelScreen
var levelsPerLine = 5;
var levelsPerPage = 25;//check
var levelWidth, levelHeight;
var levelChooseAbleColor = "green";
var levelChooseDisableColor = "#a0a0a0";
var levelProgress = 0;
var levelFontColor = "black";
var currentLevelPage = 1;

function drawLevels() {
    stage.removeAllChildren();
    var contentWidth = canvasH / 8 * 5 > canvasW ? canvasW : canvasH / 8 * 5;
    var contentHeight = contentWidth;
    var topD = (canvasH) / 8;
    var leftD = (canvasW - contentWidth) / 2;

    levelWidth = contentWidth / levelsPerLine;
    levelHeight = contentHeight / levelsPerLine;

    var levelContainers = new Array();
    var spaceW = levelWidth / 8;
    var spaceH = levelHeight / 8;
    var fontSize = levelHeight / 2;

    var totalPages = Math.ceil(levelGames.length / levelsPerPage);
    //=
    var pageContainerWidth = levelWidth * 3;
    var pageContaineHeight = levelHeight / 2;
    var pageContainerX = (canvasW - pageContainerWidth) / 2;
    var pageContainerY = (canvasH) / 32 * 27;
    //var pageContainerY = (canvasH) / 8 * 7;
    //var levelsOnScreen=new Array();

    var pageContainer = new SelectContainer(pageContainerX, pageContainerY, pageContainerWidth, pageContaineHeight, currentLevelPage, 1, totalPages, 1, false);
    pageContainer.clickCallback = function () {

        if (currentLevelPage != this.num) {
            currentLevelPage = this.num;

            for (var i = 0; i < levelContainers.length; i++) {
                stage.removeChild(levelContainers[i]);
            }
            drawOnePageLevels();
            stage.update();
        }
        //randomGame.speed = 10 - speedContainer.num;
        console.log("currentLevelPage " + currentLevelPage);
    };
//=
    stage.addChild(pageContainer.getInstance());

    addBackButton(function () {
        state = menuScreen;
        drawMenu();
    });

    drawOnePageLevels();
    //for (var i = 0; i < levelGames.length; i++) {
    //    var hNum = Math.floor(i % levelsPerLine);
    //    var vNum = Math.floor(i / levelsPerLine);
    //
    //    var container = new createjs.Container();
    //    var shape = new createjs.Shape();
    //    shape.graphics.beginFill(i > levelProgress ? levelChooseDisableColor : levelChooseAbleColor).drawRect(0, 0, levelWidth - 2 * spaceW, levelHeight - 2 * spaceH);
    //    shape.shadow = new createjs.Shadow("#454", 0, 5, 4);
    //
    //    var text = new createjs.Text(i + 1, "bold " + fontSize + "px 楷体", levelFontColor);
    //    text.x = (levelWidth - 2 * spaceW) / 2 - fontSize / 2 / 2 * (i + 1 + "").length;
    //    text.y = spaceH;
    //
    //    container.addChild(shape);
    //    container.addChild(text);
    //    container.x = leftD + hNum * levelWidth + spaceW;
    //    container.y = topD + vNum * levelHeight + spaceH;
    //
    //    levelContainers.push(container);
    //    stage.addChild(container);
    //
    //    container.addEventListener("click", (function (which) {
    //        return function (event) {
    //            if (which > levelProgress) {
    //                return;
    //            }
    //            //=
    //            currentGame = levelGames[which];
    //            setCurrentGameData();
    //            stage.removeAllChildren();
    //
    //            initTicker();
    //            state = readyScreen;
    //            drawReadyScreen();
    //        }
    //    })(i));
    //}

    function drawOnePageLevels() {
        levelContainers = new Array();
        var large = currentLevelPage * levelsPerPage > levelGames.length ? levelGames.length : currentLevelPage * levelsPerPage;
        for (var i = (currentLevelPage - 1) * levelsPerPage; i < large; i++) {
            var hNum = Math.floor(i % levelsPerPage % levelsPerLine);
            var vNum = Math.floor(i % levelsPerPage / levelsPerLine);

            var container = new createjs.Container();
            var shape = new createjs.Shape();
            shape.graphics.beginFill(i > levelProgress ? levelChooseDisableColor : levelChooseAbleColor).drawRect(0, 0, levelWidth - 2 * spaceW, levelHeight - 2 * spaceH);
            shape.shadow = new createjs.Shadow("#454", 0, 5, 4);

            var text = new createjs.Text(i + 1, "bold " + fontSize + "px 楷体", levelFontColor);
            text.x = (levelWidth - 2 * spaceW) / 2 - fontSize / 2 / 2 * (i + 1 + "").length;
            text.y = spaceH;

            container.addChild(shape);
            container.addChild(text);
            container.x = leftD + hNum * levelWidth + spaceW;
            container.y = topD + vNum * levelHeight + spaceH;

            levelContainers.push(container);
            stage.addChild(container);

            container.addEventListener("click", (function (which) {
                return function (event) {
                    if (which > levelProgress) {
                        return;
                    }
                    //=
                    currentGame = levelGames[which];
                    setCurrentGameData();
                    stage.removeAllChildren();

                    initTicker();
                    state = readyScreen;
                    drawReadyScreen();
                }
            })(i));
        }
    }

    stage.update();
}

//freedom page1
var freedomItemWidth, freedomItemHeight;
var dataArea = [true, true, false, false, false, false];//五十平，五十片，浊平，浊片，拗平，拗片
var freedomItems = ["正/平", "正/片", "浊/平", "浊/片", "拗/平", "拗/片"];
var freedomItemTextSize;
var freedomMItems = ["开始", "范围", "速度", "间隔"];
var freedomMContainers;

var freedomPage = 1;

//freedom page2

function drawFreedom() {
    stage.removeAllChildren();

    freedomItemContainers = new Array();
    freedomMContainers = new Array();
    if (canvasW > canvasH / 4 * 3) {//横版
        var virtulWidth = canvasW > freedomMaxWidth ? freedomMaxWidth : canvasW;
        virtulWidth = virtulWidth > canvasH / 3 * 4 ? canvasH / 3 * 4 : virtulWidth;

        freedomItemWidth = virtulWidth * 0.8 / 4;
        freedomItemHeight = canvasH * 0.4 - 2 * virtulWidth * 0.1;
        freedomItemTextSize = freedomItemHeight * 0.625 / 3;

        //page1 6 items
        for (var i = 0; i < 6; i++) {
            var container = new createjs.Container();
            var shape = new createjs.Shape();
            shape.graphics.beginFill(getFreedomItemBGColor(randomGame.dataArea[i])).drawRect(freedomItemWidth / 10, 0, freedomItemWidth / 5 * 4, freedomItemHeight * 0.625);
            shape.shadow = new createjs.Shadow("#454", 0, 5, 4);

            var text = new createjs.Text(freedomItems[i], "bold " + freedomItemTextSize + "px 楷体", freedomItemTextColor);
            text.x = freedomItemWidth / 2 - freedomItemTextSize * 1.25;
            text.y = freedomItemTextSize;

            container.addChild(shape);
            container.addChild(text);
            container.x = (Math.floor(i / 2) + 1) * freedomItemWidth + virtulWidth * 0.1 + (canvasW - virtulWidth) / 2;
            container.y = i % 2 * freedomItemHeight + virtulWidth * 0.1;

            freedomItemContainers.push(container);
            //stage.addChild(container);

            container.addEventListener("click", (function (num) {
                    return function (event) {
                        var flag = false;
                        for (var j = 0; j < randomGame.dataArea.length; j++) {
                            if (randomGame.dataArea[j] && j != num) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            return;
                        }
                        randomGame.dataArea[num] = randomGame.dataArea[num] ? false : true;
                        freedomItemContainers[num].getChildAt(0).graphics.beginFill(getFreedomItemBGColor(randomGame.dataArea[num]))
                            .drawRect(freedomItemWidth / 10, 0, freedomItemWidth / 5 * 4, freedomItemHeight * 0.625);
                        stage.update();
                    }
                })(i)
            );
        }

        var speedContainer = new SelectContainer(virtulWidth * 0.1 + freedomItemWidth * 1.1 + (canvasW - virtulWidth) / 2, canvasH * 0.4 + (canvasH * 0.2 - freedomItemHeight * 0.625) / 2 + freedomItemHeight * 0.625 / 4, freedomItemWidth * 3 / 2, freedomItemHeight * 0.625 / 2, 10 - randomGame.speed, 1, 9, 1, false);
        speedContainer.clickCallback = function () {
            randomGame.speed = 10 - speedContainer.num;
            console.log("speed " + randomGame.speed);
        }
        //stage.addChild(speedContainer.getInstance());

        var intervalContainer = new SelectContainer(virtulWidth * 0.1 + freedomItemWidth * 1.1 + (canvasW - virtulWidth) / 2, canvasH * 0.5 + (canvasH * 0.2 - freedomItemHeight * 0.625) / 2 + freedomItemHeight * 0.625 / 4, freedomItemWidth * 3 / 2, freedomItemHeight * 0.625 / 2, randomGame.appearTime / 500, 1, 9, 1, false);
        //stage.addChild(intervalContainer.getInstance());
        intervalContainer.clickCallback = function () {
            randomGame.appearTime = intervalContainer.num * 500;
            console.log("appearTime " + randomGame.appearTime);
        }

        //page1 page2 common pageContainer
        var pageContainer = new SelectContainer(canvasW / 2 - freedomItemWidth / 2, canvasH * 0.65 + (canvasH * 0.2 - freedomItemHeight * 0.625) / 2 + freedomItemHeight * 0.625 / 4, freedomItemWidth, freedomItemHeight * 0.625 / 2, freedomPage, 1, 2, 1, false);
        pageContainer.getInstance().getChildAt(1).addEventListener("click", function (e) {
            //console.log("page1");
            //console.log("pageContainer " + pageContainer.num);
            freedomPage = 1;
            removePage2();
            addPage1();
            stage.update();
        });

        pageContainer.getInstance().getChildAt(2).addEventListener("click", function (e) {
            //console.log("page2");
            //console.log("pageContainer " + pageContainer.num);
            freedomPage = 2;
            removePage1();
            addPage2();
            stage.update();
        });

        function removePage2() {
            for (var i = 0; i < page2Items.length; i++) {
                stage.removeChild(page2Items[i]);
            }
        }

        function addPage1() {
            stage.addChild(speedContainer.getInstance());
            stage.addChild(intervalContainer.getInstance());
            for (var i = 0; i < freedomMContainers.length; i++) {
                stage.addChild(freedomMContainers[i]);
            }
            for (var i = 0; i < freedomItemContainers.length; i++) {
                stage.addChild(freedomItemContainers[i]);
            }
        }

        function removePage1() {
            stage.removeChild(speedContainer.getInstance());
            stage.removeChild(intervalContainer.getInstance());
            for (var i = 0; i < freedomMContainers.length; i++) {
                stage.removeChild(freedomMContainers[i]);
            }
            for (var i = 0; i < freedomItemContainers.length; i++) {
                stage.removeChild(freedomItemContainers[i]);
            }
        }

        var page2ContainerData = [["经过", "分", (canvasW - virtulWidth) / 2 + virtulWidth / 4, canvasH * 0.2, randomGame.rules[0], 1, 60, 1], ["击中", "个", (canvasW - virtulWidth) / 2 + virtulWidth / 4, canvasH * 0.3, randomGame.rules[1], 10, 800, 10], ["最大连击小于", "个", (canvasW) / 2 + virtulWidth / 4, canvasH * 0.2, randomGame.rules[2], 5, 500, 5], ["漏掉个数大于", "个", (canvasW) / 2 + virtulWidth / 4, canvasH * 0.3, randomGame.rules[3], 1, 100, 1], ["击中个数小于", "个", (canvasW) / 2 + virtulWidth / 4, canvasH * 0.4, randomGame.rules[4], 5, 600, 5], ["经过时间大于", "分", (canvasW) / 2 + virtulWidth / 4, canvasH * 0.5, randomGame.rules[5], 1, 20, 1], ["命中几率小于", "﹪", (canvasW) / 2 + virtulWidth / 4, canvasH * 0.6, randomGame.rules[6], 30, 100, 5]];
        var page2Items = new Array();
        var page2ItemSelectContainers = new Array();
        var page2ItemTextSize = freedomItemTextSize;
        var page2ItemTextColor = freedomItemTextColor;
        var page2ItemContainerWidth = virtulWidth * 0.8 / 4;
        var page2Words = ["完成条件", "失败条件"];

        for (var i = 0; i < page2ContainerData.length; i++) {
            var container = new createjs.Container();
            var text1 = new createjs.Text(page2ContainerData[i][0], "bold " + page2ItemTextSize + "px 楷体", page2ItemTextColor);
            text1.x = 0;
            text1.y = 0;

            var selectContainer = new SelectContainer((page2ContainerData[i][0].length + 2) * page2ItemTextSize, 0, page2ItemContainerWidth, page2ItemTextSize, page2ContainerData[i][4], page2ContainerData[i][5], page2ContainerData[i][6], page2ContainerData[i][7], true);
            selectContainer.clickCallback = (function (ii) {
                return function (event) {
                    //randomGame.rules[ii] = this.num;
                    //console.log(" randomGame.rules[i] " + randomGame.rules);

                    //check不应该同时选中的项目
                    switch (ii) {
                    case 0:
                        if (this.num == -1) {
                            if (page2ItemSelectContainers[1].num == -1) {
                                //两项完成条件不能同时关闭
                                this.turnToMin();
                                //randomGame.rules[ii] = this.num;
                            }
                        } else {
                            //两项完成条件只能开启一个
                            page2ItemSelectContainers[1].turnOff();
                            randomGame.rules[1] = -1;
                            //失败条件中的经过时间关闭
                            page2ItemSelectContainers[5].turnOff();
                            randomGame.rules[5] = -1;
                        }
                        break;
                    case 1:
                        if (this.num == -1) {
                            if (page2ItemSelectContainers[0].num == -1) {
                                //两项完成条件不能同时关闭
                                this.turnToMin();
                                //randomGame.rules[ii] = this.num;
                            }
                        } else {
                            //两项完成条件只能开启一个
                            page2ItemSelectContainers[0].turnOff();
                            randomGame.rules[0] = -1;
                            //失败条件中的集中个数关闭
                            page2ItemSelectContainers[4].turnOff();
                            randomGame.rules[4] = -1;
                        }
                        break;
                    case 4:
                        if (this.num != -1 && page2ItemSelectContainers[1].num != -1) {
                            //完成条件的击中个数开启时，失败条件的击中个数不能开启
                            this.turnOff();
                            //randomGame.rules[ii] = this.num;
                        }
                        break;
                    case 5:
                        if (this.num != -1 && page2ItemSelectContainers[0].num != -1) {
                            //完成条件的经过时间开启时，失败条件的经过时间不能开启
                            this.turnOff();
                            //randomGame.rules[ii] = this.num;
                        }
                        break;
                    }

                    if (page2ItemSelectContainers[2].num == -1 && page2ItemSelectContainers[3].num == -1 && page2ItemSelectContainers[4].num == -1 && page2ItemSelectContainers[5].num == -1 && page2ItemSelectContainers[6].num == -1) {
                        this.turnToMin();
                    }
                    randomGame.rules[ii] = this.num;
                    console.log(" randomGame.rules[i] " + randomGame.rules);
                }
            })(i);

            var text2 = new createjs.Text(page2ContainerData[i][1], "bold " + page2ItemTextSize + "px 楷体", page2ItemTextColor);
            text2.x = (page2ContainerData[i][0].length + 2) * page2ItemTextSize + page2ItemContainerWidth;
            text2.y = 0;

            container.addChild(text1);
            container.addChild(text2);
            container.addChild(selectContainer.getInstance());

            container.x = page2ContainerData[i][2] - ((page2ContainerData[i][0].length + 3) * page2ItemTextSize + page2ItemContainerWidth) / 2;
            container.y = page2ContainerData[i][3];
            page2ItemSelectContainers.push(selectContainer);
            page2Items.push(container);
        }

        var doneText = new createjs.Text(page2Words[0], "bold " + page2ItemTextSize + "px 楷体", page2ItemTextColor);
        doneText.x = (canvasW - virtulWidth) / 2 + virtulWidth / 4 - page2Words[0].length * page2ItemTextSize / 2;
        doneText.y = canvasH * 0.1;

        var failText = new createjs.Text(page2Words[1], "bold " + page2ItemTextSize + "px 楷体", page2ItemTextColor);
        failText.x = (canvasW) / 2 + virtulWidth / 4 - page2Words[1].length * page2ItemTextSize / 2;
        failText.y = canvasH * 0.1;

        page2Items.push(doneText);
        page2Items.push(failText);

        function addPage2() {
            for (var i = 0; i < page2Items.length; i++) {
                stage.addChild(page2Items[i]);
            }
        }

        //left.addEventListener("click", (function (container) {

        stage.addChild(pageContainer.getInstance());

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
        startContainer.y = canvasH * 0.8;//+ (canvasH * 0.2 - freedomItemHeight * 0.625) / 2
        stage.addChild(startContainer);

        startContainer.addEventListener("click", function (e) {
            currentGame = randomGame;
            setCurrentGameData();
            stage.removeAllChildren();
            //state = inGameScreen;
            //drawInGame();

            //console.log("appearTime " + appearTime);
            //console.log("freedomModeSpeed " + freedomModeSpeed);
            initTicker();
            state = readyScreen;
            drawReadyScreen();
        });
        //freedomMContainers.push(startContainer);

        addBackButton(function () {
            state = menuScreen;
            drawMenu();
        });
        //var backText = new createjs.Text(backWord, "bold " + freedomItemTextSize + "px 楷体", freedomItemTextColor);
        //backText.x = freedomItemTextSize * 0.25;
        //backText.y = freedomItemTextSize * 0.25;
        //
        //var backShape = new createjs.Shape();
        //backShape.graphics.beginFill("#f63990").drawRoundRect(0, 0, freedomItemTextSize * backWord.length * 1.5, freedomItemTextSize * 1.5, freedomItemTextSize * 1.5 / 4);
        //backShape.shadow = new createjs.Shadow("#454", 0, 5, 4);
        //
        //var backButton = new createjs.Container();
        //backButton.addChild(backShape);
        //backButton.addChild(backText);
        //backButton.x = canvasW - freedomItemTextSize * backWord.length * 2;
        //backButton.y = canvasH - freedomItemTextSize * 2;
        //
        //stage.addChild(backButton);
        //
        //backButton.addEventListener("click", function (e) {
        //    state = menuScreen;
        //    drawMenu();
        //});

        freedomAddMContainersToScreen(virtulWidth * 0.1 + (canvasW - virtulWidth) / 2, virtulWidth * 0.1, freedomMItems[1]);
        freedomAddMContainersToScreen(virtulWidth * 0.1 + (canvasW - virtulWidth) / 2, canvasH * 0.4 + (canvasH * 0.2 - freedomItemHeight * 0.625) / 2, freedomMItems[2]);
        freedomAddMContainersToScreen(virtulWidth * 0.1 + (canvasW - virtulWidth) / 2, canvasH * 0.5 + (canvasH * 0.2 - freedomItemHeight * 0.625) / 2, freedomMItems[3]);

        if (freedomPage == 1) {
            removePage2();
            addPage1();
        } else {
            removePage1();
            addPage2();
        }

    } else {//竖版

    }
    stage.update();
}

function setCurrentGameData() {
    dataArea = currentGame.dataArea;
    freedomModeSpeed = currentGame.speed;
    appearTime = currentGame.appearTime;
    resetChooseMap();
}

function freedomAddMContainersToScreen(x, y, textContent) {
    var text = new createjs.Text(textContent, "bold " + freedomItemTextSize + "px 楷体", freedomItemTextColor);
    text.x = freedomItemWidth / 2 - freedomItemTextSize;
    text.y = freedomItemTextSize;
    var container = new createjs.Container();
    container.addChild(text);
    container.x = x;
    container.y = y;
    //stage.addChild(container);
    freedomMContainers.push(container);
}

//function handleFreedom(e) {
//    state = inGameScreen;
//    //window.removeEventListener("click", handleFreedom);
//    drawInGame();
//}

function drawReadyScreen() {
    stage.removeAllChildren();
    readyNumY = canvasH / 4 * 3 / 2 / 2;
    readyNumX = canvasW / 2 - readyNumY / 2;

    readyRandom = readyNumY / 8;
    readyGoX = canvasW / 2 - readyGoWord.length * readyNumY;
    readyGoY = readyNumY;

    var text = new createjs.Text(3, "bold " + canvasH / 4 * 3 / 2 + "px 楷体", readyNumColor);
    text.x = readyNumX;
    text.y = readyNumY;
    stage.addChild(text);

    var infoText = "";
    infoText += currentGame.rules[0] == -1 ? "" : currentGame.rules[0] + "分钟内";
    infoText += currentGame.rules[1] == -1 ? "" : "命中" + currentGame.rules[1] + "个的同时";
    infoText += currentGame.rules[2] == -1 ? "" : "，连击不小于" + currentGame.rules[2] + "个";
    infoText += currentGame.rules[3] == -1 ? "" : "，漏掉不多于" + currentGame.rules[3] + "个";
    infoText += currentGame.rules[4] == -1 ? "" : "，命中不小于" + currentGame.rules[4] + "个";
    infoText += currentGame.rules[5] == -1 ? "" : "，用时不多于" + currentGame.rules[5] + "分钟";
    infoText += currentGame.rules[6] == -1 ? "" : "，命中率不小于" + currentGame.rules[6] + "%";
    infoText += "。";

    var infoTextFontSize = canvasH / 20;
    var infoX = (canvasW - infoText.length * infoTextFontSize) / 2;
    var infoY = canvasH / 20 * 16;

    //if(currentGame.rules[0])
    var info = new createjs.Text(infoText, "bold " + infoTextFontSize + "px 楷体", readyNumColor);
    info.x = infoX;
    info.y = infoY;
    stage.addChild(info);

    readyListener = createjs.Ticker.on("tick", readyTick);
    createjs.Ticker.framerate = fps;
}

function readyTick(event) {
    if (event.paused) {
        return;
    }

    if (3 - Math.floor(createjs.Ticker.getTime(true) / 1000) < 0) {
        //console.log("go " + Math.floor(createjs.Ticker.getTime(true) / 1000));
        createjs.Ticker.off("tick", readyListener);
        stage.removeAllChildren();
        state = inGameScreen;
        drawInGame();
    } else if (3 - Math.floor(createjs.Ticker.getTime(true) / 1000) > 0) {
        stage.getChildAt(0).text = 3 - Math.floor(createjs.Ticker.getTime(true) / 1000);
        stage.getChildAt(0).x = readyNumX + getRandom1(readyRandom);
        stage.getChildAt(0).y = readyNumY + getRandom1(readyRandom);
    } else {
        stage.getChildAt(0).text = readyGoWord;
        stage.getChildAt(0).x = readyGoX;
        stage.getChildAt(0).y = readyGoY;
        stage.removeChildAt(1);
    }
//    if (3 - Math.floor(createjs.Ticker.getTime(true) / 1000) > 0) {
//        stage.getChildAt(0).text = 3 - Math.floor(createjs.Ticker.getTime(true) / 1000);
//    } else {
//        stage.getChildAt(0).text = readyGoWord;
//    }
//
//    stage.getChildAt(0).x = readyNumX + getRandom1(readyRandom);
//    stage.getChildAt(0).y = readyNumY + getRandom1(readyRandom);
//
//    //3 - Math.floor(createjs.Ticker.getTime(true))
//}

    stage.update();
}

function drawInGame() {
    initInGameData();
    resetKanaWidth();
    initText();

    //reset Ticker
    initTicker();

    //gameStartMs = new Date();
    createjs.Ticker.on("tick", tick);
    createjs.Ticker.framerate = fps;
}

function tick(event) {
    if (event.paused) {
        return;
    }

    currentDate = new Date();
    if (checkGameEnd()) {
        drawGameResult(checkGameSuccess());
    }

    //    var kana = null;
    if (currentDate - lastDate - createjs.Ticker.getTime(false) + createjs.Ticker.getTime(true) > appearTime) {//add new kana
        lastDate = currentDate - createjs.Ticker.getTime(false) + createjs.Ticker.getTime(true);
        //        console.log(hiragana[getRandom(hiragana.length)]);

        //        console.log(canvasH + " " + kana_d);
        var kana;
        if (freedomScreen != 0) {
            kana = new Kana(chooseMap.keys[getRandom(chooseMap.size())], freedomModeSpeed);
        } else {
            kana = new Kana(chooseMap.keys[getRandom(chooseMap.size())]);
        }
        //kana= new Kana(chooseMap.keys[getRandom(chooseMap.size())]);

        //kana.speed = freedomModeSpeed;
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
                currentComboNum = 0;
                currentCombo.text = currentComboText + currentComboNum;
                resetHitRate();

            }
        }
    }

    passTimeNum = Math.floor(createjs.Ticker.getTime(true) / 1000);
    passTime.text = passTimeText + passTimeNum + passTimeText2;

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

function resetHitRate() {
    hitRateNum = (greatNum / (greatNum + missNum) * 100).toFixed(2) + "%";
    hitRate.text = hitRateText + hitRateNum;
}

function drawGameResult(result) {
    console.log("game result " + result);

    if (result && currentGame.level == levelProgress && levelProgress < levelGames.length - 1) {
        levelProgress++;
        saveProgress();
    }
    //createjs.Ticker.off("tick", readyListener);
    initTicker();

    createjs.Ticker.on("tick", resultTick);

    var word = result ? "胜利" : "失败";
    var text = new createjs.Text(word, "bold " + canvasH / 4 * 3 / 2 + "px Arial", "#000000");

    text.x = readyGoX;
    text.y = readyGoY;
    stage.addChild(text);

    //stage.addEventListener("click", stageClickListener);
}

function saveProgress() {
    localStorage.progress = levelProgress;
}

function loadProgress() {
    if (localStorage.progress == undefined) {
        localStorage.progress = 0;
    }

    if (cheatMode) {
        return levelGames.length - 1;
    }
    return localStorage.progress;
    //return 34;
}
//var stageClickListener = function (event) {
//    stage.removeEventListener("click", stageClickListener);
//    console.log("key click");
//    initTicker();
//    state = menuScreen;
//    drawMenu();
//
//};

var backFontSize;
var backFontColor = "black";
var backButtonWidth, backButtonHeight;
var backButton;

function addBackButton(clickfunction) {
    backFontSize = canvasH > canvasW ? canvasW / 30 : canvasH / 30;

    backButtonWidth = backFontSize * 4;
    backButtonHeight = backFontSize * 2;

    var backText = new createjs.Text(backWord, "bold " + backFontSize + "px 楷体", backFontColor);
    backText.x = (backButtonWidth - backWord.length * backFontSize) / 2;// freedomItemTextSize * 0.25;
    backText.y = (backButtonHeight - backFontSize) / 2;//freedomItemTextSize * 0.25;

    var backShape = new createjs.Shape();
    backShape.graphics.beginFill("#f63990").drawRoundRect(0, 0, backButtonWidth, backButtonHeight, backButtonHeight / 4);
    backShape.shadow = new createjs.Shadow("#454", 0, 5, 4);

    backButton = new createjs.Container();
    backButton.addChild(backShape);
    backButton.addChild(backText);
    backButton.x = canvasW - backButtonWidth * 1.5;
    backButton.y = canvasH - backButtonHeight * 1.5;

    stage.addChild(backButton);

    backButton.addEventListener("click", clickfunction);
}

function resultTick(event) {
    if (event.paused) {
        return;
    }

    console.log("createjs.Ticker.getTime(true) / 1000 " + createjs.Ticker.getTime(true) / 1000);
    if (createjs.Ticker.getTime(true) / 1000 > 3) {//先回首页
        //stage.removeEventListener("click", stageClickListener);
        console.log("time out");
        initTicker();

        if (currentGame.level == -1) {
            state = menuScreen;
            drawMenu();
        } else {
            state = levelsScreen;
            cheatCodeArray = new Array();
            drawLevels();
        }
    }
}

function initTicker() {
    createjs.Ticker._pausedTime = 0;
    createjs.Ticker.removeAllEventListeners();
    createjs.Ticker.reset();
    createjs.Ticker._inited = false;
    createjs.Ticker.init();
}

function checkGameEnd() {
    if (currentGame.rules[1] == -1) {//时间结束模式
        if (Math.floor(createjs.Ticker.getTime(true) / 1000) >= currentGame.rules[0] * 60) {
            console.log("game over");
            return true;
        }
        //console.log("time " + Math.floor((currentTime - gameStartMs) / 1000));
        //console.log("time " + Math.floor(createjs.Ticker.getTime(true) / 1000));
    } else {//命中个数结束模式
        if (greatNum >= currentGame.rules[1]) {
            console.log("game over");
            return true;
        }
    }
    return false;
}

function checkGameSuccess() {

    if (currentGame.rules[2] != -1 && currentGame.rules[2] > maxCombo) {
        return false;
    }

    if (missNum > currentGame.rules[3] && currentGame.rules[3] != -1) {
        return false;
    }

    if (currentGame.rules[4] != -1 && greatNum < currentGame.rules[4]) {
        return false;
    }

    if (currentGame.rules[5] != -1 && createjs.Ticker.getTime(true) / 1000 > currentGame.rules[5]) {
        return false;
    }

    if (currentGame.rules[6] != -1 && greatNum / (greatNum + missNum) < currentGame.rules[6] / 100) {
        return false;
    }

    return true;
}

function checkGameComplete() {

}

window.onresize = function () {
    resetCanvasSize();
    //resetKanaWidth();
    //resetTexts();
    //if (state == inGameScreen) {
    //    resetKanaWidth();
    //    resetTexts();
    //}
    switch (state) {
    case menuScreen:
        oneItemHeight = canvasH / (menuItems.length + 2 - 0.375);
        oneItemWidth = canvasW / 2;
        oneItemWidth = oneItemWidth > oneItemMaxWidth ? oneItemMaxWidth : oneItemWidth;
        menuItemTextSize = oneItemHeight * 0.625 / 3;

        initMenuData();
        drawMenu();
        break;
    case inGameScreen:
        resetKanaWidth();
        resetTexts();
        break;
    case freedomScreen:
        drawFreedom();
        break;
    case levelsScreen:
        drawLevels();
        break;
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
            window.onfocus();
            //window.focus();
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

//game类,对象为每一局游戏。
function Game() {
    this.speed = 5;
    this.appearTime = 3000;
    this.dataArea = [true, true, false, false, false, false];
    this.rules = [2, -1, -1, 5, -1, -1, -1];
    this.level = -1;//-1 = randomGame;通关模式从0开始
}

//Kana类
function Kana(name, speed) {
    this.name = name;
    this.speed = 10;//经过几秒会落到底部
    this.x = getRandom(canvasW - kana_d * 2);//*2兼容拗音
    this.y = -kana_d;
    this.speed = isNaN(speed) ? 10 : speed;
    console.log("speed " + this.speed);
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

//左右箭头加数字 类
function SelectContainer(x, y, width, height, num, min, max, step, closemode) {//container的x坐标，container的y坐标，container的宽，container的高，container中默认显示的数字(如果是-1则显示“关”)，显示数字最小值，显示数字最大值，步进，是否有关闭模式（当达到最小值时再按左箭头是否可以切换到“关”状态）
    this.x = x;
    this.y = y;
    this.num = num;
    this.min = min;
    this.max = max;
    this.width = width;
    this.height = height;
    this.step = step;
    this.closemode = closemode;

    this.getInstance = function () {
        return container;
    };

    this.destroy = function () {
        container.removeAllChildren();
        container = null;
    };

    //按键后回调
    this.clickCallback = function () {
    };

    var container = new createjs.Container();
    var left = new createjs.Shape();
    left.graphics.beginFill("red").moveTo(0, height / 2).lineTo(height, 0).lineTo(height, height);
    left.shadow = new createjs.Shadow("#454", 0, 4, 3);
    var text = new createjs.Text(this.num, "bold " + height + "px Arial", "#000000");
    text.x = width / 2 - height / 2 / 2 * (num + "").length;
    text.y = 0;
    if (this.num == -1) {
        text.text = "关";
    }
    var right = new createjs.Shape();
    right.graphics.beginFill("red").moveTo(width, height / 2).lineTo(width - height, 0).lineTo(width - height, height);
    right.shadow = new createjs.Shadow("#454", 0, 4, 3);
    container.addChild(text);
    container.addChild(left);
    container.addChild(right);

    this.turnOff = function () {
        this.num = -1;
        this.getInstance().getChildAt(0).text = "关";
        this.getInstance().getChildAt(0).x = this.width / 2 - this.height / 2;
        stage.update();
    }

    this.turnToMin = function () {
        this.num = min;
        this.getInstance().getChildAt(0).text = min;
        this.getInstance().getChildAt(0).x = this.width / 2 - this.height / 2 / 2 * (this.num + "").length;
        stage.update();
    }

    left.addEventListener("click", (function (container) {
            return function (event) {
                //if (container.num == -1) {
                //    container.num = container.min;
                //    container.getInstance().getChildAt(0).text = container.num;
                //    container.getInstance().getChildAt(0).x = container.width / 2 - container.height / 2 / 2 * (container.num + "").length;
                //    stage.update();
                //} else
                if (container.num > container.min) {
                    container.num -= container.step;
                    //container.getInstance().removeAllChildren();
                    container.getInstance().getChildAt(0).text = container.num;
                    container.getInstance().getChildAt(0).x = container.width / 2 - container.height / 2 / 2 * (container.num + "").length;
                    //var text = new createjs.Text(container.num, "bold " + height + "px Arial", "#000000");
                    //text.x = container.width / 2 - container.height / 2 / 2 * (container.num + "").length;
                    //text.y = 0;
                    //container.getInstance().addChild(text);
                    //container.getInstance().addChild(left);
                    //container.getInstance().addChild(right);
                    stage.update();
                } else if (container.num == container.min && closemode) {
                    container.turnOff();
                }

                container.clickCallback();
            }
        })(this)
    );

    right.addEventListener("click", (function (container) {
            return function (event) {
                if (container.num == -1) {
                    container.num = container.min;
                    container.getInstance().getChildAt(0).text = container.num;
                    container.getInstance().getChildAt(0).x = container.width / 2 - container.height / 2 / 2 * (container.num + "").length;
                    stage.update();
                } else if (container.num < container.max) {
                    container.num += container.step;
                    container.getInstance().getChildAt(0).text = container.num;
                    container.getInstance().getChildAt(0).x = container.width / 2 - container.height / 2 / 2 * (container.num + "").length;
                    //container.getInstance().removeAllChildren();
                    //var text = new createjs.Text(container.num, "bold " + height + "px Arial", "#000000");
                    //text.x = container.width / 2 - container.height / 2 / 2 * (container.num + "").length;
                    //text.y = 0;
                    //container.getInstance().addChild(text);
                    //container.getInstance().addChild(left);
                    //container.getInstance().addChild(right);
                    stage.update();
                }

                container.clickCallback();
            }
        })(this)
    );

    container.x = this.x;
    container.y = this.y;
}

function initData() {
    levelProgress = loadProgress();
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

    for (var i = 0; i < katakanaMap.keys.length; i++) {
        chooseMap.set(katakanaMap.keys[i], katakanaMap.get(katakanaMap.keys[i]));
    }

    for (var i = 0; i < hiraganaMap.keys.length; i++) {
        chooseMap.set(hiraganaMap.keys[i], hiraganaMap.get(hiraganaMap.keys[i]));
    }

    levelGames = new Array();

    //1
    var level = new Game();
    level.speed = 8;
    level.appearTime = 4000;
    level.dataArea = [true, false, false, false, false, false];
    level.rules = [-1, 10, -1, 5, -1, -1, -1];
    level.level = 0;
    levelGames.push(level);
    //var level = new Game();
    //level.speed = 8;
    //level.appearTime = 4000;
    //level.dataArea = [true, false, false, false, false, false];
    //level.rules = [-1, 1, -1, 5, -1, -1, -1];
    //level.level = 0;
    //levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [true, false, false, false, false, false];
    level.rules = [1, -1, -1, 5, -1, -1, -1];
    level.level = 1;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [true, false, false, false, false, false];
    level.rules = [1, -1, -1, 2, -1, -1, -1];
    level.level = 2;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [true, false, false, false, false, false];
    level.rules = [2, -1, 10, -1, -1, -1, -1];
    level.level = 3;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [true, false, false, false, false, false];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 4;
    levelGames.push(level);

    //6
    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, true, false, false, false, false];
    level.rules = [-1, 20, -1, 5, -1, -1, -1];
    level.level = 5;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [false, true, false, false, false, false];
    level.rules = [1, -1, -1, 3, -1, -1, -1];
    level.level = 6;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [false, true, false, false, false, false];
    level.rules = [1, -1, -1, -1, -1, -1, 70];
    level.level = 7;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, true, false, false, false, false];
    level.rules = [-1, 20, -1, 5, -1, -1, -1];
    level.level = 8;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, true, false, false, false, false];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 9;
    levelGames.push(level);

    //11
    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, true, false, false, false];
    level.rules = [-1, 20, -1, 5, -1, -1, -1];
    level.level = 10;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, true, false, false, false];
    level.rules = [1, -1, -1, 5, -1, -1, -1];
    level.level = 11;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [false, false, true, false, false, false];
    level.rules = [1, -1, -1, -1, -1, -1, 80];
    level.level = 12;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, true, false, false, false];
    level.rules = [2, -1, 10, -1, -1, -1, -1];
    level.level = 13;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, true, false, false, false];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 14;
    levelGames.push(level);

    //16
    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, false, true, false, false];
    level.rules = [-1, 20, -1, 5, -1, -1, 100];
    level.level = 15;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, false, true, false, false];
    level.rules = [1, -1, -1, 5, -1, -1, 100];
    level.level = 16;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, true, false, false];
    level.rules = [1, -1, -1, -1, -1, -1, 80];
    level.level = 17;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, true, false, false];
    level.rules = [2, -1, 10, -1, -1, -1, -1];
    level.level = 18;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, true, false, false];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 19;
    levelGames.push(level);

    //21
    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, false, false, true, false];
    level.rules = [-1, 20, -1, 5, -1, -1, -1];
    level.level = 20;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, false, false, true, false];
    level.rules = [1, -1, -1, -1, -1, -1, 70];
    level.level = 21;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, false, true, false];
    level.rules = [1, -1, -1, -1, -1, -1, 70];
    level.level = 22;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, false, true, false];
    level.rules = [2, -1, 10, -1, -1, -1, -1];
    level.level = 23;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, false, true, false];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 24;
    levelGames.push(level);

    //26
    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, false, false, false, true];
    level.rules = [-1, 20, -1, 5, -1, -1, -1];
    level.level = 25;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, false, false, false, true];
    level.rules = [2, -1, 10, -1, -1, -1, -1];
    level.level = 26;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, false, false, true];
    level.rules = [1, -1, -1, -1, -1, -1, 70];
    level.level = 27;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, false, false, true];
    level.rules = [2, -1, -1, 5, -1, -1, -1];
    level.level = 28;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, false, false, true];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 29;
    levelGames.push(level);

    //31
    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [true, true, false, false, false, false];
    level.rules = [-1, 20, -1, 5, -1, -1, -1];
    level.level = 30;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [true, true, false, false, false, false];
    level.rules = [1, -1, -1, -1, -1, -1, 70];
    level.level = 31;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [true, true, false, false, false, false];
    level.rules = [2, -1, -1, 5, -1, -1, -1];
    level.level = 32;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [true, true, false, false, false, false];
    level.rules = [2, -1, 10, -1, -1, -1, -1];
    level.level = 33;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [true, true, false, false, false, false];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 34;
    levelGames.push(level);

    //36
    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, true, true, false, false];
    level.rules = [-1, 20, -1, 5, -1, -1, -1];
    level.level = 35;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, true, true, false, false];
    level.rules = [1, -1, -1, -1, -1, -1, 70];
    level.level = 36;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [false, false, true, true, false, false];
    level.rules = [2, -1, 10, -1, -1, -1, -1];
    level.level = 37;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, true, true, false, false];
    level.rules = [2, -1, -1, 5, -1, -1, -1];
    level.level = 38;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, true, true, false, false];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 39;
    levelGames.push(level);

    //41
    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, false, false, true, true];
    level.rules = [-1, 20, -1, 5, -1, -1, -1];
    level.level = 40;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [false, false, false, false, true, true];
    level.rules = [1, -1, -1, 5, -1, -1, -1];
    level.level = 41;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, false, true, true];
    level.rules = [2, -1, -1, -1, -1, -1, 70];
    level.level = 42;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, false, true, true];
    level.rules = [2, -1, 10, -1, -1, -1, -1];
    level.level = 43;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [false, false, false, false, true, true];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 44;
    levelGames.push(level);

    //46
    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [true, true, true, true, true, true];
    level.rules = [-1, 20, -1, 5, -1, -1, -1];
    level.level = 45;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 3000;
    level.dataArea = [true, true, true, true, true, true];
    level.rules = [1, -1, -1, -1, -1, -1, 70];
    level.level = 46;
    levelGames.push(level);

    level = new Game();
    level.speed = 5;
    level.appearTime = 2000;
    level.dataArea = [true, true, true, true, true, true];
    level.rules = [2, -1, 10, -1, -1, -1, -1];
    level.level = 47;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [true, true, true, true, true, true];
    level.rules = [2, -1, -1, 5, -1, -1, -1];
    level.level = 48;
    levelGames.push(level);

    level = new Game();
    level.speed = 4;
    level.appearTime = 2000;
    level.dataArea = [true, true, true, true, true, true];
    level.rules = [2, -1, -1, -1, -1, -1, 90];
    level.level = 49;
    levelGames.push(level);

    //51
    level = new Game();
    level.speed = 3;
    level.appearTime = 1500;
    level.dataArea = [true, true, true, true, true, true];
    level.rules = [10, -1, -1, -1, -1, -1, 100];
    level.level = 50;
    levelGames.push(level);

}

//function loadLevelProgress() {
//    return 0;
//}

function initText() {
    key = new createjs.Text(keyText, "bold " + keyTextSize + "px Arial", "#000000");
    key.x = keyX;
    key.y = canvasH - keyTextSize * 4.5;
    stage.addChild(key);

    great = new createjs.Text(greatText + greatNum, "bold " + keyTextSize + "px Arial", "#000000");
    great.x = greatX;
    great.y = canvasH - keyTextSize * 1.5;
    stage.addChild(great);

    miss = new createjs.Text(missText + missNum, "bold " + keyTextSize + "px Arial", "#000000");
    miss.x = missX;
    miss.y = canvasH - keyTextSize * 1.5;
    stage.addChild(miss);

    maxCombo = new createjs.Text(maxComboText + maxComboNum, "bold " + keyTextSize + "px Arial", "#000000");
    maxCombo.x = maxComboX;
    maxCombo.y = canvasH - keyTextSize * 3;
    stage.addChild(maxCombo);

    currentCombo = new createjs.Text(currentComboText + currentComboNum, "bold " + keyTextSize + "px Arial", "#000000");
    currentCombo.x = currentComboX;
    currentCombo.y = canvasH - keyTextSize * 3;
    stage.addChild(currentCombo);

    hitRate = new createjs.Text(hitRateText + (hitRateNum * 100).toFixed(2) + "%", "bold " + keyTextSize + "px Arial", "#000000");
    hitRate.x = hitRateX;
    hitRate.y = canvasH - keyTextSize * 1.5;
    stage.addChild(hitRate);

    passTime = new createjs.Text(passTimeText + passTimeNum + passTimeText2, "bold " + keyTextSize + "px Arial", "#000000");
    passTime.x = passTimeX;
    passTime.y = canvasH - keyTextSize * 4.5;
    stage.addChild(passTime);

    addBackButton(function () {
        initTicker();

        state = levelsScreen;
        cheatCodeArray = new Array();
        drawLevels();
    });
}

function initInGameData() {
    kanas = new Array();
    keycodes = [-1, -1, -1];
    greatNum = 0;
    missNum = 0;
    maxComboNum = 0;
    currentComboNum = 0;
    hitRateNum = 0;
}

function resetTexts() {
    key.y = canvasH - keyTextSize * 4.5;
    great.y = canvasH - keyTextSize * 1.5;
    miss.y = canvasH - keyTextSize * 1.5;
    maxCombo.y = canvasH - keyTextSize * 3;
    currentCombo.y = canvasH - keyTextSize * 3;
    hitRate.y = canvasH - keyTextSize * 1.5;
    passTime.y = canvasH - keyTextSize * 4.5;

    for (var i = 0; i < kanas.length; i++) {
        kanas[i].getInstance().getChildAt(0).font = "bold " + kana_d + "px Arial";
    }

    backFontSize = canvasH > canvasW ? canvasW / 30 : canvasH / 30;

    backButtonWidth = backFontSize * 4;
    backButtonHeight = backFontSize * 2;

    //var backText = new createjs.Text(backWord, "bold " + backFontSize + "px 楷体", backFontColor);
    //backText.x = (backButtonWidth - backWord.length * backFontSize) / 2;// freedomItemTextSize * 0.25;
    //backText.y = (backButtonHeight - backFontSize) / 2;//freedomItemTextSize * 0.25;
    //
    //var backShape = new createjs.Shape();
    //backShape.graphics.beginFill("#f63990").drawRoundRect(0, 0, backButtonWidth, backButtonHeight, backButtonHeight / 4);
    //backShape.shadow = new createjs.Shadow("#454", 0, 5, 4);
    //
    //backButton = new createjs.Container();
    //backButton.addChild(backShape);
    //backButton.addChild(backText);
    //backButton.x = canvasW - backButtonWidth * 1.5;
    //backButton.y = canvasH - backButtonHeight * 1.5;
    //stage.getChildAt(backButton).x = canvasW - backButtonWidth * 1.5;
    //stage.getChildAt(backButton).y= canvasH - backButtonHeight * 1.5;
    backButton.x = canvasW - backButtonWidth * 1.5;
    backButton.y = canvasH - backButtonHeight * 1.5;
    //backButton.y = canvasH - backButtonHeight * 1.5;
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

//正负
function getRandom1(length) {
    return length - Math.floor(Math.random() * length * 2);
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

//main data
var stage, canvasW, canvasH, kana_d, kana_r, kanas;
var amount = 10; //一屏幕宽能同时放多少个假名
var fps = 30;
var appearTime = 3000;//ms
var currentDate = 0, lastDate = 0;
var state, menuScreen = 0, inGameScreen = 1, levelsScreen = 2, freedomScreen = 3, setScreen = 4, aboutScreen = 5, readyScreen = 6;

var hiraganaMap, hiragana;
var chooseMap, chooseKana;
var katakanaMap, katakana;
var sonantMap_h, sonant_h;//浊音
var bendSoundMap_h, bendSound_h;//拗音
var sonantMap_k, sonant_k;//浊音
var bendSoundMap_k, bendSound_k;//拗音
var allMaps;

var randomGame = new Game();
var currentGame;

var backWord = "返回";
var gameStartMs;
var levelGames;
//randomGame.dataArea = [true, true, false, false, false, false];
//main data-----------------------end-----------------------------------

//menuScreen
var oneItemMaxWidth = 300;//menu item max width
var menuItemBGColor = "#CCFFFF", menuItemTextColor = "#000000";
var menuItemTextSize, version, versionText = "ver.0.2.0";
var menuItemContainers;
var menuItems = ["闯关模式", "自由模式", "更多设置", "关于信息"];
var oneItemHeight, oneItemWidth;

//freedomScreen
var freedomItemBGSelectColor = "#00ff00", freedomItemBGUnSelectColor = "#e4eaf2";
var freedomItemTextColor = "#000000";
var freedomMaxWidth = 980;
var freedomItemContainers;
var freedomStartBGColor = "#ff0033";
var freedomModeSpeed = 5;

//readyScreen
var readyNumX, readyNumY;
var readyGoX, readyGoY;
var readyNumColor = "#000000";
var readyRandom;
var readyGoWord = "开始";
var readyListener;

//ingameScreen
var keycodes;
var key;
var keyText = "键:";
var keyTextSize = 16;
var great, miss;
var greatText = "命中:", missText = "漏掉:";
var keyX = 0, greatX = 0, missX = 70;
var greatNum = 0, missNum = 0;
var maxCombo, maxComboText = "最大连击:", maxComboNum = 0;
var currentCombo, currentComboText = "当前连击:", currentComboNum = 0;
var hitRate, hitRateText = "命中率:", hitRateNum = 0;
var maxComboX = 0, currentComboX = 100, hitRateX = 140;
var passTime, passTimeText = "时间:", passTimeText2 = "s", passTimeNum = 0, passTimeX = 80;

//levelsScreen
var cheatCodes = [38, 38, 40, 40, 37, 39, 37, 39, 65, 66, 66, 65];//上上下下左右左右abba
var cheatMode = false;
var cheatCodeArray;
