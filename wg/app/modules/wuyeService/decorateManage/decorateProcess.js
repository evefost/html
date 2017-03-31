/**
 * 客服工单操作
 *  房源投放管理/预约看房管理/委托找房管理 列表
 */
define([
    'component-message',
    'component-datatable',
    'component-ztree',
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-datetimerpicker',
    'jquery.semantic'
], function (cMessage, cDataTable,cZtree, jqueryAjax, cMthods,cDateTimerPicker) {
    var myTable,myUserTable,
        commonData = cMthods.getRoleData().roleCommonData,
        project = cMthods.getRoleData().project,
        cityListData = commonData.cityList,
        orderSourceData = commonData.orderSourceList,
        orderTypeData = commonData.orderTypeList,
        handleResultData = commonData.handleResultList,
        launchTypeData = commonData.launchTypeList,
        accountTypeData = commonData.accountAllType,
        deptTreeData = commonData.deptTree,
        isJobData = commonData.isJob,
        defaultData = function () {
            return {
                id: '',
                orderType:'TF',
                phone:'',
                userId:''
            }
        },
        orderSearchData = function () {
              return {
                  orderSource:'0',
                  handleResult:'0',
                  orderSn:'',
                  phone:'',
                  workerName:'',
                  accountId:'',
                  realName:'',
                  startTime:'',
                  endTime:''
              }
        },
        orderPaidangData = function () {
            return {
                orderType:'',
                orderSn:'',
                orderId:'',
                taskType:'',
                handlerId:'',
                description:'',
                handleResult:'',
                appointmentTime:'',
                lookTime:''
            }
        },
        searchUserData = function () {
            return {
                userId:0,
                phone:'',
                realName:'',
                deptId:''
            }
        },
        selectUserInfoData = function () {
            return {
                accountName:'用户名',
                realName:'真实姓名',
                userId:0
            }
        },
        cancelData = function () {
            return {
                id:'',
                reason:'',
                orderType:''
            }
        },
        vm = avalon.define({
            $id: 'orderService',
            btnText:'', //按钮文字
            routerStatus:'', //跳转页面status
            //搜索属性
            //orderStatus：4种工单状态，UNHANDLED（未处理）/HANDLING（处理中）/HANDLED（已处理）/DISPATCHING(已派单)
            //orderType：3种工单类型，TF（投放房源）/KF（预约看房）/ZF（委托找房）
            orderStatus:'UNHANDLED',
            orderType:'TF',
            projectData: project,
            orderSourceList:orderSourceData,
            orderTypeList:orderTypeData,
            launchTypeList:launchTypeData,
            order : defaultData(),
            orderSearch:orderSearchData(),
            searchUser:searchUserData(),
            //for add win
            hasCustomer:false,
            //for paidang win
            orderPaidang:orderPaidangData(),
            orderPaidangAppointmentTime:'',
            selectUserInfo:selectUserInfoData(),
            orderCancel:cancelData(),
            search: function () {
                myTable.fnDraw();
            },
            userSearch: function () {
                myUserTable.fnDraw();
            },
            changeOrderStatus:function (type) {
                vm.orderStatus = type;
                vm.handleResult = '0';
                vm.search();
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },50);
                if(vm.orderStatus == "DISPATCHING"){
                    myTable.fnSetColumnVis(8,true);
                    myTable.fnSetColumnVis(9,true);
                    myTable.fnSetColumnVis(10,true);
                    myTable.fnSetColumnVis(12,true);
                }else if(vm.orderStatus == "HANDLED"){
                    myTable.fnSetColumnVis(8,true);
                    myTable.fnSetColumnVis(9,true);
                    myTable.fnSetColumnVis(10,false);
                    myTable.fnSetColumnVis(12,true);
                }else{
                    myTable.fnSetColumnVis(8,false);
                    myTable.fnSetColumnVis(9,false);
                    myTable.fnSetColumnVis(10,false);
                    myTable.fnSetColumnVis(12,false);
                }
            },
            //客服自接工单
            pickTFOrder:function () {
                if(myTable.fnGetData().length==0){
                    jqueryAjax.post(
                        window.currentApiUrl.orderManager.orderReceive,
                        {orderType:vm.orderType},
                        function (response, msgType, isOk) {
                            cMessage.showPopup({
                                className: msgType,
                                content: response.message
                            });
                            if (isOk) {
                                myTable.fnDraw();
                            }
                        },
                        function (response, msgType) {
                            cMessage.showPopup({
                                className: msgType,
                                content: response.message
                            });
                        }
                    );
                }else{
                    cMessage.showPopup({
                        className: 'warning',
                        content: '小伙子，未处理工单还有呢，不要这么着急嘛'
                    });
                }
            },
            //新增订单
            showOrderAddWin:function () {
                //localStorage.removeItem('orderEditData');
                avalon.router.go('boss.service.'+vm.routerStatus+'.addOrder',{orderType:vm.orderType,id:'0'});
            },
            //客服派单
            showOrderPaidangWin:function (data) {
                if(!data.haveItemFlag){
                    cMessage.showPopup({
                        className: 'warning',
                        content: '订单中没有关联房源，请先关联房源信息！'
                    });
                    return
                }
                var url = window.currentApiUrl.orderManager.transferOrderTask;
                vm.orderPaidang = data;
                vm.selectUserInfo = selectUserInfoData();
                vm.orderPaidangAppointmentTime = '';
                if(data.orderType=='KF'||data.orderType=='ZF'){
                    vm.orderPaidang.handleResultText = '房源带看';
                }else if(data.orderType=='TF'){
                    vm.orderPaidang.handleResultText = '现场实勘';
                }
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },200);
                myUserTable = cDataTable.initBaseTable(userTableOpts);
                var myModal = $('#orderPaidangWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '';
                        if(vm.selectUserInfo.userId==0){
                            msg = '请选择线下操作人员';
                        }else{
                            msg = '';
                        }
                        if(msg!=''){
                            cMessage.showPopup({className:'warning',content:msg});
                            return false;
                        }
                        jqueryAjax.post(
                            url,
                            {
                                orderType:vm.orderPaidang.orderType,
                                orderSn:vm.orderPaidang.orderSn,
                                orderId:vm.orderPaidang.id,
                                handleResult:vm.orderPaidang.handleResult,
                                appointmentTime:vm.orderPaidang.appointmentTime,
                                handlerId:vm.selectUserInfo.userId
                            },
                            function (response, msgType, isOk) {
                                myTable.fnDraw();
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                                if (isOk) {
                                    myModal.modal('hide');
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                        return false;
                    },
                    onDeny: function () {
                        //houseInfoTable.fnDestroy();
                    }
                }).modal('show');
            },
            addSelectUsers:function (data) {
                vm.selectUserInfo = {
                    accountName:data.accountName,
                    realName:data.realName,
                    userId:data.id
                }
            },
              /*重置查询条件*/
            reset: function(e) {
                $(".column input").val("");
                $('.column .ui.dropdown').dropdown('restore defaults');
                vm.search();

            },
            showCancelWin: function (id) {
                if(id <= 0)return;
                vm.orderCancel.id = id;
                vm.orderCancel.reason = "";
                vm.orderCancel.orderType = vm.orderType;
                var myCancelModel = $('#cancelWin').modal({
                    closable: false,
                    autofocus:false,
                    onApprove: function () {
                        if (vm.orderCancel.reason == '') {
                            cMessage.showPopup({className: 'warning', content: '请输入取消原因'});
                            return false;
                        }
                        jqueryAjax.post(
                            window.currentApiUrl.orderManager.orderCancel,
                            vm.orderCancel,
                            function (response, msgType, isOk) {
                                myTable.fnDraw();
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                                if (isOk) {
                                    myCancelModel.modal('hide');
                                    myTable.fnDraw();
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                        return false;
                    }
                }).modal('show');
            }
        }),
        baseTableOpts = {
            isShowIndexNumber: false,
            columns: [
                {field: 'orderSn', title: '工单号', isShow: true, isSort: false},
                {field: 'orderSource', title: '工单来源', isShow: true, isSort: false,render: function (data) {
                    return  data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, orderSourceData)['name'];
                }},
                {field: 'realName', title: '客户名称', isShow: true, isSort: false},
                {field: 'phone', title: '客户电话', isShow: true, isSort: false},
                {field: 'createTime', title: '创建时间', isShow: true, isSort: false},
                {field: 'workerName', title: '客服名称', isShow: true, isSort: false},
                {field: 'workNumber', title: '坐席号', isShow: true, isSort: false},
                {field: 'updateTime', title: '处理时间', isShow: true, isSort: false},
                {field: 'brokerName', title: '经纪人', isShow: false, isSort: false},
                {field: 'brokerPhone', title: '经纪人电话', isShow: false, isSort: false},
                {field: 'appointmentTime', title: '预约带看时间', isShow: false, isSort: false},
                {field: 'handleResult', title: '状态标签', isShow: true, isSort: false,render: function (data) {
                    return  data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, handleResultData)['name'];
                }},
                {field: 'lookTime', title: '带看完成时间', isShow: false, isSort: false},
                
                {field: null, title: '操作', isShow: true, isSort: false,width:160,render: function (data) {
                    var operationsIconbtnHtml = '',
                        editHtml = '<i class="icon edit green" title="编辑"></i>',
                        infoHtml = '<i class="icon unhide black" title="查看"></i>',
                        dispatchHtml =  '<i class="icon external violet" title="派单"></i>',
                        zhuandanHtml =  '<i class="icon random blue" title="转单"></i>',
                        cancelHtml = '<i class="icon undo red" title="取消"></i>';
                    operationsIconbtnHtml = infoHtml;
                    if(vm.orderStatus == 'HANDLING'){
                        operationsIconbtnHtml += editHtml + cancelHtml;
                        if(data.handleResult == 'NOT_DISPATCH') operationsIconbtnHtml += dispatchHtml;
                        else if(data.handleResult == 'NOT_TRANSFER') operationsIconbtnHtml += zhuandanHtml;
                    }else if(vm.orderStatus == "UNHANDLED"){
                        operationsIconbtnHtml = editHtml + infoHtml;
                    }else if(vm.orderStatus == 'HANDLED'){
                        operationsIconbtnHtml = infoHtml;
                    }else if(vm.orderStatus == 'DISPATCHING'){
                        operationsIconbtnHtml = infoHtml + cancelHtml;
                    }
                    return '<div class="tr-operation">' + operationsIconbtnHtml + '</div>';
                }}
            ],
            ajax: {
                url: window.currentApiUrl.wuyeService.orderManage.customerOrderList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.orderStatus = vm.orderStatus;
                    data.orderType = vm.orderType;
                    data.orderSn = vm.orderSearch.orderSn;
                    data.orderSource = vm.orderSearch.orderSource;
                    data.handleResult = vm.orderSearch.handleResult;
                    data.phone = vm.orderSearch.phone;
                    data.realName = vm.orderSearch.realName;
                    data.startTime = vm.orderSearch.startTime;
                    data.endTime = vm.orderSearch.endTime;
                    data.workerName = vm.orderSearch.workerName;
                    data.accountId = vm.orderSearch.accountId;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        avalon.router.go('boss.service.'+vm.routerStatus+'.addOrder',{orderType:rowData.orderType,id:rowData.id});
                    }else if(target.hasClass('icon unhide')){
                        avalon.router.go('boss.service.'+vm.routerStatus+'.reviewOrder',{orderType:rowData.orderType,id:rowData.id});
                    }else if(target.hasClass('icon external')){
                        vm.showOrderPaidangWin(rowData);
                    }else if(target.hasClass('icon random')){
                        vm.showOrderPaidangWin(rowData);
                    }else if(target.hasClass('icon undo red')){
                        vm.showCancelWin(rowData.id);
                    }
                }
            }
        },
        userTableOpts = {
            isShowIndexNumber: true,
            container: '#orderUserTable',
            pagingType: 'simple',
            bLengthChange:false,
            pageSize:5,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'realName', title: '员工姓名', isShow: true, isSort: false},
                {field: 'accountName', title: '用户名', isShow: true, isSort: false},
                {field: 'phone', title: '员工电话', isShow: true, isSort: false},
                {field: 'departmentId', title: '所属部门', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'id', value: data}, deptTreeData)['name'];
                }},
                {field: 'accountType', title: '账号类型', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, accountTypeData)['name'];
                }},
                {field: 'isJob', title: '在职状态', isShow: true, isSort: false, render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, isJobData)['name'];
                }},
                {field: 'issAdmin', title: '是否管理者', isShow: true, isSort: false, render: function (data) {
                    return data==1?'是':"否";
                }},
                {field: null, title: '操作', isShow: true, isSort: false, render: function () {
                    return '<div class="tr-operation"><i class="icon add user green" title="选择用户"></i></div>';
                }}
            ],
            ajax: {
                url: window.currentApiUrl.wuyeService.orderManage.selectBrokerList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.deptId= vm.searchUser.deptId;
                    data.realName= vm.searchUser.realName;
                    data.phone= vm.searchUser.phone;
                    data.useStatus= 'USEING';
                    data.isJob= '1';
                    data.orderType=vm.orderPaidang.orderType;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon add user')) {
                        vm.addSelectUsers(rowData);
                    }
                }
            }
        };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {}
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            var states = (mmState.currentState.stateName).split('.'),
                orderTypeName = states[states.length-1];
            //orderType：3种工单类型，TF（投放房源）/KF（预约看房）/ZF（委托找房）
            vm.routerStatus = orderTypeName;
            vm.orderSearch = orderSearchData();
            switch(orderTypeName){
                case 'putHouseOrder':
                    vm.orderType = 'TF';
                    vm.btnText = '投放房源';
                    break;
                case 'watchHouseOrder':
                    vm.orderType = 'KF';
                    vm.btnText = '预约看房';
                    break;
                case 'findHouseOrder':
                    vm.orderType = 'ZF';
                    vm.btnText = '委托找房';
                    break;
            }
            vm.orderStatus = 'UNHANDLED';
            //初始化组件
            cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
            myTable = cDataTable.initBaseTable(baseTableOpts);
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            },20);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
