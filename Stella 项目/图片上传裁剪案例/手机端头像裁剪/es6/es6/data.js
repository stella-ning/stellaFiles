// 回调函数是一个作为参数传给另一个函数的函数，
// 另一个函数里面可以自由决定什么时候执行回调函数

var ajax = (dosth) => {
    var apiData = [
        {"id":"1", "title":"标题1", "content":"内容1"},
        {"id":"2", "title":"标题2", "content":"内容2"},
        {"id":"3", "title":"标题3", "content":"内容3"},
        {"id":"4", "title":"标题4", "content":"内容4"}
    ];
    setTimeout(()=>{
        dosth(apiData);
    }, 2000)
}


var test = {

     _cache : {
        list : [],
        detail : {}
    },
    get cache_list() {
        return this._cache['list']
    },
    set cache_list(value) {
        this._cache['list'] = value;
    },
    getList() {
        return [
            {"id":"1", "title":"标题1", "content":"内容1"},
            {"id":"2", "title":"标题2", "content":"内容2"},
            {"id":"3", "title":"标题3", "content":"内容3"},
            {"id":"4", "title":"标题4", "content":"内容4"}
        ]
    },
    //加载缓存
    loadCache(action){
           if( this._cache.list.length == 0 ) {
               //this.cache_list = this.getList()
               ajax((apidata)=>{
                   //获取数据
                   this.cache_list=apidata;
                   action() //手动do
               })
           }
    },
    getOne( newsid, callback ) {
        this.loadCache(()=>{
            var i  = -1;
            var getRet =  this.cache_list.map((item, index)=>{
                if(newsid == item.id) {
                    i = index;
                    return item;
                }
            })
            if(i>=0){
                //return getRet[i]
                callback(getRet[i]) //让用户选择该怎么处理数据
            }/*else{
                return null;
            }*/
        });

    }
}

/*
 test.getOne(1, (item)=>{
    alert(item.title)
});*/

function _callbac(dosth) {
    var data = {
        "id":1
    }
    setTimeout(()=>{
        dosth(data) //  =  (data) => {console.log(data)}
    }, 2000)
}

let ss = (data)=>{
    console.log(data);
}
//_callbac(ss)

// demo
function getAjaxData(callback){
    $.post('xx',function(data){
        if(data.status==1){
            callback(data);
        }else{
            console.error('数据不对啊:',data);
        }
    },'json')
}



function data(callback) {
    var $data = [
        {"id":1},
        {"id":2}
    ];
    callback($data)
}

data(
    (data) => {
        for ( var i in data ) {
            console.log(data[i])
        }
    },
)

