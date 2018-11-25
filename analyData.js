const readline = require('readline');
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

let frontModel = new Array(35).fill({}).map((item,index)=>{return {[index + 1]:0}});
let behindModel = new Array(12).fill({}).map((item,index)=>{return {[index + 1]:0}});

rs.on('end',function(){
    
    fronts.forEach((peerTerm)=>{
        peerTerm.forEach(function(single){
            if(single){
                let model = frontModel[single-1];
                model[single] ++;
            }
        });
    });

    behinds.forEach((peerTerm,index)=>{
        peerTerm.forEach(function(single){            
            if(single){
                let model = behindModel[single-1];
                model[single] ++;
            }
        });
    });

    print(JSON.stringify(frontModel));
    print(JSON.stringify(behindModel));
});

function print(data){
    console.log(data);
}