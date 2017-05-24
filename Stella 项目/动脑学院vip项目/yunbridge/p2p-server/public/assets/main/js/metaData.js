//将闭包返回的对象给MetaData
var MetaData = (function(){
	//功能函数
	var __PROTOTYPE__ = {
		//装载元数据
		'load':function(metaData){
			//console.log('hello everybody');
			metaData = metaData||{};
			for(var tab in metaData){

				if(this[tab]){
					this[tab].load = true;
					this[tab].data = metaData[tab];
				}
				//console.log(this[tab]);
			}
			this.driver();

		},
		//驱动所有load为true的模块的render方法
		'driver':function(){
			//console.log('驱动所有load为true的模块的render方法')
			for(var module in this){
				var m = this[module];
				if(m.load){
					m.beforeRender&&m.beforeRender(this);//渲染模块之前回调
					m.render&&m.render(this);//渲染模块
					m.afterRender&&m.afterRender(this);//渲染模块之后回调
					m.load = false;//关闭渲染按钮
				}
			}
		}
	}

	//返回的对象要继承上面的所有功能
	return $.extend({
		//初始化查询条件
		'querys':{
			'querys.billAmt':null,
			'querys.discountRate':null,
			'querys.latestAccountDateFrom':null,
			'querys.latestAccountDateTo':null,
			'querys.acceptBank':null,
			'querys.acceptBankType':null,
			'pageNo' : null,
			'pageSize' : null,
			'totalPage' : null,
		},
		//查询条件模块
		'detail':{
			'load' : false,
			'data' : null,
			'render' : function(metaData){
				//console.log('detail===='+this)
				$.each(this.data,function(key,val){
					var $obj = $('#'+key);
					$obj.text(Utils.numberFormat($obj,val))
				})
			},
		},
		//详细数据模块
		'invest':{
			'load' : false,
			'data' : null,
			'render' : function(metaData){
					console.log('invest----'+this)
			},
		},
		//当前可投模块
		'flow' : {
			'load' : false,
			'data' : null,
			'render' : function(metaData){
					console.log('flow----'+this)
			},
		},
		//当前现金模块
		'overview' : {
			'load' : false,
			'data' : null,
			'render' : function(metaData){
					console.log('overview----'+this)
			},
		},
		//已选票据模块
		'forecast' : {
			'load' : false,
			'data' : null,
			'render' : function(metaData){
					console.log('forecast---'+this)
			},
		},
		//投后现金模块
		'list' : {
			'load' : false,
			'data' : null,
			'target' : $('#billList tbody'),
			'lazy' : $('.lazy-load'),
			'beforeRender' : function(metaData){
				var data = this.data;
				metaData.querys.pageNo=data.pageNo;
				metaData.querys.pageSize=data.pageSize;
				metaData.querys.totalPage=data.totalPage;
				if(data.pageNo<data.totalPage){
					this.lazy.text("点击加载更多票据明细").prop("disabled",false);

				}else{
					this.lazy.text("已全部加载完毕").prop("disabled",true);
				}
			},
			'render' : function(metaData){
				//console.log('list----'+this)
				this.target.empty();
				this.data.result = this.data.result||[];
				console.log(this.data.result.length);
				var row;
				(this.data.result.length == 0)&&this.lazy.hide();
				for(var i=0;i<this.data.result.length;i++){
					row = this.data.result[i];
					this.target.append("<tr>"+
								        "<td><span data-stopPropagation class=\"ico inp-check\" id=\"r"+row.id+"\"></span><input type=\"checkbox\" style=\"display:none\" value=\""+row.id+"\"></td>"+
								        //"<td><a href=\"" + ROOT +  "/invest/billInfo?id=" + row.productInfoId + "\" target=\"_blank\">"+row.billNo+"</a></td>"+
								        "<td>"+row.billNo+"</td>" +
								        "<td>"+row.acceptBankName+"</td>"+
								        "<td><span data-format-type='rate'>"+row.discountRate+"</span>%</td>"+
								        "<td><span data-format-type='amount'>"+row.faceAmt+"</span>元</td>"+
								        "<td><span data-format-type='amount'>"+row.subscriptionAmt+"</span>元</td>"+
								        "<td>"+row.remainDeadline+"天</td>"+
								        "<td>"+new Date(row.accountDate).toLocaleDateString()+"</td>"+
									   "</tr>"
								   );
				}
			},
		}


	},__PROTOTYPE__)
})()
