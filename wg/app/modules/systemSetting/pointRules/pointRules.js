define([
    'appPath/common/commonMethods',
    'component-wangeditor'
], function(cMethod, richEditor) {
    var editor, rulesObj = ['id', 'serviceName', 'pointsGain', 'pointsPay'];
    var vm = avalon.define({
        $id: 'scoreRule',
        pointRules: null,
        getRules: function () {
            $.ajax({
                url: window.currentApiUrl.pointRules.getRules,
                success: function (rule) {
                    vm.pointRules = rule.data.results;
                    editor.$txt.html(vm.pointRules.pointRulesIntroduction);
                }
            })
        },
        saveRules: function () {
            var savedRules = {
                timeRules: [],
                moneyRules: [],
                pointRulesIntroduction: ''
            };
            if (!editor.$txt.text().trim()) {
                cMethod.showPopupMessage('error', '请填写积分规则');
                return;
            }

            $('div.timeRules').each(function(i, el) {
                savedRules.timeRules[i] = savedRules.timeRules[i] || {};
                $(el).find('input').each(function (index, input) {
                    var name = $(input).attr('name');
                    savedRules.timeRules[i][name] = $(input).hasClass('number') ? Number(input.value) : input.value;
                })
            })

            $('div.moneyRules').each(function(i, el) {
                savedRules.moneyRules[i] = savedRules.moneyRules[i] || {};
                $(el).find('input').each(function (index, input) {
                    var name = $(input).attr('name');
                    savedRules.moneyRules[i][name] = $(input).hasClass('number') ? Number(input.value) : input.value;
                })
            })
            savedRules.pointRulesIntroduction = editor.$txt.html();
            $.ajax({
                url: window.currentApiUrl.pointRules.saveRules,
                type: 'POST',
                data: JSON.stringify(savedRules),
                cache: false,
                async: false,
                processData: false,
                contentType: 'application/json;charset=UTF-8',
                success: function (data) {
                    if (data.status === 200) {
                        cMethod.showPopupMessage('success', '保存成功');
                    }
                }
            });
        },
    });

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            editor = richEditor.initWangEditor({
                container: 'description',
                hideInsertImg:true,
                //hideFullscreen:true,
                uploadUrl:window.currentApiUrl.commonUploadFile,
                uploadErrorCallback:function (msg) {
                    cMessage.showPopup({
                        className: 'error',
                        content: msg
                    });
                }
            });

            vm.getRules();
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})