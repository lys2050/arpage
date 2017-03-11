/*
 * sdltool.js Ver1.3
 */
(function () {
    //keep ref window
    var root = this;
    //cotr
    var sdltool = function (obj) {
        if (obj instanceof sdltool) return obj;
        if (!(this instanceof sdltool)) return new sdltool(obj);
    };

    root.sdltool = sdltool;

    //获取格式化方法
    var _getFormatFun = function (arg, isthousandsSep) {
        //去除千分号
        var StrMan = function (val) {
            if (val) {
                return val.toString().replace(new RegExp(/,/g), "") * 1;
            }
        }
        //常用格式类型
        switch (arg) {
            case "date":
                return function (val) { return val; };
                break;
            case "percent":
                return function (val) { return sdlbase.Format.numFormat(val, 2) + "%"; };
                break;
            case "decimal":
                return function (val) { return sdlbase.Format.numFormat(val, 2); };
                break;
            default:
                return function (val) { return val; };
                break
        }
        //自定义
        if (!sdlbase.isUndef(arg.key)) {
            switch (arg.key) {
                case "percent":
                    {
                        if (sdlbase.isUndef(arg.reserve)) {
                            return function (val) { return sdlbase.Format.numFormat(val, 2) + "%"; };
                        } else {
                            return function (val) { return sdlbase.Format.numFormat(val, arg.reserve) + "%"; };
                        }
                    }
                    break;
                case "decimal":
                    {
                        if (sdlbase.isUndef(arg.reserve)) {
                            return function (val) { return sdlbase.Format.numFormat(val, 2) };
                        } else {
                            return function (val) { return sdlbase.Format.numFormat(val, arg.reserve) };
                        }
                    }
                    break;
            }
        }
    }
    //private table base class
    var _tablebase = sdlbase.Class.extend({
        init: function (arg) {
            // init tablenode
            var that = this;
            var node = that.dopt.node();
            $("#" + this.renderto).html(node.html);
            that.nodekey = node.domid;
        },
        formatcol: function (arg) {
            if (sdlbase.isUndef(arg) || sdlbase.isEmpty(arg)) {
                sdlbase.log.error("talbe", "not config table column title");
                return [];
            } else {
                var rarray = [];
                for (var i = 0; i < arg.length; i++) {
                    rarray.push(
                        {
                            "title": arg[i].title,
                            render: this.getrender(arg[i].datatp),
                            "data": arg[i].data,
                        });
                }
                return rarray;
            }
        },
        getrender: function (arg) {
            //def render
            if (sdlbase.isUndef(arg)) {
                return this.defrender;
            } else if (sdlbase.isFunction(arg)) {
                return arg;
            } else {
                return _getFormatFun(arg);
            }
        },
        defrender: function (arg) {
            if (!sdlbase.isUndef(arg) && !sdlbase.isNaN(arg)) {
                return sdlbase.Format.numFormat(arg);
            } else {
                return arg;
            }
        },
        renderto: "tbcontainer",
        preth: null,
        //set data mode
        setdata: function (opt) {
            var that = this;
            if (!sdlbase.isUndef(that.colunm[0].data)) {
                return sdlbase.Json.formatResult(sdlbase.Json.GetdsFmRst(opt.data, opt.dataKey))[0];
            } else {
                return sdlbase.Json.GetdsFmRst(opt.data, opt.dataKey).Rows;
            }
        },
        render: function (opt) {
            var that = this;
            $('#' + that.nodekey).dataTable(opt);
        },
        dopt: {
            "bFilter": false, "bSort": false, "pagerPosition": "top",
            "node": function () {
                var time = (new Date()).getTime();
                var rand = Math.ceil(Math.random() * 10);
                var nodekey = "example_" + time + "_" + rand;
                return {
                    html: "<table id=\"" + nodekey + "\" class=\"table  table-bordered \" cellspacing=\"5\" width=\"100%\">\</table>",
                    domid: nodekey
                }
            },
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，没有匹配的数据",
                "sInfo": "第 _START_ - _END_ 条 / 共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有匹配的数据",
                "sInfoFiltered": "(数据表中共 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "全文搜索：",
                "oPaginate": {
                    "sFirst": "第一页",
                    "sPrevious": " 上一页 ",
                    "sNext": " 下一页 ",
                    "sLast": " 最后一页 "
                }
            }
        }
    });
    //simple-table
    sdltool.simpletable = _tablebase.extend({
        init: function (opt) {
            var that = this;
            if (!sdlbase.isUndef(opt.renderto))
                that.renderto = opt.renderto;
            that._super();
            that.dataKey = opt.dataKey;
            that.colunm = that.formatcol(opt.coloums);
            that.data = that.setdata(opt);
            that.preth = opt.preth;
        },
        render: function () {
            var that = this;
            that._super($.extend(true, {}, that.dopt, {
                "data": that.data,
                "columns": that.colunm
            }));
            if (that.preth != null) {
                $("#" + that.nodekey + " thead").prepend(that.preth);
            }
            $('#' + that.nodekey + '_length').remove();
        }
    });
    //服务端分页表格 add by ly
    sdltool.Pagingtable = _tablebase.extend({
        init: function (opt) {
            var that = this;
            if (!sdlbase.isUndef(opt.renderto))
                that.renderto = opt.renderto;
            that._super();
            that.colunm = that.formatcol(opt.coloums);
            that.preth = opt.preth;
            that.postparms = opt.postparm;
        },
        postparms: null,
        render: function (opt) {
            var that = this;
            that._super($.extend({}, that.dopt, {
                "columns": that.colunm,
                "serverSide": true,
                "ajax":
                    {
                        "url": "Data/DataAccessPaging.ashx",
                        "type": "POST",
                        "dataType": 'json',
                        "data": { p: JSON.stringify(that.postparms) }
                    }
            }));
            if (that.preth != null) {
                $("#" + that.nodekey + " thead").prepend(that.preth);
            }
            $('#' + that.nodekey + '_length').remove();
        }
    });
    //private table base class

    var _chartbase = sdlbase.Class.extend({
        init: function (arg) {
            // init tablenode
        },
        render: function (rdto, opt) {
            $('#' + rdto).highcharts($.extend(true, this.dopt, opt));
        },
        categories: {},
        series: {},
        renderto: "",
        dataFormat: function (opt) {
            var mdata = sdlbase.Json.formatResult(opt.data)[0];
            var result = { categories: [], series: [] };
            var glist = [], objs = {};
            $.each(mdata, function (idx, val) {
                var nameval = val[opt.namecol]
                if ($.inArray(nameval, result.categories) < 0) { result.categories.push(nameval); }
            });
            for (var i in opt.groupcol) {
                var datafn = null;
                if (sdlbase.isUndef(opt.datatp)) {
                    datafn = function (val) {
                        if (!sdlbase.isNaN(val)) {
                            return val * 1;
                        }
                    };
                } else {
                    datafn = _getFormatFun(opt.datatp, false);
                } var datas = [];
                $.each(mdata, function (idx, val) {
                    datas.push(datafn(val[opt.groupcol[i].val]));
                });
                result.series.push({ name: opt.groupcol[i].title, data: datas });
            }
            return result;
        },
        dopt: {
            colors: ['#FE8F00', '#93CCB9', '#EC72AD', '#B892D3', '#58C479', '#78B6DE', '#FF9900', '#F1A6C5', '#BED47F', '#7DE3BC', '#F9AB9E'],
            credits: { enabled: false },
            tooltip: { crosshairs: [{ width: 1, color: '#e0e0e0' }, { width: 1, color: '#e0e0e0' }] },
        }
    });
    sdltool.chart_spline = _chartbase.extend({
        init: function (opt) {
            this._super();
            var optrst = this.dataFormat(opt);
            this.categories = optrst.categories;
            // alert(opt.series);
            this.series = optrst.series;
            this.renderto = opt.renderto;
        },
        render: function () {
            this._super(this.renderto, $.extend(true, {}, {
                chart: { renderTo: this.renderto, type: "spline", marginTop: 20, plotBorderWidth: 1, borderWidth: 0 },
                xAxis: {
                    categories: this.categories, tickPosition: 'inside',
                    labels: { staggerLines: 1, style: { width: 95 }, y: 30, x: -10 }, startOnTick: true
                },
                series: this.series,
                yAxis: { title: { text: " " } },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    borderWidth: 0,
                    labelFormatter: function () {
                        if (this.name.split(',').length > 1) { return this.name.split(',')[1]; }
                        else { return this.name; }
                    }
                }
            }));
        }
    });

    //光滑短曲线（无图例、X/Y轴以及表格线等）
    sdltool.chart_line_short = _chartbase.extend({
        init: function (opt) {
            this._super();
            var optrst = this.dataFormat(opt);
            this.categories = optrst.categories;
            this.series = optrst.series;
            this.renderto = opt.renderto;
            if (opt.x_min) {
                this.x_min = opt.x_min;
            }
        },
        render: function () {
            var y_min = null;
            if (this.y_min) {
                y_min = this.x_min;
            }
            this._super(this.renderto, $.extend(true, {}, {
                chart: { renderTo: this.renderto, type: "spline", height: 50, width: 180 },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: this.categories, labels: {
                        enabled: false
                    },
                    tickLength: 0

                },
                tooltip: {
                    formatter: function () {
                        return this.x + '<br/><b>' + this.series.name + '</b>：' + sdlbase.Format.numFormat(this.y, 0);
                    }
                },
                series: this.series,
                yAxis: {
                    title: { text: "" }, labels: {
                        enabled: false
                    },
                    plotLines: [{
                        value: 0,
                        width: 0
                    }]
                    , gridLineWidth: 0
                    , min: y_min
                },
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                legend: {
                    enabled: false
                }
            }));
        }
    });

    //private table base class
    var _selectbase = sdlbase.Class.extend({
        dopt: { maximumSelectionLength: 5 },
        // init node
        init: function (rdto) {
            this.renderto = rdto;
        },
        render: function (opt) {
            var that = this;
            var $ele = that.getele();
            $ele.css("width", 190);
            //使用json数据源时,清空html
            if (!sdlbase.isUndef(opt.data)) {
                $ele.html("");
            }
            $ele.select2($.extend({}, that.dopt, opt));
        },
        getele: function () {
            var that = this;
            return $('#' + that.renderto);
        },
        //设置选中值
        setval: function (value) {
            var that = this;
            var $ele = that.getele();
            $ele.val(value).trigger("change");
        },
        //获取val
        getval: function () {
            var that = this;
            var $ele = that.getele();
            return $ele.select2("val");
        },
        //获取显示内容
        gettext: function () {
            var that = this;
            var $ele = that.getele();
            //ext 多选 array
            var rvalue="";
	    if($ele.select2("data")[0])
	   {
	      rvalue=$ele.select2("data")[0].text;
	   }
            return rvalue;
        },
        //change
        bindChange: function (callback) {
            var that = this;
            var $ele = that.getele();
            $ele.on("change", function (e) {
                var _jthat = $(this);
                var _data = _jthat.select2("data");
                var _arraytext = '';
                var _arrayvalue = '';
                for (var i in _data) {
                    _arraytext += _data[i].text + ',';
                    _arrayvalue += _data[i].id + ',';
                }
                callback({
                    id: that.renderto,
                    text: _arraytext.substring(0, _arraytext.length - 1),
                    value: _arrayvalue.substring(0, _arrayvalue.length - 1)
                })
            });
        },

    });
    //simple select
    sdltool.select_simple = _selectbase.extend({
        init: function (rdto, opt) {
            this._super(rdto);
        },
        render: function (opt) {
            this._super({ data: opt });
        }
    })

    sdltool.input_simple = sdlbase.Class.extend({
        // init node
        init: function (rdto) {
            this.id = rdto;
        },
        getele: function () {
            var that = this;
            return $("#" + that.id);
        },
        bindChange: function (callback, verify) {
            var that = this;
            var $ele = that.getele();
            $ele.on("change", function (e) {
                var isverify = true;
                if (!sdlbase.isUndef(verify)) {
                    switch (verify) {
                        case "phone":
                            {
                                if (!sdlbase.verify.phone($ele.val())) {
                                    $("#" + that.id + "espan").remove();
                                    $ele.parent().addClass("has-error");
                                    $ele.parent().append("<span id='" + that.id + "espan' class='help-block'style='color: red;'>输入有误</span>");
                                    return false;
                                } else {
                                    $ele.parent().removeClass("has-error");
                                    $("#" + that.id + "espan").remove();
                                }
                            }
                    }
                }
                callback({
                    id: that.id,
                    value: $ele.val()
                })
            });
        },
    });

    //tab
    sdltool.tab_sample = sdlbase.Class.extend({
        init: function (rdto) {
            // init node
            this.id = rdto;
        },
        //get dom
        getele: function () {
            var that = this;
            return $("#" + that.id);
        },
        //get val
        getval: function () {
            var that = this;
            var $ele = that.getele();
            return $ele.find(".active a").attr("data-value");
        },
        //get text
        gettext: function () {
            var that = this;
            var $ele = that.getele();
            return $ele.find(".active a").text();
        },
        //event change
        bindChange: function (callback) {
            var that = this;
            var $ele = that.getele();
            $ele.on("click", "a", function (e) {
                var $this = $(this),
                    value = $this.attr("data-value");
                $ele.find("li").removeClass("active");
                $this.parent().addClass("active");
                callback({
                    id: that.id,
                    val: value
                })
            });
        },
    });

    //datepicker 
    sdltool.datepicker = sdlbase.Class.extend({
        //init
        init: function (opt) {
            // init node
            var that = this;
            that.id = opt.id;
            that.getele().datepicker({
                format: "yyyy-mm-dd",
                language: "zh-CN",
                autoclose: true,
                todayHighlight: true
            });
            that.setdefval(opt.defval);
        },
        setdefval: function (val) {
            var that = this;
            var ele = that.getele();
            ele.datepicker('setDate', val);
        },
        //get dom
        getele: function () {
            var that = this;
            return $("#" + that.id);
        },
        //get val
        getval: function () {
            // ext do
            var that = this;
            var $ele = that.getele();
            return sdlbase.Format.timeFormat($ele.datepicker('getDate'), "yyyy-MM-dd");
        },
        //get text
        gettext: function () {
            // ext do
            return "时间";
        },
        //event change
        bindChange: function (callback) {
            var that = this;
            var $ele = that.getele();
            $ele.on('changeDate', function (ev) {
                callback({
                    id: that.id,
                    val: sdlbase.Format.timeFormat(ev.date, "yyyy-MM-dd")
                })
            })
        },
    });
    //wang jing 
    var _datepicker = sdlbase.Class.extend({
        init: function (opt) {
            var that = this;
            that.id = opt.id;
            if (that.getele().length == 0) {
                return false;
            }
            ////add by wangjing 20150727
            //Public initial value setting
            that.initDate = {
                singleDatePicker: opt.singleDatePicker || false,
                calendarMode: opt.calendarMode || "day",
                minDate: '2010-01-01',
                dateLimit: {
                    days: 1400
                },
                showDropdowns: false,
                showWeekNumbers: false,
                timePicker: false,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                buttonClasses: ['btn'],
                applyClass: 'green',
                cancelClass: 'default',
                format: 'YYYY-MM-DD',
                separator: ' 至 ',
                locale: {
                    applyLabel: '选定日期',
                    cancelLabel: '取消',
                    fromLabel: '开始日期',
                    toLabel: '结束日期',
                    customRangeLabel: '自定义日期',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    firstDay: 1
                }
            };
        },
        monToQuar: function () {
            var oDate = new Date();
            return oDate.getMonth() % 3;
        },
        monToYear: function () {
            var oDate = new Date();
            return oDate.getMonth() % 6;
        },
        getele: function () {
            var that = this;
            return $("#" + that.id);
        },
        cusFormat: function (time, way) {
            var that = this;
            if (!time) return;
            if (!way) way = 'day';
            var month = moment(time).year() % 100;
            var year = parseInt(moment(time).year() / 100);
            var result = time;
            if (way == 'quarter') {
                result = '' + year + (parseInt((month) / 4 + 1));
            } else if (way == 'halfYear') {
                result = '' + year + (parseInt((month) / 7 + 1));
            }
            return result;
        }
    });
    // add by wangjing 20150727
    //Query by date
    sdltool.picker_day = _datepicker.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            that.param = {};
            that.param.calendarMode = 'day';
            //设置初始时间
            if (opt.startDate instanceof Date) {
                that.param.startDate = moment(opt.startDate).format('YYYY-MM-DD');
            } else {
                that.param.startDate = moment().subtract('days', 7).format('YYYY-MM-DD');
            }
            if (opt.endDate instanceof Date) {
                that.param.endDate = moment(opt.endDate).format('YYYY-MM-DD');
            } else {
                that.param.endDate = moment().subtract('days', 1).format('YYYY-MM-DD');
            }
            that.param.maxDate = moment().subtract('days', 1);
            //that.setDate(that.param.startDate, that.param.endDate);
        },
        render: function () {
            var that = this;
            that.param.ranges = {
                '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                '近7天': [moment().subtract('days', 7), moment().subtract('days', 1)],
                '近30天': [moment().subtract('days', 30), moment().subtract('days', 1)],
                '当月': [moment().startOf('month'), moment().subtract('days', 1)],
                '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            };
            that.initDate = $.extend({}, that.initDate, that.param);
            that.getele().daterangepicker(that.initDate, function (start, end) {
                that.initDate.startDate = start.format('YYYYMMDD');
                that.initDate.endDate = end.format('YYYYMMDD');
            });
        },
        getval: function () {
            var that = this;
            return { 'start': moment(that.initDate.startDate).format('YYYYMMDD'), 'end': moment(that.initDate.endDate).format('YYYYMMDD') };
        },
        bingchage: function (callback) {
            var that = this;
            that.getele().on('apply.daterangepicker', function () {
                callback && callback({
                    id: that.id,
                    val: { 'start': that.initDate.startDate, 'end': that.initDate.endDate }
                });
            });
        }
    });
    // add by wangjing 20150727 
    //Query by month
    sdltool.picker_mon = _datepicker.extend({
        init: function (opt, callback) {
            var that = this;
            that._super(opt);
            that.param = {};
            that.param.format = 'YYYY-MM';
            that.param.calendarMode = 'month';
            if (opt.startDate instanceof Date) {
                that.param.startDate = moment(opt.startDate).format('YYYY-MM');
            } else {
                that.param.startDate = moment().subtract('month', 1).format('YYYY-MM');
            }
            if (opt.endDate instanceof Date) {
                that.param.endDate = moment(opt.endDate).format('YYYY-MM');
            } else {
                that.param.endDate = moment().subtract('month', 1).format('YYYY-MM');
            }
            that.param.maxDate = moment().subtract('month', 1).endOf('month');
        },
        render: function () {
            var that = this;
            that.param.ranges = {
                '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                '近3月': [moment().subtract('month', 3).startOf('month'), moment().subtract('month', 1).endOf('month')]
            };
            //覆盖父类参数 extend
            that.initDate = $.extend({}, that.initDate, that.param);
            that.getele().daterangepicker(that.initDate, function (start, end) {
                //that.setDate(start.format('YYYY-MM'), end.format('YYYY-MM'));
                that.initDate.startDate = start.format('YYYYMM');
                that.initDate.endDate = end.format('YYYYMM');
            });
        },
        getval: function () {
            var that = this;
            return { 'start': moment(that.initDate.startDate).format('YYYYMM'), 'end': moment(that.initDate.endDate).format('YYYYMM') };
        },
        bingchage: function (callback) {
            //监听change时间
            //调用回调函数
            var that = this;
            that.getele().on('apply.daterangepicker', function () {
                callback && callback({
                    id: that.id,
                    val: { 'start': that.initDate.startDate, 'end': that.initDate.endDate }
                });
            });
        }
    });
    // add by wangjing 20150727
    //Through quarterly inquiries
    sdltool.picker_quar = _datepicker.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            that.param = {};
            that.param.format = 'YYYY-MM';
            that.param.calendarMode = 'quarter';
            if (opt.startDate instanceof Date && opt.startDate != '') {
                that.param.startDate = moment(opt.startDate).format('YYYYMM');
            } else {
                that.param.startDate = moment().subtract('month', that.monToQuar() + 3).startOf('month');
            }
            if (opt.endDate instanceof Date && opt.endDate != '') {
                that.param.endDate = moment(opt.endDate).format('YYYYMM');
            } else {
                that.param.endDate = moment().subtract('month', that.monToQuar() + 1).endOf('month');
            }
            that.param.maxDate = moment().subtract('month', that.monToQuar() + 1).endOf('month');
            //that.setDate(that.param.startDate, that.param.endDate);
        },
        render: function () {
            var that = this;
            that.param.ranges = {
                '上季度': [moment().subtract('month', that.monToQuar() + 3).startOf('month'), moment().subtract('month', that.monToQuar() + 1).endOf('month')],
                '近3季度': [moment().subtract('month', that.monToQuar() + 9).startOf('month'), moment().subtract('month', that.monToQuar() + 1).endOf('month')]
            };
            that.initDate = $.extend({}, that.initDate, that.param);
            that.getele().daterangepicker(that.initDate, function (start, end) {
                //that.setDate(start.format('YYYY-MM'), end.format('YYYY-MM'));
                that.initDate.startDate = start.format('YYYYMM');
                that.initDate.endDate = end.format('YYYYMM');

            });
        },

        getval: function () {
            var that = this;
            return { 'start': that.cusFormat(that.initDate.startDate, that.initDate.calendarMode), 'end': that.cusFormat(that.initDate.endDate, that.initDate.calendarMode) };
        },
        bingchage: function (callback) {
            var that = this;
            that.getele().on('apply.daterangepicker', function () {
                callback && callback({
                    id: that.id,
                    val: { 'start': that.cusFormat(that.initDate.startDate, that.initDate.calendarMode), 'end': that.cusFormat(that.initDate.endDate, that.initDate.calendarMode) }
                });
            });
        }

    });
    // add by wangjing 20150727
    //Through six months of inquiry
    sdltool.picker_halfy = _datepicker.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            that.param = {};
            that.param.format = 'YYYY-MM';
            that.param.calendarMode = 'halfYear';
            if (opt.startDate instanceof Date && opt.startDate != '') {
                that.param.startDate = moment(opt.startDate).format('YYYYMM');
            } else {
                that.param.startDate = moment().subtract('month', this.monToYear() + 6).startOf('month');
            }
            if (opt.endDate instanceof Date && opt.endDate != '') {
                that.param.endDate = moment(opt.endDate).format('YYYYMM');
            } else {
                that.param.endDate = moment().subtract('month', this.monToYear() + 1).endOf('month');
            }
            that.param.maxDate = moment().subtract('month', this.monToYear() + 1).endOf('month');
            //that.setDate(that.param.startDate, that.param.endDate);
        },
        render: function () {
            var that = this;
            that.param.ranges = {
                '上半年': [moment().subtract('month', this.monToYear() + 6).startOf('month'), moment().subtract('month', this.monToYear() + 1).endOf('month')],
                '近1年半': [moment().subtract('month', this.monToYear() + 18).startOf('month'), moment().subtract('month', this.monToYear() + 1).endOf('month')]
            };
            that.initDate = $.extend({}, that.initDate, that.param);
            that.getele().daterangepicker(that.initDate, function (start, end) {
                //that.setDate(start.format('YYYY-MM'), end.format('YYYY-MM'));
                that.initDate.startDate = start.format('YYYYMM');
                that.initDate.endDate = end.format('YYYYMM');
            });
        },
        getval: function () {
            var that = this;
            return { 'start': that.cusFormat(that.initDate.startDate, that.initDate.calendarMode), 'end': that.cusFormat(that.initDate.endDate, that.initDate.calendarMode) };
        },
        bingchage: function (callback) {
            var that = this;
            that.getele().on('apply.daterangepicker', function () {
                callback && callback({
                    id: that.id,
                    val: { 'start': that.cusFormat(that.initDate.startDate, that.initDate.calendarMode), 'end': that.cusFormat(that.initDate.endDate, that.initDate.calendarMode) }
                });
            });
        }
    });
    // add by wangjing 20150727
    //Query through
    sdltool.picker_year = _datepicker.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            that.param = {};
            that.param.format = 'YYYY';
            that.param.locale = {
                applyLabel: '选定日期',
                cancelLabel: '取消',
                fromLabel: '开始日期',
                toLabel: '结束日期',
                customRangeLabel: 'Custom Range',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 1
            };
            //that.param.locale.customRangeLabel = 'Custom Range';
            if (opt.startDate instanceof Date && opt.startDate != '') {
                that.param.startDate = moment(opt.startDate).format('YYYY');
            } else {
                that.param.startDate = moment().subtract('year', 1).format('YYYY');
            }
            if (opt.endDate instanceof Date && opt.endDate != '') {
                that.param.endDate = moment(opt.endDate).format('YYYY');
            } else {
                that.param.endDate = moment().subtract('year', 1).format('YYYY');
            }
            that.param.maxDate = moment().subtract('year', 1).endOf('year');
        },
        render: function () {
            var that = this;
            //只能选择区间
            that.param.ranges = {
                '近1年': [moment().subtract('year', 2).startOf('year'), moment().subtract('year', 1).endOf('year')],
                '近2年': [moment().subtract('year', 3).startOf('year'), moment().subtract('year', 1).endOf('year')],
                '近3年': [moment().subtract('year', 4).startOf('year'), moment().subtract('year', 1).endOf('year')]
            };
            that.initDate = $.extend({}, that.initDate, that.param);
            that.getele().daterangepicker(that.initDate, function (start, end) {
                that.initDate.startDate = start.format('YYYY');
                that.initDate.endDate = end.format('YYYY');
            });
        },
        getval: function () {
            var that = this;
            return { 'start': that.initDate.startDate, 'end': that.initDate.endDate };
        },
        bingchage: function (callback) {
            var that = this;
            that.getele().on('apply.daterangepicker', function () {
                callback && callback({
                    id: that.id,
                    val: { 'start': that.initDate.startDate, 'end': that.initDate.endDate }
                });
            });
        }
    });
    //弹出层
    var _popLayerbase = sdlbase.Class.extend({
        init: function (opt) {
            var that = this;
            that.hasMask = opt.hasMask || false;
            that.container = opt.container || 'body';
            that.closeFn = opt.closeFn || '';
            if (that.container != 'body') that.hasMask = false;
            that.title = opt.title;
            that.url = opt.url;
            that.content = opt.content;
            that.state = 'notCreate';
        },
        gettitle: function () {
            var that = this;
            that.title = that.title || 'Title';
            return that.title;
        },
        getcontent: function () {
            var that = this;
            if (that.content) {
                that.content = that.content;
            } else if (that.url) {
                $.ajax({
                    url: that.url,
                    async: false,
                    success: function (data) {
                        that.content = data;
                    }
                });
            }
            return that.content;
        },
        getcontainer: function () {
            return $(this.container);
        },
        //遮罩层
        mask: function () {
            var that = this;
            if (!that.hasMask) return;
            that.mask = $('<div class="album-mask"></div>');
            that.mask.appendTo("body");
            $(window).on('resize', function () {
                that.maskResize();
            });
            that.maskResize();
        },
        //设置遮罩层位置
        maskResize: function () {
            var that = this;
            $('html').css('overflow', 'hidden');
            $('body').css('overflow', 'hidden');
            that.mask.css({
                position: "absolute",
                zIndex: 90000,
                top: "0px",
                left: "0px",
                width: $(window).width() + 'px',
                height: $(document).height()
            });
        },
        //弹窗框架
        dialogConstructor: function () {
            var that = this;
            //判断容器有没有定义高度
            that.flag = that.getcontainer().height();
            that.outerDiv = $('<div class="album-dialog"><div class="md-container"> <strong class="md-close" title="关闭"> × </strong><div class="md-titlebar">' + that.gettitle() + '</div><div class="md-body"><div class="md-content "><div class="dialog-cnt">' + that.getcontent() + '</div></div></div></div></div>');
            $(that.container).append(that.outerDiv);
            var pos = that.getPos();
            //位置设置
            that.outerDiv.css(pos);
            that.mask();
            //给关闭按钮绑定事件
            that.closeBtn = that.outerDiv.find('.md-close');
            that.closeBtn.on('click', function () {
                that.closeFn && that.closeFn(that.title, that.content);
                that.close();
            });
            that.state = 'close';

        },

        //位置设置
        getPos: function () {
            var that = this;
            var borWidth = 2;
            //判断弹窗容器是不是body
            var jsonPos = {};
            if (that.container != 'body') {
                //若弹窗容器不是body，弹窗位置设置如下：
                jsonPos.position = 'static';
                jsonPos.display = 'inline-block';
                var width = $('.album-dialog').width();
                var height = $('.album-dialog').height();
                //判断用户时候设置了容器高度；
                if (that.flag) {

                    jsonPos.maxWidth = that.getcontainer().width() - parseFloat(borWidth) * 2;
                    jsonPos.maxHeight = that.getcontainer().height() - parseFloat(borWidth) * 2;
                    //如果设置了高度位置，弹窗位置设置如下：
                    if (that.getcontainer().height() < height) {
                        jsonPos.marginTop = 0 + 'px';
                    } else {
                        jsonPos.marginTop = that.getcontainer().height() / 2 - height / 2 - parseFloat(borWidth) + 'px';
                    }
                    jsonPos.marginLeft = that.getcontainer().width() / 2 - width / 2 - parseFloat(borWidth) + 'px';
                    that.outerDiv.find('.md-container').css({
                        maxHeight: that.getcontainer().height() - parseFloat(borWidth) * 2,
                    });

                    return jsonPos;
                } else {
                    //如果未设置高度位置，弹窗位置设置如下：   
                    that.containerH = that.getcontainer().height();
                    jsonPos.marginLeft = that.getcontainer().width() / 2 - width / 2 - parseFloat(borWidth) + 'px';
                    jsonPos.marginTop = 4 + 'px'
                    return jsonPos;
                }
            } else {
                //若弹窗容器是body，弹窗位置设置如下：
                var width = $('.album-dialog').width();
                var height = $('.album-dialog').height();
                jsonPos.zIndex = 90001;
                jsonPos.marginLeft = -width / 2 - borWidth + 'px';
                jsonPos.marginTop = -height / 2 - borWidth + 'px';
                return jsonPos;
            }
        },
        close: function () {
            var that = this;
            if (that.state == 'open') {
                that.hasMask && that.mask.removeClass('album-mask-show');
                that.outerDiv.removeClass('album-dialog-show');
                $('html').css('overflow-y', 'auto');
                $('body').css('overflow-y', 'auto');
                that.getcontainer().height(that.containerH);
                that.state = 'close';
            }
        },
        open: function () {
            var that = this;
            if (that.state == 'notCreate') {
                that.dialogConstructor();
            }
            if (that.state == 'close') {
                that.hasMask && that.mask.addClass('album-mask-show');
                that.outerDiv.addClass('album-dialog-show');
                if (!that.flag) {
                    that.getcontainer().css('height', 'auto');
                }
                that.state = 'open';
            }
        }
    });
    sdltool.simple_popLayer = _popLayerbase.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
        }
    });

    //表单验证
    var _verification = sdlbase.Class.extend({
        init: function (opt) {
            var that = this;
            that.form = that.getele(opt.form);
            if (!that.form) return;
            that.submit = that.getele(opt.submit);
            that.reset = that.getele(opt.reset);
        },
        validate: function () {
            var that = this;
            that.form.bootstrapValidator({
                excluded: ':disabled',
                feedbackIcons: that.feedbackIcons,
                fields: that.project(),
            });
            that.submit && that.submit.on('click', function () {
                that.form.bootstrapValidator('validate');
            });
            that.reset && that.reset.on('click', function () {
                that.form.data('bootstrapValidator').resetForm(true);
            });
        },
        //错误提示图表
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //验证项目
        project: function () {
            var that = this;
            var dataArr = that.form.find('[data-validator]');
            item = {};
            for (var i = 0; i < dataArr.length; i++) {
                var value = JSON.parse(dataArr.eq(i).attr('data-validator'));
                item[value.valikey] = that[value.valikey]('[data-validator*="\"' + value.valikey + '\""]');
            }
            return item;
        },
        //小数验证
        decimal: function (select) {
            var that = this;
            var ele = that.form.find(select);
            if (ele.length == 0) { return ''; }
            var value = JSON.parse(ele.attr('data-validator'));
            var digit = value.digit || 2;
            var number = value.number || 2;
            if (value.required) {
                return {
                    selector: select,
                    validators: {
                        notEmpty: {
                            message: '该项为必填项'
                        },
                        regexp: {
                            regexp: new RegExp("^\\d{" + number + "}\\.\\d{" + digit + "}$"),
                            message: '您输入的数字不符合条件'
                        }
                    }
                }
            } else {
                return {
                    selector: '[data-validator*="decimal"]',
                    validators: {
                        regexp: {
                            regexp: new RegExp("^\\d{" + number + "}\\.\\d{" + digit + "}$"),
                            message: '您输入的数字不符合条件'
                        }
                    }
                }
            }

        },
        //下拉框验证
        select: function (select) {
            var that = this;
            var ele = that.form.find(select);
            if (ele.length == 0) { return ''; }
            that.form.find(select).multiselect();
            var value = JSON.parse(ele.attr('data-validator'));
            if (value.required) {
                var min = value.min || 1;
            } else {
                var min = value.min || 0;
            }
            var max = value.max || 4;
            return {
                selector: select,
                validators: {
                    choice: {
                        min: min,
                        max: max,
                        message: '请选择' + min + '-' + max + '项'
                    }
                }
            }
        },
        //单选按钮验证
        radio: function (select) {
            var that = this;
            var ele = that.form.find(select);
            if (ele.length == 0) { return ''; }
            that.form.find('[name=' + ele.attr('name') + ']').attr('data-validator', ele.attr('data-validator'));
            var value = JSON.parse(ele.attr('data-validator'));
            if (value.required) {
                return {
                    selector: select,
                    validators: {
                        notEmpty: {
                            message: '该项为必填项'
                        }
                    }
                };
            } else {
                return {
                    selector: select,
                    validators: {
                        choice: {
                            min: 0,
                            message: '该项不是必填项'
                        }
                    }
                };
            }
        },
        //多选按钮验证
        checkbox: function (select) {
            var that = this;
            var ele = that.form.find(select);
            if (ele.length == 0) { return ''; }
            that.form.find('[name=' + ele.attr('name') + ']').attr('data-validator', ele.attr('data-validator'));
            var value = JSON.parse(ele.attr('data-validator'));
            if (value.required) {
                var min = value.min || 1;
            } else {
                var min = value.min || 0;
            }
            var max = value.max || 4;
            return {
                selector: select,
                validators: {
                    choice: {
                        min: min,
                        max: max,
                        message: '请选择' + min + '-' + max + '项'
                    }
                }
            }
        },
        getele: function (id) {
            var that = this;
            if (!id) return '';
            return $('#' + id);
        },

    });
    //表单验证
    sdltool.verify = _verification.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
        }

    });
    var _echarts = sdlbase.Class.extend({
        init: function (opt) {
            var that = this;
            //if (!opt.paths || !opt.data) return '';
            that.container = opt.container || 'body';
            that.paths = opt.paths;
            that.title = opt.title || '';
            that.yUnit = that.getUnit(opt).yUnit;
            that.xUnit = that.getUnit(opt).xUnit;
            that.zUnit = that.getUnit(opt).zUnit;
        },
        getUnit: function (opt) {
            var that = this;
            for (var i = 0; i < opt.groupcol.length; i++) {
                if (opt.groupcol[i].datatp) {
                    if (opt.groupcol[i].datatp.yUnit || opt.groupcol[i].datatp.xUnit || opt.groupcol[i].datatp.zUnit) {
                        return { yUnit: opt.groupcol[i].datatp.yUnit || '', xUnit: opt.groupcol[i].datatp.xUnit || '', zUnit: opt.groupcol[i].datatp.zUnit || '' };
                    }
                }
            }
            return { yUnit: '', xUnit: '', zUnit: '' };
        },
        render: function () {
            var that = this;
            that.echarts();
        },
        echarts: function () {
            var that = this;
            var myChart = echarts.init(that.getele(), 'macarons');
            var option = that.setOption();
            myChart.setOption(option);
        },
        legendData: {},
        setOption: function () {
            var that = this;
            var option = {
                legend: {
                    data: that.legendData
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {

                        var formatStr = params[0].name + '<br/>';
                        for (var i = 0; i < params.length; i++) {
                            formatStr += params[i].seriesName + ' : ' + params[i].value + (JSON.stringify(params[i].series.format).indexOf('percent') != -1 ? '%' : '') + '<br/>'
                        }
                        return formatStr;
                    }
                },
                title: {
                    text: that.title,
                }
            };
            return option;
        },
        dataFormat: function (opt, fn) {
            var that = this;
            var mdata = sdlbase.Json.formatResult(opt.data)[0];
            var result = { xAxisData: [], series: [], legendData: [] };
            var glist = [], objs = {};
            $.each(mdata, function (idx, val) {
                var nameval = val[opt.namecol];
                if ($.inArray(nameval, result.xAxisData) < 0) { result.xAxisData.push(nameval); }
            });

            for (var i in opt.groupcol) {
                var datafn = null;
                if (sdlbase.isUndef(opt.groupcol[i].datatp)) {
                    datafn = function (val) {
                        if (!sdlbase.isNaN(val)) {
                            return val * 1;
                        } else if (val instanceof Array) {
                            return val;
                        }
                    };
                } else {
                    if (opt.groupcol[i].datatp == "percent" || opt.groupcol[i].datatp.key == "percent") {
                        if (opt.groupcol[i].reserve) {
                            datafn = function (val) { return sdlbase.Format.numFormat(val, opt.groupcol[i].reserve); };
                        } else {
                            datafn = function (val) { return sdlbase.Format.numFormat(val, 2); };
                        }
                    } else {
                        datafn = _getFormatFun(opt.groupcol[i].datatp, false);
                    }
                }
                var datas = [];
                $.each(mdata, function (idx, val) {
                    datas.push(datafn(val[opt.groupcol[i].val]));
                });
                if (datas.length == 0) {
                    result.series.push(fn && fn(opt.groupcol[i], [0]));
                } else {
                    result.series.push(fn && fn(opt.groupcol[i], datas));
                }
                result.legendData.push(opt.groupcol[i].title);
            }
            return result;
        },
        getele: function () {
            var that = this;
            return $(that.container)[0];
        },
    });
    sdltool.echarts_spline = _echarts.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            that.type = 'line';
            var optrst = that.dataFormat(opt);
            that.xAxisData = optrst.xAxisData;
            that.series = optrst.series;
            that.legendData = optrst.legendData;
        },
        xAxisData: {},
        series: {},
        setOption: function () {
            var that = this;
            var option = that._super();
            option = $.extend({}, option, {
                xAxis: [
                    {
                        type: that.xAxisData.length ? 'category' : 'value',
                        data: that.xAxisData,
                        axisLabel: {
                            formatter: '{value}' + that.xUnit
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}' + that.yUnit
                        }
                    }
                ],
                series: that.series,

            });
            return option;
        },
        dataFormat: function (opt) {
            var that = this;
            return that._super(opt, function (arg, data) {
                return {
                    name: arg.title, type: that.type, data: data, format: arg.datatp || ''
                };
            });
        },

    });
    sdltool.echarts_bar = _echarts.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            that.type = 'bar';
            var optrst = that.dataFormat(opt);
            that.xAxisData = optrst.xAxisData;
            that.series = optrst.series;
            that.legendData = optrst.legendData;
        },
        dataFormat: function (opt) {
            var that = this;
            return that._super(opt, function (arg, data) {
                return { name: arg.title, type: that.type, data: data, format: arg.datatp || '' };
            });
        },
        xAxisData: {},
        series: {},
        setOption: function () {
            var that = this;
            var option = that._super();
            option = $.extend({}, option, {
                xAxis: [
                    {
                        type: that.xAxisData.length ? 'category' : 'value',
                        data: that.xAxisData,
                        axisLabel: {
                            formatter: '{value}' + that.xUnit
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}' + that.yUnit
                        }
                    }
                ],
                series: that.series,

            });
            return option;
        },
    });
    //堆积柱状图
    sdltool.echarts_stacked = _echarts.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            that.type = 'bar';
            var optrst = that.dataFormat(opt);
            that.xAxisData = optrst.xAxisData;
            that.series = optrst.series;
            that.legendData = optrst.legendData;
        },
        dataFormat: function (opt) {
            var that = this;
            return that._super(opt, function (arg, data) {
                if (arg.datatp && arg.datatp.markLine && data.length > 1) {
                    return {
                        name: arg.title, stack: arg.datatp ? arg.datatp.stack : '', type: that.type, data: data, format: arg.datatp || '', markLine: {
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        type: 'dashed'
                                    }
                                }
                            },
                            data: [
                                [{ type: 'min' }, { type: 'max' }]
                            ]
                        }
                    };
                } else {
                    return {
                        name: arg.title, stack: arg.datatp ? arg.datatp.stack : '', type: that.type, data: data, format: arg.datatp || ''
                    };
                }

            });
        },
        xAxisData: {},
        series: {},
        setOption: function () {
            var that = this;
            var option = that._super();
            option = $.extend({}, option, {
                xAxis: [
                    {
                        type: that.xAxisData.length ? 'category' : 'value',
                        data: that.xAxisData,
                        axisLabel: {
                            formatter: '{value}' + that.xUnit
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}' + that.yUnit
                        }
                    }
                ],
                series: that.series,

            });
            return option;
        },
    });

    sdltool.echarts_pie = _echarts.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            var optrst = that.dataFormat(opt);
            that.legendData = optrst.legendData;
            that.series = optrst.series;
        },
        seriesData: {},
        setOption: function () {
            var that = this;
            var option = that._super();
            option = $.extend({}, option, {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: that.series
                    }
                ]
            });
            return option;
        },
        dataFormat: function (opt) {
            var that = this;
            return that._super(opt, function (arg, data) {
                return { value: data, name: arg.title, format: arg.datatp || '' };
            });
        }
    });
    sdltool.echarts_radar = _echarts.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            var optrst = that.dataFormat(opt);
            that.xAxisData = optrst.xAxisData;
            that.series = optrst.series;
            that.legendData = optrst.legendData;
            that.indicator = optrst.indicator;
        },
        xAxisData: {},
        series: {},
        setOption: function () {
            var that = this;
            var option = that._super();
            option = $.extend({}, option, {
                //tooltip: {
                //    trigger: 'axis'
                //},
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var formatStr = '';
                        for (var i = 0; i < params.length; i++) {
                            params[0].series.data[i].format
                            formatStr += params[0].series.data[i].name + ' : ' + params[i].value + (JSON.stringify(params[0].series.data[i].format).indexOf('percent') != -1 ? '%' : '') + '<br/>'
                        }
                        return formatStr;
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    data: that.legendData
                },
                polar: [
                   {
                       indicator: that.indicator
                   }
                ],
                calculable: true,
                series: [
                    {
                        type: 'radar',
                        data: that.series
                    }
                ]

            });
            return option;
        },
        dataFormat: function (opt) {
            var that = this;
            var result = that._super(opt, function (arg, data) {
                return { name: arg.title, value: data, format: arg.datatp || '' };
            });
            result.indicator = [];
            for (var i = 0 ; i < result.xAxisData.length ; i++) {
                result.indicator.push({ text: result.xAxisData[i] });
            }
            return result;
        }
    });
    sdltool.echarts_scatter = _echarts.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            var optrst = that.dataFormat(opt);
            that.xAxisData = optrst.xAxisData;
            that.series = optrst.series;
            that.legendData = optrst.legendData;
            that.indicator = optrst.indicator;
        },
        xAxisData: {},
        series: {},
        setOption: function () {
            var that = this;
            var option = that._super();
            option = $.extend({}, option, {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 0,
                    axisPointer: {
                        show: true,
                        type: 'cross',
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    },
                    formatter: function (params) {
                        return params.seriesName + ' :<br/>'
                           + params.value[0] + that.xUnit + ',' +
                           +params.value[1] + that.yUnit + ',' +
                           +params.value[2] + that.zUnit;
                    }
                },
                legend: {
                    data: that.legendData
                },
                xAxis: [
                    {
                        type: 'value',
                        splitNumber: 6,
                        scale: true,
                        axisLabel: {
                            formatter: '{value}' + that.xUnit
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitNumber: 4,
                        scale: true,
                        axisLabel: {
                            formatter: '{value}' + that.yUnit
                        }
                    }
                ],
                series: that.series
            });
            return option;
        },
        dataFormat: function (opt) {
            var that = this;
            var result = that._super(opt, function (arg, data) {
                var seriesDate = [];
                var arr = [];
                for (var i = 0; i < data.length ; i++) {
                    arr.push(data[i]);
                    if (i % 3 == 2) {
                        seriesDate.push(arr);
                        arr = [];
                    }
                }
                return {
                    name: arg.title,
                    type: 'scatter',
                    symbolSize: function (value) {
                        return Math.round(value[2] / 5);
                    },
                    data: seriesDate,
                    format: arg.datatp || ''
                };
            });
            return result;
        }
    });
    sdltool.echarts_funnel = _echarts.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            var optrst = that.dataFormat(opt);
            that.legendData = optrst.legendData;
            that.series = optrst.series;
        },
        seriesData: {},
        setOption: function () {
            var that = this;
            var option = that._super();
            option = $.extend({}, option, {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c}%"
                },
                calculable: true,
                series: [
                    {

                        type: 'funnel',
                        width: '70%',
                        x: '15%',
                        data: that.series
                    }
                ]
            });
            return option;
        },
        dataFormat: function (opt) {
            var that = this;
            return that._super(opt, function (arg, data) {
                return { value: data, name: arg.title, format: arg.datatp || '' };
            });
        }
    });
    sdltool.echarts_map = _echarts.extend({
        init: function (opt) {
            var that = this;
            that._super(opt);
            var optrst = that.dataFormat(opt);
            that.legendData = optrst.legendData;
            that.series = optrst.series;
            that.xAxisData = optrst.xAxisData;
        },
        xAxisData: {},
        seriesData: {},
        setOption: function () {
            var that = this;
            var option = that._super();
            option = $.extend({}, option, {
                tooltip: {
                    trigger: 'item'
                },
                roamController: {
                    show: true,
                    x: 'right',
                    mapTypeControl: {
                        'china': true
                    }
                },

                series: that.series
            });
            return option;
        },
        dataFormat: function (opt) {
            var that = this;
            var result = that._super(opt);
            return that._super(opt, function (arg, data) {
                var dataArr = [];
                for (var i = 0; i < result.xAxisData.length; i++) {
                    dataArr.push({ name: result.xAxisData[i], value: data[i] });
                }
                return {
                    name: arg.title,
                    type: 'map',
                    mapType: 'china',
                    itemStyle: {
                        normal: { label: { show: true } },
                        emphasis: { label: { show: true } }
                    },
                    data: dataArr
                }
            });
        }
    });
    //cmd support
    if (typeof define === 'function' && define.amd) {
        define('sdltool', ["sdlbase"], function () {
            return sdltool;
        });
    }
}).call(this);

