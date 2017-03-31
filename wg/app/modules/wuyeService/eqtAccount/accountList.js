define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-datetimerpicker',
], function(jqueryAjax, cMethod, cMessage, cDataTable, cDateTimePicker) {
    var pTable,
        sTable,
        defSearchDataBig = function () {
            return {
                startDate: '',
                endDate: '',
                eqtName: '',
                founder: ''
            }
        },
        defSearchDataSmall = function () {
            return {
                startDate: '',
                endDate: '',
                eqtName: '',
                founder: '',
                eqtSort: '0'
            }
        },
        getInitialStatus = function () {
            return 'park';
        },
        childNumberIsHave = function (data) {
            var cnrIsHave=false;
            if(data.childNumber && data.childNumber!='0'){  //子类设数量不为0，则提示
                cMessage.showPopup({
                    className: 'warning',
                    content: '当前设备大类已被子类关联！无法被修改或删除！'
                });
                cnrIsHave=true;
            };
            return cnrIsHave;
        },
        vm = avalon.define({
            $id: 'repair',
            //commonData: cMethod.getRoleData(),
            currentStatus: getInitialStatus(), // 当前标签
            searchDataBig: defSearchDataBig(),
            searchDataSmall: defSearchDataSmall(),
            queryData: defSearchDataBig(),  //查询请求数据
            // 新增大类
            nEqtNameBig:'',  //设备大类名称
            //新增子类
            eqtSortAdd:'',
            // 切换标签
            switchStatus: function (newStatus) {
                if (newStatus === vm.currentStatus) return;
                vm.currentStatus = newStatus;
                vm.queryData = dataSet[vm.currentStatus].queryData;
            },
            search: function () {
                if (vm.currentStatus === 'park') {
                    vm.queryData = vm.searchDataBig;
                    pTable.draw();
                } else {
                    vm.queryData = vm.searchDataSmall;
                    sTable.draw();
                }
            },
            reset: function () {
                if (vm.currentStatus === 'park') {
                    vm.searchDataBig = defSearchDataBig();
                } else {
                    vm.searchDataSmall = defSearchDataSmall();
                }
                $('.ui.dropdown').dropdown('restore default value');
            },
            showAddWin: function (isEdit,data) {
                //vm.parkData = getNewParkData();
                if (!isEdit) {
                    vm.nEqtNameBig= '';
                }else{
                    if(childNumberIsHave(data)) return false;;  //编辑时判断该大类设备是否有子类
                    vm.nEqtNameBig= data.nEqtNameBig;  //显示设备大类名称
                }
                var modal = $('#newParkModal').modal({
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        var formData = new FormData($('#parkFormData')[0]);
                        // 验证表单
                        if(vm.nEqtNameBig ==''){
                            cMethod.showPopupMessage('error', '请填写设备名称');
                            return false;
                        }
                        $.ajax({
                            url: window.currentApiUrl.wuyeService.eqtAccount.eqtAddBig,
                            type: 'POST',
                            data: formData,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.status === 200) {
                                    cMethod.showPopupMessage('success', data.message);
                                    pTable.draw();
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
                        //$('.multi-search').dropdown('set text', '所属园区');
                    }
                }).modal('show');
            },
            sShowAddWin: function () {
                //vm.supplierData = getNewSupplierData();
                var modal = $('#newSupplierModal').modal({
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        var formData = new FormData($('#supplierFormData')[0]);
                        // 验证表单
                        if (!vm.supplierData.parkId) {
                            cMethod.showPopupMessage('error', '请选择所属园区');
                            return false;
                        } else if (vm.supplierData.serviceName == '0') {
                            cMethod.showPopupMessage('error', '请选择报修类型');
                            return false;
                        } else if (vm.supplierData.companyId == '0') {
                            cMethod.showPopupMessage('error', '请选择报修企业');
                            return false;
                        } else if (!vm.supplierData.address) {
                            cMethod.showPopupMessage('error', '请填写报修地址');
                            return false;
                        } else if (!vm.supplierData.userName) {
                            cMethod.showPopupMessage('error', '请填写申请人');
                            return false;
                        } else if (!vm.supplierData.userPhone) {
                            cMethod.showPopupMessage('error', '请填写申请人电话');
                            return false;
                        } else if (vm.supplierData.supplierId == '0' || !vm.supplierData.supplierCompanyName) {
                            cMethod.showPopupMessage('error', '请选择供应商');
                            return false;
                        } else if (!cMethod.validatePhone(vm.supplierData.userPhone)) {
                            cMethod.showPopupMessage('warning', '联系电话格式不正确哦');
                            return false;
                        }

                        $.ajax({
                            url: window.currentApiUrl.wuyeService.eqtAccount.eqtAddSmall,
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
                                    success = false;
                                }
                            }
                        });

                        return success;
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                        $('.multi-search').dropdown('set text', '所属园区');
                    }
                }).modal('show');
            },
            showEditWin: function (data) {
                vm.showAddWin(true,data);
            },
            showDeleteWin:function (data) {
                if(childNumberIsHave(data)) return false;  //判断是否有子类设备数量
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.wuyeService.eqtAccount.eqtDelBig,
                            {eqtId: data.id},
                            function (response, msgType, isOk) {
                                pTable.draw();
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            },
                            function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }
                        );
                    }
                });
            },

            // 详情
            orderDetail: function (data) {
                vm.orderType = 'detail';
                vm.parkData = data;
                vm.parkData.title = '详情';
                vm.parkData.workOrderStatus = statusSetPark[vm.parkData.workOrderStatus].desc;

                var modal = $('#parkModal').modal({
                    closable: false,
                    onApprove: function() {
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                });
                setTimeout(function() {modal.modal('show')}, 0);
            }
        }),
        dataSet = {
            park: {
                queryData: vm.parkQueryData,
            },
            supplier: {
                queryData: vm.supplierQueryData,
            }
        };

    var pBaseTableOpts = {
            container: '#parkTable',
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'workOrderNo', title: '报修单号', isShow: true, isSort: false},
                {field: 'applicationTime', title: '报修申请时间', isShow: true, isSort: false},
                {field: 'distributeTime', title: '派单时间', isShow: true, isSort: false},
                {field: 'handleTime', title: '接单时间', isShow: true, isSort: false, render: function (val) {
                    return val == '' ? '-' : val;
                }},
                {field: 'handleName', title: '接单人', isShow: true, isSort: false, render: function (val) {
                    return val == '' ? '-' : val;
                }},
                {field: 'serviceName', title: '报修类型', isShow: true, isSort: false},
                {field: 'companyName', title: '报修企业', isShow: true, isSort: false},
                {field: 'parkName', title: '所属园区', isShow: true, isSort: false},
                {field: 'userName', title: '申请人', isShow: true, isSort: false},
                {field: 'userPhone', title: '申请人电话', isShow: true, isSort: false},
                {field: 'workOrderStatus', title: '报修单状态', isShow: true, isSort: false, render: function(val) {
                    return [].join('');
                }},
                {field: 'workOrderStatus', title: '操作', isShow: true, isSort: false, textAlign: 'center', width: '160px', render: function(val) {
                    return '<div class="tr-operation" >' +
                        '<i class="icon edit green" title="修改"></i><i class="icon remove red" title="删除"></i></div>' +
                        '</div>';
                }},
            ],
            ajax: {
                url: window.currentApiUrl.wuyeService.eqtAccount.eqtListBig,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    $.extend(data, vm.queryData);
                }
            },
            operationCallback: function (e, rowData) {
                var data = JSON.parse(JSON.stringify(rowData));
                data.image = data.image.split(',');
                if (data.image.length === 1 && data.image[0] == '') data.image = null;
                
                if (data) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        vm.showEditWin(data);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(data);
                    }
                }
            }
        },
        sBaseTableOpts = {
            container: '#supplierTable',
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'workOrderNo', title: '报修单号', isShow: true, isSort: false},
                {field: 'applicationTime', title: '申请提交时间', isShow: true, isSort: false},
                {field: 'handleTime', title: '接单时间', isShow: true, isSort: false, render: function (val) {
                    return val == '' ? '-' : val;
                }},
                {field: 'feedBackTime', title: '反馈时间', isShow: true, isSort: false},
                {field: 'serviceName', title: '报修类型', isShow: true, isSort: false},
                {field: 'companyName', title: '报修企业', isShow: true, isSort: false},
                {field: 'parkName', title: '所属园区', isShow: true, isSort: false},
                {field: 'supplierName', title: '维修供应商', isShow: true, isSort: false},
                {field: 'userName', title: '申请人', isShow: true, isSort: false},
                {field: 'userPhone', title: '申请人电话', isShow: true, isSort: false},
                {field: 'workOrderStatus', title: '报修单状态', isShow: true, isSort: false, render: function(val) {
                    return [].join('');
                }},
                {field: 'workOrderStatus', title: '操作', isShow: true, isSort: false, textAlign: 'center', width: '140px', render: function(val) {
                    return '<div class="tr-operation" >' +
                        '<i class="icon edit green" title="修改"></i><i class="icon remove red" title="删除"></i></div>' +
                        '</div>';
                }},
            ],
            ajax: {
                url: window.currentApiUrl.wuyeService.eqtAccount.eqtListSmall,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    $.extend(data, vm.queryData);
                }
            },
            operationCallback: function (e, rowData) {
                var data = JSON.parse(JSON.stringify(rowData));
                data.image = data.image.split(',');
                if (data.image.length == 1 && data.image[0] == '') data.image = null;

                if (data) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        vm.showEditWin(data);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(data);
                    }
                }
            }
        }

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
            }, 0);
            cDateTimePicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
            // 获取表格数据
            pTable = cDataTable.initBaseTable(pBaseTableOpts);
            pTable.on('draw.dt', function () {
                $('.tr-operation').children('a').css({
                    display: 'inline-block',
                    margin: '0px 4px',
                    cursor: 'pointer'
                })
            });
            pTable.on('init.dt', function(e, setting, json) {
                var data = json.data.results.tBody;
            })

            sTable = cDataTable.initBaseTable(sBaseTableOpts);
            sTable.on('draw.dt', function () {
                $('.tr-operation').children('a').css({
                    display: 'inline-block',
                    margin: '0px 4px',
                    cursor: 'pointer'
                })
            });
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})