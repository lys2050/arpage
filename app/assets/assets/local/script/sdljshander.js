//页面脚本控制类
var jscompile = sdlbase.Class.extend({
    //构造函数
    init: function () {
        var that = this;
    },
    pageData: {},
    //获取页面参赛
    initpageData: function () {
        var that = this;
        that.pageData = JSON.parse($("#sdljshander").attr("data"));
      
    },
    //获取数据库存储过程参数
    getDbParm: function () {
        var that = this;
        that.initpageData();
        var parm = { postdata: [] };
        if (!sdlbase.isUndef(that.pageData) && !sdlbase.isEmpty(that.pageData)) {
            for (var i in that.pageData) {
                if (i.indexOf("db") != -1) {
                    for (var j in that.pageData[i]) {
                        //数据库存储过程
                        if (j.indexOf("Dbstr") != -1) {
                            if (!parm.postdata[0]) {
                                parm.postdata[0] = {};
                            }
                            parm.postdata[0]["Dbstr"] = that.pageData[i][j];
                        }
                        if (j.indexOf("Name") != -1) {
                            if (!parm.postdata[0]) {
                                parm.postdata[0] = {};
                            }
                            parm.postdata[0]["Name"] = that.pageData[i][j];
                        }
                    }
                }
            }
        }
        if (parm.postdata.length == 0) {
            parm.postdata.push({ Name: "getdata" });
        }
        return parm;
    },
    //获取控件实例
    getInstance: function (rst) {
        var instanceArray = [];
        var that = this;
        that.initpageData();
        
        if (!sdlbase.isUndef(that.pageData) && !sdlbase.isEmpty(that.pageData)) {
            for (var i in that.pageData) {
                if (i.indexOf("sampletb") != -1) {
                    instanceArray.push(that.generateTbInstance(that.pageData[i], rst));
                }
                if (i.indexOf("spline") != -1) {
                    instanceArray.push(that.generateSplineInstance(that.pageData[i], rst));
                }
                if (i.indexOf("stacked") != -1) {

                    instanceArray.push(that.generateStackedInstance(that.pageData[i], rst));
                }
                if (i.indexOf("bar") != -1) {
                    instanceArray.push(that.generateBarInstance(that.pageData[i], rst));
                }
                if (i.indexOf("funnel") != -1) {
                    instanceArray.push(that.generateFunnelInstance(that.pageData[i], rst));
                }
            }
        }
        return instanceArray;
    },
    //生成table实例
    generateTbInstance: function (opt, ds) {
        var id, dataKey, preth, coloums;
        for (var i in opt) {
            if (i.indexOf("id") != -1) {
                id = opt[i];
            }
            if (i.indexOf("proc") != -1) {
                dataKey = opt[i];
            }
            if (i.indexOf("thheader") != -1) {
                preth = opt[i];
            }
            if (i.indexOf("source") != -1) {
                coloums = JSON.parse(opt[i]);
            }
        }
        console.log(ds);
        console.log(dataKey);
        return new sdltool.simpletable({
            renderto: id,
            data: ds,
            dataKey: dataKey,
            preth: preth,
            coloums: coloums
        });
    },
    //折线图实例
    generateSplineInstance: function (opt, ds) {

        var id, dataKey, title, groupcol, namecol;
        var that = this;
        for (var i in opt) {
            if (i.indexOf("id") != -1) {
                id = opt[i];
            }
            if (i.indexOf("proc") != -1) {
                dataKey = opt[i];
            }
            if (i.indexOf("chartitle") != -1) {
                title = opt[i];
            }
            if (i.indexOf('namecol') != -1) {
                namecol = opt[i];
            }
            if (i.indexOf("groupcol") != -1) {
                groupcol = JSON.parse(opt[i]);
            }
        }
        that.setDefStyle(id);
        return new sdltool.echarts_spline({
            container: "#" + id,
            data: sdlbase.Json.GetdsFmRst(ds, dataKey),
            namecol: namecol,
            groupcol: groupcol,
            title: title,
        });

    },
    //堆积柱状图实例
    generateStackedInstance: function (opt, ds) {
        var id, dataKey, title, groupcol, namecol;
        var that = this;
        for (var i in opt) {
            if (i.indexOf("id") != -1) {
                id = opt[i];
            }
            if (i.indexOf("proc") != -1) {
                dataKey = opt[i];
            }
            if (i.indexOf("chartitle") != -1) {
                title = opt[i];
            }
            if (i.indexOf('namecol') != -1) {
                namecol = opt[i];
            }
            if (i.indexOf("groupcol") != -1) {
                groupcol = JSON.parse(opt[i]);
            }
        }
        that.setDefStyle(id);
        return new sdltool.echarts_stacked({
            container: "#" + id,
            data: sdlbase.Json.GetdsFmRst(ds, dataKey),
            namecol: namecol,
            groupcol: groupcol,
            title: title,
        });
    },
    //柱状图实例
    generateBarInstance: function (opt, ds) {
        var id, dataKey, title, groupcol, namecol;
        var that = this;
        for (var i in opt) {
            if (i.indexOf("id") != -1) {
                id = opt[i];
            }
            if (i.indexOf("proc") != -1) {
                dataKey = opt[i];
            }
            if (i.indexOf("chartitle") != -1) {
                title = opt[i];
            }
            if (i.indexOf('namecol') != -1) {
                namecol = opt[i];
            }
            if (i.indexOf("groupcol") != -1) {
                groupcol = JSON.parse(opt[i]);
            }
        }
        that.setDefStyle(id);
        return new sdltool.echarts_bar({
            container: "#" + id,
            data: sdlbase.Json.GetdsFmRst(ds, dataKey),
            namecol: namecol,
            groupcol: groupcol,
            title: title,
        });
    },
    //漏斗图实例
    generateFunnelInstance: function (opt, ds) {
        var id, dataKey, title, groupcol;
        var that = this;
        for (var i in opt) {
            if (i.indexOf("id") != -1) {
                id = opt[i];
            }
            if (i.indexOf("proc") != -1) {
                dataKey = opt[i];
            }
            if (i.indexOf("chartitle") != -1) {
                title = opt[i];
            }
            if (i.indexOf("groupcol") != -1) {
                groupcol = JSON.parse(opt[i]);
            }
        }
        that.setDefStyle(id, ds);
        return new sdltool.echarts_funnel({
            container: "#" + id,
            data: sdlbase.Json.GetdsFmRst(ds, dataKey),
            groupcol: groupcol,
            title: title,
        });
    },
    //echarts获取数据失败，默认样式
    setDefStyle: function (id) {
        $('#' + id).css('height', '400px');
    }

});
//new jscompile();
var simplepage = sdlpagebase.Page.extend({
    init: function (opt) {
        var that = this;
        //pagebase 初始化
        that._super(opt);
    },
    //请求数据,回调函数
    //status:请求状态 
    //rst:返回数据
    postcallback: function (status, rst) {
        //if (!sdlbase.isUndef(rst)) {
        var controlins = new jscompile().getInstance(rst);
        for (var i in controlins) {
            if (typeof (controlins[i].render) === "function") {
               
                controlins[i].render();
            }
        }
        //}
    },
})
//new jscompile().getDbParm()
// 调用init初始化,初始化查询
new simplepage(new jscompile().getDbParm());