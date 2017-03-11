define('menu', ['jquery'], function (require, exports, module) {
    var $ = require('jquery');
    (function () {
        //$('a').on("click.a", function (e) {
        //    $.index.StopDefaultEvent(e);
        //});
        var SetTab = function (tab) {
            if (!tab || typeof tab != 'object') return false;
            var html = "";
            $.each(tab, function () {
                var _this = this, url = (_this.url || ""), name = (_this.name || "");
                if (url && name) {
                    html += '<li><a href="javascript:void(0);" data-target="#tab-1" data-toggle="tab" url="'
                    + url + '">' + name + '</a><span class="arrow"></span></li>'
                }
            });
            return html;
        }

        function setNavBar(m1, m2, m3, m1_text) {
            var html = [], name = "";
            if (m1) {
                html.push('<span class="ft16">' + m1 + '</span>');
                name = m1_text;
                if (m1.indexOf("看板") >= 0) {
                    $('#navBar').html(html.join(''));
                    $.index.filter.setPageName(name);
                    return;
                }
                if (m2 && m1 != m2) {
                    html.push(' ><span class="ft16">' + m2 + '</span>');
                    name += "-" + m2;
                    if (m3 && m3 != m2) {
                        html.push(' ><span class="ft16">' + m3 + '</span> >');
                        name += "-" + m3;
                    }
                }
                $('#navBar').html(html.join(''));
                $.index.filter.setPageName(name);
            }
        }
        var $menu = $('.leftsub');
        $('#account').on("click.account", function (e) {
            $.index.StopDefaultEvent(e);
            $('.tab-nav').css('display', 'none');
            $('.tab-nav ul').html('');
            $menu.find("dd").removeClass("dd-cur");
            $menu.find("[menutype='group']").removeClass("current");
            $('.tab-content').load("Account/Settings.html?_=" + (new Date()).getTime());
            setNavBar($(this).text());
        });

        $('#help').on("click.account", function (e) {
            $.index.StopDefaultEvent(e);
            $('.tab-nav').css('display', 'none');
            $('.tab-nav ul').html('');
            $menu.find("dd").removeClass("dd-cur");
            $menu.find("[menutype='group']").removeClass("current");
            $('.tab-content').load("help.html?_=" + (new Date()).getTime());
            setNavBar($(this).text());
        })

        var defaultType = '<li data-value="pc,m,app"><a href="#"><i class="icon16 ic-right"></i>全部</a></li>'
            + '<li data-value="pc"><a href="#"><i class="icon16 ic-right"></i>PC</a></li>'
            + '<li data-value="m"><a href="#"><i class="icon16 ic-right"></i>M</a></li>'
            + '<li data-value="app"><a href="#"><i class="icon16 ic-right"></i>App</a></li>';
        $menu.on("click.menu", "dd", function (e) {
            var $this = $(this), tabgroup = $this.find("a").attr("tabgroup"), data = $this.find("a").attr("data-value");
            var _currentValue = $('#type li[class="current"]').attr('data-value');
            //重置端
            if (data) {
                if (data == "all") {
                    $('#type').html('<li class="current" data-value="all"><a href="#"><i class="icon16 ic-right"></i>全部</a></li>');
                }
                else if (data == "pc") {
                    $('#type').html('<li data-value="pc" class="current" ><a href="#"><i class="icon16 ic-right"></i>全部</a></li><li data-value="pc"><a href="#"><i class="icon16 ic-right"></i>PC</a></li>');
                }
                else if (data == "all_1") {
                    var t = '<li data-value="all"><a href="#"><i class="icon16 ic-right"></i>全部</a></li>'
                + '<li data-value="pc"><a href="#"><i class="icon16 ic-right"></i>PC</a></li>'
                + '<li data-value="m"><a href="#"><i class="icon16 ic-right"></i>M</a></li>'
                + '<li data-value="app"><a href="#"><i class="icon16 ic-right"></i>App</a></li>';
                    $('#type').html(t);
                }
            } else {
                $('#type').html(defaultType);
            }

            var current = $('#type li[data-value="' + _currentValue + '"]');
            if (current.length) {
                current.trigger('click');
            }
            else {
                $('#type li:eq(0)').addClass("current");
            }
            //移除其他菜单选中样式
            $menu.find("dd").removeClass("dd-cur");
            $menu.find("[menutype='group']").removeClass("current");
            $this.addClass("dd-cur");
            $this.parents("[menutype='group']").addClass("current");

            $('.tab-nav [data-trigger="click"]').html(SetTab(eval('(' + tabgroup + ')')));

            $('.tab-nav li:first').trigger('click');
            return false;
        });
        var $tab = $('.tab-nav [data-trigger="click"]');

        $tab.on("click.menu", "li", function (e) {
            var $this = $(this), url = $this.find("a").attr("url");
            $('.tab-nav').css('display', '');
            $tab.find("li").removeClass("current");
            $this.addClass("current");
            var _filter = $.index.filter;


            //设置面包屑
            var _menu = $menu.find('li[class="current"]')
                , m1 = _menu.find('dt').html(), m1_2 = _menu.find('dt').text(), m2 = _menu.find('dd[class="dd-cur"]').text();
            setNavBar(m1, m2, $tab.find('li[class="current"] a').text(), m1_2);
            if (url) {
                $('.tab-content').load(url + "?_=" + (new Date()).getTime(), function () {
                    //tip隐藏
                    $('.tip a').on("click.tiphide", function (e) {
                        $.index.StopDefaultEvent(e);
                        $('.tip').hide();
                    });
                    //页面绑定事件
                    $('#date').on("click.date.a", "a", function (e) {
                        var $this = $(this), type = $this.attr("data-toggle")
                            , value = $this.attr("data-value"), text = $this.text()
                            , params = $this.attr("params"), d;
                        if (params && params.split(',').length == 2) {
                            d = params.split(',');
                        }
                        //移除其他菜单选中样式
                        $('#date').find("a").removeClass("a-org");
                        $this.addClass("a-org");

                        _filter.select("datetype", '', [{ id: "datetype", value: value }], 0);
                        var sd = d[0], ed = d[1];
                        if (value == "1") {
                            if (d) {
                                //看板特殊处理，一次只能选择一天
                                if ($this.attr("data-type") == "single") {
                                    $("#timeperiod").html('<span id="timeperiod_start">' + d[1] + '</span><span>\u81f3</span><span id="timeperiod_end">' + d[1] + "</span>");
                                    sd = d[1];
                                }
                                else {
                                    $("#timeperiod").html('<span id="timeperiod_start">' + d[0] + '</span><span>\u81f3</span><span id="timeperiod_end">' + d[1] + "</span>");
                                }

                            }

                            switchDateView2("calDate");
                        }
                        else if (value == "2") {
                            if (d) {
                                $("#timeperiod").html('<span id="timeperiod_start">' + d[0] + '</span><span>\u81f3</span><span id="timeperiod_end">' + d[1] + "</span>");
                            }
                            switchDateView2("calDate");
                        }
                        else if (value == "3") {
                            if (d) {
                                $("#timeperiod").html('<span id="timeperiod_start">' + d[0] + '</span><span>\u81f3</span><span id="timeperiod_end">' + d[1] + "</span>");
                            }
                            switchDateView2("calMonth");
                        }
                        else if (value == "4") {
                            if (d) {
                                $("#timeperiod").html('<span id="timeperiod_start">' + d[0] + '</span><span>\u81f3</span><span id="timeperiod_end">' + d[1] + "</span>");
                            }
                            switchDateView2("calQ");
                        }
                        else if (value == "5") {
                            if (d) {
                                $("#timeperiod").html('<span id="timeperiod_start">' + d[0] + '</span><span>\u81f3</span><span id="timeperiod_end">' + d[1] + "</span>");
                            }
                            switchDateView2("calY");
                        }
                        $.index.getDatePickerValue(sd, ed);
                        return false;
                    });

                    //车系
                    $('[data-type="series"]').on("changed", function (e, args) {
                        var cmp = [], $this = $(this), cmp_temp = {}
                            , option = $this.data("carSelect").getValue(), index = $this.attr("data-index")
                            , value = option.value, text = option.text;
                        //本品
                        if (index == "0") {
                            _filter.select("seriesid", '本品：' + text, [{ id: "seriesid", value: value, text: text }], 1, "本品");

                            //重置竞品
                            var cmp = $.index.getCmpSeries(value);
                            var defaultCmp;

                            if ($.index.filter.global["cmp"] && $.index.filter.global["cmp"][value]) {
                                defaultCmp = $.index.filter.global["cmp"][value];
                            }
                            $.index.setCmpSeries($('#cmpseries'), cmp, defaultCmp);
                        }
                        else {
                            $('[data-type="series"]').each(function () {
                                var opt = $(this).data("carSelect").getValue(), i = $(this).attr("data-index");
                                if (i != "0") {
                                    if (!cmp_temp[opt.value]) {
                                        cmp.push(opt.value);
                                    }
                                }
                                cmp_temp[opt.value] = opt.value;
                            });
                            _filter.select("cmpseriesid_" + index, text, [{ id: "cmpseriesid", value: cmp.join(','), type: $.index.datatype.str }], 1, "竞品");
                        }
                    });

                    //地区选择条件公共处理
                    function areaSelect() {
                        var selected = [];
                        var areatype = $('#area a[class="a-org"]').attr("data-value")
                        , area_1 = $('#selArea_1'), subarea_1 = $('#selSubArea_1')
                        , area_2 = $('#selArea_2'), subarea_2 = $('#selSubArea_2');
                        var text = "";
                        if (areatype == "1") {

                            if (area_1.length) {
                                var data = area_1.data("select").getValue();
                                text = data.text;
                                selected.push({ id: "regionid", value: data.value });
                            }

                            if (subarea_1.length) {
                                var data = subarea_1.data("select").getValue();
                                if (data.value != "-1") {
                                    text = data.text;
                                }
                                selected.push({ id: "provinceid", value: data.value });
                            }
                            if (subarea_2.length) {
                                selected.push({ id: "cityid", value: -1 });
                            }
                        }
                        else if (areatype == "2") {
                            if (area_2.length) {
                                var data = area_2.data("select").getValue();
                                text = data.text;
                                selected.push({ id: "provinceid", value: data.value });
                            }

                            if (subarea_2.length) {
                                var data = subarea_2.data("select").getValue();
                                if (data.value != "-1" && text != data.text) {
                                    text += "-" + data.text;
                                }

                                selected.push({ id: "cityid", value: data.value });
                            }

                            if (area_1.length) {
                                selected.push({ id: "regionid", value: -1 });
                            }
                        }
                        _filter.select("area", text, selected, 1, "地域范围");
                    }

                    //区域标签点击事件
                    $('#area').on("click.area.a", "a", function (e) {

                        var $this = $(this), type = $this.attr("data-toggle"), value = $this.attr("data-value");

                        //移除其他菜单选中样式
                        $('#area').find("a").removeClass("a-org");
                        $this.addClass("a-org");
                        $('[data-type="area"]').css('display', 'none');
                        $('#selArea_' + value).css('display', '');
                        $('#selSubArea_' + value).css('display', '');
                        areaSelect();

                        return false;
                    });
                    //省
                    $("#selArea_2").on("selected", function (e, args) {
                        var $sel = $('#selSubArea_2')
                            , value = args.option.value, text = args.option.text;

                        if ($sel.length) {
                            $sel.find('.select-selected span').text('全部').attr('data-value', -1);
                            $sel.data("select").setValue({ text: '全部', value: '-1' });

                            if (value == -1) {
                                $sel.find('.select-option dl').html('');
                            } else {
                                var subdata = $.index.initData["city"][value];
                                var selHtml = [];
                                selHtml.push('<dd><a href="#" data-value="-1">全部</a></dd>');
                                $.each(subdata, function () {
                                    selHtml.push('<dd><a href="#" data-value="{id}">{name}</a></dd>'.replace('{id}', this["cid"]).replace('{name}', this["cname"]));
                                });

                                $sel.find('.select-option dl').html(selHtml.join(''));
                            }
                        }
                        //设置选择条件
                        //areaSelect();
                        setTimeout(areaSelect, 100);
                    });
                    //城市
                    $("#selSubArea_2").on("selected", function (e, args) {
                        var province = $("#selArea_2").data("select").getValue();
                        //设置参数
                        var value = args.option.value, text = args.option.text;
                        if (text == province.text || value == "-1") {
                            text = province.text;
                        }
                        else {
                            text = province.text + "-" + text;
                        }
                        //设置选择条件
                        //areaSelect();
                        setTimeout(areaSelect, 100);
                    });

                    //大区-省份
                    $("#selSubArea_1").on("selected", function (e, args) {
                        var region = $("#selArea_1").data("select").getValue()
                            , value = args.option.value, text = args.option.text;
                        if (text == region.text || value == "-1") {
                            text = region.text;
                        }

                        //设置选择条件
                        //areaSelect();
                        setTimeout(areaSelect, 100);
                    });

                    //大区
                    $("#selArea_1").on("selected", function (e, args) {
                        var $sel = $('#selSubArea_1')
                            , value = args.option.value, text = args.option.text;

                        if ($sel.length) {
                            $sel.find('.select-selected span').text('全部').attr('data-value', -1);
                            $sel.data("select").setValue({ text: '全部', value: '-1' });

                            if (value == -1) {
                                $sel.find('.select-option dl').html('');
                            }
                            else {
                                var subdata = $.index.initData["rp"][value];
                                var selHtml = [];
                                selHtml.push('<dd><a href="#" data-value="-1">全部</a></dd>');
                                $.each(subdata, function () {
                                    selHtml.push('<dd><a href="#" data-value="{id}">{name}</a></dd>'.replace('{id}', this["pid"]).replace('{name}', this["pname"]));
                                });

                                $sel.find('.select-option dl').html(selHtml.join(''));
                            }
                        }
                        //设置选择条件
                        setTimeout(areaSelect, 100);
                    });

                    //查询按钮
                    $('#btnSubmit span').on("click.submit", function (e) {
                        //$.index.StopDefaultEvent(e);
                        $.index.doSubmit();
                    });
                });

            }
        });

        $('.nav-cont').on("click.nav-cont", "li", function (e) {
            var $this = $(this)//, tabgroup = $this.find("a").attr("tabgroup");

            //移除其他菜单选中样式
            $('.nav-cont').find("li").removeClass("current");
            $this.addClass("current");
            //论坛页面特殊处理
            $.index.CtlThousandFav();
            return false;
        });

    })();
    module.exports = $;
});