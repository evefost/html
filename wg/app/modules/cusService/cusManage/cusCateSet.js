define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-datetimerpicker',
    'component-wangeditor'
], function(jqueryAjax, cMethod, cMessage, cDataTable, cDateTimePicker, richEditor) {
    var lTable,
        iTable='',
        csTable='',
        ctTable='',
        editor,
        getInitialStatus = function () {
            return 'level';
        },
        defSearchData = function () {
            return {
            	'level':'',
                'industry':'',
                'companySize':'',
                'companyType':''
            };
        },
        defQueryData = function () {
            return {
            	classType: '1',
            	className: ''
            };
        },
        defLevelData = function () {
            return {
            	'id':'',
            	'classType':'1',
                'name':'',
                'sort':'',
                'seviceName':'',
                'seviceContent':''
            };
        },
        defIndustryData = function () {
            return {
            	'id':'',
            	'classType':'2',
                'sort':'',
                'name':''
            };
        },
        defCompanySizeData = function () {
            return {
            	'id':'',
            	'classType':'3',
                'sort':'',
                'name':''
            };
        },
        defCompanyTypeData = function () {
            return {
            	'id':'',
            	'classType':'4',
                'sort':'',
                'name':''
            };
        },
        vm = avalon.define({
            $id: 'repair',
            //commonData: cMethod.getRoleData(),
            searchData: defSearchData(),
            currentStatus: getInitialStatus(), // 当前标签
            //searchDataBig: defSearchDataBig(),
            //searchDataSmall: defSearchDataSmall(),
            queryData: defQueryData(),  //查询请求数据
            //等级数据
            levelData: defLevelData(),
            industryData: defIndustryData(),
            companySizeData: defCompanySizeData(),
            companyTypeData: defCompanyTypeData(),
            // 切换标签
            switchStatus: function (newStatus) {
                if (newStatus === vm.currentStatus) return;
                vm.currentStatus = newStatus;
                if(newStatus==='level'){
                	vm.queryData.classType = '1';
                	vm.queryData.className = vm.searchData.level;
                    return lTable.draw();
                }
                if(newStatus==='industry'){
                	vm.queryData.classType = '2';
                	vm.queryData.className = vm.searchData.industry;
                    if(iTable ===''){
                        iTable = cDataTable.initBaseTable(iBaseTableOpts);
                        iTable.on('draw.dt', function () {
                            $('.tr-operation').children('a').css({
                                display: 'inline-block',
                                margin: '0px 4px',
                                cursor: 'pointer'
                            })
                        });
                    }else{
                        iTable.draw();
                    }

                }
                if(newStatus==='companySize'){
                	vm.queryData.classType = '3';
                	vm.queryData.className = vm.searchData.companySize;
                    if(csTable ===''){
                        csTable = cDataTable.initBaseTable(csBaseTableOpts);
                    }else{
                        csTable.draw();
                    }
                }
                if(newStatus==='companyType'){
                	vm.queryData.classType = '4';
                	vm.queryData.className = vm.searchData.companyType;
                    if(ctTable ===''){
                        ctTable = cDataTable.initBaseTable(ctBaseTableOpts);
                    }else{
                        ctTable.draw();
                    }
                }
            },
            search: function () {
                switch (vm.currentStatus){
                    case 'level':
                    	vm.queryData.classType = '1';
                        vm.queryData.className = vm.searchData.level;
                        lTable.draw();
                        break;
                    case 'industry':
                    	vm.queryData.classType = '2';
                        vm.queryData.className = vm.searchData.industry;
                        iTable.draw();
                        break;
                    case 'companySize':
                    	vm.queryData.classType = '3';
                        vm.queryData.className = vm.searchData.companySize;
                        csTable.draw();
                        break;
                    case 'companyType':
                    	vm.queryData.classType = '4';
                        vm.queryData.className = vm.searchData.companyType;
                        ctTable.draw();
                        break;
                    default:
                        break;
                }
            },
            reset: function () {
                vm.searchData = defSearchData();
            },
            lShowAddWin: function (isEdit,data) {
                //vm.parkData = getNewParkData();
                if (!isEdit) {
                    vm.levelData= defLevelData();
                    editor.$txt.html('');
                }else{
                	//vm.levelData=data;
                	vm.levelData.id= data.id;
                    vm.levelData.name= data.name;
                    vm.levelData.sort= data.sort;
                    vm.levelData.seviceName= data.seviceName;
                    vm.levelData.seviceContent= data.seviceContent;
                    editor.$txt.html(vm.levelData.seviceContent);
                }
                var modal = $('#newLevelModal').modal({
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        if(vm.levelData.level ==''){
                            cMethod.showPopupMessage('error', '请填写等级名称');
                            return false;
                        } else if (vm.levelData.serviceStandards =='') {
                            cMethod.showPopupMessage('error', '请填写服务标准');
                            return false;
                        }
                        var url= window.currentApiUrl.cusSever.cusManage.cusCateAddLevel;
                        var formData = new FormData($('#levelFormData')[0]);
                            //formData= vm.levelData
                        if(isEdit) url= window.currentApiUrl.cusSever.cusManage.cusCateEditLevel;
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: formData,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.status === 200) {
                                    cMethod.showPopupMessage('success', data.message);
                                    lTable.draw();
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
                        //$('.multi-search').dropdown('set text', '所属园区');
                    }
                }).modal('show');
            },
            iShowAddWin: function (isEdit,data) {
                if (!isEdit) {
                    vm.industryData= defIndustryData();
                }else{
                	vm.industryData.id= data.id;
                    vm.industryData.sort= data.sort;
                    vm.industryData.name= data.name;
                }
                var modal = $('#newIndustryModal').modal({
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        // 验证表单
                        if (vm.industryData.name=='') {
                            cMethod.showPopupMessage('error', '请输入行业名称');
                            return false;
                        }
                        var url= window.currentApiUrl.cusSever.cusManage.cusCateAddIndustry;
                        var formData = new FormData($('#industryFormData')[0]);
                            //formData= vm.industryData;
                        if(isEdit) url= window.currentApiUrl.cusSever.cusManage.cusCateEditIndustry;
                        $.ajax({
                            url: url,
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
            csShowAddWin: function (isEdit,data) {
                if (!isEdit) {
                    vm.companySizeData= defCompanySizeData();
                }else{
                	vm.companySizeData.id= data.id;
                    vm.companySizeData.sort= data.sort;
                    vm.companySizeData.name= data.name;
                }
                var modal = $('#newCompanySizeModal').modal({
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        if (vm.companySizeData.name==='') {
                            cMethod.showPopupMessage('error', '请输入规模名称');
                            return false;
                        }
                        var url= window.currentApiUrl.cusSever.cusManage.cusCateAddCompanySize;
                        var formData = new FormData($('#companySizeFormData')[0]);
                        	//formData= vm.companySizeData;
                        if(isEdit) url= window.currentApiUrl.cusSever.cusManage.cusCateEditCompanySize;
                        $.ajax({
                            url: url,
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
            ctShowAddWin: function (isEdit,data) {
                if (!isEdit) {
                    vm.companyTypeData= defCompanyTypeData();
                }else{
                	vm.companyTypeData.id= data.id;
                    vm.companyTypeData.sort= data.sort;
                    vm.companyTypeData.name= data.name;
                }
                var modal = $('#newCompanyTypeModal').modal({
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        if (vm.companyTypeData.name==='') {
                            cMethod.showPopupMessage('error', '请输入性质名称');
                            return false;
                        }
                        var url= window.currentApiUrl.cusSever.cusManage.cusCateAddCompanyType;
                        var formData = new FormData($('#companyTypeFormData')[0]);
                        	//formData= vm.companyTypeData;
                        if(isEdit) url= window.currentApiUrl.cusSever.cusManage.cusCateEditCompanyType;
                        $.ajax({
                            url: url,
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
            showEditWin: function (data) {
                vm.iShowAddWin(true,data);
            },
            showDeleteWin:function (data) {
                //if(childNumberIsHave(data)) return false;  //判断是否有子类设备数量
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.cusSever.cusManage.cusCateDel,
                            {d: data.id},
                            function (response, msgType, isOk) {
                                lTable.draw();
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            },
                            function (response, msgType) {
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
        dataSet = {
            level: {
                queryData: vm.parkQueryData
            },
            industry: {
                queryData: vm.supplierQueryData
            },
            companySize: {
                queryData: vm.supplierQueryData
            },
            companyType: {
                queryData: vm.supplierQueryData
            }
        };

    var lBaseTableOpts = {
            container: '#levelTable',
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'name', title: '等级', isShow: true, isSort: false},
                {field: 'seviceName', title: '服务标准', isShow: true, isSort: false},
                {field: null, title: '操作', isShow: true, isSort: false, textAlign: 'center', width: '160px', render: function(val) {
                    return '<div class="tr-operation" >' +
                        '<i class="icon edit green" title="修改"></i><i class="icon remove red" title="删除"></i></div>' +
                        '</div>';
                }},
            ],
            ajax: {
                url: window.currentApiUrl.cusSever.cusManage.cusCateListLevel,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    $.extend(data, vm.queryData);
                }
            },
            operationCallback: function (e, rowData) {
                var data = JSON.parse(JSON.stringify(rowData));
                //data.image = data.image.split(',');
                //if (data.image.length === 1 && data.image[0] == '') data.image = null;
                if (data) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        vm.lShowAddWin(true,data);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(data);
                    }
                }
            }
        },
        iBaseTableOpts = {
            container: '#industryTable',
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'name', title: '行业', isShow: true, isSort: false},
                {field: null, title: '操作', isShow: true, isSort: false, textAlign: 'center', width: '140px', render: function(val) {
                    return '<div class="tr-operation" >' +
                        '<i class="icon edit green" title="修改"></i><i class="icon remove red" title="删除"></i></div>' +
                        '</div>';
                }},
            ],
            ajax: {
                url: window.currentApiUrl.cusSever.cusManage.cusCateListIndustry,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    $.extend(data, vm.queryData);
                }
            },
            operationCallback: function (e, rowData) {
                var data = JSON.parse(JSON.stringify(rowData));
                if (data) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        vm.iShowAddWin(true,data);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(data);
                    }
                }
            }
        },
        csBaseTableOpts = {
            container: '#companySizeTable',
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'name', title: '行业', isShow: true, isSort: false},
                {field: null, title: '操作', isShow: true, isSort: false, textAlign: 'center', width: '140px', render: function(val) {
                    return '<div class="tr-operation" >' +
                        '<i class="icon edit green" title="修改"></i><i class="icon remove red" title="删除"></i></div>' +
                        '</div>';
                }},
            ],
            ajax: {
                url: window.currentApiUrl.cusSever.cusManage.cusCateListCompanySize,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    $.extend(data, vm.queryData);
                }
            },
            operationCallback: function (e, rowData) {
                var data = JSON.parse(JSON.stringify(rowData));
                if (data) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        vm.csShowAddWin(true,data);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(data);
                    }
                }
            }
        },
        ctBaseTableOpts = {
            container: '#companyTypeTable',
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'name', title: '行业', isShow: true, isSort: false},
                {field: null, title: '操作', isShow: true, isSort: false, textAlign: 'center', width: '140px', render: function(val) {
                    return '<div class="tr-operation" >' +
                        '<i class="icon edit green" title="修改"></i><i class="icon remove red" title="删除"></i></div>' +
                        '</div>';
                }},
            ],
            ajax: {
                url: window.currentApiUrl.cusSever.cusManage.cusCateListCompanyType,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    $.extend(data, vm.queryData);
                }
            },
            operationCallback: function (e, rowData) {
                var data = JSON.parse(JSON.stringify(rowData));
                if (data) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        vm.ctShowAddWin(true,data);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(data);
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
            vm.currentStatus=getInitialStatus(); // 当前标签
            iTable='';
            csTable='';
            ctTable='';
            // 组件初始化
            setTimeout(function () {
                $('.ui.dropdown').dropdown('setting', {
                    fullTextSearch: true,
                });
            }, 0);
            cDateTimePicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
            // 获取表格数据
            lTable = cDataTable.initBaseTable(lBaseTableOpts);
            lTable.on('draw.dt', function () {
                $('.tr-operation').children('a').css({
                    display: 'inline-block',
                    margin: '0px 4px',
                    cursor: 'pointer'
                })
            });
            lTable.on('init.dt', function(e, setting, json) {
                var data = json.data.results.tBody;
            })
            editor = richEditor.initWangEditor({
                container: 'description',
                hideInsertImg: false,
                //hideFullscreen:true,
                uploadUrl:window.currentApiUrl.commonUploadFile,
                uploadErrorCallback:function (msg) {
                    cMessage.showPopup({
                        className: 'error',
                        content: msg
                    });
                }
            });
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})