/**
 * 部门管理
 */
define([
    'component-message',
    'jqueryAjax',
    'component-ztree',
    'appPath/common/commonMethods',
], function (cMessage, jqueryAjax, cZtree, cMthods) {
    var commonData = cMthods.getRoleData().roleCommonData,
        deptListData,
        cityListData = commonData.cityList,
        deptTypeData = commonData.deptType,
        useStatusData = commonData.useStatus,
        defaultData = function () {
            return {
                id: '',
                useStatus: 'USEING',
                departmentName: '',
                parentId: 0,
                level: 1,
                departmentType: 'FUNCTIONS',
                area: '',
                areaName: '',
                sorted: '0',
                description: ''
            }
        },
        vm = avalon.define({
            $id: 'dept',
            isEdit:false,
            deptName:'',
            dept:defaultData(),
            useStatusList : useStatusData,
            deptTypeList : deptTypeData,
            addDept:function (id) {
                vm.isEdit =  false;
                vm.dept = defaultData();
                vm.dept.parentId = id;
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                    cZtree.selectMenuTreeNodeByAttributeValues('deptSelectZtree', 'id', id+'');
                    cZtree.selectTreeNodeByAttributeValues('dept_ztreeCity', 'areaCode', '');
                },200);
            },
            editDept:function (treedata) {
                vm.isEdit =  true;
                treedata.areaName = '';
                vm.dept = treedata;
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                    cZtree.selectMenuTreeNodeByAttributeValues('deptSelectZtree', 'id', treedata.parentId+'');
                    cZtree.selectTreeNodeByAttributeValues('dept_ztreeCity', 'areaCode', vm.dept.areaCode);
                },200);
            },
            saveOrUpdateDept:function () {
                var url = window.currentApiUrl.dept.deptAdd,pId;
                if(vm.isEdit){
                    url = window.currentApiUrl.dept.deptEdit;
                }
                if (vm.dept.departmentName == '') {
                    cMessage.showPopup({className: 'warning', content: '部门名称不能为空'});
                    return false;
                }
                vm.dept.areaCode = cZtree.getTreeCheckedAttrValues('dept_ztreeCity', 'areaCode');
                pId = cZtree.getMenuTreeCheckedAttrValues('deptSelectZtree', 'id');
                if(pId>0){
                	vm.dept.parentId = pId;
                }
                jqueryAjax.post(
                    url,
                    vm.dept,
                    function (response, msgType, isOk) {
                        cMessage.showPopup({
                            className: msgType,
                            content: response.message
                        });
                        getDeptList();
                    }, function (response, msgType) {
                        cMessage.showPopup({
                            className: msgType,
                            content: response.message
                        });
                    }
                );
            },
            showDeleteWin:function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.dept.deptDel,
                            {id: id},
                            function (response, msgType, isOk) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                                getDeptList();
                                vm.addDept(0);
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
            },
            search:function () {
                var searchResultTree = [];
                if(deptListData && deptListData.length>0){
                    for(var i=0;i<deptListData.length;i++){
                        if(deptListData[i].name.indexOf(vm.deptName)>=0){
                            searchResultTree.push(deptListData[i]);
                        }
                    }
                }
                initDeptTree(searchResultTree);
            },
        }),
        getDeptList = function () {
            jqueryAjax.get(
                window.currentApiUrl.systemSet.basic.organizationList,
                {},
                function (response) {
                    var data = response.data.results;
                    for(var i=0;i<data.length;i++){
                        data[i].name = data[i]['departmentName'];
                        data[i].pId = data[i]['parentId'];
                        data[i].open = true;
                    }
                    deptListData = data;
                    initDeptTree(deptListData);
                    cZtree.initSelectMenuTree('#deptSelectZtree', deptListData,{
                        idKey: 'id',
                        pIdKey: 'pId',
                        rootPId: 0
                    });
                },
                function (response, msgType) {
                    cMessage.showPopup({
                        className: msgType,
                        content: response.message
                    });
                }
            );
        },
        initDeptTree = function (data) {
            cZtree.initEditTree('#deptZtree', data,
                function (treeId, treeNode) {
                    var treeNode = treeNode,
                        aObj = $('#' + treeNode.tId + '_span'),
                        editStr = '<span class="iztree button add" id="diyBtn_add_' +treeNode.id+ '" title="新增子部门" onfocus="this.blur();"></span>' +
                            '<span class="iztree button edit" id="diyBtn_edit_' +treeNode.id+ '" title="修改部门" onfocus="this.blur();"></span>'+
                            '<span class="iztree button remove" id="diyBtn_del_' +treeNode.id+ '" title="删除部门" onfocus="this.blur();"></span>';

                    if($('#diyBtn_add_'+treeNode.id).length>0 || $('#diyBtn_edit_'+treeNode.id).length>0 || $('#diyBtn_del_'+treeNode.id).length>0){
                        return
                    }
                    aObj.data('treedata',treeNode);
                    aObj.append(editStr);
                    $('span.iztree.button').off('click').on('click',function(){
                        var curr = $(this),
                            parentTreeData = $(this).parent().data('treedata');
                        if(curr.hasClass('add')){
                            vm.addDept(parentTreeData.id);
                        }else if(curr.hasClass('edit')){
                            vm.editDept(parentTreeData);
                        }else if(curr.hasClass('remove')){
                            vm.showDeleteWin(parentTreeData.id);
                        }
                    });
                }, function (treeId, treeNode) {
                    $('#diyBtn_add_'+treeNode.id).off().remove();
                    $('#diyBtn_edit_' +treeNode.id).off().remove();
                    $('#diyBtn_del_' +treeNode.id).off().remove();
                },function(event,treeId,treeNode){
                    //console.log(treeNode);
                }
            );
        };
    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {}
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            getDeptList();
            cZtree.initSelectZtree('#dept_ztreeCity', cityListData, true, cMthods.getAreaTreeRootKey());
            $('.ui.dropdown').dropdown();
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
