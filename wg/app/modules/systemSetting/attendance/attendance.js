define([
    'appPath/common/commonMethods',
    'component-datatable',
], function(cMethod, cDataTable) {
    var table,
        getQueryData = function () {
            return {
                cityCode: '0',
                parkName: '',
                isDistanceLimit: '0',
                inDistanceLimitNeedphoto: '0',
                outDistanceLimitNeedphoto: '0',
                isEnable: '0'
            }
        },
        getNewParkConfig = function() {
            return {
                parkId: '0',
                isDistanceLimit: 'YES',
                distanceLimit: '300',
                inDistanceLimitNeedphoto: 'NO',
                outDistanceLimitNeedphoto: 'YES',
            }
        },
        vm = avalon.define({
            $id: 'attendance',
            commonData: cMethod.getRoleData(),
            currentTab: 'park',
            // 默认设置
            defaultConfig: getNewParkConfig(),
            // 新增园区设置
            newConfig: getNewParkConfig(),
            // 修改园区设置
            editConfig: null,
            // 园区设置查询参数
            queryData: getQueryData(),
            dropdownList: {
                cityList: {
                    codes: [],
                    list: []
                },
                parkList: {
                    ids: [],
                    list: []
                },
            },
            switchTab: function(tab) {
                if (tab === vm.currentTab) { return; }
                vm.currentTab = tab;
            },
            updateDefault: function() {
                var formData = new FormData($('#defaultConfig')[0])
                $.ajax({
                    url: window.currentApiUrl.attendance.setDefaultConfig,
                    type: 'POST',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status == 200) {
                            cMethod.showPopupMessage('success', data.message);
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });
            },
            search: function () {
                table.draw();
            },
            reset: function() {
                vm.queryData = getQueryData();
                $('.ui.dropdown').dropdown('restore default value');
            },
            showAddWin: function () {
                // 打开下拉框全文搜索
                $('.ui.dropdown').dropdown({
                    fullTextSearch: true,
                });
                var addModal = $('#newParkConfig').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        if ( vm.newConfig.parkId === '0' ) {
                            cMethod.showPopupMessage('error', '请选择要设定的园区');
                            return false;
                        }
                        var formData = new FormData($('#newConfig')[0])
                        $.ajax({
                            url: window.currentApiUrl.attendance.addParkConfig,
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
                    }
                }).modal('show');
            },
            showEditWin: function (rowData) {
                vm.editConfig = rowData;
                var editModal = $('#editParkConfig').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        var formData = new FormData($('#editConfig')[0])
                        $.ajax({
                            url: window.currentApiUrl.attendance.updateParkConfig,
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
                    }
                }).modal('show');
            },
            showDeleteWin: function(id) {
                var deleteModal = $('#confirm').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        var success = true;
                        $.ajax({
                            url: window.currentApiUrl.attendance.deleteParkConfig,
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
            switchConfig: function(rowData) {
                var operation = rowData.isEnable === 'YES' ? 'disableParkConfig' : 'enableParkConfig',
                    url = window.currentApiUrl.attendance[operation];
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: 'id=' + rowData.id,
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
            }
        });
    var baseTableOpts = {
        isShowIndexNumber: false,
        columns: [
            {field: 'cityName', title: '城市', isShow: true, isSort: false},
            {field: 'parkName', title: '园区', isShow: true, isSort: false},
            {field: 'isDistanceLimit', title: '必须在设定范围内打卡', isShow: true, isSort: false, render: function (val) {
                return val === 'YES' ? '是' : '否';
            }},
            {field: 'distanceLimit', title: '打卡有效范围', isShow: true, isSort: false},
            {field: 'inDistanceLimitNeedphoto', title: '设定范围内必须拍照', isShow: true, isSort: false, render: function (val) {
                return val === 'YES' ? '是' : '否';
            }},
            {field: 'outDistanceLimitNeedphoto', title: '设定范围外必须拍照', isShow: true, isSort: false, render: function (val) {
                return val === 'YES' ? '是' : '否';
            }},
            {field: 'isEnable', title: '启用状态', isShow: true, isSort: false, render: function (val) {
                return cMethod.getItemByAttrFromItems({key: 'value', value: val}, vm.commonData.roleCommonData.useStatus)['name']
            }},
            {field: 'createTime', title: '新建时间', isShow: true, isSort: false, render: function(date) {
                return cMethod.getFormattedDate(new Date(date))
            }},
            {field: 'updateTime', title: '更新时间', isShow: true, isSort: false, render: function(date) {
                return cMethod.getFormattedDate(new Date(date))
            }},
            {field: 'isEnable', title: '操作', isShow: true, isSort: false, render: function (val) {
                var title = val === 'YES' ? '<i class="icon switch green unlock" title="禁用"></i>' : '<i class="icon switch orange lock" title="启用"></i>';
                return '<div class="tr-operation">' + title +
                    '<i class="icon remove red" title="删除"></i>' +
                    '<i class="icon edit teal" title="修改"></i>' +
                    '<i class="icon building blue" title="园区企业设置"></i>' +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.attendance.getParkConfigList,
            type: 'GET',
            data: function (data) {
                data.pageNo = data.start / data.length + 1;
                data.pageSize = data.length;
                $.extend(data, vm.queryData)
            },
        },
        operationCallback: function (e, rowData) {
            if (rowData) {
                var target = $(e.target);
                if (target.hasClass('icon switch')) {
                    vm.switchConfig(rowData);
                } else if (target.hasClass('icon remove')) {
                    vm.showDeleteWin(rowData.id);
                } else if (target.hasClass('icon edit')) {
                    vm.showEditWin(rowData);
                } else if (target.hasClass('icon building')) {
                    avalon.router.go('app.systemSetting.attendance.companySetting',{parkId: rowData.parkId, parkName: rowData.parkName});
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
            // 初始化组件
            $('.ui.dropdown').dropdown('setting', {
                fullTextSearch: true,
            });

            // 获取默认设置
            var options = "parkId=0&companyId=0";
            $.ajax({
                url: window.currentApiUrl.attendance.getDefaultConfig,
                type: 'GET',
                data: options,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {
                    vm.defaultConfig = data.data.results;
                }
            })

            // 获取园区设置列表
            table = cDataTable.initBaseTable(baseTableOpts);

            // 获取城市名称-编码 和 园区-id 对应关系
            $.ajax({
                url: window.currentApiUrl.attendance.getParks,
                type: 'GET',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    var parks = data.data.results;
                    parks.forEach(function(v, i) {
                        if (vm.dropdownList.cityList.codes.indexOf(v.cityCode) < 0) {
                            vm.dropdownList.cityList.codes.push(v.cityCode);
                            vm.dropdownList.cityList.list.push({cityCode: v.cityCode, cityName: v.cityName})
                        }
                        if (vm.dropdownList.parkList.ids.indexOf(v.id) < 0) {
                            vm.dropdownList.parkList.ids.push(v.id);
                            vm.dropdownList.parkList.list.push({parkId: v.id, parkName: v.name})
                        }
                    })
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