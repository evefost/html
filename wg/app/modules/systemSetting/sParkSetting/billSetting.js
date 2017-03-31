define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'jquery.semantic'
], function(jqueryAjax, cMethod, cMessage, cDataTable) {
    var table,
        getQueryData = function () {
            return {
                columnName: '',
                columnCategory: '0',
                isUse: '0'
            }
        },
        getNewNodeData = function () {
            return {
                columnName: '',
                columnNameCn: '',
                columnType: '0',
                columnCategory: '2',
                header: ''
            }
        },
        vm = avalon.define({
            $id: 'billTemplDetail',
            queryData: getQueryData(),
            nodeData: getNewNodeData(),
            isEdit: false,
            search: function (event) {
                event.preventDefault();
                table.draw();
            },
            reset: function(event) {
                event.preventDefault();
                vm.queryData = getQueryData();
                $('.ui.dropdown').dropdown('restore default value');
            },
            exportBillExcel: function () {
                cMethod.downloadFile(window.currentApiUrl.sBillTempl.exportBill)
            },
            switchStatus: function (rowData) {
                var newStatus;
                if (rowData.isUse == 'NO') {
                    newStatus = 'YES';
                } else if (rowData.isUse == 'YES') {
                    newStatus = 'NO';
                }

                $.ajax({
                    url: window.currentApiUrl.sBillTempl.switchStatus,
                    type: 'GET',
                    data: 'id=' + rowData.id + '&isUse=' + newStatus,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        if (data.status === 200) {
                            table.draw();
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });
            },
            showAddWin: function (event) {
                event.preventDefault();
                vm.nodeData = getNewNodeData();
                vm.nodeData.header = '新增字段';
                vm.isEdit = false;

                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);

                var success = true;
                var addModal = $('#nodeModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        if (!vm.nodeData.columnNameCn) {
                            cMethod.showPopupMessage('error', '请填写字段名称');
                            return false;
                        } else if (!vm.nodeData.columnName) {
                            cMethod.showPopupMessage('error', '请填写字段英文名');
                            return false;
                        } else if (vm.nodeData.columnType == '0') {
                            cMethod.showPopupMessage('error', '请填选择字段类型');
                            return false;
                        }
                        var formData = new FormData($('#nodeForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.sBillTempl.saveNode,
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
                vm.nodeData = rowData;
                vm.nodeData.header = '修改字段';
                vm.isEdit = true;

                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);

                var success = true;
                var editModal = $('#nodeModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        if (!vm.nodeData.columnNameCn) {
                            cMethod.showPopupMessage('error', '请填写字段名称');
                            return false;
                        } else if (!vm.nodeData.columnName) {
                            cMethod.showPopupMessage('error', '请填写字段英文名');
                            return false;
                        } else if (vm.nodeData.columnType == '0') {
                            cMethod.showPopupMessage('error', '请填选择字段类型');
                            return false;
                        }
                        var formData = new FormData($('#nodeForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.sBillTempl.saveNode,
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
            moveUp: function (rowData) {
                console.log(rowData.sorted)
                var data = 'id=' + rowData.id + '&sorted=' + (parseInt(rowData.sorted) - 1);
                $.ajax({
                    url: window.currentApiUrl.sBillTempl.sortColumn,
                    type: 'GET',
                    data: data,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            table.draw();
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });
            },
            moveDown: function (rowData) {
                var data = 'id=' + rowData.id + '&sorted=' + (parseInt(rowData.sorted) + 1);
                $.ajax({
                    url: window.currentApiUrl.sBillTempl.sortColumn,
                    type: 'GET',
                    data: data,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            table.draw();
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });
            }
        });

    var baseTableOpts = {
        isShowIndexNumber: true,
        columns: [
            {field: null, title: '序号', isShow: true, isSort: false},
            {field: 'columnNameCn', title: '字段名称', isShow: true, isSort: false},
            {field: 'columnCategory', title: '分类', isShow: true, isSort: false, render: function (val) {
                return val == '1' ? '固定字段' : (val == '2' ? '自定义字段' : '')
            }},
            {field: 'columnType', title: '数据类型', isShow: true, isSort: false, render: function (val) {
                if (val == 'TEXT') {
                    return '文本';
                } else if (val == 'NUMBER') {
                    return '数字';
                }
            }},
            {field: 'createTime', title: '新建时间', isShow: true, isSort: false},
            {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
            {field: 'isUse', title: '状态', isShow: true, isSort: false, render: function(val) {
                if (val == 'YES') {
                    return '已启用';
                } else if (val == 'NO') {
                    return '已禁用';
                }
            }},
            {title: '操作', isShow: true, isSort: false, width: '180px', render: function(data, type, row) {
                if (row.columnCategory == '1') return '';
                var status = row.isUse === 'YES' ?
                    '<i class="icon switch unlock" title="禁用"></i>'
                    : '<i class="icon switch lock orange" title="启用"></i>';
                return '<div class="tr-operation">' +
                    '<i class="icon big caret up blue" title="上移"></i>' +
                    '<i class="icon big caret down blue" title="下移"></i>' + status +
                    '<i class="icon edit green" title="修改"></i>' +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.sBillTempl.templDetail,
            type: 'GET',
            data: function (data) {
                data.pageNo = data.start / data.length + 1;
                data.pageSize = data.length;
                $.extend(data, vm.queryData);
                data.parkId = vm.parkId;
            }
        },
        operationCallback: function (e, rowData) {
            if (rowData) {
                var target = $(e.target);
                if (target.hasClass('icon setting')) {
                    vm.showEditWin(rowData);
                } else if(target.hasClass('icon switch')) {
                    vm.switchStatus(rowData);
                } else if(target.hasClass('icon edit')) {
                    vm.showEditWin(rowData);
                } else if(target.hasClass('caret up')) {
                    vm.moveUp(rowData);
                } else if(target.hasClass('caret down')) {
                    vm.moveDown(rowData);
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