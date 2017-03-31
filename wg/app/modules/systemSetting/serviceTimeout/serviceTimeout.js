define([
    'jqueryAjax',
    'appPath/common/commonMethods',
], function(jqueryAjax, cMethod) {
    var tbody = '',
        vm = avalon.define({
            $id: 'serviceTimeout',
            timeAmount: [
                {name: '20分钟', value: 20},
                {name: '30分钟', value: 30},
                {name: '1个小时', value: 60},
                {name: '2个小时', value: 120},
                {name: '5个小时', value: 300},
                {name: '8个小时', value: 480},
                {name: '3天', value: 4320},
            ],
            configMap: {
                UNSEND_TIMEOUT: {
                    name: '超时未派',
                    data: null,
                },
                UNRECEIVE_TIMEOUT: {
                    name: '超时未接',
                    data: null,
                },
                UNFEEDBACK_TIMEOUT: {
                    name: '超时未反馈',
                    data: null,
                }
            },
            save: function() {
                var data = {
                    configList: []
                };
                for (var p in vm.configMap) {
                    for (var i=0, len=vm.configMap[p].data.length; i < len; i++) {
                        var v = vm.configMap[p].data[i];
                        data.configList.push({id: v.id, configValue: v.configValue});
                    }
                }
                jqueryAjax.post(
                    window.currentApiUrl.timeoutConfig.saveConfig,
                    data,
                    function (response, msgType, isOk) {
                        if (response.status === 200) {
                            cMethod.showPopupMessage('success', response.message);
                        } else {
                            cMethod.showPopupMessage('error', response.message);
                        }
                    }, function (response, msgType) {
                        cMessage.showPopup({
                            className: msgType,
                            content: response.message
                        });
                    });
            }
        });

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            setTimeout(function() {
                $('.ui.dropdown').dropdown();
            }, 200);

            // 获取超时设定
            $.ajax({
                url: window.currentApiUrl.timeoutConfig.getConfig,
                type: 'GET',
                success: function(data) {
                    var map = data.data.results.configMap;
                    for (var type in map) {
                        vm.configMap[type].data = map[type];
                    }
                }
            });

        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})