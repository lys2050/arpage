/*
 * sdlpagebase.js Ver1.3
 */
var sdlpagebase = sdlpagebase || {};
(function () {

    //page handler
    var _pagebase = {
        //缓存类型
        cacheTp:
            {
                //全局缓存
                global: "global",
                //返回数据
                rstData: "rstData",
                //当前查询条件
                query: "query",
                //页面特征
                feature: "feature"
            },
        //数据缓存
        cache: {},
        //set
        setCache: function (keytp, opt) {
            var that = this;
            if (sdlbase.isUndef(that.cache[keytp.toString()])) {
                var key = opt.key;
                var val = opt.val;
                that.cache[keytp.toString()] = {};
                that.cache[keytp.toString()][key.toString()] = val;
            } else {
                that.cache[keytp.toString()][opt.key.toString()] = opt.val;
            }
        },
        //get
        getCache: function (keytp, opt) {
            var that = this;
            if (!sdlbase.isUndef(that.cache[keytp])) {
                if (!sdlbase.isUndef(opt)) {
                    return that.cache[keytp][opt.key];
                } else {
                    return that.cache[keytp];
                }
            }
            return false;
        },
        //clear Cache
        clearCache: function (keytp, opt) {
            var that = this;
            if (sdlbase.isUndef(keytp)) {
                cache = {};
            } else {
                if (!sdlbase.isUndef(opt)) {
                    that.cache[keytp][opt.key] = null;
                } else {
                    that.cache[keytp] = undefined;
                }
            }
        },
        //合并缓存 sq：主 nq：新
        mergeCache: function (sq, nq) {
            if (sdlbase.isUndef(sq) || sdlbase.isUndef(sq)) {
                return false;
            } else {
                //更新左侧
                for (var i in sq) {
                    if (!sdlbase.isUndef(nq[i.toString()])) {
                        sq[i.toString()] = nq[i.toString()]
                    }
                }
                //增加左侧
                for (var j in nq) {
                    if (sdlbase.isUndef(sq[j.toString()])) {
                        sq[j.toString()] = nq[j.toString()]
                    }
                }
            }
            return sq;
        },
        //select处理
        //opt:控件参数
        //rst:数据
        selectHandle: function (opt, rst) {
            //select instance
            var insselect = new sdltool.select_simple(opt.id);
            //渲染页面
            insselect.render(rst);
            //默认选中值
            if (!sdlbase.isUndef(opt.datadefault) && !sdlbase.isEmpty(opt.datadefault)) {
                insselect.setval(opt.datadefault);
            }
            //是否为回调事件
            if (opt.iscallback == false) {
                //绑定事件
                insselect.bindChange(function (arg) {
                    //显示当前选中内容
                    _pagebase.showQuery({ id: arg.id, text: arg.text })
                    //缓存选中数据
                    _pagebase.setCache(_pagebase.cacheTp.query, { key: arg.id, val: arg.value + "$" + opt.querytype })
                    //联动控件
                    if (!sdlbase.isUndef(opt.datafor) && !sdlbase.isEmpty(opt.datafor)) {
                        var target = $("#" + opt.datafor);
                        //清除缓存
                        _pagebase.clearCache(_pagebase.cacheTp.rstData, { key: target.attr("data-type") });
                        //init 控件
                        _pagebase.initcontrl({
                            id: target.attr("id"),
                            datatarget: target.attr("data-target"),
                            datatype: target.attr("data-type"),
                            datadefault: target.attr("data-default"),
                            datafor: target.attr("data-for"),
                            querytype: target.attr("query-type"),
                            dataforParm: arg.value
                        })
                    }
                })
            }
            //当前值、文本
            var curval = null;
            var cuitext = null;
            //缓存数据到页面缓存
            if (!sdlbase.isUndef(rst)) {
                _pagebase.setCache(_pagebase.cacheTp.rstData, { key: opt.datatype, val: rst });
                curval = rst[0].id;
                cuitext = rst[0].text;
            }
            //从控件获取选中值
            if (sdlbase.isEmpty(curval)
                || sdlbase.isEmpty(cuitext)) {
                curval = insselect.getval();
                cuitext = insselect.gettext();
            }
            //显示默认内容
            _pagebase.showQuery({ id: opt.id, text: cuitext });
            //缓存选中数据
            _pagebase.setCache(_pagebase.cacheTp.query, { key: opt.id, val: curval + "$" + opt.querytype })
        },
        inputHandle: function (opt) {
            //input instance
            var insinput = new sdltool.input_simple(opt.id);

            //处理自定义属性参数
            if (!sdlbase.isUndef(opt.extattr)) {
                var array = opt.extattr.split("$");
                _pagebase.setCache(_pagebase.cacheTp.query, { key: array[0], val: array[1] + "$" + array[2] })
            }
            //绑定事件
            insinput.bindChange(function (arg) {
                //缓存选中数据
                _pagebase.setCache(_pagebase.cacheTp.query, { key: arg.id, val: arg.value + "$" + opt.querytype })
            }, opt.dataverify)
        },
        //Range时间控件处理
        pickerHandle: function (key, data) {
            for (var i in data) {
                //显示默认内容
                _pagebase.showQuery({ id: data[i].id, text: data[i].text + ":" + data[i].value });
                //缓存选中数据
                _pagebase.setCache(_pagebase.cacheTp.feature, { key: data[i].id, val: data[i].text + ":" + data[i].value })
                //日期格式化
                var value = data[i].value.toString().replace(new RegExp(/-/g), "");
                _pagebase.setCache(_pagebase.cacheTp.query, { key: data[i].id, val: value + "$1" })
            }
        },
        //tab handle
        sampletabHandle: function (opt) {
            var tab = new sdltool.tab_sample(opt.id);
            //默认缓存选中数据
            _pagebase.setCache(_pagebase.cacheTp.query, { key: opt.id, val: tab.getval() + "$1" });
            _pagebase.setCache(_pagebase.cacheTp.feature, { key: opt.id, val: tab.gettext() });
            tab.bindChange(function (opt) {
                //缓存选中数据
                _pagebase.setCache(_pagebase.cacheTp.query, { key: opt.id, val: opt.val + "$1" });
                //联动控件
                if (!sdlbase.isUndef(opt.datafor) && !sdlbase.isEmpty(opt.datafor)) {
                    var target = $("#" + opt.datafor);
                    //init 控件
                    _pagebase.initcontrl({
                        id: target.attr("id"),
                        datatarget: target.attr("data-target"),
                        datatype: target.attr("data-type"),
                        datadefault: target.attr("data-default"),
                        datafor: target.attr("data-for"),
                        querytype: target.attr("query-type"),
                        dataforParm: arg.value,
                        dataref: that.attr("data-ref"),
                        addall: that.attr("data-add-all"),
                    })
                }
            });
        },
        //时间控件处理
        datepickerHandle: function (opt) {
            var defval = new Date();
            var picker = new sdltool.datepicker({ id: opt.id, defval: defval });
            //默认缓存选中数据
            var date = picker.getval().toString().replace(new RegExp(/-/g), "");
            _pagebase.setCache(_pagebase.cacheTp.query, { key: opt.id, val: date + "$1" });
            _pagebase.setCache(_pagebase.cacheTp.feature, { key: opt.id, val: picker.gettext() })
            picker.bindChange(function (arg) {
                //缓存选中数据
                var cdate = arg.val.toString().replace(new RegExp(/-/g), "");
                _pagebase.setCache(_pagebase.cacheTp.query, { key: arg.id, val: cdate + "$1" })
            })
        },
        //日历处理 20150818 ly
        calendarHandle: function (opt) {
            var calender = calender || {};
            switch (opt.datatype) {
                case "day":
                    {
                        calender = new sdltool.picker_day({
                            id: opt.id,
                            //起始时间
                            startDate: new Date(),
                            //截止时间
                            endDate: new Date()
                        });
                        break;
                    }
                case "month":
                    {
                        calender = new sdltool.picker_mon({
                            id: opt.id,
                            //起始时间
                            startDate: new Date(),
                            //截止时间
                            endDate: new Date()
                        });
                        break;
                    }
                case "quarter":
                    {
                        calender = new sdltool.picker_quar({
                            id: opt.id,
                            //起始时间
                            startDate: new Date(),
                            //截止时间
                            endDate: new Date()
                        });
                        break;
                    }
                case "halfyear":
                    {
                        calender = new sdltool.picker_halfy({
                            id: opt.id,
                            //起始时间
                            startDate: new Date(),
                            //截止时间
                            endDate: new Date()
                        });
                        break;
                    }
                case "year":
                    {
                        calender = new sdltool.picker_year({
                            id: opt.id,
                            //起始时间
                            startDate: new Date(),
                            //截止时间
                            endDate: new Date()
                        });
                        break;
                    }
            }
            calender.render();
            //保存默认值到查询条件中
            _pagebase.setCache(_pagebase.cacheTp.query, { key: 'sdate', val: calender.getval().start + "$1" });
            _pagebase.setCache(_pagebase.cacheTp.query, { key: 'edate', val: calender.getval().end + "$1" });
            //绑定change事件
            calender.bingchage(function (arg) {
                //arg = {id:id,val:{start:start,end:end}}
                //缓存查询条件;
                _pagebase.setCache(_pagebase.cacheTp.query, { key: 'sdate', val: arg.val.start + "$1" });
                _pagebase.setCache(_pagebase.cacheTp.query, { key: 'edate', val: arg.val.end + "$1" });
                //显示默认内容(未完成)
                //_pagebase.showQuery({ id: opt.id, text: cuitext });
            });
        },
        //控件初始化
        initcontrl: function (opt) {
            if (!sdlbase.isUndef(opt.datatarget)) {
                switch (opt.datatarget) {
                    case "select":
                        {
                            var that = this;
                            //本地html数据
                            if (opt.datatype == "local") {
                                _pagebase.selectHandle(opt);
                                break;
                            }
                            //判断页面或全局缓存中是否有本类型数据
                            if (that.getCache(that.cacheTp.rstData, { key: opt.datatype })) {
                                //cache data
                                var data = that.getCache(that.cacheTp.rstData, { key: opt.datatype });
                                //init控件
                                _pagebase.selectHandle(opt, data);
                            }
                            else {
                                //获取select加载时,需要获取的其他框架控件参数
                                var p = [];
                                if (!sdlbase.isUndef(opt.dataref) && !sdlbase.isEmpty(opt.dataref)) {
                                    var refs = JSON.parse(opt.dataref);
                                    if (refs.ids) {
                                        var ids = refs.ids.split(',');
                                        for (var i = 0; i < ids.length; i++) {
                                            var query = _pagebase.getCache(_pagebase.cacheTp.query, { key: ids[i] });
                                            var vq = query.split('$');
                                            p.push({ Name: ids[i], Value: vq[0], DataType: vq[1] });
                                        }
                                    }
                                }
                                //请求数据 
                                sdlbase.getdata({
                                    url: "Data/InitDataAccess.ashx",
                                    queryjson: {
                                        datatype: opt.datatype,
                                        //联动时,额外参数
                                        dataforParm: sdlbase.isUndef(opt.dataforParm) ? "" : opt.dataforParm,
                                        //是否增加全部
                                        addall: opt.addall,
                                        //参数
                                        p: JSON.stringify(p)
                                    },
                                    callback: function (status, rst) {
                                        //控件  handle
                                        _pagebase.selectHandle(opt, rst.Data);
                                    }
                                });
                            }
                            break;
                        }
                        //input handle
                    case "input":
                        {
                            _pagebase.inputHandle(opt);
                            break;
                        }
                        //tab handle
                    case "sampletab":
                        {
                            _pagebase.sampletabHandle(opt);
                            break;
                        }
                        //tab handle
                    case "datepicker":
                        {
                            _pagebase.datepickerHandle(opt);
                            break;
                        }
                        //日历 处理
                    case "calendar":
                        {
                            _pagebase.calendarHandle(opt);
                            break;
                        }
                }
            }
        },
        //获取控件显示内容
        showQuery: function (opt) {
            var container = $("#searchedItem");
            if (container.length > 0) {
                //页面存在当前控件内容,变更显示内容
                if ($("#s" + opt.id).length > 0) {
                    $("#s" + opt.id).text(opt.text);
                } else {
                    //初始化显示
                    container.append("<dd id='s" + opt.id + "' >" + opt.text + "</dd>");
                }
            }
        },
        //获取页面查询条件显示内容
        getPageQuery: function () {
            var rarry = [];
            var query = _pagebase.getCache(_pagebase.cacheTp.feature)
            if (!sdlbase.isUndef(query)) {
                for (var i in query) {
                    if (i == "pagetitle") {
                        rarry.push("功能:" + query[i]);
                        continue;
                    }
                    rarry.push("条件:" + query[i]);
                }
            }
            return rarry;
        },
        //导出文件下载
        fileLoad: function (config, type) {
            var json = { p: escape(JSON.stringify(config)), type: type };
            $.fileDownload("Data/ExcelExport.ashx",
                {
                    httpMethod: "POST",
                    dataType: "json",
                    data: json
                }).done(function () { }).fail(function (e) { alert('下载文件失败!'); });
        }
    }
    sdlpagebase.Page = sdlbase.Class.extend({
        //构造函数
        init: function (opt) {
            var that = this;
            //初始化查询条件
            that.initQuery();
            //绑定查询
            that.bindPost(opt);
            //绑定导出
            that.bindExport();
            //如果初始化时有数据请求
            if ((sdlbase.isUndef(opt.isInitPost) ||
                opt.isInitPost) &&
                !sdlbase.isUndef(opt.postdata)) {
                that.getdata(opt);
            }
            //缓存页面特征
            that.initPagefeature();
        },
        //缓存页面特征
        initPagefeature: function () {
            //页面名称
            var $title = $(".page-title");
            _pagebase.setCache(_pagebase.cacheTp.feature, { key: "pagetitle", val: $title.text() });
        },
        //初始化查询条件
        initQuery: function (arg) {
            var pthat = this;
            //特征清除缓存
            _pagebase.clearCache(_pagebase.cacheTp.feature);
            //获取查询条件全局缓存
            var golbalquery = _pagebase.mergeCache(_pagebase.getCache(_pagebase.cacheTp.global, { key: "query" }),
                _pagebase.getCache(_pagebase.cacheTp.query));
            //缓存上个页面查询条件缓存到全局
            _pagebase.setCache(_pagebase.cacheTp.global, { key: "query", val: golbalquery });
            //清除当期查询条件缓存
            _pagebase.clearCache(_pagebase.cacheTp.query);
            //时间控件（v1.0 版本兼容）
            datePicker.init(_pagebase.pickerHandle, this);
            //loop 控件初始化
            $("[data-target]")
                //控件排序（确保有页面控件数据初始化需求时,控件后加载）
                .sort(function (a, b) {
                    var rval = 0;
                    var aref = $(a).attr("data-ref"), bref = $(b).attr("data-ref");
                    if (sdlbase.isUndef(aref) && !sdlbase.isUndef(bref)) {
                        rval = -1;
                    } else if (!sdlbase.isUndef(aref) && sdlbase.isUndef(bref)) {
                        rval = 1;
                    } else if (!sdlbase.isUndef(aref) && !sdlbase.isEmpty(aref)
                        && !sdlbase.isUndef(bref) && !sdlbase.isEmpty(bref)) {
                        var jaref = JSON.parse(aref), jbref = JSON.parse(bref);
                        if (parseInt(jaref.inx) > parseInt(jbref.inx)) {
                            rval = -1;
                        } else {
                            rval = 1;
                        }
                    }
                    return rval;
                })
                //初始化
                .each(function (index, element) {
                    var that = $(element);
                    //20150728 查询条件跟随处理
                    //通过相同的id确定查询条件需要跟随的控件
                    var id = that.attr("id");
                    if (sdlbase.isUndef(id))
                        return;
                    //通过设置默认值,实现查询条件跟随
                    var datadefault = golbalquery[id.toString()] ? golbalquery[id.toString()] : that.attr("data-default");
                    //根据数据属性,初始化查询条件
                    _pagebase.initcontrl({
                        //是否是回调查询
                        iscallback: false,
                        //控件ID
                        id: id,
                        //控件类型 对于SDLtool中封装控件
                        datatarget: that.attr("data-target"),
                        //控件初始化数据类型 例如：城市
                        datatype: that.attr("data-type"),
                        //默认值
                        datadefault: datadefault,
                        //联动目标控件
                        datafor: that.attr("data-for"),
                        //数据库查询类型
                        querytype: that.attr("query-type"),
                        //数据验证
                        dataverify: that.attr("data-verify"),
                        //扩展属性
                        extattr: that.attr("ext-attr"),
                        //是否增加全部
                        addall: that.attr("data-add-all"),
                        //关联数据项
                        dataref: that.attr("data-ref")
                    })
                })
        },
        //绑定查询事件
        bindPost: function (opt) {
            var that = this;
            $("#btnSubmit").on('click', function () {
                //请求数据
                if (!sdlbase.isUndef(opt.postdata)) {
                    that.getdata(opt);
                }
                    //如果未指定查询参数,在查询时间时,调用postcallback
                else {
                    that.postcallback(that);
                }
            })
        },
        //绑定导出
        bindExport: function (arg) {
            var that = this;
            //有导出按钮则有导出功能
            var $ele = $("#btnDown");
            if ($ele.length == 0)
                return false;
            $ele.on("click", function (e) {
                //时间参数
                var myDate = new Date();
                //获取页面的导出配置
                var config = that.getExportConfig();
                //导出类型 1:Json 2:DB
                var exttp = 1;
                if (!sdlbase.isUndef(config.exportTp)) {
                    exttp = config.exportTp;
                }
                //获取当期页面标题
                var pagetitle = _pagebase.getCache(_pagebase.cacheTp.feature, { key: "pagetitle" });
                //获取返回数据
                var rtsdata = _pagebase.getCache(_pagebase.cacheTp.rstData, { key: "rst" });
                //根据用户指定的key获取数据表
                var data = sdlbase.Json.GetdsFmRst(rtsdata, config.proc);
                //多表头-》填充数据行
                if (!sdlbase.isUndef(config.fillrow)) {
                    data.Rows.unshift(config.fillrow)
                }
                //默认格式化字符串
                var deffmt = "##,###";
                //列配置格式化后结果保存
                var cols = [];
                //引用配置列
                var parmcols = config.cols;
                //根据页面配置，处理列配置,
                if (!sdlbase.isUndef(parmcols)) {
                    for (var i in parmcols) {
                        cols.push({
                            //如果页面未配置列name,则根据索引在缓存中查找
                            Name: sdlbase.isUndef(parmcols[i].Name) ? data.Columns[i] : parmcols[i].Name,
                            //支持单独配置title,DisplayName优先级高
                            DisplayName: sdlbase.isUndef(parmcols[i].DisplayName) ? parmcols[i].title : parmcols[i].DisplayName,
                            Width: 20,
                            Height: 20,
                            //列格式化方法，未指定使用默认
                            Format: sdlbase.isUndef(parmcols[i].fmtstr) ? deffmt : parmcols[i].fmtstr
                        });
                    }
                }
                //根据参数下载导出文件
                _pagebase.fileLoad(
                {
                    //页面标题+时间戳
                    FileName: pagetitle + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds(),
                    Sheets: [{
                        ExportType: exttp,
                        Data: data,
                        Title: pagetitle,
                        SheetName: pagetitle,
                        QueryData: JSON.stringify(that.getQuery(config)),
                        //页面查询条件做为header
                        Headers: _pagebase.getPageQuery(),
                        Footers: ["来自[数据门户]"],
                        Columns: cols,
                        //合并参数
                        Merge: config.merge
                    }]
                })
            })
        },

        //获取查询参数
        getQuery: function (opt) {
            var parm = opt.postdata;
            var query = _pagebase.getCache(_pagebase.cacheTp.query);
            for (var i in parm) {
                if (sdlbase.isUndef(parm[i]["Parameters"])) {
                    parm[i]["Parameters"] = [];
                }
                //参数引用类型
                for (var q in query) {
                    var ishas = false;
                    var vq = query[q].split('$');
                    for (var p in parm[i]["Parameters"]) {
                        if (parm[i]["Parameters"][p].Name === q) {
                            ishas = true;
                            parm[i]["Parameters"][p].Value = vq[0];
                            parm[i]["Parameters"][p].DataType = vq[1];
                        }
                    }
                    if (!ishas)
                        parm[i]["Parameters"].push({ Name: q, Value: vq[0], DataType: vq[1] });
                }
            }
            return parm;
        },
        //获取查询参数根据Key
        getQueryByKey: function (arg) {
            var val = _pagebase.getCache(_pagebase.cacheTp.query, { key: arg });
            if (val) {
                var varr = val.split('$');
                return varr[0];
            }
            return false;
        },
        //存储数据
        cacheData: function (data) {
            if (!sdlbase.isUndef(data)) {
                _pagebase.setCache(_pagebase.cacheTp.rstData, { key: "rst", val: data });
            }
        },
        //获取数据,页面调用接口
        getdata: function (opt) {
            var that = this;
            sdlbase.getdata({
                evt: that, callback: that.postcallback,
                queryjson: { p: JSON.stringify(that.getQuery(opt)) }
            });
        },
    });

}).call(this);

