/*
* 表格模块
* 示例：
    var option = {
        //列头
        "columns": [
                    { "title": "日期" },
                    { "title": "自由光" },
                    { "title": "XC60" },
                    { "title": "奥迪Q5" }],
        //数据数组
        "data": ['2014-08-08', '3%', '3%', '4%', '5.5%'], 
        //表格容器
        "container": "tbcontainer"
    };
    //调用
    $.table(option);
*/
define('table', ['jquery', 'jqtable'], function (require, exports, module) {
    var $ = require('jquery');
    //外部接口
    $.table = function (option) {
        //参数配置验证
        if (option.container == null || option.container == undefined
            || option.columns == null || option.columns == undefined) {
            return false;
        }
        var _tbnode = "<table id=\"example\" class=\"display compact hover cell-border\" cellspacing=\"5\" width=\"100%\">\</table>";
        $("#" + option.container).html(_tbnode);
        var options = $.extend(option, $.table._defaults);
        $('#example').dataTable(options);
        $('#example_length').remove();
    }
    //默认参数
    $.table._defaults = {
        "bFilter": false, "bSort": false, "pagerPosition": "top", "oLanguage": {
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
    };
    module.exports = $;
});
