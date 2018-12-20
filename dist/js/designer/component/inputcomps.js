Schema.addCategory({
    name: "input",
    text: "输入控件"
});
$(document).ready(function() { // 赋值放在这里，保证比对象生成晚些
});

var pktext={
    renderComp:function(shape,shapeRect,shapeRectScaled){
        var domShapeBox = $("#" + shape.id);
        var textBlock = shape.getTextBlock(); // 每个元素包括：fontstyle、positon{x,y,h,w},text
        if(textBlock == undefined)
            return;

        var text = textBlock.text;
        shape.initialText = text; // 初始文本保留一下，以便在后面不匹配任何值时显示该文本
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(domComp.length <= 0){
            domComp = $("<textarea"+pkcomphelper.getCompAttrString(shape,"") +" class='text_canvas' style='width:100%;height:100%;border-radius: 5px'> </textarea>").appendTo(domShapeBox);
            domComp.attr("readonly", "readonly");
        }
        domComp.val(text);
        pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, true); // 高度固定，不需要再计算
    },
    setText : function(objectname, text) {
        var domComp = $(pkcomphelper.getSelectorByNameAndType(objectname,"text")+":first");
        if(domComp.length <= 0){
            pksys.msgbox("pktext.setText没有名称为:"+objectname+"的文本框");
            return;
        }

        var textToDisplay = text;
        var shape=pkcomphelper.getShapeByNameAndShape(objectname, "text");
        if(shape){
            if(textToDisplay == undefined)
                textToDisplay = shape.initialText;// 初始文本的值
            domComp.val(text);// 只取第一个或者选中的值（内容）

            var textBlock = shape.getTextBlock();
            textBlock.text=text;
            shape.textBlock = textBlock;
            var shapeRect = Utils.getShapeBox(shape); // 计算得到外围矩形大小
            pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, true); // 高度固定，不需要再计算
        }else{
            pksys.msgbox("不存在名称为:"+objectname+"的文本框!");
            domComp.val(textToDisplay);// 只取第一个或者选中的值（内容）
        }
    },
    getText : function(objectname) {
        var obj = $(pkcomphelper.getSelectorByName(objectname)+":first");
        if(obj.length <= 0){
            pksys.msgbox("pktext.getText 没有名称为:"+objectname+"的文本框");
            return undefined;
        }
        var text = $(obj).val();// 只取第一个或者选中的值（内容）
        return text;
    },
    setTextColor:function(objectname,newcolor){
        var obj = $(pkcomphelper.getSelectorByName(objectname)+":first");
        if(obj.length <= 0){
            pksys.msgbox("pktext.setTextColor 没有名称为:"+objectname+"的文本框");
            return undefined;
        }
        var shape=pkcomphelper.getShapeByNameAndShape(objectname, "text");
        if(!shape || !shape.fontStyle )
            return;
        var textBlock = shape.getTextBlock();
        shape.fontStyle.color=newcolor;
        var shapeRect = Utils.getShapeBox(shape); // 计算得到外围矩形大小

        pkcomphelper.renderCompText(shape, shapeRect, obj, textBlock, true);
    },
    getTextColor:function(objectname){
        var obj = $(pkcomphelper.getSelectorByName(objectname)+":first");
        if(obj.length <= 0){
            pksys.msgbox("pktext.getTextColor 没有名称为:"+objectname+"的文本框");
            return undefined;
        }
        var shape=pkcomphelper.getShapeByNameAndShape(objectname, "text");
        if(!shape || !shape.getTextBlock())
            return;

        var textBlock = shape.getTextBlock();
        if(!textBlock.fontStyle)
            return;

        return textBlock.fontStyle.color;
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return  pkcomphelper.loadEventDesc.concat(pkcomphelper.mouseEventDesc);
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindMouseEvents(objectid,objectname,eventname);
    },
};

/*var pkslider={
    hasTextBlock:true,
    renderComp:function(shape,shapeRect){
        var domShapeBox = $("#" + shape.id);
    }
};*/
var pkbutton={
    renderComp:function(shape,shapeRect,shapeRectScaled){
        // 在拖动时已经根据schema生成了对象。因为按钮是完全根据schema来生成的，因此这里不需要做任何操作了
        var domShapeBox = $("#" + shape.id);
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        textBlock=shape.getTextBlock();
        var text = textBlock.text;
        if(domComp.length <= 0){
            domComp = $('<input type="text"'+pkcomphelper.getCompAttrString(shape,"") +'class="text_canvas" style="width:100%;height:100%;background:transparent!important;border:transparent !important;" > </input>').appendTo(domShapeBox);
            domComp.bind("focus", function () {//这句话导致鼠标无法进入
                 $(this).blur();
             });
            domComp.attr("readonly", "readonly");
        }
        domComp.val(text); // 修改时也要赋值，因此不能仅仅创建时赋值
        pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, false); // 高度固定，不需要再计算
    },
    click:function(objectname){
        var domComp = $("input"+pkcomphelper.getSelectorByName(objectname));
        domComp.trigger("click");
    },
    focus:function(objectname){
        pkcomphelper.focus(objectname);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.mouseEventDesc) ; //
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindMouseEvents(objectid,objectname,eventname);
    },
};

var pkeditbox={// 包括：text,textarea,password
    renderComp:function(shape,shapeRect,shapeRectScaled){
        var domShapeBox = $("#" + shape.id);
        var textBlock = shape.getTextBlock(); // 每个元素包括：fontstyle、positon{x,y,h,w},text
        if(textBlock == undefined){
            shape.initialText = "";
            return;
        }
        shape.initialText = textBlock.text; // 初始文本保留一下，以便在后面不匹配任何值时显示该文本
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(domComp.length <= 0){
            domComp = $('<input'+pkcomphelper.getCompAttrString(shape,"text") +'class="text_canvas" style="width:100%;height:100%;"> </input>').appendTo(domShapeBox);
            // if(g_designMode){
            //     textBlock.text="editbox";
            //     domComp.bind("focus", function () {//这句话导致鼠标无法进入
            //         $(this).blur();
            //     });
            // }else{
            //     textBlock.text=""; // editbox缺省没有数值
            // }
        }
        domComp.val(textBlock.text); // 修改时也要赋值，因此不能仅仅创建时赋值

        pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, false); // 高度固定，不需要再计算
    },
    show : function(objectname, isShow) {return pkcomphelper.setVisible(objectname, isShow); },
    setText : function(objectname, text) {
        var obj = $(pkcomphelper.getSelector(objectname)+":first");
        if(obj.length <= 0){
            pksys.msgbox("pkeditbox.setText没有名称为:"+objectname+"的文本输入框");
            return;
        }
        var textToDisplay = text;
        var shape=pkcomphelper.getShapeByNameAndShape(objectname,"editbox");
        if(shape){
            if(textToDisplay == undefined)
                textToDisplay = shape.initialText;// 初始文本的值

            var textBlock = shape.getTextBlock();
            textBlock.text=text;
            shape.textBlock=textBlock;
            var domShapeBox = $("#" + shape.id);
            var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
            var shapeRect = Utils.getShapeBox(shape); // 计算得到外围矩形大小
            pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, true); //重绘控件

        }
        obj.val(textToDisplay);
    },
    getText : function(objectname) {
        var obj = $(pkcomphelper.getSelector(objectname)+":first");
        if(obj.length <= 0){
            pksys.msgbox("pkeditbox.getText没有名称为:"+objectname+"的文本输入框");
            return undefined;
        }
        if(obj.length>1){
            pksys.msgbox("调用pkeditbox.getText时,名称为:"+objectname+"的对象超过一个，有："+obj.length+"个");
            return undefined;
        }
        var text = obj.val();// 只取第一个或者选中的值（内容）
        return text;
    },
    focus:function(objectname){
        pkcomphelper.focus(objectname);
    },
    select:function(objectname){// 选中已有的内容
        pkcomphelper.select(objectname);
    },
    setVisible:function(objectname, bVisible){
        return pkcomphelper.setVisible(objectname, bVisible);
    },
    getVisible:function(objectname){
        return pkcomphelper.getVisible(objectname);
    },
    setReadOnly:function(objName, isReadOnly){
        var obj = $(pkcomphelper.getSelectorByName(objName));
        if (obj.length <= 0) {
            pksys.msgbox("不存在对象名为:" + objName + "的对象");
            return;
        }
        obj.attr("readOnly",isReadOnly);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.changeEventDesc).concat(pkcomphelper.mouseEventDesc).concat(pkcomphelper.keyEventDesc);
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindChangeEvents(objectid,objectname,eventname);
        pkcomphelper.bindMouseEvents(objectid,objectname,eventname);
        pkcomphelper.bindKeyEvents(objectid,objectname,eventname);
    },
};

var pkpasswordbox={// 包括：text,textarea,password
    renderComp:function(shape,shapeRect,shapeRectScaled){
        var domShapeBox = $("#" + shape.id);
        //domShapeBox.find(".shape_canvas").hide(); // 这个对象会显示对象面板的图标出来
        var textBlock = shape.getTextBlock(); // 每个元素包括：fontstyle、positon{x,y,h,w},text
        if(textBlock == undefined)
            return;

        var text = textBlock.text;
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(domComp.length <= 0){
            domComp = $('<input'+pkcomphelper.getCompAttrString(shape,"password") +'class="text_canvas" style="width:100%;height:100%;"> </input>').appendTo(domShapeBox);
            if(g_designMode){
                textBlock.text="password";
                domComp.bind("focus", function () {//这句话导致鼠标无法进入
                    $(this).blur();
                });
            }else
                textBlock.text="";
        }
        domComp.val(text); // 修改时也要赋值，因此不能仅仅创建时赋值
        pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, false); // 高度固定，不需要再计算
    },
    show : function(objectname, isShow) {return pkcomphelper.setVisible(objectname, isSHow); },
    setText : function(objectname, text) {
        var obj = $(pkcomphelper.getSelector(objectname)+":first");
        if(obj.length <= 0){
            pksys.msgbox("pkpasswordbox.setText 没有名称为:"+objectname+"的密码输入框");
            return;
        }
        var obj1 = obj[0].val(text);// 只取第一个或者选中的值（内容）
        // obj.text(currValue);
    },
    getText : function(objectname) {
        var obj = $(pkcomphelper.getSelector(objectname)+":first");
        if(obj.length <= 0){
            pksys.msgbox("pkpasswordbox.getText 没有名称为:"+objectname+"的密码输入框");
            return undefined;
        }
        var text = obj.val();// 只取第一个或者选中的值（内容）
        return text;
    },
    focus:function(objectname){
        pkcomphelper.focus(objectname);
    },
    select:function(objectname){
        pkcomphelper.select(objectname);
    },
    setVisible:function(objectname, bVisible){
        return pkcomphelper.setVisible(objectname, bVisible);
    },
    getVisible:function(objectname){
        return pkcomphelper.getVisible(objectname);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.changeEventDesc).concat(pkcomphelper.keyEventDesc) ;
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindChangeEvents(objectid,objectname,eventname);
        pkcomphelper.bindKeyEvents(objectid,objectname,eventname);
    },
};

var pktextarea={// 包括：text,textarea,password
    renderComp:function(shape,shapeRect,shapeRectScaled){
        var domShapeBox = $("#" + shape.id);
        var textBlock = shape.getTextBlock(); // 每个元素包括：fontstyle、positon{x,y,h,w},text
        var text = textBlock.text;
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);//看看这个对象是不是已经生成了
        if(domComp.length <= 0){
            //domShapeBox.find(".shape_canvas").hide(); // 这个对象会显示对象面板的图标出来
            domComp = $('<textarea'+pkcomphelper.getCompAttrString(shape,"") +'class="text_canvas" style="width:100%;height:100%;"> </textarea>').appendTo(domShapeBox);
            if(g_designMode){
                textBlock.text="textarea";
                domComp.bind("focus", function () {//这句话导致鼠标无法进入
                    $(this).blur();
                });
            }else
                textBlock.text="";
        }
        domComp.val(text); // 修改时也要赋值，因此不能仅仅创建时赋值
        pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, true); // 高度固定，不需要再计算
    },
    show : function(objectname, isShow) {return pkcomphelper.setVisible(objectname, isSHow); },
    setText : function(objectname, text) {
        var obj = $(pkcomphelper.getSelectorByName(objectname)+":first");
        if(obj.length <= 0){
            pksys.msgbox("pktextarea.setText 没有名称为:"+objectname+"的文本区域");
            return;
        }
        var obj1 = $(obj).val(text);// 只取第一个或者选中的值（内容）
        // obj.text(currValue);
    },
    getText : function(objectname) {
        var obj = $(pkcomphelper.getSelectorByName(objectname)+":first");
        if(obj.length <= 0){
            pksys.msgbox("pktextarea.getText 没有名称为:"+objectname+"的文本区域");
            return undefined;
        }
        var text = $(obj).val();// 只取第一个或者选中的值（内容）
        return text;
    },
    focus:function(objectname){
        pkcomphelper.focus(objectname);
    },
    select:function(objectname){
        pkcomphelper.select(objectname);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.changeEventDesc).concat(pkcomphelper.keyEventDesc) ;
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindChangeEvents(objectid,objectname,eventname);
        pkcomphelper.bindKeyEvents(objectid,objectname,eventname);
    },
};

var pkcurdatetime= {
    renderComp:function(shape,shapeRect,shapeRectScaled){
        var domShapeBox = $("#" + shape.id);
        domShapeBox.find(".shape_canvas").hide(); // 这个对象会显示对象面板的图标出来
        var textBlock = shape.getTextBlock(); // 每个元素包括：fontstyle、positon{x,y,h,w},text
        var datetimeFormat = textBlock.text;
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(domComp.length <= 0){
            //定时刷新
            if(!g_designMode){
                domComp = $('<input'+pkcomphelper.getCompAttrString(shape,"text") +'readonly="readonly" style="width:100%;height:100%;background:#ffffff!important;" class="text_canvas"> </input>').appendTo(domShapeBox);//
                if (shape.attribute.ontime) {
                    clearInterval(shape.attribute.ontime)
                }
                var timerFunc = setInterval(function () {
                    var strFormate = shape.textBlock.text;
                    if (!strFormate || strFormate == '') {
                        strFormate = "yyyy-MM-dd hh:mm:ss";
                    }
                    var time = new Date().format(strFormate);
                    domComp.val(time);
                }, 1000);
                shape.attribute.ontime = timerFunc;
            }else{
                domComp = $('<input'+pkcomphelper.getCompAttrString(shape,"text") +'style="width:100%;height:100%;background:#ffffff!important;" class="text_canvas"> </input>').appendTo(domShapeBox);//readonly="readonly"
            }
        }
        domComp.val(datetimeFormat);
        pkcomphelper.renderCompText(shape, shapeRect, domComp, textBlock, false); // 高度固定，不需要再计算
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc;
    },
};

var pktimepicker= {
    renderComp: function (shape,shapeRect,shapeRectScaled) {
        var domShapeBox = $("#" + shape.id);
        domShapeBox.find(".shape_canvas").hide(); // 这个对象会显示图标出来

        var domComp = domShapeBox.find(pkcomphelper.getSelector(shape));
        if(g_designMode){//设计状态下可改动大小，因此每次都需要删除和增加对象一次
            if(domComp.length>0){ // <div id="dfdddfd"....> <canvas....>  <span....> </div> 需要删除sapn对象，在父对象下而不是domComp.comComp在span下
                $("span",domShapeBox).remove();
                domComp = $(pkcomphelper.getSelector(shape),domShapeBox);//必须重新获取！
            }
        }
        if (domComp.length == 0) {
            domComp = $('<input' + pkcomphelper.getCompAttrString(shape, "") + 'style="height:'+shapeRectScaled.h+'px;width:100%;"/>').appendTo(domShapeBox);
            var kendoComp = $(domComp).kendoTimePicker({
                culture: "zh-CN",
                format: "HH:mm",
                parseFormats: ["HH:mm","HH:mm:ss"],
                interval: 1,
                change: function() {
                    var value= "";
                    var date = this.value();
                    if(date)
                        value=date.format("hh:mm:ss");//date.getHours() + ":"+date.getMinutes()+":"+date.getSeconds();
                    var objectname=shape.name;
                    pkcomphelper.triggerEvent(shape,"onChange",objectname,value);
                },
                close: function(e){
                    var objectname=shape.name;
                    pkcomphelper.triggerEvent(shape,"onClose", objectname);
                },
                open: function(e){
                    var objectname=shape.name;
                    pkcomphelper.triggerEvent(shape,"onOpen", objectname);
                }
            }).closest(".k-widget");
            if(g_designMode)//设计状态下可改动大小，因此每次都需要删除和增加对象一次
                kendoComp.enable(false);
            // $(pkcomphelper.getSelector(shape)).css("margin-left","0px"); // 如果不恢复会造成控件内部下移、右移
            // $(pkcomphelper.getSelector(shape)).css("margin-top","0px");
        }
    },
    getValue : function(timePickerName) {
        var kendoComp =$(pkcomphelper.getSelectorByName(timePickerName)).data("kendoTimePicker");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+comboName+"的时间选择控件");
            return undefined;
        }
        var date = kendoComp.value();
        if(!date)
            return "";
        var result=date.format("hh:mm:ss");//date.getHours() + ":"+date.getMinutes()+":"+date.getSeconds();
        return result;
    },
    setValue : function(timePickerName,value) {
        var kendoComp =$(pkcomphelper.getSelectorByName(timePickerName)).data("kendoTimePicker");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+timePickerName+"的时间选择控件");
            return;
        }
        return kendoComp.value(value);
    },
    setEnable : function(timePickerName,bEnable) {
        var kendoComp =$(pkcomphelper.getSelectorByName(timePickerName)).data("kendoTimePicker");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+timePickerName+"的时间选择控件");
            return;
        }
        var bDisable = (!bEnable || bEnable=="0");
        return kendoComp.enable(!bDisable);
    },
    setVisible:function(timePickerName, bVisible){
        return pkcomphelper.setVisible(timePickerName, bVisible);
    },
    getVisible:function(timePickerName){
        return pkcomphelper.getVisible(timePickerName);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.changeEventDesc).concat([["onOpen","objectname"],["onClose","objectname"]]);
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindChangeEvents(objectid,objectname,eventname);
    },
};

var pkdatepicker= {
    renderComp: function (shape,shapeRect,shapeRectScaled) {
        var domShapeBox = $("#" + shape.id);
        var domComp = domShapeBox.find(pkcomphelper.getSelector(shape));
        if(g_designMode){//设计状态下可改动大小，因此每次都需要删除和增加对象一次
            if(domComp.length>0){ // <div id="dfdddfd"....> <canvas....>  <span....> </div> 需要删除sapn对象，在父对象下而不是domComp.comComp在span下
                $("span",domShapeBox).remove();
                domComp = $(pkcomphelper.getSelector(shape),domShapeBox);//必须重新获取！
            }
        }
        if (domComp.length == 0) {
            domShapeBox.find(".shape_canvas").hide();//隐藏这个什么东西
            domComp = $('<input' + pkcomphelper.getCompAttrString(shape, "") + 'style="height:'+shapeRectScaled.h+'px;width:100%;"/>').appendTo(domShapeBox);
            var kendoComp = $(domComp).kendoDatePicker({
                value: new Date(),
                culture: "zh-CN",
                format: "yyyy-MM-dd",
                parseFormats: ["yyyy-MM-dd","yyyy/MM/dd"],
                start: "year",
                change: function() {
                    var value= "";
                    var date = this.value();
                    if(date)
                        value=date.format("yyyy-MM-dd");
                    var objectname=shape.name;
                    pkcomphelper.triggerEvent(shape,"onChange",objectname,value);
                    //eval(pkcomphelper.getEventScriptPrefix(shape.id)+"onChange(objectname,value);");
                },
                close: function(e){
                    var objectname=shape.name;
                    pkcomphelper.triggerEvent(shape,"onClose", objectname);
                },
                open: function(e){
                    var objectname=shape.name;
                    pkcomphelper.triggerEvent(shape,"onOpen", objectname);
                }
            }).closest(".k-widget");
            if(g_designMode)
                kendoComp.enable(false);
            // $(pkcomphelper.getSelector(shape)).css("margin-left","0px"); // 如果不恢复会造成控件内部下移、右移
            // $(pkcomphelper.getSelector(shape)).css("margin-top","0px");
        }
    },
    getValue : function(datePickerName) {
        var kendoComp =$(pkcomphelper.getSelectorByName(datePickerName)).data("kendoDatePicker");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+datePickerName+"的日期选择控件");
            return undefined;
        }
        var date = kendoComp.value();
        if(!date)
            return "";
        var result=date.format("yyyy-MM-dd");//date.getHours() + ":"+date.getMinutes()+":"+date.getSeconds();
        return result;
    },
    setValue : function(datePickerName,value) {
        var kendoComp =$(pkcomphelper.getSelectorByName(datePickerName)).data("kendoDatePicker");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+datePickerName+"的日期选择控件");
            return;
        }
        return kendoComp.value(value);
    },
    setEnable : function(datePickerName,bEnable) {
        var kendoComp =$(pkcomphelper.getSelectorByName(datePickerName)).data("kendoDatePicker");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+datePickerName+"的日期选择控件");
            return;
        }
        return kendoComp.enable(bEnable);
    },
    setVisible:function(datePickerName, bVisible){
        return pkcomphelper.setVisible(datePickerName, bVisible);
    },
    getVisible:function(datePickerName){
        return pkcomphelper.getVisible(datePickerName);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.changeEventDesc).concat([["onOpen","objectname"],["onClose","objectname"]]);
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindChangeEvents(objectid,objectname,eventname);
    },
};

var pkdatetimepicker= {
    renderComp: function (shape,shapeRect,shapeRectScaled) {
        var domShapeBox = $("#" + shape.id);

        var domComp = domShapeBox.find(pkcomphelper.getSelector(shape));
        if(g_designMode){//设计状态下可改动大小，因此每次都需要删除和增加对象一次
            if(domComp.length>0){ // <div id="dfdddfd"....> <canvas....>  <span....> </div> 需要删除sapn对象，在父对象下而不是domComp.comComp在span下
                $("span",domShapeBox).remove();
                domComp = $(pkcomphelper.getSelector(shape),domShapeBox);//必须重新获取！
            }
        }

        if (domComp.length == 0) {
            domShapeBox.find(".shape_canvas").hide();//隐藏这个什么东西
            domComp = $('<input' + pkcomphelper.getCompAttrString(shape, "") + 'style="height:'+shapeRectScaled.h+'px;width:100%;"/>').appendTo(domShapeBox);
            var kendoComp = $(domComp).kendoDateTimePicker({
                value: new Date(),
                culture: "zh-CN",
                format: "yyyy-MM-dd HH:mm:ss",
                parseFormats: ["yyyy-MM-dd HH:mm:ss","yyyy/MM/dd HH:mm:ss"],
                start: "year",
                interval: 5,
                change: function() {
                    var value= "";
                    var date = this.value();
                    if(date)
                        value=date.format("yyyy-MM-dd HH:mm:ss");
                    var objectname=shape.name;
                    pkcomphelper.triggerEvent(shape,"onChange",objectname,value);
                    //eval(pkcomphelper.getEventScriptPrefix(shape.id)+"onChange(objectname,value);");
                },
                close: function(e){
                    var objectname=shape.name;
                    var dialogname=e.view; // date or time
                    pkcomphelper.triggerEvent(shape,"onClose", objectname,dialogname);
                },
                open: function(e){
                    var objectname=shape.name;
                    var dialogname=e.view; // date or time
                    pkcomphelper.triggerEvent(shape,"onOpen", objectname,dialogname);
                }
            }).closest(".k-widget");
            if(g_designMode)
                kendoComp.enable(false);
            // $(pkcomphelper.getSelector(shape)).css("margin-left","0px"); // 如果不恢复会造成控件内部下移、右移
            // $(pkcomphelper.getSelector(shape)).css("margin-top","0px");
        }
    },
    getValue : function(datetimePickerName) {
        var kendoComp =$(pkcomphelper.getSelectorByName(datetimePickerName)).data("kendoDateTimePicker");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+datetimePickerName+"的日期时间选择控件");
            return undefined;
        }
        var date = kendoComp.value();
        if(!date)
            return "";
        var result=date.format("yyyy-MM-dd hh:mm:ss");//date.getHours() + ":"+date.getMinutes()+":"+date.getSeconds();
        return result;
    },
    setValue : function(datetimePickerName,value) {
        var kendoComp =$(pkcomphelper.getSelectorByName(datetimePickerName)).data("kendoDateTimePicker");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+datePickerName+"的日期时间选择控件");
            return;
        }
        return kendoComp.value(value);
    },
    setEnable : function(datetimePickerName,bEnable) {
        var kendoComp =$(pkcomphelper.getSelectorByName(datetimePickerName)).data("kendoDateTimePicker");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+datetimePickerName+"的日期时间选择控件");
            return;
        }
        return kendoComp.enable(bEnable);
    },
    setVisible:function(datetimePickerName, bVisible){
        return pkcomphelper.setVisible(datetimePickerName, bVisible);
    },
    getVisible:function(datetimePickerName){
        return pkcomphelper.getVisible(datetimePickerName);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.changeEventDesc).concat([["onOpen","objectname,value"],["onClose","objectname,value"]]) ;
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindChangeEvents(objectid,objectname,eventname);
    },
    // showConfigUI : function(shape){//打开日期时间配置信息的对话框
    //     var PKDTDTableDiv = $("<div id='PKDTDTableDiv'  class='ui-tabs'  style='width:485px;'></div>").appendTo("body");
    //     $('<table  style="width:100%;"><tr><td>日期时间的ID</td><td><input id="pkDTinput"  /></td></tr></table>').appendTo(PKDTDTableDiv);
    //     //$("#pkDTinput").val();
    //     //先配置关闭对话框的事件，保存
    //     PKDTDTableDiv.dialogPk({
    //         width:"485px",
    //         height:"auto",
    //         title:"日期时间ID配置",
    //         onClose: function() {//关闭事件，将数据全部保存到数据库中
    //             //shape.DTID = $("#pkDTinput").val();
    //             pkpainter.renderShape(shape);
    //             PKDTDTableDiv.remove();
    //         }
    //     }).css({"z-index": Model.orderList.length + 1});
    // }
};

var pkstepper= {
    renderComp: function (shape) {
        var domShapeBox = $("#" + shape.id);
        var domComp = domShapeBox.find(pkcomphelper.getSelector(shape));
        if (domComp.length == 0) {
            domComp = $('<input' + pkcomphelper.getCompAttrString(shape, "number") + ' class="input-mini text_canvas"/>').appendTo(domShapeBox);
            domShapeBox.find(".shape_canvas").hide();
        }
    },
    // 获取input值input combox radiobox checkbox textarea
    getValue : function(objectname) {
        var objs = $("#designer_canvas").find(pkcomphelper.getSelectorByName(objectname));
        var obj1 = objs[0];// 只取第一个或者选中的值（内容）
        if (obj1) {
            pksys.msgbox("尚未实现对象:"+objectname+"的getValue方法");
        }
        console.log("未获取到对象");
        return undefined;// 未获取到对象
    },
};

var pkradiobox= {
    renderComp: function (shape) {
        var domShapeBox = $("#" + shape.id);
        var radioValue;
        var groupName;
        var defaultChecked;
        if (shape.customProp) {
            radioValue = shape.customProp.value;
            groupName = pkcomphelper.getCompName(shape.customProp.groupName);
            defaultChecked = shape.customProp.checked;
        }
        var domComp = domShapeBox.find(pkcomphelper.getSelector(shape));
        if (domComp.length == 0) {
            domShapeBox.find(".shape_canvas").hide();
            domComp = $('<input' + pkcomphelper.getCompAttrString(shape, "radio") + 'name="'+groupName+'" value="' + radioValue + '" />').appendTo(domShapeBox); // 必须有name属性，用于区分一组radiobox
            //设置该组的第一个为选中
            if(defaultChecked)
                $("#designer_canvas").find(pkcomphelper.getSelector(shape) + ":radio:first").attr("checked", true);
        }
    },
    // radiobo选中值
    getValue : function(radioGroupName) {// radioGroupName 不是radiobox的名称
        var domComp = $('input[type="radio"][name="'+pkcomphelper.getCompName(radioGroupName)+'"]:checked');
        return domComp.val();
    },
    setValue : function(radioGroupName, currValue) {// radioGroupName 不是radiobox的名称
        var found=false;
        var domComp = $('input[type="radio"][name="'+pkcomphelper.getCompName(radioGroupName)+'"]').each(
            function(i, v) {
                if ($(this).val() == currValue) {
                    $(this).attr("checked", true);
                    found=true;
                    return false;
                } else {
                    $(this).attr("checked", false);
                }
            });
        // 如果没有找到设置第一个选中
        if (!found) {
            obj.attr("checked", true);
            pksys.msgbox("单选框:"+radioGroupName+"未匹配合适的对象值:"+currValue);
        }
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return [["onChange","objectname,value"],["onLoad","objectname"],["onUnload","objectname"]]; // 支持click事件.参数1：radiobox的name，参数2：选中的值
    },
    bindEvents:function(objectid,objectname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        $(pkcomphelper.getSelectorById(objectid)).find("input[type='radio']").off("change").on("change",function(event,a){
            var value = $(this).val();
            pkcomphelper.triggerEventById(objectid,"onChange",objectname,value);
        });
    },
    showConfigUI: function(shape){
        var customProp = {groupName:"",value:"",checked:false};
        if(shape.customProp != undefined){
            customProp = $.extend(customProp,shape.customProp);
        }
        //var groupName=pkcomphelper.getCompName(shape.name); // 组名就是对象名称，不可修改！
        var radioboxConfigDiv = $("<div id='radioboxconfig' class='ui-tabs'  style='width:485px;'></div>").appendTo("body");
        $("<div id='groupNameDiv' class='col-sm-12' ><div class='col-sm-2 text-center' style='line-height: 46px;'>单选组名：</div><div class='col-sm-8 text-center'><input type='text' class='form-control' name='groupname'  placeholder='通过组名可以获取一组单选框的值'></div></div>").appendTo(radioboxConfigDiv);
        $("<div id='radioValueDiv' class='col-sm-12' ><div class='col-sm-2 text-center' style='line-height: 46px;'>单选按钮值：</div><div class='col-sm-8 text-center'><input type='text' class='form-control' name='radiovalue'  placeholder='该单选框的选中时值'></div></div>").appendTo(radioboxConfigDiv);
        $("<div id='radioCheckDiv' class='col-sm-12' ><div class='col-sm-2 text-center' style='line-height: 46px;'>缺省是否被选中：</div><div class='col-sm-8 text-center'><input type='checkbox' class='form-control' name='defaultchecked'  placeholder='缺省时按钮是否选中'></div></div>").appendTo(radioboxConfigDiv);
        radioboxConfigDiv.find("input[name='groupname']").val(customProp.groupName);
        radioboxConfigDiv.find("input[name='radiovalue']").val(customProp.value);
        if(customProp.checked)
            radioboxConfigDiv.find("input[name='defaultchecked']").attr('checked',true);
        else
            radioboxConfigDiv.find("input[name='defaultchecked']").attr('checked',false);
        radioboxConfigDiv.dialogPk({
            width:"485px",
            height:"auto",
            title:"单选按钮配置",
            onClose: function() {
                if(undefined==shape.customProp)
                    shape.customProp={groupName:undefined,value:undefined};
                shape.customProp.groupName=radioboxConfigDiv.find("input[name='groupname']").val();
                shape.customProp.value=radioboxConfigDiv.find("input[name='radiovalue']").val();
                shape.customProp.checked=radioboxConfigDiv.find("input[name='defaultchecked']").is(':checked');
                var domShapeBox = $("#" + shape.id);
                var domComp = domShapeBox.find(pkcomphelper.getSelector(shape));
                domComp.attr('checked',shape.customProp.checked);
                radioboxConfigDiv.remove();
            }
        }).css({"z-index": Model.orderList.length + 1});
    }
};

var pkcheckbox= {
    renderComp: function (shape) {
        var domShapeBox = $("#" + shape.id);
        var customProp = shape.customProp;
        var type = "checkbox";
        var domComp = $(pkcomphelper.getSelector(shape), domShapeBox);
        if (domComp.length == 0) {
            domShapeBox.find(".shape_canvas").hide(); // 这个对象会显示图标出来
            domComp = $('<input' + pkcomphelper.getCompAttrString(shape, "checkbox") + '/>').appendTo(domShapeBox);
        }
    },
    // 对象是否选中
    isChecked : function(checkboxName) {
        var domComp = $(pkcomphelper.getSelectorByName(checkboxName));
        var checked = domComp.attr("checked");
        return checked;
    },
    setChecked : function(checkboxName, bChecked) {
        var domComp = $(pkcomphelper.getSelectorByName(checkboxName));
        domComp.attr("checked",bChecked);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.changeEventDesc); // 支持click事件.参数1：radiobox的name，参数2：选中的值
    },
    bindEvents:function(objectid,objectname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        $(pkcomphelper.getSelectorById(objectid)).find("input[type='checkbox']").off("change").on("change",function(event,a){
            var value = $(this).val();
            pkcomphelper.triggerEventBy(objectid,"onChange",objectname,value);
        });
    },
};

var pkcombobox={
    renderComp:function(shape,shapeRect,shapeRectScaled) {
        var domShapeBox = $("#" + shape.id);
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(g_designMode){
            if(domComp.length>0){ // <div id="dfdddfd"....> <canvas....>  <span....> </div> 需要删除sapn对象，在父对象下而不是domComp.comComp在span下
                $("span",domShapeBox).remove();
                domComp = $(pkcomphelper.getSelector(shape),domShapeBox);//必须重新获取！
            }
        }

        var kendoComp = undefined;
        if(domComp.length == 0) {// name 用于区分一组radio，所以需要保留 <input id="movies" style="width: 100%;" />
            domShapeBox.find(".shape_canvas").hide(); //必须隐藏，否则canvas占位导致实际控件位置显示不对
            var comboData = [];
            var customProp = shape.customProp;
            if(customProp && customProp.options != undefined) {
                var dataops = customProp["options"];
                var ops = dataops.split("\n");
                for (var i = 0; i < ops.length; i++) {
                    var optValue, optText;
                    var option = ops[i];
                    if (option.indexOf(",") >= 0) { // value和text是不相同的
                        var top = option.split(",");
                        optValue = top[0];
                        optText = top[1];
                    } else {
                        optValue = optText = option;
                    }
                    comboData.push({text: optText, value: optValue});
                }
            }else {
                // comboData.push({text: "选择1", value: "选择1"});
                // comboData.push({text: "选择2", value: "选择2"});
            }

            domComp = $('<input' + pkcomphelper.getCompAttrString(shape, "") + 'style="height:'+shapeRectScaled.h+'px;width:100%;" data-placeholder="请选择..."/>').appendTo(domShapeBox);
            kendoComp =$(pkcomphelper.getSelector(shape)).kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: comboData,
                height: 100,
                change:function(){
                    var kendoComp =$(pkcomphelper.getSelectorById(shape.id)).data("kendoComboBox");
                    var value = kendoComp.value();
                    var objectname=shape.name;
                    pkcomphelper.triggerEvent(shape,"onChange",objectname,value);
                }
            }).closest(".k-widget");
            //$("[aria-owns='o-15d94ce91dc_listbox']").css("margin-top","0px");

            // 为了和实际大小对齐，前面做了margin-left和margin-top为10px。生成完之后如果不恢复会造成控件内部下移、右移
            var ajust='[aria-owns="'+pkcomphelper.getCompId(shape)+'_listbox"]';
            $(ajust).css("margin-left","0px");
            $(ajust).css("margin-top","0px");
        }
    },// 添加下拉选项
    setOptions : function(comboName, options) { // options [{"text":"aa","value":"def"}]
        var kendoComp =$(pkcomphelper.getSelectorByName(comboName)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+comboName+"的复合框");
            return;
        }

        var kendoOptions = [];
        if(typeof(options)=="string"){ // "aaa";"bb";"aa,1"
            var optionVT = options.split(";");
            for ( var i = 0; i < optionVT.length; i++) {
                if (optionVT[i].indexOf(",") >= 0) {
                    var top = optionVT[i].split(",");
                    kendoOptions.push({text:top[1],value:top[0]});
                }else{
                    kendoOptions.push({text:optionVT[i],value:optionVT[i]})
                }
            }
        }else{
            kendoOptions=options;
        }
        var dataSource = new kendo.data.DataSource({data:kendoOptions});
        kendoComp.setDataSource(dataSource);
        if(kendoOptions.length > 0){
            var firstOption = kendoOptions[0];
            kendoComp.value(firstOption.value);
        }
    },
    // 获取下拉框选择值
    getValue : function(comboName) {
        var kendoComp =$(pkcomphelper.getSelectorByName(comboName)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+comboName+"的复合框");
            return;
        }
        return kendoComp.value();
    },
    // 设置下拉框选择值
    setValue : function(comboName,value) {
        var kendoComp =$(pkcomphelper.getSelectorByName(comboName)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+comboName+"的复合框");
            return;
        }
        return kendoComp.value(value);
    },
    getText : function(comboName) {
        var kendoComp =$(pkcomphelper.getSelectorByName(comboName)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+comboName+"的复合框");
            return;
        }
        return kendoComp.text();
    },
    setText : function(comboName,text) { // 设置下拉框输入文本的值
        var kendoComp =$(pkcomphelper.getSelectorByName(comboName)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+comboName+"的复合框");
            return;
        }
        return kendoComp.text(text);
    },
    // 获取下拉框选择值
    setEnable : function(comboName,bEnable) {
        var kendoComp =$(pkcomphelper.getSelectorByName(comboName)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+comboName+"的复合框");
            return;
        }
        var bDisable = (!bEnable || bEnable=="0");
        return kendoComp.enable(!bDisable);
    },
    setVisible:function(comboName, bVisible){
        return pkcomphelper.setVisible(comboName, bVisible);
    },
    getVisible:function(comboName){
        return pkcomphelper.etVisible(comboName);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.changeEventDesc);
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindChangeEvents(objectid,objectname,eventname);
    },
};
var pkmultiselect={
    renderComp:function(shape,shapeRect,shapeRectScaled) {
        var domShapeBox = $("#" + shape.id);
        var customProp = shape.customProp;
        var domComp = $(pkcomphelper.getSelector(shape),domShapeBox);
        if(g_designMode){//设计状态下可改动大小，因此每次都需要删除和增加对象一次
            if(domComp.length>0){ // <div id="dfdddfd"....> <canvas....>  <div....> </div> 需要删除sapn对象，在父对象下而不是domComp.comComp在span下
                $("div",domShapeBox).remove();
                domComp = $(pkcomphelper.getSelector(shape),domShapeBox);//必须重新获取！
            }
        }

        if(domComp.length == 0) {
            domShapeBox.find(".shape_canvas").hide();
            var comboData = [];
            if(customProp && customProp.options != undefined) {
                var dataops = customProp["options"];
                var ops = dataops.split("\n");
                for (var i = 0; i < ops.length; i++) {
                    var optValue, optText;
                    var option = ops[i];
                    if (option.indexOf(",") >= 0) { // value和text是不相同的
                        var top = ops[op].split(",");
                        optValue = top[0];
                        optText = top[1];
                    } else {
                        optValue = optText = option;
                    }
                    comboData.push({text: optText, value: optValue});
                }
            }else {
                // comboData.push({text: "选择1", value: "选择1"});
                // comboData.push({text: "选择2", value: "选择2"});
            }

            domComp = $('<input' + pkcomphelper.getCompAttrString(shape, "") + 'style="height:'+shapeRectScaled.h+'px;width:100%;" data-placeholder="请选择..."/>').appendTo(domShapeBox);
            var kendoComp =$(pkcomphelper.getSelector(shape)).kendoMultiSelect({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: comboData,
                change:function(){
                    var kendoComp =$(pkcomphelper.getSelectorById(shape.id)).data("kendoMultiSelect");
                    var value = kendoComp.value();
                    var objectname=shape.name;
                    pkcomphelper.triggerEvent(shape,"onChange",objectname,value);
                }
            }).closest(".k-widget");
            $(pkcomphelper.getSelector(shape)).css("margin-left","0px"); // 如果不恢复会造成控件内部下移、右移
            $(pkcomphelper.getSelector(shape)).css("margin-top","0px");
        }
    },// 添加下拉选项
    setOptions : function(objectname, options) { // options [{"text":"aa","value":"def"}]
        var kendoComp =$(pkcomphelper.getSelectorByName(objectname)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+objectname+"的多选框");
            return;
        }
        var kendoOptions = [];
        if(typeof(options)=="string"){ // "aaa";"bb";"aa,1"
            var optionVT = options.split(";");
            for ( var i = 0; i < optionVT.length; i++) {
                if (optionVT[i].indexOf(",") >= 0) {
                    var top = optionVT[i].split(",");
                    kendoOptions.push({text:top[1],value:top[0]});
                }else{
                    kendoOptions.push({text:optionVT[i],value:optionVT[i]})
                }
            }
        }else{
            kendoOptions=options;
        }
        var dataSource = new kendo.data.DataSource({data:kendoOptions});
        kendoComp.setDataSource(dataSource);
    },
    // 获取下拉框选择值
    getValue : function(objectname) {
        var kendoComp =$(pkcomphelper.getSelectorByName(objectname)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+objectname+"的多选框");
            return;
        }
        return kendoComp.value();
    },
    // 获取下拉框选择值
    setValue : function(objectname,value) {
        var kendoComp =$(pkcomphelper.getSelectorByName(objectname)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+objectname+"的多选框");
            return;
        }
        return kendoComp.value(value);
    },
    getText : function(objectname) {
        var kendoComp =$(pkcomphelper.getSelectorByName(objectname)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+objectname+"的多选框");
            return;
        }
        return kendoComp.text();
    },
    setText : function(objectname,text) {
        var kendoComp =$(pkcomphelper.getSelectorByName(objectname)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+objectname+"的多选框");
            return;
        }
        return kendoComp.text(text);
    },
    // 获取下拉框选择值
    setEnable : function(objectname,bEnable) {
        var kendoComp =$(pkcomphelper.getSelectorByName(objectname)).data("kendoComboBox");
        if(!kendoComp){
            pksys.msgbox("不存在名称为"+comboName+"的多选框");
            return;
        }
        var bDisable = (!bEnable || bEnable=="0");
        return kendoComp.enable(!bDisable);
    },
    setVisible:function(objectname, bVisible){
        return pkcomphelper.setVisible(objectname, bVisible);
    },
    getVisible:function(objectname){
        return pkcomphelper.etVisible(objectname);
    },
    getEvents:function(){// 返回支持的事件。目的：生成对象的自定义脚本
        return pkcomphelper.loadEventDesc.concat(pkcomphelper.changeEventDesc); // 支持click事件.参数1：radiobox的name，参数2：选中的值
    },
    bindEvents:function(objectid,objectname,eventname){ // 加载时给了绑定事件到控件的机会。如果这里不绑定，也可以在生成控件时绑定
        pkcomphelper.bindChangeEvents(objectid,objectname,eventname);
    },
};
// 必须放在文件结尾，切不能放在ready中，必须开始就加载起来，因为pic.js要用到
Schema.bindCompTypeWithProcessor("text", pktext); // text已经在basiccomps定义了，这里只要绑定就可以了！

var btnProp=Schema.getDefaultProp(160,25,"按钮","0,0,0","solid","138,138,138","roundRectangle",true); // 按钮有文本、填充，无线型
btnProp.fillStyle=  {
    type: "gradient",
    gradientType: "linear",
    beginColor: "233,233,233",
    endColor: "200,200,200",
    angle: 0
};
btnProp.lineStyle.lineWidth=0;
Schema.addCompType("button", pkbutton, "按钮", "input", "img/button.png", "img/buttonThumb.png", btnProp);

var editBoxProp=Schema.getDefaultProp(160,25,"文本","50,50,50","solid","255,255,255","rectangle",true); // 按钮有文本、填充，无线型
Schema.addCompType("editbox", pkeditbox, "文本输入框", "input", "img/editbox.png","img/editboxThumb.png", Schema.getDefaultProp(160,25,"editbox",true,true,undefined,"roundRectangle")); // 有填充、线型、文本

var passwordBoxProp=Schema.getDefaultProp(160,25,"密码","50,50,50","solid","255,255,255","rectangle",true); // 按钮有文本、填充，无线型
Schema.addCompType("passwordbox", pkpasswordbox, "密码输入框", "input", "img/passwordbox.png","img/passwordboxThumb.png", passwordBoxProp);

var checkradioBoxProp=Schema.getDefaultProp(25,25,undefined,undefined,undefined,undefined,undefined,false); // 无文本、填充、线型
Schema.addCompType("checkbox", pkcheckbox, "复选框", "input", "img/checkbox.png","img/checkboxThumb.png", checkradioBoxProp);
Schema.addCompType("radiobox", pkradiobox, "单选框", "input", "img/radiobox.png", "img/radioboxThumb.png", checkradioBoxProp);

var curdatetimeProp=Schema.getDefaultProp(160,25,"yyyy-MM-dd hh:mm:ss","50,50,50","solid","255,255,255","rectangle",true); // 按钮有文本、填充，无线型
Schema.addCompType("curdatetime", pkcurdatetime, "当前时间控件", "input", "img/curdatetime.png", "img/curdatetimeThumb.png", curdatetimeProp);

var textareaProp=Schema.getDefaultProp(160,80,"文本","50,50,50","solid","255,255,255","rectangle",true); // 按钮有文本、填充，无线型
Schema.addCompType("textarea", pktextarea, "文本域", "input", "img/textarea.png",  "img/textareaThumb.png", textareaProp);

var stepperProp=Schema.getDefaultProp(30,30,undefined,undefined,undefined,undefined,undefined,false); // 无文本、填充、线型
Schema.addCompType("stepper", pkstepper, "数字输入", "input", "img/stepper.png","img/stepperThumb.png", stepperProp);

var controlProp=Schema.getDefaultProp(160,30,undefined,undefined,undefined,undefined,undefined,false); // 无文本、填充、线型
Schema.addCompType("combobox", pkcombobox, "下拉输入框", "input", "img/combobox.png","img/comboboxThumb.png", controlProp);
Schema.addCompType("datepicker", pkdatepicker, "日期选择", "input", "img/datepicker.png","img/datepickerThumb.png", controlProp);
Schema.addCompType("timepicker", pktimepicker, "时间选择", "input", "img/timepicker.png","img/timepickerThumb.png", controlProp);

var controlProp2=Schema.getDefaultProp(240,25,undefined,undefined,undefined,undefined,undefined,false); // 无文本、填充、线型
Schema.addCompType("multiselect", pkmultiselect, "多选下拉框", "input", "img/multiselect.png", "img/multiselectThumb.png", controlProp2);
Schema.addCompType("datetimepicker", pkdatetimepicker, "日期时间选择", "input", "img/datetimepicker.png","img/datetimepickerThumb.png", controlProp2);
