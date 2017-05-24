$(function(){
	var $head = $('.nav-bar');
	$('#sw').sectionWrap().on('beforeWheel',function(event,ops){
		$head.addClass('hide');
		ops.beforeDOM .removeClass("action")
	}).on('afterWheel',function(event,ops){
		var index = ops.after;
		if(index==0){
			$head.removeClass('nav-small').addClass('nav-big');
		}else{
			$head.removeClass('nav-big').addClass('nav-small');
		}
		if(index==1){
			ops.afterDOM.addClass("action");
		}
		$head.removeClass("hide");
	});
	return
	// var $sectionWrap = $('.section-wrap'),
	//  	$head = $('.nav-bar'),
	// 	index = 0,
	// 	last = $sectionWrap.length - 1,
	// 	lock = true;
	// //滚动之前
	// function onBeforeWheel(index){
	// 	$head.addClass('hide');
	// 	$(".section-2").removeClass("action");
	// }
	// //滚动之后
	// function onAfterWheel(index){
	// 	if(index==0){
	// 		$head.removeClass('nav-small').addClass('nav-big');
	// 	}else{
	// 		$head.removeClass('nav-big').addClass('nav-small');
	// 	}
	// 	if(index==1){
	// 		$(".section-2").addClass("action");
	// 	}
	// 	$head.removeClass("hide");
	//
	// }
	// //滚轮事件
	// $(document.body).on('mousewheel',function(e){
	// 	if(lock){
	// 		lock = false;
	// 		//小于0 向上滚,大于0向下滚
	// 		var dir = e.originalEvent.deltaY < 0;
	// 		//console.log(dir)
	// 		//设置beforeIndex 等于当前的index
	// 		var beforeIndex = index;
	// 		dir?index--:index++;
	// 		//index取最小值,最大不能大于last
	// 		index = Math.min(index,last);
	// 		//index去最大值,最小不能小于0;
	// 		index = Math.max(index,0);
	// 		//判断index++--之后的index是否与beforeIndex相等,如果相等导航就不滑动
	// 		//console.log(beforeIndex+":"+index);
	// 		if(beforeIndex == index){
	// 			lock = true;
	// 			return;
	// 		}
	// 		onBeforeWheel(beforeIndex);
	// 		$sectionWrap.css({
	// 			"transform": "translateY(-"+index+"00%)",
	// 			"-moz-transform": "translateY(-"+index+"00%)",
	// 			"-webkit-transform": "translateY(-"+index+"00%)",
	// 			"-o-transform": "translateY(-"+index+"00%)"
	// 		});
	// 		setTimeout(function(){
	// 			lock = true;
	// 			onAfterWheel(index);
	// 		},1000);
	// 		//console.log(index);
	// 	}
	// })

})
