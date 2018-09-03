
import Native from './Native';

let files = '';

function getImage(_) {
    let c = plus.camera.getCamera();
    c.captureImage(function(capturedFile) {
        plus.io.resolveLocalFileSystemURL(capturedFile, function(entry) {
            let path = entry.toLocalURL();
            //files.push({"file":capturedFile, 'src':path});
	        Native.showWaiting();
            resizeImage(path,_);
        }, function(e) {
            Native.alert("error：" + e.message);
        });
    }, {
        filename: "_doc/camera/"
    })
}

//本地相册选择
function galleryImg(_) {
    plus.gallery.pick(function(a) {
        console.log('选取成功','------------------------------------');
        plus.io.resolveLocalFileSystemURL(a, function(entry) {
	        console.log('读取成功','------------------------------------');
            let path = entry.toLocalURL();
	        Native.showWaiting();
            resizeImage(path,_);
        }, function(e) {
	        Native.alert("error：" + e.message);
        });
    }, function(a) {}, {
        filter: "image"
    })
}

//图片压缩
function resizeImage(src,fn) {
	console.log('开始压缩');
    plus.zip.compressImage({
        src: src,
        dst: src,
        overwrite: true,
        width: '500px',
        format: 'jpg',
        quality: 100
    }, function(event) {
        //files = src;
	    console.log('压缩成功');
	    Native.closeWaiting();
        fn(event.target);
    }, function(err) {
	    Native.closeWaiting();
        plus.nativeUI.alert('图片过大,请尽量使用手机拍照');
    });
}

class UploadPictures {
    constructor(){
        //
        this.Pictures = fn => {
            //document.addEventListener( "plusready", function(){
            let buttons = [{
                title: "拍照"
            }, {
                title: "从手机相册选择"
            }];
            window.plus?
                plus.nativeUI.actionSheet({
                    cancel: "取消",
                    buttons,
                }, function(b) {
                    switch (b.index) {
                        case 0:
                            break;
                        case 1:
                            getImage(fn); /*拍照*/
                            break;
                        case 2:
                            galleryImg(fn); /*打开相册*/
                            break;
                        default:
                            break;
                    }
                }):null
            //},false);
        };
    }
}

UploadPictures = new UploadPictures();

export default UploadPictures;
