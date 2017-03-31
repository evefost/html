define(['echarts', 'jquery'], function(echarts, $) {
    // id, 容器元素的 id
    // options, 图表参数选项
    return function(id, options) {
        var chart = echarts.init(document.getElementById(id)),
            defaults = {
                line: {
                    xAxis: {
                        splitLine: {show: false}
                    },
                    yAxis: {
                        axisLable: {
                            show: 'auto',
                            interval: 'auto'
                        }
                    },
                    series: {
                        type: 'line',
                        itemStyle: {
                            normal: {
                                label: {show: true}
                            }
                        },
                        symbol: 'rect'
                    }
                },
                bar: {
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {type: 'shadow'}
                    },
                    series: {
                        type: 'bar',
                        barMaxWidth: 12,
                        itemStyle: {
                            normal: {
                                color: "#ED7D31"
                            }
                        }
                    }
                },
                pie: {
                    tooltip: {show: true},
                    series: [
                        {
                            type: 'pie',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: '{b} {d}%',
                                    },
                                    labelLine: {show: true}
                                }
                            }
                        }
                    ]
                }
            };

        // 覆盖默认的选项
        defaults[options.type] = $.extend(true, defaults[options.type], options);
        chart.setOption(defaults[options.type]);
    }
})