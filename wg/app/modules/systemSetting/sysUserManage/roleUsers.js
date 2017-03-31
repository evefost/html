/**
 * 楼盘房源管理
 */
define([
    'component-message',
    'jqueryAjax',
    'component-ztree',
    'jquery.semantic'
], function (cMessage, jqueryAjax,cZtree) {
    var vm = avalon.define({
            $id: 'roleUsers',
            roleId:0,
            roleAllMenuList:[],
            roleSelectMenuIds:[],
            back: function () {
                avalon.router.go('app.systemSetting.roleManage');
            },
            saveRoleUsers:function () {
                var userIds = cZtree.getTreeCheckedAttrValues('roleUsersZtree', 'userId');
                jqueryAjax.post(
                    window.currentApiUrl.systemSet.sysUser.roleUsersEdit,
                    {
                        roleId:vm.roleId,
                        roleUsersIds:userIds
                    },
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
        }),
        checkRoleUser = function (data) {
            cZtree.selectTreeNodeByAttributeValues('roleUsersZtree', 'userId', data);
        },
        getAllUsersList = function(roleId){
            jqueryAjax.get(
                window.currentApiUrl.systemSet.sysUser.roleUsersList,
                {roleId:roleId},
                function (response) {
                    var data = response.data.results,
                        roleUsersIds = response.data.roleUsersIds;
                    cZtree.initSelectZtree('#roleUsersZtree', data,true,{
                         idKey: 'id',
                         pIdKey: 'parentId',
                         rootPId: 0
                     });
                    checkRoleUser(roleUsersIds);
                },
                function (response, msgType) {
                    cMessage.showPopup({
                        className: msgType,
                        content: response.message
                    });
                }
            );
        };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function (params) {
            vm.roleId = params.roleId !== "" ? params.roleId : 0;
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            getAllUsersList(vm.roleId);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
