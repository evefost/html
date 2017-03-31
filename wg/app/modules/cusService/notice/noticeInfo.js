/**
 * 公告管理
 */
define([
    'component-message',
    'component-datatable',
    'component-ztree',
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-wangeditor',
    'component-uploader',
    'sortable',
    'component-datetimerpicker',
    'jquery.semantic'
], function (cMessage, cDataTable, cZtree,jqueryAjax,cMthods,editor,cUploader,Sortable,cDateTimerPicker) {
    var myTable,
        typeTable,
        myEditor,
        commonData = cMthods.getRoleData().roleCommonData,
        cityListData = commonData.cityList,
        newsTypeIdSortData = commonData.newsTypeId,
        bankInfoData = commonData.bankInfoList,
        certificateTypeData = commonData.certificateType,
        newsPutStatusData = commonData.newsPutStatus,
        defaultData = function () {
            return {
                id: '',
                messageTypeId:'0',
                messageTypeName:'',
                content:'' ,
                platformBroker:'',
                platformUserapp:'',
                platformWebsite:'',
                platformWechat:''
            }
        },
        defaultTypeData = function(){
            return {
                id:'',
                messageTypeName: ''
            }
        },
        defaultSearchData = function () {
            return {
                startDate: '',
                endDate: '',
                startDatePush:'',
                endDatePush:'',
                title:'',
                author:'',
                newsType:'',
                newsTypeList:defaultNewsTypeList(),
                docType:'',
                publishStatus:''
            }
        },
        defaultNewsTypeList= function () {
            return [
                {
                    "name": "电梯维保",
                    "value": "1"
                },
                {
                    "name": "停水停电",
                    "value": "2"
                },
                {
                    "name": "安全防范",
                    "value": "3"
                },
                {
                    "name": "物业风采",
                    "value": "4"
                },
                {
                    "name": "投票调查",
                    "value": "5"
                },
                {
                    "name": "其他",
                    "value": "6"
                }
            ]
        },
        vm = avalon.define({
            $id: 'message',
            isEdit:false,
            //搜索属性
            publishStatus: '',
            messageTypeName:'',
            useStatus :'0',
            currentStatus:'first',
            message: defaultData(),
            messageType: defaultTypeData(),
            messageTypeList:[],
            searchFormData: defaultSearchData(),
            showAddWin: function (isEdit,data) {
                queryMessageTypeList();
                var url = window.currentApiUrl.cusSever.notice.messageEdit;
                if(!myEditor){
                    myEditor = editor.initWangEditor({
                        container:'message_ueditor',
                        uploadUrl:window.currentApiUrl.commonUploadFile,
                        uploadErrorCallback:function (msg) {
                            cMessage.showPopup({
                                className: 'error',
                                content: msg
                            });
                        }
                    });
                }
                if (!isEdit) {
                    vm.message= defaultData();
                    url = window.currentApiUrl.cusSever.notice.messageAdd;
                    setTimeout(function(){
                        $('.ui.dropdown').dropdown();
                        myEditor.$txt.html('<p><br></p>');
                    },200);
                }else{
                    vm.message = data;
                    vm.message.platformBroker = vm.message.platformBroker == 1 ? true : false;
                    vm.message.platformUserapp = vm.message.platformUserapp == 1 ? true : false;
                    vm.message.platformWebsite = vm.message.platformWebsite == 1 ? true : false;
                    vm.message.platformWechat = vm.message.platformWechat == 1 ? true : false;
                    setTimeout(function(){
                        $('.ui.dropdown').dropdown();
                        myEditor.$txt.html(vm.message.content);
                    },200);
                }
                var myModal = $('#messageAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '';
                        vm.message.content = myEditor.$txt.html();
                        if(vm.message.messageTypeId <= 0){
                            msg = '请选消息类型';
                        }else if(!vm.message.platformBroker && !vm.message.platformUserapp  && !vm.message.platformWebsite && !vm.message.platformWechat){
                            msg = '请选择发布平台';
                        }else if(vm.message.content=='<p><br></p>'){
                            msg = '请输入消息内容';
                        }else{
                            msg = '';
                        }
                        if(msg!=''){
                            cMessage.showPopup({className:'warning',content:msg});
                            return false;
                        }
                        vm.message.content = myEditor.$txt.html();
                        vm.message.platformBroker = vm.message.platformBroker == true ? 1 : 0;
                        vm.message.platformUserapp = vm.message.platformUserapp == true ? 1 : 0;
                        vm.message.platformWebsite = vm.message.platformWebsite == true ? 1 : 0;
                        vm.message.platformWechat = vm.message.platformWechat == true ? 1 : 0;
                        var data = {
                            platformBroker:vm.message.platformBroker,
                            platformUserapp:vm.message.platformUserapp,
                            platformWebsite:vm.message.platformWebsite,
                            platformWechat:vm.message.platformWechat,
                            messageTypeId:vm.message.messageTypeId,
                            content:vm.message.content
                        }
                        if(isEdit)data.id=vm.message.id;
                        jqueryAjax.post(
                            url,
                            data,
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
                            }
                        );
                        return false;
                    }
                }).modal('show');
            },
            showAddType: function(isEdit,data){
                var url = window.currentApiUrl.cusSever.noticeType.messageTypeEdit;
                if (!isEdit) {
                    vm.messageType= defaultTypeData();
                    url = window.currentApiUrl.cusSever.noticeType.messageTypeAdd;
                }else{
                    vm.messageType = data;
                }
                var myModal = $('#messageTypeAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '';
                        if(vm.messageType.messageTypeName==''){
                            msg = '请输入消息类型名称';
                        }else{
                            msg = '';
                        }
                        if(msg!=''){
                            cMessage.showPopup({className:'warning',content:msg});
                            return false;
                        }
                        jqueryAjax.post(
                            url,
                            vm.messageType,
                            function (response, msgType, isOk) {
                                typeTable.draw();
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
                            }
                        );
                        return false;
                    }
                }).modal('show');
            },
            showEditWin: function (data) {
                vm.isEdit = true;
                vm.showAddWin(true,data);
            },
            //消息置顶or取消置顶
            setTop:function (id) {
                jqueryAjax.post(
                    window.currentApiUrl.cusSever.notice.messageIsTop,
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
                    }
                );
            },
            //消息发布
            setPublish: function(id){
                jqueryAjax.post(
                    window.currentApiUrl.cusSever.notice.publishMessage,
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
                    }
                );
            },
            //启用消息or禁用消息type
            setIsInUse: function(id){
                jqueryAjax.post(
                    window.currentApiUrl.cusSever.noticeType.messageTypeIsInUse,
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
                    }
                );
            },
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.get(
                            window.currentApiUrl.cusSever.notice.messageDel,
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
            showDeleteType: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.get(
                            window.currentApiUrl.cusSever.noticeType.messageTypeDel,
                            {id: id},
                            function (response, msgType, isOk) {
                                typeTable.draw();
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
            searchType: function () {
                typeTable.draw();
            },
            reset: function(){
                vm.searchFormData= defaultSearchData();
                //$(".column input,.column select").val("");
                $('.column .ui.dropdown').dropdown('restore defaults');
                //if(vm.currentStatus == 'first')vm.search();
                //else vm.searchType();
            },
            exportMessage: function(){
                //导出消息
            },
            exportMessageType: function(){
                //导出消息列表
            }
        }),
        baseTableOpts = {
            isShowIndexNumber: true,
            container:'#messageTable',
            columns: [
                {field: null, title: '编号', isShow: true, isSort: false, width: 40},
                {field: 'messageTypeName', title: '消息类型', isShow: true, isSort: false},
                {field: 'littleContent', title: '消息内容', isShow: true, isSort: false},
                {field: 'platforms', title: '发布平台', isShow: true, isSort: false},
                {field: 'createTime', title: '新建时间', isShow: true, isSort: false},
                {field: 'updateTime', title: '修改时间', isShow: true, isSort: false},
                {field: 'publishStatus',title:'推送状态',isShow:true,isSort:false,render:function(data) {
                    return data=='1'?'已发布':'待发布';
                }},
                {field: 'clickCount', title: '点击次数', isShow: true, isSort: false},
                {
                    field: 'topTime', title: '操作', isShow: true, isSort: false, width: 130,
                    render: function (data) {
                        var html = '<div class="tr-operation">';
                        if(data > 0)html += '<i class="icon arrow blue down" title="取消置顶"></i> ';
                        else html += '<i class="icon arrow blue up" title="置顶"></i>';
                        html += '<i class="icon edit green" title="修改"></i><i class="icon remove red" title="删除"></i></div>';
                        return html;
                    }
                },
                {
                    field: 'publishStatus', title: '发布', isShow: true, isSort: false, width: 20,
                    render: function (data) {
                        var html = '<div class="tr-operation">';
                        if(data != 1)html += '<i class="icon arrow up red" title="发布"></i> ';
                        html +='</div>';
                        return html;
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.cusSever.notice.messageList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.publishStatus = vm.publishStatus;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        vm.showEditWin(rowData);
                    }else if (target.hasClass('icon arrow blue')) {
                        vm.setTop(rowData.id);
                    }else if (target.hasClass('icon arrow up red')) {
                        vm.setPublish(rowData.id);
                    }else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(rowData.id);
                    }
                }
            }
        },
        typeTableOpts = {
            isShowIndexNumber: true,
            container:'#messageTypeTable',
            columns: [
                {field: null, title: '编号', isShow: true, isSort: false, width: 40},
                {field: 'messageTypeName', title: '消息类型', isShow: true, isSort: false},
                {field: 'createTime', title: '新建时间', isShow: true, isSort: false},
                {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
                {field: 'useStatus',title:'状态',isShow:true,isSort:false,render:function(data) {
                    return data=='FORBIDDEN'?'禁用':'启用';
                }},
                {
                    field: 'useStatus', title: '操作', isShow: true, isSort: false, width: 180,
                    render: function (data) {
                        var html = '<div class="tr-operation">';
                        if(data == 'FORBIDDEN')html += '<i class="icon arrow blue up" title="启用"></i>';
                        else html += '<i class="icon arrow blue down" title="禁用"></i>';
                        html += '<i class="icon edit green" title="修改"></i><i class="icon remove red" title="删除"></i></div>';
                        return html;
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.cusSever.noticeType.messageTypeList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.useStatus = vm.useStatus;
                    data.messageTypeName = vm.messageTypeName;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        var data = {
                            messageTypeName: rowData.messageTypeName,
                            id:rowData.id
                        }
                        vm.showAddType(true,rowData);
                    }else if (target.hasClass('icon arrow blue')) {
                        vm.setIsInUse(rowData.id);
                    }else if (target.hasClass('icon remove')) {
                        vm.showDeleteType(rowData.id);
                    }
                }
            }
        },
        queryMessageTypeList = function(){
            vm.messageTypeList = [];
            jqueryAjax.get(
                window.currentApiUrl.cusSever.noticeType.messageTypeList,
                {pageSize:500},
                function (response, msgType, isOk) {
                    var result =  response.data.results.tBody;
                    if(result && result.length>0){
                        for(var i=0;i<result.length;i++){
                            vm.messageTypeList.push({
                                messageTypeId: result[i].id,
                                messageTypeName: result[i].messageTypeName
                            });
                        }
                    }
                }
            );
        };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {}
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            vm.searchFormData = defaultSearchData();
            cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
            myTable = cDataTable.initBaseTable(baseTableOpts);
            //typeTable = cDataTable.initBaseTable(typeTableOpts);
            $('.ui.dropdown').dropdown();
            $('.menu .item').tab('change tab','first').tab({
                onLoad:function (tabName) {
                    if(tabName === 'first'){
                        vm.currentStatus = 'first';
                        vm.search();
                       
                    }else if(tabName === 'second'){
                        vm.currentStatus = 'second';
                        vm.searchType();
                    }    
                }
            });
        }
        $ctrl.$onBeforeUnload = function () {}
        $ctrl.$vmodels = [];
    });
});
