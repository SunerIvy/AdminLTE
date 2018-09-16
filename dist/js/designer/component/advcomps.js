Schema.addCategory({
    name: "control",
    text: "高级控件"
});

$(document).ready(function() { // 赋值放在这里，保证比对象生成晚些

});
//图片
var pkimage= {
    createComp: function (shape) {
    },
    onCreated:function(shape){
        UI.showImageSelect(function(m, l, n) {
            Designer.setFillStyle({
                type: "image",
                fileId: m,
                imageW: l,
                imageH: n
            })
        });
    },
    getScreenPosition:function(objectName) {// 返回:x,y,w,h
        return pkcomphelper.getScreenPosition(objectName);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return  pkcomphelper.loadEventDesc.concat(pkcomphelper.mouseEventDesc);
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindMouseEvents(objectid,objectname,eventname);
    },
};


var pktimer={
    renderComp:function(shape,shapeRect,shapeRectScaled) {
        var domShapeBox = $("#" + shape.id);
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(domComp.length == 0) {
            // 生成一个不可见的input方便后续使用一些方法
            domComp = $('<input type="text"'+pkcomphelper.getCompAttrString(shape,"") +'class="text_canvas" style="width:100%;height:100%;background:transparent!important;border:transparent !important;display:none;" > </input>').appendTo(domShapeBox);
            domComp.attr("readonly", "readonly");

            if(g_designMode==true) {
                shape.fillStyle = {
                    type: "image",
                    fileId: "/global/img/timerThumb.png",
                    display: "stretch"
                };
            }else {// 运行状态下定时器不可见
                // 运行状态下定时器不可见
                domShapeBox.find(".shape_canvas").hide();
                if (!shape.customProp || !shape.customProp.interval || shape.customProp.interval <= 0 || shape.customProp.interval > 24 * 60 * 60 * 1000) {// 之前没有过赋值。如果赋过值则什么都不做
                    console.log("定时器，名称：" + shape.name + "，未配置定时周期或者周期不合法");
                    pkpainter.renderShape(shape);
                    return;
                }

                var interval = shape.customProp.interval;
                domComp.attr("timerinterval", interval);
                var timerHandle = setInterval(function () {
                    var domComp = $(pkcomphelper.getSelector(shape));
                    var curInterval = domComp.attr("timerinterval");
                    pkcomphelper.triggerEvent(shape, "onTimer", shape.name, curInterval);
                }, interval);
                domComp.attr("timerhandle", timerHandle);
                pkpainter.renderShape(shape);
            }
        }
    },
    setInterval:function(objectname,interval){//设定新的定时器周期并重新开始定时
        var domComp = $(pkcomphelper.getSelector(objectname)+":first");
        if(domComp.length <= 0){
            pksys.msgbox("pktimer.setInterval 没有名称为:"+objectname+"的定时器");
            return;
        }

        if (!interval || interval <= 0 || interval > 24 * 60 * 60 * 1000) {
            return;
        }

        var curTimerHandle = domComp.attr("timerhandle");
        if(curTimerHandle && curTimerHandle != "") // 清除定时器
            clearInterval(curTimerHandle);
        domComp.attr("timerhandle", "");

        domComp.attr("timerinterval", interval);
        var timerHandle = setInterval(function () {
            var domComp = $(pkcomphelper.getSelector(objectname)+":first");
            var curInterval = domComp.attr("timerinterval");
            pkcomphelper.triggerEventByName(objectname,"onTimer",objectname, curInterval);
        }, interval);
        domComp.attr("timerhandle", timerHandle);
    },
    clearInterval:function(objectname){
        var domComp = $(pkcomphelper.getSelector(objectname)+":first");
        if(domComp.length <= 0){
            pksys.msgbox("pktimer.clearInterval 没有名称为:"+objectname+"的定时器");
            return;
        }

        var curTimerHandle = domComp.attr("timerhandle");
        if(curTimerHandle && curTimerHandle != "") // 清除定时器
            clearInterval(curTimerHandle);
        domComp.attr("timerhandle","");
        return true;
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat([["onTimer","objectname,interval"]]);
    },
    showConfigUI: function(shape){
        var customProp = {interval:""};
        if(shape.customProp != undefined){
            customProp = shape.customProp
        }

        var subpageDiv = $("<div id='timerconfig' class='ui-tabs'  style='width:485px;'></div>").appendTo("body");
        $("<div id='subpageDiv' class='col-sm-12' ><div class='col-sm-2 text-center' style='line-height: 46px;'>定时周期(毫秒)：</div><div class='col-sm-8 text-center'><input type='text' class='form-control' name='timerinterval'  placeholder='定时器触发周期，单位毫秒'></div></div>").appendTo(subpageDiv);
        subpageDiv.find("input[name='timerinterval']").val(customProp.interval);
        subpageDiv.dialogPk({
            width:"485px",
            height:"auto",
            title:"定时器配置",
            onClose: function() {
                customProp.interval = subpageDiv.find("input[name='timerinterval']").val();
                shape.customProp = customProp;
                subpageDiv.remove();
            }
        }).css({"z-index": Model.orderList.length + 1});
    }
};

var pksubpage={
    renderComp:function(shape,shapeRect,shapeRectScaled) {
        var domShapeBox = $("#" + shape.id);
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(domComp.length == 0){
            if(g_designMode == false) { // 运行模式下，创建了iframe后，鼠标fmouseup被捕获导致无法释放鼠标，那么就无法完成对象的创建
                domShapeBox.find(".shape_canvas").hide();
                var fillStyle=shape.fillStyle;
                if(fillStyle){
                    fillStyle.type="none"; // 设计时有一个browser按钮，运行时不需要了，什么都不会就好。因为用iframe，不需要任何背景
                    if(fillStyle.fileId != undefined)
                        delete fillStyle.fileId;
                }
                var curUrl = domComp.attr("src");
                if ((!curUrl || curUrl == "") && shape.customProp && shape.customProp.url) {// 之前没有过赋值。如果赋过值则什么都不做
                    var pathUrl = shape.customProp.url;
                    if (pathUrl && pathUrl != "") {
                        if (pathUrl.indexOf("http://") >= 0 || pathUrl.indexOf("/runsubpage?path=") >= 0 || pathUrl.indexOf("https://") >= 0)
                            curUrl = pathUrl;
                        else
                            curUrl = "/page/runsubpage?path=" + pathUrl;
                    }
                }

                // 在调用下面的时候，很诡异的直接回到程序头，导致url初始失效，故要讲url生成放上面
                if(!curUrl) // 防止undefined带来的问题！
                    curUrl = "/";
                domComp = $('<iframe' + pkcomphelper.getCompAttrString(shape, "") + ' style="display:block;width:100%;height:100%;position: absolute;top: 0px;border:0px;z-index:1" src="' + curUrl + '"></iframe>').appendTo(domShapeBox);
            }else{
                domShapeBox.find(".shape_canvas").show();
            }
        }
    },
    openUrl:function(objectname, url){ // 设置打开时的网址,http://....https://....或者不带http和www的如://runsubpage?path=xxx
        var domComp = $("iframe"+pkcomphelper.getSelectorByName(objectname));
        if(domComp.length == 0){
            pksys.msgbox("子画面设置url为:"+url+"时,不存在名字为:"+objectname+"的子画面");
            return;
        }

        domComp.attr("src",url);
    },
    openPage:function(objectname, pagePath){ // 设置打开时的网址,http://....https://....或者不带http和www的如://runsubpage?path=xxx
        var domComp = $("iframe"+pkcomphelper.getSelectorByName(objectname));
        if(domComp.length == 0){
            pksys.msgbox("子画面设置画面路径为:"+pagePath+"时,不存在名字为:"+objectname+"的子画面");
            return;
        }

        var url="/page/runsubpage?path="+pagePath;
        domComp.attr("src",url);
    },
    showConfigUI: function(shape){
        var subpageconfigs = {url:""};
        if(shape.customProp != undefined){
            subpageconfigs = shape.customProp
        }

        var subpageDiv = $("<div id='subpageDiv' class='ui-tabs'  style='width:485px;'></div>").appendTo("body");
        $("<div id='subpageDiv' class='col-sm-12' ><input type='checkbox' name='isInput' checked='checked'>是否手动输入<div class='col-sm-2 text-center' style='line-height: 46px;'>初始地址：</div><div class='col-sm-8 text-center'><input id='url_input' type='text' class='form-control' name='url'  placeholder='画面名称或完整地址'></div></div>").appendTo(subpageDiv);
        subpageDiv.find("input[name='url']").val(subpageconfigs.url);
        subpageDiv.dialogPk({
            width:"485px",
            height:"auto",
            title:"初始画面配置",
            onClose: function() {
                subpageconfigs.url = subpageDiv.find("input[name='url']").val();
                shape.customProp = subpageconfigs;
                pkpainter.renderShape(shape);
                subpageDiv.remove();
            }
        }).css({"z-index": Model.orderList.length + 1});

        //为输入框绑定事件，可以手动输入也可以选择路径
        $('#subpageDiv').find("input[type='checkbox']").bind("change",function(){

            if( $(this).is(":checked")){
                $('#url_input').removeAttr("readonly").css({"cursor":"auto"});
                $("#url_input").unbind('click');
            }else{
                $("#url_input").attr("readonly","readonly").css({"cursor":"pointer"});
                $('#isInput').attr("checked",false);

                var option = {title:'画面选择',url:'/page/queryPages',colNames:["名称","路径"],colIndex:["name","relPath"]};
                $("#url_input").unbind('click').bind('click',function(){
                    //打开选择画面页面
                    $("#url_input").chooseDialog(option,function(target){
                        var chooseId = jQuery("#tableChoose").getGridParam( "selrow");
                        var rowData = jQuery("#tableChoose").getRowData(chooseId);
                        target.val(rowData.relPath);
                    });
                });
            }
        });


    }
};

var pkgroupbutton={
    setImagePath:function(shape,newImagePath){
        //var shapeFillStyleMode = shape.fillStyle.display;
        delete shape.fillStyle;
        shape.fillStyle={display: "fit", fileId: newImagePath,type: "image" };
        //shape.fillStyle = $.extend(shape.fillStyle,{display: "stretch",fileId: newImagePath }); // 不要合并，而是替换，否则线型属性还在里面
    },
    renderComp:function(shape, shapeRect,shapeRectScaled) {
        var domShapeBox = $("#" + shape.id);
        var textBlock=shape.getTextBlock();
        var text = textBlock.text;
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(domComp.length <= 0){
            domComp = $('<input type="text"'+pkcomphelper.getCompAttrString(shape,"") +'class="text_canvas" style="width:100%;height:100%;border:transparent !important;background:transparent !important;" > </input>').appendTo(domShapeBox);
            domComp.bind("focus", function () {//这句话导致鼠标无法进入
                $(this).blur();
            });
            domComp.attr("readonly", "readonly");

            $("#"+shape.id).unbind().on("mouseover",function(){
                //shape.customProp["currentImg"] = "mouseover";
                //pkgroupbutton.setPicUrl(shape);
                //pkpainter.renderShape(shape);
            }).on("mouseout",function(){
                //shape.customProp["currentImg"] = shape.customProp["lastImg"]?shape.customProp["lastImg"]:null;
                //pkgroupbutton.setPicUrl(shape);
                //pkpainter.renderShape(shape);
            }).on("keyup",function(event){
                pkcomphelper.triggerEventById(shape.id,"onKeyUp",shape.name,event);
            });
            //绑定点击事件
            function onClick() {
                if(g_designMode)
                    return;

                if (shape.customProp && shape.customProp.disable != undefined && shape.customProp.disable) { // 如果处于disable状态
                    //$("#"+shape.id).css({"cursor":"not-allowed"});
                    //$("#" + shape.id).unbind();
                    //return;
                }

                if (shape.customProp && shape.customProp["groupName"] && shape.customProp["groupName"] != "") {
                    var shapes = Model.define.elements;
                    for (var shapeId in shapes) {
                        var oneShape = shapes[shapeId];
                        if (oneShape.customProp && oneShape.customProp["groupName"] == shape.customProp["groupName"]) {
                            var needRedraw = false;
                            if (oneShape.id == shape.id) {// 这个oneShape就是当前点击选中的对象
                                if (oneShape.customProp.curstate != "chosen") {
                                    oneShape.customProp.curstate = "chosen";
                                    oneShape.customProp.curImage = oneShape.customProp.chosen;
                                    needRedraw = true; // 只要点击该按钮就进行刷新
                                }
                            }else{
                                if (oneShape.customProp.curstate != "unchosen") {
                                    oneShape.customProp.curstate = "unchosen";
                                    needRedraw = true;
                                    oneShape.customProp.curImage = oneShape.customProp.unchosen;
                                }
                            }

                            if (needRedraw) {
                                pkgroupbutton.setImagePath(oneShape, oneShape.customProp.curImage);
                                pkpainter.renderShape(oneShape);
                            }
                        }
                    }
                    pkcomphelper.triggerEventById(shape.id, "onClick", shape.name); // 触发点击事件
                }
            }
            $("#"+shape.id).on("click", onClick);
        }
        domComp.val(text); // 修改时也要赋值，因此不能仅仅创建时赋值

        if(!shape.customProp){ // 没有图片，只有文本
            pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, false); // 高度固定，不需要再计算
            return;
        }

        // 先绘制图片，再绘制文本
        this.setPicState(shape);
        pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, false); // 高度固定，不需要再计算
        //pkpainter.renderShape(shape);
    },
    click:function(objectname){
        var domComp = $("input"+pkcomphelper.getSelectorByName(objectname));
        domComp.trigger("click");
    },
    focus:function(objectname){
        pkcomphelper.focus(objectname);
    },
    setState:function(objectname,stateValue){// 4个状态，值为：unchosen,chosen,disable,init,
        if(stateValue!="unchosen"&&stateValue!="chosen"&&stateValue!="disable"&&stateValue!=""&&stateValue!="none"){
            pksys.msgbox("pkgroupbutton.setState的值只可能是如下字符串的一种:unchosen,chosen,disable,init");
            return;
        }

        var shape=pkcomphelper.getShapeByNameAndShape(objectname,"groupbutton");
        if(shape==undefined){
            pksys.msgbox("pkgroupbutton.setState的根据名称:"+objectname+"未找到对象,请检查该名称对象是否存在!");
            return;
        }
        shape.customProp.curstate = stateValue;
        if(shape.customProp.curstate == "chosen")
            shape.customProp.curImage = shape.customProp.chosen;
        else if(shape.customProp.curstate == "unchosen")
            shape.customProp.curImage = shape.customProp.unchosen;
        else if(shape.customProp.curstate == "disable")
            shape.customProp.curImage = shape.customProp.disable;
        else // "" or none
            shape.customProp.curImage = "";

        pkgroupbutton.setImagePath(shape,shape.customProp.curImage);
        pkpainter.renderShape(shape);
    },
    setPicState:function(shape){
        // 先绘制图片，再绘制文本
        var defaultState = "";//"/page/groupbutton_default.png";
        if(shape.customProp.curstate == undefined){ // 初始状态
            if(!shape.customProp.unchosen) // 如果未选中未配置，则设为缺省图标
                shape.customProp.unchosen = defaultState;
            if(!shape.customProp.chosen) // 如果未选中未配置，则设为缺省图标
                shape.customProp.chosen = defaultState;
            if(!shape.customProp.disable) // 如果未选中未配置，则设为缺省图标
                shape.customProp.disable = defaultState;
            if(!shape.customProp.initstate) // 如果未选中未配置，则设为缺省图标
                shape.customProp.initstate = defaultState;

            shape.customProp.curstate = shape.customProp.initstate;
            if(shape.customProp.curstate == "chosen")
                shape.customProp.curImage = shape.customProp.chosen;
            else if(shape.customProp.curstate == "unchosen")
                shape.customProp.curImage = shape.customProp.unchosen;
            else if(shape.customProp.curstate == "disable")
                shape.customProp.curImage = shape.customProp.disable;
            else{
                shape.customProp.curstate = defaultState;
                shape.customProp.curImage = "";
            }
        }

        if(shape.customProp.curstate == "chosen")
            shape.customProp.curImage = shape.customProp.chosen;
        else if(shape.customProp.curstate == "unchosen")
            shape.customProp.curImage = shape.customProp.unchosen;
        else if(shape.customProp.curstate == "disable")
            shape.customProp.curImage = shape.customProp.disable;
        else
            shape.customProp.curImage = "";

        pkgroupbutton.setImagePath(shape,shape.customProp.curImage);
    },
    setEnable : function(objectname, isenable) {
        var objs = $("#designer_canvas").find(pkcomphelper.getSelectorByName(objectname));
        if (objs[0]) {
            if (typeof (isenable) == "undefined") {
                isenable == !objs.is(":disabled");
            }
            var shape = Model.getShapeById(objs.attr("forshape"));
            if (isenable) {// 设置可用
                if (shape.customProp) {
                    shape.customProp.enable = "1";
                    pkpainter.renderShape(shape);
                } else {
                    shape.customProp = {
                        enable : "1"
                    };
                    pkpainter.renderShape(shape);
                }
                if (shape.type == "groupbutton") {
                    shape.customProp["currentImg"] = shape.customProp["lastImg"];
                    pkpainter.renderShape(shape);
                }
                objs.removeAttr("disabled");
                if (shape && shape.props && shape.props.cursor) {
                    objs.parent().css({
                        "cursor" : shape.props.cursor
                    });
                } else if (shape.type.indexOf("button") > -1) {
                    objs.parent().css({
                        "cursor" : "pointer"
                    });
                } else {
                    objs.parent().css({
                        "cursor" : "default"
                    });
                }
            } else {// 不可用
                if (shape.customProp) {
                    shape.customProp.enable = "0";
                    pkpainter.renderShape(shape);
                } else {
                    shape.customProp = {
                        enable : "0"
                    };
                    pkpainter.renderShape(shape);
                }
                objs.attr("disabled", "disabled");
                objs.parent().css({
                    "cursor" : "not-allowed"
                });
                if (shape.type == "groupbutton") {
                    shape.customProp["lastImg"] = shape.customProp["currentImg"];
                    shape.customProp["currentImg"] = "disable";
                    pkpainter.renderShape(shape);
                }
                objs.parent().unbind();// 取消所有事件绑定
            }
            Model.update(shape)
        } else
            console.log("未获取到对象");
    },
    getEnable : function(objectname) {
        var objs = $("#designer_canvas").find(pkcomphelper.getSelectorByName(objectname));
        if (objs[0]) {
            return !objs.is(":disabled");
        }
        console.log("未获取到对象");
        return undefined;
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.mouseEventDesc).concat(pkcomphelper.keyEventDesc); // onKeyUp 用于捕获按键
    },
    showConfigUI: function(shape){
        //var defaultImagePath = "/page/groupbutton_default.png";

        var buttonconfigs = {};
        if(shape.customProp != undefined){
            buttonconfigs = shape.customProp
        }

        var buttonConfigDiv = $("<div id='buttonConfigDiv'></div>").appendTo("body");
        //是否启用控件
        // $('<div style="">&nbsp; <input type="checkbox" name="enable" checked="checked"/>启用控件</div>').appendTo(buttonConfigDiv);
        var defaultImagePath="";
        var div1 = $('<div style="text-align:center;height:50px"><div style="float:left;padding-top:18px;">未选中图片(unchosen)：</div></div>').appendTo(buttonConfigDiv);
        $('<div style="float:left;height:100%"><img name="unchosen" id="unchosen" src="'+(buttonconfigs["unchosen"]?buttonconfigs["unchosen"]:defaultImagePath)+'" width="90" height="50"/> </div>').appendTo(div1);
        $('<div style="float:left;padding-top:18px;">&nbsp; <input type="radio" name="initstate" value="unchosen" checked />  初始值&nbsp</div>').appendTo(div1);

        var div3 = $('<div style="text-align:center;height:50px"><div style="float:left;padding-top:18px;">按钮选中(chosen)：</div></div>').appendTo(buttonConfigDiv);
        $('<div style="float:left;height:100%"><img name="chosen"  id="chosen"  src="'+(buttonconfigs["chosen"]?buttonconfigs["chosen"]:defaultImagePath)+'" width="90" height="50"/> </div>').appendTo(div3);
        $('<div style="float:left;padding-top:18px;">&nbsp; <input type="radio" name="initstate" value="chosen"  />初始值&nbsp </div>').appendTo(div3);

        var div4 = $('<div style="text-align:center;height:50px"><div style="float:left;padding-top:18px;">按钮灰化(disable)：</div></div>').appendTo(buttonConfigDiv);
        $('<div style="float:left;height:100%"><img name="disable"  id="disable"  src="'+(buttonconfigs["disable"]?buttonconfigs["disable"]:defaultImagePath)+'" width="90" height="50"/> </div>').appendTo(div4);
        $('<div style="float:left;padding-top:18px;">&nbsp; <input type="radio" name="initstate" value="disable"  />初始值&nbsp</div>').appendTo(div4);

        // var div2 = $('<div style="text-align:center;height:50px"><div style="float:left;padding-top:18px;">鼠标悬浮：</div></div>').appendTo(buttonConfigDiv);
        // $('<div style="float:left;height:100%"><img name="mouseover" id="mouseover" src="'+(buttonconfigs["mouseover"]?buttonconfigs["mouseover"]:defaultImagePath)+'" width="90" height="50"/> </div>').appendTo(div2);

        //组名
        $('<label class=" text-left" style="padding-top:10px;float: left;">组名：</label><div style="float: left;padding-left:10px;"><input class="form-control" type="text" name="groupName" value="" placeholder="同组组名必须相同"/></div>').appendTo(buttonConfigDiv);

        //  读取组名
        if(buttonconfigs["groupName"]){
            buttonConfigDiv.find("input[name='groupName']").val(buttonconfigs["groupName"]);
        }

        // 设置初始状态被选中的按钮
        buttonConfigDiv.find("input[name='initstate']").each(function(i,v){
            if($(this).val() == buttonconfigs["initstate"]){
                $(this).attr("checked",true)
            }else{
                $(this).attr("checked",false)
            }
        });

        // 是否启用属性
        //buttonConfigDiv.find("input[name='enable']").attr("checked",buttonconfigs["enable"] ? true:false);
        buttonConfigDiv.dialogPk({
            width:"350px",
            height:"auto",
            title:"组按钮配置",
            onClose: function() {
                var buttonconfig = {};
                buttonConfigDiv.find("img").each(function(i,v){// 保存每个图片路径
                    var picPath = $(this).attr("src");
                    if(!picPath || picPath=="")
                        picPath = "";//picPath = defaultImagePath;
                    buttonconfig[$(this).attr("name")] = picPath;
                });
                buttonconfig["initstate"] = buttonConfigDiv.find("input[name='initstate']:checked").val();
                buttonconfig["groupName"] = buttonConfigDiv.find("input[name='groupName']").val();
                // buttonconfig["enable"] = buttonConfigDiv.find("input[name='enable']").is(":checked");
                shape.customProp = buttonconfig;
                pkgroupbutton.setPicState(shape);
                pkpainter.renderShape(shape);
                buttonConfigDiv.remove();
            }
        }).css({"z-index": Model.orderList.length + 1});

        buttonConfigDiv.find("img").on("click",function(e){
            var imgID = $(this).attr("id");
            UI.showImageSelect(function(g, w, h) {
                $("#"+imgID).attr("src",g);
            })
        });
    },
};

var pkhistrendchart= {
    create: function (shape) {
        var domShapeBox = $("#" + shape.id);

        domShapeBox.find(".shape_canvas").hide();
        domShapeBox.find("textarea").remove();
        var domComp = $(pkcomphelper.getSelector(shape));
        //var domComp = $(this.getSelector(shape));
        if (domComp.length == 0)
            domComp = $('<iframe' + pkcomphelper.getCompAttrString(shape, "") + ' src="/trend/trendHis.htm"  class="text_canvas" style="width: 100%;height: 100%;border: 0px; position: absolute;top: 0px;left:0px;"></iframe>').appendTo(domShapeBox);
        var timestamp = new Date().getTime();
        //配置数据
        var params = JSON.stringify(shape.chartHisConfig);
        domComp.attr('src', "/trend/trendHis.htm?trendConfig=" + params);//这里将吧参数发过来
    },
    //历史趋势配置对话框
    showConfigUI:function(shape){
        var config = shape.chartHisConfig;
        //chartHisTableDiv 这是对话框需要为此写关闭事件
        var chartHisTableDiv = $("<div id='chartHisTableDiv' class='ui-tabs'  style='width:485px;'></div>").appendTo("body");
        //这个是右键弹出框最上边的tag
        $("<ul class='ui-tabs-nav'style= 'height: 36px;'><li class='ui-state-default ui-corner-top' style='cursor: pointer;' divId='#commonTab'>基本配置</li><li  divId='#columnsTab' style='cursor: pointer;' class='ui-state-default ui-corner-top'>曲线配置</li></ul>").appendTo(chartHisTableDiv);
        //基本参数配置
        $('<div id="commonTab" class="generalTableTab"></div>').appendTo(chartHisTableDiv);//输入框
        $('<label class=" col-sm-2 control-label text-left" style="padding-top:10px;">历史趋势名：</label><input class="form-control" id="trendChartHisName" placeholder="请输入历史趋势名称" col-sm-8" name="trendChartHisName" type="text"/>').appendTo("#commonTab");
        if(undefined!=config&&undefined!=config.chartName){
            $("#trendChartHisName").val(config.chartName);
        }
        //曲线配置
        $('<div id="chartsTab" class="generalTableTab"><table id="chartGrid"  tabindex="0"  style="width:100%;"></table></div>').appendTo(chartHisTableDiv);
        var grid_data = [];
        if(undefined!=config && config.charts!=undefined){
            grid_data = config.charts;//使用chartHisConfig:charts放这个历史趋势图的所有配置信息
        }
        var colNames = ["曲线显示名称","变量名称"];
        var colModel =  [ {name:'text',index:'text', width:200, sorttype:"text", editable: true},
            {name:'name',index:'name', width:90, sorttype:"text", editable: true,hidden:false},];
        //添加删除按钮
        var addChartsBtn = $('<button id="addColumns" class="icon-plus" >添加</button>').appendTo("#chartsTab");
        var delChartsBtn = $('<button id="delColumns" class="icon-minus">删除</button>').appendTo("#chartsTab");
        //添加查询字段
        addChartsBtn.on("click",function(){
            jQuery('#chartGrid').jqGrid('addRowData',$("#chartGrid").getGridParam("reccount")+1,{text:'',name:'',width:'1'},"last");
        }).css({margin: "5px 5px","line-height": "24px",width: 60,"background-color": "white", border: "1px solid #ccc"});
        //删除查询字段
        delChartsBtn.on("click",function(){
            var ids = $("#chartGrid").jqGrid('getGridParam','selrow');
            for(var i=0;i<ids.length;i++){
                jQuery('#chartGrid').jqGrid('delRowData',ids[i]);
            }
        }).css({margin: "5px 5px","line-height": "24px",width: 60,"background-color": "white", border: "1px solid #ccc"});
        pkcomphelper.createConfigGrid(grid_data,250,"#chartGrid","",colNames,colModel,1000,"");//生成曲线的配置信息
        //tab切换事件
        $("#chartHisTableDiv ul li").bind("click",function(){
            $("#chartHisTableDiv ul li").removeClass("ui-state-default");
            $(this).addClass("ui-state-default");
            $("#chartHisTableDiv div .generalTableTab ").hide();
            var o = $(this).attr("divId");
            $(o).show();
        });
        //历史趋势图配置信息关闭事件
        chartHisTableDiv.dialogPk({
            width:"485px",
            height:"auto",
            title:"历史趋势服务配置",
            onClose: function() {//关闭事件，将数据全部保存到数据库中
                var chartHisConfig = {};//
                chartHisConfig.charts = $('#chartGrid').jqGrid("getRowData");//获取
                chartHisConfig.chartName = chartHisTableDiv.find("input[name='trendChartHisName']").val();//
                shape.chartHisConfig = chartHisConfig;//配置信息在数据库中为chartHisConfig
                pkpainter.renderShape(shape);
                chartHisTableDiv.remove();
            }
        }).css({"z-index": Model.orderList.length + 1});
    },
};

var pkgauge={
    renderComp:function(shape) {
        var domShapeBox = $("#" + shape.id);
        var value = 50;//初始大小
        var name = '';//'完成率(%)';//仪表盘显示文字
        var min = 0 ;
        var max = 100;
        var splitNumber = 10;
        var asNumber = 5;
        if(shape.getTextBlock() && shape.getTextBlock().text)// && !isNaN(shape.getTextBlock().text.trim()))//如果配置信息的文字不为空
            value = shape.getTextBlock().text;//不使用默认值
        if(shape.customProp){//
            if(shape.customProp.gname && shape.customProp.gname.trim() != '')
                name = shape.customProp.gname;
            if(shape.customProp.grange_min && !isNaN(shape.customProp.grange_min))
                min = parseFloat(shape.customProp.grange_min)
            if(shape.customProp.grange_max && !isNaN(shape.customProp.grange_max))
                max = parseFloat(shape.customProp.grange_max)
        }
        domShapeBox.find(".shape_canvas").hide();
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(domComp.length <= 0){
            domComp = $("<div"+pkcomphelper.getCompAttrString(shape,"") +" style='width:100%;height:100%;'> </div>").appendTo(domShapeBox);
        }
        if(min != 0 ||　max != 100){
            for(var i = 10; i > 5;i--){
                if((max-min)%i == 0){
                    asNumber = (max - min) / i;
                    splitNumber = i;
                    break;
                }
            }
        }
        var myChart = echarts.init(domComp[0]);//
        var option = undefined;
        if(myChart._model && myChart._model.getOption)
            option = myChart._model.getOption();
        if(option == undefined) {
            option = {//仪表盘配置参数
                tooltip: {
                    show: true,
                    formatter: "{a} <br/>{b} : {c}"
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {show: true},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: shape.name,
                        type: 'gauge',
                        detail: {formatter: '{value}'},
                        data: [{value: value, name: name}],
                        radius: '99%',
                        min: min,
                        max: max,
                        splitNumber: splitNumber,
                        splitLine: {
                            show: true,
                            length: 30,
                            lineStyle: {
                                color: '#eee',
                                width: 2,
                                type: 'solid'
                            }
                        },
                        axisTick: {
                            show: true,
                            splitNumber: asNumber,
                            length: 8,
                            lineStyle: {
                                color: '#eee',
                                width: 1,
                                type: 'solid'
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: [
                                    [1 / splitNumber, '#228b22'],
                                    [(splitNumber - 1) / splitNumber, '#48b'],
                                    [1, '#ff4500']
                                ],
                                width: 30
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    }
};

var pktree= {
    renderComp: function (shape) {
        var domShapeBox = $("#" + shape.id);

        //清除画布图画
        if (!g_designMode){// 运行时
            domShapeBox.find(".shape_canvas").hide();
        }else{
            domShapeBox.find(".shape_canvas").hide();
        }

        var jsTreeConfig = {};
        if (shape.customProp != undefined) {
            jsTreeConfig = shape.customProp
        }
        var data;
        if (jsTreeConfig.datatype == "server") {
            data = {};
            data.url = jsTreeConfig.url;
            data['data'] = function (node) {
                return {'id': node.id};
            }
        } else {
            data = [
                {
                    "id": "1",
                    "text": jsTreeConfig.root || "root",
                    "state": {
                        "opened": true,          //展示第一个层级下面的node
                        "disabled": false         //该根节点不可点击
                    },
                    "parent": "#"
                }, {"id": "3", "text": "cccccc2", "state": {"opened": true, "disabled": false}, "parent": "1"}
            ]

        }
        //有关画面的代码已经结束
        //生成jsTree
        var domComp = domShapeBox.find(pkcomphelper.getSelector(shape));
        var lastid = 0;
        if (domComp.length == 0) {
            domComp = $('<div' + pkcomphelper.getCompAttrString(shape, "") + 'class="jstree jstree-3 jstree-default pk-jstree" role="tree" ></div>').appendTo(domShapeBox);
            var timer = null;
            domComp.jstree({
                'core': {
                    "multiple": false,
                    'data': data,
                    'dblclick_toggle': true,//tree的双击展开
                    "strings": {
                        'Loading ...': '正在加载...'
                    }
                },
                "plugins": ["search"]
            }).bind("click.jstree", function (event, data) {
                //varvar e = domComp.jstree(true).select_node(event.target.parentNode.id);

                clearTimeout(timer);
                timer = setTimeout(function () {
                    var node = domComp.jstree(true).get_node(event.target.parentNode.id);
                    //pksys.log(data.event.button);
                    var treeObj, nodeObj, userData;
                    treeObj = {
                        name: "" + shape.name,
                        id: shape.id,

                    }
                    nodeObj = node;
                    userData = node.data;
                    try {
                        if (typeof(eval("shape_" + shape.id + "_onClick")) == "function")
                            eval("shape_" + shape.id + "_onClick(treeObj,nodeObj,userData)")
                    } catch (e) {
                        console.log("no function :" + e);
                    }
                }, 300);
            }).bind("dblclick.jstree", function (event, data) {
                clearTimeout(timer);
                var node = domComp.jstree(true).get_node(event.target.parentNode.id);
                //pksys.log(data.event.button);
                var treeObj, nodeObj, userData;
                treeObj = {
                    name: pkcomphelper.getCompName(shape.name),
                    id: shape.id,

                }
                nodeObj = node;
                userData = nodeObj.data;
                try {
                    if (typeof(eval("shape_" + shape.id + "_onRightClick")) == "function")
                        eval("shape_" + shape.id + "_onRightClick(treeObj,nodeObj,userData)")
                } catch (e) {
                    console.log("no function :");
                }
                console.log("dblclick :");
            });
        }
    },
    //树结构配置
    showConfigUI: function(shape){
        var jstreeconfigs = {};
        if(shape.customProp != undefined){
            jstreeconfigs = shape.customProp
        }

        var jsTreeConfigDiv = $("<div id='jsTreeConfigDiv'></div>").appendTo("body");
        $('<label class=" col-sm-12 control-label text-left">选择数据源：</label>').appendTo(jsTreeConfigDiv);
        var locationDiv = $('<div class="col-sm-4"> <input class="datatype" type="radio" name="datatype" value="location" checked/>本地数据</div>').appendTo(jsTreeConfigDiv);
        var serverDiv = $('<div class="col-sm-4"><input class="datatype" type="radio" name="datatype" value="server"/>远程服务</div>').appendTo(jsTreeConfigDiv);
        $('<div class="col-sm-11 dock_devider" style="padding-bottom:10px;"></div>').appendTo(jsTreeConfigDiv);
        var URIDiv = $('<label class=" col-sm-2 control-label text-left" style="padding-top:10px;">url：</label><div class="col-sm-8 "><input class="form-control" type="text" name="url" value="" placeholder="如http://eview.peakinfon.com/getDate"/></div>').appendTo(jsTreeConfigDiv);
        var LDataDiv = $('<label class=" col-sm-5 control-label text-left" style="padding-top:10px;  padding-right: 0px; width: 35%;">根节点名称：</label><div class="col-sm-6 "><input class="form-control" type="text" name="root" value="" placeholder="如root"/></div>').appendTo(jsTreeConfigDiv);
        URIDiv.hide();
        if(jstreeconfigs && jstreeconfigs.datatype){
            if(jstreeconfigs.datatype == "server" ){
                serverDiv.find("input[name='datatype']").attr("checked",true);
                URIDiv.find("input[name='url']").val(jstreeconfigs.url);
                URIDiv.show();
                LDataDiv.hide()
            }
            else{
                locationDiv.find("input[name='datatype']").attr("checked",true);
                LDataDiv.find("input[name='root']").val(jstreeconfigs.root);
                URIDiv.hide();
                LDataDiv.show()
            }
        }
        $("#jsTreeConfigDiv .datatype").on("click",function(){
            if( $(this).val() == "server"){
                URIDiv.show();
                LDataDiv.hide()
            }else{
                URIDiv.hide();
                LDataDiv.show()
            }
        });
        jsTreeConfigDiv.dialogPk({
            width:"285px",
            height:"auto",
            title:"树配置",
            onClose: function() {
                var jstreeconfig = {};
                jstreeconfig["url"] = URIDiv.find("input[name='url']").val();
                jstreeconfig["root"] = LDataDiv.find("input[name='root']").val();
                jstreeconfig["datatype"] = jsTreeConfigDiv.find("input[name='datatype']:checked").val();
                shape.customProp = jstreeconfig;
                pkpainter.renderShape(shape);
                jsTreeConfigDiv.remove();
            }
        }).css({"z-index": Model.orderList.length + 1});
    },
    // treeData格式：.....
    setData : function(treeName, treeData) {
        var obj = $("#designer_canvas").find(pkcomphelper.getSelectorByName(treeName)+":first");
        if (obj.length==1) {
            obj.jstree(true).settings.core.data = treeData;
            obj.jstree(true).refresh();
        } else
            pksys.msgbox("未获取到对象");
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return [["onClick","objectname,nodeObj,userData"]]; // 支持click事件.参数1：radiobox的name，参数2：选中的值
    },
    bindEvents:function(objectid,objectname,eventName){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        if(eventName == "onClick"){
            pksys.msgbox("树的onClick事件尚未实现");
        }
    },
};

//这个不能删除，因为在PKtrend.js中的代码将直接执行页面加载事件
var pktrendchart= {
    renderComp: function (shape) {
        if(g_designMode)//如果不是运行页面将不能开始实时数据
            return;
        var domShapeBox = $("#" + shape.id);
        var domComp = $(pkcomphelper.getSelector(shape));
        if (domComp.length == 0){
            domShapeBox.find(".shape_canvas").hide();
            domComp = $('<iframe'  + pkcomphelper.getCompAttrString(shape, "") + ' id="trendchartiframe" src="/trend/trend.htm"  class="text_canvas" style="width: 100%;height: 100%;border: 0px; position: absolute;top: 0px;left:0px;"></iframe>').appendTo(domShapeBox);
        }
        var timestamp = new Date().getTime();
        //配置数据
        var params = JSON.stringify(shape.customProp);
        //'={"type":0,"isshownav":0,"maintheme":0,"starttime":'+timestamp+',"endtime":'+timestamp+',"refreshrate":1000,"title":"测试","groups":[{"name":"qw","desc":"as","tags":[["tag1","s"]],"lines":[{"name":"s","linecolor":"058DC7","linestyle":"Solid","linewidth":1,"max":"0","min":"0","average":"0"}]}],"selgroup":"qw","tags":[["tag1","s"]],"tenant":"user","customtimes":[{"name":"今天","desc":"","model":"0","count":"0","unit":""},{"name":"前24小时","desc":"","model":"0","count":"1","unit":""},{"name":"前7天","desc":"","model":"0","count":"2","unit":""},{"name":"前30天","desc":"","model":"0","count":"3","unit":""},{"name":"本月","desc":"","model":"0","count":"4","unit":""}]}';
        domComp.attr('src', "/trend/trend.htm?trendConfig=" + params);
        //趋势图数据
        var datas = {tag1: [{value: '1', time: '2016-02-12 13:12:34'}, {value: '2', time: '2016-02-12 13:12:44'}]};
        //createTrendChart(datas);//生成模板
        //initTrendchart("趋势图",1,datas,shape.props);
        //如果是运行状态，需要从tag点取数据生成趋势图？？
    },
    //实时趋势配置对话框
    showConfigUI : function(shape){
        if(shape.customProp == undefined){
            shape.customProp = {
                "type":0,
                "isshownav":0,
                "isreal":1,
                "maintheme":0,
                "starttime": moment().subtract(5, "minutes").format("YYYY-MM-DD HH:mm:ss"),
                "endtime": moment().format("YYYY-MM-DD HH:mm:ss"),
                "refreshrate":1000,
                "title":"",
                "groups":[],
                "selgroup":"",
                "tags":[],
                "tenant":"user",
                "customtimes":[]
            };
        }
        $("#trendchartDlg").dialogPk({
            width:"485px",
            height:"auto",
            onClose: function() {
                //保存数据
                //保存所有编辑状态下的数据
                var ids = jQuery("#specialPropertyTable").jqGrid('getDataIDs');
                // {"name":"s","linecolor":"058DC7","linestyle":"Solid","linewidth":1,"max":"0","min":"0","average":"0"}
                var group = {"name":$("#groupSelect").val(),"desc":$("#showDescName").val(),"tags":[],"lines":[{name: "", linecolor: "058DC7",linestyle: "Solid",linewidth: "1",max: "0",min: "0",average: "0" }]};
                for(var i = 0; i < ids.length; i++){
                    $("#specialPropertyTable").saveRow(ids[i], false, 'clientArray');
                    var rowData = $("#specialPropertyTable").getRowData(ids[i]);
                    var tag = [rowData.tagname,rowData.name];
                    group.tags.push(tag);
                    group.lines[0].name = rowData.name;
                }
                var customtimes=[];
                //获取当前所有数据
                customtimes = $('#customTimeTable').jqGrid("getRowData");
                var groups = [];
                groups.push(group);
                shape.customProp.title =  $("#trendTitle").val();
                if($("#historyTdOrcurrendTd").is(':checked'))
                    shape.customProp.isreal = 1
                else{
                    shape.customProp.isreal = 0;
                }
                shape.customProp.selgroup = group.name;
                shape.customProp.tags = group.tags;
                shape.customProp.groups = groups;
                shape.customProp.customtimes = customtimes;
                pkpainter.renderShape(shape)
            }
        }).css("top","50px");//关闭事件执行完毕
        $("#historyTdOrcurrendTd").bind("click",function(){
            if($(this).is(':checked')){
                $("#config-demo").attr("disabled", true)
            }else{
                $("#config-demo").attr("disabled", false)
            }
        });
        //趋势名称
        $("#trendTitle").val(shape.customProp.title);
        //是否实时
        if(shape.customProp.isreal==0){
            $("#config-demo").attr("disabled", false);
        }else{
            $("#config-demo").attr("disabled", true);
        }
        //显示配置数据
        //曲线配置
        var grid_data = [ {name:"今天",desc:"today",detail:'今天',model:"0",count:"0",unit:""},
            {name:'前一天',desc:'',detail:'前一天',model:"0",count:"1",unit:""},
            {name:'前一周',desc:'',detail:'前一周',model:"0",count:"2",unit:""},
            {name:'前一月',desc:'',detail:'前一月',model:"0",count:"3",unit:""},
            {name:'本月',desc:'',detail:'本月',model:"0",count:"4",unit:""}];
        if(shape.customProp.customtimes.length>0)
            grid_data = shape.customProp.customtimes;
        var colNames = ["名称","描述","详情","模式","时间","单位"];
        var colModel =  [ {name:'name',index:'name', width:100, sorttype:"text", editable: true},
            {name:'desc',index:'desc', width:100, sorttype:"text", editable: true},
            {name:'detail',index:'detail',width:200, sorttype:"text", editable: true},
            {name:'model',index:'model',width:100, sorttype:"text", hidden: true},
            {name:'count',index:'count',width:100, sorttype:"text", hidden: true},
            {name:'unit',index:'unit',width:100, sorttype:"text", hidden: true,}
        ];
        pkcomphelper.createConfigGrid(grid_data,250,"#customTimeTable","",colNames,colModel,1000,"",true);
        //自定义时间段配置
        grid_data = [];
        if(shape.customProp.groups.length>0){
            var tags = shape.customProp.groups[0].tags;

            $.each(tags,function(i,v){
                var tag = {name:v[1],tagname:v[0]};
                grid_data.push(tag);
            })
        }
        colNames = ["曲线","变量名"];
        colModel =  [ {name:'name',index:'name', width:200, sorttype:"text", editable: true},
            {name:'tagname',index:'tagname',  width:200, sorttype:"text", editable: true,}
        ];
        pkcomphelper.createConfigGrid(grid_data,250,"#specialPropertyTable","",colNames,colModel,1000,"",true);
        //tab切换事件
        $("#trendchartDlg ul li").bind("click",function(){
            $("#trendchartDlg ul li").removeClass("ui-tabs-active");
            $(this).addClass("ui-tabs-active");
            $("#trendchartDlg #trendCfgDlg div.trend_divbox ").hide();
            var o = $(this).find("a").attr("href");
            $(o).show();
        });
    },
};

var pksound= {
    createComp: function (shape) {
    },
    onCreated:function(shape){
        UI.showSoundSelect(function(m, l, n) {
            Designer.setFillStyle({
                type: "image",
                fileId: m,
                imageW: l,
                imageH: n
            })
        });
    },
    getScreenPosition:function(objectName) {// 返回:x,y,w,h
        return pkcomphelper.getScreenPosition(objectName);
    }
};
// 必须放在文件结尾，切不能放在ready中，必须开始就加载起来，因为pic.js要用到
var imageProp=Schema.getDefaultProp(160,160,undefined,"138,138,138","image","","rectangle",true); // 无文本、填充、线型，但有alpha
imageProp.lineStyle.lineWidth=0;
Schema.addCompType("image", pkimage, "画布图片", "control", "img/image.png", "img/imageThumb.png", imageProp);
Schema.addCompType("pkimage2", pkimage2, "标签图片", "control", "img/image.png", "img/imageThumb.png", Schema.getDefaultProp(600,300));

var advProp=Schema.getDefaultProp(160,160,undefined,undefined,undefined,undefined,undefined,false); // 无文本、填充、线型、alpha
Schema.addCompType("timer", pktimer, "定时器", "control", "img/timer.png", "img/timerThumb.png", Schema.getDefaultProp(160,160,undefined,undefined,"img/image","img/timerBig.png","roundRectangle",true));
advProp.props={w:300,h:300};
Schema.addCompType("gauge", pkgauge, "仪表盘", "control", "img/gauge.png", "img/gaugeThumb.png", Schema.getDefaultProp(300,300,"标题")); // 需要一个文本框表示标题
Schema.addCompType("realalarmlist", pkrealalarmlist, "实时报警列表", "control", "img/realalarm.png", "img/realalarmThumb.png", Schema.getDefaultProp(600,300));
Schema.addCompType("hisalarmlist", pkhisalarmlist, "历史报警列表", "control", "img/hisalarm.png", "img/hisalarmThumb.png",Schema.getDefaultProp(600,300));
Schema.addCompType("grid", pkgrid, "表格", "control", "img/grid.png", "img/gridThumb.png", Schema.getDefaultProp(600,300));
Schema.addCompType("video", pkvideo, "视频控件", "control", "img/video.png", "img/videoThumb.png", Schema.getDefaultProp(600,300));
Schema.addCompType("subpage", pksubpage, "子画面", "control", "img/subpage.png", "img/subpageThumb.png", Schema.getDefaultProp(600,400,undefined,undefined,"image","img/subpageBig.png","roundRectangle",true));
Schema.addCompType("trendchart", pktrendchart, "趋势图", "control", "img/trendchart.png", "img/trendchartThumb.png", Schema.getDefaultProp(600,600,undefined,undefined,"image","img/trendchartBig.png","roundRectangle",true));
Schema.addCompType("loglist", pkloglist, "操作日志", "control", "img/loglist.png", "img/loglistThumb.png", Schema.getDefaultProp(600,600));


var groupbuttonProp=Schema.getDefaultProp(160,80,"","0,0,0","solid","138,138,138","roundRectangle",true); // 按钮有文本、填充，无线型
groupbuttonProp.fillStyle=  {
    type: "gradient",
    gradientType: "linear",
    beginColor: "233,233,233",
    endColor: "200,200,200",
    angle: 0
};
Schema.addCompType("groupbutton", pkgroupbutton, "按钮组", "control", "img/groupbutton.png", "img/groupbuttonThumb.png",groupbuttonProp);

Schema.addCompType("tree", pktree, "树", "control", "img/tree.png", "img/treeThumb.png",Schema.getDefaultProp(600,600));
Schema.addCompType("sound", pksound, "声音", "control", "img/audio.png", "img/audio.png", Schema.getDefaultProp(100,100));
Schema.addCompType("video2", pkvideo2, "视频控件2", "control", "img/pkvideo2icon.png", "img/pkvideo2.png", Schema.getDefaultProp(600,300));
Schema.addCompType("pkpie", pkpie, "饼图", "control", "img/pkpieicon.jpg", "img/pkpieicon.jpg", Schema.getDefaultProp(300,300));
Schema.addCompType("pktrendLine", pktrendLine, "折线图", "control", "img/pktrendLine.jpg", "img/pktrendLine.jpg", Schema.getDefaultProp(300,300));
Schema.addCompType("pkchartladar", pkchartladar, "雷达图", "control", "img/chartladar.png", "img/chartladar.png", Schema.getDefaultProp(350,350));
Schema.addCompType("pkslider", pkslider, "slider", "control", "img/pkslider.png", "img/pkslider.png", Schema.getDefaultProp(250,25));
Schema.addCompType("pkfileupload", pkfileupload, "文件上传", "control", "img/pkslider.png", "img/pkslider.png", Schema.getDefaultProp(250,25));

