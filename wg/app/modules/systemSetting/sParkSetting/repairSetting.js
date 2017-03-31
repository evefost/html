define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-wangeditor'
], function(jqueryAjax, cMethod, cMessage, cDataTable, richEditor) {
    var table,
        editor,
        map,
        getQueryData = function () {
            return {
                parkId: '',
                serviceName: '',
                supportType: '0',
                status: '0'
            }
        },
        getNewServiceData = function () {
            return {
                id: '',
                parkId: '',
                serviceName: '',
                supportType: 'PARK',
                supplierIds: '',
                header: ''
            }
        },
        vm = avalon.define({
            $id: 'repairSetting',
            queryData: getQueryData(),
            commonData: cMethod.getRoleData(),
            repairData: {},
            serviceData: {},
            supplierList: [],
            isEdit: false,
            search: function (event) {
                event.preventDefault();
                table.draw();
            },
            reset: function (event) {
                event.preventDefault();
                vm.queryData = getQueryData();
                $('.ui.dropdown').dropdown('restore default value');
            },
            save: function () {
                var formData = new FormData($('#repairForm')[0]);
                $.ajax({
                    url: window.currentApiUrl.sRepairSetting.saveContent,
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
            },
            showAddWin: function (event) {
                event.preventDefault();
                vm.serviceData = getNewServiceData()
                vm.serviceData.parkId = vm.repairData.parkId;
                vm.serviceData.header = '新增维修种类';

                $('.ui.dropdown').dropdown('setting', {direction: 'upward'});
                $('#supplierList').dropdown('set exactly', '')

                var success = true;
                var editModal = $('#serviceModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        if (!vm.serviceData.serviceName) {
                            cMethod.showPopupMessage('error', '请填写维修种类');
                            return false;
                        }
                        var formData = new FormData($('#serviceForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.sRepairSetting.saveService,
                            type: 'POST',
                            data: formData,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.status === 200) {
                                    cMethod.showPopupMessage('success', data.message);
                                    table.draw();
                                } else {
                                    cMethod.showPopupMessage('error', data.message);
                                    success = false;
                                }
                            }
                        });
                        return success;
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                }).modal('show');
            },
            showEditWin: function (rowData) {
                vm.serviceData = rowData;
                vm.serviceData.header = '修改维修种类'

                setTimeout(function() {
                    $('.ui.dropdown').dropdown('setting', {direction: 'upward'});
                    try {
                        $('#supplierList').dropdown('set exactly', vm.serviceData.supplierIds.split(','))
                    } catch (e) {}
                }, 200)

                var success = true;
                var editModal = $('#serviceModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        if (!vm.serviceData.serviceName) {
                            cMethod.showPopupMessage('error', '请填写维修种类');
                            return false;
                        }
                        var formData = new FormData($('#serviceForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.sRepairSetting.saveService,
                            type: 'POST',
                            data: formData,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.status === 200) {
                                    cMethod.showPopupMessage('success', data.message);
                                    table.draw();
                                } else {
                                    cMethod.showPopupMessage('error', data.message);
                                    success = false;
                                }
                            }
                        });
                        return success;
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                }).modal('show');
            },
            switchStatus: function (rowData) {
                var newStatus;
                if (rowData.useStatus == 'NO') {
                    newStatus = 'YES';
                } else if (rowData.useStatus == 'YES') {
                    newStatus = 'NO';
                }

                $.ajax({
                    url: window.currentApiUrl.sRepairSetting.startOrStop,
                    type: 'GET',
                    data: 'id=' + rowData.id + '&useStatus=' + newStatus,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        console.log(data);
                        if (data.status === 200) {
                            table.draw();
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });
            },
            /*showDisenableWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要禁用当前服务?',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.adManagement.adPutOff,
                            {id: id},
                            function (response, msgType, isOk) {
                                table.draw();
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                    }
                });
            },
            showEnableWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要启用当前服务?',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.adManagement.adPutOn,
                            {id: id},
                            function (response, msgType, isOk) {
                                table.draw();
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                    }
                });
            },*/
        });

    var baseTableOpts = {
        isShowIndexNumber: true,
        columns: [
            {field: null, title: '序号', isShow: true, isSort: false},
            {field: 'serviceName', title: '维修服务种类', isShow: true, isSort: false},
            {field: 'supportType', title: '服务提供商', isShow: true, isSort: false, render: function(val) {
                if (val == 'PARK') {
                    return '园区物业';
                } else if (val == 'SUPPLIER') {
                    return '供应商';
                }
            }},
            {field: 'createTime', title: '新建时间', isShow: true, isSort: false},
            {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
            {field: 'useStatus', title: '设置状态', isShow: true, isSort: false, render: function(val) {
                if (val == 'NO') {
                    return '已禁用';
                } else if (val == 'YES') {
                    return '已启用';
                }
            }},
            {field: 'useStatus', title: '操作', isShow: true, isSort: false, width: '180px', render: function(val) {
                var status = val === 'YES' ?
                    '<i class="icon switch unlock" title="禁用"></i>'
                    : '<i class="icon switch lock orange" title="启用"></i>';
                return '<div class="tr-operation">' +
                    status +
                    '<i class="icon edit green" title="修改"></i>' +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.sRepairSetting.serviceList,
            type: 'GET',
            data: function (data) {
                data.pageNo = data.start / data.length + 1;
                data.pageSize = data.length;
                $.extend(data, vm.queryData);
            }
        },
        operationCallback: function (e, rowData) {
            if (rowData) {
                var target = $(e.target);
                if (target.hasClass('icon edit')) {
                    vm.showEditWin(rowData);
                } else if (target.hasClass('icon switch')) {
                    vm.switchStatus(rowData);
                }
            }
        }
    };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function (data) {
            vm.queryData.parkId = data.parkId;
            jqueryAjax.get(
                window.currentApiUrl.repairSetting.supplierList,
                {},
                function (response) {
                    vm.supplierList = response.data.result;
                },
                function (response, msgType) {
                    cMessage.showPopup({
                        className: msgType,
                        content: response.message
                    });
                }
            )
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            // 组件初始化
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            }, 200);
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
            // 获取表格数据
            table = cDataTable.initBaseTable(baseTableOpts);
            // 获取初始数据
            $.ajax({
                url: window.currentApiUrl.sRepairSetting.repairDetail,
                type: 'GET',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.status === 200) {
                        vm.repairData = data.data.parkInfo;
                        editor.$txt.html(vm.repairData.repairContent);
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