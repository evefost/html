/**
 * 楼盘房源管理
 */
define([
    'component-message',
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-ztree',
    'jquery.semantic'
], function (cMessage, jqueryAjax, cMthods,cZtree) {
    var myTable,
        commonData = cMthods.getRoleData().roleCommonData,
        roleMenuData = commonData.roleMenuList,
        vm = avalon.define({
            $id: 'roleMenu',
            roleId:0,
            roleAllMenuList:[],
            roleSelectMenuIds:[],
            back: function () {
                avalon.router.go('app.authors.role');
            },
            saveRoleMenu:function () {
                //var ids = cZtree.getTreeCheckedAttrValues('roleMenuSelectZtree', 'id');
                var root = $('.div-grid').find('input[type=checkbox]:checked'),
                    roleSelectMenuIds = [];
                root.each(function () {
                    roleSelectMenuIds.push(this.value);
                });
                jqueryAjax.post(
                    window.currentApiUrl.roleMenu.roleMenuEdit,
                    {
                        roleId:vm.roleId,
                        roleMenuIds:roleSelectMenuIds.join(',')
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
            },
            search: function () {
                myTable.fnDraw();
            }
        }),

        getRoleMenuList = function(roleId){
            /*cZtree.initSelectZtree('#roleMenuSelectZtree', data,true,{
                idKey: 'id',
                pIdKey: 'parentId',
                rootPId: 1
            });*/
            //vm.roleAllMenuList = [];
            jqueryAjax.get(
                window.currentApiUrl.roleMenu.roleMenuList,
                {roleId:roleId},
                function (response) {
                    var data = response.data.results,
                        currentRoleMenuIds = response.data.roleMenuIds;
                    vm.roleSelectMenuIds = currentRoleMenuIds;
                    vm.roleAllMenuList = data;
                    buildAllCheckElems();
                    setTimeout(function () {
                        checkRoleMenu(currentRoleMenuIds);
                    },50);

                    /*cZtree.initSelectZtree('#roleMenuSelectZtree', data,true,{
                        idKey: 'id',
                        pIdKey: 'parentId',
                        rootPId: 1
                    });*/
                },
                function (response, msgType) {
                    cMessage.showPopup({
                        className: msgType,
                        content: response.message
                    });
                }
            );
        },
        checkRoleMenu = function (roleMenuIds) {
            var tempArray = [],
                allCheckBoxs = $('#roleMenuList input[type=checkbox]');
            if(roleMenuIds && roleMenuIds.length>0){
                tempArray = roleMenuIds.split(',');
                for(var i=0,lenI=allCheckBoxs.length;i<lenI;i++){
                    for(var j=0,lenJ=tempArray.length;j<lenJ;j++){
                        if(allCheckBoxs[i].value == tempArray[j]){
                            $(allCheckBoxs[i]).prop('checked',true);
                            break;
                        }
                    }
                }
            }
        },
        bindCheckEvent=function () {
            $('#roleMenuList').off('click').on('click','input[type=checkbox]',function () {
                var nodes = $(this).parent().parent('.div-grid-column-2').length>0 ? $(this).parent().parent('.div-grid-column-2'): $(this).parent().parent('.div-grid-column-10'),
                    allParentsNodes = nodes.parents('.div-grid-row').find('>.div-grid-column-2 input[type=checkbox]'),
                    allChildsNodes = nodes.parent('.div-grid-row').find('>.div-grid-column-10 input[type=checkbox]');
                if(this.checked){
                    allParentsNodes.prop('checked',true);
                    //allChildsNodes.prop('checked',true);
                }else{
                    //allParentsNodes.prop('checked',false);
                    //allChildsNodes.prop('checked',false);
                }
            });
        },
        buildAllCheckElems = function (data) {
            var allMenuList = vm.roleAllMenuList,
                oneLevelMenu = getMenuListByLevel(allMenuList,1),
                twoLevelMenu = getMenuListByLevel(allMenuList,2),
                threeLevelMenu = getMenuListByLevel(allMenuList,3),
                methodsMenu = getMenuListByLevel(allMenuList,-1),
                divGridHtml = '';

            for(var i=0;i<oneLevelMenu.length;i++){
                divGridHtml+='<div class="div-grid-row div-grid-row-left">'+
                                '<div class="div-grid-column-2">' +
                                    '<div class="ui checkbox">'+
                                        '<input type="checkbox" value="'+oneLevelMenu[i].id+'">'+
                                        '<label>'+oneLevelMenu[i].name+'</label>'+
                                    '</div><br/>'+
                                '</div>'+
                                '<div class="div-grid-column-10 div-grid-column-10-no-padding">';
                for(var j=0;j<twoLevelMenu.length;j++){
                    if(twoLevelMenu[j].parentId==oneLevelMenu[i].id){
                        divGridHtml+='<div class="div-grid-row">'+
                                        '<div class="div-grid-column-2">'+
                                            '<div class="ui checkbox">'+
                                                '<input type="checkbox" value="'+twoLevelMenu[j].id+'">'+
                                                '<label>'+twoLevelMenu[j].name+'</label>'+
                                            '</div><br/>'+
                                        '</div>'+
                                        '<div class="div-grid-column-10 div-grid-column-10-no-padding">';
                        for(var k=0;k<threeLevelMenu.length;k++){
                            if(threeLevelMenu[k].parentId==twoLevelMenu[j].id){
                                divGridHtml+='<div class="div-grid-row" >'+
                                    '<div class="div-grid-column-2">'+
                                        '<div class="ui checkbox">'+
                                            '<input type="checkbox" value="'+threeLevelMenu[k].id+'">'+
                                            '<label>'+threeLevelMenu[k].name+'</label>'+
                                        '</div><br/>'+
                                    '</div>'+
                                    '<div class="div-grid-column-10">';
                                for(var q=0;q<methodsMenu.length;q++){
                                    if(methodsMenu[q].parentId==threeLevelMenu[k].id){
                                        divGridHtml+='<div class="ui checkbox">'+
                                            '<input type="checkbox" value="'+methodsMenu[q].id+'">'+
                                            '<label>'+methodsMenu[q].name+'</label>'+
                                            '</div>';
                                    }
                                }
                                divGridHtml+='</div></div>';
                            }
                        }
                        divGridHtml+='</div></div>';
                    }
                }
                divGridHtml+='</div></div>';
            }
            $('#roleMenuList > #roleMenuBody').replaceWith(divGridHtml);

        },
        getMenuListByLevel = function(data,level){
            var tempArray = [];
            for(var i=0;i<data.length;i++){
                if(data[i].level == level){
                    tempArray.push(data[i]);
                }
            }
            return tempArray;
        };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function (params) {
            vm.roleId = params.roleId !== "" ? params.roleId : 0;
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            getRoleMenuList(vm.roleId);
            bindCheckEvent();
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
