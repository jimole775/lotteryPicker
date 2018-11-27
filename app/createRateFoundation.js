const fs = require('fs');
const path = require('path');
let loopTimes = 10000;
let front_foundation = [];
fs.readFile(path.resolve(__dirname,'../db/fronts_amount.txt'),function(err,data){
    const fronts_amount = JSON.parse(data.toString('utf-8'));
    let i = loopTimes;
    while(i--){
        const suffixNum = suffixPick(35);   
        const curItem = fronts_amount[suffixNum-1];
        const curNumRate = curItem['rate'];
        const curNumLimit = Math.round(curNumRate * loopTimes);
        curItem['times'] = curItem['times'] ? curItem['times'] : 0;
        if(curItem['times'] <= curNumLimit){
            front_foundation.push(suffixNum);
            curItem['times'] ++ ;
        }else{
            i++
        }      
    }
    
    if(front_foundation.length){
        const ws = fs.createWriteStream(path.resolve(__dirname,'../db/front_foundation.txt'),'utf8');      
        front_foundation.forEach(function(item,index){
            ws.write(item + ',');
            
            if(index === front_foundation.length - 1){
                ws.end();
            }
        });
    }

});

function suffixPick(bit){
    return Math.ceil(Math.random()*bit);
}

let behind_foundation = [];
fs.readFile(path.resolve(__dirname,'../db/behinds_amount.txt'),function(err,data){
    const behinds_amount = JSON.parse(data.toString('utf-8'));
    let i = loopTimes;
    while(i--){
        const suffixNum = suffixPick(12);   
        const curItem = behinds_amount[suffixNum-1];
        const curNumRate = curItem['rate'];
        const curNumLimit = Math.round(curNumRate * loopTimes);
        curItem['times'] = curItem['times'] ? curItem['times'] : 0;
        if(curItem['times'] <= curNumLimit){
            behind_foundation.push(suffixNum);
            curItem['times'] ++ ;
        }else{
            i++
        }      
    }

    if(behind_foundation.length){
        const ws = fs.createWriteStream(path.resolve(__dirname,'../db/behind_foundation.txt'),'utf8');        
        // ws.write(JSON.stringify(behind_foundation));
        
        behind_foundation.forEach(function(item,index){
            ws.write(item + ',');
            if(index === front_foundation.length - 1){
                ws.end();
            }
        });
    }
});


