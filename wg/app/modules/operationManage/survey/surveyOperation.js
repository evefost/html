define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-datetimerpicker',
    'component-wangeditor'
], function(jqueryAjax, cMethod, cMessage, cDataTable, cDateTimePicker, richEditor) {
    var getNewTopicItem = function() {
            return {
                topicTitle: '',
                topicType: 'RADIO',
                itemList: [
                    {
                        content: ''
                    }, 
                    {
                        content: ''
                    }
                ]
            }
        },
        getSurveyData = function (subjectId) {
            // 获取问卷详情
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
                    }
                }
            });
        },
        getTopicList = function () {
            var subjectId = vm.
            $.ajax({
                url: window.currentApiUrl.surveyManagement.surveyDetail,
                type: 'GET',
                data: 'subjectId=' + data.subjectId,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.status === 200) {
                        vm.surveyData.topicList = data.data.subjectDetail.topicList;
                        editor.$txt.html(vm.surveyData.description);
                    }
                }
            });
        },
        vm = avalon.define({
            $id: 'surveyOperation',
            subjectId: '',
            surveyData: {},
            topicItem: getNewTopicItem(),
            isEdit: false,
            back: function () {
                avalon.router.go('app.operationManage.survey');
            },
            questionAdd: function () {
                vm.isEdit = false;
                vm.topicItem = getNewTopicItem();
                var questionModal = $('#questionModal').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        var item = $('#questionModal input.option').map(function () {
                            var value = $(this).val().trim();
                            if (value != '') {
                                return value;
                            }
                        }).get();
                        
                        if (item.length < 2) {
                            cMethod.showPopupMessage('warning', '每个问题至少需要有两个选项哦');
                            return false;
                        }

                        var questionnaireStr = {
                            topicTitle: $('#topicTitle').val(),
                            topicType: vm.topicItem.topicType,
                            itemList: item
                        };

                        $.ajax({
                            url: window.currentApiUrl.surveyManagement.topicAdd,
                            type: 'GET',
                            data: 'questionnaireStr=' + JSON.stringify(questionnaireStr),
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.status === 200) {
                                    getSurveyData(vm.subjectId);
                                }
                            }
                        });
                    },
                    onDeny: function() {
                    }
                }).modal('show');
            },
            questionEdit: function (event) {
                vm.isEdit = true;
                var questionModal,
                    $input = $(event.target).siblings('input');

                var topicId = $input.val(),
                    len = vm.surveyData.topicList.length,
                    i,
                    topic = {};
                for (i = 0; i < len; i++) {
                    if (vm.surveyData.topicList[i].topicId == topicId) {
                        console.log(vm.surveyData.topicList[i].topicTitle);
                        topic = vm.surveyData.topicList[i];
                        break;
                    }
                }
                vm.topicItem = topic;

                questionModal = $('#questionModal').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        var item = $('#questionModal input.option').map(function () {
                            var value = $(this).val().trim();
                            if (value != '') {
                                return {content: value};
                            }
                        }).get();

                        if (item.length < 2) {
                            cMethod.showPopupMessage('warning', '每个问题至少需要有两个选项哦');
                            return false;
                        }

                        var questionnaireStr = {
                            topicTitle: $('#topicTitle').val(),
                            topicType: vm.topicItem.topicType,
                            itemList: item
                        };

                        $.ajax({
                            url: window.currentApiUrl.surveyManagement.topicAdd,
                            type: 'GET',
                            data: 'questionnaireStr=' + JSON.stringify(questionnaireStr),
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.status === 200) {
                                    getSurveyData(vm.subjectId);
                                }
                            }
                        });
                    },
                    onDeny: function() {
                        vm.surveyData.topicList[i] = topic;
                    }
                }).modal('show');
            },
            questionDelete: function (event) {
                var topicId = $(event.target).siblings('input').val();
                var deleteModal = $('#confirm').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        $.ajax({
                            url: window.currentApiUrl.surveyManagement.topicAdd,
                            type: 'GET',
                            data: 'topicId=' + topicId,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.status === 200) {
                                    getSurveyData(vm.subjectId);
                                }
                            }
                        });
                    },
                    onDeny: function() {
                    }
                }).modal('show');
            },
            addOption: function (event) {
                event.preventDefault();
                var node = '<div class="fields"> <div class="three wide field"> </div> <div class="eight wide field">' +
                    '<input type="text" class="option"> </div> <div class="two wide field">' +
                    '<i class="ui circular red remove icon" style="cursor:pointer" title="删除选项" ms-click="removeOption"></i>' +
                    '</div> </div>';
                
                $('#addBefore').before($(node));
            },
        });
    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function (data) {
            vm.subjectId = data.subjectId;
            getSurveyData(vm.subjectId);
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {

            $(document).on('click', '.icon.remove', function (event) {
                $(event.target).closest('.fields').remove();
            })
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})