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
                workNumber:'',
                name:'',
                deptId:'',
                area: '',
                areaCode: '',
                //imgSrc: '',
                headImg: '',
                isJob:'1',
                gender:'MALE',
                post:'',
                phone: '',
                idType:'IDCARD',
                identityNumber:'',
                tel:'',
                email: '',
                wechatNo:'',
                birthday:'',
                entryDate:'',
                leaveDate:''
                //accountName:'',
                //useStatus:'USEING',
                //identityNumber: '',
                //accountType:'ACCOUNT',
                //roleIds:''
            }
        },
        defaultSearchData = function () {
                return {
                    isJob:'0',
                    phone: '',
                    name:''
                }
        },
        defaultFromData = function () {
            return {
                id: '',
                year: '',
                month: '',
                parkName: '',
                amount: '',
                uploadTime: '',
                uploadUserName: '',
                uploadUserPhone: ''
            }
        },
        defaultImgData = function () {
            return {
                id: 0,
                title: '',
                beginTime: '',
                endTime: '',
                imgUrl: '',
                //localImgUrl: '',
                position: '0',
                isLinkUrl: '1',
                isToWebsite: '1',
                isToUserApp: '0',
                isToBrokerApp: '0',
                isToWechat: '1',
                linkUrl: '',
                linkContent: '',
                putStatus: '0',
                sorted: '0'
            }
        },
        vm = avalon.define({
            $id: 'user',
            curOpt:'',
            searchData: defaultSearchData(),
            cardTypeList: [{name:'身份证',value:'IDCARD'},{name:'驾驶证',value:'DRIVER'}],
            navName:'', //导航名称
            //搜索
            deptId:'',
            //realName:'',
            //phone:'',
            //isJob:'0',
            //useStatus:'0',
            deptList:[],
            //useStatusList:useStatusData,
            isJobList:isJobData,
            sexList:sexData,
            //jobPositionList:jobPositionData,
            //accountTypeList:accountTypeData,
            //roleNameList:roleNameData,
            user:defaultData(),
            //数据导入
            imgSrc: '',
            billDetailId:'',
            years:['2016','2017','2018','2019'],
            months:['01','02','03','04','05','06','07','08','09','10','11','12'],
            bill: defaultFromData(),
            searchFormData: defaultSearchData(),
            //账单上传
            isShowDownloadBtn:false,
            isUploaded:false,
            inputParkName:'',
            date:'',
            parkId:'',
            parkName:'',
            queryParkList:[],
            firstUpload: true,
            //imgUrl:'',
            //adManagement: defaultImgData(),  //图片上传
            search:function () {
                myTable.draw();
            },
            reset: function () {
                vm.searchData=defaultSearchData();
                //vm.isJob = defaultSearchData()['isJob'];
                //vm.phone = defaultSearchData()['phone'];
                //vm.realName = defaultSearchData()['realName'];
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);
            },
            uploadImage: function () {
                var target = this, freader;
                if (target.files.length > 0) {
                    freader = new FileReader();
                    freader.readAsDataURL(target.files.item(0));
                    freader.onload = function (e) {
                        var imgBase64Code = e.target.result;
                        vm.user.headImg = imgBase64Code;
                    }
                }
            },
            showResourceImg: function () {
                window.open(vm.user.headImg);
            },
            delResourceImg: function () {
                vm.user.headImg = '';
            },
            importExcel:function(){},
            exportExcel:function(){
                cMessage.showAlert({
                    content: '<i class="spinner loading icon blue"></i> 数据下载中，请稍后!',
                    isShowBtns:false
                });
                setTimeout(function () {
                    cMessage.hideAlert();
                },3000)
            },
            showAddWin: function (isEdit,data,view) {
                var url = window.currentApiUrl.systemSet.basic.userEdit;
                vm.curOpt = 'edit';
                if(view=='view') vm.curOpt='view';
                cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
                cZtree.initSelectMenuTree('#user_deptZtree', deptTreeData,{
                    idKey: 'id',
                    pIdKey: 'pId',
                    rootPId: 0
                });
                cZtree.selectTreeNodeByAttributeValues('user_ztreeCity', 'areaCode', '');
                //cZtree.initSelectZtree('#user_ztreeCity', cMthods.getUpAreaDataListByLevel(6, cityListData), true, cMthods.getAreaTreeRootKey());
                if (!isEdit) {
                    vm.user = defaultData();
                    url = window.currentApiUrl.systemSet.basic.userAdd;
                    $('.special.cards .image').dimmer({on: 'hover'});
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        //$('.ui.dropdown.link-change').dropdown('clear');
                        cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.deptId+'');
                    },200);
                }else{
                    vm.user = data;
                    if(!data.headImg) vm.user.headImg = '';
                    setTimeout(function () {
                        //console.log(vm.user.roleIds)
                        $('.ui.dropdown').dropdown();
                        $('.special.cards .image').dimmer({on: 'hover'});
                        //$('.ui.dropdown.link-change').dropdown('clear').dropdown('set selected',vm.user.roleIds!=''?vm.user.roleIds.split(','):'');
                        cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.user.deptId+'');
                        cZtree.selectTreeNodeByAttributeValues('user_ztreeCity', 'areaCode', vm.user.areaCode);
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
                            phoneReg = /^1[0-9]{10}$/;
                        vm.user.deptId = cZtree.getMenuTreeCheckedAttrValues('user_deptZtree', 'id');
                        vm.user.area = cZtree.getTreeCheckedAttrValues('user_ztreeCity', 'areaCode');
                        //表单提交所需要数据
                        $('input[name=deptId]').val(vm.user.deptId);
                        $('input[name=areaCode]').val(vm.user.area);
                        /*if (vm.user.workNumber == '') {
                            msg = '员工编号不能为空';
                        } else if (vm.user.name == '') {
                            msg = '真实姓名不能为空';
                        } else if(vm.user.deptId == '') {
                            msg = '请选择所属部门';
                        } else if (vm.user.area != '' && vm.user.area.split(',').length>6) {
                            msg = '负责区域最多只能选择6个';
                        } else if (vm.user.phone == '') {
                            msg = '手机号码不能为空';
                        } else if(!phoneReg.test(phone)){
                            msg = '手机号不合法';
                        } else if (vm.user.identityNumber == '') {
                            msg = '证件不能为空';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }*/
                        //vm.user.upAreaCode = (cMthods.getAreaCodeByName(vm.user.areaUpName, cityListData));
                        //vm.user.roleIds = roleIdsArray==null?'':roleIdsArray.join(',');
                        jqueryAjax.ajaxUploadForm(
                            url,
                            new FormData($('#userForm')[0]),
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
                vm.showAddWin(true,data);
            },
            showEditWin: function (data,view) {
                if(view){
                    vm.showAddWin(true,data,view);
                }else{
                    vm.showAddWin(true,data);
                }
            },
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.systemSet.basic.userDel,
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
                            window.currentApiUrl.systemSet.basic.resetUserPassword,
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
            exportBillExcel:function () {
                cMthods.downloadFile(window.currentApiUrl.systemSet.basic.exportBill,vm.searchFormData);
            },
            downloadTemplateExcel:function () {
                cMthods.downloadFile(window.currentApiUrl.systemSet.basic.downloadTemplateBill,{parkName:vm.parkName,parkId:vm.parkId});
            },
            uploadBillExcel:function () {
                vm.isShowDownloadBtn=false;
                vm.inputParkName='';
                vm.parkId='';
                vm.parkName='';
                vm.date='';
                vm.queryParkList=[];
                $('input[type=file]').val('');
                $('#billParkNameSelect').dropdown('set text', '');
                cDateTimerPicker.initDateTimePicker('.my-date', 'yyyy-mm');
                myBillModal = $('#billUploadWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '';
                        if (vm.parkName == '') {
                            msg = '请选择所属园区';
                        } else if (vm.date == '') {
                            msg = '请选择账单日期';
                        } else if ($('input[type=file]').val() == '') {
                            msg = '请选择文件';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        vm.btnSaveActive = true;
                        jqueryAjax.ajaxUploadForm(
                            window.currentApiUrl.bill.uploadBill,
                            new FormData($('#billUploadForm')[0]),
                            function (response, msgType, isOk) {
                                if (response.status == 200) {
                                    // 如果一切顺利，直接关闭 Modal
                                    var empty = true;
                                    for (var k in response.data) {
                                        empty = false;
                                        break;
                                    }
                                    if (empty) {
                                        cMessage.showPopup({
                                            className: msgType,
                                            content: response.message
                                        });
                                        myBillModal.modal('hide');
                                        myTable.draw();
                                        return;
                                    }

                                    // 账单字段出现错误
                                    var result = response.data.results,
                                        tableHeader = result.tHeader,
                                        columns = [];
                                    cMessage.showPopup({
                                        className: 'warning',
                                        content: response.message
                                    });

                                    vm.isUploaded = true;
                                    vm.btnSaveActive = false;

                                    if (vm.firstUpload) {
                                        console.log('first upload')
                                        for (var i = 0; i < tableHeader.length; i++) {
                                            columns.push({title: tableHeader[i]});
                                        }
                                        sheetTable = $('#uploadBillDetail').dataTable({
                                            data: result.tBody,
                                            searching: false,
                                            dom: "rt<'datatable_pageagtion'iflp<'clear'>>",
                                            columns: columns
                                        });
                                        vm.firstUpload = false;
                                    } else {
                                        var oSettings = sheetTable.fnSettings();

                                        sheetTable.fnClearTable(this);

                                        for (var i=0; i<result.tBody.length; i++)
                                        {
                                            sheetTable.oApi._fnAddData(oSettings, result.tBody[i]);
                                        }

                                        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
                                        sheetTable.draw();
                                    }
                                } else if (response.status == 500) {
                                    cMessage.showPopup({
                                        className: 'error',
                                        content: response.message
                                    });
                                    vm.btnSaveActive = false;
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                                vm.btnSaveActive = false;
                            });
                        return false;
                    },
                    onHidden: function () {
                        //$('.ui.modals #billUploadWin').remove();
                    }
                }).modal('show');
            },
            uploadBillAgain:function(){
                myBillModal.modal('hide');
            }
        }),
        initDeptTree = function (data) {
            cZtree.initEditTree('#deptZtree',data,null,null,function (event,treeId,treeNode) {
                vm.deptId = treeNode.id;
                vm.search();
            });
        },
        baseBillDetailOpts = function (columnData) {
            var tableOpts = {
                container: '#billDetailTable',
                pagingType: 'simple',
                isShowIndexNumber: true,
                bLengthChange:false,
                pageSize:5,
                columns: [
                    {field: null,width:30, title: '序号', isShow: true, isSort: false}
                ],
                ajax: {
                    url: window.currentApiUrl.bill.getBill,
                    type: 'GET',
                    data: function (data) {
                        data.pageNo = data.start / data.length + 1;
                        data.pageSize = data.length;
                        data.id = vm.billDetailId;
                    }
                }
            };
            for(var item in columnData){
                tableOpts.columns.push({
                    field: item, title: item, isShow: true, isSort: false
                });
            }
            return tableOpts;
        },
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'workNumber', title: '员工编号', isShow: true, isSort: false},
                {field: 'name', title: '员工姓名', isShow: true, isSort: false},
                {field: 'phone', title: '手机号码', isShow: true, isSort: false},
                {field: 'tel', title: '固定电话', isShow: true, isSort: false, render: function (data) {
                    return data==''?'':data;
                }},
                {field: 'email', title: '邮箱', isShow: true, isSort: false},
                {field: 'post', title: '职位', isShow: true, isSort: false},
                {field: 'isJob', title: '在职状态', isShow: true, isSort: false, render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, isJobData)['name'];
                }},
                {field: 'deptId', title: '所属部门', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'id', value: data}, deptTreeData)['name'];
                }},
                {field: 'gender', title: '性别', isShow: true, isSort: false, render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, sexData)['name'];
                }},
                {
                    field: null, title: '操作', isShow: true, isSort: false,
                    render: function () {
                        return '<div class="tr-operation">' +
                            //'<i class="icon recycle purple" title="重置密码"></i>' +
                            '<i class="icon unhide" title="查看"></i>' +
                            '<i class="icon edit green" title="修改"></i>' +
                            '<i class="icon remove red" title="删除"></i>' +
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
                    data.name= vm.searchData.name;
                    data.phone= vm.searchData.phone;
                    data.isJob= vm.searchData.isJob;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon unhide')) {
                        vm.showEditWin(rowData,'view');  //vm.resetPassword(rowData.id);
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
            cZtree.initSelectZtree('#user_ztreeCity', cityListData, true, cMthods.getAreaTreeRootKey());
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
