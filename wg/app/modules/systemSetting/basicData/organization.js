/**
 * 部门管理
 */
define([
    'component-message',
    'jqueryAjax',
    'component-ztree',
    'appPath/common/commonMethods',
], function (cMessage, jqueryAjax, cZtree, cMthods) {
    var deptListData,
        defaultData = function () {
            return {
                id: '',
                departmentNumber: '',
                departmentName: '',
                departmentType: '',
                parentId: 0,
                level: 1,
                departmentType: '',  //FUNCTIONS
                departmentTel: '',
                departmentEmail: '',
                departmentAddress:'',
                sorted: '0',
                description: '',
            }
        },
        vm = avalon.define({
            $id: 'dept',
            isEdit:false,
			curOpt:'',
            deptName:'',
            dept:defaultData(),
            addDept:function (id, departmentType) {
                vm.isEdit =  false;
                vm.dept = defaultData();
                vm.dept.parentId = id;
				vm.curOpt = 'add';
                if(departmentType==='CYQYFWZX') vm.dept.departmentType='JYB';  //如果为 服务产业中心，则下级部门类别默认为 JYB
                setTimeout(function () {
                    //$('.ui.dropdown').dropdown();
                    cZtree.selectMenuTreeNodeByAttributeValues('deptSelectZtree', 'id', id+'');
                },200);
            },
            editDept:function (treedata, view) {
                vm.isEdit =  true;
				vm.curOpt = 'edit';
				if(view=='view') vm.curOpt='view';
                treedata.areaName = '';
                vm.dept = treedata;
                setTimeout(function () {
                    //$('.ui.dropdown').dropdown();
                    cZtree.selectMenuTreeNodeByAttributeValues('deptSelectZtree', 'id', treedata.parentId+'');
                },200);
            },
            saveOrUpdateDept:function () {
                var url = window.currentApiUrl.systemSet.basic.deptAdd,pId,pDepartmentType;
                if(vm.isEdit){
                    url = window.currentApiUrl.systemSet.basic.deptEdit;
                }
                if (vm.dept.departmentName == '') {
                    cMessage.showPopup({className: 'warning', content: '部门名称不能为空'});
                    return false;
                }
                pId = cZtree.getMenuTreeCheckedAttrValues('deptSelectZtree', 'id');
                pDepartmentType = cZtree.getMenuTreeCheckedAttrValues('deptSelectZtree', 'departmentType');
                if(pDepartmentType === 'JYB') {  //经营部没有子部门
                    cMessage.showPopup({className: 'warning', content: '该部门没有子部门,请重新选择！'});
                    return false;
                }else if(pDepartmentType==='CYQYFWZX'){
                    vm.dept.departmentType='JYB';
                }else{
                    vm.dept.departmentType='';
                }

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
                            window.currentApiUrl.systemSet.basic.deptDel,
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
                window.currentApiUrl.systemSet.basic.deptList,
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
                    if(treeNode.departmentType==='JYB'){
                        editStr = '<span class="iztree button edit" id="diyBtn_edit_' +treeNode.id+ '" title="修改部门" onfocus="this.blur();"></span>'+
                        '<span class="iztree button remove" id="diyBtn_del_' +treeNode.id+ '" title="删除部门" onfocus="this.blur();"></span>';
                    }

                    if($('#diyBtn_add_'+treeNode.id).length>0 || $('#diyBtn_edit_'+treeNode.id).length>0 || $('#diyBtn_del_'+treeNode.id).length>0){
                        return
                    }
                    aObj.data('treedata',treeNode);
                    aObj.append(editStr);
                    $('span.iztree.button').off('click').on('click',function(e){
                        var curr = $(this),
                            parentTreeData = $(this).parent().data('treedata');
                        if(curr.hasClass('add')){
                            vm.addDept(parentTreeData.id, parentTreeData.departmentType);
                        }else if(curr.hasClass('edit')){
                            vm.editDept(parentTreeData);
                        }else if(curr.hasClass('remove')){
                            vm.showDeleteWin(parentTreeData.id);
                        }
						e.stopPropagation();
                    });
                }, function (treeId, treeNode) {
                    $('#diyBtn_add_'+treeNode.id).off().remove();
                    $('#diyBtn_edit_' +treeNode.id).off().remove();
                    $('#diyBtn_del_' +treeNode.id).off().remove();
                },function(event,treeId,treeNode){
                    vm.editDept(treeNode,'view');
                }
            );
        };
    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {}
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            getDeptList();
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
