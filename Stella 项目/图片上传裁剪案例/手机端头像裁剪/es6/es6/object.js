

var god = {
    version : "1.01",
    extend(name, news) {
        //1. 先把当前对象所有属性加入到变量中
        this.init();
        if("data" in news && "methods" in news && typeof news.data == "function" && typeof news.methods =="object") {
            // 获取news.data 所有数据
            var getData = news.data();
            // 获取news.func 所有数据
            var func = news.func;
            if(typeof getData == "object") {
                //把对象全都合并进news.methods内
                Object.assign(news.methods, getData, func, this);
                this[name] = news;
            }
            //监控obj.methods里的 属性
            for(var prop in getData) {
                this.watch(prop, news.methods, ()=>{this.display(name)})
            }
        }
    },
    init(){
        // 2. 定义不能枚举的对象
        Object.defineProperties(this, {
            "init" : {
                enumerable : false  //设置属性不可枚举
            },
            "extends" : {
                enumerable: false //设置属性不可枚举
            }
        });
        //获取当前对象的所有 可枚举的 对象 key
        var keys = Object.keys(this) ;
        this.$g = {}
        //把所以的key value 都保存在$g 这个全局变量里
        keys.forEach((key)=>{
            this.$g[key] = this[key];
        });
        //监听了 version这个key
        this.watch("version", this.$g);
    },

    /* 监控功能
    *  @param keyWord string 要监听的属性
    *  @param obj object        监听属性的对象
    *  @param func function    触发事件时掉用的回调函数
    * */
    watch(keyWord, obj, func) {
        var _key = "_"+keyWord;
        //判断要监听的 属性值是否在 obj 内
        //没有就初始化一个值给他
        if( ! (_key in obj) ) {
            obj[_key] = obj[keyWord];
        }
        /*
        *  对象监听
        *  set 触发后会执行函数
        * */
        Object.defineProperty(obj, keyWord, {
            get(){
                return obj[_key];
            },
            set : value=> {
                obj[_key] = value;
                func();
            }
        })
    },
    /*
    *  渲染
    * */
    render(){
        document.getElementById("test").innerHTML = "当前版本是:"+this.$g.version;
    },
    display(objName) {
        var getTpl = this[objName].template;
        for(var prop in this[objName].methods) {
            getTpl = getTpl.replace("{{"+prop+"}}", this[objName].methods[prop]);
        }
        document.getElementById("test").innerHTML = getTpl;

    }
};



var news = {
    template : "<a href='/new/{{id}}'>{{title}}</a>",
    data() {
        return {
            id : 101,
            title : "今天天气不错"
        }
    },
    methods: {
        show(){
            alert(this.$g.version);
            //alert(this.title);
            alert(this.$g.version = 2);//
        },
        movie() {
            this.id = "xxxooo";
            this.title = "小白闯荡记";
        }
    },
    func : {
        cc(){
            alert(this.id)
        }
    }
};


//注册合拼事件
god.extend("news", news);
//news.methods.show();

