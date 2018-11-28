const fs = require('fs');
const path = require('path');
const loopTimes = 10000;
createJson('front_sum.json','front_rate_foundation.json',35);
createJson('behind_sum.json','behind_rate_foundation.json',12);
function createJson(inputFile,outputFile,randomFoun){
    fs.readFile(path.resolve(__dirname,'../../db/',inputFile),function(err,data){
        const sumObject = JSON.parse(data.toString('utf-8'));
        let foundation = new Array(loopTimes);
        let i = loopTimes;
        while(i--){
            const suffixNum = suffixPick(randomFoun);   
            const curItem = sumObject[suffixNum-1];
            const curNumRate = curItem['rate'];
            const curNumLimit = Math.round(curNumRate * loopTimes);
            curItem['times'] = curItem['times'] ? curItem['times'] : 0;
            if(curItem['times'] <= curNumLimit){
                let suffixIndex = suffixPick(loopTimes) - 1;
                if(foundation[suffixIndex]){ 
                    i++;
                }else {
                    foundation[suffixIndex] = suffixNum;
                    curItem['times'] ++ ;
                }              
            }else{
                i++
            }      
        }
        
        if(foundation.length){
            const ws = fs.createWriteStream(path.resolve(__dirname,'../../db/',outputFile),'utf8');      
            ws.write(JSON.stringify(foundation)); 
            ws.end();
        }
    
    });
}

function suffixPick(bit){
    return Math.ceil(Math.random()*bit);
}
