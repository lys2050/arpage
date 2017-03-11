function DoRequest4Ajax(resType, url, params, callBackFn) {
    resType || (resType == "post");

    $.ajax({
        type: resType,
        dataType: "json",
        cache: false,
        url: url + (new Date()).getTime(),
        data: { "selType": "ref" },
        success: function (result) {
            console.log(result);
        },
        error: function (xmlRes, err, ex) {
            //console.log("请求失败！，异常信息为：" + err + "" + ex.message);
        }
    });
}

//设置图表全局数据
Highcharts.setOptions({
    global: {
        useUTC: false
    },
    chart: {
        type: 'spline',
        style: {
            fontFamily: 'Arial,宋体'
            , fontSize: "14px"
            , color: '#999999'
        },
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10
    },
    colors: ["#44BCF4", "#64E572", "#FF6600"],
    credits: {
        enabled: false
    },
    yAxis: {
        min: 0,
        title: {
            align: 'high'
            , rotation: 0
            , y: -20
            , offset: 10
        },
        labels: {
            formatter: function () {
                return Highcharts.numberFormat(this.value, 0);
            }
        }
    },
    //            plotOptions: {
    //                series: {
    //                    marker: {
    //                        enabled: false
    //                    }
    //                }
    //            },
    tooltip: {
        formatter: function () {
            var s = [];
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%H:%M', this.x) + '<br/>PV：' +
                Highcharts.numberFormat(this.y, 0);
        }
    },
    legend: {
        enabled: true
    },
    exporting: {
        enabled: false
    }
});
/**
* Format a number and return a string based on input settings
* @param {Number} number The input number to format
* @param {Number} decimals The amount of decimals
* @param {String} decPoint The decimal point, defaults to the one given in the lang options
* @param {String} thousandsSep The thousands separator, defaults to the one given in the lang options
*/
function numberFormat(number, decimals, decPoint, thousandsSep) {
 
    if (number === "-")
    {
        return '-';
    }
    var lang = {
        decimalPoint: '.',
        thousandsSep: ','
    }, mathAbs = Math.abs,
    // http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
    n = +number || 0,
    c = decimals === -1 ?
        (n.toString().split('.')[1] || '').length : // preserve decimals
        (isNaN(decimals = mathAbs(decimals)) ? 0 : decimals),
    d = decPoint === undefined ? lang.decimalPoint : decPoint,
    t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = mathAbs(n).toFixed(c), 10)),
    j = i.length > 3 ? i.length % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
    (c ? d + mathAbs(n - i).toFixed(c).slice(2) : "");
}

//阻止浏览器默认行为，主要解决超链接锚定位问题
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

/**
* 普通ajax表单提交
* @param {Object} form
* @param {Object} callback
* @param {String} confirmMsg 提示确认信息
*/
function validateCallback(form, callback, loadingObj, confirmMsg) {
    Metronic.blockUI({
        target: '.row',
        boxed: true
    });

    window.setTimeout(function () {
        Metronic.unblockUI('.row');
    }, 1000);
    var $form = $(form);
    var _submitFn = function () {

        $.ajax({
            type: form.method || 'POST',
            url: $form.attr("action") + "?_=" + (new Date()).getTime(),
            data: $form.serializeArray(),
            dataType: "json",
            cache: false,
            //success: callback || Index._ajaxDone,
            success: function (json) {
                //if (json.statusCode == Index.statusCode.timeout) {
                //    alert("登录超时或未登录！请重新登录！");
                //    window.location.href = "Login.html";
                //}
                callback(json, loadingObj);
            }
            //, error: Index._ajaxError
        });
    }
    _submitFn();
    //if (confirmMsg) {
    //    alertMsg.confirm(confirmMsg, { okCall: _submitFn });
    //} else {
    //    _submitFn();
    //}
    return false;
}
$.extend($.fn.dataTable.defaults, {
    searching: false,
    ordering: false
});

function DrawTable(jqObj, option) {
  
    option = option || { data: [] };

    var table = $.fn.dataTable.fnTables(true);
    if (table.length > 0) {
        $(table).dataTable().fnDestroy();
    }

    var defaultOpt = {

   
        //分页 
        bProcessing: true,
        // bServerSide: true,
        "sPaginationType": "full_numbers",//分页样式
        paging: true,
        searching: false,
        bDestroy: true,
        
        //"aoColumnDefs": [
        //    { "bVisible": false, "aTargets": [0] }],
      //  bAutoWidth: false,
       // sScrollY: "420px",     //水平、垂直滚动条
       // sScrollX: "180%",
        //"sScrollXInner": "100%",
        bScrollCollapse: true,
        //bServerSide: true,

        /*使用post方式
    "fnServerData": function ( sSource, aoData, fnCallback ) {
        $.ajax( {
            "dataType": 'json',
            "type": "POST",
            "url": sSource,
            "data": aoData,
            "success": fnCallback
        } );
    }*/
     //   sAjaxSource: "Data/DataControl.ashx",
        sPaginationType: "full_numbers",
        language: { // language settings
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "　",
            "sInfo": "显示 <b>_START_</b> 到 <b>_END_</b> 共 <b>_TOTAL_</b> 条记录",
            "sInfoEmpty": "显示 0 到 0 共 0 条记录",
            "sInfoFiltered": "(从 _MAX_ 条记录过滤)",
            "sEmptyTable": "没有符合条件的数据...",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            },
            "sSearch": "查询：",
            "sProcessing": "<img src='assets/admin/layout/img/loading.gif' />"
        },
        aoColumnDefs: [
              { "bSortable": false, "aTargets": [0] } ,//第一列不排序
        ],
       


        iDisplayLength: 20,
        aLengthMenu: [10, 20, 50, 100]//每页显示的条目数
    
        , bRetrieve: true
        //"aoColumnDefs": [{
        //    "fnRender": function (oObj, sVal) {
        //        alert(oObj.aData[0])
        //        alert(sVal)
        //        return '<span>' + oObj.aData[0].Format("yyyy-MM-dd") + '</span>'
        //    }
        //}]


    
    };

    option = $.extend(true, {}, defaultOpt, option);

    jqObj.DataTable(option);
}



function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}