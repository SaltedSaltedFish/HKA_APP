

class _GetState {
    constructor(){
        this.state = _ => {
            switch (_) {
                case 'Y':
	                return { label:'Y',value:'icon2'};
	                break;
	            case 'N':
		            return { label:'N',value:'icon1'};
		            break;
                case '0':
                    return { label:'N',value:'icon1'};
                    break;
	            case '3':
		            return { label:'Y',value:'icon2'};
		            break;
                // case 'N':
	             //    return '';
                //     //return 'NoDOWN';
                //     break;
                // case 'G':
					// return '';
					// //return 'ONGOING';
					// break;
                default:
	                return { label:'Non Feedback',value:'icon3'};
                    break;
            }
        };

        this.applicationState = _ => {
            switch (_) {
                case '1':
                    return 'ADOPT';
                    break;
                case '0':
                    return 'IN REVIEW';
                    break;
                case '2':
                    return 'REJECT';
                    break;
                default:
                    return '';
                    break;
            }
        };

        this.monthName = _ => {
            switch (_) {
                case 1:
                    return {
                        FigureThree:'JAN',
                        name:'January'
                    };
                    break;
                case 2:
                    return {
                        FigureThree:'FEB',
                        name:'February'
                    };
                    break;
                case 3:
                    return {
                        FigureThree:'MAR',
                        name:'March'
                    };
                    break;
                case 4:
                    return {
                        FigureThree:'APR',
                        name:'April'
                    };
                    break;
                case 5:
                    return {
                        FigureThree:'May',
                        name:'May'
                    };
                    break;
                case 6:
                    return {
                        FigureThree:'JUN',
                        name:'June'
                    };
                    break;
                case 7:
                    return {
                        FigureThree:'JUL',
                        name:'July'
                    };
                    break;
                case 8:
                    return {
                        FigureThree:'AUG',
                        name:'August'
                    };
                    break;
                case 9:
                    return {
                        FigureThree:'SEP',
                        name:'September'
                    };
                    break;
                case 10:
                    return {
                        FigureThree:'OCT',
                        name:'October'
                    };
                    break;
                case 11:
                    return {
                        FigureThree:'NOV',
                        name:'November'
                    };
                    break;
                case 12:
                    return {
                        FigureThree:'DEC',
                        name:'December'
                    };
                    break;
                default:
                    return '';
                    break;
            }
        };
    }
};

const GetState = new _GetState();

export default GetState;