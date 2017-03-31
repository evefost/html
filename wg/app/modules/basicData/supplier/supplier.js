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
        getQueryData = function () {
            return {
                name: '',
                service: '',
                areaCode: '0',
                parkIds: '0',
                isEnable: '0',
                addressKey: '',
                contacts: '',
                contactsPhone: ''
            }
        },
        getNewSupplierData = function () {
            return {
                title: '',
                name: '',
                service: '',
                areaCode: '0',
                parkIds: '0',
                address: '',
                contacts: '',
                contactsPhone: '',
                contactsPosition: '',
                description: '',
                logo: '',
            }
        },
        vm = avalon.define({
            $id: 'supplier',
            commonData: cMethod.getRoleData(),
            queryData: getQueryData(),
            supplierData: getNewSupplierData(),
            isEdit: false,
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
                vm.supplierData = getNewSupplierData();
                vm.supplierData.title = '新增供应商';
                vm.isEdit = false;

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown({
                        fullTextSearch: true,
                    });
                    $('#multi-select').dropdown('clear')
                }, 200);

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });

                var addModal = $('#supplierModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        // 验证表单
                        if (!vm.supplierData.name) {
                            cMethod.showPopupMessage('error', '请填写供应商名称');
                            return false;
                        } else if (!vm.supplierData.service) {
                            cMethod.showPopupMessage('error', '请填写主要供应');
                            return false;
                        } else if (vm.supplierData.areaCode == '0') {
                            cMethod.showPopupMessage('error', '请选择供应商城市');
                            return false;
                        } else if (vm.supplierData.parkIds == '0' || vm.supplierData.parkIds == null) {
                            cMethod.showPopupMessage('error', '请选择覆盖园区');
                            return false;
                        } else if (!vm.supplierData.address) {
                            cMethod.showPopupMessage('error', '请填写详细地址');
                            return false;
                        } else if (!vm.supplierData.contacts) {
                            cMethod.showPopupMessage('error', '请填写联系人');
                            return false;
                        } else if (!vm.supplierData.contactsPhone) {
                            cMethod.showPopupMessage('error', '请填写联系电话');
                            return false;
                        } else if (!vm.supplierData.logo) {
                            cMethod.showPopupMessage('error', '请上传供应商Logo');
                            return false;
                        } else if (!cMethod.validatePhone(vm.supplierData.contactsPhone)) {
                            cMethod.showPopupMessage('warning', '联系电话格式不正确哦');
                            return false;
                        };

                        try {
                            $('#parkIds').val(vm.supplierData.parkIds.join(','));
                        } catch (e) {}

                        var failed = false;
                        var formData = new FormData($('#supplierForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.basicData.supplierAdd,
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
                        return !failed;
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                }).modal('show');
            },
            showEditWin: function (rowData) {
                vm.supplierData = rowData;
                vm.supplierData.title = '修改供应商信息';
                vm.isEdit = true;

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown({
                        fullTextSearch: true,
                    });
                }, 200);

                try {
                    $('#multi-select').dropdown('set exactly', vm.supplierData.parkIds.split(','))
                } catch (e) {}

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
                editor.$txt.html(vm.supplierData.description);

                var editModal = $('#supplierModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        // 验证表单
                        if (!vm.supplierData.name) {
                            cMethod.showPopupMessage('error', '请填写供应商名称');
                            return false;
                        } else if (!vm.supplierData.service) {
                            cMethod.showPopupMessage('error', '请填写主要供应');
                            return false;
                        } else if (vm.supplierData.areaCode == '0') {
                            cMethod.showPopupMessage('error', '请选择供应商城市');
                            return false;
                        } else if (vm.supplierData.parkIds == '0' || vm.supplierData.parkIds == null) {
                            cMethod.showPopupMessage('error', '请选择覆盖园区');
                            return false;
                        } else if (!vm.supplierData.address) {
                            cMethod.showPopupMessage('error', '请填写详细地址');
                            return false;
                        } else if (!vm.supplierData.contacts) {
                            cMethod.showPopupMessage('error', '请填写联系人');
                            return false;
                        } else if (!vm.supplierData.contactsPhone) {
                            cMethod.showPopupMessage('error', '请填写联系电话');
                            return false;
                        } else if (!vm.supplierData.logo) {
                            cMethod.showPopupMessage('error', '请上传供应商Logo');
                            return false;
                        } else if (!cMethod.validatePhone(vm.supplierData.contactsPhone)) {
                            cMethod.showPopupMessage('warning', '联系电话格式不正确哦');
                            return false;
                        };

                        try {
                            $('#parkIds').val(vm.supplierData.parkIds.join(','));
                        } catch (e) {}

                        var failed = false;
                        var formData = new FormData($('#supplierForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.basicData.supplierEdit,
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
            showDetailWin: function(rowData) {
                vm.supplierData = rowData;
                vm.supplierData.parkName = vm.supplierData.parkName.split(',').join('，');

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
                            url: window.currentApiUrl.basicData.supplierDelete,
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
                var operation = rowData.isEnable === 'YES' ? 'supplierDisable' : 'supplierEnable',
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
            uploadImage: function(type){
                var target = this, freader;
                if (target.files.length > 0) {
                    freader = new FileReader();
                    freader.readAsDataURL(target.files.item(0));
                    freader.onload = function (e) {
                        var imgBase64Code= e.target.result;
                        vm.supplierData.logo = imgBase64Code;
                    }
                }
            },
            showResourceImg: function () {
                var sourceImg = vm.supplierData.logo;
                sourceImg !='' && window.open(sourceImg);
            },
            delResourceImg: function () {
                vm.supplierData.logo = '';
            }
        });

    var baseTableOpts = {
        isShowIndexNumber: true,
        columns: [
            {field: null, title: '序号', isShow: true, isSort: false},
            {field: 'name', title: '供应商名称', isShow: true, isSort: false},
            {field: 'service', title: '主要供应', isShow: true, isSort: false},
            {field: 'areaName', title: '供应商城市', isShow: true, isSort: false},
            {field: 'parkName', title: '覆盖园区', isShow: true, isSort: false, render: function(val) {
                return '<i class="ui circular plus square outline icon" id="parksCovered" data-content="' + val.split(',').join('，') +'"></i>';
            }},
            {field: 'address', title: '供应商地址', isShow: true, isSort: false},
            {field: 'contacts', title: '联系人', isShow: true, isSort: false},
            {field: 'contactsPhone', title: '联系方式', isShow: true, isSort: false},
            {field: 'createTime', title: '新增时间', isShow: true, isSort: false},
            {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
            {field: 'isEnable', title: '启用状态', isShow: true, isSort: false, render: function(val) {
                return cMethod.getItemByAttrFromItems({key: 'value', value: val}, vm.commonData.roleCommonData.useStatus)['name']
            }},
            {field: 'isEnable', title: '操作', isShow: true, isSort: false, render: function(val) {
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
            url: window.currentApiUrl.basicData.supplierList,
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
                $('.ui.dropdown').dropdown('setting', {
                    fullTextSearch: true,
                });
            }, 200);
            cDateTimePicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
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
            table.on('draw.dt', function () {
                $('#parksCovered').ready(function () {
                    $('.ui.circular.icon').popup();
                })
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