//导入echarts的js
require.config({
    paths: {
        echarts: ROOT+'/js/echarts'
    }
});

//图标颜色配置数组
var colorList = ['#fbdf7f','#f3a43b','#60c0dd','#e2454e','#c6e579','#9bca63','#99ccff','#9966ff','#cc33cc','#ff7f50'];
var lineColor = ['#cc33cc','#cc33cc','#cc33cc','#cc33cc','#cc33cc','#cc33cc','#cc33cc','#cc33cc','#cc33cc','#cc33cc'];
/**
 * echart图标的样式
 * @author yangfan 2016-01-06
 * @param params
 * @return
 */
var itemStyle = {
    normal : {
        label : {
            show : false
        },
        /**
    	 * 配置折线图的颜色
    	 * @author yangfan 2016-01-06
    	 * @param params
    	 * @return
    	 */
        color: function(params) {
          var zrColor = metaData.zrColor;
          if(params.series.type==='line'){
        	  return zrColor.lift(
        			  lineColor[(Math.random()*1000<<2)%lineColor.length], params.seriesIndex * 0.1
                    );
          }else if (params.dataIndex < 0) {
            return zrColor.lift(
              colorList[colorList.length - 1], params.seriesIndex * 0.1
            );
          }else {
            return zrColor.lift(
              colorList[params.dataIndex], params.seriesIndex * 0.1
            );
          }
        },
        labelLine : {
            show : false
        }
    },
    emphasis : {
        label : {
            show : true,
            position : 'center',
            textStyle : {
                fontSize : '20',
                fontWeight : 'bold'
            }
        }
    }
};
/**
 * 这个对象包含了所有的图表模型，也就是页面上展示的几种图表，以及票据明细和筛选区的数据都是
 * 封装在这个对象中的，他和controller的MetaData内部类是对应的。
 * @author yangfan 2016-01-06
 * @param params
 * @return
 */
var metaData = {
	//是否是第一次加载
	firstLoad:true,
	//加载初始化时间
	effect:1000,
	//是否触发
	trigger:true,
	dimensions:{
		billAmt:undefined,
		yearlyRate:undefined,
		latestAccountDateFrom:undefined,
		latestAccountDateTo:undefined,
		acceptBankType:undefined//acceptor和acceptType相斥
	},
	/**
	 * 设置柱状图的最大、最小值得样式
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	genBarMarkPoint:function(maximum){
		return {
        	symbolSize : 17,
        	itemStyle :{
        		normal:{
        			label:{show:true,formatter:function(v){return v.name==='最大值'?"Max":"Min"}}
        		}
        	},
        	data : maximum
        };
	},
	clearChartEmpty:function(target){
		$(target).children().removeClass();
	},
	chartEmpty : function(target,type){
		$(target).children().addClass("chart-empty chart-"+(metaData.firstLoad?"nodata":"filtererr")+"-"+type);
	},
	noDataEffect : function(target,type){
		return {
			text :"",
		   	effect : (function(target){
		   		return function(){
		   			metaData.chartEmpty(target,type);
		   		}
		   	})(target)
		};
	},
	/**
	 * 整个数据的入口，后台获取的数据在controller层先存入MetaData数据模型
	 * 然后MetaData数据从这里传入
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	init:function(meta){
		var _this = this;
		//调用所有有before方法的对象，对所有图表是否显示做一个初始化
		for(var prop in this){
			if(this[prop].before)this[prop].before(this[prop]);
		}
		timeout(function(){
			//回调reset方法，把从后台获取的数据放入js对象metaData中的各个对象模型中
			_this.reset.call(_this,meta);
		});
	},
	/**
	 * 点击筛选按钮，根据条件显示筛选数据
	 * @author yangfan 2016-01-06
	 * @param form
	 * @return
	 */
	change:function(form){
		$("#tab-disabled").show();
		var formData = form.serializeArray();
		this.dimensions = {
			billAmt:undefined,
			yearlyRate:undefined,
			latestAccountDateFrom:undefined,
			latestAccountDateTo:undefined,
			acceptBank:undefined,
			acceptBankType:undefined
		};
		for(var i=0;i<formData.length;i++){
			if(formData[i].name==="querys.acceptBankType"){
				if($("[name='"+formData[i].name+"']:visible").size()>0){
					delete this.dimensions["querys.acceptBank"];
				}else{
					continue;
				}
			}
			if(formData[i].name==="querys.yearlyRate"){formData[i].value/=100;}
			if(formData[i].name==="querys.discountRate"){formData[i].value/=100;}
			if(this.dimensions[formData[i].name]){
				if(this.dimensions[formData[i].name] instanceof Array){
					this.dimensions[formData[i].name].push(formData[i].value);
				}else{
					this.dimensions[formData[i].name] = [this.dimensions[formData[i].name],formData[i].value];
				}
			}else{
				this.dimensions[formData[i].name] = formData[i].value;
			}
		}
		var _this = this;
		for(var prop in this){
			if(this[prop].before)this[prop].before(this[prop]);
		}
		$('.tab-main .nav-tabs li[hidden]').addClass('hidden');
		$('.tab-main .nav-tabs li a').attr("lazy-load","true").filter('[href="#tab1"]').attr("lazy-load","false").trigger("click");
		timeout(function(){
			$.post(ROOT+"/invest/filter",_this.dimensions,function(m){
				if(m.detail.checkList&&m.detail.checkList.length>0){
					_this.trigger = false;
				}
				_this.reset.call(_this,m);
				_this.trigger = true;
				disabledInvest();
			});
	    	form.bootstrapValidator('disableSubmitButtons', false);
		});
	},
	/**
	 * 把从后台获取的数据放入js对象metaData中的各个对象模型中
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	reset:function(meta){
		meta = meta||{};
		if(meta.detail){
			this.detail.load = true;
			//把数据放入detail的data中
			this.detail.data = meta.detail;
		}
		if(meta.list){
			this.list.load = true;
			//把数据放入list的data中
			this.list.data = meta.list;
		}

		meta.tabs = meta.tabs||{};
		//把数据放入各个图表模型对象的data中
		for(var tab in meta.tabs){
			this[tab].load = true;
			if(this[tab].pie1)this[tab].pie1.data = meta.tabs[tab].pie1;
			if(this[tab].pie2)this[tab].pie2.data = meta.tabs[tab].pie2;
			if(this[tab].bar)this[tab].bar.data = meta.tabs[tab].bar;
			if(this[tab].line)this[tab].line.data = meta.tabs[tab].line;
		}

		//
		this.refresh.call(this);
	},
	/**
	 * 把metaData对象中的数据放入到echarts中，这样后台的数据
	 * 就在前端的图表中显示出来了
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	refresh:function(){
		for(var obj in this){
			if(typeof this[obj] === 'object'){
				//如果是一个object，并且是第一次加载和callback方法
				if(this[obj].load&&this[obj].callback){
					//全部设置为false
					this[obj].load = false;
					//所有的callback都回调一遍,把所有的数据都加载到了echart的option里面
					this[obj].callback.call(this[obj]);
					//所有的after都回调一遍,把各种点击事件都设置好
					if(this[obj].after)this[obj].after.call(this[obj]);
				}
			}
		}
		$("#tab-disabled").hide();
	},
	/**
	 * 筛选区的数据设置
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	detail:{
		load:false,
		data:undefined,
		callback:function(){
			for(var prop in this.data){
				//把detail中的数据放到页面的筛选条件部分去
				$('#'+prop).html(this.data[prop]||"");
			}
			//指定显示金额或者其他一些信息的显示格式
			formateText('#detail-data');
		}
	},
	/**
	 * 当前可投票据的图表对象模型
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	invest:{
		//是否加载过
		load:false,
		//图表主题配置
		theme:'infographic',
		ptarget1:document.getElementById('tab1-pie1'),
		ptarget2:document.getElementById('tab1-pie2'),
		btarget:document.getElementById('tab1-bar'),
		ltarget:document.getElementById('tab1-line'),
		loading:$('#tab1 .loading'),
		/**
		 * 可投票据概览图表根据银行类型统计的数据对象
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		pie1:{
			data:undefined,
			title:'可投票据概览（万）',
			itemTitle:'承兑行资金比例',
			detail:$('#tab1 div.detail:eq(0)')
		},
		/**
		 * 可投票据概览图表根据承兑行贴现率统计的数据对象
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		pie2:{
			data:undefined,
			title:'可投票据概览（万）',
			itemTitle:'承兑行资金比例',
			detail:$('#tab1 div.detail:eq(1)')
		},
		/**
		 * 现金流量柱状图根据月份统计的数据对象
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		bar:{
			data:undefined,
			title:'现金流量（万）',
			itemTitle:'现金流量',
			detail:$('#tab1 div.detail:eq(2)')
		},
		/**
		 * 点击现金流量柱状图的每个月份展现的每月数据的折现图统计数据对象
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		line:{
			title:'现金流量（万）',
			url:ROOT+"/invest/flowDay"
		},
		/**
		 * echarts自适应，防止变形
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		resize:function(){
			if(this.pie1.chart)this.pie1.chart.resize();
			if(this.pie2.chart)this.pie2.chart.resize();
			if(this.bar.chart)this.bar.chart.resize();
			if(this.line.chart)this.line.chart.resize();
		},
		/**
		 * 数据加载之前调用这个方法
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		before:function(){
			$(this.ltarget).hide();
			$(this.btarget).show();
			this.loading.show();
		},
		/**
		 * 加载数据时调用这个方法，然后回调metaData.callback，数据就加载到了图表中
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		callback:function(){
			metaData.callback.call(this);
		},
		/**
		 * 数据加载后调用这个方法，这样做可以把和页面初始化无关的js加载分开
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		after:function(){
			billAfter.call(this);
			this.loading.hide();
		}
	},
	/**
	 * 已选票据概览的图表对象模型
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	overview:{
		load:false,
		theme:'infographic',
		ptarget1:document.getElementById('tab2-pie1'),
		ptarget2:document.getElementById('tab2-pie2'),
		btarget:document.getElementById('tab2-bar'),
		ltarget:document.getElementById('tab2-line'),
		loading:$('#tab2 .loading'),
		/**
		 * 已选票据概览图表根据银行类型统计的数据对象
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		pie1:{
			data:undefined,
			title:'已选票据概览（万）',
			itemTitle:'承兑行资金比例',
			detail:$('#tab2 div.detail:eq(0)')
		},
		/**
		 * 已选票据概览图表根据承兑行贴现率统计的数据对象
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		pie2:{
			data:undefined,
			title:'已选票据概览（万）',
			itemTitle:'承兑行资金比例',
			detail:$('#tab2 div.detail:eq(1)')
		},
		/**
		 * 现金流量柱状图根据月份统计的数据对象
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		bar:{
			data:undefined,
			title:'现金流量（万）',
			itemTitle:'现金流量',
			detail:$('#tab2 div.detail:eq(2)')
		},
		/**
		 * 点击现金流量柱状图的每个月份展现的每月数据的折现图统计数据对象
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		line:{
			title:'现金流量（万）',
			url:ROOT+"/invest/flowDay"
		},
		/**
		 * echarts自适应，防止变形
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		resize:function(){
			if(this.pie1.chart)this.pie1.chart.resize();
			if(this.pie2.chart)this.pie2.chart.resize();
			if(this.bar.chart)this.bar.chart.resize();
			if(this.line.chart)this.line.chart.resize();
		},
		/**
		 * 数据加载之前调用这个方法
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		before:function(){
			$(this.ltarget).hide();
			$(this.btarget).show();
			this.loading.show();
		},
		/**
		 * 加载数据时调用这个方法，然后回调metaData.callback，数据就加载到了图表中
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		callback:function(){
			$('.tab-main .nav-tabs li[hidden]').removeClass('hidden');
			$('.tab-main .nav-tabs li a').attr("lazy-load","true").filter('[href="#tab2"]').attr("lazy-load","false").trigger("click");
			metaData.callback.call(this);
		},
		/**
		 * 数据加载后调用这个方法，这样做可以把和页面初始化无关的js加载分开
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		after:function(){
			billAfter.call(this);
			//所有步骤都执行完了，那么等待显示的图片可以隐藏了
			this.loading.hide();
		}
	},
	/**
	 * 当前现金浏览的图表对象模型
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	flow:{
		load:false,
		theme:'infographic',//'macarons',
		btarget:document.getElementById('tab3-bar'),
		ltarget:document.getElementById('tab3-line'),
		loading:$('#tab3 .loading'),
		/**
		 * 当前现金流量柱状图的数据
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		bar:{
			data:undefined,
			title:'当前现金流量（万）',
			itemTitle:'当前现金流量',
			detail:$('#tab3 div.detail:eq(0)')
		},
		/**
		 * 当前现金流量折现图的数据
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		line:{
			title:'当前现金流量（万）',
			url:ROOT+"/invest/currFlow",
			detail:$('#tab3 div.detail:eq(1)')
		},
		/**
		 * echarts自适应，防止变形
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		resize:function(){
			if(this.bar.chart)this.bar.chart.resize();
			if(this.line.chart)this.line.chart.resize();
		},
		/**
		 * 数据加载之前调用这个方法
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		before:function(){
			this.loading.show();
		},
		/**
		 * 加载数据时调用这个方法，然后回调metaData.callback，数据就加载到了图表中
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		callback:function(){
			metaData.callback.call(this);
		},
		/**
		 * 数据加载后调用这个方法，这样做可以把和页面初始化无关的js加载分开
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		after:function(){
			flowAfter.call(this);
			this.loading.hide();
		}
	},
	/**
	 * 投后现金流量预测的图表对象模型
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	forecast:{
		load:false,
		theme:'infographic',//'macarons',
		btarget:document.getElementById('tab4-bar'),
		ltarget:document.getElementById('tab4-line'),
		loading:$('#tab4 .loading'),
		/**
		 * 投后现金流量预测柱状图的数据
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		bar:{
			data:undefined,
			title:'投后现金流量（万）',
			itemTitle:'投后现金流量',
			detail:$('#tab4 div.detail:eq(0)')
		},
		/**
		 * 投后现金流量预测折现图的数据
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		line:{
			title:'投后现金流量（万）',
			url:ROOT+"/invest/investFlow",
			detail:$('#tab4 div.detail:eq(1)')
		},
		/**
		 * echarts自适应，防止变形
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		resize:function(){
			if(this.bar.chart)this.bar.chart.resize();
			if(this.line.chart)this.line.chart.resize();
		},
		/**
		 * 数据加载之前调用这个方法
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		before:function(){
			this.loading.show();
		},
		/**
		 * 加载数据时调用这个方法，然后回调metaData.callback，数据就加载到了图表中
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		callback:function(){
			metaData.callback.call(this);
		},
		/**
		 * 数据加载后调用这个方法，这样做可以把和页面初始化无关的js加载分开
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		after:function(){
			flowAfter.call(this);
			this.loading.hide();
		}
	},
	/**
	 * 已选择票据明细数据对象
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	list:{
		load:false,
		sum:0,
		data:undefined,
		loading : $('.panel.list .loading'),
		noDataDisplay:$('#billList thead tr.no_data_display'),
		target:$('#billList tbody'),
		lazy:$('#billList tr .lazy-load'),
		before:function(){
			this.loading.show();
		},
		/**
		 * 已选择票据明细数据初始化
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		callback:function(){
			this.target.empty();
			this.data.result = this.data.result||[];
			metaData.dimensions["entity.pageNo"] = this.data.pageNo;
			metaData.dimensions["entity.pageSize"] = this.data.pageSize;
			metaData.dimensions["entity.totalPage"] = this.data.totalPage;
			var row,m1,m2;
			if(this.data.result.length == 0) $(".lazy-load").hide();
			for(var i=0;i<this.data.result.length;i++){
				row = this.data.result[i];
				m1 = formatMoney(row.faceAmt);
				m2 = formatMoney(row.subscriptionAmt);
				this.target.append("<tr>"+
							        "<td><span data-stopPropagation class=\"ico inp-check\" id=\"r"+row.id+"\"></span><input type=\"checkbox\" style=\"display:none\" value=\""+row.id+"\"></td>"+
							        //"<td><a href=\"" + ROOT +  "/invest/billInfo?id=" + row.productInfoId + "\" target=\"_blank\">"+row.billNo+"</a></td>"+
							        "<td>"+row.billNo+"</td>" +
							        "<td>"+row.acceptBankName+"</td>"+
							        "<td>"+formatePercent(row.discountRate)+"%</td>"+
							        "<td>"+m1.number+m1.unit+"</td>"+
							        "<td>"+m2.number+m2.unit+"</td>"+
							        "<td>"+row.remainDeadline+"</td>"+
							        "<td>"+new Date(row.accountDate).toLocaleDateString()+"</td>"+
								   "</tr>");
			}
		},
		/**
		 * 已选择票据明细加载按钮的设置
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		after:function(){
			this.loading.hide();
			if(this.data.pageNo===this.data.totalPage){
				this.lazy.text("已经加载所有").attr('disabled',true);
			}else{
				this.lazy.text("点击加载更多票据记录").removeAttr('disabled');
			}
			if(this.data.result&&this.data.result.length>0){
				this.noDataDisplay.addClass("hidden");
			}else{
				this.noDataDisplay.removeClass("hidden");
			}
			var cks = metaData.detail.data.checkList;
			metaData.dimensions["querys.checkList"] = metaData.detail.data.checkList;
			//后台获取的checklist设置为点击过
			if(cks&&cks.length>0){
				for(var i=0;i<cks.length;i++){
					if(!($("#r"+cks[i]).hasClass("checked"))){
						$("#r"+cks[i]).trigger('click');
					}
				}
			}
		},
		/**
		 * 已选择票据明细店家加载按钮
		 * @author yangfan 2016-01-06
		 * @param params
		 * @return
		 */
		lazyload : function(page){
			var oldData = this.data;
			this.data = page;
			metaData.dimensions["entity.pageNo"] = this.data.pageNo;
			metaData.dimensions["entity.pageSize"] = this.data.pageSize;
			metaData.dimensions["entity.totalPage"] = this.data.totalPage;
			var newData = this.data,row,m1,m2;
			for(var i=0;i<newData.result.length;i++){
				row = newData.result[i];
				m1 = formatMoney(row.faceAmt);
				m2 = formatMoney(row.subscriptionAmt);
				this.target.append("<tr>"+
							        "<td><span data-stopPropagation class=\"ico inp-check \" id=\"r"+row.id+"\"></span><input type=\"checkbox\" style=\"display:none\" value=\""+row.id+"\"></td>"+
							        //"<td><a href=\"" + ROOT +  "/invest/billInfo?id=" + row.productInfoId + "\" target=\"_blank\">"+row.billNo+"</a></td>"+
							        "<td>"+row.billNo+"</td>" +
							        "<td>"+row.acceptBankName+"</td>"+
							        "<td>"+formatePercent(row.discountRate)+"%</td>"+
							        "<td>"+m1.number+m1.unit+"</td>"+
							        "<td>"+m2.number+m2.unit+"</td>"+
							        "<td>"+row.remainDeadline+"</td>"+
							        "<td>"+new Date(row.accountDate).toLocaleDateString()+"</td>"+
								   "</tr>");
			}
			this.data.result = oldData.result.concat(this.data.result);
			this.after.call(this);
		}
	},
	/**
	 * 渲染图表,数据放入echarts图表中进行展示
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	render:function (ec) {
		metaData.ec = ec;
    	var zrColor = metaData.zrColor = require('zrender/tool/color');
    	/**
    	 * 渲染pie1
    	 * @author yangfan 2016-01-06
    	 * @param params
    	 * @return
    	 */
    	(function(){
    		if(!this.pie1||!this.pie1.data)return;
    		var legend = [],series = [];
    		var that = this;
    		if(ObjectUtils.notEmpty(this.pie1.data)){
        		var _data = {};
        		$(".acceptBankType").each(function(){
        			if(that.pie1.data[$(this).attr("codename")]){
        				_data[$(this).attr("codename")] = that.pie1.data[$(this).attr("codename")];
        			}else{
        				_data[$(this).attr("codename")] = 0;
        			}
        		});
        		this.pie1.data = _data;
        		metaData.clearChartEmpty(this.ptarget1);
        	}
        	var meta = this.pie1.data,m;
        	this.pie1.detail.empty();
        	//把eachart图表需要的数据都放入数组中，然后直接在option中直接用
        	for(var prop in meta){
        		legend.push(prop);
        		if(((meta[prop]/10000).toString()).indexOf(".") > 0){
    				var metaSplit = (meta[prop]/10000).toString().split(".")[1];
    				if(metaSplit.length > 2){
            			series.push({value:parseFloat((meta[prop]/10000).toFixed(2)), name:prop});
            		}else{
            			series.push({value:meta[prop]/10000, name:prop});
            		}
        		}else{
        			var metaSplit = meta[prop]/10000;
        			series.push({value:meta[prop]/10000, name:prop});
        		}
        		m = formatMoney(meta[prop],true);
        		this.pie1.detail.append('<dl><dt>'+prop+'</dt><dd class="number">'+m.number+'</dd><dd class="unit">'+m.unit+'</dd></dl>');
        	}
        	//把echart图表放入到某个元素中去
            var myChart = this.pie1.chart = ec.init(this.ptarget1);
            //设置主题
            myChart.setTheme(this.theme);
            var _t = this;
            var option = {
            	title : {
	    	        text: this.pie1.title,
	    	    },
	    	    noDataLoadingOption : metaData.noDataEffect(this.ptarget1,'pie'),
        	    tooltip : {
        	        trigger: 'item',
        	        formatter: "{a} <br/>{b} : {c} ({d}%)"
        	    },
        	    legend: {
        	        orient : 'vertical',
        	        x : 'right',
        	        y : 'bottom',
        	        selectedMode:false,
        	        data:legend
        	    },
        	    toolbox: {
        	        show : true,
        	        padding :[12, 20 ,0 ,0],
        	        feature : {
        	        	myTool : {
			                show : true,
			                title : '承兑行贴现率比例',
			                icon : 'image://'+ROOT+'/images/ring.png',
			                onclick : function (){
			                	$(_t.ptarget2).parent().show();
			                	//进行点击后如果不进行resize(),echart图表就会变形
			                	_t.pie2.chart.resize();
			                }
			            },
        	            restore : {show: true},
        	        }
        	    },
        	    calculable : true,
        	    series : [
        	        {
        	            name:this.pie1.itemTitle,
        	            type:'pie',
        	            radius : ['50%', '70%'],
        	            //设置线条的颜色等一系列线条的样式
        	            itemStyle : itemStyle,
        	            data:series
        	        }
        	    ]
        	};
            try{
				 myChart.setOption(option);
			}catch(e){
				//如果图表中没有数据，那么就显示暂无记录图片
				metaData.chartEmpty(this.ptarget1,'pie');
			}
    	}).call(this);
    	/**
    	 * 渲染pie2
    	 * @author yangfan 2016-01-06
    	 * @param params
    	 * @return
    	 */
    	(function(){
    		if(!this.pie2||!this.pie2.data)return;
    		var legend = [],series = [];
    		var that = this;
        	if(ObjectUtils.notEmpty(this.pie2.data)){
        		var _data = {};
        		$(".yearlyRateArea").each(function(){
        			if(that.pie2.data[$(this).attr("codename")]){
        				_data[$(this).attr("codename")] = that.pie2.data[$(this).attr("codename")];
        			}else{
        				_data[$(this).attr("codename")] = 0;
        			}
        		});
        		this.pie2.data = _data;
        		metaData.clearChartEmpty(this.ptarget2);
        	}
        	var meta = this.pie2.data,m;
        	this.pie2.detail.empty();
        	//把eachart图表需要的数据都放入数组中，然后直接在option中直接用
        	for(var prop in meta){
        		legend.push(prop);
        		if(((meta[prop]/10000).toString()).indexOf(".") > 0){
    				var metaSplit = (meta[prop]/10000).toString().split(".")[1];
    				if(metaSplit.length > 2){
            			series.push({value:parseFloat((meta[prop]/10000).toFixed(2)), name:prop});
            		}else{
            			series.push({value:meta[prop]/10000, name:prop});
            		}
        		}else{
        			var metaSplit = meta[prop]/10000;
        			series.push({value:meta[prop]/10000, name:prop});
        		}
        		m = formatMoney(meta[prop],true);
        		this.pie2.detail.append('<dl><dt>'+prop+'</dt><dd class="number">'+m.number+'</dd><dd class="unit">'+m.unit+'</dd></dl>');
        	}
            var myChart = this.pie2.chart = ec.init(this.ptarget2);
            myChart.setTheme(this.theme);
            var _t = this;
            var option = {
            	title : {
	    	        text: this.pie2.title,
	    	    },
	    	    noDataLoadingOption : metaData.noDataEffect(this.ptarget2,'pie'),
        	    tooltip : {
        	        trigger: 'item',
        	        formatter: "{a} <br/>{b} : {c} ({d}%)"
        	    },
        	    legend: {
        	        orient : 'vertical',
        	        x : 'right',
        	        y : 'bottom',
        	        selectedMode:false,
        	        data:legend
        	    },
        	    toolbox: {
        	        show : true,
        	        padding :[12, 20 ,0 ,0],
        	        feature : {
        	        	myTool : {
			                show : true,
			                title : '承兑行贴现率比例',
			                icon : 'image://'+ROOT+'/images/ring.png',
			                onclick : function (){
			                	$(_t.ptarget2).parent().hide();
			                	_t.pie1.chart.resize();
			                }
			            },
        	            restore : {show: true},
        	        }
        	    },
        	    calculable : true,
        	    series : [
        	        {
        	            name:this.pie1.itemTitle,
        	            type:'pie',
        	            radius : ['50%', '70%'],
        	            itemStyle : itemStyle,
        	            data:series
        	        }
        	    ]
        	};
            try{
				 myChart.setOption(option);
			 }catch(e){
				 metaData.chartEmpty(this.ptarget2,'pie');
			 }
    	}).call(this);
    	/**
    	 * 渲染bar
    	 * @author yangfan 2016-01-06
    	 * @param params
    	 * @return
    	 */
    	(function(){
        	if(!this.bar||!this.bar.data)return;
        	this.bar.detail.empty();
        	var that = this;
        	var myChart = this.bar.chart = ec.init(this.btarget);
            myChart.setTheme(this.theme);
            var legend = [],series = [];
            if(ObjectUtils.notEmpty(this.bar.data)){
                var _data = {};
                var minProp = ObjectUtils.minProp(this.bar.data);
	        	var _y = parseInt(minProp.split("-")[0]),_m = parseInt(minProp.split("-")[1]);
	        	if(_m===12)_y++;
	            for(var i=_m+1;i<_m+6;i++){
	            	var m = i>12?i%12:i;
	            	if(!this.bar.data[_y+"-"+(m<10?"0"+m:m)]){
	            		this.bar.data[_y+"-"+(m<10?"0"+m:m)] = 0;
	            	}
	            	if(i%12===0)_y++;
	            }
	            this.bar.data = ObjectUtils.propsKey(this.bar.data);
	            metaData.clearChartEmpty(this.btarget);
            }
            var meta = this.bar.data;
            var i=0;
        	for(var prop in meta){
        		if(++i>6){
        			break;
        		}
        		legend.push(prop);
        		if(((meta[prop]/10000).toString()).indexOf(".") > 0){
    				var metaSplit = (meta[prop]/10000).toString().split(".")[1];
    				if(metaSplit.length > 2){
            			series.push(parseFloat((meta[prop]/10000).toFixed(2)));
            		}else{
            			series.push(meta[prop]/10000);
            		}
        		}else{
        			var metaSplit = meta[prop]/10000;
        			series.push(meta[prop]/10000);
        		}
        		m = formatMoney(meta[prop],true);
        		this.bar.detail.append('<dl><dt>'+prop+'</dt><dd class="number">'+m.number+'</dd><dd class="unit">'+m.unit+'</dd></dl>');
        	}
        	var min = getMinInArr(series);
        	var max = getMaxInArr(series);
        	var indexMin = getIndex(min,series);
        	var indexMax = getIndex(max,series);
        	var maximum = [];
        	maximum.push({name: '最大值', value:max,xAxis:indexMax,yAxis:max,});
        	if(min != max){
        		maximum.push({name: '最小值', value:min,xAxis:indexMin,yAxis:min});
        	}else{
        		var flag = getTwoSame(series);
        		if(flag){
        			indexMin = getSameTwoIndex(min,series);
        			maximum.push({name: '最小值', value:min,xAxis:indexMin,yAxis:min,});
        		}
        	}
            var option = this.bar.option = {
        	    title : {
        	        text: this.bar.title,
        	    },
        	    noDataLoadingOption : metaData.noDataEffect(this.btarget,'bar'),
        	    tooltip : {
        	        trigger: 'item'
        	    },
        	    toolbox: {
        	        show : true,
        	        feature : {
        	            restore : {show: true},
        	        }
        	    },
        	    calculable : false,
        	    xAxis : [
        	        {
        	            type : 'category',
        	            data : legend
        	        }
        	    ],
        	    yAxis : [
        	        {
        	            type : 'value'
        	        }
        	    ],
        	    series : [{
    	            name:this.bar.itemTitle,
    	            type:'bar',
    	            itemStyle : itemStyle,
    	            markPoint : metaData.genBarMarkPoint(maximum),
    	            data:series
    	        }]
        	};
            try{
				 myChart.setOption(option);
			 }catch(e){
				 metaData.chartEmpty(this.btarget,'bar');
			 }
        }).call(this);
    	/**
    	 * 渲染line
    	 * @author yangfan 2016-01-06
    	 * @param params
    	 * @return
    	 */
        (function(){
    		if(!this.line||!this.line.data)return;
    		var myChart = this.line.chart = ec.init(this.ltarget);
            myChart.setTheme(this.theme);
            if(ObjectUtils.notEmpty(this.line.data)){
            	metaData.clearChartEmpty(this.ltarget);
            }
            var meta = this.line.data;
            var axis = [],series = [];
    		for(var prop in meta){
				 axis.push(prop+'日');
				 series.push(meta[prop]/10000);
    		}
			 var option = {
				  title : {
				    text: this.line.title,
				    subtext: '日期/单位：（万元）',
				  },
				  noDataLoadingOption : metaData.noDataEffect(this.ltarget,'bar'),
				    tooltip : {
				        trigger: 'item'
				    },
				    calculable : true,
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : axis
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            axisLabel : {
				                formatter: '{value}'
				            }
				        }
				    ],
				    toolbox: {
        	        show : true,
        	        feature : {
        	            restore : {show: true},
        	        }
        	    },
				    series : [
				        {
				            name:'最低资金',
				            type:'line',
				            data:series,
				            itemStyle : itemStyle,
				        }
				    ]
				};
			 try{
				 myChart.setOption(option);
			 }catch(e){
				 metaData.chartEmpty(this.ltarget,'bar');
			 }
    	}).call(this);
    },
    /**
	 * metaData中很多对象都会回调这个方法，这个方法用于加载图表所需的数据
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	callback:function(){
		var _t = this;
		if(metaData.ec){
			metaData.render.call(_t,metaData.ec);
			metaData.firstLoad=false;
		}else{
			require(
		        [
		            'echarts',
		            'echarts/chart/pie',
		            'echarts/chart/bar',
		            'echarts/chart/line',
		            'zrender/tool/color',
		            'echarts/config'
		        ],
		        function(ec){
		        	//对指定的图表进行渲染
		        	metaData.render.call(_t,ec);
		        	metaData.firstLoad=false;
	        	}
		    );
		}
	}
};
$(function(){
	//触发点击
	$(document).on("click", "#billList>tbody>tr",function(e){
		$("td:first span",this).trigger('click');
	});
	var $billList = $("#billList");
	/**
	 * 点击已选择票据明细中的全选按钮
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	$billList.on("click","tr th span",function(){
		var flag = false;
		$billList.find("tr td span").each(function(){
			if($(this).hasClass("checked")){
				flag = true;
				return false
			}
		});
		var flagByAll = false;
		if(flag){
			$billList.find("tr td span").each(function(){
				//如果全选按钮没有选择
				if(!$billList.find("tr th span").hasClass("checked")){
					if(!$(this).hasClass("checked")){
						$(this).trigger('click');
					}
				}else{
					if($(this).hasClass("checked")){
						$(this).trigger('click');
					}
				}
			});
		}else{
			$billList.find("tr td span").each(function(){
				$(this).trigger('click');
			});
		}
	});
	var splitByPer = [];
    var splitByAmt = [];
    var chooseBill = [];
    /**
	 * 点击已选择票据明细中的票据
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	$(document).on("click", "#billList tr td .inp-check", function(e) {
		if(!metaData.trigger)return false;
	    var $this = $(this);
	    var checked = $this.hasClass("checked");
	    var detail = metaData.detail.data;
	    var list = metaData.list.data.result;
	    var curr = list[$this.parent().parent().index()];
	    var $checkeds = $('#billList tr .checked');
	    metaData.dimensions["querys.checkList"] = metaData.dimensions["querys.checkList"]||[];
	    if(checked){//选择票据
	    	metaData.dimensions["querys.checkList"].push(parseInt($this.next().val()));
	    	//当前加权平均值*现在票据总面额/增加后票据总面额+（增加票据面额/增加后的票据总面额*增加的票据贴现率）
	    	//detail.weightedAverageYield = detail.weightedAverageYield*detail.totalBillAmt/(detail.totalBillAmt+curr.faceAmt)+(curr.faceAmt/(detail.totalBillAmt+curr.faceAmt)*curr.yearlyRate);
	    	detail.totalInvestmentAmt+=curr.subscriptionAmt;
	    	detail.totalBillAmt+=curr.faceAmt;

	    	/**
	    	 * 当选择选择了票据的时候,对筛选区的需要改变的数据进行计算
	    	 */
	    	splitByPer = [];
	    	splitByAmt = [];
	    	$this.parent().parent().parent().find("tr td span").each(function(){
				if($(this).hasClass("checked")){
					var curr = $(this).parent().parent().index();
					//获取匹配上的，然后根据匹配来赋值
					splitByPer.push(list[curr].discountRate+":"+list[curr].billNo);
					splitByAmt.push(list[curr].faceAmt+":"+list[curr].billNo);
				}
			});
	    	detail.weightedAverageYield = 0;
	    	for(var i = 0;i < splitByPer.length;i++){
	    		if(splitByPer[i] && splitByAmt[i]){
	    			detail.weightedAverageYield += splitByAmt[i].split(":")[0]/detail.totalBillAmt*splitByPer[i].split(":")[0];
	    		}
	    	}
	    	detail.totalDueYield = detail.totalBillAmt - detail.totalInvestmentAmt;
	    	detail.totalBillCnt++;
	    	$('.tab-main .nav-tabs li[hidden]').removeClass('hidden');
			$('.tab-main .nav-tabs li a').attr("lazy-load","true").filter('[href="#tab2"]').attr("lazy-load","false").trigger("click");
	    }else{//取消选择
	    	metaData.dimensions["querys.checkList"].remove(parseInt($this.next().val()));
	    	//(当前加权平均值-（减少的票据面额/减少前票据总面额*减少的票据的贴现率）)*减少前票据总面额/(减少前票据总面额-减少的票据面额）
	    	//detail.weightedAverageYield = (detail.weightedAverageYield-(curr.faceAmt/detail.totalBillAmt*curr.yearlyRate))*detail.totalBillAmt/(detail.totalBillAmt-curr.faceAmt);
	    	detail.totalInvestmentAmt-=curr.subscriptionAmt;
	    	detail.totalBillAmt -= curr.faceAmt;

	    	/**
	    	 * 当取消选择选择了票据的时候,对筛选区的需要改变的数据进行计算
	    	 */
	    	splitByPer = [];
	    	splitByAmt = [];
	    	$this.parent().parent().parent().find("tr td span").each(function(){
				if($(this).hasClass("checked")){
					var curr = $(this).parent().parent().index();
					//获取匹配上的，然后根据匹配来赋值
					splitByPer.push(list[curr].discountRate+":"+list[curr].billNo);
					splitByAmt.push(list[curr].faceAmt+":"+list[curr].billNo);
				}
			});
	    	for(var i = 0;i < splitByPer.length;i++){
	    		if(splitByPer[i] && splitByAmt[i]){
	    			if(splitByPer[i].split(":")[1] === curr.billNo){
	    				splitByPer.splice(i, 1);
	    			}

	    			if(splitByAmt[i].split(":")[1] === curr.billNo){
	    				splitByAmt.splice(i, 1);
	    			}
	    		}
	    	}
	    	detail.weightedAverageYield = 0;
	    	for(var i = 0;i < splitByPer.length;i++){
	    		if(splitByPer[i] && splitByAmt[i]){
	    			detail.weightedAverageYield += splitByAmt[i].split(":")[0]/detail.totalBillAmt*splitByPer[i].split(":")[0];
	    		}
	    	}
	    	detail.totalDueYield = detail.totalBillAmt - detail.totalInvestmentAmt;
	    	detail.totalBillCnt--;
	    }
	    disabledInvest();
    	var overview = metaData.overview;
    	/**
    	 * 如果把所有的选择都去掉了,那么tab页要变换，刷新数据
    	 */
	    if(detail.totalBillCnt===0){
    		$('.tab-main .nav-tabs li[hidden]').addClass('hidden');
			$('.tab-main .nav-tabs li a').attr("lazy-load","true").filter('[href="#tab1"]').attr("lazy-load","true").trigger("click");
			overview.pie1.data = {};
			overview.pie2.data = {};
			overview.bar.data = {};
			detail.weightedAverageYield = 0;
			detail.totalInvestmentAmt = 0;
			detail.totalDueYield = 0;
			metaData.dimensions["querys.billAmt"] = 0;
			metaData.detail.load = true;
		    metaData.refresh.call(metaData);
			return false;
    	}

	    /**
	     * 对已选票据进行计算，然后显示出来
	     */
		overview.load = true;
		var $acceptBankType = $('div.acceptBankType');
		var $yearlyRateArea = $('div.yearlyRateArea');
		var key,area,rate,date;
		var d = list[$this.parent().parent().index()];
		key = $acceptBankType.filter('[codeValue='+d.acceptBankTypeCd+']').attr('codeName');
		overview.pie1.data = overview.pie1.data||{};
		if(!(overview.pie1.data[key])){
			overview.pie1.data[key]=0;
		}
		if(checked){
			overview.pie1.data[key]+=d.faceAmt;
		}else{
			overview.pie1.data[key]-=d.faceAmt;
		}
		if(overview.pie1.data[key]===0){
			delete overview.pie1.data[key];
		}
		$yearlyRateArea.each(function(){
			rate = d.discountRate;
			key = $(this).attr('codeName');
			area = $(this).attr('codeDesc').split(',');
			if(rate>parseFloat(area[0])&&rate<=parseFloat(area[1])){
				overview.pie2.data = overview.pie2.data||{};
				if(!(overview.pie2.data[key])){
					overview.pie2.data[key] = 0;
				}
				if(checked){
					overview.pie2.data[key]+=d.faceAmt;
				}else{
					overview.pie2.data[key]-=d.faceAmt;
				}
				if(overview.pie2.data[key]===0){
					delete overview.pie2.data[key];
				}
				return false;
			}
		});
		date = new Date(d.accountDate);
		key = date.format("yyyy-MM");
		overview.bar.data = overview.bar.data||{};
		if(!(overview.bar.data[key])){
			overview.bar.data[key] = 0;
		}
		if(checked){
			overview.bar.data[key]+=d.faceAmt;
		}else{
			overview.bar.data[key]-=d.faceAmt;
		}
		if(overview.bar.data[key]===0){
			delete overview.bar.data[key];
		}
	    metaData.detail.load = true;
	    //刷新图表数据
	    metaData.refresh.call(metaData);
	    /*$('#billList tr .inp-check').popover('destroy');
	    if($this.hasClass("checked")&&metaData.dimensions["querys.billAmt"]&&detail.totalBillAmt&&detail.totalBillAmt>metaData.dimensions["querys.billAmt"]){
			$this.popover({
				placement : "right",
				html : true,
				trigger : "focus",
				content : "您当前选择的票据已经超过票面金额"
			}).popover('show');
		}*/
	});
	/**
	 * 点击已选票据明细的加载按钮
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	$('#billList tr .lazy-load').click(function(){
		var $this = $(this);
		var list = metaData.list;
		list.before.call(list);
		metaData.dimensions["entity.pageNo"]++;
		timeout(function(){
			$.getJSON(ROOT+"/invest/lazyload",metaData.dimensions,function(m){
				metaData.trigger = false;
				//回调lazyload，把数据显示出来
				list.lazyload.call(list,m);
				metaData.trigger = true;
			});
		});
	});
	/**
	 * 点击已选票据明细的排序
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	var $orders = $('#billList thead tr th.order').click(function(){
		var list = metaData.list;
		list.before.call(list);
		var regex = /orders\['\w*'\]/;
		for(var prop in metaData.dimensions){
			if(regex.test(prop)){
				delete metaData.dimensions[prop];
			}
		}
		if($(this).is('.order.null'))metaData.dimensions["orders['"+$(this).attr("by")+"']"] = undefined;
		timeout(function(){
			$orders.not(".null").each(function(){
				metaData.dimensions["orders['"+$(this).attr("by")+"']"] = $(this).is(".up")?1:0;
			});
			//dimensions中的checkList不能带到后台，因为点击排序不需要选择票据
			if(metaData.dimensions["querys.checkList"] || metaData.dimensions["querys.checkList"] == null){
				metaData.dimensions["querys.checkList"] = undefined;
			}

			//如果在票据明细中不止一页数据，那么点击排序要把所有的加载完的数据显示出来
			var pageSize = metaData.dimensions["entity.pageSize"];
			var pageNo = metaData.dimensions["entity.pageNo"];
			metaData.dimensions["entity.pageSize"] = pageSize*pageNo;
			metaData.dimensions["entity.pageNo"] = 1;
			$.getJSON(ROOT+"/invest/order",metaData.dimensions,function(m){
				$("#billList").find("tr th span").removeClass("checked");
				metaData.reset.call(metaData,m);

				if($("a[href='#tab2']").parent("li").hasClass("active") || $("a[href='#tab4']").parent("li").hasClass("active")){
					$('.tab-main .nav-tabs li[hidden]').addClass('hidden');
					$('.tab-main .nav-tabs li a').attr("lazy-load","true").filter('[href="#tab1"]').attr("lazy-load","true").trigger("click");

					metaData.dimensions["querys.billAmt"] = 0;
					metaData.detail.load = true;
				}

				//如果在票据明细中不止一页数据，那么点击排序要把所有的加载完的数据显示出来
				metaData.dimensions["entity.pageSize"] = pageSize;
				metaData.dimensions["entity.pageNo"] = pageNo;
			});
		});
	});
	var $tab_disabled = $('#tab-disabled');
	/**
	 * 点击页面的4个标签页
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	$('.tab-main .nav-tabs li a').click(function(){
		var $this = $(this);
		var url = $(this).attr('meta-url');
		var target = $(this).attr('meta-target');
		var lazyload = $(this).attr('lazy-load');
		if(lazyload==='true'){
			$tab_disabled.show();
			$(this).attr('lazy-load','false');
			metaData[target].before.call(metaData[target]);
			timeout(function(){
				$.getJSON(url,metaData.dimensions,function(m){
					metaData.reset.call(metaData,m);
					$tab_disabled.hide();
					if($this.attr("meta-target") != "invest"){
						var _t;
						if($this.attr("meta-target") === "flow"){//如果点击的是当前现金流量
							_t = metaData.flow;
						}else if($this.attr("meta-target") === "forecast"){//如果点击的是投后现金流量预测
							_t = metaData.forecast;
						}
						var date = JSON.stringify(_t.bar.data).split(",")[0].replace("{\"","").replace("\"","").split(":")[0];
						_t.loading.last().show();
			        	metaData.dimensions.year = parseInt(date.split('-')[0]);
			        	metaData.dimensions.month = parseInt(date.split('-')[1]);
			        	var myChart = _t.line.chart = _t.line.chart || metaData.ec.init(_t.ltarget);
			        	try{
			        		myChart.setTheme(_t.theme);
			        	}catch(e){}
	        			mz = _t.line.data;
	        			var lastDate = getDaysInMonth(metaData.dimensions.year,metaData.dimensions.month);
		       			for(var i=1;i<=lastDate;i++){
		       				 if(!mz[i]){
		       					mz[i] = 0;
		       				 }
		       			 }
	        			 var axis = [],series = [];
	        			 if(ObjectUtils.notEmpty(mz)){
	     	            	metaData.clearChartEmpty(_t.ltarget);
	     	            }
	        			 for(var prop in mz){
	        				 axis.push(prop+'日');
	        				 series.push(mz[prop]/10000);
	        			 }
	            		 var option = {
	    				  title : {
	    				    text: date+_t.line.title,
	    				    subtext: '日期/单位：（万元）',
	    				  },
	    				  noDataLoadingOption : metaData.noDataEffect(_t.ltarget,'bar'),
	    				    tooltip : {
	    				        trigger: 'item'
	    				    },
	    				    calculable : true,
	    				    xAxis : [
	    				        {
	    				            type : 'category',
	    				            boundaryGap : false,
	    				            data : axis
	    				        }
	    				    ],
	    				    yAxis : [
	    				        {
	    				            type : 'value',
	    				            axisLabel : {
	    				                formatter: '{value}'
	    				            }
	    				        }
	    				    ],
	    				    toolbox: {
			        	        show : true,
			        	        padding :[12, 20 ,0 ,0],
			        	        feature : {
			        	            restore : {show: true},
			        	        }
			        	    },
	    				    series : [
	    				        {
	    				            name:'现金流量',
	    				            type:'line',
	    				            itemStyle : itemStyle,
	    				            data:series,
	    				        }
	    				    ]
	    				};
	            		 try{
	            			 myChart.setOption(option);
	            		 }catch(e){
	            			 metaData.chartEmpty(_t.ltarget,'bar');
	            		 }
	            		_t.loading.last().hide();
					}
				});
			});
		}
	});
	/**
	 * 点击筛选,异步提交表单
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	$('#mainForm').bootstrapValidator({
		excluded: [':disabled', ':hidden', ':not(:visible)']}).on('success.form.bv', function(e,b) {
        e.preventDefault();
        $(".popover").hide();
        var $form = $(e.target);
        //根据条件显示筛选数据
    	metaData.change.call(metaData,$form);
    });
	/**
	 * 点击我要投资
	 * @author yangfan 2016-01-06
	 * @param params
	 * @return
	 */
	$("#invest").click(function(){
		var $form = $("#"+$(this).attr("form"));
		var checkList = metaData.dimensions["querys.checkList"];
		if(checkList.length===0)return;
		$form.empty();
		for(var i=0;i<checkList.length;i++){
			$("<input type=\"hidden\" name=\"billCanInvestBillVO.checkList\" value=\""+checkList[i]+"\">").appendTo($form);
		}
		$form.submit();
	});
	$('.form-horizontal .ico-check.chk-all').trigger('click');
	$tab_disabled.show();
});
/**
 * 投资按钮是否可以点击的设置
 * @author yangfan 2016-01-06
 * @param params
 * @return
 */
function disabledInvest(){
	var checkList = metaData.dimensions["querys.checkList"];
	if(checkList&&checkList.length>0){
		$("#invest").removeAttr("disabled");
	}else{
		$("#invest").attr("disabled",true);
	}
}
/**
 * 定时器
 * @author yangfan 2016-01-06
 * @param params
 * @return
 */
function timeout(callback,effect){
	window.setTimeout(callback,effect||metaData.effect);
}
/**
 * 当前可投票据和已选票据概览的折线图的点击事件的绑定
 * @author yangfan 2016-01-06
 * @param params
 * @return
 */
function billAfter(){
	var _t = this;
	var ecConfig = metaData.ecConfig = metaData.ecConfig || require('echarts/config');
	timeout(function(){
		//点击柱状图执行下面的代码
		_t.bar.chart.on(ecConfig.EVENT.CLICK, function(param){
			_t.loading.last().show();
        	var date = param.name;
        	metaData.dimensions.year = parseInt(date.split('-')[0]);
        	metaData.dimensions.month = parseInt(date.split('-')[1]);
        	$(_t.btarget).hide();
        	$(_t.ltarget).show();
        	var myChart = _t.line.chart = _t.line.chart || metaData.ec.init(_t.ltarget);
        	myChart.setTheme(_t.theme);
        	timeout(function(){
        		$.getJSON(_t.line.url,metaData.dimensions,function(m){
        			var lastDate = getDaysInMonth(metaData.dimensions.year,metaData.dimensions.month);
        			//所有月份都在折现图中显示出来
	       			for(var i=1;i<=lastDate;i++){
	       				 if(!m[i]){
	       					 m[i] = 0;
	       				 }
	       			 }
        			var axis = [],series = [];
        			if(ObjectUtils.notEmpty(m)){
        				metaData.clearChartEmpty(_t.ltarget);
    	            }
        			 for(var prop in m){
        				 axis.push(prop+'日');
        				 series.push(m[prop]/10000);
        			 }
            		 var option = {
    				  title : {
    				    text: date+_t.line.title,
    				    subtext: '日期/单位：（万元）',
    				  },
    				  noDataLoadingOption : metaData.noDataEffect(_t.ltarget,'bar'),
    				    tooltip : {
    				        trigger: 'item'
    				    },
    				    calculable : true,
    				    xAxis : [
    				        {
    				            type : 'category',
    				            boundaryGap : false,
    				            data : axis
    				        }
    				    ],
    				    yAxis : [
    				        {
    				            type : 'value',
    				            axisLabel : {
    				                formatter: '{value}'
    				            }
    				        }
    				    ],
    				    toolbox : {
    				    	show : true,
    				    	padding :[12, 20 ,0 ,0],
    				        feature : {
    				            myTool : {
    				                show : true,
    				                title : '现金流量（按年）',
    				                icon : 'image://'+ROOT+'/images/histogram.png',
    				                onclick : function (){
    				                	$(_t.ltarget).hide();
    				                	$(_t.btarget).show();
    				                	_t.bar.chart.resize();
    				                }
    				            },
    				            restore : {show: true},
    	        	            //saveAsImage : {show: true}
    				        }
    				    },
    				    series : [
    				        {
    				            name:'现金流量',
    				            type:'line',
    				            data:series,
    				            itemStyle : itemStyle,
    				        }
    				    ]
    				};
            		 try{
            			 myChart.setOption(option);
            		 }catch(e){
            			 //提示没有数据
            			 metaData.chartEmpty(_t.ltarget,'bar');
            		 }
            		 _t.loading.last().hide();
    			});
        	});
        });
	});
}

/**
 * 当前现金流量和投后现金流量预测的折线图的点击事件的绑定
 * @author yangfan 2016-01-06
 * @param params
 * @return
 */
function flowAfter(){
	var _t = this;
	var ecConfig = metaData.ecConfig = metaData.ecConfig || require('echarts/config');
	timeout(function(){
		_t.bar.chart.on(ecConfig.EVENT.CLICK, function(param){
			_t.loading.last().show();
        	var date = param.name;//年、月
        	metaData.dimensions.year = parseInt(date.split('-')[0]);
        	metaData.dimensions.month = parseInt(date.split('-')[1]);
        	var myChart = _t.line.chart = _t.line.chart || metaData.ec.init(_t.ltarget);
        	try{
        		myChart.setTheme(_t.theme);
        	}catch(e){}
        	timeout(function(){
        		$.getJSON(_t.line.url,metaData.dimensions,function(m){
        			var lastDate = getDaysInMonth(metaData.dimensions.year,metaData.dimensions.month);
        			//所有月份都在折现图中显示出来
        			for(var i=1;i<=lastDate;i++){
        				 if(!m[i]){
        					 m[i] = 0;
        				 }
        			 }
        		 var axis = [],series = [];
        		 if(ObjectUtils.notEmpty(m)){
        	     	metaData.clearChartEmpty(_t.ltarget);
        	     }
        		 for(var prop in m){
        			 axis.push(prop+'日');
        			 series.push(m[prop]/10000);
        		 }
        		 var option = {
        		  title : {
        		    text: date+_t.line.title,
        		    subtext: '日期/单位：（万元）',
        		  },
        		  noDataLoadingOption : metaData.noDataEffect(_t.ltarget,'bar'),
        		    tooltip : {
        		        trigger: 'item'
        		    },
        		    calculable : true,
        		    xAxis : [
        		        {
        		            type : 'category',
        		            boundaryGap : false,
        		            data : axis
        		        }
        		    ],
        		    yAxis : [
        		        {
        		            type : 'value',
        		            axisLabel : {
        		                formatter: '{value}'
        		            }
        		        }
        		    ],
        		    toolbox: {
        		        show : true,
        		        padding :[12, 20 ,0 ,0],
        		        feature : {
        		            restore : {show: true},
        		            //saveAsImage : {show: true}
        		        }
        		    },
        		    series : [
        		        {
        		            name:'现金流量',
        		            type:'line',
        		            itemStyle : itemStyle,
        		            data:series,
        		        }
        		    ]
        		};
        		 try{
        			 myChart.setOption(option);
        		 }catch(e){
        			 //显示没有数据提示
        			 metaData.chartEmpty(_t.ltarget,'bar');
        		 }
        		_t.loading.last().hide();
    			});
        	});
		});
	});
}
