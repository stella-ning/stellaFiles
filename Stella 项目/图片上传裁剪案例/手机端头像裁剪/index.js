var iScale = 1;
iScale = iScale / window.devicePixelRatio;
document.write('<meta name="viewport" content="width=device-width,initial-scale='+iScale+',minimum-scale='+iScale+',maximum-scale='+iScale+',user-scalable=no" />');
function setRem(){
    var iWidth = document.documentElement.clientWidth;
    document.getElementsByTagName('html')[0].style.fontSize = iWidth / 10 + 'px';
}
setRem();
window.addEventListener("resize", setRem);

var myScroll;
function loaded () {
	myScroll = new IScroll('#wrapper',{
        preventDefault: false,
    });
}



/*document.addEventListener('touchmove',function(event){
    event.preventDefault();
}, false);*/


/*

function addFn(arg1,arg2){
	var r1,r2,m;
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
	m=Math.pow(10,Math.max(r1,r2));
	return (arg1*m+arg2*m)/m;
}
function mulFn(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


*/

