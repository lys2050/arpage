define('carselect', ['jquery'], function (require, exports, module) {

    var $ = require('jquery');
    //$("#ddlSeries").carSelect(options);
    //$("#ddlSeries").data("carSelect").select($($("#ddlSeries").data("carSelect").$items[sIndex]));
    $.fn.carSelect = function (option) {        
        return this.each(function () {
            var $this = $(this),
                data = $(this).data("carSelect");            
            //配置可以来自参数options及元素上的data-xxx属性
            var options = $.extend({}, $.fn.carSelect.defaults, $this.data(), option);
            if (option.recreate == true || data == null) data = new CarSelect($this, options);
            $(this).data("carSelect", data);
            if (typeof option === "string") {
                data[option]();
            }
        });
    }
    function CarSelect($elem, options) {
        this.$elem = $elem;        
        this.options = options;
        this.dataSource = options.dataSource == null ? [] : options.dataSource;
        this.$valueElem = $(".select-selected span", $elem);

        this.$valueContainer = this.$valueElem.parent();
        this.$listElem = $(".select-option dl", $elem);
        this.$listContainer = this.$listElem.parent();        
        //ie下需要记忆下拉框中滚动条位置，否则消失再显示，滚动条又到最上面了
        this._scrolltop = 0;
        var $items = null;
        //key选中项的索引
        this.currentKeyItemIndex = -1;
        //同一个字母项的索引
        this.startKeyItemIndex = -1;
        //上次输入的字符
        this.currentChar = null;
        //当前选中项索引
        this.currentItemIndex = -1;
        this._init();
    }
    CarSelect.prototype = {
        _init: function () {
            //绑定数据源
            this._bindDataSource();
            $(document).on("click.carSelect", $.proxy(this._documentClickHandler, this));
            $(document).on("keyup.carSelect", $.proxy(this._documentKeyUpHandler, this))
        },
        toggle: function () {
            this.$listContainer.toggle();
        },
        setValue: function (option) {            
            this.$valueElem.data("value", option.value);
            this.$valueElem.text(option.text);
        },
        getValue: function () {
            return { value: this.$valueElem.data("value"), text: this.$valueElem.text() };
        },
        _bindDataSource: function () {
            var listHTML = "";
            $.each(this.dataSource, function () {
                var fctData = this;
                var firstLetter = "<b>" + fctData.f + "</b>";
                listHTML += "<dd>" + firstLetter + "<a data-value=\"" + fctData.sid + "\" href=\"#\">" + fctData.sname + "</a></dd>";
            });
            this.$listElem.html(listHTML);

            this.$items = this.$listElem.find("a");
            if (this.dataSource.length > 0) {
                var firstData = this.dataSource[0];
                var firstValue = { "value": firstData.sid + "," + firstData.f, "text": firstData.sname };
                this.setValue(firstValue);
            }
        },
        _documentClickHandler: function (e) {
            var $target = $(e.target);
            if ($target.closest(this.$valueContainer).length > 0) {//文本框点击事件
                this.show();
            }
            else if ($target.closest(this.$elem).length > 0) {//下拉区域点击事件
                //如果点击是a标签
                var $link = $target.closest("a[data-value]");
                if ($link.length > 0) {
                    this.select($link);
                    return false;
                }
            }
            else {//其他地方点击事件
                this.hide();
            }
        },
        select: function ($item) {            
            var option = { "text": $item.text(), "value": $item.data("value") };
            var oldOption = this.getValue();
            if (option.value != oldOption.value || option.text != oldOption.text) {
                var args = { "option": option };
                this.setValue(option);
                if (this.currentItemIndex != -1) this.$items.eq(this.currentItemIndex).parent().removeClass("current");
                $item.parent().addClass("current");
                this.currentItemIndex = this.$items.index($item);
                this.$elem.trigger($.Event('changed'), args);
            }
            this.hide();
        },
        _documentKeyUpHandler: function (e) {
            if (this.visible() == false) return;
            var key = e.keyCode;
            if (key >= 65 && key <= 90) {
                this._navigate(key);
            }
            else if (key == 13) {
                this._enter();
            }
        },
        _navigate: function (key) {
            var char = String.fromCharCode(key).toUpperCase();
            var length = this.$items.length;
            var nextItemIndex = -1;
            if (this.currentChar == char) {//如果当前字符和输入的字符一样
                var nextItem = this.$items.eq(this.currentKeyItemIndex + 1);
                if (nextItem.length > 0 && nextItem.find("b").text().toUpperCase() == char) {//如果下一个项有的话，就选中下一个项                        
                    nextItemIndex = this.currentKeyItemIndex + 1;
                }
                else {//否则移动到相同字母的第一项
                    nextItemIndex = this.startKeyItemIndex;
                }
            }
            else {//如果不一样
                for (var i = 0; i < length; i++) {
                    var $item = this.$items.eq(i);
                    var firstChar = $item.find("b").text();
                    //找到和输入字符相同的项
                    if (firstChar.toUpperCase() == char) {
                        this.startKeyItemIndex = i;
                        nextItemIndex = i;
                        break;
                    }
                }
            }
            if (nextItemIndex == -1)//如果没找到该字母则返回
                return;
            if (this.currentKeyItemIndex > -1) this.$items.eq(this.currentKeyItemIndex).removeClass("keyselected");
            this.currentChar = char;
            this.$items.eq(nextItemIndex).addClass("keyselected");
            var top = this.$items.eq(nextItemIndex)[0].offsetTop;
            this.$listElem.scrollTop(top - 1);
            this.currentKeyItemIndex = nextItemIndex;
        },
        _enter: function () {
            if (this.currentKeyItemIndex != -1) {
                this.select(this.$items.eq(this.currentKeyItemIndex));
            }
        },
        visible: function () {
            return this.$listContainer.is(':visible');
        },
        show: function () {
            if (this.visible() == false) {
                this.$elem.addClass('active');
                this.$listContainer.show();
                if ($.browser.msie) {
                    this.$listElem.scrollTop(this._scrolltop);
                }
            }
        },
        hide: function () {
            if (this.visible() == true) {
                if ($.browser.msie) {
                    this._scrolltop = this.$listElem.scrollTop();
                }
                this.$elem.removeClass('active');
                this.$listContainer.hide();
            }
        },
        toggle: function () {
            this.$listContainer.toggle();
        }
    };
    $.fn.carSelect.defaults = { "recreate": false, "type": "select-w193" };

    module.exports = $;
});