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
], function (cMessage, jqueryAjax, cZtree,cDataTable,cDateTimerPicker,cMthods) {
    var myTable,deptTreeData=[],
        commonData = cMthods.getRoleData().roleCommonData,
        cityListData = commonData.cityList,
        sexData = commonData.sex,
        useStatusData = commonData.useStatus,
        isJobData = commonData.isJob,
        jobPositionData = commonData.jobPosition,
        accountTypeData = commonData.accountType,
        deptTreeData = commonData.deptTree,
        roleNameData = commonData.roleNameList,
        defaultData = function () {
            return {
                id: '',
                departmentId:'',
                realName:'',
                accountName:'',
                isJob:'1',
                useStatus:'USEING',
                identityNumber: '',
                phone: '',
                gender:'MALE',
                email: '',
                birthday:'',
                position:'0',
                workNumber:'',
                accountType:'ACCOUNT',
                roleIds:''
            }
        },
        vm = avalon.define({
            $id: 'user',
            //搜索
            deptId:'',
            realName:'',
            phone:'',
            isJob:'0',
            useStatus:'0',
            deptList:[],
            useStatusList:useStatusData,
            isJobList:isJobData,
            sexList:sexData,
            jobPositionList:jobPositionData,
            accountTypeList:accountTypeData,
            roleNameList:roleNameData,
            user:defaultData(),
            search:function () {
                myTable.fnDraw();
            },
            showAddWin: function (isEdit,data) {
                var url = window.currentApiUrl.user.userEdit;
                cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
                cZtree.initSelectMenuTree('#user_deptZtree', deptTreeData,{
                    idKey: 'id',
                    pIdKey: 'pId',
                    rootPId: 0
                });
                cZtree.initSelectZtree('#user_ztreeCity', cMthods.getUpAreaDataListByLevel(6, cityListData), true, cMthods.getAreaTreeRootKey());
                if (!isEdit) {
                    vm.user = defaultData();
                    url = window.currentApiUrl.user.userAdd;
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        $('.ui.dropdown.link-change').dropdown('clear');
                        cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.deptId+'');
                    },200);
                }else{
                    vm.user = data;
                    setTimeout(function () {
                        console.log(vm.user.roleIds)
                        $('.ui.dropdown').dropdown();
                        $('.ui.dropdown.link-change').dropdown('clear').dropdown('set selected',vm.user.roleIds!=''?vm.user.roleIds.split(','):'');
                        cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.user.departmentId+'');
                        cZtree.selectTreeNodeByAttributeValues('user_ztreeCity', 'areaCode', vm.user.area);
                    },200);
                }
                //获取树形控件选中的值
                var myModal = $('#userAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '',
                            idCards = JSON.parse(JSON.stringify(vm.user.identityNumber)),
                            idCardsReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
                            phone = JSON.parse(JSON.stringify(vm.user.phone)),
                            phoneReg = /^1[0-9]{10}$/,
                            roleIdsArray = $('#roleIdsSelect').val();
                        vm.user.departmentId = cZtree.getMenuTreeCheckedAttrValues('user_deptZtree', 'id');
                        vm.user.area = cZtree.getTreeCheckedAttrValues('user_ztreeCity', 'areaCode');
                        if (vm.user.departmentId == '') {
                            msg = '请选择所属部门';
                        } else if (vm.user.realName == '') {
                            msg = '真实姓名不能为空';
                        } else if (vm.user.accountName == '') {
                            msg = '用户名不能为空';
                        } else if (vm.user.workNumber == '') {
                            msg = '员工编号不能为空';
                        } else if (vm.user.area != '' && vm.user.area.split(',').length>3) {
                            msg = '负责区域最多只能选择3个';
                        } else if (vm.user.phone == '') {
                            msg = '手机号码不能为空';
                        } else if(!phoneReg.test(phone)){
                        	msg = '手机号不合法';
                        } else if (vm.user.position == '0' || vm.user.position == '' ) {
                            msg = '请选择职位';
                        } else if (vm.user.identityNumber == '') {
                            msg = '身份号码不能为空';
                        } else if (!idCardsReg.test(idCards)) {
                            msg = '身份号码不合法';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        vm.user.upAreaCode = (cMthods.getAreaCodeByName(vm.user.areaUpName, cityListData));
                        vm.user.roleIds = roleIdsArray==null?'':roleIdsArray.join(',');
                        jqueryAjax.post(
                            url,
                            vm.user,
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
                    }
                }).modal('show');
            },
            showEditWin: function (data) {
                vm.showAddWin(true,data);
            },
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.user.userDel,
                            {id: id},
                            function (response, msgType, isOk) {
                                myTable.fnDraw();
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
            searchDeptTree:function (e) {
                var searchResultTree = [],
                    currentValue = e.target.value;
                if(deptTreeData && deptTreeData.length>0){
                    for(var i=0;i<deptTreeData.length;i++){
                        if(deptTreeData[i].name.indexOf(currentValue)>=0){
                            searchResultTree.push(deptTreeData[i]);
                        }
                    }
                }
                initDeptTree(searchResultTree);
            },
            resetPassword: function (id) {
                cMessage.showAlert({
                    content: '您确认要重置密码吗？',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.user.resetUserPassword,
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
            },
        }),
        initDeptTree = function (data) {
            cZtree.initEditTree('#deptZtree',data,null,null,function (event,treeId,treeNode) {
                vm.deptId = treeNode.id;
                vm.search();
            });
        },
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'realName', title: '员工姓名', isShow: true, isSort: false},
                {field: 'accountName', title: '用户名', isShow: true, isSort: false},
                {field: 'workNumber', title: '员工编号', isShow: true, isSort: false},
                {field: 'phone', title: '手机号码', isShow: true, isSort: false},
                {field: 'departmentId', title: '所属部门', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'id', value: data}, deptTreeData)['name'];
                }},
                {field: 'accountType', title: '账号类型', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, accountTypeData)['name'];
                }},
                {field: 'gender', title: '性别', isShow: true, isSort: false, render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, sexData)['name'];
                }},
                {field: 'isJob', title: '在职状态', isShow: true, isSort: false, render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, isJobData)['name'];
                }},
                {field: 'useStatus', title: '状态', isShow: false, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, useStatusData)['name'];
                }},
                {
                    field: null, title: '操作', isShow: true, isSort: false,
                    render: function () {
                        return '<div class="tr-operation">' +
                            '<i class="icon recycle purple" title="重置密码"></i>' +
                            '<i class="icon edit green"></i>' +
                            '<i class="icon remove red"></i>' +
                            '</div>';
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.systemSet.basic.userManageList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.deptId= vm.deptId;
                    data.realName= vm.realName;
                    data.phone= vm.phone;
                    data.useStatus= vm.useStatus;
                    data.isJob= vm.isJob;
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
            initDeptTree(deptTreeData);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
