define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-datetimerpicker',
    'component-wangeditor'
], function(jqueryAjax, cMethod, cMessage, cDataTable, cDateTimePicker, richEditor) {
    var table,
        editor,
        getQueryData = function() {
            return {
                title: '',
                onlineStatus: '0',
            }
        },
        getNewSurveyData = function() {
            return {
                header: '',
                subjectId: '',
                subjectTitle:'',
                onlineTime:'',
                offlineTime:'',
                description:'',
                showLocation:'0',
                image: '',
                topicList: []
            }
        },
        vm = avalon.define({
            $id: 'survey',
            commonData: cMethod.getRoleData(),
            queryData: getQueryData(),
            commonData: cMethod.getRoleData(),
            surveyData: getNewSurveyData(),
            isEdit: false,
            search: function (event) {
                event.preventDefault();
                table.draw();
            },
            reset: function (event) {
                event.preventDefault();
                vm.queryData = getQueryData();
                $('.ui.dropdown').dropdown('restore default value');
            },
            showAddWin: function (event) {
                event.preventDefault();
                vm.isEdit = false;
                vm.surveyData = getNewSurveyData();

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);
                editor.$txt.html('');

                var surveyModal = $('#surveyModal').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        // 检测必填项
                        if (!vm.surveyData.subjectTitle) {
                            cMethod.showPopupMessage('error', '主题不能为空');
                            return false;
                        } else if (!vm.surveyData.onlineTime) {
                            cMethod.showPopupMessage('error', '请选择上架时间-起');
                            return false;
                        } else if (!vm.surveyData.offlineTime) {
                            cMethod.showPopupMessage('error', '请选择上架时间-止');
                            return false;
                        } else if (vm.surveyData.showLocation === '0') {
                            cMethod.showPopupMessage('error', '请选择广告展示的位置');
                            return false;
                        } else if (!vm.surveyData.image) {
                            cMethod.showPopupMessage('error', '您还未上传图片');
                            return false;
                        } else if (!editor.$txt.text()) {
                            cMethod.showPopupMessage('error', '请填写问卷调查描述');
                            return false;
                        } else if (vm.surveyData.offlineTime < vm.surveyData.onlineTime) {
                            cMethod.showPopupMessage('warning', '上架结束时间不能小于上架开始时间');
                            return false;
                        }

                        var success = true;
                        var formData = new FormData($('#data')[0]);
                        $.ajax({
                            url: window.currentApiUrl.surveyManagement.surveyAdd,
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
            showEditWin: function (subjectId) {
                vm.isEdit = true;

                $.ajax({
                    url: window.currentApiUrl.surveyManagement.surveyDetail,
                    type: 'GET',
                    data: 'subjectId=' + subjectId,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.surveyData = data.data.subjectDetail;
                            editor.$txt.html(vm.surveyData.description);
                        }
                    }
                });

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);
                var surveyModal = $('#surveyModal').modal('setting', {
                    closable: true,
                    onApprove: function() {

                        // 检测必填项
                        if (!vm.surveyData.subjectTitle) {
                            cMethod.showPopupMessage('error', '主题不能为空');
                            return false;
                        } else if (!vm.surveyData.onlineTime) {
                            cMethod.showPopupMessage('error', '请选择上架时间-起');
                            return false;
                        } else if (!vm.surveyData.offlineTime) {
                            cMethod.showPopupMessage('error', '请选择上架时间-止');
                            return false;
                        } else if (vm.surveyData.showLocation === '0') {
                            cMethod.showPopupMessage('error', '请选择广告展示的位置');
                            return false;
                        } else if (!vm.surveyData.image) {
                            cMethod.showPopupMessage('error', '您还未上传图片');
                            return false;
                        } else if (!editor.$txt.text()) {
                            cMethod.showPopupMessage('error', '请填写问卷调查描述');
                            return false;
                        } else if (vm.surveyData.offlineTime < vm.surveyData.onlineTime) {
                            cMethod.showPopupMessage('warning', '上架结束时间不能小于上架开始时间');
                            return false;
                        }
                        
                        var success = true;
                        var formData = new FormData($('#data')[0]);
                        $.ajax({
                            url: window.currentApiUrl.surveyManagement.surveyUpdate,
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
                                    success = false;
                                }
                            }
                        });
                        return success;
                    },
                    onDeny: function() {
                    }
                }).modal('show');
                /*avalon.router.go('app.operationManage.survey.Operation', {topicId: topicId});*/
            },
            showDeleteWin: function(id) {
                var deleteModal = $('#confirm').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        var success = true;
                        $.ajax({
                            url: window.currentApiUrl.surveyManagement.surveyDelete,
                            type: 'GET',
                            data: 'subjectId=' + id,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                console.log(data)
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
            showDetailWin: function (subjectId) {
                $.ajax({
                    url: window.currentApiUrl.surveyManagement.surveyDetail,
                    type: 'GET',
                    data: 'subjectId=' + subjectId,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.surveyData = data.data.subjectDetail;
                            editor.$txt.html(vm.surveyData.description);
                        }
                    }
                });

                var detailModal = $('#detailModal').modal('setting', {
                    closable: true,
                    onApprove: function() {
                    },
                    onDeny: function() {
                    }
                }).modal('show');
            },
            switchStatus: function(rowData) {
                var newStatus;
                if (rowData.onlineStatus == '1') {
                    newStatus = '2';
                } else if (rowData.onlineStatus == '2') {
                    newStatus = '1'
                }
                $.ajax({
                    url: window.currentApiUrl.surveyManagement.switchStatus,
                    type: 'GET',
                    data: 'subjectId=' + rowData.id + '&onlineStatus=' + newStatus,
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
            editTopic: function (subjectId) {
                avalon.router.go('app.operationManage.survey.Operation', {subjectId: subjectId});
            },
            uploadImage: function(type){
                var target = this, freader;
                if (target.files.length > 0) {
                    freader = new FileReader();
                    freader.readAsDataURL(target.files.item(0));
                    freader.onload = function (e) {
                        var imgBase64Code= e.target.result;
                        vm.surveyData.image = imgBase64Code;
                    }
                }
            },
            showResourceImg: function () {
                var sourceImg = vm.surveyData.image;
                sourceImg !='' && window.open(sourceImg);
            },
            delResourceImg: function () {
                vm.surveyData.image = '';
            },
        });

    var baseTableOpts = {
        isShowIndexNumber: false,
        columns: [
            {field: 'title', title: '广告主题', isShow: true, isSort: false},
            {field: 'partakeAmount', title: '点击次数', isShow: true, isSort: false},
            {field: 'shareAmount', title: '分享次数', isShow: true, isSort: false},
            {field: 'onlineTime', title: '上架时间', isShow: true, isSort: false},
            {field: 'createTime', title: '创建时间', isShow: true, isSort: false},
            {field: 'onlineStatus', title: '状态', isShow: true, isSort: false, render: function(val) {
                if (val === -1) {
                    return '已下架';
                } else if (val === 1) {
                    return '待上架';
                } else if (val === 2) {
                    return '已上架';
                }
            }},
            {field: 'onlineStatus', title: '操作', isShow: true, isSort: false, width: '200px', render: function(val) {
                var op;
                if (val === -1) {
                    op = '';
                } else if (val === 1) {
                    op = '<i class="icon switch angle double up orange" title="上架"></i>';
                } else if (val === 2) {
                    op =  '<i class="ui icon switch angle double down" title="下架"></i>';
                }

                return '<div class="tr-operation">' +
                    '<i class="icon info circle teal" title="详情"></i>' +
                    '<i class="icon edit green" title="修改"></i>' +
                    '<i class="icon unordered list blue" title="编辑问卷问题"></i>' +
                    '<i class="icon remove red" title="删除"></i>' +
                    op +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.surveyManagement.surveyList,
            type: 'GET',
            data: function (data) {
                data.pageNo = data.start / data.length + 1;
                data.pageSize = data.length;
                $.extend(data, vm.queryData)
            }
        },
        operationCallback: function (e, rowData) {
            if (rowData) {
                var target = $(e.target);
                if (target.hasClass('icon switch')) {
                    vm.switchStatus(rowData);
                } else if (target.hasClass('icon info')) {
                    vm.showDetailWin(rowData.id);
                } else if (target.hasClass('icon edit')) {
                    rowData.image = 'http://images.xdaozwg.com' + rowData.image;
                    vm.showEditWin(rowData.id);
                } else if (target.hasClass('icon remove')) {
                    vm.showDeleteWin(rowData.id);
                } else if (target.hasClass('icon unordered list')) {
                    vm.editTopic(rowData.id);
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
            // 组件初始化
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            }, 200);
            cDateTimePicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd', new Date());
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
            // 获取表格数据
            table = cDataTable.initBaseTable(baseTableOpts);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})