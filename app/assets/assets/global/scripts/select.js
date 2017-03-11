/*! Autoshow - V(1.0.3) - build(2013.09.16) */
/**
 * 描述：模拟下拉菜单控件
 * 作者：wangwenqing403@autohome.com.cn
 * 时间：2013-08-16
 */
define('select', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Select = function ($elem, options) {
        var that = this;
        that.options = options;
        that.dataSource = options.dataSource == null ? [] : options.dataSource;
        that.$elem = $elem;
        that.$select = $('.select-selected', $elem);
        that.$selectSpan = $('span', that.$select);
        that.$list = $('.select-option', $elem);
        that.currentItemIndex = 0;
        that.$items = $('a', that.$list);
        that.init();
    };

    Select.prototype = {
        constructor: Select,
        init: function () {
            var that = this;
            that.$select.on('click', $.proxy(that.show, that));
            that.$list.on("click", "a", $.proxy(function (e) {
                var $option = $(e.target);                
                var option = { "text": $option.text(), "value": $option.data("value") };                
                var oldOption = that.getValue();
                if (option.value != oldOption.value || option.text != oldOption.text) {                    
                    var args = { "option": option };                    
                    this.$elem.trigger($.Event('selected'), args);
                    this.select($option);
                }
                this.hide();
                return false;
            }, that));
        },
        setValue: function (option) {           
            this.$selectSpan.text(option.text);            
            this.$selectSpan.data("value", option.value);            
        },
        getElement: function () {
            return this.$elem[0];
        },
        getValue: function () {
            return { "text": this.$selectSpan.text(), "value": this.$selectSpan.data("value") };
        },
        bindDataSource: function () {
            var that = this;
            var listHTML = "";
            $.each(that.dataSource, function () {
                var fctData = this;
                var firstLetter = "<b></b>";
                listHTML += "<dd>" + firstLetter + "<a data-value=\"" + fctData.sid + "," + fctData.f + "\" href=\"#\">" + fctData.sname + "</a></dd>";
            });
            this.$listElem.html(listHTML);

            this.$items = this.$listElem.find("a");
            if (this.dataSource.length > 0) {
                var firstData = this.dataSource[0];
                var firstValue = { "value": firstData.sid + "," + firstData.f, "text": firstData.sname };
                this.setValue(firstValue);
            }
        },
        show: function () {
            var that = this;
            if (that.$elem.hasClass('select-disabled')) return;
            
            that.$elem.addClass('active');
            that.$list.show();

            setTimeout(function () {

                $(document).on('click.select.body', function (e) {
                    var $parent = $(e.target).closest(that.$elem);
                    if ($parent.length == 0) {
                        that.hide();
                    }
                });

            }, 0);

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
        hide: function () {
            this.$list.hide();
            this.$elem.removeClass('active');
            $(document).off('click.select.body');
        },
        disabled: function () {
            if (that.$elem.hasClass('select-disabled')) {
                that.$elem.removeClass('select-disabled');
            }
            else {
                that.$elem.addClass('select-disabled');
            }
        }
    };

    $.fn.select = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('select'),
                options = $.extend({}, $.fn.select.defaults, $this.data(), option);
            if (!data) $this.data('select', (data = new Select($this, options)));
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.select.defaults = {
        keyboard: false  //是否开启快捷键
    };
    $(function () {
        $('[data-toggle]="select"').select();
    });

    module.exports = $;

});