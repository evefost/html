/**
 * Created by vacant on 2016-7-26.
 */
/**
 * 我的工作台
 */
define([
    'appPath/common/commonMethods',
    'echarts',
    'dataChart',
    'jqueryAjax',
    'component-message',
    'component-datetimerpicker',
    'jquery.semantic'], function (cMethod, echarts, dataChart, jqueryAjax, cMessage, cDateTimerPicker) {
    var getQueryData = function () {
            return {
                startDate: '',
                endDate: '',
                rangeType: 'PARK'
            }
        },
        trendChart = {
            type: 'line',
            tooltip: {
                trigger: 'axis',
                formatter: '时间: {b}<br />{a}: {c}'
            },
            xAxis: {
                data: null,
            },
            yAxis: {
                axisLabel: {
                    formatter: function(value) {
                        return value + " 个";
                    }
                }
            },
            series:
            {
                name: "订单数",
                data: null
            },
        },
        shareChart = {
            type: 'pie',
            series: [
                {
                    name: '工单数量',
                    data: null,
                },
            ]
        },
        rankChart = {
            type: 'bar',
            xAxis: {
                boundaryGap: [0, 0.2]
            },
            yAxis: {
                data: ["石岩园区", "公明园区", "龙华园区", "龙岗园区", "西乡园区"]
            },
            series: {
                name: "订单数量",
                data: [777, 656, 653, 453, 55]
            },
        },
        vm = avalon.define({
            $id: 'overview',
            grossData: {
                totalUserCount: null,
                parkCount: null,
                monthUserCount: null,
                orderCount: null
            },
            queryData: getQueryData(),
            trendData: null,
            shareData: null,
            rankData: null,
            search: function () {
              drawChart();
            },
            byMonth: false,
            countBy: function() {
                vm.byMonth = !vm.byMonth;
            },
            chartData: {
                dataTrend: {
                    startDate: '',
                    endDate: '',
                    service: 'repairing',
                    by: 'week'
                },
                zoneShare: {
                    startDate: '',
                    endDate: '',
                    service: 'repairing',
                    by: 'quantity'
                },
                zoneRank: {
                    startDate: '',
                    endDate: '',
                    service: 'repairing',
                    by: 'quantity'
                }
            },
            drawChart: function(type, param) {
                if (type === 'dataTrend') {
                    if (param === vm.chartData.dataTrend.by) {
                        return;
                    }
                    vm.chartData.dataTrend.by = param;
                }
                vm.chartType[type]();
            },
            chartType: {
                dataTrend: function () {
                    console.log('Draw Data Trend');
                },
                zoneShare: function () {
                    console.log('Draw Zone Share');
                },
                zoneRank: function () {
                    console.log('Draw Zone Rank');
                }
            }
        });


    function drawChart() {
        var trend = {
                startDate: vm.queryData.startDate,
                endDate: vm.queryData.endDate,
                rangeType: vm.queryData.rangeType,
                chartType: '1'
            },
            share = {
                startDate: vm.queryData.startDate,
                endDate: vm.queryData.endDate,
                rangeType: vm.queryData.rangeType,
                chartType: '2'
            },
            rank = {
                startDate: vm.queryData.startDate,
                endDate: vm.queryData.endDate,
                rangeType: vm.queryData.rangeType,
                chartType: '3'
            }
        // 折线图
        jqueryAjax.get(
            window.currentApiUrl.overview.chartLine,
            trend,
            function(resp) {
                if (resp.status === 200) {
                    vm.trendData = resp.data.results;
                    trendChart.xAxis.data = vm.trendData.months;
                    trendChart.series.data = vm.trendData.values;

                    // 订单趋势
                    dataChart('data-trend', trendChart);
                } else {
                    cMethod.showPopupMessage('error', resp.message);
                }
            },
            function (resp, msgType) {
                cMessage.showPopup({
                    className: msgType,
                    content: resp.message
                });
            }
        )
        // 饼图
        jqueryAjax.get(
            window.currentApiUrl.overview.chartPie,
            share,
            function(resp) {
                if (resp.status === 200) {
                    vm.shareData = resp.data.results.result;
                    shareChart.series[0].data = vm.shareData;

                    // 园区订单占比
                    dataChart('zone-share', shareChart);
                } else {
                    cMethod.showPopupMessage('error', resp.message);
                }
            },
            function (resp, msgType) {
                cMessage.showPopup({
                    className: msgType,
                    content: resp.message
                });
            }
        )
        // 柱状图
        jqueryAjax.get(
            window.currentApiUrl.overview.chartBar,
            rank,
            function(resp) {
                if (resp.status === 200) {
                    vm.rankData = resp.data.results.result;
                    var i, labelData = [], seriesData = [];
                    for (i = 0; i < vm.rankData.length; i++) {
                        labelData.push(vm.rankData[i].name);
                        seriesData.push(vm.rankData[i].value);
                    }
                    rankChart.yAxis.data = labelData;
                    rankChart.series.data= seriesData;
                    // 园区排名
                    dataChart('zone-rank', rankChart);
                } else {
                    cMethod.showPopupMessage('error', resp.message);
                }
            },
            function (resp, msgType) {
                cMessage.showPopup({
                    className: msgType,
                    content: resp.message
                });
            }
        )
    }
    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
            drawChart();
            // 柱状图
            jqueryAjax.get(
                window.currentApiUrl.overview.grossData,
                null,
                function(resp) {
                    vm.grossData = resp.data.results;
                },
                function (resp) {

                }
            )
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            // 基于准备好的dom，初始化echarts实例
            // 指定图表的配置项和数据


            $('.ui.dropdown').dropdown();
            cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');

        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});