const readline = require('readline');
const amountData = require('./app/amount.js');
const fs = require('fs');
const rs = fs.createReadStream('./db/result.txt');
const rl = readline.createInterface({
    input: rs,
    crlfDelay: Infinity
  });
let fronts = [];
let behinds = [];
let rowIndex = 0;
rl.on('line', (line) => {    
    let peerTerm = line.split(',');
    fronts[rowIndex] = [];
    behinds[rowIndex] = [];
    peerTerm.forEach(function(single,index){
        if(single.indexOf('#') === -1){
            fronts[rowIndex].push(parseInt(single));
        }else{
            behinds[rowIndex].push(parseInt(single.substring(1,3)));
        }
    });
    rowIndex++;
});

rs.on('end',function(){
    
    amountData(fronts,behinds);

});

function print(data){
    console.log(data);
}