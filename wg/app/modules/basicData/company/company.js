define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-datetimerpicker',
], function(jqueryAjax, cMethod, cMessage, cDataTable, cDateTimePicker) {
    var table,
        map,
        getQueryData = function () {
            return {
                name: '',
                id: '',
                cityCode: '0',
                parkName: '',
                isEnable: '0',
                addressKey: '',
                contacts: '',
                contactsPhone: '',
                industryIds: '0',
                startTime: '',
                endTime: ''
            }
        },
        getNewCompanyData = function () {
            return {
                id: '',
                name:'',
                cityCode: '0',
                parkId: '0',
                industryIds: '',
                address: '',
                contacts: '',
                contactsPosition: '',
                contactsPhone: ''
            }
        },
        vm = avalon.define({
            $id: 'company',
            commonData: cMethod.getRoleData(),
            queryData: getQueryData(),
            companyData: getNewCompanyData(),
            isEdit: false,
            industrySet: null,
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
            search: function () {
                table.draw();
            },
            reset: function () {
                vm.queryData = getQueryData();
                $('.ui.dropdown').dropdown('restore default value');
            },
            showAddWin: function () {
                vm.companyData = getNewCompanyData();
                vm.companyData.title = '新增企业';
                vm.isEdit = false;

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown({
                        fullTextSearch: true,
                    });
                    $('#multi-select').dropdown('clear')
                }, 200);
                

                var addModal = $('#companyModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        console.log(vm.companyData.industryIds);
                        // 验证表单
                        if (!vm.companyData.name) {
                            cMethod.showPopupMessage('error', '请填写企业名称');
                            return false;
                        } else if (vm.companyData.cityCode == '0') {
                            cMethod.showPopupMessage('error', '请选择所属城市');
                            return false;
                        } else if (vm.companyData.parkId == '0') {
                            cMethod.showPopupMessage('error', '请选择所属园区');
                            return false;
                        } else if (vm.companyData.industryIds === null || vm.companyData.industryIds == '') {
                            cMethod.showPopupMessage('error', '请选择主要行业');
                            return false;
                        } else if (!vm.companyData.address) {
                            cMethod.showPopupMessage('error', '请填写企业地址');
                            return false;
                        } else if (!vm.companyData.contacts) {
                            cMethod.showPopupMessage('error', '请填写联系人');
                            return false;
                        } else if (!vm.companyData.contactsPhone) {
                            cMethod.showPopupMessage('error', '请填写联系电话');
                            return false;
                        } else if (!vm.companyData.contactsPosition) {
                            cMethod.showPopupMessage('error', '请填写联系人职务');
                            return false;
                        } else if (!cMethod.validatePhone(vm.companyData.contactsPhone)) {
                            cMethod.showPopupMessage('warning', '联系电话格式不正确哦');
                            return false;
                        };

                        try {
                            $('#industryIds').val(vm.companyData.industryIds.join(','));
                        } catch (e) {}

                        var failed = false;
                        var formData = new FormData($('#companyForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.basicData.companyAdd,
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
                                    failed = true;
                                }
                            }
                        });
                        return !failed;
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                }).modal('show');
            },
            showEditWin: function (id) {
                $.ajax({
                    url: window.currentApiUrl.basicData.companyDetail,
                    type: 'GET',
                    data: 'id=' + id,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.companyData = data.data.companyDetail;
                            vm.companyData.title = '修改企业信息';
                            vm.isEdit = true;
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown({
                        fullTextSearch: true,
                    });
                }, 200);
                console.log(vm.companyData.industryIds);
                try {
                    $('#multi-select').dropdown('set exactly', vm.companyData.industryIds.split(','))
                } catch (e) {}

                var addModal = $('#companyModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        // 验证表单
                        if (!vm.companyData.name) {
                            cMethod.showPopupMessage('error', '请填写企业名称');
                            return false;
                        } else if (vm.companyData.cityCode == '0') {
                            cMethod.showPopupMessage('error', '请选择所属城市');
                            return false;
                        } else if (vm.companyData.parkId == '0') {
                            cMethod.showPopupMessage('error', '请选择所属园区');
                            return false;
                        } else if (!vm.companyData.industryIds) {
                            cMethod.showPopupMessage('error', '请选择主要行业');
                            return false;
                        } else if (!vm.companyData.address) {
                            cMethod.showPopupMessage('error', '请填写企业地址');
                            return false;
                        } else if (!vm.companyData.contacts) {
                            cMethod.showPopupMessage('error', '请填写联系人');
                            return false;
                        } else if (!vm.companyData.contactsPhone) {
                            cMethod.showPopupMessage('error', '请填写联系电话');
                            return false;
                        } else if (!vm.companyData.contactsPosition) {
                            cMethod.showPopupMessage('error', '请填写联系人职务');
                            return false;
                        } else if (!cMethod.validatePhone(vm.companyData.contactsPhone)) {
                            cMethod.showPopupMessage('warning', '联系电话格式不正确哦');
                            return false;
                        };

                        try {
                            $('#industryIds').val(vm.companyData.industryIds.join(','));
                        } catch (e) {}

                        var failed = false;
                        var formData = new FormData($('#companyForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.basicData.companyEdit,
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
                                    failed = true;
                                }
                            }
                        });
                        return !failed;
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                }).modal('show');
            },
            showDetailWin: function(id) {
                $.ajax({
                    url: window.currentApiUrl.basicData.companyDetail,
                    type: 'GET',
                    data: 'id=' + id,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.companyData = data.data.companyDetail;
                            console.log(vm.companyData.industryIds);
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });

                var detailModal = $('#modalDetail').modal('setting', {
                    closable: true,
                    onApprove: function() {
                    }
                }).modal('show');
            },
            showDeleteWin: function(id) {
                var deleteModal = $('#confirm').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        var success = true;
                        $.ajax({
                            url: window.currentApiUrl.basicData.companyDelete,
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
                var operation = rowData.isEnable === 'YES' ? 'companyDisable' : 'companyEnable',
                    url = window.currentApiUrl.basicData[operation];
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
            },
        });

    var baseTableOpts = {
        isShowIndexNumber: false,
        columns: [
            {field: 'id', title: '编码', isShow: true, isSort: false},
            {field: 'name', title: '企业名称', isShow: true, isSort: false},
            {field: 'cityName', title: '所属城市', isShow: true, isSort: false},
            {field: 'parkName', title: '所属园区', isShow: true, isSort: false},
            {field: 'industry', title: '所属行业', isShow: true, isSort: false},
            {field: 'address', title: '企业地址', isShow: true, isSort: false},
            {field: 'contacts', title: '联系人', isShow: true, isSort: false},
            {field: 'contactsPhone', title: '联系方式', isShow: true, isSort: false},
            {field: 'createTime', title: '新增时间', isShow: true, isSort: false},
            {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
            {field: 'isEnable', title: '启用状态', isShow: true, isSort: false, render: function(val) {
                return cMethod.getItemByAttrFromItems({key: 'value', value: val}, vm.commonData.roleCommonData.useStatus)['name']
            }},
            {field: 'isEnable', title: '操作', isShow: true, isSort: false, width: '160px',  render: function(val) {
                var status = val === 'YES' ?
                    '<i class="icon switch unlock" title="禁用"></i>'
                    : '<i class="icon switch lock orange" title="启用"></i>';
                return '<div class="tr-operation">' +
                    '<i class="icon info circle teal" title="详情"></i>' + status +
                    '<i class="icon edit green" title="修改"></i>' +
                    '<i class="icon remove red" title="删除"></i>' +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.basicData.companyList,
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
                if (target.hasClass('icon switch')) {
                    vm.switchStatus(rowData);
                } else if (target.hasClass('icon info')) {
                    vm.showDetailWin(rowData.id);
                } else if (target.hasClass('icon edit')) {
                    vm.showEditWin(rowData.id);
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
                $('.ui.dropdown').dropdown('setting', {
                    fullTextSearch: true,
                });
            }, 200);
            cDateTimePicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
            // 获取表格数据
            table = cDataTable.initBaseTable(baseTableOpts);

            // 获取行业信息
            $.ajax({
                url: window.currentApiUrl.basicData.industrySet,
                type: 'GET',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.status === 200) {
                        vm.industrySet = data.data.results;
                    }
                }
            });

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