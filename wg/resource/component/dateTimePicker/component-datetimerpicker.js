/**
 * 日历控件
 * 基于bootstrap datetimepicker
 */
define(['bootstrap-datetimepicker','bootstrap-datetimepicker.zh-CN'],function(){
    'use strict';
    return {
        /**
         * 初始化日历控件
         * @param contrainer 容器ID
         * @param format 格式化
         * @param startDate 开始时间【限制日历选择的日期的开始范围】
         * @param endDate 结束时间【限制日历选择的日期的结束范围】
         */
        initDateTimePicker : function(contrainer,format,startDate,endDate){
            var viewNum = 0,
                minView = 0,
                todayBtn = 1,
                daysOfWeekDisabled = [];
            //daysOfWeekDisabled = [0,6];
            /*if(!endDate){
             endDate = moment().format('YYYY-MM-DD') ;
             }*/
            switch(format){
                case 'yyyy': //年
                    viewNum = 4;
                    minView = 4;
                    break;
                case 'yyyy-mm': //月
                    viewNum = 3;
                    minView = 3;
                    break;
                case 'yyyy-mm-ww': //周
                    format = 'yyyy-mm-dd';
                    viewNum = 2 ;
                    minView = 2;
                    todayBtn = 0;
                    daysOfWeekDisabled = [0,2,3,4,5,6];
                case 'yyyy-mm-dd': //日
                    viewNum = 2;
                    minView = 2;
                    break;
                case 'yyyy-mm-dd hh:ii': //日
                    viewNum = 2;
                    minView = 0;
                    break;
                case 'yyyy-mm-dd hh:ii:ss': //日
                    viewNum = 2;
                    minView = 0;
                    break;
            }
            //清除所有datetimepicker已存在控件
            $('div.datetimepicker').remove();
            $(contrainer).datetimepicker('remove');
            $(contrainer).datetimepicker({
                language:  'zh-CN',
                weekStart: 0,
                todayBtn:  todayBtn,
                autoclose: 1,
                todayHighlight: 1,
                forceParse: 1,
                daysOfWeekDisabled : daysOfWeekDisabled,
                format:  format,
                startDate:startDate,
                endDate:endDate,
                startView: viewNum,
                minView: minView
            });
        },
        /**
         * 移除所有页面上的时间控件
         * 正常情况下调用,就可以在每次初始化时候移除:$(contrainer).datetimepicker('remove');就可以在每次初始化时候移除
         * but 在angularjs下无效，所以需要手动清除
         */
        clearAllDateTimePicker:function(){
            $('div.datetimepicker').remove();
        }
    }
});