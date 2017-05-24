let arr = [
    {"a" : 1},
    {'b' : 2 }
];
let a = [
    [
        0,
        1,
        2
    ]
]

for(let i = 0; i<a.length; i++){
    for (let b = 0; b<a[i].length; b++){
        console.log(b);
    }
}
let c = () => 0;
(function d() {
    console.log( 'd' );
})()
console.log(c());



let d = (x=1, y=2) => x+y;
console.log( d() );


let f = (x=1, y=2) => {
    let tmp = "";
    tmp = x;
    x = y;
    y = tmp;
    return [
        x,
        y
    ]
};

console.log(f(2, 1))


function cal(x, callback){
    callback(x);
}

cal(5, (sssssss)=> console.log(sssssss) );

cal(10, function(res){
    console.log(res);
})


//Promise


function runAsync(){
    var p = new Promise(function(success, error){
        //做一些异步操作
        setTimeout(function(){
            console.log(Date()+': 执行完成');
            //resolve(Date()+': 随便什么数据');
            error(Date()+': xxxx')
        }, 2000);
    });
    return p;
}
function runAsync1(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log(Date()+': 执行完成1');
            resolve(Date()+': 随便什么数据1');
            reject(Date()+': xxxx1');
        }, 2000);
    });
    return p;
}

runAsync().then(function(data){
    console.log(data);
    return runAsync1();
}).then(function(data) {
    console.log(data)
}).catch(function(reason){
    console.log('rejected');
    console.log(reason);
});


function getNumber(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            var num = Math.ceil(Math.random()*10); //生成1-10的随机数
            if(num<=5){
                resolve(num);
            }
            else{
                reject(Date()+': 数字太大了');
            }
        }, 2000);
    });
    return p;
}

getNumber()
    .then(
        function(data){
            console.log(Date()+': resolved');
            console.log(data);
        },
        function(reason, data){
            console.log(Date()+': rejected');
            console.log(reason);
        }
    );



//定义类
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}


$point = new Point(1, 2);
console.log( $point.toString() );

var url = "http://localhost/3d/xxxx.php";

// fetch( url )
//     .then(
//         function(response){
//             if(response.status!==200){
//                 console.log("存在一个问题，状态码为："+response.status);
//                 return;
//             }
//             //检查响应文本
//             response.json().then(function(data){
//                 console.log(data);
//             });
//         }
//     )
//     .catch(function(err){
//         console.log("Fetch错误:"+err);
//     });


// fetch(url, {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//     },
//     body: "firstName=Nikhil&favColor=blue&password=easytoguess"
// }).then(function(res) {
//     if (res.ok) {
//
//         //获取后台相应内容
//         res.json().then(function(data){
//             console.log(data.password);
//         })
//         console.log(res);
//         //alert("Perfect! Your settings are saved.");
//     } else if (res.status == 401) {
//         alert("Oops! You are not authorized.");
//     }
// }, function(e) {
//     alert("Error submitting form!");
// });


/*fetch(url, {
    method:"GET"
}).then(function(res){
    res.json().then(function(data){
        console.log(data);
    })
})*/


var test = {

    getList() {
        return [
            {"id":"1", "title":"标题1", "content":"内容1"},
            {"id":"2", "title":"标题2", "content":"内容2"},
            {"id":"3", "title":"标题3", "content":"内容3"},
            {"id":"4", "title":"标题4", "content":"内容4"}

        ]
    },
    getOne( newsid ) {
        var i  = -1;
        var getRet =  this.getList().map((item, index)=>{
            if(newsid == item.id) {
                i = index;
               return item;
            }
        })
        if(i>=0){
            return getRet[i]
        }else{
            return null;
        }
    }
}

console.log( test.getOne(1) );
