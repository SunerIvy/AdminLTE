Schema.addCategory({
    name: "basic",
    text: "基础图形"
});

Schema.addShape({
    type: "vline",
    title: "垂直线",
    category: "basic",
    iconPath:"img/vline.png",
    thumbPath:"img/vlineThumb.png",
    attribute: {
    },
    props: {
        w: 21,
        h: 240
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0"
    },
    resizeDir: ["t", "b"],
    path: [{
        fillStyle: {
            type: "none"
        },
        actions: [{
            action: "move",
            x: "lineWidth%2==0 ? Math.round(w/2) : w/2",
            y: 0
        },
        {
            action: "line",
            x: "lineWidth%2==0 ? Math.round(w/2) : w/2",
            y: "h"
        }]
    },
    {
        fillStyle: {
            type: "none"
        },
        lineStyle: {
            lineWidth: 0
        },
        actions: {
            ref: "rectangle"
        }
    }]
});

Schema.addShape({
    type: "hline",
    title: "水平线",
    category: "basic",
    iconPath:"img/hline.png",
    thumbPath:"img/hlineThumb.png",
    attribute: {
    },
    props: {
        w: 240,
        h: 21
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0"
    },
    resizeDir: ["l", "r"],
    path: [{
        fillStyle: {
            type: "none"
        },
        actions: [{
            action: "move",
            x: 0,
            y: "lineWidth%2==0 ? Math.round(h/2) : h/2"
        },
        {
            action: "line",
            x: "w",
            y: "lineWidth%2==0 ? Math.round(h/2) : h/2"
        }]
    },
    {
        fillStyle: {
            type: "none"
        },
        lineStyle: {
            lineWidth: 0
        },
        actions: {
            ref: "rectangle"
        }
    }]
});

Schema.addShape({
    type: "text",
    title: "文本",
    category: "basic",
    iconPath:"img/text.png",
    thumbPath:"img/textThumb.png",
    props: {
        w: 160,
        h: 40
    },
    textBlock: {
        position: {
            x: 0,
            y: 0,
            w: "w",
            h: "h"
        },
        text: "文本"
    },
    fontStyle: {
        fontFamily: "微软雅黑",
        size: 13,
        color: "0,0,0",
        bold: false,
        italic: false,
        underline: false,
        textAlign: "center",
        vAlign: "middle",
        orientation: "vertical"
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 0,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    path: [
        {
        // lineStyle: {
        //         lineWidth: 1
        // },
        actions: {
            ref: "rectangle"
        }
    }]
});

Schema.addShape({
    type: "round",
    title: "圆形",
    category: "basic",
    thumbPath:"img/circleThumb.png",
    iconPath:"img/circle.png",
    props: {
        w: 70,
        h: 70
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    path: [{
        actions: {
            ref: "round"
        }
    }]
});
Schema.addShape({
    type: "rectangle",
    title: "矩形",
    category: "basic",
    iconPath:"img/rectangle.png",
    thumbPath:"img/rectangleThumb.png",
    props: {
        w: 100,
        h: 70
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    path: [{
        actions: {
            ref: "rectangle"
        }
    }]
});
Schema.addShape({
    type: "roundRectangle",
    title: "圆角矩形",
    category: "basic",
    iconPath:"img/roundRectangle.png",
    thumbPath:"img/roundRectangleThumb.png",
    props: {
        w: 100,
        h: 70
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    path: [{
        actions: {
            ref: "roundRectangle"
        }
    }]
});
Schema.addShape({
    type: "triangle",
    title: "三角形",
    category: "basic",
    iconPath:"img/triangle.png",
    thumbPath:"img/triangleThumb.png",
    props: {
        w: 80,
        h: 70
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    anchors: [{
        x: "w/2",
        y: "0"
    },
    {
        x: "w/2",
        y: "h"
    },
    {
        x: "w*0.25",
        y: "h/2"
    },
    {
        x: "w*0.75",
        y: "h/2"
    }],
    path: [{
        actions: [{
            action: "move",
            x: "w/2",
            y: "0"
        },
        {
            action: "line",
            x: "w",
            y: "h"
        },
        {
            action: "line",
            x: "0",
            y: "h"
        },
        {
            action: "close"
        }]
    }]
});
Schema.addShape({
    type: "diamond",
    title: "菱形",
    category: "basic",
    iconPath:"img/diamond.png",
    thumbPath:"img/diamondThumb.png",
    props: {
        w: 120,
        h: 80
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    anchors: [{
        x: "0",
        y: "h/2"
    },
    {
        x: "w/2",
        y: "0"
    },
    {
        x: "w",
        y: "h/2"
    },
    {
        x: "w/2",
        y: "h"
    }],
    path: [{
        actions: [{
            action: "move",
            x: "0",
            y: "h/2"
        },
        {
            action: "line",
            x: "w/2",
            y: "0"
        },
        {
            action: "line",
            x: "w",
            y: "h/2"
        },
        {
            action: "line",
            x: "w/2",
            y: "h"
        },
        {
            action: "close"
        }]
    }]
});
Schema.addShape({
    type: "pentagon",
    title: "五边形",
    category: "basic",
    iconPath:"img/pentagon.png",
    thumbPath:"img/pentagonThumb.png",
    props: {
        w: 74,
        h: 70
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    anchors: [{
        x: "w/2",
        y: "0"
    },
    {
        x: "w/2",
        y: "h"
    },
    {
        x: "0",
        y: "h*0.39"
    },
    {
        x: "w",
        y: "h*0.39"
    }],
    path: [{
        actions: [{
            action: "move",
            x: "w/2",
            y: "0"
        },
        {
            action: "line",
            x: "0",
            y: "h*0.39"
        },
        {
            action: "line",
            x: "w*0.18",
            y: "h"
        },
        {
            action: "line",
            x: "w*0.82",
            y: "h"
        },
        {
            action: "line",
            x: "w",
            y: "h*0.39"
        },
        {
            action: "close"
        }]
    }]
});
Schema.addShape({
    type: "hexagon",
    title: "六边形",
    category: "basic",
    iconPath:"img/hexagon.png",
    thumbPath:"img/hexagonThumb.png",
    props: {
        w: 84,
        h: 70
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    path: [{
        actions: [{
            action: "move",
            x: "Math.min(w,h)*0.21",
            y: "0"
        },
        {
            action: "line",
            x: "w-Math.min(w,h)*0.21",
            y: "0"
        },
        {
            action: "line",
            x: "w",
            y: "h * 0.5"
        },
        {
            action: "line",
            x: "w-Math.min(w,h)*0.21",
            y: "h"
        },
        {
            action: "line",
            x: "Math.min(w,h)*0.21",
            y: "h"
        },
        {
            action: "line",
            x: "0",
            y: "h * 0.5"
        },
        {
            action: "line",
            x: "Math.min(w,h)*0.21",
            y: "0"
        },
        {
            action: "close"
        }]
    }]
});

Schema.addShape({
    type: "octagon",
    title: "八边形",
    category: "basic",
    iconPath:"img/octagon.png",
    thumbPath:"img/octagonThumb.png",
    props: {
        w: 70,
        h: 70
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    path: [{
        actions: [{
            action: "move",
            x: "Math.min(w,h)*0.29",
            y: "0"
        },
        {
            action: "line",
            x: "w-Math.min(w,h)*0.29",
            y: "0"
        },
        {
            action: "line",
            x: "w",
            y: "h*0.29"
        },
        {
            action: "line",
            x: "w",
            y: "h*0.71"
        },
        {
            action: "line",
            x: "w-Math.min(w,h)*0.29",
            y: "h"
        },
        {
            action: "line",
            x: "Math.min(w,h)*0.29",
            y: "h"
        },
        {
            action: "line",
            x: "0",
            y: "h*0.71"
        },
        {
            action: "line",
            x: "0",
            y: "h*0.29"
        },
        {
            action: "close"
        }]
    }]
});

Schema.addShape({
    type: "cross",
    title: "十字形",
    category: "basic",
    iconPath:"img/cross.png",
    thumbPath:"img/crossThumb.png",
    props: {
        w: 70,
        h: 70
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    path: [{
        actions: [{
            action: "move",
            x: "w*0.5-Math.min(w,h)/8",
            y: "0"
        },
        {
            action: "line",
            x: "w*0.5+Math.min(w,h)/8",
            y: "0"
        },
        {
            action: "line",
            x: "w*0.5+Math.min(w,h)/8",
            y: "h*0.5-Math.min(w,h)/8"
        },
        {
            action: "line",
            x: "w",
            y: "h*0.5-Math.min(w,h)/8"
        },
        {
            action: "line",
            x: "w",
            y: "h*0.5+Math.min(w,h)/8"
        },
        {
            action: "line",
            x: "w*0.5+Math.min(w,h)/8",
            y: "h*0.5+Math.min(w,h)/8"
        },
        {
            action: "line",
            x: "w*0.5+Math.min(w,h)/8",
            y: "h"
        },
        {
            action: "line",
            x: "w*0.5-Math.min(w,h)/8",
            y: "h"
        },
        {
            action: "line",
            x: "w*0.5-Math.min(w,h)/8",
            y: "h*0.5+Math.min(w,h)/8"
        },
        {
            action: "line",
            x: "0",
            y: "h*0.5+Math.min(w,h)/8"
        },
        {
            action: "line",
            x: "0",
            y: "h*0.5-Math.min(w,h)/8"
        },
        {
            action: "line",
            x: "w*0.5-Math.min(w,h)/8",
            y: "h*0.5-Math.min(w,h)/8"
        },
        {
            action: "close"
        }]
    }]
});

Schema.addShape({
    type: "singleLeftArrow",
    title: "左箭头",
    category: "basic",
    iconPath:"img/singleLeftArrow.png",
    thumbPath:"img/singleLeftArrowThumb.png",
    props: {
        w: 150,
        h: 60
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    anchors: [{
        x: "w",
        y: "h*0.5"
    },
    {
        x: "0",
        y: "h*0.5"
    }],
    path: [{
        actions: [{
            action: "move",
            x: "0",
            y: "h/2"
        },
        {
            action: "line",
            x: "Math.min(0.5*h,0.45*w)",
            y: "0"
        },
        {
            action: "line",
            x: "Math.min(0.5*h,0.45*w)",
            y: "h*0.33"
        },
        {
            action: "line",
            x: "w",
            y: "h*0.33"
        },
        {
            action: "line",
            x: "w",
            y: "h*0.67"
        },
        {
            action: "line",
            x: "Math.min(0.5*h,0.45*w)",
            y: "h*0.67"
        },
        {
            action: "line",
            x: "Math.min(0.5*h,0.45*w)",
            y: "h"
        },
        {
            action: "line",
            x: "0",
            y: "h/2"
        },
        {
            action: "close"
        }]
    }]
});

Schema.addShape({
    type: "singleRightArrow",
    title: "右箭头",
    category: "basic",
    iconPath:"img/singleRightArrow.png",
    thumbPath:"img/singleRightArrowThumb.png",
    props: {
        w: 150,
        h: 60
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    anchors: [{
        x: "w",
        y: "h*0.5"
    },
    {
        x: "0",
        y: "h*0.5"
    }],
    path: [{
        actions: [{
            action: "move",
            x: "0",
            y: "h*0.33"
        },
        {
            action: "line",
            x: "w-Math.min(h*0.5,w*0.45)",
            y: "h*0.33"
        },
        {
            action: "line",
            x: "w-Math.min(h*0.5,w*0.45)",
            y: "0"
        },
        {
            action: "line",
            x: "w",
            y: "h*0.5"
        },
        {
            action: "line",
            x: "w-Math.min(h*0.5,w*0.45)",
            y: "h"
        },
        {
            action: "line",
            x: "w-Math.min(h*0.5,w*0.45)",
            y: "h*0.67"
        },
        {
            action: "line",
            x: "0",
            y: "h*0.67"
        },
        {
            action: "line",
            x: "0",
            y: "h*0.33"
        },
        {
            action: "close"
        }]
    }]
});

Schema.addShape({
    type: "doubleHorizontalArrow",
    title: "左右箭头",
    category: "basic",
    iconPath:"img/doubleHorizontalArrow.png",
    thumbPath:"img/doubleHorizontalArrowThumb.png",
    props: {
        w: 150,
        h: 60
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    anchors: [{
        x: "w",
        y: "h*0.5"
    },
    {
        x: "0",
        y: "h*0.5"
    }],
    path: [{
        actions: [{
            action: "move",
            x: "0",
            y: "h*0.5"
        },
        {
            action: "line",
            x: "Math.min(h*0.5,w*0.45)",
            y: "0"
        },
        {
            action: "line",
            x: "Math.min(h*0.5,w*0.45)",
            y: "h*0.33"
        },
        {
            action: "line",
            x: "w-Math.min(h*0.5,w*0.45)",
            y: "h*0.33"
        },
        {
            action: "line",
            x: "w-Math.min(h*0.5,w*0.45)",
            y: "0"
        },
        {
            action: "line",
            x: "w",
            y: "h*0.5"
        },
        {
            action: "line",
            x: "w-Math.min(h*0.5,w*0.45)",
            y: "h"
        },
        {
            action: "line",
            x: "w-Math.min(h*0.5,w*0.45)",
            y: "h*0.67"
        },
        {
            action: "line",
            x: "Math.min(h*0.5,w*0.45)",
            y: "h*0.67"
        },
        {
            action: "line",
            x: "Math.min(h*0.5,w*0.45)",
            y: "h"
        },
        {
            action: "line",
            x: "0",
            y: "h*0.5"
        },
        {
            action: "close"
        }]
    }]
});

Schema.addShape({
    type: "singleUpArrow",
    title: "上箭头",
    category: "basic",
    iconPath:"img/singleUpArrow.png",
    thumbPath:"img/singleUpArrowThumb.png",
    props: {
        w: 60,
        h: 150
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    anchors: [{
        x: "w*0.5",
        y: "0"
    },
    {
        x: "w*0.5",
        y: "h"
    }],
    path: [{
        actions: [{
            action: "move",
            x: "w*0.5",
            y: "0"
        },
        {
            action: "line",
            x: "w",
            y: "Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.67",
            y: "Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.67",
            y: "h"
        },
        {
            action: "line",
            x: "w*0.33",
            y: "h"
        },
        {
            action: "line",
            x: "w*0.33",
            y: "Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "0",
            y: "Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.5",
            y: "0"
        },
        {
            action: "close"
        }]
    }]
});

Schema.addShape({
    type: "singleDownArrow",
    title: "下箭头",
    category: "basic",
    iconPath:"img/singleDownArrow.png",
    thumbPath:"img/singleDownArrowThumb.png",
    props: {
        w: 60,
        h: 150
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    anchors: [{
        x: "w*0.5",
        y: "0"
    },
    {
        x: "w*0.5",
        y: "h"
    }],
    path: [{
        actions: [{
            action: "move",
            x: "w*0.33",
            y: "0"
        },
        {
            action: "line",
            x: "w*0.67",
            y: "0"
        },
        {
            action: "line",
            x: "w*0.67",
            y: "h-Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w",
            y: "h-Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.5",
            y: "h"
        },
        {
            action: "line",
            x: "0",
            y: "h-Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.33",
            y: "h-Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.33",
            y: "0"
        },
        {
            action: "close"
        }]
    }]
});
Schema.addShape({
    type: "doubleVerticalArrow",
    title: "上下箭头",
    category: "basic",
    iconPath:"img/doubleVerticalArrow.png",
    thumbPath:"img/doubleVerticalArrowThumb.png",
    props: {
        w: 60,
        h: 150
    },
    shapeStyle: {
        alpha: 1
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: "0,0,0",
        lineStyle: "solid"
    },
    fillStyle: {
        type: "solid",
        color: "255,255,255"
    },
    anchors: [{
        x: "w*0.5",
        y: "0"
    },
    {
        x: "w*0.5",
        y: "h"
    }],
    path: [{
        actions: [{
            action: "move",
            x: "w*0.5",
            y: "0"
        },
        {
            action: "line",
            x: "w",
            y: "Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.67",
            y: "Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.67",
            y: "h-Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w",
            y: "h-Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.5",
            y: "h"
        },
        {
            action: "line",
            x: "0",
            y: "h-Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.33",
            y: "h-Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.33",
            y: "Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "0",
            y: "Math.min(w*0.5,h*0.45)"
        },
        {
            action: "line",
            x: "w*0.5",
            y: "0"
        },
        {
            action: "close"
        }]
    }]
});
