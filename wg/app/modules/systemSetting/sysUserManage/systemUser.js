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
        defaultFromData = function () {
            return {
                id: '',
                username: '',
                employee_name:'',
                gender:'MALE',
                phone:'',
                identityNumber:'',
                email:'',
                post:'',
                birthday:'',
                //role_names:'',
                useStatus:'-1',
                role_ids:'',
                area: '',
                areaName: '',
            }
        },
        defaultSearchData = function () {
            return {
                username:'',
                phone:'',
                employee_name:'',
                workNumber:'',
                useStatus:'-1',
                startDate:'',
                endDate:'',
                createTimeStart:'',
                createTimeEnd:''
            }
        },
        defaultViewData = function () {
            return {
                id: '',
                username: '',
                gender:'MALE',
                phone:'',
                employee_name:'',
                identityNumber:'',
                email:'',
                post:'',
                birthday:'',
                //role_names:'',
                useStatus:'-1',
                role_ids:'',
                area: '',
                areaName: '',
            }
        },
        getRoleList = function () {
            $.ajax({
                url: window.currentApiUrl.systemSet.sysUser.sRoleList,
                type: 'GET',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    vm.roleList = data.data.roleList;
                }
            });
        },
        getEmployeeNameList = function () {
            $.ajax({
                url: window.currentApiUrl.systemSet.sysUser.getEmployeeNameList,
                type: 'GET',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    vm.employeeNameList = data.data.roleList;
                }
            });
        };
    vm = avalon.define({
        $id: 'parkUser',
        searchData:defaultSearchData(),
        inputParkName:'',
        queryParkList:[],
        useStatusList:useStatusData,
        sexList:sexData,
        roleList:null,
        parkUser:defaultFromData(),
        searchFormData:defaultSearchData(),
        viewData: defaultViewData(),
        search:function () {
            myTable.draw();
        },
        reset:function () {
            vm.searchData = defaultSearchData();
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            },200);
        },
        /**
         * 模糊关联员工姓名
         */
        queryEmployeeName: function () {
            if (vm.parkUser.employee_name !== '') {
                jqueryAjax.get(
                    window.currentApiUrl.systemSet.sysUser.getEmployeeNameList,
                    {
                    	employeeName:vm.parkUser.employee_name
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
        /**
         * 点击选择项设置员工姓名id
         * @param e
         */
        setEmployeeId: function (e) {
        	vm.parkUser.employee_name = $(this).data('parkname');  //注意data()数据需要小写
        	vm.parkUser.employeeId = $(this).data('parkid');
        },
        showAddWin: function (isEdit,data) {
            var url = window.currentApiUrl.systemSet.sysUser.userEdit;
            cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
            cZtree.selectTreeNodeByAttributeValues('user_ztreeCity', 'areaCode', '');
            if (!isEdit) {
                vm.parkUser = defaultFromData();
                url = window.currentApiUrl.systemSet.sysUser.userAdd;
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                    $('.ui.dropdown.link-change').dropdown('clear');
                    $('#parkNameSelect').dropdown('set text', '');
                },200);
            }else{
                vm.parkUser = data;
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                    $('#parkNameSelect').dropdown('set text', vm.parkUser.employee_name);
                    try {
                        $('.ui.dropdown.link-change').dropdown('clear').dropdown('set selected',vm.parkUser.role_ids!=''?vm.parkUser.role_ids.split(','):'');
                    } catch (e) {};
                    cZtree.selectTreeNodeByAttributeValues('user_ztreeCity', 'areaCode', vm.parkUser.areaCode);
                },200);
            }
            //获取树形控件选中的值
            var myModal = $('#parkUserAddWin').modal({
                closable: false,
                onApprove: function () {
                    var msg = '',
                        phoneReg = /^1[0-9]{10}$/,
                        role_idsArray = $('#role_idsSelect').val();
                        role_NamesArray= [],
                        $aUiLabel = $('a.ui.label');
                    for(var i=0,len=$aUiLabel.length; i<len; i++) {
                    	role_NamesArray.push($($aUiLabel[i]).text())
                    }   
                    vm.parkUser.areaCode = cZtree.getTreeCheckedAttrValues('user_ztreeCity', 'areaCode');
                    if (vm.parkUser.userName == '') {
                        msg = '员工姓名不能为空';
                    } else if (vm.parkUser.parkId == '') {
                        msg = '请选择所属园区';
                    } else if (vm.parkUser.phone == '') {
                        msg = '手机号码不能为空';
                    } else if(!phoneReg.test(vm.parkUser.phone)){
                        msg = '手机号不合法';
                    } else if (vm.parkUser.areaCode != '' && vm.parkUser.areaCode.split(',').length>6) {
                        msg = '负责区域最多只能选择6个';
                    } else if (role_idsArray==null||role_idsArray=='') {
                        msg = '所属角色不能为空';
                    } else {
                        msg = '';
                    }
                    if (msg != '') {
                        cMessage.showPopup({className: 'warning', content: msg});
                        return false;
                    }
                    //vm.parkUser.upAreaCode = (cMthods.getAreaCodeByName(vm.parkUser.areaUpName, cityListData));
                    vm.parkUser.role_ids = role_idsArray==null?'':role_idsArray.join(',');
                    vm.parkUser.role_names= role_NamesArray==[]?'':role_NamesArray.join(',');
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
        showViewWin: function (data) {
            //获取树形控件选中的值
            vm.viewData= data;
            $('#parkUserShowWin').modal({
                closable: false
            }).modal('show');
        },
        showEditWin: function (data) {
            vm.showAddWin(true,data);
        },
        /**
         * 模糊查询园区
         */
        queryParkByName: function () {
            if (vm.inputParkName !== '') {
                jqueryAjax.get(
                    window.currentApiUrl.systemSet.sysUser.queryParkByName,
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
        /**
         * 点击选择项设置园区id
         * @param e
         */
        setParkId: function (e) {
            vm.parkUser.parkId = $(this).data('parkid');
        },
        showDeleteWin: function (id) {
            cMessage.showAlert({
                content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                onOk: function () {
                    jqueryAjax.post(
                        window.currentApiUrl.systemSet.sysUser.userDel,
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
                        window.currentApiUrl.systemSet.sysUser.disenableUser,
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
                        window.currentApiUrl.systemSet.sysUser.enableUser,
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
                        window.currentApiUrl.systemSet.sysUser.resetUserPassword,
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
            {field: 'username', title: '系统用户账号', isShow: true, isSort: false},
            {field: 'phone', title: '手机号码', isShow: true, isSort: false},
            {field: 'employee_name', title: '关联员工姓名', isShow: true, isSort: false},
            {field: 'workNumber', title: '员工编号', isShow: true, isSort: false},
            {field: 'park_names', title: '服务区域', isShow: true, isSort: false},
            {field: 'role_names', title: '所属角色', isShow: true, isSort: false},
            {field: 'createTime', title: '注册时间', isShow: true, isSort: false},
            {field: 'updateTime', title: '最后更新时间', isShow: true, isSort: false},
            {field: 'useStatus', title: '启用状态', isShow: true, isSort: false,render: function (data) {
                return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, useStatusData)['name'];
            }},
            {
            field: null, title: '操作', isShow: true, isSort: false,
            render: function (data) {
                var isEnableHtml = data.useStatus == '1' ? '<i class="icon unlock black" title="禁用"></i>' :'<i class="icon lock orange" title="启用"></i>';
                return '<div class="tr-operation">' +
                    '<i class="icon unhide" title="查看"></i>' +
                    '<i class="icon edit green" title="修改"></i>' +
                    isEnableHtml+
                    '<i class="icon recycle purple" title="重置密码"></i>' +
                    '<i class="icon remove red"></i>' +
                    '</div>';
                }
            }
        ],
        ajax: {
            url: window.currentApiUrl.systemSet.sysUser.userManageList,
            type: 'GET',
            data: function (data) {
                data.pageNo = data.start / data.length + 1;
                data.pageSize = data.length;
                data.createTimeStart= vm.searchData.createTimeStart;
                data.createTimeEnd= vm.searchData.createTimeEnd;
                data.startDate= vm.searchData.startDate;
                data.endDate= vm.searchData.endDate;
                data.phone= vm.searchData.phone;
                data.useStatus= vm.searchData.useStatus;
                data.employee_name= vm.searchData.employee_name;
                data.workNumber= vm.searchData.workNumber;
                data.username= vm.searchData.username;
            }
        },
        operationCallback: function (e, rowData) {
            if (rowData) {
                var target = $(e.target);
                if (target.hasClass('icon recycle')) {
                    vm.resetPassword(rowData.id);
                } else if (target.hasClass('icon unhide')) {
                    vm.showViewWin(rowData);
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
    },
    avalon.filters.myfilter = function(str, args){//str为管道符之前计算得到的结果，默认框架会帮你传入，此方法必须返回一个值
        return cMthods.myFilter(str, args);
    },
    getAreaNameArryByCode= function (data) {
        var res='',
            resArry=data.split(',');
        if(resArry.length>1){
            for(var i=0,len=resArry.length; i<len; i++){
                if(i==len-1){
                    res+= cMthods.getAreaNameByCode(resArry[i],cityListData)
                }else{
                    res+= cMthods.getAreaNameByCode(resArry[i],cityListData)+','
                }
            }
        }else{
            res=cMthods.getAreaNameByCode(data,cityListData)
        }
        return res;
    };
    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
            getRoleList();
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
            myTable = cDataTable.initBaseTable(baseTableOpts);
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            },200);
            cZtree.initSelectZtree('#user_ztreeCity', cityListData, true, cMthods.getAreaTreeRootKey());
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
