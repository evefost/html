define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-wangeditor'
], function(jqueryAjax, cMethod, cMessage, richEditor) {
    var editor,
        vm = avalon.define({
            $id: 'settledSetting',
            settledData: {},
            save: function () {
                var formData = new FormData($('#settledForm')[0]);
                $.ajax({
                    url: window.currentApiUrl.settledSetting.sSettledSave,
                    type: 'POST',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            cMethod.showPopupMessage('success', data.message);
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });
            }
        });

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            // 组件初始化
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

            $.ajax({
                url: window.currentApiUrl.settledSetting.sSettledGet,
                type: 'GET',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.status === 200) {
                        vm.settledData = data.data.results;
                        editor.$txt.html(vm.settledData.content);
                    } else {
                        cMethod.showPopupMessage('error', data.message);
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