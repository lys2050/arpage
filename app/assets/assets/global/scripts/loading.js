define('loading', ['jquery', 'support'], function (require, exports, module) {
    var $ = require('jquery');
    var support = require('support');
    $.loading = {
        show: function (id) {
            if (this._outer == null) {
                var iframe = "";
                if (support.fixed == false) {
                    iframe = '<iframe scrolling="no" frameborder="0" style="width:100%;height:100%;filter:alpha(opacity=0);"></iframe>';
                }
                this._outer = $('<div class="loading fn-hide"><div class="loading-mask">' + iframe + '</div><div class="loading-img"></div></div>').appendTo($("body"));
                this._imgContainer = this._outer.find(".loading-img");
            }
            var target = null;
            //全屏
            var isFull = false;

            if (id == null) {
                target = $("body");
                isFull = true;
            }

            else if (typeof id == "string") {
                target = $("#" + id);
            }
            else {
                target = $(id);
            }

            var $window = $(window);
            var wWidth = $window.width();
            var wHeight = $window.height();
            var tTop = target.offset().top;
            var tLeft = target.offset().left;
            var tWidth = target.width();
            var tHeight = target.height();
            var oTop = tTop;
            var oLeft = tLeft;
            var oWidth = tWidth;
            var oHeight = tHeight;
            var oPosition = "absolute";
            var opacity = 0;
            if (isFull == true) {
                //如果全屏，遮盖层需要100%宽度
                oWidth = "100%";
                var width = "100%";
                var height = null;
                var top = null;
                var position = null;
                
                if (support.fixed == true) {
                    oHeight = "100%";
                    top = 0;
                    position = "fixed";
                    height = "100%";
                    oPosition = "fixed";
                    opacity = 1;
                }
                else {
                    oHeight = Math.max(tHeight, wHeight);
                    height = wHeight;
                    top = $window.scrollTop();
                    position = "absolute";
                }
                this._imgContainer.css({ top: top, "width": width, "height": height, "position": position })
            }
            this._outer.css({ "left": oLeft, "top": oTop, "width": oWidth, "height": oHeight, "position": oPosition, "opacity": opacity });
            this._outer.removeClass("fn-hide");
        },
        hide: function () {
            if (this._outer != null) {
                this._outer.addClass("fn-hide");
            }
        }
    };
    module.exports = $;
});