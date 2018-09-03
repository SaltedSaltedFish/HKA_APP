
let options = {
    conserve:false,
    vibrate:true
};
let filters = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

class Scanning {
    constructor(){
        let barcode;

        this.Pictures = (_) => {
            //document.addEventListener( "plusready", function(){
            //console.log(_);
            if(window.plus) {
                barcode = new plus.barcode.Barcode("barcode",filters);
                barcode.start(options);
                barcode.onmarked = function (type,code,file){
					barcode.close();
                    console.log(type+'  条码类型');
                    _(type,code,file);
                };
                barcode.onerror = function (error) {
                    //console.log(error);
                    //const error = new Error({num:1});
                    throw '错误';
                };

	            // plus.key.addEventListener("backbutton", function() {
		         //    barcode.close();
		         //    history.goBack();
	            // });
                return barcode;
            } else {
                console.log('唤醒二维码失败');
            }
            //},false);
        };
    }
}

Scanning = new Scanning();

export default Scanning;