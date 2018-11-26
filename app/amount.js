const fs = require('fs');

// let frontModel = new Array(35);
// let behindModel = new Array(12);

let frontModel = fillData(35);
let behindModel = fillData(12);

module.exports =  function (fronts,behinds){
    const frontCount = fronts.length * 5;
    const behindCount = behinds.length * 2;
    fronts.forEach((peerTerm)=>{
        peerTerm.forEach(function(single){
            if(single) {
                var modeItem = frontModel[single-1];
                modeItem.sum = modeItem.sum + 1;
                modeItem.rate = modeItem.sum/frontCount;
            }
        });
    });
    
    behinds.forEach((peerTerm)=>{
        peerTerm.forEach(function(single){            
            if(single) {
                var modeItem = behindModel[single-1];
                modeItem.sum = modeItem.sum + 1;
                modeItem.rate = modeItem.sum/behindCount;
            }
        });
    });

    fs.writeFile('./db/fronts_amount.txt',JSON.stringify(frontModel));
    fs.writeFile('./db/behinds_amount.txt',JSON.stringify(behindModel));
}

function fillData(len){
    let mode = {"sum":0,"rate":0};
    let result = [];
    for(let i = 0;i<len;i++){
        result[i] = JSON.parse(JSON.stringify(mode));
    };
    return result;
}
