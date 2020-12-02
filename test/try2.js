let t1 = new Date();
let t2 = new Date();
console.log(t1);
console.log(t1.getTime());


setTimeout(() => {
    console.log(t1.getTime());
}, 4000);

