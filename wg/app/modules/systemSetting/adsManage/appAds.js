define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-datetimerpicker',
    'component-wangeditor'
], function(jqueryAjax, cMethod, cMessage, cDataTable, cDateTimePicker, richEditor) {
    var table,
        editor,
        getQueryData = function() {
            return {
                title: '',
                startDate: '',
                endDate: '',
                location: '0',
                onlineStatus: '0',
            }

        },
        getNewAdData = function() {
            return {
                id: '',
                title: '',
                onlineTime: '',
                offlineTime: '',
                showLocation: '0',
                image: '',
                clickAction: 'URL',
                actionInfo: '',
                htmlContent: ''
            }
        },
        vm = avalon.define({
            $id: 'ad',
            commonData: cMethod.getRoleData(),
            queryData: getQueryData(),
            adData: getNewAdData(),
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
            showAddWin: function () {
                vm.adData = getNewAdData();
                vm.adData.header = '新增广告';
                vm.isEdit = false;

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);
                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
                editor.$txt.html('');

                var addModal = $('#adModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        // 检测必填项
                        if (!vm.adData.title) {
                            cMethod.showPopupMessage('error', '主题不能为空');
                            return false;
                        } else if (!vm.adData.onlineTime) {
                            cMethod.showPopupMessage('error', '请选择上架时间-起');
                            return false;
                        } else if (!vm.adData.offlineTime) {
                            cMethod.showPopupMessage('error', '请选择上架时间-止');
                            return false;
                        } else if (vm.adData.showLocation === '0') {
                            cMethod.showPopupMessage('error', '请选择广告展示的位置');
                            return false;
                        } else if (!vm.adData.image) {
                            cMethod.showPopupMessage('error', '您还未上传图片');
                            return false;
                        } else if ($('#linkToUrl')[0].checked  && !vm.adData.actionInfo) {
                            cMethod.showPopupMessage('error', '链接到地址时，必须填写链接地址');
                            return false;
                        } else if ($('#linkToH5')[0].checked && !editor.$txt.text()) {
                            cMethod.showPopupMessage('error', '链接到H5内容时，必须填写广告H5');
                            return false;
                        } else if (vm.adData.offlineTime < vm.adData.onlineTime) {
                            cMethod.showPopupMessage('warning', '上架结束时间不能小于上架开始时间');
                            return false;
                        }

                        var success = true;
                        var formData = new FormData($('#data')[0]);
                        $.ajax({
                            url: window.currentApiUrl.systemSet.appAds.adsManageAdd,
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
                vm.adData = rowData;
                vm.adData.header = '修改广告';
                vm.isEdit = true;

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
                editor.$txt.html(vm.adData.htmlContent);

                var editModal = $('#adModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        // 检测必填项
                        if (!vm.adData.title) {
                            cMethod.showPopupMessage('error', '主题不能为空');
                            return false;
                        } else if (!vm.adData.onlineTime) {
                            cMethod.showPopupMessage('error', '请选择上架时间-起');
                            return false;
                        } else if (!vm.adData.offlineTime) {
                            cMethod.showPopupMessage('error', '请选择上架时间-止');
                            return false;
                        } else if (vm.adData.location === '0') {
                            cMethod.showPopupMessage('error', '请选择广告展示的位置');
                            return false;
                        } else if (!vm.adData.image) {
                            cMethod.showPopupMessage('error', '您还未上传图片');
                            return false;
                        } else if ($('#linkToUrl')[0].checked  && !vm.adData.actionInfo) {
                            cMethod.showPopupMessage('error', '链接到地址时，必须填写链接地址');
                            return false;
                        } else if ($('#linkToH5')[0].checked && !editor.$txt.text()) {
                            cMethod.showPopupMessage('error', '链接到H5内容时，必须填写广告H5');
                            return false;
                        } else if (vm.adData.offlineTime < vm.adData.onlineTime) {
                            cMethod.showPopupMessage('warning', '上架结束时间不能小于上架开始时间');
                            return false;
                        }

                        var success = true;
                        var formData = new FormData($('#data')[0]);
                        $.ajax({
                            url: window.currentApiUrl.systemSet.appAds.adsManageEdit,
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
            showDeleteWin: function(id) {
                var deleteModal = $('#confirm').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        var success = true;
                        $.ajax({
                            url: window.currentApiUrl.systemSet.appAds.adsManageDel,
                            type: 'GET',
                            data: 'id=' + id,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                console.log(data)
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
                    }
                }).modal('show');
            },
            switchStatus: function(rowData) {
                console.log(rowData.onlineStatus)
                if (rowData.onlineStatus == 1) {
                    vm.showEnableWin(rowData.id);
                } else if (rowData.onlineStatus == 2) {
                    vm.showDisenableWin(rowData.id);
                }
            },
            uploadImage: function(type){
                var target = this, freader;
                if (target.files.length > 0) {
                    freader = new FileReader();
                    freader.readAsDataURL(target.files.item(0));
                    freader.onload = function (e) {
                        var imgBase64Code= e.target.result;
                        vm.adData.image = imgBase64Code;
                    }
                }
            },
            showResourceImg: function () {
                var sourceImg = vm.adData.image;
                sourceImg !='' && window.open(sourceImg);
            },
            delResourceImg: function () {
                vm.adData.image = '';
            },
            showDisenableWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要下架当前广告?',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.systemSet.appAds.adPutOff,
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
                    content: '您确认要上架当前广告?',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.systemSet.appAds.adPutOn,
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
        });

    var baseTableOpts = {
        isShowIndexNumber: false,
        columns: [
            {field: 'title', title: '广告主题', isShow: true, isSort: false},
            {field: 'onlineTime', title: '上架时间', isShow: true, isSort: false},
            {field: 'showLocation', title: '广告位置', isShow: true, isSort: false, render: function (val) {
                if (val === 'INDEX_BANNER') {
                    return '首页Banner';
                } else if (val === 'SERVICE_BANNER') {
                    return '客服Banner';
                } else if (val === 'LUNCH_BANNER') {
                    return '午餐服务Banner';
                }
            }},
            {field: 'partakeAmount', title: '点击次数', isShow: true, isSort: false},
            {field: 'shareAmount', title: '分享次数', isShow: true, isSort: false},
            {field: 'createTime', title: '创建时间', isShow: true, isSort: false},
            {field: 'onlineStatus', title: '启用状态', isShow: true, isSort: false, render: function(val) {
                if (val === -1) {
                    return '已下架';
                } else if (val === 1) {
                    return '待上架';
                } else if (val === 2) {
                    return '已上架';
                }
            }},
            {field: 'onlineStatus', title: '操作', isShow: true, isSort: false, render: function(val) {
                var op;
                if (val === -1) {
                    op = '';
                } else if (val === 1) {
                    op = '<i class="icon switch angle double up orange" title="上架"></i>';
                } else if (val === 2) {
                    op =  '<i class="ui icon switch angle double down" title="下架"></i>';
                }

                return '<div class="tr-operation">' +
                    '<i class="icon edit green" title="修改"></i>' +
                    '<i class="icon remove red" title="删除"></i>' +
                    op +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.systemSet.appAds.adsManageList,
            type: 'GET',
            data: function (data) {
                data.pageNo = data.start / data.length + 1;
                data.pageSize = data.length;
                $.extend(data, vm.queryData)
            }
        },
        operationCallback: function (e, rowData) {
            if (rowData) {
                var target = $(e.target);
                if (target.hasClass('icon switch')) {
                    vm.switchStatus(rowData);
                } else if (target.hasClass('icon info')) {
                    vm.showDetailWin(rowData);
                } else if (target.hasClass('icon edit')) {
                    if (rowData.image.indexOf('http://images.xdaozwg.com') == -1) {
                        rowData.image = 'http://images.xdaozwg.com' + rowData.image;
                    }
                    vm.showEditWin(rowData);
                } else if (target.hasClass('icon remove')) {
                    vm.showDeleteWin(rowData.id);
                }
            }
        }
    };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            // 组件初始化
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            }, 200);
            cDateTimePicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd', new Date());
            editor = richEditor.initWangEditor({
                container: 'description',
                hideInsertImg: false,
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
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})