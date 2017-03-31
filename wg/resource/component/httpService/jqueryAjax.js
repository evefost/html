/**
 * Created by xuesong xu on 2016/2/16.
 * 基于jQuery的Ajax操作组件封装
 * 依赖项目中common模块处理异常
 */
define(['jquery', 'appPath/common/commonMethods'], function ($, cMethods) {
    var errorStatusMessage = [
            {
                status: '400',
                message: '客户端接请求出现语法错误，请联系管理员处理！'
            },
            {
                status: '404',
                message: '服务端接口网络断开，请检查网络环境是否正常！'
            },
            {
                status: '403',
                message: '服务端接口拒绝访问，请检查是否有该操作权限！'
            },
            {
                status: '413',
                message: '请求的文档的大小超过服务端处理上限，伦家处理不了啦！'
            },
            {
                status: '500',
                message: '服务端接口内部异常，请联系管理员处理！'
            },
            {
                status: '504',
                message: '服务端接口请求超时，请联系管理员处理！'
            }
        ],

        /**
         * 处理常见Http状态码异常
         * @param status
         * @returns {*}
         */
        handlerErrorCase = function (status) {
            var errormessage = errorStatusMessage, isHandler = false;
            for (var i = 0, len = errormessage.length; i < len; i++) {
                if (status == errormessage[i].status) {
                    isHandler = true;
                    return errormessage[i];
                }
            }
            if (!isHandler) {
                return {
                    status: status,
                    message: '异常很诡异，臣妾处理不了，请火速联络超级管理员！错误码：' + status
                }
            }
        },
        ajaxUploadForm = function (url, formData, successCallback, errorCallBack) {
            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                async: true,
                cache: true,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.status == 200) {
                        successCallback && successCallback(response, 'success', true);
                    } else if (response.status == 510) {
                        cMethods.sessionOut();
                    } else {
                        successCallback && successCallback(response, 'warning', false);
                    }
                },
                error: function (response) {
                    errorCallBack && errorCallBack(handlerErrorCase(response.status), 'error', false);
                }
            });
        },
        post = function (url, params, successCallback, errorCallBack) {
            $.post(url, params)
                .success(function (response) {
                    if (response.status == 200) {
                        successCallback && successCallback(response, 'success', true);
                    } else if (response.status == 510) {
                        cMethods.sessionOut();
                    } else {
                        successCallback && successCallback(response, 'warning', false);
                    }
                })
                .error(function (response) {
                    errorCallBack && errorCallBack(handlerErrorCase(response.status), 'error', false);
                });
        },
        get = function (url, params, successCallback, errorCallBack) {
            $.get(url, params)
                .success(function (response) {
                    if (response.status == 200) {
                        successCallback && successCallback(response, 'success', true);
                    } else if (response.status == 510) {
                        cMethods.sessionOut();
                    } else {
                        successCallback && successCallback(response, 'warning', false);
                    }
                })
                .error(function (response) {
                    errorCallBack && errorCallBack(handlerErrorCase(response.status), 'error', false);
                });
        },
        postJson = function (url, params, successCallback, errorCallBack) {
            //$.post(url, params)
            $.post({
                    url: url,
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=uft-8',
                    dataType: 'json'
                })
                .success(function (response) {
                    if (response.status == 200) {
                        successCallback && successCallback(response, 'success', true);
                    } else if (response.status == 510) {
                        cMethods.sessionOut();
                    } else {
                        successCallback && successCallback(response, 'warning', false);
                    }
                })
                .error(function (response) {
                    errorCallBack && errorCallBack(handlerErrorCase(response.status), 'error', false);
                });
        };

    return {
        /**
         * 封装Ajax POST请求
         * @param url 请求地址
         * @param params 请求附带参数【可选】
         * @param sFn 成功后的回调【可选】
         * @param eFn 失败后的回调【可选】
         */
        post: function (url, params, sFn, eFn) {
            post(url, params, sFn, eFn);
        },
        /**
         * 封装Ajax POST请求,改变post请求头content-type为json
         * @param url 请求地址
         * @param params 请求附带参数【可选】
         * @param sFn 成功后的回调【可选】
         * @param eFn 失败后的回调【可选】
         */
        postJson: function (url, params, sFn, eFn) {
            postJson(url, params, sFn, eFn);
        },
        /**
         * 封装Ajax GET请求
         * @param url 请求地址
         * @param params 请求附带参数【可选】
         * @param sFn 成功后的回调【可选】
         * @param eFn 失败后的回调【可选】
         */
        get: function (url, params, sFn, eFn) {
            get(url, params, sFn, eFn);
        },
        /**
         * 封装Ajax Upload上传文件请求
         * @param url 请求地址
         * @param formData 表单数据
         * @param successCallback
         * @param errorCallBack
         */
        ajaxUploadForm: function (url, formData, sFn, eFn) {
            ajaxUploadForm(url, formData, sFn, eFn)
        }
    }
});