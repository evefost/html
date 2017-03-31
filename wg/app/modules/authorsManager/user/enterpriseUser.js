/**
 * 用户管理-企业用户
 */
define([
    'component-message',
    'jqueryAjax',
    'component-ztree',
    'component-datatable',
    'component-datetimerpicker',
    'appPath/common/commonMethods',
    'jquery.semantic'
], function (cMessage, jqueryAjax, cZtree,cDataTable,cDateTimerPicker,cMthods) {
    var myTable,
        commonData = cMthods.getRoleData().roleCommonData,
        sexData = commonData.sex,
        useStatusData = commonData.useStatus,
        enterpriseUserStatus = [
            {
                name:'待审核',
                value:'1'
            },
            {
                name:'已审核',
                value:'2'
            },
            {
                name:'审核不通过',
                value:'3'
            },
            {
                name:'未提交审核',
                value:'-1'
            }
        ],
        defaultFromData = function () {
            return {
                userName : '',
                phone : '',
                image : '',
                parkName : '',
                companyName : '',
                gender : '',
                createTime : '',
                updateTime : '',
                authStatus : '', // 用户状态 1 待审核，2 已审核，3 审核不通过，-1 未提交审核
                userStatus: '', // 用户状态 YES 已启用，NO 已禁用
                auths: '', // 审批时选择的状态，通过或不通过
                points : '',
                authImage : '',
                content : '',
                operatorName : '',
                operatorPhone : '',
                operateDate : '',
            }
        },
        defaultSearchData = function () {
            return {
                userName:'',
                phone:'',
                parkName:'',
                gender:'0',
                useStatus:'0',
                beginUTime:'',
                endUTime:'',
                companyName: '',
                authStatus:1
            }
        },
        vm = avalon.define({
            $id: 'enterpriseUser',
            inputParkName:'',
            queryParkList:[],
            useStatusList:useStatusData,
            sexList:sexData,
            enterpriseUserStatusList:enterpriseUserStatus,
            currentStatus:1,
            currentActiveStatus:'info',
            enterpriseUser:defaultFromData(),
            searchFormData:defaultSearchData(),
            currentInfoTitle: '',
            search:function () {
                myTable.draw();
            },
            reset:function () {
                var currentStatus = vm.currentStatus;
                vm.searchFormData = defaultSearchData();
                vm.searchFormData.authStatus = currentStatus;
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },200);
            },
            showEditWin: function (data) {
                vm.showAddWin(true,data);
            },
            showAuditWin:function(data){
                console.log(vm.currentStatus)
                vm.enterpriseUser = data;
                vm.currentActiveStatus = 'audit';
                vm.enterpriseUser.auths = '';
                vm.enterpriseUser.content = '';
                vm.currentInfoTitle = '审核';

                var gender = vm.enterpriseUser.gender;
                vm.enterpriseUser.gender = (gender == '' ? '' : cMthods.getItemByAttrFromItems({key: 'value', value: gender}, sexData)['name']);

                if (vm.enterpriseUser.userStatus == 'YES') {
                    vm.enterpriseUser.userStatus = '已启用';
                } else if (vm.enterpriseUser.userStatus == 'NO') {
                    vm.enterpriseUser.userStatus = '已禁用';
                }
                switch (vm.enterpriseUser.authStatus) {
                    case -1:
                        vm.enterpriseUser.authStatus = '未提交审核';
                        break;
                    case 1:
                        vm.enterpriseUser.authStatus = '待审核（认证中）';
                        break;
                    case 2:
                        vm.enterpriseUser.authStatus = '审核通过';
                        break;
                    case 3:
                        vm.enterpriseUser.authStatus = '审核不通过';
                        break;
                }
                var myApproveModel  = $('#enterpriseUserInfoWin').modal({
                    closable: false,
                    onApprove: function () {
                        //获取区域code
                        var msg = '';
                        if (vm.enterpriseUser.auths == '' || vm.enterpriseUser.auths =='0') {
                            msg = '请选择审核结果';
                        }else if (vm.enterpriseUser.auths == '3' && vm.enterpriseUser.content == '') {
                            msg = '审核意见不能为空';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        jqueryAjax.post(
                            window.currentApiUrl.user.enterpriseUserAudit,
                            {
                                id : vm.enterpriseUser.id,
                                auths : vm.enterpriseUser.auths,
                                content : vm.enterpriseUser.content
                            },
                            function (response, msgType, isOk) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                                if (isOk) {
                                    myApproveModel.modal('hide');
                                    myTable.draw();
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }
                        );
                        return false;
                    }
                }).modal('show');
            },
            showInfoWin:function(data){
                vm.enterpriseUser = data;
                vm.currentInfoTitle = '详情';

                var gender = vm.enterpriseUser.gender;
                vm.enterpriseUser.gender = (gender == '' ? '' : cMthods.getItemByAttrFromItems({key: 'value', value: gender}, sexData)['name']);

                if (vm.enterpriseUser.userStatus == 'YES') {
                    vm.enterpriseUser.userStatus = '已启用';
                } else if (vm.enterpriseUser.userStatus == 'NO') {
                    vm.enterpriseUser.userStatus = '已禁用';
                }
                switch (vm.enterpriseUser.authStatus) {
                    case -1:
                        vm.enterpriseUser.authStatus = '未提交审核';
                        break;
                    case 1:
                        vm.enterpriseUser.authStatus = '待审核（认证中）';
                        break;
                    case 2:
                        vm.enterpriseUser.authStatus = '审核通过';
                        break;
                    case 3:
                        vm.enterpriseUser.authStatus = '审核不通过';
                        break;
                }
                vm.currentActiveStatus = 'info';
                var myInfoModel  = $('#enterpriseUserInfoWin').modal('show');
            },
            changeCurrentEnterpriseStatus:function(statusValue){
                vm.currentStatus = statusValue;
                vm.searchFormData.authStatus = statusValue;
                vm.search();
            },
            showDisenableWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要禁用当前用户？！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.user.disenableEnterpriseUser,
                            {id: id},
                            function (response, msgType, isOk) {
                                myTable.draw();
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
                    content: '您确认要启用当前用户?',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.user.enableEnterpriseUser,
                            {id: id},
                            function (response, msgType, isOk) {
                                myTable.draw();
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
            }
        }),
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'userName', title: '用户姓名', isShow: true, isSort: false},
                {field: 'phone', title: '手机号码', isShow: true, isSort: false},
                {field: 'parkName', title: '所属园区', isShow: true, isSort: false},
                {field: 'companyName', title: '所属企业', isShow: true, isSort: false},
                {field: 'gender', title: '性别', isShow: true, isSort: false, render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, sexData)['name'];
                }},
                {field: 'createTime', title: '创建时间', isShow: true, isSort: false},
                {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
                {field: 'authStatus', title: '用户状态', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, enterpriseUserStatus)['name'];
                }},
                {field: 'userStatus', title: '启用状态', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, useStatusData)['name'];
                }},
                {
                    field: null, title: '操作',width:100, isShow: true, isSort: false,
                    render: function (data) {
                        var isEnableHtml = data.userStatus == 'YES' ? '<i class="icon unlock black" title="禁用"></i>' :'<i class="icon lock orange" title="启用"></i>',
                            auditHtml = data.authStatus == 1 ? '<i class="icon treatment red" title="审核"></i>' :'';
                        if(data.authStatus==2){
                            isEnableHtml = isEnableHtml;
                        }else{
                            isEnableHtml = '';
                        }
                        return '<div class="tr-operation">' +
                            '<i class="icon info circle teal" title="详情"></i>' +
                            isEnableHtml+auditHtml+
                            '</div>';
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.user.enterpriseUserList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    $.extend(data,vm.searchFormData);
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon info')) {
                        vm.showInfoWin(rowData);
                    } else if (target.hasClass('icon treatment')) {
                        vm.showAuditWin(rowData);
                    } else if (target.hasClass('icon unlock')) {
                        vm.showDisenableWin(rowData.id);
                    } else if (target.hasClass('icon lock')) {
                        vm.showEnableWin(rowData.id);
                    }
                }
            }
        };
    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {}
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            vm.searchFormData = defaultSearchData();
            cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
            myTable = cDataTable.initBaseTable(baseTableOpts);
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            },200);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
