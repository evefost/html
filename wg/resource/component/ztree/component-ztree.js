/**
 * ztree树形组件
 * 基于Jquery Ztree控件
 * ztree复选框,单选按钮的组件树
 */
define(['jquery','jquery.ztree'],function($){
    'use strict';
    var isLinkage = false,
        newCount = 1,
        currentLinkageData = [],
        beforeClickFn = function(treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            zTree.checkNode(treeNode, !treeNode.checked, true, true);
            return false;
        },
        onCheckFn = function(e, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId),
                nodes = zTree.getCheckedNodes(true),
                v = '',
                inputElm = $(e.target).parent().prev().find('input'),
                ids = [],selectItems = [];

            for (var i=0, l=nodes.length; i<l; i++) {
                if(nodes[i].children){
                    continue;
                }
                v += nodes[i].name + ',';
                ids.push(
                    {
                        id:nodes[i].id,
                        pId:nodes[i].pId,
                        name:nodes[i].name,
                        value:nodes[i].value
                    }
                );
                selectItems.push(nodes[i]);
            }
            if (v.length > 0 ){
                v = v.substring(0, v.length-1);
            }
            inputElm.data('select',selectItems).val(v);
            zTree.setting.check.chkStyle == 'radio' && v.length>0 && hideTreeMenu(e);
        },
        onClickFn = function(e, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId),
                nodes = zTree.getSelectedNodes(),
                v = '',
                inputElm = $(e.target).parents('ul#'+treeId).parent().prev().find('input'),
                ids = [],selectItems = [];

            for (var i=0, l=nodes.length; i<l; i++) {
                v += nodes[i].name + ',';
                ids.push(
                    {
                        id:nodes[i].id,
                        pId:nodes[i].pId,
                        name:nodes[i].name,
                        value:nodes[i].value
                    }
                );
                selectItems.push(nodes[i]);
            }
            if (v.length > 0 ){
                v = v.substring(0, v.length-1);
            }
            inputElm.data('select',selectItems).val(v);
            v.length>0 && $(e.target).parents('ul#'+treeId).parent('.ztree-menu').hide();
        },
        inputValueChange = function(itemId,ids){
            var relationTreeId = '',
                treeData = [];


            for(var i=0;i<currentLinkageData.length;i++){
                if(itemId ==currentLinkageData[i].name && currentLinkageData[i].relationTreeId==''){
                    //最后一个无需联动，程序终止
                    return
                }
            }
            //获取联动数据，并初始化tree
            for(var i=0;i<currentLinkageData.length;i++){
                if(currentLinkageData[i].name===itemId){
                    relationTreeId = currentLinkageData[i].relationTreeId;
                    treeData = getTreeDataByPid(ids,relationTreeId,currentLinkageData[i].relationData);
                    //祛除重复名称
                    treeData = nameFilter(treeData);
                    //清空后面所有关联的Tree
                    for(var j=i;j<currentLinkageData.length;j++){
                        initSelectZtree(currentLinkageData[j].relationTreeId,[]);
                    }
                    //初始化关联Tree数据
                    initSelectZtree(relationTreeId,treeData);
                    break;
                }
            }
        },
        /**
         * 获取联动数据
         * @param ids
         * @param treeId
         * @param treeData
         * @returns {Array}
         */
        getTreeDataByPid = function(ids,treeId,treeData){
            var tempTreeData =[],
                allCheckTreeItem = [{"id":0, "pId":0, "parentId":0, "name":"全部", "isNode":true, "open":true}];
            if(ids.length>0){
                for(var i=0;i<treeData.length;i++){
                    for(var j=0;j<ids.length;j++){
                        if(treeData[i].isNode){ //如果是根节点
                            for(var k =0;k<ids.length;k++){
                                if(treeData[i].id == ids[k].pId){
                                    tempTreeData.push(treeData[i]);
                                    break;
                                }
                            }
                            break;
                        }else{
                            if(treeData[i].parentId == ids[j].id){
                                tempTreeData.push(treeData[i]);
                                break;
                            }
                        }
                    }
                }
                if(tempTreeData.length>0){
                    tempTreeData = $.merge(allCheckTreeItem,tempTreeData);
                }
                return tempTreeData;
            }
            return tempTreeData;
        },

        getTreeCheckedIds = function(ztreeId,isChecked){
            var treeObj = $.fn.zTree.getZTreeObj(ztreeId),
                ids = '',
                nodes=treeObj.getCheckedNodes(isChecked);

            for (var i=0, l=nodes.length; i<l; i++) {
                if(nodes[i].children){
                    continue;
                }
                ids += nodes[i].id + ',';
            }
            if (ids.length > 0 ){
                ids = ids.substring(0, ids.length-1);
            }
            return ids;
        },

        getTreeCheckedAttrValues = function(ztreeId,attributeName){
            var treeObj = $.fn.zTree.getZTreeObj(ztreeId),
                attributeCheckedValues = '',
                nodes=treeObj.getCheckedNodes(true);

            for (var i=0, l=nodes.length; i<l; i++) {
                if(nodes[i].children){
                    continue;
                }
                attributeCheckedValues += nodes[i][attributeName] + ',';
            }
            if (attributeCheckedValues.length > 0 ){
                attributeCheckedValues = attributeCheckedValues.substring(0, attributeCheckedValues.length-1);
            }
            return attributeCheckedValues;
        },

        getMenuTreeCheckedAttrValues = function(ztreeId,attributeName){
            var treeObj = $.fn.zTree.getZTreeObj(ztreeId),
                attributeCheckedValues = '',
                nodes=treeObj.getSelectedNodes();

            for (var i=0, l=nodes.length; i<l; i++) {
                if(nodes[i].children){
                    //continue;
                }
                attributeCheckedValues += nodes[i][attributeName] + ',';
            }
            if (attributeCheckedValues.length > 0 ){
                attributeCheckedValues = attributeCheckedValues.substring(0, attributeCheckedValues.length-1);
            }
            return attributeCheckedValues;
        },
        setCheckAllNodeValue = function(zTreeObj,zTreeDom){
            var zTree = zTreeObj,
                nodes = zTree.getCheckedNodes(true),
                v = '';
            for (var i=0, l=nodes.length; i<l; i++) {
                if(nodes[i].children){
                    continue;
                }
                v += nodes[i].name + ',';
            }
            if (v.length > 0 ){
                v = v.substring(0, v.length-1);
            }
            $(zTreeDom).parent().prev().find('input').val(v);
        },
        toggleTreeMenu = function(e){
            var parent = $(e.target).parent();
            if(parent.parent().hasClass('customer-select-ztree')){
                parent.parent().next().css({width:parent.parent().outerWidth()}).toggle(10);
            }else if(parent.hasClass('customer-select-ztree')){
                parent.next().css({width:parent.outerWidth()}).toggle(10);
            }
        },
        hideTreeMenu = function(e){
            if($(e.target).parent('.ztree-menu').length>0){
                $(e.target).parent('.ztree-menu').hide();
            }
        },
        /**
         * 初始化下拉框 tree
         * @param ztreeDom
         * @param ztreeData
         * @param isMultiple 是否支持多选 【多选显示checkbox,否则显示radio】
         * @param dataType 树形控件的自定义key
         */
        initSelectZtree = function(ztreeDom,ztreeData,isMultiple,dataType){
            var setting = {
                check: {
                    enable: true
                },
                view: {
                    dblClickExpand: true,
                    showIcon:false,
                    fontCss : {/*color:'red',fontSize:'16px'*/}
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                        rootPId: 0
                    }
                },
                callback: {
                    beforeClick: beforeClickFn,
                    onCheck: onCheckFn
                }
            };
            if(!isMultiple){
                setting.check.chkStyle = "radio";
                setting.check.radioType = "all";
            }
            if(dataType){
                setting.data.simpleData = $.extend(true, setting.data.simpleData,dataType);
            }
            var treeObj = $.fn.zTree.init($(ztreeDom), setting, ztreeData);
            //treeObj.checkAllNodes(true);
            //选中所有
            setCheckAllNodeValue(treeObj,ztreeDom);
            $(ztreeDom).parent().prev().off('click',toggleTreeMenu);
            //ztreeData.length>0 &&
            $(ztreeDom).parent().prev().on('click',toggleTreeMenu);
            treeObj.expandAll(true);
        },
        initSelectMenuTree = function(ztreeDom,ztreeData,dataType){
            var setting = {
                view: {
                    dblClickExpand: false,
                    selectedMulti:false,
                    showIcon: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: onClickFn
                }
            };
            if(dataType){
                setting.data.simpleData = $.extend(true, setting.data.simpleData,dataType);
            }
            var treeObj = $.fn.zTree.init($(ztreeDom), setting, ztreeData);
            $(ztreeDom).parent().prev().off('click',toggleTreeMenu);
            $(ztreeDom).parent().prev().on('click',toggleTreeMenu);
            treeObj.expandAll(true);
        },
        initLinkageZtree = function(linkageData){
            if(linkageData && linkageData.length>0){
                initSelectZtree(linkageData[0].treeId,linkageData[0].data);
                isLinkage = true;
                currentLinkageData = linkageData;
            }
        },
        initZtree = function(ztreeDom,ztreeData){
            var setting = {
                check: {
                    enable: true
                },
                view: {
                    dblClickExpand: true,
                    showIcon:true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick: beforeClickFn,
                    onCheck: onCheckFn
                }
            },treeObj;
            treeObj = $.fn.zTree.init($(ztreeDom), setting, ztreeData)
            treeObj.expandAll(true);
            return treeObj;
        },
        initEditZtree = function (ztreeDom,ztreeData,addHoverCallback,removeHoverCallback,clickCallback) {
            var setting = {
                view: {
                    addHoverDom: function(treeId, treeNode) {
                        addHoverCallback && addHoverCallback(treeId, treeNode);
                    },
                    removeHoverDom: function(treeId, treeNode) {
                        removeHoverCallback && removeHoverCallback(treeId, treeNode);
                    },
                    selectedMulti: false,
                    showIcon:true
                },
                callback:{
                    onClick:clickCallback
                },
                check: {
                    enable: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                edit: {
                    enable: false
                }
            },treeObj;
            treeObj = $.fn.zTree.init($(ztreeDom), setting, ztreeData)
            treeObj.expandAll(true);
            return treeObj;
        },
        hideAllTreeMenu = function(){
            $(document).on('mousedown', function (e) {
                if ($(e.target).closest('.ztree-menu').length === 0) {
                    $('.ztree-menu').hide();
                }
            });
        },

        /**
         * 根据名称name选中Tree节点
         * @param nameArray ['name1','name2']
         * @param ztreeObj
         */
        selectTreeNodeByNames = function(nameArray,ztreeId){
            var treeObj = $.fn.zTree.getZTreeObj(ztreeId),
                nodesArray = treeObj.transformToArray(treeObj.getNodes());

            //取消全部选中
            treeObj.checkAllNodes(false);
            for(var i=0;i<nameArray.length;i++){
                for(var j=0;j<nodesArray.length;j++){
                    if(nodesArray[j].name == nameArray[i]){
                        treeObj.checkNode(nodesArray[j], true, true, true);
                    }
                }
            }
        },
        /**
         * 通过ztree的属性名称和属性值的字符串选中相应的节点
         * @param ztreeId
         * @param attributeName
         * @param attributeValues
         */
        selectTreeNodeByAttributeValues = function(ztreeId,attributeName,attributeValues){
            var treeObj = $.fn.zTree.getZTreeObj(ztreeId),
                nodesArray = treeObj.transformToArray(treeObj.getNodes()),
                attributeValueArray = attributeValues.split(',');

            //取消全部选中
            treeObj.checkAllNodes(false);

            for(var i=0;i<attributeValueArray.length;i++){
                for(var j=0;j<nodesArray.length;j++){
                    if(nodesArray[j][attributeName] == attributeValueArray[i]){
                        treeObj.checkNode(nodesArray[j], true, true, true);
                    }
                }
            }
        },
        /**
         * 通过ztree的属性名称和属性值的字符串选中相应的节点
         * @param ztreeId
         * @param attributeName
         * @param attributeValues
         */
        selectMenuTreeNodeByAttributeValues = function(ztreeId,attributeName,attributeValues){
            var treeObj = $.fn.zTree.getZTreeObj(ztreeId),
                nodesArray = treeObj.transformToArray(treeObj.getNodes()),
                attributeValueArray = attributeValues.split(','),
                selectNodeNames = [];

            //取消全部选中
            treeObj.cancelSelectedNode();
            for(var i=0;i<attributeValueArray.length;i++){
                for(var j=0;j<nodesArray.length;j++){
                    if(nodesArray[j][attributeName] == attributeValueArray[i]){
                        treeObj.selectNode(nodesArray[j],true,true);
                        selectNodeNames.push(nodesArray[j].name);
                    }
                }
            }
            $('#'+ztreeId).parent().prev().find('input').val(selectNodeNames.join(','));
        },
        /**
         * 根据名称values选中Tree节点
         * @param nameArray ['value1','value2']
         * @param ztreeObj
         */
        selectTreeNodeByValues = function(valueArray,ztreeId){
            var treeObj = $.fn.zTree.getZTreeObj(ztreeId),
                nodesArray = treeObj.transformToArray(treeObj.getNodes());

            //取消全部选中
            treeObj.checkAllNodes(false);
            for(var i=0;i<valueArray.length;i++){
                for(var j=0;j<nodesArray.length;j++){
                    if(nodesArray[j].value == valueArray[i]){
                        treeObj.checkNode(nodesArray[j], true, true, true);
                    }
                }
            }
        },
        /**
         * 去除相同name的节点
         * @param data
         * @returns {Array}
         */
        nameFilter = function (data) {
            var tempData = [],isMutil = false;
            for(var i =0;i<data.length;i++){
                isMutil = false;
                for(var j=0;j<tempData.length;j++){
                    if(tempData[j].name == data[i].name){
                        isMutil = true;
                        break;
                    }
                }
                if(!isMutil){
                    tempData.push(data[i]);
                }
            }
            return tempData;
        }


    return {
        /**
         * 文本框下拉树
         * 支持单选和多选
         * @param ztreeDom
         * @param ztreeData
         * @param isMultiple 是否多选，多选状态下是复选框，否则是单选框组件
         * @param dataType 树形控件的自定义key
         */
        initSelectZtree : function(ztreeDom,ztreeData,isMultiple,dataType){
            initSelectZtree(ztreeDom,ztreeData,isMultiple,dataType);
            hideAllTreeMenu();
        },
        /**
         * 文本框下拉菜单树
         * @param ztreeDom
         * @param ztreeData
         * @param dataType 树形控件的自定义key
         */
        initSelectMenuTree : function(ztreeDom,ztreeData,dataType){
            initSelectMenuTree(ztreeDom,ztreeData,dataType);
            hideAllTreeMenu();
        },
        /**
         * 联动树
         * @param linkageData
         */
        initLinkageZtree : function (linkageData) {
            initLinkageZtree(linkageData);
            hideAllTreeMenu();
        },
        initZtree: function (ztreeDom,ztreeData) {
            return initZtree(ztreeDom,ztreeData);
        },
        getTreeCheckedIds:function(ztreeId,isChecked){
            return getTreeCheckedIds(ztreeId,isChecked);
        },
        /**
         * 获取选中后的属性名称值
         * 返回结果字符串使用逗号隔开 'a,b,c'
         * @param ztreeId
         * @param attrName
         */
        getTreeCheckedAttrValues:function(ztreeId,attrName){
            return getTreeCheckedAttrValues(ztreeId,attrName);
        },
        getMenuTreeCheckedAttrValues:function(ztreeId,attrName){
            return getMenuTreeCheckedAttrValues(ztreeId,attrName);
        },
        /**
         * 根据名称name选中Tree节点
         * @param stringArray 'a,b,c,d'
         * @param ztreeId
         */
        selectTreeNodeByAttributeValues:function(ztreeId,attributeName,attributeValues){
            return selectTreeNodeByAttributeValues(ztreeId,attributeName,attributeValues);
        },
        /**
         * 根据名称name选中Tree节点
         * @param stringArray 'a,b,c,d'
         * @param ztreeId
         */
        selectMenuTreeNodeByAttributeValues:function(ztreeId,attributeName,attributeValues){
            return selectMenuTreeNodeByAttributeValues(ztreeId,attributeName,attributeValues);
        },
        /**
         * 根据名称name选中Tree节点
         * @param nameArray['name1','name2']
         * @param ztreeId
         */
        selectTreeNodeByNames:function(nameArray,ztreeId){
            return selectTreeNodeByNames(nameArray,ztreeId);
        },
        /**
         * 根据名称value选中Tree节点
         * @param valueArray['value1','value2']
         * @param ztreeId
         */
        selectTreeNodeByValues:function(valueArray,ztreeId){
            return selectTreeNodeByValues(valueArray,ztreeId);
        },
        /**
         * 操作编辑树
         * @param ztreeDom
         * @param ztreeData
         * @param callback
         */
        initEditTree:function(ztreeDom,ztreeData,addHoverCallback,removeHoverCallback,clickCallback){
            return initEditZtree(ztreeDom,ztreeData,addHoverCallback,removeHoverCallback,clickCallback)
        }
    }
});