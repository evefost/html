define(['bootstrap-daterangepicker'], function() {
    var getDateToday = function(now) {
        if (typeof now === 'number') {
            now = new Date(now);
        }

        var year = now.getFullYear(),
            month = now.getMonth() + 1,
            day = now.getDate();
        return [year, month, day].join('-');
    };

    var msPerDay = 24 * 3600 * 1000,
        msPerWeek = 7 * msPerDay;

    return {
        initDateRangePicker: function(el, format, startDate, endDate) {
            var dateFormat = format || 'YYYY-MM-DD';

            $(el).daterangepicker({
                'locale': {
                    'format': dateFormat,
                    'daysOfWeek': [
                        '日',
                        '一',
                        '二',
                        '三',
                        '四',
                        '五',
                        '六'
                    ],
                    'monthNames': [
                        '一月',
                        '二月',
                        '三月',
                        '四月',
                        '五月',
                        '六月',
                        '七月',
                        '八月',
                        '九月',
                        '十月',
                        '十一月',
                        '十二月'
                    ],
                    'customRangeLabel': '自定义',
                    'firstDay': 1
                },
                ranges: {
                    '今天': [
                        getDateToday(new Date),
                        getDateToday(new Date)
                    ],

                    '最近一周': [
                        getDateToday(Date.now() - msPerWeek),
                        getDateToday(new Date)
                    ],

                    '最近两周': [
                        getDateToday(Date.now() - 2 * msPerWeek),
                        getDateToday(new Date)
                    ],
                    '最近30天': [
                        getDateToday(Date.now() - 30 * msPerDay),
                        getDateToday(new Date)
                    ],
                    '最近一年': [
                        getDateToday(Date.now() - 365 * msPerDay),
                        getDateToday(new Date)
                    ]
                },
                autoApply: true,
                autoUpdateInput: false,
                showCustomRangeLabel: false,
                alwaysShowCalendars: true,
            })

            $(el).on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.startDate.format('YYYY-MM-DD') + ' ~ ' + picker.endDate.format('YYYY-MM-DD'));
            }).on('cancel.daterangepicker', function(ev, picker) {
                $(this).val('');
            });
        }
    }
});
