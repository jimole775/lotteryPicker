const readline = require('readline');
const createSumForm = require('./app/analyData/createSumForm.js');
const fs = require('fs');
const rs = fs.createReadStream('./db/baseStorage/amount.txt');
const rl = readline.createInterface({
    input: rs,
    crlfDelay: Infinity
  });
let fronts = [];
let behinds = [];
let rowIndex = 0;
rl.on('line', function (line){ 
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
    
    createSumForm(fronts,behinds);

});

function print(data){
    console.log(data);
}