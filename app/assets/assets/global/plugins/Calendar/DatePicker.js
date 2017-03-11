(function ($) {
    function a(m) {
        return m < 10 ? "0" + m : m;
    }
    function c(m, q) {
        $(m).append('<div class="jCal">' + (q.ind == 0 ? '<div class="left" ></div>' : "") +
            (q.ind == q.showMonths - 1 ? '<div style="" class="right" ></div>' : "") +
            '<div class="month"><table style="margin:auto" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td style="*padding-bottom:4px">'
            + q.day.getFullYear() + "</td><td>" + q.ml[q.day.getMonth()] + "</td></tr></tbody></table></div></div>");
        //$(m).append('<div class="jCal">' + (q.ind == 0 ? '<div class="left" ></div>' : "") + (q.ind == q.showMonths ? '<div style="" class="right" ></div>' : '<div style="none" class="right" ></div>') + '<div class="month"><table style="margin:auto" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td style="*padding-bottom:4px">' + q.day.getFullYear() + "</td><td>" + q.ml[q.day.getMonth()] + "</td></tr></tbody></table></div></div>");
        $(m).find(".jCal .left").bind("click", $.extend({}, q), function (p) {
            if ($(".jCalMask",
            p.data._target).length > 0) return false;
            var s = {
                w: 0,
                h: 0
            };
            $(".jCalMo", p.data._target).each(function () {
                s.w += $(this).width() + parseInt($(this).css("padding-left")) + parseInt($(this).css("padding-right"));
                var u = $(this).height() + parseInt($(this).css("padding-top")) + parseInt($(this).css("padding-bottom"));
                s.h = u > s.h ? u : s.h
            });
            $(p.data._target).prepend('<div class="jCalMo"></div>');
            p.data.day = new Date($("div[id*=" + p.data.cID + "d_]:first", p.data._target).attr("id").replace(p.data.cID + "d_", "").replace(/_/g, "/"));
            p.data.day.setDate(1);
            p.data.day.setMonth(p.data.day.getMonth() - 1);
            c($(".jCalMo:first", p.data._target), p.data);
            e($(".jCalMo:first", p.data._target), p.data);
            if (p.data.showMonths > 1) {
                var t = $(".jCalMo:eq(" + (p.data.showMonths - 1) + ") .jCal", p.data._target);
                t.find(".month").before($(".right", p.data._target).clone(true));
                t.children(".right").show();
                $(".left:last, .right:last", p.data._target).remove();
                minDate.substring(0, 6) < "" + p.data.day.getFullYear() + a(p.data.day.getMonth() + 1) ? $(".left:last", p.data._target).show() : $(".left:last", p.data._target).hide();
            }
            $(p.data._target).append('<div class="jCalSpace" style="width:' + s.w + "px; height:" + s.h + 'px;"></div>');
            $(".jCalMo", p.data._target).wrapAll('<div class="jCalMask" style="clip:rect(0px ' + s.w + "px " + s.h + "px 0px); width:" + (s.w + s.w / p.data.showMonths) + "px; height:" + s.h + 'px;"><div class="jCalMove"></div></div>');
            $(".jCalMove", p.data._target).css("margin-left", s.w / p.data.showMonths * -1 + "px").css("opacity", 0.5).animate({
                marginLeft: "0px"
            }, "fast", function () {
                $(this).children(".jCalMo:not(:last)").appendTo($(p.data._target));
                $(".jCalSpace, .jCalMask", p.data._target).empty().remove();
                $(p.data._target).data("day") && d(p.data._target, $(p.data._target).data("day"), $(p.data._target).data("days"), p.data)
            })
        });

        $(m).find(".jCal .right").bind("click", $.extend({}, q), function (p) {
            if ($(".jCalMask", p.data._target).length > 0) return false;
            var s = {
                w: 0,
                h: 0
            };
            $(".jCalMo", p.data._target).each(function () {
                s.w += $(this).width() + parseInt($(this).css("padding-left")) + parseInt($(this).css("padding-right"));
                var t = $(this).height() + parseInt($(this).css("padding-top")) + parseInt($(this).css("padding-bottom"));
                s.h = t > s.h ? t : s.h
            });
            $(p.data._target).append('<div class="jCalMo"></div>');
            p.data.day = new Date($("div[id^=" + p.data.cID + "d_]:last",
            p.data._target).attr("id").replace(p.data.cID + "d_", "").replace(/_/g, "/"));
            p.data.day.setDate(1);
            p.data.day.setMonth(p.data.day.getMonth() + 1);
            c($(".jCalMo:last", p.data._target), p.data);
            e($(".jCalMo:last", p.data._target), p.data);
            if (p.data.showMonths > 1) {
                $(".left", p.data._target).clone(true).prependTo($(".jCalMo:eq(1) .jCal", p.data._target));
                $(".left:first, .right:first", p.data._target).remove();
                $(".left:last", p.data._target).show();
                "" + h.getFullYear() + a(h.getMonth() + 1) > "" + p.data.day.getFullYear() + a(p.data.day.getMonth() + 1) ? $(".right:last", p.data._target).show() : $(".right:last", p.data._target).hide()
            }
            $(p.data._target).append('<div class="jCalSpace" style="width:' + s.w + "px; height:" + s.h + 'px;"></div>');
            $(".jCalMo", p.data._target).wrapAll('<div class="jCalMask" style="clip:rect(0px ' + s.w + "px " + s.h + "px 0px); width:" + (s.w + s.w / p.data.showMonths) + "px; height:" + s.h + 'px;"><div class="jCalMove"></div></div>');
            $(".jCalMove", p.data._target).css("opacity", 0.5).animate({
                marginLeft: s.w / p.data.showMonths * -1 + "px"
            }, "fast", function () {
                $(this).children(".jCalMo:not(:first)").appendTo($(p.data._target));
                $(".jCalSpace, .jCalMask", p.data._target).empty().remove();
                $(p.data._target).data("day") && d(p.data._target, $(p.data._target).data("day"), $(p.data._target).data("days"), p.data);
                $(this).children(".jCalMo:not(:first)").removeClass("")
            })
        })
    }
    function d(m, q, p, s) {
        q.getTime();
        for (var t = new Date(q.getTime()), u = false, w = 0; w < p; w++) {
            var x = $(m).find("div[id*=d_" + (t.getMonth() + 1) + "_" + t.getDate() + "_" + t.getFullYear() + "]");
            if (x.length > 0) {
                x.stop().addClass("selectedDay");
                u = true
            }
            t.setDate(t.getDate() + 1)
        }
        u && typeof s.callback == "function" && s.callback(q, p)
    }
    function e(m, q) {
        if (!$.lzCalendarStDate) $.lzCalendarStDate = $("#lz_comparisonStartDate");
        if (!$.lzCalendarEnDate) $.lzCalendarEnDate = $("#lz_comparisonEndDate");
        //$.lzCalendarStDate = $("#lz_comparisonStartDate");
        //$.lzCalendarEnDate = $("#lz_comparisonEndDate");
        for (var p = 0, s = q.dow.length; p < s; p++) p == 0 ? $(m).append('<div style="border-left:1px solid #4586C8;" class="dow">' + q.dow[p] + "</div>") : $(m).append('<div class="dow">' + q.dow[p] + "</div>");
        p = new Date((new Date(q.day.getTime())).setDate(1));
        s = new Date((new Date(p.getTime())).setDate(0));
        var t = new Date((new Date((new Date(p.getTime())).setMonth(p.getMonth() + 1))).setDate(0));
        s = {
            fd: p.getDay(),
            lld: s.getDate(),
            ld: t.getDate()
        };
        var u = s.fd < q.dayOffset ? q.dayOffset - 7 : 1,
            w = t.getDay() < q.dayOffset ? 7 - t.getDay() : t.getDay();
        t = u;
        for (u = s.fd + s.ld + (7 - w) ; t < u; t++) {
            var x, y = "";
            if ((t + 7) % 7 == 1) y = ' style="border-left:1px solid #A1C7EB;" ';
            if (t - (s.fd - q.dayOffset) > 0) x = p.getFullYear() + (p.getMonth() + 1 < 10 ? "0" : "") + (p.getMonth() + 1) + (t - (s.fd - q.dayOffset) < 10 ? "0" : "") + (t - (s.fd - q.dayOffset));

            w = x > k || q.max_date && x > q.max_date || q.min_date && x < q.min_date ? "aday" : "day";
            $(m).append(t <= s.fd - q.dayOffset ? "<div" + y + ' id="' + q.cID + "d" + t + '" class="pday">' + (s.lld - (s.fd - q.dayOffset - t)) + "</div>" : t > s.fd - q.dayOffset + s.ld ? "<div" + y + ' id="' + q.cID + "d" + t + '" class="aday">' + (t - (s.fd - q.dayOffset + s.ld)) + "</div>" : "<div" + y + ' id="' + q.cID + "d_" + (p.getMonth() + 1) + "_" + (t - (s.fd - q.dayOffset)) + "_" + p.getFullYear() + '" date="' + x + '" class="' + w + '">' + (t - (s.fd - q.dayOffset)) + "</div>")
        }
        if ($.clickcells && $.clickcells.length == 2) g(q._target, $.clickcells[0].attr("date"), $.clickcells[1].attr("date"));
        else $.clickcells && $.clickcells.length < 1 && g(q._target, q.st_date.replace(/-/g, ""), q.en_date.replace(/-/g, ""));
        $(m).find("div[id^=" + q.cID + "d]:first, div[id^=" + q.cID + "d]:nth-child(7n+2)").before('<br style="clear:both; font-size:0.1em;" />');
        $(m).find(".day, .today").bind("mouseover mouseout click", $.extend({}, q), function (z) {
            if ($(".jCalMask", z.data._target).length > 0) return false;
            var A = new Date($(this).attr("id").replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, "$1/$2/$3"));
            z.data.forceWeek && A.setDate(A.getDate() + (z.data.dayOffset - A.getDay()));
            var v = new Date(A.getTime());
            z.type == "click" && $("div[id*=d_]", z.data._target).stop().removeClass("selectedDay").removeClass("overDay").css("backgroundColor", "");

            var datetype = $('.time_selector dd.current a').attr('datetype');
            var dayOrMonth = $('.time_selector dd.current a').text();
            var singeClick = $("#timeperiod").data('singeClick');
            //if (datetype == 2 && (z.type == "mouseover" || z.type == "mouseout")) {
            if (singeClick && (z.type == "mouseover" || z.type == "mouseout")) {
                for (var B = 0, D = 1; B < D; B++) {
                    var C = $(z.data._target).find("#" + z.data.cID + "d_" + (v.getMonth() + 1) + "_" + v.getDate() + "_" + v.getFullYear());
                    if (C.length == 0 || $(C).hasClass("invday") || C.attr("date") > k) break;
                    if (z.type == "mouseover") $(C).addClass("overDay");
                    else if (z.type == "mouseout") $(C).stop().removeClass("overDay").css("backgroundColor", "");
                    v.setDate(v.getDate() + 1)
                }
            }
            else if (singeClick && z.type == "click") {
                var mydays = 0;
                //if (dayOrMonth == '按天') {
                if (singeClick) {
                    mydays = 1;
                }
                else if (dayOrMonth == '按周') {
                    var temp = $(this).prevAll('br:first').next();
                    if (temp.attr('class') == 'pday') {
                        v = new Date(v.getFullYear(), v.getMonth() - 1, temp.text());
                    }
                    else {
                        v = new Date(temp.attr("id").replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, "$1/$2/$3"));
                    }
                    mydays = 7;
                    A = new Date(v.getFullYear(), v.getMonth(), v.getDate());
                }
                else if (dayOrMonth == '按月') {
                    var now = new Date();
                    var lastDayOfMonth = new Date();
                    // 由于最新月没有数据，所以自动选择上个月
                    if (v.getFullYear() == now.getFullYear() && v.getMonth() == now.getMonth()) {
                        //v为上个月第一天
                        var temp = new Date(v.setMonth(-1));
                        v = new Date(temp.getFullYear(), temp.getMonth(), 1);
                        // 上个月最后一天
                        lastDayOfMonth = new Date(v.getFullYear(), v.getMonth() + 1, 0);
                    }
                    else {
                        // v为本月第一天
                        v = new Date(v.getFullYear(), v.getMonth(), 1);
                        // 本月最后一天
                        lastDayOfMonth = new Date(v.getFullYear(), v.getMonth() + 1, 0);
                    }
                    mydays = lastDayOfMonth.getDate() - v.getDate() + 1;
                    A = new Date(v.getFullYear(), v.getMonth(), v.getDate());
                }

                $.clickcells = Array();
                for (var B = 0, D = mydays; B < D; B++) {
                    var C = $(z.data._target).find("#" + z.data.cID + "d_" + (v.getMonth() + 1) + "_" + v.getDate() + "_" + v.getFullYear());
                    if (C.length == 0) {
                        v.setDate(v.getDate() + 1);
                        continue;
                    }
                    if ($(C).hasClass("invday") || C.attr("date") > k) break;
                    if (z.type == "mouseover") $(C).addClass("overDay");
                    else if (z.type == "mouseout") $(C).stop().removeClass("overDay").css("backgroundColor", "");
                    else if (z.type == "click") {
                        $(C).stop().addClass("selectedDay");
                        $.clickcells[$.clickcells.length] = $(C)
                    }
                    v.setDate(v.getDate() + 1);
                }
            }
            else {

                for (var B = 0, D = $(z.data._target).data("days") ; B < D; B++) {
                    var C = $(z.data._target).find("#" + z.data.cID + "d_" + (v.getMonth() + 1) + "_" + v.getDate() + "_" + v.getFullYear());
                    if (C.length == 0 || $(C).hasClass("invday") || C.attr("date") > k) break;
                    if (z.type == "mouseover") $(C).addClass("overDay");
                    else if (z.type == "mouseout") $(C).stop().removeClass("overDay").css("backgroundColor", "");
                    else if (z.type == "click") {
                        $(C).stop().addClass("selectedDay");
                        $.clickcells[$.clickcells.length] = $(C)
                    }
                    v.setDate(v.getDate() + 1)
                }
            }
            if (z.type == "click") {
                r = false;
                z.data.day = A;
                $(z.data._target).data("day", z.data.day).data("days", B);
                //var datetype = $('.time_selector dd.current a').attr('datetype');
                //if (datetype == 2) {
                if (singeClick) {
                    var tsd = $.clickcells[0].attr("date");
                    var ted = $.clickcells[$.clickcells.length - 1].attr("date");
                    var p, s = "";
                    p = tsd.substr(0, 4) + "-" + tsd.substr(4, 2) + "-" + tsd.substr(6, 2);
                    s = ted.substr(0, 4) + "-" + ted.substr(4, 2) + "-" + ted.substr(6, 2);
                    $.lzCalendarStDate.addClass("focus").val(p);
                    $.lzCalendarEnDate.addClass("focus").val(s);
                    $.clickcells = Array($.clickcells[0], $.clickcells[$.clickcells.length - 1]);
                    return;
                }
                if ($.clickcells.length == 2) {
                    if ($.clickcells[1].attr("date") < $.clickcells[0].attr("date")) {
                        A = $.clickcells[1];
                        $.clickcells[1] = $.clickcells[0];
                        $.clickcells[0] = A
                    }
                    A = $.clickcells.length;
                    v = $.clickcells[A - 2].attr("id");
                    B = $.clickcells[A - 1].attr("id");
                    B = $.clickcells[A - 1].attr("id");
                    v.split("_");
                    B.split("_");
                    v = $.clickcells[A - 2].attr("date");
                    A = $.clickcells[A - 1].attr("date");
                    B = "";
                    maxDayInterval || (maxDayInterval = 90);
                    if (l(n(v), n(A)) > maxDayInterval) {
                        $("#lz_comparisonError").html("请将查询区间设置在" + maxDayInterval.toString() + "天之内").show();
                        $(C).removeClass("selectedDay");
                        $.clickcells.pop();
                        $.clickcells.pop();
                        $.lzCalendarEnDate.val(n(A))
                    } else {
                        $("#lz_comparisonError").hide();
                        j(3);
                        if (A <= v) C = B = A;
                        else {
                            C = v;
                            B = A
                        }
                        f($(z.data._target), C, B)
                    }
                } else {
                    $.clickcells = Array($.clickcells[$.clickcells.length - 1]);
                    j(1)
                }
            }
        })
    }
    function f(m, q, p) {
        g(m, q, p);
        m = q.substr(0, 4) + "-" + q.substr(4, 2) + "-" + q.substr(6, 2);
        p = p.substr(0, 4) + "-" + p.substr(4, 2) + "-" + p.substr(6, 2);
        $.lzCalendarStDate.val(m);
        $.lzCalendarEnDate.val(p)
    }
    function g(m, q, p) {
        q && p && m.children(".jCalMo").each(function () {
            $(this).children("div:not(.pday, .aday, .dow, .jCal)").each(function () {
                $(this).attr("date") < q || $(this).attr("date") > p ? $(this).removeClass().addClass("day") : $(this).removeClass().addClass("day selectedDay")
            })
        })
    }
    function j(m, q) {
        var p, s = "";
        if ($.clickcells[0]) {
            p = $.clickcells[0].attr("date");
            p = p.substr(0, 4) + "-" + p.substr(4, 2) + "-" + p.substr(6, 2)
        }
        if ($.clickcells[1]) {
            s = $.clickcells[1].attr("date");
            s = s.substr(0, 4) + "-" + s.substr(4, 2) + "-" + s.substr(6, 2)
        }
        if (q) {
            p = p ? p : q.stdate;
            s = s ? s : q.endate
        }
        if (m == 0) {
            $.lzCalendarStDate.removeClass("focus").val(p);
            $.lzCalendarEnDate.removeClass("focus").val(s)
        } else if (m == 1) {
            $.lzCalendarStDate.addClass("focus").val(p);
            $.lzCalendarEnDate.removeClass("focus").val(p)
        } else if (m == 2) {
            $.lzCalendarStDate.removeClass("focus").val(p);
            $.lzCalendarEnDate.addClass("focus").val(s)
        } else if (m == 3) {
            $.lzCalendarStDate.addClass("focus").val(p);
            $.lzCalendarEnDate.addClass("focus").val(s)
        }
    }
    function l(m, q) {
        var p = m.substring(5, m.lastIndexOf("-")),
            s = m.substring(m.length, m.lastIndexOf("-") + 1),
            t = m.substring(0, m.indexOf("-")),
            u = q.substring(5, q.lastIndexOf("-")),
            w = q.substring(q.length, q.lastIndexOf("-") + 1),
            x = q.substring(0, q.indexOf("-"));
        p = (Date.parse(p + "/" + s + "/" + t) - Date.parse(u + "/" + w + "/" + x)) / 864E5;
        return Math.abs(p)
    }
    function o(m, q) {
        var p = m.getFullYear(),
            s = m.getMonth() + 1,
            t = m.getDate();
        return [p, s >= 10 ? s : "0" + s, t >= 10 ? t : "0" + t].join(q ? "" : "-")
    }
    function n(m) {
        return m.substr(0, 4) + "-" + m.substr(4, 2) + "-" + m.substr(6, 2)
    }
    var r = true;
    $.fn.jCal = function (m) {
        $.jCal(this, m)
    };
    $.fn.jCalReset = function (m, q) {
        $.clickcells = [];
        r = true;
        if (!m && !q) m = q = o(new Date);
        var p = new Date(m.replace(/\-/g, "/"));
        p.setDate(1);
        var s = $(this).data("opt");
        if ((new Date(p.getTime())).setMonth(p.getMonth() + 2) <= s.day.getTime()) p.setMonth(p.getMonth() + 2);
        else (new Date(p.getTime())).setMonth(p.getMonth() + 1) <= s.day.getTime() && p.setMonth(p.getMonth() + 1);
        $(this).data("day", null);
        s.st_date = m;
        s.en_date = q;
        $(this).empty();
        for (var t = 0; t < s.showMonths; t++) $(this).append('<div class="jCalMo"></div>');
        $(".jCalMo", this).each(function (u) {
            var w = new Date(p.getTime());
            w.setMonth(p.getMonth() + u + 1 - s.showMonths);
            c($(this), $.extend({}, s, {
                ind: u,
                day: w
            }));
            e($(this), $.extend({}, s, {
                ind: u,
                day: w
            }));
            if ("" + new Date((new Date).getTime()).getFullYear() + a(new Date((new Date).getTime()).getMonth() + 1) <= "" + w.getFullYear() + a(w.getMonth() + 1)) {
                $(".right:last").hide();
            }
        });
        f($(this), m.replace(/\-/g, ""), q.replace(/\-/g, ""))
    };
    $.clickcells = Array();
    var h = new Date((new Date).getTime()), k = o(h), minDate, maxDayInterval;

    $.jCal = function (m, q) {
        q = $.extend({
            day: h,
            days: 1,
            showMonths: 1,
            maxDayInterval: 90,
            monthSelect: true,
            dCheck: function () {
                return true
            },
            callback: function () {
                return true
            },
            selectedBG: "rgb(255, 113, 0)",
            defaultBG: "rgb(255, 113, 0)",
            dayOffset: 1,
            forceWeek: false,
            dow: ["\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u65e5"],
            ml: ["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", "\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708"],
            ms: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            _target: m,
            st_date: k,
            en_date: k,
            min_date: "20091001",
            max_date: o(h, true)
        }, q);
        h = q.day;
        maxDayInterval = q.maxDayInterval;
        minDate = q.min_date;
        k = o(q.day, true);
        q.day = new Date(q.day.getFullYear(), q.day.getMonth(), 1);
        $(m).data("opt", q);
        $(q._target).data("days") || $(q._target).data("days", q.days);
        $(m).stop().empty();
        for (var p = 0; p < q.showMonths; p++) {
            $(m).append('<div class="jCalMo"></div>');
        }
        q.cID = "c" + $(".jCalMo").length;
        $(".jCalMo", m).each(function (s) {
            var t = new Date((new Date(q.day.getTime())).setMonth((new Date(q.day.getTime())).getMonth() + s + 1 - q.showMonths));
            c($(this), $.extend({}, q, {
                ind: s,
                day: t
            }));
            e($(this), $.extend({}, q, {
                ind: s,
                day: t
            }))
        });
        $(q._target).data("day") && $(q._target).data("days") && d(m, $(q._target).data("day"), $(q._target).data("days"), q);
        f($(m), q.st_date.replace(/\-/g, ""), q.en_date.replace(/\-/g, ""));
        j(0, {
            stdate: q.st_date,
            endate: q.en_date
        });
        $(m).next().find("div#lz_comparisonError")
    };
    $.jCal.DateDiff = l;
    $.jCal.formatDate = o
})($);
