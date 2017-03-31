/**
 * Created by Administrator on 2016/1/27.
 * 公共方法库
 */
define(['jquery', 'component-message'], function ($, cMessage) {
    var getRoleData = function () {
            var data = localStorage.getItem('rolesData_wg');
            if (data && data != '') {
                return JSON.parse(data);
            } else {
                return [];
            }
        },
        getItemByAttr = function (attr, list) {
            var item = '';
            if (list && list.length > 0) {
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i][attr.key] == attr.value) {
                        item = list[i];
                        break;
                    }
                }
            }
            return item;
        },
        getItemsByAttr = function (attr, list) {
            var items = [], valueList = attr.value.split(',');
            if (list && list.length > 0) {
                for (var i = 0, len = list.length; i < len; i++) {
                    for (var j = 0; j < valueList.length; j++) {
                        if (list[i][attr.key] == valueList[j]) {
                            items.push(list[i]);
                            break;
                        }
                    }
                }
            }
            return items;
        },
        getAreaNameByCode = function (areaCode, data) {
            var areaList = data;
            for (var i = 0, len = areaList.length; i < len; i++) {
                if (areaList[i].areaCode == areaCode) {
                    return areaList[i].name;
                }
            }
            return '';
        },
        getAreaCodeByName = function (areaName, data) {
            var areaList = data;
            for (var i = 0, len = areaList.length; i < len; i++) {
                if (areaList[i].name == areaName) {
                    return areaList[i].areaCode;
                }
            }
            return '';
        },
    /*getAreaDataListByLevel = function (level,data) {
     var areaList =[],tempList = [];
     areaList =  data;
     for(var i= 0,len=areaList.length;i<len;i++){
     if(areaList[i].level < level){
     tempList.push(areaList[i]);
     }
     }
     return tempList;
     },*/
        getAreaDataListByLevel = function (level, data) {
            var areaList = [], tempList = [];
            areaList = data;
            for (var i = 0, len = areaList.length; i < len; i++) {
                if (areaList[i].level == level) {
                    tempList.push(areaList[i]);
                }
            }
            return tempList;
        },
        getParentTreeDataByAttr = function (attr, list) {
            var item = '';
            if (list && list.length > 0) {
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i][attr.key] == attr.value) {
                        item = list[i];
                        break;
                    }
                }
            }
            return item;
        },
        /**
         * 获取自定义Ztree ID,PID属性
         * @returns {{idKey: string, pIdKey: string, rootPId: number}}
         */
        getAreaTreeRootKey = function () {
            return {
                idKey: "areaCode",
                pIdKey: "upAreaCode",
                rootPId: 0
            }
        },
        /**
         * 处理会话过期
         */
        sessionOut = function () {
            cMessage.showAlert({
                content: '登录已超时，请退出重新登录！common',
                isShowOkBtn: true,
                isShowCancelBtn: false,
                okText: '确定',
                onOk: function () {
                    localStorage.removeItem('rolesData_wg');
                    window.location.href = window.currentApiUrl.loginOut;
                }
            });
        },
        /**
         * 显示popup消息
         * @param msgType
         * @param message
         */
        showPopupMessage = function (msgType, message) {
            cMessage.showPopup({
                className: msgType,
                content: message
            });
        },
        /**
         * 自定义枚举字符串与中文替换
         * @param str
         * @param type
         * @returns {string}
         */
        myFilter = function (str, type) {//str为管道符之前计算得到的结果，默认框架会帮你传入，此方法必须返回一个值
            var filterResult = '', temp = [],
                commonData = getRoleData().roleCommonData,
                cityListData = commonData.cityList,
            //工单
                launchTypeData = commonData.launchTypeList,
                handleResultData = commonData.handleResultList,
                memberNatureData = commonData.memberNature,
                memberShipData = commonData.memberShip,
                launchTypeData = commonData.launchTypeList,
                subscribeTypeData = commonData.subscribeTypeList,
                surveyStatusData = commonData.surveyStatus,
                lookStatusData = commonData.lookStatus,
                handleResultData = commonData.handleResultList,
            //房源
                houseDecorationData = commonData.houseDecoration;

            switch (type) {
                case 'areaCode':
                    filterResult = getItemByAttr({key: 'areaCode', value: str}, cityListData)['name']
                    break;
                case 'memberShip':
                    if (str.length > 0) {
                        temp = str.split(',');
                        for (var i = 0; i < temp.length; i++) {
                            filterResult += getItemByAttr({key: 'value', value: temp[i]}, memberShipData)['name'] + ','
                        }
                        filterResult = filterResult.substring(0, filterResult.length - 1);
                    } else {
                        filterResult = str;
                    }
                    break;
                case 'memberNature':
                    filterResult = getItemByAttr({key: 'value', value: str}, memberNatureData)['name']
                    break;
                case 'launchType':
                    filterResult = getItemByAttr({key: 'value', value: str}, launchTypeData)['name']
                    break;
                case 'subscribeType':
                    filterResult = getItemByAttr({key: 'value', value: str}, subscribeTypeData)['name']
                    break;
                case 'surveyStatus':
                    filterResult = getItemByAttr({key: 'value', value: str}, surveyStatusData)['name']
                    break;
                case 'lookStatus':
                    filterResult = getItemByAttr({key: 'value', value: str}, lookStatusData)['name']
                    break;
                case 'handleResult':
                    filterResult = getItemByAttr({key: 'value', value: str}, handleResultData)['name']
                    break;
                case 'decorationCode':
                    filterResult = getItemByAttr({
                        key: 'decorationCode',
                        value: str
                    }, houseDecorationData)['decorationName']
                    break;
            }
            return filterResult;
        },
        getFormattedDate = function (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            var fullYear = date.getFullYear(),

                fullMonth = (date.getMonth() + 1).toString().replace(/.*/, function (word) {
                    return word.length > 1 ? word : '0' + word;
                }),

                fullDay = date.getDate().toString().replace(/.*/, function (word) {
                    return word.length > 1 ? word : '0' + word;
                }),

                fullHour = date.getHours().toString().replace(/.*/, function (word) {
                    return word.length > 1 ? word : '0' + word;
                }),

                fullMinite = date.getMinutes().toString().replace(/.*/, function (word) {
                    return word.length > 1 ? word : '0' + word;
                }),

                fullSecond = date.getSeconds().toString().replace(/.*/, function (word) {
                    return word.length > 1 ? word : '0' + word;
                });

            return [fullYear, fullMonth, fullDay].join('-') + ' ' + [fullHour, fullMinite].join(':')
        },
        validatePhone = function (str) {
            var pattern = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|70)\d{8}$/;
            return pattern.test(str);
        },
        validateEmail = function (str) {
            var pattern = /^\b(\w[-.\w]*\@[-a-z0-9]+(\.[-a-z0-9]+)*\.(com|edu|info|cn))\b$/;
            return pattern.test(str);
        },
        validateIDcard = function (str) {
            var pattern = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
            return pattern.test(str);
        },
        /**
         * param 将要转为URL参数字符串的对象
         * key URL参数字符串的前缀
         * encode true/false 是否进行URL编码,默认为true
         * return URL参数字符串
         *
         var obj={name:'tom','class':{className:'class1'},classMates:[{name:'lily'}]};
         console.log(urlEncode(obj));
         //output: &name=tom&class.className=class1&classMates[0].name=lily
         console.log(urlEncode(obj,'stu'));
         //output: &stu.name=tom&stu.class.className=class1&stu.classMates[0].name=lily
         */
        urlEncode = function (param, key, encode) {
            if (param == null) return '';
            var paramStr = '';
            var t = typeof (param);
            if (t == 'string' || t == 'number' || t == 'boolean') {
                paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
            } else {
                for (var i in param) {
                    var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                    paramStr += urlEncode(param[i], k, encode);
                }
            }
            return paramStr;
        },
        /**
         * 文件下载
         * @param url
         * @param paramObj
         */
        downloadFile = function (url, paramObj) {
            var urlParams = urlEncode(paramObj),
                link = document.createElement("a");
            //link.download='新文件名.xxx';
            //link.download = name;
            urlParams = urlParams.length > 0 ? '?' + urlParams.substr(1, urlParams.length) : '';
            link.href = url + urlParams;
            link.addEventListener('click', function() {
                document.location = link.href;
            });
            link.click();
        },
        /**
         * 根据复选框的值选中复选框
         * @param allCheckboxEl
         * @param ids
         */
        selectCheckboxByValues = function (allCheckboxEl, values) {
            var tempArray = [],
                allCheckBoxs = allCheckboxEl;
            allCheckBoxs.each(function () {
                $(this).prop('checked', false);
            });
            if (values && values.length > 0) {
                tempArray = values.split(',');
                for (var i = 0, lenI = allCheckBoxs.length; i < lenI; i++) {
                    for (var j = 0, lenJ = tempArray.length; j < lenJ; j++) {
                        if (allCheckBoxs[i].value == tempArray[j]) {
                            $(allCheckBoxs[i]).prop('checked', true);
                            break;
                        }
                    }
                }
            }
        },
        /**
         *获取选中复选框的值
         * @param allCheckedboxEl
         * @returns '1,m,n' 结果用逗号隔开
         */
        getSelectedCheckboxValues = function (allCheckedboxEl) {
            var selectedCheckBox = allCheckedboxEl,
                selectedValues = [];
            selectedCheckBox.each(function () {
                selectedValues.push(this.value);
            });
            return selectedValues.length>0 ? selectedValues.join(','):'';
        };

    return {
        getAreaTreeRootKey: getAreaTreeRootKey,
        getRoleData: getRoleData,
        /**
         * 通过list数据集合中的属性筛选出某一项
         * @param list
         * @param attr{key:'属性名称',value:'属性值'}
         */
        getItemByAttrFromItems: function (attr, list) {
            return getItemByAttr(attr, list);
        },
        /**
         * 通过list数据集合中的属性筛选出对应集合列表
         * @param attr attr.value也可以有多个，需要用逗号隔开的字符串
         * @param list
         */
        getItemsByAttrFromItems: function (attr, list) {
            return getItemsByAttr(attr, list);
        },
        /**
         * 根据区域名称获取区域code
         * @param areaName
         * @param data
         */
        getAreaCodeByName: function (areaName, data) {
            return getAreaCodeByName(areaName, data);
        },
        /**
         * 根据区域code获取区域名称
         * @param areaCode
         * @param data
         */
        getAreaNameByCode: function (areaCode, data) {
            return getAreaNameByCode(areaCode, data);
        },
        /**
         * 根据区域等级获取当前区域的所有上级区域集合
         * @param level
         * @param data
         */
        getUpAreaDataListByLevel: function (level, data) {
            return getAreaDataListByLevel(level, data);
        },
        /**
         * 会话过期
         */
        sessionOut: sessionOut,
        /**
         * 显示popup消息
         * @param msgType
         * @param message
         */
        showPopupMessage: function (msgType, message) {
            showPopupMessage(msgType, message);
        },
        /**
         * 自定义替换枚举
         * @param strValue
         * @param type
         */
        myFilter: function (strValue, type) {
            return myFilter(strValue, type);
        },
        /**
         * 格式化日期时间
         */
        getFormattedDate: function (date) {
            return getFormattedDate(date)
        },
        /**
         * 获取所有城市列表
         */
        getCityList: function () {
            return getAreaDataListByLevel(2, getRoleData().roleCommonData.areaList);
        },
        /**
         * 获取所有区域列表
         */
        getAreaList: function () {
            return getAreaDataListByLevel(3, getRoleData().roleCommonData.areaList);
        },
        /**
         * 验证手机号码
         */
        validatePhone: function (data) {
            return validatePhone(data);
        },
        /**
         * 验证Email
         */
        validateEmail: function (data) {
            return validateEmail(data);
        },
        /**
         * 验证身份证号码
         * @param str
         */
        validateIDcard:function (str) {
            return validateIDcard(str);
        },
        /**
         * 文件下载
         * @param url
         * @param paramObj url后面附带参数对象
         */
        downloadFile: function (url, paramObj) {
            downloadFile(url, paramObj);
        },
        /**
         * 根据复选框的值选中复选框
         * @param allCheckboxEl
         * @param ids
         */
        selectCheckboxByValues: function (allCheckboxEl, values) {
            selectCheckboxByValues(allCheckboxEl, values);
        },
        /**
         * 获取选中复选框的值
         * @param allCheckedboxEl
         * @returns '1,m,n' 结果用逗号隔开
         */
        getSelectedCheckboxValues: function (allCheckedboxEl) {
            return getSelectedCheckboxValues(allCheckedboxEl);
        }
}
})
