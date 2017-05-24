/*将根元素字号大小设置为：屏宽与图宽的比；  
由于chrom对10px以下的字不再缩小，而且手机屏  
都比较小，所以作为默认字体大小又乘了100，这样  
计算其他元素大小时，量出图上大小再除以100就可以了*/  
function defaultfont() {  
    var sw = $(window).width();  
    var pw = 750;  
    var f = 100*sw/pw;  
    $('html').css('font-size', f+'px');  
}

/*之所以要延时100ms再调用这个函数是因为  
如果不这样屏幕宽度加载会有误差*/   
setTimeout(function(){  
    defaultfont();  
}, 100); 
var w_height=$(window).width();
$(window).resize(function(){
if($(window).width()!=w_height)
{
	window.location.reload(); 
}
});
/*跳转页面*/
function window_href(href){
	 window.location.href=href;
}

