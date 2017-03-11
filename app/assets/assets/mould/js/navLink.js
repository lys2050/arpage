$(function () {
    var ifm = document.getElementById("moduleBoxChild");
    $(ifm).load(function () {
        var ifm = document.getElementById("moduleBoxChild");
        var subWeb = document.frames ? document.frames["moduleBoxChild"].document : ifm.contentDocument;
        if (ifm != null && subWeb != null) {
            ifm.height = subWeb.body.scrollHeight + 30;
        }
        var iframeWin = window.frames['moduleBoxChild'];
        $(iframeWin.document).find('a[data-link$="-module"]').click(Jump);
    });
    
    var data = {};
    $('a[data-link$="-module"]').each(function (index, value) {
        var that = $(this);
        if (data[that.attr('data-link')]) return true;
        var jsonBox = [];
        that.find('span').each(function (index,value) {
            var arr = $(this).html().split(':');
            var json = {};
            json[arr[0]] = arr[1];            
           jsonBox.push(json);
        });
        data[that.attr('data-link')] = jsonBox;
        that.find('span').hide();
    });
    console.log(data);
    function Jump(e) {
        if ($(this).attr('data-link') == 'global-module') {
            $('#moduleBox').removeClass('column').removeClass('grid-19');
            $('#left').hide();
            $('#basics .row:eq(0)').hide();
        } else {
            $('#left').show();
            $('#basics .row:eq(0)').show();
            $('#moduleBox').addClass('column').addClass('grid-19');
        }
        var that = $(this);
        var name = '';
        switch ($(this).attr('data-link')) {
            case 'widget-module':
                name = '控件';
                break;
            case 'global-module':
                name = '全局规范';
                break;
            case 'table-module':
                name = '模板';
                break;
            case 'form-module':
                name = '报表在线生成';
                break;
            case 'm-module':
                name = '移动端支持';
                break;
            default:
                break;

        }
        $('h2.zt-title-zy').html(name);
        //$('h2.zt-title-zy').html(that.get(0).childNodes[0].nodeValue);
        $('#navslist ul').html('<li class="navslist-title">' + name + '使用列表</li>');
        for (var name in data) {
            if ($(this).attr('data-link') == name) {
                for (var i = 0; i < data[name].length; i++) {
                    for (var mouldName in data[name][i]) {
                        $('<li data-link="' + mouldName + '"><a href="javascript:;">' +
                            data[name][i][mouldName] + '<i class="icon-navselist-rt"></i></a></li>').appendTo($('#navslist ul'));
                    }
                }
            }
        }       
        $('#navslist li:gt(0)').on('click', function () {
            var linkName = $(this).attr('data-link');
            var url = linkName + '.html'; 
            $('#moduleBox iframe').get(0).src = url;

        });
        $("#navslist li:eq(1)").trigger("click");
        e.preventDefault();
    }
    $('a[data-link$="-module"]').on('click', Jump);
    $('a[data-link="global-module"]').trigger('click');
    $('.navs-child').hide();

});
  