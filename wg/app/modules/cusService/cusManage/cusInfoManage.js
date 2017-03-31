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
		function deepCopy(o) {
			if(o instanceof Array) {
				var n = [];
				for(var i = 0; i < o.length; ++i) {
					n[i] = deepCopy(o[i]);
				}
				return n;
			} else if(o instanceof Object) {
				var n = {}
				for(var i in o) {
					n[i] = deepCopy(o[i]);
				}
				return n;
			} else {
				return o;
			}
		}
    var myTable,deptTreeData=[],levelTreeData=[],levelTreeDataCopy=[],industryTreeData=[],industryTreeDataCopy=[],
        commonData = cMthods.getRoleData().roleCommonData,
        cityListData = commonData.cityList,
        //industryTreeData = commonData.industryTree,
        //industryTreeDataCopy =deepCopy(industryTreeData),
        sexData = commonData.sex,
        useStatusData = commonData.useStatus,
        isJobData = commonData.isJob,
        jobPositionData = commonData.jobPosition,
        accountTypeData = commonData.accountType,
        deptTreeData = commonData.deptTree,
        roleNameData = commonData.roleNameList,
        //levelTreeData = commonData.levelTree,
        //levelTreeDataCopy =deepCopy(levelTreeData),
        companyTypeData = commonData.companyType,
        companySizeData = commonData.companySize,
        getInitialStatus = function () {
            return 'industry';
        },
        defaultData = function () {
            return {
                id: '',
                departmentId:'',
                companyName: '',
                levelTree: '0',
                industry: '0',
                companySize: '0',
                companyType: '0',
                contactPerson: '',
                gender: 'MALE',
                phone: '',
                inputParkName: '',
                houseFloor: '',
                roomNumber: '',
                contractTimeStart: '',
                contractTimeEnd: '',
                rent: '',
                rentUnit:'元/㎡/月',
                settledTime: ''
            }
        },
        defaultSearchData = function () {
          return {
              deptId:'',
              companyName: '',
              settledTimeStart:'',
              settledTimeEnd:'',
              companyType:'0',
              companySize:'0',
              levelTree:'0'
           }
        },
        getSortList =  function(classType, className) {   // 获取行业/等级分类信息
            var sDdata = 'classType='+classType;
            if(className!=undefined) sDdata+='&className='+className;  //名称搜索条件
            $.ajax({
                url: window.currentApiUrl.cusSever.cusManage.cusClassType,
                type: 'GET',
                data: sDdata,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.status === 200) {  //1为等级分类，2为行业分类
                    	var res = data.data.results;
                    	if(classType=='1') return levelTreeData = res, levelTreeDataCopy= deepCopy(res), initDeptTree(levelTreeData);
                    	if(classType=='2') return industryTreeData = res, industryTreeDataCopy= deepCopy(res), initDeptTree(industryTreeData);
                    }
                }
            });
        },
        vm = avalon.define({
            $id: 'user',
            //下拉框查询
            curOpt: getInitialStatus(), // 当前标签,
            selectQuery:'1',
            // 切换标签
            switchStatus: function () {
                if(vm.selectQuery=='1'){
                    vm.curOpt= 'industry';
                    myTable.draw();
                    initDeptTree(industryTreeData);
                }else{
                    vm.curOpt= 'levelTree';
                    myTable.draw();
                    if(levelTreeData.length>0){
                    	initDeptTree(levelTreeData);
                    }else{
                    	getSortList('1');  
                    }
                    //initDeptTree(levelTreeData);
                    //initLevelTree(levelTreeData);
                }
            },
            //搜索
            searchData: defaultSearchData(),
            companyTypeList: companyTypeData,
            companySizeList: companySizeData,
            levelTreeList: levelTreeDataCopy,
            queryParkList:[],
            industryTreeList: industryTreeDataCopy,
            sexList:sexData,
            houseFloorList:[],
            user:defaultData(),
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
             * 模糊查询园区
             */
            queryParkByName: function () {
                if (vm.user.inputParkName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.cusSever.cusManage.queryParkByName,
                        {
                            parkName:vm.user.inputParkName
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
                vm.user.parkId = $(this).data('parkid');
            },
            showAddWin: function (isEdit,data) {
                var url = window.currentApiUrl.cusSever.cusManage.cusInfoEdit;
                cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
                //.initSelectMenuTree('#user_deptZtree', deptTreeData,{
                //    idKey: 'id',
                //   pIdKey: 'pId',
                //    rootPId: 0
                //});
                //cZtree.initSelectZtree('#user_ztreeCity', cMthods.getUpAreaDataListByLevel(6, cityListData), true, cMthods.getAreaTreeRootKey());
                if (!isEdit) {
                    vm.user = defaultData();
                    url = window.currentApiUrl.cusSever.cusManage.cusInfoAdd;
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        $('.ui.dropdown.link-change').dropdown('clear');
                        //cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.deptId+'');
                    },200);
                }else{
                    vm.user = data;
                    setTimeout(function () {
                        //console.log(vm.user.roleIds)
                        $('.ui.dropdown').dropdown();
                        $('#parkNameSelect').dropdown('set text', vm.user.inputParkName);
                        //$('.ui.dropdown.link-change').dropdown('clear').dropdown('set selected',vm.user.roleIds!=''?vm.user.roleIds.split(','):'');
                        //cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.user.departmentId+'');
                        //cZtree.selectTreeNodeByAttributeValues('user_ztreeCity', 'areaCode', vm.user.area);
                    },200);
                }
                //获取树形控件选中的值
                var myModal = $('#userAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '',
                            //idCards = JSON.parse(JSON.stringify(vm.user.identityNumber)),
                            //idCardsReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
                            phone = JSON.parse(JSON.stringify(vm.user.phone)),
                            phoneReg = /^1[0-9]{10}$/;
                            //roleIdsArray = $('#roleIdsSelect').val();
                        //vm.user.departmentId = cZtree.getMenuTreeCheckedAttrValues('user_deptZtree', 'id');
                        //vm.user.area = cZtree.getTreeCheckedAttrValues('user_ztreeCity', 'areaCode');
                        if (vm.user.companyName == '') {
                            msg = '请输入公司名称';
                        } else if (vm.user.phone == '') {
                            msg = '手机号码不能为空';
                        } else if(!phoneReg.test(phone)){
                            msg = '手机号不合法';
                        } else if (vm.user.levelTree == '0' || vm.user.levelTree == '' ) {
                            msg = '请选择客户级别';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        //vm.user.upAreaCode = (cMthods.getAreaCodeByName(vm.user.areaUpName, cityListData));
                        //vm.user.roleIds = roleIdsArray==null?'':roleIdsArray.join(',');
                        jqueryAjax.post(
                            url,
                            vm.user,
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
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.cusSever.cusManage.cusInfoDel,
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
            searchDeptTree:function (e) {
                var searchResultTree = [],
                    currentValue = e.target.value;
                if(vm.curOpt==='industry'&&industryTreeData && industryTreeData.length>0){
                    for(var i=0;i<industryTreeData.length;i++){
                        if(industryTreeData[i].name.indexOf(currentValue)>=0){
                            searchResultTree.push(industryTreeData[i]);
                        }
                    }
                }
                if(vm.curOpt==='levelTree'&&levelTreeData && levelTreeData.length>0){
                    for(var i=0;i<levelTreeData.length;i++){
                        if(levelTreeData[i].name.indexOf(currentValue)>=0){
                            searchResultTree.push(levelTreeData[i]);
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
                            window.currentApiUrl.cusSever.cusManage.resetUserPassword,
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
            cZtree.initEditTree('#deptZtree',data,null,null,
                function (event,treeId,treeNode) {
                    vm.searchData.deptId = treeNode.id;
                    vm.search();
                },function (treeId, treeNode) {
                    var treeNode = treeNode,
                        aObj = $('#' + treeNode.tId + '_span'),
                        editStr = '<span class="" id="diyBtn_add_' +treeNode.id+ '" style="margin:0 0 0 10px;">'+treeNode.companyCount+'</span>';
                    if($('#diyBtn_add_'+treeNode.id).length>0){
                        return
                    }
                    aObj.data('treedata',treeNode);
                    aObj.append(editStr);
            });
        },
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'companyNumber', title: '客户编号', isShow: true, isSort: false},
                {field: 'companyName', title: '客户名称', isShow: true, isSort: false},
                {field: 'companyType', title: '性质', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, companyTypeData)['name'];
                }},
								{field: 'companySize', title: '规模', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, companySizeData)['name'];
                }},
                {field: 'leasingSite', title: '租赁场地', isShow: true, isSort: false},
                {field: 'settledTime', title: '入驻时间', isShow: true, isSort: false},
                {field: 'contactPerson', title: '联系人', isShow: true, isSort: false},
                {field: 'phone', title: '联系人手机', isShow: true, isSort: false},
                {field: 'levelTree', title: '级别', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'id', value: data}, levelTreeData)['name'];
                }},
                {
                    field: null, title: '操作', isShow: true, isSort: false,
                    render: function () {
                        return '<div class="tr-operation">' +
                            '<i class="icon unhide" title="查看"></i>' +
                            '<i class="icon edit green" title="修改"></i>' +
                            '<i class="icon remove red" title="删除"></i>' +
                            '</div>';
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.cusSever.cusManage.cusInfoManageList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.deptId= vm.searchData.deptId;
                    data.settledTimeStart= vm.searchData.settledTimeStart;
                    data.settledTimeEnd= vm.searchData.settledTimeEnd;
                    data.companyType= vm.searchData.companyType;
                    data.companySize= vm.searchData.companySize;
                    data.levelTree= vm.searchData.levelTree;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon unhide')) {
                      avalon.router.go('app.cusService.cusInfoView',{memberId:rowData.id});
                        //vm.showEditWin(rowData);
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
        	getSortList('2');  //获取行业分类信息 
            $('.ui.dropdown').dropdown();
			cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd hh:ii:ss');
            myTable = cDataTable.initBaseTable(baseTableOpts);
			//initDeptTree(industryTreeData);
            //initLevelTree(levelTreeData);  //industryTreeData
            
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
