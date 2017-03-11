

var TimeTab = function (config, callbackFn, controller) {

    controller || (controller = window);
    var callbackFn = callbackFn, controller = controller;
    var __config = {
        selDay: true,
        selMonth: false,
        selW: false,
        selQ: false,
        sely: false,
        singeClick: false,
        maxMonthInterval: 100,   //最大日期间隔（单位：月），用于选择月份和日期时的校验
        beginDate: null,
        endDate: null,
        calView: false,
        cal: "show",
        current: -1,
        hourMark: 7,
        offday: -1,
        currentDate: null,
        minDate: "20140101",
        maxDate: "20201231",
        maxDate1: "",
        maxDate2: "",
        initYear: 0,
        initMonth: 0,
        initDay: 0,
        isTab: true,
        tabs: [{
            text: "按天",
            dfix: 1,
            datetype: 2,
            isdefault: true
        }, {
            text: "按周",
            dfix: 7,
            datetype: 2
        }, {
            text: "按月",
            dfix: 30,
            datetype: 2
        }]
        ,
        tabs_Day: [{
            text: "近7天",
            dfix: 7,
            datetype: 1,
            isdefault: true
        }, {
            text: "近30天",
            dfix: 30,
            datetype: 1
        }, {
            text: "近90天",
            dfix: 90,
            datetype: 1
        }]
    };
    __config = $.extend(false, __config, config);


    SetConfig = function (c) {
        __config = $.extend(false, __config, c);
    },
    GetConfig = function () {
        return __config;
    },
    getNow = function () {
        return new Date();
    },
    initPeriodSelector = function () {
        //if (this.config.periodSelector) {
        $("#timeTab_box").append('<div id="period_selector" class="combo_box"></div>');
        //this.createPeriodSelector();
        //}
    },
    SetDateType = function (_selectType) {
        _selectType || (_selectType = "calMonth");
        var v = "";
        if (_selectType == "calMonth") {
            v = "2";
            //document.getElementById("timeTab_box_DateType").value = "2";
        }
        else {
            v = "1";
            //document.getElementById("timeTab_box_DateType").value = "1";
        }
        if (document.getElementById("timeTab_box_DateType")) {
            document.getElementById("timeTab_box_DateType").value = v;
        }
    }
    ,
    switchDateView2 = function (d) {
        var e = $("#timeTab_box");

        $("#timeTab_box div.caltab a").each(function () {
            $(this).attr("rel") != d ? $(this).hide() : $(this).show();
        });

        switchDateView(d);

    }
    switchDateView = function (d) {
        $("#timeTab_box div.caltab a").each(function () {
            if ($(this).attr("rel") != d) {
                $(this).removeClass("sel");
                $(this).addClass("first")
            } else {
                $(this).removeClass("first");
                $(this).addClass("sel")
            }
        });
        //保存日期类型    add By djs  2012-09-19
        //SetDateType(d);

        if (d == "calDay") {
            var width = 480;
            //$("#calSel .lzCalSel").width(500);
            $("#calSel .lzCalSel").width(width);
            $("#calForm").width(width - 2);
            $("#calTwo").show().removeAttr("count");
            $("#calW").hide();
            $("#calOne").hide();
            //$("#calTwo").hide();
            $("#caly").hide();
            $("#calQ").hide();
            $("#calForm .calSelInput").hide();
        }
        else if (d == "calW") {
            var width = 480;
            //$("#calSel .lzCalSel").width(500);
            $("#calSel .lzCalSel").width(width);
            $("#calForm").width(width - 2);
            $("#calW").show().removeAttr("count");
            $("#calOne").hide();
            $("#calTwo").hide();
            $("#caly").hide();
            $("#calQ").hide();
            $("#calForm .calSelInput").hide();
        }
        else if (d == "calMonth") {
            var width = 295;
            //$("#calSel .lzCalSel").width(500);
            $("#calSel .lzCalSel").width(width);
            $("#calForm").width(width - 2);
            $("#calOne").show().removeAttr("count");
            $("#calW").hide();
            $("#calTwo").hide();
            $("#caly").hide();
            $("#calQ").hide();
            $("#calForm .calSelInput").hide();
        } else if (d == "calQ") {
            var width = 295;
            //$("#calSel .lzCalSel").width(500);
            $("#calSel .lzCalSel").width(width);
            $("#calForm").width(width - 2);
            $("#calQ").show().removeAttr("count");
            $("#calOne").hide();
            $("#calW").hide();
            $("#caly").hide();
            $("#calTwo").hide();
            $("#calForm .calSelInput").hide();
        } else if (d == "caly") {
            var width = 295;
            //$("#calSel .lzCalSel").width(500);
            $("#calSel .lzCalSel").width(width);
            $("#calForm").width(width - 2);
            $("#caly").show().removeAttr("count");
            $("#calOne").hide();
            $("#calW").hide();
            $("#calTwo").hide();
            $("#calQ").hide();
            $("#calForm .calSelInput").hide();
        } else {
            var width = 480;
            //$("#calSel .lzCalSel").width(660);
            $("#calSel .lzCalSel").width(width);
            $("#calForm").width(width - 2);
            $("#calOne").hide();
            $("#calW").hide();
            $("#caly").hide();
            $("#calQ").hide();
            $("#calTwo").show().jCalReset($("#timeperiod_start").text(), $("#timeperiod_end").text());
            $("#calForm .calSelInput").show();
        }
        //showPopup();
        $("#calSel").attr("rel", d);
        $("#lz_comparisonError").hide()
    },
    createCal = function (d, e) {
        if (!(__config.cal == undefined || __config.cal == "none")) {
            if (!(d == null || e == null)) {
                $("#timeperiod").html('<span id="timeperiod_start">' + d + '</span><span>\u81f3</span><span id="timeperiod_end">' + e + "</span>");

                if (__config.calView) {
                    //if (this.calView) {
                    SetConfig({ beginDate: d, endDate: e });
                    $("#calW").find("a:not(.disable)").each(function () {
                        d >= $(this).attr("st") && d <= $(this).attr("en") || e >= $(this).attr("st") && e <= $(this).attr("en") || d < $(this).attr("st") && e > $(this).attr("en") ? $(this).addClass("selected") : $(this).removeClass("selected")
                    })

                    $("#calOne").find("a:not(.disable)").each(function () {
                        d >= $(this).attr("st") && d <= $(this).attr("en") || e >= $(this).attr("st") && e <= $(this).attr("en") || d < $(this).attr("st") && e > $(this).attr("en") ? $(this).addClass("selected") : $(this).removeClass("selected")
                    })

                    $("#caly").find("a:not(.disable)").each(function () {
                        d >= $(this).attr("st") && d <= $(this).attr("en") || e >= $(this).attr("st") && e <= $(this).attr("en") || d < $(this).attr("st") && e > $(this).attr("en") ? $(this).addClass("selected") : $(this).removeClass("selected")
                    })

                    $("#calMonth").find("a:not(.disable)").each(function () {
                        d >= $(this).attr("st") && d <= $(this).attr("en") || e >= $(this).attr("st") && e <= $(this).attr("en") || d < $(this).attr("st") && e > $(this).attr("en") ? $(this).addClass("selected") : $(this).removeClass("selected")
                    });

                    $("#calQ").find("a:not(.disable)").each(function () {
                        ((d >= $(this).attr("st") && d <= $(this).attr("en") || e >= $(this).attr("st") && e <= $(this).attr("en") || d < $(this).attr("st") && e > $(this).attr("en")) ? $(this).addClass("selected") : $(this).removeClass("selected"));
                    });


                } else {
                    var f = __config.minDate,
                        g = __config.maxDate;

                    f = new Date(f.substring(0, 4) + "/" + f.substring(4, 6) + "/" + f.substring(6));
                    g = new Date(g.substring(0, 4) + "/" + g.substring(4, 6) + "/" + g.substring(6));
                    //alert(__config.maxDate);


                    f.getDate() !== 1 && f.setMonth(f.getMonth() + 1);
                    var fy = j = f.getFullYear();
                    f = f.getMonth() + 1;
                    (new Date(g.getFullYear(), g.getMonth(), g.getDate() + 1)).getDate() !== 1 && g.setMonth(g.getMonth() - 1);
                    var ly = l = g.getFullYear();
                    g = g.getMonth() + 1;
                    //g = g.getMonth();//+ 1;

                    if (__config.current == -1) {
                        stDateArr = d.split("-");
                        enDateArr = e.split("-");
                        var o = new Date(stDateArr[0] + "/" + stDateArr[1] + "/" + stDateArr[2]), n = o.getFullYear();
                        o = o.getMonth() + 1;
                        var r = new Date(enDateArr[0] + "/" + enDateArr[1] + "/" + enDateArr[2]), h = r.getFullYear();
                        r = r.getMonth() + 1
                    }
                    var firstd = f, lastd = new Date(stDateArr[0] + "/" + stDateArr[1] + "/" + stDateArr[2]);

                    var dayOrMonth = $('.time_selector dd.current a').text();
                    var dateType = $('.time_selector dd.current a').attr('datetype');
                    //显示周选择模块
                    if (__config.selW) {
                        j = AddDate(getNow(), __config.offday);

                        $("#calW").jCal({
                            day: j,
                            showMonths: 3,
                            dayOffset: 1,
                            maxDayInterval: __config.maxMonthInterval * 30,
                            st_date: $("#timeperiod_start").text(),
                            en_date: $("#timeperiod_end").text(),
                            min_date: __config.minDate,
                            max_date: __config.maxDate//$.jCal.formatDate(j, true)
                        }, true);
                        $(".caltab").css("display", "none");

                        $('.caltab a[rel=calW]').show();
                        if (dateType == 2 && dayOrMonth == '周查询') { $('.caltab a[rel=calMonth]').hide(); $("#timeTab_box div.caltab a[rel=calW]").trigger("click"); }
                        else if (dateType == 2 && dayOrMonth != '周查询') { $('.caltab a[rel=calW]').hide(); $("#timeTab_box div.caltab a[rel=calDate]").trigger("click"); }

                        hidePopup();
                    }
                    var miny = cy = parseInt(__config.minDate.substring(0, 4), 10);
                    //显示月选择模块
                    if (__config.selMonth) {
                        //var miny = cy = ly - 6;

                        for (var k = '<table  cellspacing="0" border="0" width="100%">', m = miny; m <= l; m++) {
                            k += '<tr><td class="year"><span>' + m + "</span></td>";
                            for (var q = 1; q <= 12; q++) {
                                var p = false;
                                m < n || m > h || m == n && q < o || m == h && q > r || (p = true);
                                var s = new Date(m, q, 1);
                                s.setDate(s.getDate() - 1);
                                var t = q < 10 ? "0" + q : q,
                                    u = m == j && q < f || m == l && q > g || (m < fy || m > ly);

                                var st = m + "-" + t + "-01";
                                var en = m + "-" + t + (s.getDate() < 10 ? "-0" + s.getDate() : "-" + s.getDate());
                                if (StringToDate(en) > lastd) {
                                    //en = DateToString(GetLastDateInMonth(AddDate(StringToDate(en), -1, DatePart.Month)));
                                    //en = m + "-" + t + (s.getDate() < 10 ? "-0" + s.getDate() : "-" + s.getDate());
                                }

                                ulastd = GetLastDateInMonth(AddDate(lastd, 0, DatePart.Month));
                                u = (StringToDate(st) <= ulastd && StringToDate(en) >= firstd) ? false : u;
                                u = (StringToDate(en) > ulastd) ? true : u;

                                k += "<td " + (q == 12 ? 'class="last"' : "") + '><a href="javascript:void(0)" class="' + (u ? "disable " : "") + ((!u && this.current == -1 && p) ? " selected" : "") + '" st="' + st + '" en="' + en + '">' + t + "</a></td>";
                            }
                            k += "</tr>"
                        }
                        k += "</table>";
                        $("#calOne").html(k);
                        $(".caltab").css("display", "none");
                    }
                    if (__config.selQ) {
                        //var miny = cy = ly - 6;
                        cy = miny;

                        for (var k = '<table  cellspacing="0" border="0" width="100%">', r = 1; r <= 7; r++) {
                            if (cy > ly) break;
                            k += '<tr><td class="year"><span>' + cy + "</span></td>";
                            for (var q = 1; q <= 4; q++) {
                                var sm = q * 3 - 2;
                                var s = new Date(cy, sm, 1);
                                var st = cy + "-" + (sm >= 10 ? sm : "0" + sm) + "-" + "01", en = "";//new Date((cy + parseInt((q * 3 + 1) / 12)) + "/" + ((q * 3 + 1) % 12) + "/" + "01");
                                switch (q) { case 1: en = cy + "-03-31"; break; case 2: en = cy + "-06-30"; break; case 3: en = cy + "-09-30"; break; case 4: en = cy + "-12-31"; break; }

                                var p = false, m = cy;
                                m < n || m > h || m == n && sm < o || m == h && sm > r || (p = true);

                                //u = cy == j && sm < f || cy == l && sm > g;
                                u = m == j && sm < f || m == l && sm > g || (cy < fy || cy > ly);
                                u = (StringToDate(en) > lastd) ? true : u;

                                k += "<td " + '><a href="javascript:void(0)" class="' + (u ? "disable " : "") + ((!u && this.current == -1 && p) ? " selected" : "") + '" st="' + st + '" en="' + en + '">' + "Q" + q + "</a></td>";
                            }
                            k += "</tr>"
                            cy++;
                        }
                        k += "</table>";
                        $("#calQ").html(k);
                        $(".caltab").css("display", "none");
                    }
                    if (__config.sely) {
                        //var miny = cy = ly - 5 * 4 + 1;
                        //var lasty = GetLastDateInYear(AddDate(lastd, -11, DatePart.Month)).getFullYear();
                        var lasty = miny, cy = miny;

                        for (var k = '<table  cellspacing="0" border="0" width="100%">', r = 1; r <= 4; r++) {
                            k += '<tr>';
                            if (cy > ly) break;
                            for (var q = 1; q <= 5; q++) {
                                u = (cy < fy || cy > ly);
                                u = ((cy > lasty) ? true : u);
                                //alert(cy.toString() +"_" + lasty.toString() + u.toString());
                                //k += "<td " + '><a href="javascript:void(0)" class="' + (u ? "disable " : "") + ((!u && this.current == -1) ? " selected" : "") + '" st="' + cy + "-" + '01' + '-' + '01" en="' + cy + "-" + "12" + "-" + "31" + '">' + cy + "</a></td>"
                                k += "<td " + '><a href="javascript:void(0)" class="' + (u ? "disable " : "") + ((!u && lasty == cy) ? " selected" : "") + '" st="' + cy + "-" + '01' + '-' + '01" en="' + cy + "-" + "12" + "-" + "31" + '">' + cy + "</a></td>"
                                cy++;
                            }
                            k += "</tr>"
                        }
                        k += "</table>";
                        $("#caly").html(k);
                        $(".caltab").css("display", "none");
                    }
                    //显示天选择模块
                    if (__config.selDay) {
                        j = AddDate(getNow(), __config.offday);
                        $("#calTwo").jCal({
                            day: j,
                            showMonths: 3,
                            dayOffset: 1,
                            maxDayInterval: __config.maxMonthInterval * 30,
                            st_date: $("#timeperiod_start").text(),
                            en_date: $("#timeperiod_end").text(),
                            min_date: __config.minDate,
                            max_date: __config.maxDate//$.jCal.formatDate(j, true)
                        }, true);
                        $(".caltab").css("display", "none");
                    }
                    //if (__config.selDay && __config.selMonth) {
                    $(".caltab").css("display", "block");
                    //}
                    SetConfig({ calView: true });
                }
            }
        }
    },
    setInitDate = function (d, e) {
        if (e == 1) {
            initYear = d - 1;
            initMonth = 12
        } else {
            initYear = d;
            initMonth = e - 1
        }
        initDay = 1;
    },
    setDate = function (d, sd, ed) {
        if (sd && ed) {
            var e = ed.split("-");
            //            if (e[2] && e[2] == "01") {
            //                e = new Date(e[0], parseInt(1 * e[1]), 1);
            //                e.setDate(e.getDate() - 1);
            //                ed = "" + e.getFullYear() + (e.getMonth() + 1 < 10 ? "-0" + (e.getMonth() + 1) : "-" + e.getMonth()) + (e.getDate() < 10 ? "-0" + e.getDate() : "-" + e.getDate())
            //            }
            $("#timeperiod_start").text(sd);
            $("#timeperiod_end").text(ed);
            SetConfig({ beginDate: sd, endDate: ed });
            return;
        }
        d = __config.current;
        var e = getDate(d, isBeforeHourMark());
        if (e.length > 1 && e[0] != "" && e[1] != "") {
            SetConfig({ beginDate: e[0], endDate: e[1] });
            $("#timeperiod_start").text(e[0]);
            $("#timeperiod_end").text(e[1]);
        }
    },
    initCal = function () {
        //if (!(this.cal === undefined || this.cal == "none" || this.config.periodSelector)) {
        if (!(__config.cal === undefined || __config.cal == "none")) {
            drawCal();
            createCal(__config.beginDate, __config.endDate);
            var d = this;
            $("#timemenu").click(function (e) {
                if (!$(this).attr("readOnly")) {
                    var f = $("#timeperiod_start").text(),
                        g = $("#timeperiod_end").text();
                    //d.createCal(f, g);
                    //d.togglePopup();
                    createCal(f, g);
                    togglePopup();
                    e.stopImmediatePropagation();
                }
            }).mouseover(function () {
                $(this).attr("readOnly") || $(this).attr("on") || $(this).addClass("timer_selector_on")
            }).mouseout(function () {
                $(this).attr("readOnly") || $(this).attr("on") || $(this).removeClass("timer_selector_on")
            });
            $("#lz_CalCompSubmit").click(function () {
                var e = $("#calSel").attr("rel"), f, g;

                if (e == "calW") {
                    //f = $("#calW table a.selected:first").attr("st");
                    //g = $("#calW table a.selected:last").attr("en")

                    f = $.trim($("#lz_comparisonStartDate").val());
                    g = $.trim($("#lz_comparisonEndDate").val());
                }
                else if (e == "calQ") {
                    f = $("#calQ table a.selected:first").attr("st");
                    g = $("#calQ table a.selected:last").attr("en")
                }
                else if (e == "caly") {
                    f = $("#caly table a.selected:first").attr("st");
                    g = $("#caly table a.selected:last").attr("en")
                }
                else if (e == "calMonth") {
                    f = $("#calSel table a.selected:first").attr("st");
                    g = $("#calSel table a.selected:last").attr("en")
                } else if (e == "calDate") {
                    f = $.trim($("#lz_comparisonStartDate").val());
                    g = $.trim($("#lz_comparisonEndDate").val());
                }
                if (!f || !g) {
                    $("#lz_comparisonError").html("抱歉，您还未选择日期！").show();
                }
                else !CheckDate(f) || !CheckDate(g) ? $("#lz_comparisonError").html("\u62b1\u6b49\uff0c\u60a8\u8f93\u5165\u7684\u65e5\u671f\u683c\u5f0f\u6709\u8bef\uff0c\u6b63\u786e\u683c\u5f0f\u4e3ayyyy-mm-dd").show() : calSubmit(f, g, e)
            });
            $("#lz_CalCompCancel").click(function () {
                $("#lz_comparisonError").html("").hide();
                hidePopup();
            })
        }
    },
    calSubmit = function (d, e, f) {
        d = adjustDate(d);
        e = adjustDate(e);
        Date.parse(e.replace(/-/g, "/"));
        Date.parse(d.replace(/-/g, "/"));
        if (f == "calDate") {
            var maxDayInterval = __config.maxMonthInterval * 30;
            if ($.jCal.DateDiff(d, e) > maxDayInterval) {
                $("#lz_comparisonError").html("请将查询区间设置在" + maxDayInterval.toString() + "天之内").show();
                return
            }
        } else if (!ifMonthLess(d, e, __config.maxMonthInterval)) {
            $("#lz_comparisonError").html("本页面只能查询" + __config.maxMonthInterval.toString() + "个月以内的数据").show();
            return
        }
        $("#lz_comparisonError").hide();
        //if ($('.time_selector dd.current a').attr('datetype') == 1) {
        //    //清除日期快捷方式选择状态
        //    $(".time_selector dd[class='current']").removeClass('current');
        //}
        hidePopup();
        $("#timeperiod").html('<span id="timeperiod_start">' + d + '</span><span>\u81f3</span><span id="timeperiod_end">' + e + "</span>");
        $("#timeTab_box li").removeClass("timetab_active");
        __config.current = -1;
        SetConfig({ beginDate: d, endDate: e });

        //保存日期类型    add By djs  2012-09-19
        //SetDateType($(".caltab a[class='sel']").attr('rel'));

        //执行数据查询回调函数
        callbackFn && callbackFn.call(controller, d, e);
    },
    setClick = function (flag) {
        SetConfig({ singeClick: flag });
    },
    adjustDate = function (d, e) {
        var f = d.split(e === undefined ? "-" : e);
        return f.length == 3 ? f[0] + "-" + (f[1].length < 2 ? "0" : "") + f[1] + "-" + (f[2].length < 2 ? "0" : "") + f[2] : null;
    },
    clickHidePopup = function (d) {
        $(d.target).parents("#calSel").length == 0 && d.target.id != "calSel" && d.target.className != "left" && d.target.className != "right" && hidePopup();
    },
    adjustCalPos = function () {
        var d = $("#timemenu"),
        e = d.position(),
        f, g = 0;
        //f = e.top + d.outerHeight(false) - 2;
        //g = e.left + d.outerWidth(false) - $("#calSel").outerWidth(false);
        f = e.top + d.outerHeight() + 3;
        g = e.left;
        $("#calSel").css("top", f).css("left", g);
        //        g = e.left + d.outerWidth();
        //        $("#calSel").css("top", f);
    },
    showPopup = function () {
        $("#calSel").show();
        //设置日期选中
        //if ($("#timeTab_box_DateType").val() == "2") {
        var month = $("#calSel table a");
        var length = month.length;
        var sd = __config.beginDate, ed = __config.endDate;
        for (j = 0; j < length; j++) {
            var l = $(month[j]).attr("st"), c = $(month[j]).attr("class");
            //如果月份是禁用状态，则不做任何处理，进入下一循环
            if (c.toString().indexOf("disable") > -1) continue;
            l < sd || l > ed ? $(month[j]).removeClass("selected") : $(month[j]).addClass("selected")
        }
        //}
        adjustCalPos();
        $("body").bind("click", this, clickHidePopup);
        $("#timemenu").attr("on", 1);
    },
    hidePopup = function () {
        $("#calSel").hide();
        $("#timemenu").removeAttr("on").removeClass("timer_selector_on");
        $("body").unbind("click", clickHidePopup);
    },
    togglePopup = function () {
        if ($("#calSel").css("display") == "none") {
            var d = $("#calSel").attr("rel");
            //d || (d = "calMonth");
            if (d == null) {
                d = 'calDate';
            }
            $("#timeTab_box div.caltab a[rel=" + d + "]").trigger("click");
            showPopup()
        } else {
            hidePopup();
        }
    },
    drawCal = function () {
        var d = [];
        d[d.length] = '<dd>';
        if (__config.cal == "readOnly") {
            d[d.length] = '<div class="timer_selector" style="width:180px;cursor:auto"><span id="timeperiod2" class="time"></span></div>';
            d[d.length] = '<div id="timemenu" class="timer_selector" style="display:none">'
        } else {
            d[d.length] = '<div id="timemenu" class="datepickercontainer">';
        }
        d[d.length] = '<span id="timeperiod" class="fn-left"></span>';
        d[d.length] = '<i></i>';
        d[d.length] = "</div>";
        d[d.length] = '<div id="calSel" class="calMain">';
        //d[d.length] = '<div class="caltab"><a href="javascript:;" rel="calMonth" class="first">按月查看</a><a href="javascript:;" rel="calDate">按天查看</a></div>';
        d[d.length] = '<div class="caltab">';
        //if (__config.selW) {
        //    d[d.length] = '<a href="javascript:;" rel="calW" class="first">周查看</a>';
        //}
        if (__config.selQ) {
            d[d.length] = '<a href="javascript:;" rel="calQ" class="first">按季查看</a>';
        }
        if (__config.sely) {
            d[d.length] = '<a href="javascript:;" rel="caly" class="first">按年查看</a>';
        }
        if (__config.selMonth) {
            d[d.length] = '<a href="javascript:;" rel="calMonth" class="first">按月查看</a>';
        }
        if (__config.selDay) {
            d[d.length] = '<a href="javascript:;" rel="calDate">按天查看</a>';
        }
        d[d.length] = '</div>';
        d[d.length] = '<div class="lzCalSel">';
        //if (__config.selW) {
        //    d[d.length] = '<div id="calW" class="lzCalW"></div>';
        //}
        if (__config.selQ) {
            d[d.length] = '<div id="calQ" class="lzCalQ"></div>';
        }
        if (__config.sely) {
            d[d.length] = '<div id="caly" class="lzCaly"></div>';
        }
        if (__config.selMonth) {
            d[d.length] = '<div id="calOne" class="lzCalOne"></div>';
        }
        if (__config.selDay) {
            d[d.length] = '<div id="calTwo" class="lzCalTwo"></div>';
        }
        d[d.length] = '<div id="calForm" class="lzCalForm" width="100%">';
        d[d.length] = '<div class="lzCalError" name="lz_comparisonError" id="lz_comparisonError"></div>';
        d[d.length] = '<div class="calSelInput"><div style="font-size:13px; font-weight:bold;margin:2px 0px 0px 0;; float: left;">日期范围：</div>';
        d[d.length] = '<div style="float: left;"><input type="text" id="lz_comparisonStartDate" name="lz_comparisonStartDate" maxlength="10" class="lzCalInput" readOnly="true" />';
        d[d.length] = '&nbsp;\u81f3&nbsp;<input type="text" id="lz_comparisonEndDate" name="lz_comparisonEndDate" maxlength="10" class="lzCalInput" readOnly="true" /></div></div>';
        d[d.length] = '<div style="float:right;"><input style="margin-right:10px" type="button" name="lz_CalCompSubmit" id="lz_CalCompSubmit" value="\u786e\u5b9a" class="btn1"/><input type="button" id="lz_CalCompCancel" name="lz_CalCompCancel" value="\u53d6\u6d88"  class="btn1"/>';
        d[d.length] = '</div>';
        d[d.length] = '</div><div class="c"></div></div></div>';
        d[d.length] = '</dd>';

        var e = $("#timeTab_box");

        // 日历控件中tab页切换事件
        e.append(d.join("")).find("div.caltab a").bind("click", function () {
            var $this = $(this);
            switchDateView($this.attr("rel"));
            $this.blur();

            return false
        });
        e.find(".expand").bind("click", function () {
            togglePopup();
            return false
        });

        if (__config.defaulttab != "") {
            //switchDateView2(__config.defaulttab);
        }

        $("#lz_comparisonStartDate,#lz_comparisonEndDate").bind("focus", function () {
            $(this).addClass("focus")
        }).bind("blur", function () {
            $(this).removeClass("focus")
        }
);
    },
    initDiv = function () {
        //$("#_timetab").append("<div class='timeTab_box_normal' id='timeTab_box'></div>");
        $("#_timetab").html("<div class='timeTab_box_normal' id='timeTab_box'></div>");
    },
    listen = function () {
        var d = this;
        $("#timeTab_box li a").live("click", function (e) {
            e = $(e.target.parentNode);
            $("#timeTab_box li").removeClass("timetab_active");
            e.addClass("timetab_active");
            //d.tabToggle(e.attr("index"))
            tabToggle(e.attr("index"))
        })
    },
    bindEvents = function () {
        var d = this;
        $("#calSel a:not(.disable)").on("click", function () {
            var e = $(this).attr("st"),
                f = $("#calSel table a:not(.disable)"),
                g = $("#calSel table a.selected"), j;
            j = $("#calOne").attr("count");

            //var datetype = $('.time_selector dd.current a').attr('datetype');
            var dayOrMonth = $('.time_selector dd.current a').text();
            //if (datetype == 2) {
            if (__config.singeClick) {
                f.removeClass("selected");
                $(this).addClass("selected");
                $("#calOne").removeAttr("count");
                $("#lz_comparisonError").hide();
                return false;
            }

            if (!j || g.length == 0) {
                f.removeClass("selected");
                $(this).addClass("selected");
                $("#calOne").attr("count", 1);
                $("#lz_comparisonError").hide();
                return false
            }
            if (j == 1) {
                g = $(g[0]).attr("st");
                if (g > e) {
                    j = g;
                    g = e;
                    e = j
                }
                for (j = 0; j < f.length; j++) {
                    var l = $(f[j]).attr("st");
                    l < g || l > e ? $(f[j]).removeClass("selected") : $(f[j]).addClass("selected")
                }
                g = $("#calSel table a.selected");
                $("#calOne").removeAttr("count");
                //验证模块
                if (g.length > __config.maxMonthInterval) {
                    $("#lz_comparisonError").html("本页面只能查询" + __config.maxMonthInterval.toString() + "个月以内的数据").show();
                    return
                }
                $("#lz_comparisonError").html("");
                //if (g.length < 6) $("#lz_comparisonError").html("查询时间段最小为6个月").show();
                return false
            }
        })
    },
    getDate = function (d, e) {
        if (d < 0 || d > __config.tabs.length - 1) return ["", ""];
        if (__config.tabs[d].pfix) return this.getDateByPeriod(__config.tabs[d].pfix, getNow());
        var f = __config.tabs[d].dfix,
        g = 0,
        //j = this.config.dayOffset ? parseInt(this.config.dayOffset) : 0,
        j = 0,
        l = "",
        o = "";
        if (j != 0) {
            g += j;
            o = getDateStrByOffset(g);
            l = getDateStrByOffset(g + parseInt(1 * f))
        } else {
            if (e) g = 1;
            g++;
            o = getNow();
            j = new Date;

            o = getDateStrByOffset(g, "-", j);
            l = getDateStrByOffset(g - 1 + parseInt(f), "-", j)
        }
        return [l, o];
    },
    isBeforeHourMark = function (d) {
        var e = getNow().getHours();
        d = Date.parse(d ? d : getDateStrByOffset(1, "/"));
        var f = "";
        return "" != f ? f < d : e < __config.hourMark;
    },
    disableCal = function (d) {
        //if (!(runMode.indexOf("online") < 0)) {
        if (cal == "show" && d || cal == "readOnly") {
            //$("span#timeperiod2").length == 0 && $("#timeTab_box").append('<div class="timer_selector" style="width:180px;cursor:auto"><span id="timeperiod2" class="time"></span></div>');
            //$("span#timeperiod2").parent().show();
            $("#timemenu").hide();
            createCal();
        } else {
            $("#timemenu").show();
            //$("span#timeperiod2").parent().hide();
        }
        //}
    },
    tabToggle = function (d) {
        //var e = this.getClientParam("dt");
        __config.current = parseInt(d);
        var f = getDate(current, isBeforeHourMark());
        if (f.length > 1 && f[0] != "" && f[1] != "") {
            SetConfig({ beginDate: f[0], endDate: f[1] });
        }
        //this.funcCall && this.funcCall();
        createCal();
    },
    drawTabs = function () {
        var selDay = __config.selDay, tabType = 2, e = "", ed, y, m, lastMonthDate, d;

        if (selDay) {
            d = __config.tabs_Day;
            //结束日期取前一天的日期
            lastMonthDate = AddDate(new Date(), __config.offday);
            ed = DateToString(lastMonthDate);
            tabType = 1;
        }
        else {
            d = __config.tabs;
            ////结束日期取上个月的最后一天 开始日期以上个月为基准往前推若干个月（若干值为标签对应的数值）
            //lastMonthDate = GetLastDateInMonth(AddDate(AddDate(getNow(), __config.current), -1, DatePart.Month));
            lastMonthDate = AddDate(new Date(), __config.offday);
            ed = DateToString(lastMonthDate);
            tabType = 2;
        }
        var dateArray = ed.split("-");
        y = parseInt(dateArray[0]);
        m = parseInt(1 * dateArray[1]);

        var l = d.length;
        for (var i = 0; i < l; i++) {
            var tab = d[i], dfix = tab.dfix, isdefault = tab.isdefault, currentClass = (isdefault ? ' class="a-org" ' : '')
                , text = tab.text, sd = '', display = (tab.notdisplay ? ' style="display:none;" ' : '');
            //按月
            if (!selDay) {
                //sd = DateToString(GetFristDateInMonth(AddDate(lastMonthDate, -dfix + 1, DatePart.Month)));
                if (text == '按天') {
                    sd = DateToString(AddDate(lastMonthDate, -dfix + 1));
                }
                else if (text == '按周') {
                    //暂时不处理
                    sd = DateToString(AddDate(lastMonthDate, -dfix + 1));
                }
                else if (text == '按月') {
                    // 上个月第一天
                    sd = DateToString(GetFristDateInMonth(AddDate(lastMonthDate, __config.offday, DatePart.Month)));
                    // 上个月最后一天
                    ed = DateToString(GetLastDateInMonth(AddDate(AddDate(getNow(), __config.current), -1, DatePart.Month)));
                }
            }
                //按天
            else {
                sd = DateToString(AddDate(lastMonthDate, -dfix + 1));
            }

            e += '<dd ' + currentClass + display + '>';
            e += '<a href="###" params="' + sd + ',' + ed + '" datetype="' + tabType + '">' + text + '</a>';
            e += '</dd>';
            e += ((i < l - 1) && !display) ? '<dd class="seperate">|</dd>' : '';



            /*
            e += '<a href="#" ' + currentClass + '">' + text + '</a>';
            e += ((i < l - 1) && !display) ? '<span class="line">|</span>' : '';
            <span id="date" class="chioce">
            <a data-value="1" href="#" class="a-org">按日</a>
            <span class="line">|</span>
            <a data-value="2" href="#">按周</a><span class="line">|</span><a data-value="3" href="#">按月</a></span>

            e += '<dd ' + currentClass + display + '>';
            e += '<a href="###" params="' + sd + ',' + ed + '" datetype="' + tabType + '">' + text + '</a>';
            e += '</dd>';
            e += ((i < l - 1) && !display) ? '<dd class="seperate">|</dd>' : '';
            */
            if (isdefault) {
                SetConfig({ beginDate: sd, endDate: ed });
            }
        }
        //增加隐藏域，记录当前日期选择模式为日还是月 =1：日    =2：月    (id=timeTab_box_DateType)
        //e += '<input type="hidden" id="timeTab_box_DateType" value="' + tabType + '" />';
        return e;
    },
    drawBox = function () {
        var me = this;

        if (__config.isTab) {
            var d = "";
            d += '<div class="time_selector">' + drawTabs() + '</div>';
            //d += '<span class="chioce">' + drawTabs() + '</span>';
            //$("#timeTab_box").append('<div class="clearfloat"></div>');
            $("#timeTab_box").empty().append(d);
        }

        $(".time_selector > dd").not(".seperate").on("click", function (e) {
            StopDefaultEvent(e);
            if (!$(this).attr("class") || $(this).attr("class") != "current") {
                $(".time_selector > dd[class='current']").removeClass();
                $(this).addClass("current");
                var date = $(this).find('a').attr("params").split(",");
                if (date && date.length == 2) {
                    setDate(-1, date[0], date[1]);
                }
                var selectType = '', datetype = $(this).find('a').attr('datetype');
                if (datetype == 1) {
                    selectType = 'calDate';
                }
                else if (datetype == 2) {
                    selectType = 'calMonth';
                }
                $("#calSel").attr("rel", selectType);

                //SetDateType(selectType);
                //执行数据查询回调函数
                controller || (controller == window)
                callbackFn && callbackFn.call(controller, date[0], date[1]);

                var dayOrMonth = $('.time_selector dd.current a').text();
                //if (dayOrMonth == "按天查询" && __config.selDay == true) { switchDateView2("calDate"); }
                //else if (dayOrMonth == "周查询" && __config.selW == true) { switchDateView2("calW"); }
                //else if (dayOrMonth == "按月查询" && __config.selMonth == true) { switchDateView2("calMonth"); }
                //else if (dayOrMonth == "季度查询" && __config.selQ == true) { switchDateView2("calQ"); }
                //else if (dayOrMonth == "年度查询" && __config.sely == true) { switchDateView2("caly"); }
            }
        });
    },
    getDateStrByOffset = function (d, e, f) {
        e = e === undefined ? "-" : e;
        if (f === undefined || typeof f !== "object") f = getNow();
        var g = new Date;
        g.setTime(f.valueOf() - 864E5 * d);
        d = g.getFullYear();
        f = g.getMonth() + 1;
        g = g.getDate();
        return d + e + (f < 10 ? "0" + f : f) + e + (g < 10 ? "0" + g : g);
    }

    this.SetConfig1 = function (option) {
        __config = $.extend(false, __config, option);
    }
    this.init = function (_start, _end) {
        this.setClick = setClick;
        $.switchDateView2 = switchDateView2;
        if (_start && _end) {
            //对结束日期进行处理
            var e = _end.split("-");
            if (e[2] && e[2] == "01") {
                e = new Date(e[0], parseInt(e[1]), 1);
                e.setDate(e.getDate() - 1);
                _end = DateToString(e);
            }
            SetConfig({ beginDate: _start, endDate: _end });
        }

        var d = (new Date).getTime();
        //var maxDate = DateToString(GetFristDateInMonth(AddDate(getNow(), __config.offday + 1))).replace(/-/g, "");
        var maxDate = getDateStrByOffset(1, "");

        SetConfig({ currentDate: DateToString(AddDate(getNow(), __config.offday)), maxDate: maxDate, maxDate1: getDateStrByOffset(1, ""), maxDate2: getDateStrByOffset(2, "") });
        initDiv();
        setDate();
        drawBox();
        initCal();
        $("#timeTab_box").append('<div class="clearfloat"></div>');
        //initPeriodSelector();
        bindEvents();
        $('.time_selector').css('display', 'none');
        $('.time_selector dd:eq(0)').trigger("click");
        $("#timeTab").show();
        $("#timemenu").show();
        $("#timeperiod").data('singeClick', __config.singeClick);
        //执行数据查询回调函数
        callbackFn && callbackFn.call(controller, __config.beginDate, __config.endDate);
    }
};

var DatePart = { 'Year': 'y', 'Month': 'm', 'Day': 'd' },
            CheckDate = function (date) {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
                var e = new Date(date.replace(/\-/g, "/"));
                if (date != $.jCal.formatDate(e)) { return false; }
                return true;
            },
            /*
            datepart
            'd'：增加天
            'm'：增加月份
            'y'：增加年
            number
            为负值则为减少
            */
            AddDate = function (date, number, dp) {
                dp = dp || DatePart.Day;
                switch (dp) {
                    case DatePart.Month:
                        var y = date.getFullYear(), m = date.getMonth() + 1 + number, d = date.getDate(), d1;
                        if (m <= 0) {
                            y += parseInt(m / 12) - 1;
                            m = 12 + m % 12;
                        }
                        else {
                            y += parseInt(m / 12);
                            m = m % 12;
                        }
                        d1 = (new Date(y, m, 0)).getDate();
                        //如果当月天数小于待处理的日期天数
                        if (d1 < d) {
                            date = new Date(y, m - 1, d1);
                        }
                        else {
                            date = new Date(y, m - 1, d);
                        }
                        break;
                    case DatePart.Year:
                        var y = date.getFullYear() + number, m = date.getMonth(), d = date.getDate(), d1;
                        d1 = GetLastDateInMonth(new Date(y, m, 1)).getDate();
                        //如果当月天数小于待处理的日期天数
                        if (d1 < d) {
                            date = new Date(y, m, d1);
                        }
                        else {
                            date = new Date(y, m, d);
                        }
                        break;
                    default:
                        date = new Date(date.getTime() + number * 864E5);
                        break;
                }
                return date;
            },
            DateToString = function (d, sep) {
                sep = sep || "-";
                return "" + d.getFullYear() + sep + (((d.getMonth() + 1) < 10) ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1)) + sep + ((d.getDate() < 10) ? ("0" + d.getDate()) : d.getDate());
            },
            StringToDate = function (s, sep) {
                sep = sep || "-";
                d = s.split(sep);
                return new Date(d[0] + "/" + d[1] + "/" + d[2]);
            },
            GetFristDateInMonth = function (d) {
                return new Date(d.getFullYear(), d.getMonth(), 1);
            },
            GetLastDateInMonth = function (d) {
                var FristDateInMonth = GetFristDateInMonth(d);
                return new Date(FristDateInMonth.getFullYear(), FristDateInMonth.getMonth() + 1, 0);
            },
            GetTimestamp = function (d) {
                return Date.parse(d);
            },
            ifMonthMore = function (startDate, endDate, monthCount) {
                if (!startDate || !endDate) return false;
                var d = startDate.split("-"), e = endDate.split("-");
                d = new Date(d[0] + "/" + d[1] + "/" + d[2]);
                e = new Date(e[0] + "/" + e[1] + "/" + e[2]);
                var o = d.getDate();
                //var f = new Date(e.getFullYear(), e.getMonth() + 1, e.getDate()),
                var f = new Date(e.getFullYear(), e.getMonth(), e.getDate() + 1),
                            g = d.getMonth() + 1,   //开始日期月份
                            j = e.getMonth() + 1,   //结束日期月份
                            l = d.getFullYear(),
                            endYear = e.getFullYear();
                d.getDate();
                if (l > endYear) return false;
                if (o != 1 || f.getDate() != 1) return false;
                //if (l == e && g < j && j - g > 2) return true;
                if (l <= endYear && 12 * (endYear - l - 1) + 11 - g + j + 1 + 1 >= monthCount) return true;
                return false
            },
            GetFristDateInWeek = function (d) { return AddDate(d, (d.getDay() + 1) * -1); },
            GetLastDateInWeek = function (d) { return AddDate(d, 5 - d.getDay()); },
            GetFristDateInQ = function (d) {
                var q = parseInt((d.getMonth()) / 3 - 1), year = d.getFullYear();
                if (q == 0) {
                    year--;
                }

                return new Date(d.getFullYear(), q * 3, 1);
            },
            GetLastDateInQ = function (d) {
                var FristDateInQ = GetFristDateInQ(d);
                return new Date(FristDateInQ.getFullYear(), FristDateInQ.getMonth() + 3, 0);
            },
            GetFristDateInYear = function (d) {
                return new Date(d.getFullYear(), 0, 1);
            },
            GetLastDateInYear = function (d) {
                var FristDateInYear = GetFristDateInYear(d);
                return new Date(FristDateInYear.getFullYear(), FristDateInYear.getMonth() + 12, 0);
            },
            //校验最大月份间隔，如果开始日期与结束日期相差的月份数大于指定月份时，返回false；否则返回true
            ifMonthLess = function (startDate, endDate, monthCount) {
                if (!startDate || !endDate) return false;
                var d = startDate.split("-"), e = endDate.split("-");
                d = new Date(d[0] + "/" + d[1] + "/" + d[2]);
                e = new Date(e[0] + "/" + e[1] + "/" + e[2]);
                var f = new Date(e.getFullYear(), e.getMonth(), e.getDate() + 1),
                            startMonth = d.getMonth() + 1,   //开始日期月份
                            endMonth = e.getMonth() + 1,   //结束日期月份
                            startYear = d.getFullYear(),
                            endYear = e.getFullYear();
                if (startYear > endYear) return false;
                if (startYear <= endYear && 12 * (endYear - startYear) - startMonth + endMonth + 1 <= monthCount) return true;
                return false
            };
function StopDefaultEvent(e) {
    e = e || window.event;
    //如果提供了事件对象，则这是一个非IE浏览器   
    if (e && e.preventDefault) {
        //阻止默认浏览器动作(W3C)  
        e.preventDefault();
    } else {
        //IE中阻止函数器默认动作的方式   
        e.returnValue = false;
    }
    DoSomething(e);
    return false;
}

//阻止冒泡
function DoSomething(evt) {
    var e = (evt) ? evt : window.event;
    if (window.event) {
        e.cancelBubble = true;     // ie下阻止冒泡
    } else {
        //e.preventDefault();
        e.stopPropagation();     // 其它浏览器下阻止冒泡
    }
}
//ShowDatePicker.selMonth = false;
//ShowDatePicker.selDay = false;
//ShowDatePicker.init("2012-05-04", "2012-07-11");

