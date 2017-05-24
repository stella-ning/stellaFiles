function showBox( content ) {
    var alarm =$('.alarm');
    alarm.html(content);
    alarm.show();
    setTimeout(function(){
        alarm.hide();
    }, 3000)
}

var cart = {
    price,
    init(){
        //初始化
        $('.child, .adult, .total_feel').html("--");
        $('.num').html(0);
    },
    getOne( id ) {
        this.init();
        var i  = -1;
        //console.log(typeof price);return false;
        var getRet =  price.map((item, index)=>{
            if( id == item.id ) {
                i = index;
                return item;
            }
        });
        if(i>=0){
            this.line = getRet[i];
            this.ininCount(this.line);
            return getRet[i];
        }else{
            return null;
        }
    },
    getAdults() {
        if( this.line ) {
            return this.line.cur_price;
        }
        return false;
    },
    getChild() {
        if( this.line ) {
            return this.line.child_price;
        }
        return false;
    },
    ininCount(target) {
        //初始化购物车人数
        target['adult_count'] = 0;
        target['child_count'] = 0;

    },
    changePrice(target, price) {
        if( ! price ) {
            target.html('--')
        }else{
            target.html(price)
        }
    },
    setCount(target, count, callback) {
        var child_count = this.line.child_count;
        var adult_count = this.line.adult_count;
        if(target == "child") {
            this.line.child_count = count;
        }else{
            this.line.adult_count = count;
        }
        var total_count = parseInt(this.line.child_count) + parseInt(this.line.adult_count);
        if( total_count > this.line.person ) {
            this.line.child_count = child_count;
            this.line.adult_count = adult_count;
            callback();
            return false;
        }
        return true;
    },
    getTotalFeel(){
        if( this.line.adult_count !=0 || this.line.child_status !=0 ) {
            this.line['total_feel'] = ( parseInt( this.line.adult_count ) * parseInt( this.line.adult_price ) ) + ( parseInt( this.line.child_count ) * parseInt( this.line.child_price ) )
            return this.line.total_feel;
        }
    }
};

$('.line').tap(function(){
    var id = $(this).attr('info_id');
    cart.getOne(id);
});


function generateForm( data ) {

        if( !data || parseInt( data['total_feel'] ) == 0 ){
            var text  = "请选择";
            showBox(text);
            return false;
        }
        let len = Object.keys(data).length;
        let key = Object.keys(data);
        let form ="";
        form += "<form id='form1' action="+jumpUrl+" method='post'>";

        for(let i = 0 ; i < len; i++){
           // console.log(data[i])
            form += "<input type='hidden' name='"+key[i]+"' value='"+data[key[i]]+"' />";
        }
        form += "</form>";
    //console.log(form);
    $('.alarm').append(form);
    $('#form1').submit();

}


//  没用的 ======
function getData( data ) {
    console.log(data)
}
function getAjaxData(url, data, callback){
    $.post(url, data, function(data){
        callback(data);
        /*if(data.status==1){
         callback(data);
         }else{
         console.error('数据不对啊:',data);
         }*/
    })
}
// 没用的 ======


/*
*  点击提交
*
* */

$('.next_step').tap(function(){
    //alert(1)
    //console.log(cart);return ;
    generateForm(cart['line']);
});