/**
 * 用户管理
 */
 define([
 'component-message',
 'jqueryAjax',
 'component-datatable',
 'component-datetimerpicker',
 'appPath/common/commonMethods',
 'jquery.semantic'
 ], function (cMessage, jqueryAjax,cDataTable,cDateTimerPicker,cMethod) {
     var table,
         getQueryData = function () {
             return {
                 name: '',
                 phone: '',
                 roleId: '',
                 post: '',
                 gender: '0',
                 contactsPosition: '',
                 isEnabled: '0',
                 startDate: '',
                 endDate: ''
             }
         },
         getUserData = function () {
             return {
                 title: '',
                 name: '',
                 phone: '',
                 gender: 'MALE',
                 post: '',
                 birthday: '',
                 roleId: '0'
             }
         },
         getRoleList = function () {
             $.ajax({
                 url: window.currentApiUrl.basicData.sRoleList,
                 type: 'GET',
                 async: false,
                 cache: false,
                 contentType: false,
                 processData: false,
                 success: function (data) {
                     vm.roleList = data.data.roleList;
                 }
             });
         }
         vm = avalon.define({
             $id: 'sEstateUser',
             commonData: cMethod.getRoleData(),
             queryData: getQueryData(),
             userData: getUserData(),
             roleList: null,
             isEdit: false,
             search: function () {
                 table.draw();
             },
             reset: function () {
                 vm.queryData = getQueryData();
                 $('.ui.dropdown').dropdown('restore default value');
             },
             showAddWin: function () {
                 vm.userData = getUserData();
                 vm.userData.title = '新增用户';
                 vm.isEdit = false;

                 // 组件初始化
                 setTimeout(function () {
                     $('.ui.dropdown').dropdown();
                 }, 200);

                 var addModal = $('#userModal').modal('setting', {
                     closable: false,
                     onApprove: function() {
                         // 验证表单
                         if (!vm.userData.name) {
                             cMethod.showPopupMessage('error', '请填写员工姓名');
                             return false;
                         } else if (!vm.userData.phone) {
                             cMethod.showPopupMessage('error', '请填写手机号码');
                             return false;
                         } else if (!vm.userData.roleId || vm.userData.roleId == '0') {
                             cMethod.showPopupMessage('error', '请填写角色');
                             return false;
                         } else if (!vm.userData.post) {
                             cMethod.showPopupMessage('error', '请填写职务');
                             return false;
                         } else if (!vm.userData.gender) {
                             cMethod.showPopupMessage('error', '请填写性别');
                             return false;
                         } else if (!cMethod.validatePhone(vm.userData.phone)) {
                             cMethod.showPopupMessage('warning', '手机号码格式不正确哦');
                             return false;
                         };

                         var failed = false;
                         var formData = new FormData($('#formData')[0]);
                         $.ajax({
                             url: window.currentApiUrl.basicData.sEstateUserAdd,
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
             showEditWin: function (rowData) {
                 vm.userData = rowData;
                 vm.userData.title = '修改用户信息';
                 vm.isEdit = true;

                 // 组件初始化
                 setTimeout(function () {
                     $('.ui.dropdown').dropdown();
                 }, 200);

                 var addModal = $('#userModal').modal('setting', {
                     closable: false,
                     onApprove: function() {
                         // 验证表单
                         if (!vm.userData.name) {
                             cMethod.showPopupMessage('error', '请填写员工姓名');
                             return false;
                         } else if (!vm.userData.phone) {
                             cMethod.showPopupMessage('error', '请填写手机号码');
                             return false;
                         } else if (!vm.userData.roleId || vm.userData.roleId == '0') {
                             cMethod.showPopupMessage('error', '请填写角色');
                             return false;
                         } else if (!vm.userData.post) {
                             cMethod.showPopupMessage('error', '请填写职务');
                             return false;
                         } else if (!vm.userData.gender) {
                             cMethod.showPopupMessage('error', '请填写性别');
                             return false;
                         } else if (!vm.userData.birthday) {
                             cMethod.showPopupMessage('error', '请填写生日');
                             return false;
                         } else if (!cMethod.validatePhone(vm.userData.phone)) {
                             cMethod.showPopupMessage('warning', '手机号码格式不正确哦');
                             return false;
                         };

                         var failed = false;
                         var formData = new FormData($('#formData')[0]);
                         $.ajax({
                             url: window.currentApiUrl.basicData.sEstateUserAdd,
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
             showDeleteWin: function (id) {
                 var deleteModal = $('#confirm').modal('setting', {
                     closable: true,
                     onApprove: function() {
                         var success = true;
                         $.ajax({
                             url: window.currentApiUrl.basicData.sEstateUserDelete,
                             type: 'GET',
                             data: 'id=' + id,
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
             showDetailWin: function (rowData) {
                 vm.userData = rowData;
                 var detailModal = $('#modalDetail').modal('setting', {
                     closable: true,
                     onApprove: function() {
                     }
                 }).modal('show');
             },
             enable: function (id) {
                 $.ajax({
                     url: window.currentApiUrl.basicData.sEstateUserEnable,
                     type: 'GET',
                     data: 'id=' + id,
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
             disable: function (id) {
                 $.ajax({
                     url: window.currentApiUrl.basicData.sEstateUserDisable,
                     type: 'GET',
                     data: 'id=' + id,
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
             }
         }),
         baseTableOpts = {
             isShowIndexNumber: true,
             columns: [
                 {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                 {field: 'name', title: '用户姓名', isShow: true, isSort: false},
                 {field: 'phone', title: '手机号码', isShow: true, isSort: false},
                 {field: 'parkNames', title: '所属园区', isShow: true, isSort: false},
                 {field: 'roleNames', title: '角色', isShow: true, isSort: false},
                 {field: 'post', title: '职务', isShow: true, isSort: false},
                 {field: 'gender', title: '性别', isShow: true, isSort: false, render: function (val) {
                     return val == '' ? '' : cMethod.getItemByAttrFromItems({key: 'value', value: val}, vm.commonData.roleCommonData.sex)['name']
                 }},
                 {field: 'createTime', title: '新增时间', isShow: true, isSort: false},
                 {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
                 {field: 'isEnabled', title: '启用状态', isShow: true, isSort: false,render: function (val) {
                     return cMethod.getItemByAttrFromItems({key: 'value', value: val}, vm.commonData.roleCommonData.useStatus)['name']
                 }},
                 {
                     field: 'isEnabled', title: '操作', isShow: true, width: '160px', isSort: false,
                     render: function (val) {
                         var status = val === 'YES' ?
                             '<i class="icon switch unlock" title="禁用"></i>'
                             : '<i class="icon switch lock orange" title="启用"></i>';
                         return '<div class="tr-operation">' +
                             '<i class="icon info circle teal" title="详情"></i>' + status +
                             '<i class="icon edit green" title="修改"></i>' +
                             '<i class="icon remove red" title="删除"></i>' +
                             '</div>';
                     }
                 }
             ],
             ajax: {
                 url: window.currentApiUrl.basicData.sEstateUserList,
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
                     if (target.hasClass('switch lock')) {
                         vm.enable(rowData.id);
                     } else if (target.hasClass('switch unlock')) {
                         vm.disable(rowData.id);
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
             getRoleList();
         }
         // 视图渲染后，意思是avalon.scan完成
         $ctrl.$onRendered = function () {
             cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
             setTimeout(function () {
                 $('.ui.dropdown').dropdown();
             },200);

             table = cDataTable.initBaseTable(baseTableOpts);
         }
         // 对应的视图销毁前
         $ctrl.$onBeforeUnload = function () {}
         // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
         $ctrl.$vmodels = [];
     });
 });
/*
define([
    'component-message',
    'jqueryAjax',
    'component-ztree',
    'component-datatable',
    'component-datetimerpicker',
    'appPath/common/commonMethods',
    'jquery.semantic'
], function (cMessage, jqueryAjax, cZtree,cDataTable,cDateTimerPicker,cMthods) {
    var myTable,deptTreeData=[],
        commonData = cMthods.getRoleData().roleCommonData,
        sexData = commonData.sex,
        useStatusData = commonData.useStatus,
        roleListData = commonData.roleList,
        defaultFromData = function () {
            return {
                id: '',
                parkName:'',
                phone:'',
                parkId:'',
                parkName:'',
                roleName:'',
                post:'',
                gender:'MALE',
                useStatus:'',
                birth:'',
                roleIds:'',
            }
        },
        defaultSearchData = function () {
            return {
                userName:'',
                phone:'',
                parkName:'',
                post:'',
                gender:'0',
                useStatus:'0',
                startDate:'',
                endDate:''
            }
        },
        vm = avalon.define({
            $id: 'parkUser',
            inputParkName:'',
            queryParkList:[],
            useStatusList:useStatusData,
            sexList:sexData,
            roleList:roleListData,
            parkUser:defaultFromData(),
            searchFormData:defaultSearchData(),
            search:function () {
                myTable.draw();
            },
            reset:function () {
                vm.searchFormData = defaultSearchData();
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },200);
            },
            showAddWin: function (isEdit,data) {
                var url = window.currentApiUrl.user.parkUserEdit;
                cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
                if (!isEdit) {
                    vm.parkUser = defaultFromData();
                    url = window.currentApiUrl.user.parkUserAdd;
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        $('.ui.dropdown.link-change').dropdown('clear');
                    },200);
                }else{
                    vm.parkUser = data;
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        $('#parkNameSelect').dropdown('set text', vm.parkUser.parkName);
                        try {
                            $('.ui.dropdown.link-change').dropdown('clear').dropdown('set selected',vm.parkUser.roleIds!=''?vm.parkUser.roleIds.split(','):'');
                        } catch (e) {};

                    },200);
                }
                //获取树形控件选中的值
                var myModal = $('#parkUserAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        console.log(vm.parkUser.userName);
                        var msg = '',
                            phoneReg = /^1[0-9]{10}$/,
                            roleIdsArray = $('#roleIdsSelect').val();
                        if (vm.parkUser.userName == '') {
                            msg = '员工姓名不能为空';
                        } else if (vm.parkUser.parkId == '') {
                            msg = '请选择所属园区';
                        } else if (vm.parkUser.phone == '') {
                            msg = '手机号码不能为空';
                        } else if(!phoneReg.test(vm.parkUser.phone)){
                            msg = '手机号不合法';
                        } else if (vm.parkUser.post=='') {
                            msg = '职务不能为空';
                        } else if (roleIdsArray==null||roleIdsArray=='') {
                            msg = '不能为空';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        vm.parkUser.roleIds = roleIdsArray==null?'':roleIdsArray.join(',');
                        jqueryAjax.post(
                            url,
                            vm.parkUser,
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
                vm.showAddWin(true,data);
            },
            /!**
             * 模糊查询园区
             *!/
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
            /!**
             * 点击选择项设置园区id
             * @param e
             *!/
            setParkId: function (e) {
                vm.parkUser.parkId = $(this).data('parkid');
            },
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.user.parkUserDel,
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
                            window.currentApiUrl.user.disenableParkUser,
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
                            window.currentApiUrl.user.enableParkUser,
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
                            window.currentApiUrl.user.resetParkUserPassword,
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
                {field: 'parkName', title: '所属园区', isShow: true, isSort: false},
                {field: 'post', title: '职务', isShow: true, isSort: false},
                {field: 'gender', title: '性别', isShow: true, isSort: false, render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, sexData)['name'];
                }},
                {field: 'createTime', title: '创建时间', isShow: true, isSort: false},
                {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
                {field: 'useStatus', title: '启用状态', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, useStatusData)['name'];
                }},
                {
                    field: null, title: '操作', isShow: true, isSort: false,
                    render: function (data) {
                        var isEnableHtml = data.useStatus == 'YES' ? '<i class="icon unlock black" title="禁用"></i>' :'<i class="icon lock orange" title="启用"></i>';
                        return '<div class="tr-operation">' +
                            '<i class="icon recycle purple" title="重置密码"></i>' +
                            isEnableHtml+
                            '<i class="icon edit green"></i>' +
                            '<i class="icon remove red"></i>' +
                            '</div>';
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.user.parkUserList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.userName= vm.searchFormData.userName;
                    data.parkName= vm.searchFormData.parkName;
                    data.startDate= vm.searchFormData.startDate;
                    data.endDate= vm.searchFormData.endDate;
                    data.post= vm.searchFormData.post;
                    data.phone= vm.searchFormData.phone;
                    data.useStatus= vm.searchFormData.useStatus;
                    data.gender= vm.searchFormData.gender;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon recycle')) {
                        vm.resetPassword(rowData.id);
                    }else if (target.hasClass('icon edit')) {
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
});*/