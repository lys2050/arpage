$('#reportrange').daterangepicker({
        opens: (Metronic.isRTL() ? 'left' : 'right'),
    //startDate: moment().subtract('days', 29),
        startDate: '2014-10-01',
        endDate: moment(),
        minDate: '2014-10-01',
        maxDate: '2014-12-31',
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            '今天': [moment(), moment()],
            '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
            '近7天': [moment().subtract('days', 6), moment()],
            '近30天': [moment().subtract('days', 29), moment()],
            '当月': [moment().startOf('month'), moment().endOf('month')],
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
    },
    function (start, end) {
        $('#startDate').val(start.format('YYYY-MM-DD'));
        $('#endDate').val(end.format('YYYY-MM-DD'));
        $('#reportrange span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
    }
);
//Set the initial state of the picker label
$('#reportrange span').html('2014-10-01' + ' - ' + moment().format('YYYY-MM-DD'));
$('#startDate').val('2014-10-01');
$('#endDate').val(moment().format('YYYY-MM-DD'));