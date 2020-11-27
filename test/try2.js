let t1 = new Date('2020-11-27T19:38:31.472Z');
let t2 = new Date('2020-11-28T19:38:31.472Z');
console.log(t2 - t1);


setTimeout(() => {
    console.log(t1);
}, 4000);

