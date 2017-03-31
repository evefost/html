/**
 * 角色管理
 */
define([
    'component-message',
    'component-datatable',
    'component-ztree',
    'jqueryAjax',
    'appPath/common/commonMethods',
    'jquery.semantic'
], function (cMessage, cDataTable,cZtree, jqueryAjax, cMthods) {
    var myTable,
        commonData = cMthods.getRoleData().roleCommonData,
        useStatusData = commonData.useStatus,
        roleTypeData = commonData.roleType,
        defaultData = function () {
            return {
                id: '',
                name: '',
                description: '',
                type:'INNER'
            }
        },
        defaultSearchData = function () {
            return {
                name: '',
                isPersist:'0',
                type:'0',
                useStatus: '0'
            }
        },
        vm = avalon.define({
            $id: 'role',
            roleName: '',
            useStatus:'0',
            roleTypeList:roleTypeData,
            useStatusList:useStatusData,
            role : defaultData(),
            searchFormData : defaultSearchData(),
            showAddWin: function (isEdit,data) {
                var url = window.currentApiUrl.role.roleEdit;
                if (!isEdit) {
                    url = window.currentApiUrl.role.roleAdd;
                    vm.role = defaultData();
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                    },200);
                }else{
                    vm.role = data;
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                    },200);
                }
                var myModal = $('#roleAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        if (vm.role.name == '') {
                            cMessage.showPopup({className: 'warning', content: '角色名称不能为空'});
                            return false;
                        }
                        jqueryAjax.post(
                            url,
                            vm.role,
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
            showDisenableWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要禁用当前角色？！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.role.disEnableRole,
                            {roleId: id},
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
                    content: '您确认要启用当前角色?',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.role.enableRole,
                            {roleId: id},
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
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.role.roleDel,
                            {roleId: id},
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
            search: function () {
                myTable.draw();
            },
            reset:function () {
                vm.searchFormData = defaultSearchData();
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },200);
            }
        }),
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'name', title: '角色名称', isShow: true, isSort: false},
                {field: 'type', title: '角色分类', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, roleTypeData)['name'];
                }},
                {field: 'isPersist', title: '内置角色', isShow: true, isSort: false,render: function (data) {
                    if(data){
                        if(data=='NO'){
                            return '非内置角色';
                        }else if(data=='YES'){
                            return '内置角色'
                        }
                    }
                }},
                {field: 'description', title: '角色描述', isShow: true, isSort: false},
                {field: 'createTime', title: '创建时间', isShow: true, isSort: false},
                {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
                {field: 'useStatus', title: '启用状态', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, useStatusData)['name'];
                }},
                {
                    field: null, title: '操作', isShow: true, isSort: false,width:200,
                    render: function (data) {
                        var isEnableHtml = data.useStatus == 'YES' ? '<i class="icon unlock black" title="禁用"></i>' :'<i class="icon lock orange" title="启用"></i>',
                            deleteHtml = '<i class="icon remove red"></i></div>',
                            editHtml = '<i class="icon edit green"></i>',
                            authHtml = '<i class="icon grid layout orange" title="分配权限"></i>',
                            operationHtml = '';

                        if(data.isPersist == 'YES' ){
                            operationHtml = editHtml+authHtml;
                        }else{
                            operationHtml = isEnableHtml + editHtml + authHtml + deleteHtml;
                        }
                        return '<div class="tr-operation">'+operationHtml+'</div>';
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.role.roleList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.name = vm.searchFormData.name;
                    data.useStatus = vm.searchFormData.useStatus;
                    data.type = vm.searchFormData.type;
                    data.isPersist = vm.searchFormData.isPersist;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        vm.showEditWin(rowData);
                    } else if (target.hasClass('icon grid layout')) {
                        avalon.router.go('app.authors.role.roleMenu',{roleId:rowData.id});
                    }else if (target.hasClass('icon users blue')) {
                        avalon.router.go('app.authors.role.roleUsers',{roleId:rowData.id});
                    } else if (target.hasClass('icon unlock')) {
                        vm.showDisenableWin(rowData.id);
                    } else if (target.hasClass('icon lock')) {
                        vm.showEnableWin(rowData.id);
                    }else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(rowData.id);
                    }
                }
            }
        };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {}
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            $('.ui.dropdown').dropdown();
            myTable = cDataTable.initBaseTable(baseTableOpts);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
