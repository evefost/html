/**
 * 用户管理
 */
define([
    'component-message',
    'jqueryAjax',
    'component-ztree',
    'component-datatable',
    'component-datetimerpicker',
    'appPath/common/commonMethods',
    'jquery.semantic'
], function (cMessage, jqueryAjax, cZtree, cDataTable, cDateTimerPicker, cMthods) {
    var myTable,
        commonData = cMthods.getRoleData().roleCommonData,
        sexData = commonData.sex,
        useStatusData = commonData.useStatus,
        roleListData = commonData.roleList,
        defaultFromData = function () {
            return {
                id: '',
                userName: '',
                phone: '',
                parkIds: '',
                post: '',
                gender: 'MALE',
                birthday: '',
                roleIds: '',
                iDNumber: '',
                email: ''
            }
        },
        defaultSearchData = function () {
            return {
                userName: '',
                phone: '',
                parkName: '',
                post: '',
                gender: '0',
                useStatus: '0',
                startDate: '',
                endDate: ''
            }
        },
        vm = avalon.define({
            $id: 'companyUser',
            inputParkName: '',
            useStatusList: useStatusData,
            sexList: sexData,
            roleList: roleListData,
            companyUser: defaultFromData(),
            searchFormData: defaultSearchData(),
            allParkList: [],
            selectParkList: [],
            search: function () {
                myTable.draw();
            },
            reset: function () {
                vm.searchFormData = defaultSearchData();
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);
            },
            showAddWin: function (isEdit, data) {
                var url = window.currentApiUrl.user.companyUserEdit,
                    allCheckBox = $('#companyUserSelectPark').find('input[type=checkbox]');
                cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
                if (!isEdit) {
                    vm.companyUser = defaultFromData();
                    cMthods.selectCheckboxByValues(allCheckBox,'');
                    url = window.currentApiUrl.user.companyUserAdd;
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        $('.ui.dropdown.link-change').dropdown('clear');
                    }, 200);
                } else {
                    vm.companyUser = data;
                    cMthods.selectCheckboxByValues(allCheckBox,data.parkIds);
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        $('#companyRoleIdsSelect').dropdown('clear').dropdown('set selected', vm.companyUser.roleIds != '' ? vm.companyUser.roleIds.split(',') : '');
                    }, 200);
                }
                //获取树形控件选中的值
                var myModal = $('#companyUserAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        console.log(vm.companyUser.userName);
                        var msg = '',
                            roleIdsArray = $('#companyRoleIdsSelect').val(),
                            selectedParkIds = cMthods.getSelectedCheckboxValues($('#companyUserSelectPark').find('input[type=checkbox]:checked'));
                        if (vm.companyUser.userName == '') {
                            msg = '员工姓名不能为空';
                        } else if (vm.companyUser.parkId == '') {
                            msg = '请选择所属园区';
                        } else if (vm.companyUser.phone == '') {
                            msg = '手机号码不能为空';
                        } else if (!cMthods.validatePhone(vm.companyUser.phone)) {
                            msg = '手机号不合法';
                        } else if (vm.companyUser.iDNumber == '') {
                            msg = '身份证号码不能为空';
                        } else if (!cMthods.validateIDcard(vm.companyUser.iDNumber)) {
                            msg = '身份证号码不合法';
                        } else if (vm.companyUser.post == '') {
                            msg = '职务不能为空';
                        } else if (vm.companyUser.email == '') {
                            msg = '电子邮箱不能为空';
                        } else if (!cMthods.validateEmail(vm.companyUser.email)) {
                            msg = '电子邮箱不合法';
                        } else if (roleIdsArray == null || roleIdsArray == '') {
                            msg = '所属角色不能为空';
                        } else if (selectedParkIds=='') {
                            msg = '请选择服务园区';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        vm.companyUser.roleIds = roleIdsArray == null ? '' : roleIdsArray.join(',');
                        vm.companyUser.parkIds = selectedParkIds;
                        jqueryAjax.post(
                            url,
                            vm.companyUser,
                            function (response, msgType, isOk) {
                                myTable.draw();
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
                    }
                }).modal('show');
            },
            showEditWin: function (data) {
                vm.showAddWin(true, data);
            },
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.user.companyUserDel,
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
            showDisenableWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要禁用当前用户？！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.user.disenableCompanyUser,
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
                            window.currentApiUrl.user.enableCompanyUser,
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
            resetPassword: function (id) {
                cMessage.showAlert({
                    content: '您确认要重置密码吗？',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.user.resetcompanyUserPassword,
                            {id: id},
                            function (response, msgType, isOk) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }
                        );
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
                {field: 'parkNames', title: '服务园区', isShow: true, isSort: false, width: 300},
                {field: 'post', title: '职务', isShow: true, isSort: false},
                {
                    field: 'gender', title: '性别', isShow: true, isSort: false, render: function (data) {
                    return data == '' ? '' : cMthods.getItemByAttrFromItems({
                        key: 'value',
                        value: data
                    }, sexData)['name'];
                }
                },
                {field: 'createTime', title: '创建时间', isShow: true, isSort: false},
                {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
                {
                    field: 'useStatus', title: '启用状态', isShow: true, isSort: false, render: function (data) {
                    return data == '' ? '' : cMthods.getItemByAttrFromItems({
                        key: 'value',
                        value: data
                    }, useStatusData)['name'];
                }
                },
                {
                    field: null, title: '操作', isShow: true, isSort: false,
                    render: function (data) {
                        var isEnableHtml = data.useStatus == 'YES' ? '<i class="icon unlock black" title="禁用"></i>' : '<i class="icon lock orange" title="启用"></i>';
                        return '<div class="tr-operation">' +
                            '<i class="icon recycle purple" title="重置密码"></i>' +
                            isEnableHtml +
                            '<i class="icon edit green"></i>' +
                            '<i class="icon remove red"></i>' +
                            '</div>';
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.user.companyUserList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.userName = vm.searchFormData.userName;
                    data.parkName = vm.searchFormData.parkName;
                    data.startDate = vm.searchFormData.startDate;
                    data.endDate = vm.searchFormData.endDate;
                    data.post = vm.searchFormData.post;
                    data.phone = vm.searchFormData.phone;
                    data.useStatus = vm.searchFormData.useStatus;
                    data.gender = vm.searchFormData.gender;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon recycle')) {
                        vm.resetPassword(rowData.id);
                    } else if (target.hasClass('icon edit')) {
                        vm.showEditWin(rowData);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(rowData.id);
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
        $ctrl.$onEnter = function () {
            jqueryAjax.get(
                window.currentApiUrl.queryAllPark,
                {},
                function (response, msgType, isOk) {
                    var result = response.data.results;
                    vm.allParkList = [];
                    if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            vm.allParkList.push({
                                parkId: result[i].parkId,
                                parkName: result[i].parkName,
                                cityName: result[i].cityName,
                                cityCode: result[i].cityCode
                            });
                        }
                    }
                }
            );
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            vm.searchFormData = defaultSearchData();
            cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
            myTable = cDataTable.initBaseTable(baseTableOpts);
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            }, 200);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
