


class Native {
    constructor(){

        this.showWaiting = () => {
            if(window.plus){
                return plus.nativeUI.showWaiting();
            }
        };

        this.closeWaiting = () => {
            if(window.plus){
                plus.nativeUI.closeWaiting();
            }
        };

        this.alert = (string,fn=()=>{}) => {
            if(window.plus){
                plus.nativeUI.alert( string ,fn(),'','OK');
            } else {
	            fn();
            }
        }
    }
}

Native = new Native();
export default Native;