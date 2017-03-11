var datePicker = {
    /*
    callbackFn：回调函数，发生变化的时候回调的方法
    caller：执行回调函数的对象。缺省为window
    */
    init: function (callbackFn, caller) {
        //默认参数
        var defopt = { format: "YYYYMMDD" };
        if ($('#reportrange').length == 0)
            return false;
        if ($('#reportrange').attr('data-format') != undefined) {
            console.log($('#reportrange').attr('data-format'))
            defopt.format = $('#reportrange').attr('data-format')
        }
        $('#reportrange').daterangepicker({
            opens: (Metronic.isRTL() ? 'left' : 'right'),
            //startDate: moment().subtract('days', 29),
            startDate: moment().subtract('days', 7),
            endDate: moment().subtract('days', 1),
            minDate: '2010-01-01',
            maxDate: moment(),
            dateLimit: {
                days: 400
            },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                '近7天': [moment().subtract('days', 7), moment().subtract('days', 1)],
                '近30天': [moment().subtract('days', 30), moment().subtract('days', 1)],
                '当月': [moment().startOf('month'), moment().subtract('days', 1)],
                '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            buttonClasses: ['btn'],
            applyClass: 'green',
            cancelClass: 'default',
            format: 'YYYY-MM-DD',
            separator: ' 至 ',
            locale: {
                applyLabel: '选定日期',
                cancelLabel: '取消',
                fromLabel: '开始日期',
                toLabel: '结束日期',
                customRangeLabel: '自定义日期',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 1
            }
        }, function (start, end) {
            setDate(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
        }
        );

        function setDate(start, end) {
            var sd = start, ed = end;
            var outsd = start, outed = end;
            if (defopt.format == "YYYYMMDD") {
                if (start) {
                    outsd = start.toString().replace(new RegExp(/-/g), "");
                }
                if (end) {
                    outed = end.toString().replace(new RegExp(/-/g), "");
                }
            }
            $('#reportrange span').html(sd + ' - ' + ed);
            var results = [];
            results.push({ id: "sdate", text: "开始日期", value: outsd });
            results.push({ id: "edate", text: "结束日期", value: outed });

            caller || (caller = window);
            if (typeof callbackFn == "function") {
                //modify by ly 
                callbackFn.call(caller, "date", results);
            }
            if ($('#startDate').length > 0) {
                $('#startDate').val(start);
                $('#endDate').val(end);
                $('#reportrange span').html(start + ' - ' + end);
            }
        }
        var startTemp = moment().subtract('days', 7).format('YYYY-MM-DD');
        var endTemp = moment().subtract('days', 1).format('YYYY-MM-DD');
        setDate(startTemp, endTemp);

    },
    init_month: function () {
        $('#reportrange').daterangepicker({
            opens: (Metronic.isRTL() ? 'left' : 'right'),
            startDate: moment().subtract('month', 1).startOf('month'),
            endDate: moment().subtract('month', 1).endOf('month'),
            minDate: '2010-01-01',
            maxDate: moment(),
            dateLimit: {
                days: 400
            },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                '近3月': [moment().subtract('month', 3).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            buttonClasses: ['btn'],
            applyClass: 'green',
            cancelClass: 'default',
            format: 'YYYY-MM',
            separator: ' 至 ',
            locale: {
                applyLabel: '选定日期',
                cancelLabel: '取消',
                fromLabel: '开始日期',
                toLabel: '结束日期',
                customRangeLabel: '自定义日期',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 1
            }
        },
            function (start, end) {
                $('#startDate').val(start.format('YYYY-MM'));
                $('#endDate').val(end.format('YYYY-MM'));
                $('#reportrange span').html(start.format('YYYY-MM') + ' - ' + end.format('YYYY-MM'));
            }
        );
        $('#reportrange span').html(moment().subtract('month', 1).startOf('month').format('YYYY-MM') + ' - ' + moment().subtract('month', 1).startOf('month').format('YYYY-MM'));
        $('#startDate').val(moment().subtract('month', 1).startOf('month').format('YYYY-MM'));
        $('#endDate').val(moment().subtract('month', 1).startOf('month').format('YYYY-MM'));
    }
}
