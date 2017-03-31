/**
 * 基于webuploader 文件上传组件
 */

/**
 * HTML模板
 <div class="container">
 <div class="uploader">
 <div class="queueList">
 <div class="dndArea placeholder">
 <div class="filePicker"></div>
 <p>或将照片拖到这里，单次最多可选300张</p>
 </div>
 </div>
 <div class="statusBar" style="display:none;">
 <div class="progress">
 <span class="text">0%</span>
 <span class="percentage"></span>
 </div>
 <div class="info"></div>
 <div class="btns">
 <div class ="filePicker2"></div><div class="uploadBtn">开始上传</div>
 </div>
 </div>
 </div>
 </div>
 */
define(['jquery.webuploader'], function (WebUploader) {

    function initPicWeight(options) {
        var fileNumLimit = options['fileNumLimit'] || 300,
            fileSizeLimit = options['fileSizeLimit'] || 200,    // 200 M
            fileSingleSizeLimit = options['fileSingleSizeLimit'] || 50,    // 50 M
            containerHtml = '<div class="wrapper" class="ui container fluid">' +
                '<div class="container">' +
                '<div class="uploader">' +
                '<div class="queueList">' +
                '<div class="dndArea placeholder">' +
                '<div class="filePicker"></div>' +
                '<p>或将文件拖到这里，最多允许上传'+fileNumLimit+'个，单个文件最大限制为:'+fileSingleSizeLimit+'MB，总文件上传大小限制为:'+fileSizeLimit+'MB</p>' +
                '</div>' +
                '</div>' +
                '<div class="statusBar" style="display:none;">' +
                '<div class="progress">' +
                '<span class="text">0%</span>' +
                '<span class="percentage"></span>' +
                '</div>' +
                '<div class="info"></div>' +
                '<div class="btns">' +
                '<div class ="filePicker2"></div><div class="uploadBtn">开始上传</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            parent = $(options.container).html(containerHtml),
            $wrap = $(options.container + ' .uploader'),
        // 图片容器
            $queue = $('<ul class="filelist"></ul>').appendTo($wrap.find('.queueList')),

        // 状态栏，包括进度和控制按钮
            $statusBar = $wrap.find('.statusBar'),

        // 文件总体选择信息。
            $info = $statusBar.find('.info'),

        // 上传按钮
            $upload = $wrap.find('.uploadBtn'),

        // 没选择文件之前的内容。
            $placeHolder = $wrap.find('.placeholder'),

            $progress = $statusBar.find('.progress').hide(),

        // 添加的文件数量
            fileCount = 0,

        // 添加的文件总大小
            fileSize = 0,

        // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,

        // 缩略图大小
            thumbnailWidth = 110 * ratio,
            thumbnailHeight = 110 * ratio,

        // 可能有pedding, ready, uploading, confirm, done.
            state = 'pedding',

        // 所有文件的进度信息，key为file id
            percentages = {},

            supportTransition = (function () {
                var s = document.createElement('p').style,
                    r = 'transition' in s ||
                        'WebkitTransition' in s ||
                        'MozTransition' in s ||
                        'msTransition' in s ||
                        'OTransition' in s;
                s = null;
                return r;
            })(),
        //回调函数的返回结果
            callbackResult = [],
        // WebUploader实例
            uploader;

        // 实例化
        uploader = WebUploader.create({
            pick: {
                id: options.container + ' .filePicker',
                innerHTML: '点击选择文件',
                multiple : options['multiple']==undefined ? true : options['multiple']
            },
            dnd: options.container + ' .dndArea',
            paste: options.container + ' .uploader',
            chunked: false, //是否要分片处理大文件上传。
            runtimeOrder: 'html5',
            sendAsBinary: false, //是否已二进制的流的方式发送文件
            server : options.url ? options.url :'testData/uploadFile.json',
            formData : options['params'],
            // server: 'http://liaoxuezhi.fe.baidu.com/webupload/fileupload.php',
            // server: 'http://www.2betop.net/fileupload.php',
            fileNumLimit: fileNumLimit,
            fileSizeLimit: fileSizeLimit * 1024 * 1024,    // 200 M
            fileSingleSizeLimit: fileSingleSizeLimit * 1024 * 1024,    // 50 M,
            accept:options['accept']
        });
        updateTotalProgress();

        // 添加“添加文件”的按钮，

        if(options['multiple'] == undefined || options['multiple']){
            uploader.addButton({
                id: '.filePicker2',
                label: '继续添加'
            });
        }
        /**
         * 重置点击上传按钮位置
         * js bug
         */
        function setPickPosition(){
            var pick = $(options.container+' .webuploader-pick'),
                pickClickDom = pick.next('div');

            pickClickDom.css({
                left:pick.parent().width()/2-pick.outerWidth()/2,
                top:20,
                width:pick.outerWidth(),
                height:pick.outerHeight()
            });
        }
        // 当有文件添加进来时执行，负责view的创建
        function addFile(file) {
            var $li = $('<li class="' + file.id + '">' +
                    '<p class="title">' + file.name + '</p>' +
                    '<p class="imgWrap"></p>' +
                    '<p class="progress"><span></span></p>' +
                    '</li>'),

                $btns = $('<div class="file-panel">' +
                    '<span class="cancel">删除</span>' +
                    '<span class="rotateRight">向右旋转</span>' +
                    '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
                $prgress = $li.find('p.progress span'),
                $imgWrap = $li.find('p.imgWrap'),
                $info = $('<p class="error"></p>'),

                showError = function (code) {
                    switch (code) {
                        case 'exceed_size':
                            text = '文件大小超出';
                            break;

                        case 'interrupt':
                            text = '上传暂停';
                            break;

                        default:
                            text = '上传失败，请重试';
                            break;
                    }
                    $info.text(text).appendTo($li);
                    options['error'] && options['error']();
                };

            if (file.getStatus() === 'invalid') {
                showError(file.statusText);
            } else {
                // @todo lazyload
                $imgWrap.text('预览中');
                uploader.makeThumb(file, function (error, src) {
                    if (error) {
                        $imgWrap.text('不能预览');
                        return;
                    }

                    var img = $('<img src="' + src + '">');
                    $imgWrap.empty().append(img);
                }, thumbnailWidth, thumbnailHeight);

                percentages[file.id] = [file.size, 0];
                file.rotation = 0;
            }

            file.on('statuschange', function (cur, prev) {
                if (prev === 'progress') {
                    $prgress.hide().width(0);
                } else if (prev === 'queued') {
                    $li.off('mouseenter mouseleave');
                    $btns.remove();
                }

                // 成功
                if (cur === 'error' || cur === 'invalid') {
                    showError(file.statusText);
                    percentages[file.id][1] = 1;
                } else if (cur === 'interrupt') {
                    showError('interrupt');
                } else if (cur === 'queued') {
                    percentages[file.id][1] = 0;
                } else if (cur === 'progress') {
                    $info.remove();
                    $prgress.css('display', 'block');
                } else if (cur === 'complete') {
                    $li.append('<span class="success"></span>');
                }

                $li.removeClass('state-' + prev).addClass('state-' + cur);
            });

            $li.on('mouseenter', function () {
                $btns.stop().animate({height: 30});
            });

            $li.on('mouseleave', function () {
                $btns.stop().animate({height: 0});
            });

            $btns.on('click', 'span', function () {
                var index = $(this).index(),
                    deg;

                switch (index) {
                    case 0:
                        uploader.removeFile(file);
                        return;

                    case 1:
                        file.rotation += 90;
                        break;

                    case 2:
                        file.rotation -= 90;
                        break;
                }

                if (supportTransition) {
                    deg = 'rotate(' + file.rotation + 'deg)';
                    $imgWrap.css({
                        '-webkit-transform': deg,
                        '-mos-transform': deg,
                        '-o-transform': deg,
                        'transform': deg
                    });
                } else {
                    $imgWrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                }
            });

            $li.appendTo($queue);
        }

        // 负责view的销毁
        function removeFile(file) {
            var $li = $('.' + file.id);

            delete percentages[file.id];
            updateTotalProgress();
            $li.off().find('.file-panel').off().end().remove();
        }

        function updateTotalProgress() {
            var loaded = 0,
                total = 0,
                spans = $progress.children(),
                percent;

            $.each(percentages, function (k, v) {
                total += v[0];
                loaded += v[0] * v[1];
            });

            percent = total ? loaded / total : 0;

            spans.eq(0).text(Math.round(percent * 100) + '%');
            spans.eq(1).css('width', Math.round(percent * 100) + '%');
            updateStatus();
        }

        function updateStatus() {
            var text = '', stats;

            if (state === 'ready') {
                text = '选中' + fileCount + '个，共' +
                    WebUploader.formatSize(fileSize) + '。';
            } else if (state === 'confirm') {
                stats = uploader.getStats();
                if (stats.uploadFailNum) {
                    text = '已成功上传' + stats.successNum + '个，' +
                        stats.uploadFailNum + '个上传失败，<span class="retry">重新上传</span>失败图片或<span class="ignore">忽略</span>'
                }
            } else {
                stats = uploader.getStats();
                text = '共' + fileCount + '张（' +
                    WebUploader.formatSize(fileSize) +
                    '），已上传' + stats.successNum + '张';

                if (stats.uploadFailNum) {
                    text += '，失败' + stats.uploadFailNum + '张';
                }
            }

            $info.html(text);
        }

        function setState(val) {
            var file, stats;

            if (val === state) {
                return;
            }

            $upload.removeClass('state-' + state);
            $upload.addClass('state-' + val);
            state = val;

            switch (state) {
                case 'pedding':
                    $placeHolder.removeClass('element-invisible');
                    $queue.hide();
                    $statusBar.addClass('element-invisible');
                    uploader.refresh();
                    break;
                case 'ready':
                    $placeHolder.addClass('element-invisible');
                    $statusBar.find('.filePicker2').removeClass('element-invisible');
                    $queue.show();
                    $statusBar.removeClass('element-invisible');
                    uploader.refresh();
                    break;
                case 'uploading':
                    $statusBar.find('.filePicker2').addClass('element-invisible');
                    $progress.show();
                    $upload.text('上传中...').addClass('disabled');
                    break;
                case 'confirm':
                    $progress.hide();
                    $upload.text('开始上传').addClass('disabled');
                    stats = uploader.getStats();
                    if (stats.successNum && !stats.uploadFailNum) {
                        setState('finish');
                        return;
                    }
                    break;
                case 'finish':
                    stats = uploader.getStats();
                    if (stats.successNum) {
                        //debugger
                        //alert('上传成功');
                        options['success'] && options['success'](200,callbackResult);
                    } else {
                        // 没有成功的图片，重设
                        state = 'done';
                        //location.reload();
                    }
                    break;
            }
            updateStatus();
        }

        function getCurrentFiles(){
            var allFiles = uploader.getFiles(),
                currentFiles =[];
            for(var i=0;i<allFiles.length;i++){
                if(allFiles[i].getStatus()!=='cancelled'){
                    currentFiles.push(allFiles[i]);
                }
            }
            return currentFiles;
        }
        uploader.onUploadProgress = function (file, percentage) {
            var $li = $statusBar.find('.' + file.id),
                $percent = $li.find('.progress span');

            $percent.css('width', percentage * 100 + '%');
            percentages[file.id][1] = percentage;
            updateTotalProgress();
        };

        uploader.onFileQueued = function (file) {
            fileCount++;
            fileSize += file.size;

            if (fileCount === 1) {
                $placeHolder.addClass('element-invisible');
                $statusBar.show();
            }

            addFile(file);
            setState('ready');
            updateTotalProgress();
        };

        uploader.onFileDequeued = function (file) {
            fileCount--;
            fileSize -= file.size;
            if (!fileCount) {
                setState('pedding');
            }
            removeFile(file);
            updateTotalProgress();
        };

        uploader.onError = function (code) {
            var msg = '';
            switch (code){
                case 'Q_EXCEED_NUM_LIMIT':
                    msg = '上传的文件总数量超过上限！';
                    break;
                case 'Q_EXCEED_SIZE_LIMIT':
                    msg = '上传单个文件超过大小限制！';
                    break;
                case 'Q_TYPE_DENIED':
                    msg = '上传的文件类型不合法！';
                    break;
                case 'F_DUPLICATE':
                    msg = '上传的文件重复！';
                    break;
            }
            msg!='' && options['success'] && options['success'](500,{message:msg});
        };

        uploader.onUploadAccept = function (obj,result) {
            callbackResult.push(result);
        };
        uploader.on('all', function (type) {
            var stats;
            switch (type) {
                case 'uploadFinished':
                    setState('confirm');
                    break;
                case 'startUpload':
                    setState('uploading');
                    break;
            }
        });

        $upload.on('click', function () {
            var callBackValidate = true;
            if ($(this).hasClass('disabled')) {
                return false;
            }
            if(options['uploadCallback']){
                callBackValidate = options['uploadCallback'](getCurrentFiles());
            }
            if(!callBackValidate){
                return
            }
            if (state === 'ready') {
                uploader.upload();
            } else if (state === 'uploading') {
                uploader.stop();
            }
        });

        $info.on('click', '.retry', function () {
            uploader.retry();
        });

        $info.on('click', '.ignore', function () {
            var files = uploader.getFiles();
            for (var file in files) {
                uploader.removeFile(files[file]);
            }
            uploader.reset();
            $upload.removeClass('disabled');
        });

        $upload.addClass('state-' + state);
        setTimeout(function () {
            setPickPosition();
        },300);
    }

    return {

        /**
         * 初始化图片上传组件
         * @param options
         */
        initPicUploader: function (options) {
            initPicWeight(options);
        }
    }

});