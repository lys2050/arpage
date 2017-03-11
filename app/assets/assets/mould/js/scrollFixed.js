$(function () {
    $('.navslist').scrollFixed({
        top: 40,
        distance: 55
    });
});
(function ($) {
    $.fn.scrollFixed = function () {

        var opt = {
            top: 0,
            distance: 0
        },
        elem = this,t=[];
        for(var i=0;i<elem.length;i++){
            t.push(elem.eq(i).offset().top);
        }
        elem.css({ position: 'static', top: 0 });
        
        //var t = elem.offset().top;

        $.extend(opt, arguments[0] || {});

        function set(){
            elem.each(function(i){
                // if(t[i+1]){
                //     if(($(window).scrollTop() + opt.distance) > t[i] && ($(window).scrollTop()<t[i+1]-400)){
                //         $(this).css({
                //             top: opt.top + 'px',
                //             position: 'fixed'
                //         });
                //     } else {
                //         $(this).css({
                //             top: 0,
                //             position: 'static'
                //         });
                //     } 
                // } else {
                //      if(($(window).scrollTop() + opt.distance) > t[i]){
                //         $(this).css({
                //             top: opt.top + 'px',
                //             position: 'fixed'
                //         });
                //     } else {
                //         $(this).css({
                //             top: 0,
                //             position: 'static'
                //         });
                //     } 
                // }
                if($(window).scrollTop()+opt.distance>t[i]){
                    $(this).css({
                        top:opt.top+'px',
                        position:'fixed'
                    });
                } else {
                    $(this).css({
                        top: 0,
                        position: 'static'
                    });
                }                
            });            
        }

        $(window).on('scroll', set);

        set();
    };
})(window.jQuery);