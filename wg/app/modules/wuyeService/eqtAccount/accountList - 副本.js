define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-datetimerpicker',
], function(jqueryAjax, cMethod, cMessage, cDataTable, cDateTimePicker) {
    var pTable,
        sTable,
        getParkQueryData = function () {
            return {
                workOrderNo: '',
                startApplicationTime: '',
                endApplicationTime: '',
                startDistributeTime: '',
                endDistributeTime: '',
                startHandleTime: '',
                endHandleTime: '',
                parkId: '0',
                companyName: '',
                workOrderStatus: '0',
                serviceName: '',
                userName: '' ,
                userPhone: '' ,
                handleName: ''
            }
        },
        getSupplierQueryData = function () {
            return {
                workOrderNo: '',
                startApplicationTime: '',
                endApplicationTime: '',
                startHandleTime: '',
                endHandleTime: '',
                startFeedBackTime: '',
                endFeedBackTime: '',
                parkId: '0',
                workOrderStatus: '0',
                supplierName: '',
                serviceName: '',
                companyName: '',
                userName: '',
                userPhone: ''
            }
        },
        getNewParkData = function () {
            return {
                parkId: '',
                serviceName: '0',
                companyId: '0',
                address: '',
                userName: '',
                userPhone: '',
                description: '',
                notAcceptReason: '',
                feedBackText: ''
            }
        },
        getNewSupplierData = function () {
            return {
                parkId: '',
                serviceName: '0',
                companyId: '0',
                address: '',
                userName: '',
                userPhone: '',
                description: '',
                supplierId: '0',
                supplierCompanyName: '',
                feedBackText: ''
            }
        },
        getInitialStatus = function () {
            return 'park';
        },
        vm = avalon.define({
            $id: 'repair',
            commonData: cMethod.getRoleData(),
            currentStatus: getInitialStatus(), // 当前标签
            /**
             * 园区相关
             */
            // 园区查询参数与供应商查询参数
            parkQueryData: getParkQueryData(),
            queryData: getParkQueryData(),
            // 操作中的菜单后获取的数据
            parkData: getNewParkData(),
            // 园区模糊搜索与企业模糊搜索名称
            inputParkName: '',
            inputCompanyName: '',
            // 模糊搜索后获取的列表
            queryParkList: [],
            queryCompanyList: [],
            nQueryParkList: [],
            nQueryCompanyList: [],
            // 接单人列表
            handlerList: [],
            trackingInfo: [],
            // 根据 orderType 显示对应的详情
            orderType: 'send',
            submitType: 'YES',

            // 新增
            nInputParkName: '',
            nInputCompanyName: '',
            parkServiceList: [],
            companyList: [],
            /**
             * 供应商相关
             */
            supplierQueryData: getSupplierQueryData(),
            supplierData: getNewSupplierData(),
            // 园区模糊搜索与企业模糊搜索名称（供应商标签）
            sInputParkName: '',
            sInputCompanyName: '',
            // 模糊搜索后获取的列表（供应商标签）
            sQueryParkList: [],
            sQueryCompanyList: [],
            nsQueryParkList: [],
            nsQueryCompanyList: [],
            // 跟踪流程
            trackingInfoSupplier: [],
            //
            sOrderType: 'receive',
            // 新增
            nsInputParkName: '',
            nsInputCompanyName: '',
            supplierServiceList: [],
            supplierList: [],
            sCompanyList: [],
            supplierServiceName: '0',
            supplierId: '0',
            // 切换标签
            switchStatus: function (newStatus) {
                if (newStatus === vm.currentStatus) return;
                vm.currentStatus = newStatus;
                vm.queryData = dataSet[vm.currentStatus].queryData;
            },
            search: function () {
                if (vm.currentStatus === 'park') {
                    vm.queryData = vm.parkQueryData;
                    pTable.draw();
                } else {
                    vm.queryData = vm.supplierQueryData;
                    console.log(vm.supplierQueryData)
                    sTable.draw();
                }
            },
            reset: function () {
                if (vm.currentStatus === 'park') {
                    vm.parkQueryData = getParkQueryData();
                    $('#parkNameSelect').dropdown('set text', '所属园区');
                    $('#companyNameSelect').dropdown('set text', '报修企业');
                } else {
                    vm.queryData = getSupplierQueryData();
                    $('#sParkNameSelect').dropdown('set text', '所属园区');
                    $('#sCompanyNameSelect').dropdown('set text', '报修企业');
                }

                vm.queryParkList = [];
                vm.queryCompanyList = [];
                $('.ui.dropdown').dropdown('restore default value');
            },
            showAddWin: function () {
                vm.parkData = getNewParkData();
                var modal = $('#newParkModal').modal({
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        var formData = new FormData($('#parkFormData')[0]);

                        // 验证表单
                        if (!vm.parkData.parkId) {
                            cMethod.showPopupMessage('error', '请选择所属园区');
                            return false;
                        } else if (vm.parkData.serviceName == '0') {
                            cMethod.showPopupMessage('error', '请选择报修类型');
                            return false;
                        } else if (vm.parkData.companyId == '0') {
                            cMethod.showPopupMessage('error', '请选择报修企业');
                            return false;
                        } else if (!vm.parkData.address) {
                            cMethod.showPopupMessage('error', '请填写报修地址');
                            return false;
                        } else if (!vm.parkData.userName) {
                            cMethod.showPopupMessage('error', '请填写申请人');
                            return false;
                        } else if (!vm.parkData.userPhone) {
                            cMethod.showPopupMessage('error', '请填写申请人电话');
                            return false;
                        } else if (!cMethod.validatePhone(vm.parkData.userPhone)) {
                            cMethod.showPopupMessage('warning', '联系电话格式不正确哦');
                            return false;
                        }

                        $.ajax({
                            url: window.currentApiUrl.repairService.newOrder,
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
            sShowAddWin: function () {
                vm.supplierData = getNewSupplierData();
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
                            url: window.currentApiUrl.repairService.sNewOrder,
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
            /**
             * 模糊查询园区
             */
            queryParkByName: function () {
                if (vm.inputParkName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.user.queryParkByName,
                        {
                            parkName:vm.inputParkName
                        },
                        function (response, msgType, isOk) {
                            var result = response.data.results;
                            vm.queryParkList = [];
                            if (result && result.length > 0) {
                                for (var i = 0; i < result.length; i++) {
                                    vm.queryParkList.push({
                                        parkId: result[i].parkId,
                                        parkName: result[i].parkName
                                    });
                                }
                            }
                        }
                    );
                }
            },
            nQueryParkByName: function () {
                if (vm.nInputParkName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.user.queryParkByName,
                        {
                            parkName: vm.nInputParkName
                        },
                        function (response, msgType, isOk) {
                            var result = response.data.results;
                            vm.nQueryParkList = [];
                            if (result && result.length > 0) {
                                for (var i = 0; i < result.length; i++) {
                                    vm.nQueryParkList.push({
                                        parkId: result[i].parkId,
                                        parkName: result[i].parkName
                                    });
                                }
                            }
                        }
                    );
                }
            },
            /**
            * 点击设置园区 ID
             */
            setParkId: function (e) {
                vm.parkQueryData.parkId = $(this).data('parkid');
            },
            nSetParkId: function () {
                vm.parkData.parkId = $(this).data('parkid');
                // 获取服务列表
                jqueryAjax.get(
                    window.currentApiUrl.repairService.getParkServiceList,
                    {
                        parkId: vm.parkData.parkId
                    },
                    function (response, msgType, isOk) {
                        vm.parkServiceList = response.data.results;
                    }
                );

                // 获取本园区下的企业列表
                jqueryAjax.get(
                    window.currentApiUrl.repairService.getCompanyByParkId,
                    {
                        parkId: vm.parkData.parkId
                    },
                    function (response, msgType, isOk) {
                        vm.companyList = response.data.results;
                    }
                )
            },
            /**
             * 模糊查询企业
             */
            queryCompanyByName: function () {
                if (vm.inputCompanyName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.repairService.getCompanyByName,
                        {
                            companyName: vm.inputCompanyName
                        },
                        function (response, msgType, isOk) {
                            var result = response.data.results;
                            vm.queryCompanyList = [];
                            if (result && result.length > 0) {
                                for (var i = 0; i < result.length; i++) {
                                    vm.queryCompanyList.push({
                                        companyId: result[i].companyId,
                                        companyName: result[i].companyName
                                    });
                                }
                            }
                        }
                    );
                }
            },
            nQueryCompanyByName: function () {
                if (vm.nInputCompanyName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.queryCompanyByName,
                        {
                            companyName: vm.nInputCompanyName
                        },
                        function (response, msgType, isOk) {
                            var result = response.data.results;
                            vm.nQueryCompanyList = [];
                            if (result && result.length > 0) {
                                for (var i = 0; i < result.length; i++) {
                                    vm.nQueryCompanyList.push({
                                        companyId: result[i].companyId,
                                        companyName: result[i].companyName
                                    });
                                }
                            }
                        }
                    );
                }
            },
            setCompanyId: function () {
                vm.supplierQueryData.companyId = $(this).data('companyid');
            },
            nSetCompanyId: function () {
                vm.parkData.companyId = $(this).data('companyid');
            },
            /**
             * 模糊查询园区（供应商标签）
             */
            sQueryParkByName: function () {
                if (vm.sInputParkName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.user.queryParkByName,
                        {
                            parkName: vm.sInputParkName
                        },
                        function (response, msgType, isOk) {
                            var result = response.data.results;
                            vm.sQueryParkList = [];
                            if (result && result.length > 0) {
                                for (var i = 0; i < result.length; i++) {
                                    vm.sQueryParkList.push({
                                        parkId: result[i].parkId,
                                        parkName: result[i].parkName
                                    });
                                }
                            }
                        }
                    );
                }
            },
            nsQueryParkByName: function () {
                if (vm.nsInputParkName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.user.queryParkByName,
                        {
                            parkName: vm.nsInputParkName
                        },
                        function (response, msgType, isOk) {
                            var result = response.data.results;
                            vm.nsQueryParkList = [];
                            if (result && result.length > 0) {
                                for (var i = 0; i < result.length; i++) {
                                    vm.nsQueryParkList.push({
                                        parkId: result[i].parkId,
                                        parkName: result[i].parkName
                                    });
                                }
                            }
                        }
                    );
                }
            },
            /**
             * 点击设置园区 ID（供应商标签）
             */
            sSetParkId: function (e) {
                vm.supplierQueryData.parkId = $(this).data('parkid');
            },
            nsSetParkId: function (e) {
                vm.supplierData.parkId = $(this).data('parkid');
                jqueryAjax.get(
                    window.currentApiUrl.repairService.getSupplierServiceList,
                    {
                        parkId: vm.supplierData.parkId
                    },
                    function (response, msgType, isOk) {
                        vm.supplierServiceList = response.data.results;
                    }
                );

                // 获取本园区下的企业列表
                jqueryAjax.get(
                    window.currentApiUrl.repairService.getCompanyByParkId,
                    {
                        parkId: vm.supplierData.parkId
                    },
                    function (response, msgType, isOk) {
                        vm.sCompanyList = response.data.results;
                    }
                )
                
            },
            /**
             * 模糊查询企业（供应商标签）
             */
            sQueryCompanyByName: function () {
                if (vm.sInputCompanyName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.repairService.getCompanyByName,
                        {
                            companyName: vm.sInputCompanyName
                        },
                        function (response, msgType, isOk) {
                            var result = response.data.results;
                            vm.sQueryCompanyList = [];
                            if (result && result.length > 0) {
                                for (var i = 0; i < result.length; i++) {
                                    vm.sQueryCompanyList.push({
                                        companyId: result[i].companyId,
                                        companyName: result[i].companyName
                                    });
                                }
                            }
                        }
                    );
                }
            },
            nsQueryCompanyByName: function () {
                if (vm.nsInputCompanyName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.queryCompanyByName,
                        {
                            companyName: vm.nsInputCompanyName
                        },
                        function (response, msgType, isOk) {
                            var result = response.data.results;
                            vm.nsQueryCompanyList = [];
                            if (result && result.length > 0) {
                                for (var i = 0; i < result.length; i++) {
                                    vm.nsQueryCompanyList.push({
                                        companyId: result[i].companyId,
                                        companyName: result[i].companyName
                                    });
                                }
                            }
                        }
                    );
                }
            },
            sSetCompanyId: function () {
                vm.supplierQueryData.companyId = $(this).data('companyid');
            },
            nsSetCompanyId: function () {
                vm.supplierData.companyId = $(this).data('companyid');
            },
            // 派单
            orderSend: function (data) {
                vm.orderType = 'send';
                vm.submitType = 'YES';
                vm.parkData = data;
                vm.parkData.title = '派单';
                vm.parkData.handleId = '0';
                vm.parkData.workOrderStatus = statusSetPark[vm.parkData.workOrderStatus].desc;

                setTimeout(function () {
                    $('.ui.dropdown').dropdown({direction: 'upward'});
                }, 0);

                // 获取接单人列表
                $.ajax({
                    url: window.currentApiUrl.repairService.handlerList,
                    type: 'GET',
                    data: 'parkId=' + data.parkId,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.handlerList = data.data.results;
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });

                var modal = $('#parkModal').modal({
                    closable: false,
                    onApprove: function() {
                        if (vm.submitType === 'YES' && vm.parkData.handleId === '0') {
                            cMethod.showPopupMessage('warning', '请选择接单人');
                            return false;
                        }

                        var handler;
                        for (var i = 0; i < vm.handlerList.length; i++) {
                            if (vm.handlerList[i].handleId == vm.parkData.handleId) {
                                handler = vm.handlerList[i];
                                break;
                            }
                                
                        }
                        var data = {
                            id: vm.parkData.id,
                            submitType: vm.submitType
                        }

                        // 接单
                        if (vm.submitType === 'YES') {
                            data.handleId = handler.handleId;
                            data.handleName= handler.handleName;
                            data.handlePhone = handler.handlePhone;
                        }

                        jqueryAjax.post(
                            window.currentApiUrl.repairService.orderSend,
                            data,
                            function (response, msgType, isOk) {
                                if (response.status === 200) {
                                    cMethod.showPopupMessage('success', response.message);
                                    pTable.draw();
                                } else {
                                    cMethod.showPopupMessage('error', response.message);
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                        vm.handlerList = [];
                    }
                });
                setTimeout(function() {modal.modal('show')}, 0);
            },
            // 接单
            orderReceive: function (data) {
                vm.orderType = 'receive';
                vm.submitType = 'YES';
                vm.parkData = data;
                vm.parkData.title = '接单';
                vm.parkData.workOrderStatus = statusSetPark[vm.parkData.workOrderStatus].desc;

                var modal = $('#parkModal').modal({
                    closable: false,
                    onApprove: function() {
                        var data = {
                            id: vm.parkData.id,
                            submitType: vm.submitType
                        }

                        jqueryAjax.post(
                            window.currentApiUrl.repairService.orderReceive,
                            data,
                            function (response, msgType, isOk) {
                                if (response.status === 200) {
                                    cMethod.showPopupMessage('success', response.message);
                                    pTable.draw();
                                } else {
                                    cMethod.showPopupMessage('error', response.message);
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                        vm.handlerList = [];
                    }
                });
                setTimeout(function() {modal.modal('show')}, 0);
            },
            // 退回
            orderReturn: function (data) {
                vm.orderType = 'return';
                vm.submitType = 'NO';
                vm.parkData = data;
                vm.parkData.title = '退回';
                vm.parkData.workOrderStatus = statusSetPark[vm.parkData.workOrderStatus].desc;

                var modal = $('#parkModal').modal({
                    closable: false,
                    onApprove: function() {
                        var data = {
                            id: vm.parkData.id,
                            submitType: vm.submitType,
                            notAcceptReason: vm.parkData.notAcceptReason
                        }

                        jqueryAjax.post(
                            window.currentApiUrl.repairService.orderReturn,
                            data,
                            function (response, msgType, isOk) {
                                if (response.status === 200) {
                                    cMethod.showPopupMessage('success', response.message);
                                    pTable.draw();
                                } else {
                                    cMethod.showPopupMessage('error', response.message);
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                });
                setTimeout(function() {modal.modal('show')}, 0);
            },
            // 反馈
            orderFeedback: function (data) {
                vm.orderType = 'feedback';
                vm.parkData = data;
                vm.parkData.title = '反馈';
                vm.parkData.workOrderStatus = statusSetPark[vm.parkData.workOrderStatus].desc;
                vm.parkData.feedBackText = '';

                // 获取操作信息列表
                $.ajax({
                    url: window.currentApiUrl.repairService.getTrackingInfo,
                    type: 'GET',
                    data: 'workOrderNo=' + data.workOrderNo,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.trackingInfo = data.data.results;
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });

                var modal = $('#parkModal').modal({
                    closable: false,
                    onApprove: function() {
                        if (vm.parkData.feedBackText == '') {
                            cMethod.showPopupMessage('warning', '请填写反馈内容');
                            return false;
                        }
                        var data = {
                            id: vm.parkData.id,
                            feedBackText: vm.parkData.feedBackText,
                        }

                        jqueryAjax.post(
                            window.currentApiUrl.repairService.orderFeedback,
                            data,
                            function (response, msgType, isOk) {
                                if (response.status === 200) {
                                    cMethod.showPopupMessage('success', response.message);
                                    pTable.draw();
                                } else {
                                    cMethod.showPopupMessage('error', response.message);
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                        
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                });
                setTimeout(function() {modal.modal('show')}, 0);
            },
            // 跟踪流程
            orderTrack: function (data) {
                vm.orderType = 'track';
                vm.parkData = data;
                vm.parkData.title = '跟踪流程';
                vm.parkData.workOrderStatus = statusSetPark[vm.parkData.workOrderStatus].desc;

                // 获取操作信息列表
                $.ajax({
                    url: window.currentApiUrl.repairService.getTrackingInfo,
                    type: 'GET',
                    data: 'workOrderNo=' + data.workOrderNo,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.trackingInfo = data.data.results;
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });

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
            },
            /**
             * 供应商操作
             */
            // 接单
            supplierReceive: function (data) {
                vm.sOrderType = 'receive';
                vm.supplierData = data;
                vm.supplierData.title = '接单';
                vm.supplierData.workOrderStatus = statusSetSupplier[vm.supplierData.workOrderStatus].desc;

                var modal = $('#supplierModal').modal({
                    closable: false,
                    onApprove: function() {
                        var data = {
                            id: vm.supplierData.id
                        }

                        jqueryAjax.post(
                            window.currentApiUrl.repairService.orderReceiveSupplier,
                            data,
                            function (response, msgType, isOk) {
                                if (response.status === 200) {
                                    cMethod.showPopupMessage('success', response.message);
                                    sTable.draw();
                                } else {
                                    cMethod.showPopupMessage('error', response.message);
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                    },
                    onDeny: function() {
                    }
                });
                setTimeout(function() {modal.modal('show')}, 0);
            },
            // 反馈
            supplierFeedback: function (data) {
                vm.sOrderType = 'feedback';
                vm.supplierData = data;
                vm.supplierData.title = '反馈';
                vm.supplierData.workOrderStatus = statusSetSupplier[vm.supplierData.workOrderStatus].desc;
                vm.supplierData.feedBackText = '';

                // 获取操作信息列表
                $.ajax({
                    url: window.currentApiUrl.repairService.getTrackingInfoSupplier,
                    type: 'GET',
                    data: 'workOrderNo=' + data.workOrderNo,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.trackingInfoSupplier = data.data.results;
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });

                var modal = $('#supplierModal').modal({
                    closable: false,
                    onApprove: function() {
                        if (vm.supplierData.feedBackText == '') {
                            cMethod.showPopupMessage('warning', '请填写反馈内容');
                            return false;
                        }
                        var data = {
                            id: vm.supplierData.id,
                            feedBackText: vm.supplierData.feedBackText
                        }

                        jqueryAjax.post(
                            window.currentApiUrl.repairService.orderFeedbackSupplier,
                            data,
                            function (response, msgType, isOk) {
                                if (response.status === 200) {
                                    cMethod.showPopupMessage('success', response.message);
                                    sTable.draw();
                                } else {
                                    cMethod.showPopupMessage('error', response.message);
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                    },
                    onDeny: function() {
                    }
                });
                setTimeout(function() {modal.modal('show')}, 0);
            },
            // 跟踪流程
            supplierTrack: function (data) {
                vm.sOrderType = 'track';
                vm.supplierData = data;
                vm.supplierData.title = '跟踪流程';
                vm.supplierData.workOrderStatus = statusSetSupplier[vm.supplierData.workOrderStatus].desc;

                // 获取操作信息列表
                $.ajax({
                    url: window.currentApiUrl.repairService.getTrackingInfoSupplier,
                    type: 'GET',
                    data: 'workOrderNo=' + data.workOrderNo,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.trackingInfoSupplier = data.data.results;
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });

                var modal = $('#supplierModal').modal({
                    closable: false,
                    onApprove: function() {
                    },
                    onDeny: function() {
                    }
                });
                setTimeout(function() {modal.modal('show')}, 0);
            },
            // 详情
            supplierDetail: function (data) {
                vm.sOrderType = 'detail';
                vm.supplierData = data;
                vm.supplierData.title = '详情';
                vm.supplierData.status = vm.supplierData.workOrderStatus;
                vm.supplierData.workOrderStatus = statusSetSupplier[vm.supplierData.workOrderStatus].desc;

                var modal = $('#supplierModal').modal({
                    closable: false,
                    onApprove: function() {
                    },
                    onDeny: function() {
                    }
                });
                setTimeout(function() {modal.modal('show')}, 0);
            },
        }),
        dataSet = {
            park: {
                queryData: vm.parkQueryData,
            },
            supplier: {
                queryData: vm.supplierQueryData,
            }
        },
        statusSetPark = {
            UNSEND: {
                desc: '未派单 ',
                color: 'red',
                operation: '<a class="send">派单</a>'
            },
            SENDED: {
                desc: '已派单 ',
                color: '#FFCC66',
                operation: '<a class="receive">接单</a><a class="return">退回</a><a class="track">跟踪流程</a>'
            },
            RECEIVED: {
                desc: '已接单 ',
                color: '#008000',
                operation: '<a class="feedback">反馈</a><a class="track">跟踪流程</a>'
            },
            FEEDBACK: {
                desc: '已完成反馈 ',
                color: '#999999',
                operation: '<a class="track">跟踪流程</a>'
            },
            CANCEL: {
                desc: '已取消 ',
                operation: '<a class="detail">详情</a>'
            },
            SEND_BACK: {
                desc: '已退回 ',
                operation: '<a class="send">派单</a>'
            },
            UNSEND_TIMEOUT: {
                desc: '超时未派 ',
                color: 'red',
                operation: '<a class="send">派单</a>'
            },
            UNRECEIVE_TIMEOUT: {
                desc: '超时未接 ',
                color: 'red',
                operation: '<a class="receive">接单</a><a class="return">退回</a><a class="track">跟踪流程</a>'
            },
            IGNORE: {
                desc: '不接单 ',
                color: '#4693C4',
                operation: '<a class="track">跟踪流程</a>'
            }
        },
        statusSetSupplier = {
            UNRECEIVE: {
                desc: '未接单',
                color: 'red',
                operation: '<a class="receive">接单</a><a class="detail">详情</a>'
            },
            RECEIVED: {
                desc: '已接单 ',
                color: '#008000',
                operation: '<a class="feedback">反馈</a><a class="track">跟踪流程</a>'
            },
            FEEDBACK: {
                desc: '已完成反馈 ',
                color: '#999999',
                operation: '<a class="track">跟踪流程</a>'
            },
            CANCEL: {
                desc: '已取消 ',
                operation: '<a class="detail">详情</a>'
            },
            UNRECEIVE_TIMEOUT: {
                desc: '超时未接 ',
                color: 'red',
                operation: '<a class="receive">接单</a><a class="track">跟踪流程</a>'
            },
            UNFEEDBACK_TIMEOUT: {
                desc: '超时未反馈 ',
                color: 'red',
                operation: '<a class="feedback">反馈</a><a class="track">跟踪流程</a>'
            }
        };

    var pBaseTableOpts = {
            container: '#parkTable',
            isShowIndexNumber: false,
            columns: [
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
                    return [
                        '<span style="color: ',
                        statusSetPark[val].color,
                        '">',
                        statusSetPark[val].desc,
                        '</span>'
                    ].join('');
                }},
                {field: 'workOrderStatus', title: '操作', isShow: true, isSort: false, textAlign: 'center', width: '160px', render: function(val) {
                    return '<div class="tr-operation" style="text-align: center">' +
                        statusSetPark[val].operation +
                        '</div>';
                }},
            ],
            ajax: {
                url: window.currentApiUrl.repairService.parkOrderList,
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
                    if (target.hasClass('send')) {
                        vm.orderSend(data);
                    } else if (target.hasClass('receive')) {
                        vm.orderReceive(data);
                    } else if (target.hasClass('return')) {
                        vm.orderReturn(data);
                    } else if (target.hasClass('track')) {
                        vm.orderTrack(data);
                    } else if (target.hasClass('feedback')) {
                        vm.orderFeedback(data);
                    } else if (target.hasClass('detail')) {
                        vm.orderDetail(data);
                    }
                }
            }
        },
        sBaseTableOpts = {
            container: '#supplierTable',
            isShowIndexNumber: false,
            columns: [
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
                    return [
                        '<span style="color: ',
                        statusSetSupplier[val].color,
                        '">',
                        statusSetSupplier[val].desc,
                        '</span>'
                    ].join('');
                }},
                {field: 'workOrderStatus', title: '操作', isShow: true, isSort: false, textAlign: 'center', width: '140px', render: function(val) {
                    return '<div class="tr-operation" style="text-align: center">' +
                        statusSetSupplier[val].operation +
                        '</div>';
                }},
            ],
            ajax: {
                url: window.currentApiUrl.repairService.supplierOrderList,
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
                    if (target.hasClass('receive')) {
                        vm.supplierReceive(data);
                    } else if (target.hasClass('feedback')) {
                        vm.supplierFeedback(data);
                    } else if (target.hasClass('track')) {
                        vm.supplierTrack(data);
                    } else if (target.hasClass('detail')) {
                        console.log(data.workOrderStatus)
                        vm.supplierDetail(data);
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
            vm.$watch('supplierServiceName', function (v) {
                var supplierIds;
                vm.supplierData.serviceName = v;
                for (var i=0, len=vm.supplierServiceList.length; i < len; i++) {
                    console.log(vm.supplierServiceList[i])
                    if (vm.supplierServiceList[i].serviceName == v) {
                        supplierIds = vm.supplierServiceList[i].supplierIds;
                        break;
                    }
                }
                jqueryAjax.get(
                    window.currentApiUrl.repairService.getSupplierList,
                    {
                        supplierIds: supplierIds
                    },
                    function (response, msgType, isOk) {
                        vm.supplierList = response.data.results;
                    }
                )
            });

            vm.$watch('supplierId', function (v) {
                vm.supplierData.supplierId = v;
                for (var i=0, len=vm.supplierList.length; i < len; i++) {
                    if (vm.supplierList[i].supplierId == v) {
                        vm.supplierData.supplierCompanyName = vm.supplierList[i].supplierCompanyName;
                        break;
                    }
                }
            })
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