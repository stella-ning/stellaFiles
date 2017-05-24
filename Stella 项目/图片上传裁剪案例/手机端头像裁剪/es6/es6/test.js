
let arr = [2, 4, 6, 8, 10, 12];
let newArr = arr.map((n)=>n * 2);
//console.log(newArr);

let person = {
    name : "wencongsheng",
    sayName : function () {
        console.log(`my name is ${this.name}`)
    },
    sayHello : ()=>{
        console.log(`my name is ${this.name}`) //scope //parent
        console.log(this.name) // " "
    },
    say(){
        console.log(`my name is ${this.name}`)
    },
    hobbies: ['robots', 'computers', 'internet'],
    showHobb(){
        /*this.hobbies.forEach((hobb)=>{
         console.log(this)
         console.log(`${this.name} likes ${hobb}` )
         })*/
        let self = this;
        this.hobbies.forEach(function(hobb){ //this  window
            console.log(`${self.name} likes ${hobb}` )
        })
    },
}
// person.sayName();
// person.sayHello();
// person.say();
// person.showHobb();

//arguments
let name = function(){
    //console.log(arguments);
    return Array.prototype.reduce.call( arguments, (prev, curr)=>{
        return prev + curr;
    });
}
//console.log( name(1, 2, 3, 4, 5, 6) )

let sum = function(...args) {
    return args.reduce((prev, curr)=>prev+curr);
}

//console.log( sum(1, 2, 3, 4, 5) );

let multiply = (mul, ...numbers) => {
    //console.log(mul, numbers);
    return numbers.map((n)=>{
        return mul * n;
    })
}
let result = multiply(2, 2, 3, 4, 5)
//console.log(result);

//let max = Math.max(4, 5, 6, 7);
//console.log(max)

let numbers = [4, 6, 8, 10];
//let max = Math.max.apply(null, numbers);
let max = Math.max(...numbers);
//console.log(max)
let newNumbers = [1, 2, 3, 4, 5];
//let concatArray = newNumbers.concat(numbers);
let concatArray = [6, 7, 8, 9, ...newNumbers];
//console.log(concatArray);

//promise
let myPromise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve("Good to go!");
    }, 1000);
    /*setTimeout(()=>{
     reject("un oh!");
     }, 500)*/
})
//myPromise.then(res=>console.log(res),err=>console.log(err));
//myPromise.then(res=>console.log(res)).catch (err=>console.log(err))
let myPromise2 = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        reject("Promise2 - the promise");
    }, 1500);
    /*setTimeout(()=>{
     reject("un oh!");
     }, 500)*/
})
Promise.all([myPromise, myPromise2]).then(data=>console.log(data)).catch (err=>console.log(err))

//fetch

fetch('http://api.icndb.com/jokes/random/10')
    .then(res=>{
        res.json().then(data=>{
            console.log(data)
        })
    })

