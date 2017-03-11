$(function () {
    //±êÇ©Ò³ÇÐ»»
    $('.nav-pills-tab').hide();
    $('.nav-pills-tab').eq(0).show();
    $('.nav-tabs li').click(function () {
        $('.nav-tabs li').removeClass('active');
        $(this).addClass('active');
        var selected = $(this).index();
        $('.nav-pills-tab').hide();
        $('.nav-pills-tab').eq(selected).show();
    });
    //html×ªcode
    //$('.ws-code-html').eq(0).html($('.ws-code-html').html().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/^\s{10}/mg, ''));
    $('.ws-code-html').each(function (index,aEle) {
        $(this).html($('.ws-code-html').html().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/^\s{3}/mg, ''));
    });
    $('.ws-code pre[class!="ws-code-html"]').each(function () {
        var that = $(this);
        that.html(that.html().replace(/^\s{3}/mg, ''));
    });
});
