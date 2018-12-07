const fs = require('fs');
const path = require('path');
const IntervalWriter = require('../utils/IntervalWriter.js');

// 14,19,23,27,34,#06,#12
const awardTarget_front = [14,19,23,27,34];
const awardTarget_behind = [06,12];

const writer = new IntervalWriter(`${awardTarget_front.join('.')}#${awardTarget_behind.join('.')}-seriesNumByCreated.log`);
let frontSeriesMap = {};
let behindSeriesMap = {};
module.exports = function(aTerm,loopTimes){
    //五连号
    //四连号
    //三连号
    //二连号，梯级二连号
    let frontSeries = [];
    let behindSeries = [];
    aTerm.forEach(function(item,index){
        if(index <=4){
            let nextIndex = index+1 > 4 ? 4 : index+1; 
            let nextItem = aTerm[nextIndex];
            if( nextItem && item - nextItem === -1){
                if(!frontSeries.includes(item))frontSeries.push(item);
                if(!frontSeries.includes(nextItem))frontSeries.push(nextItem);
            };
        }else{            
            let nextIndex = index+1; 
            let nextItem = aTerm[nextIndex];
            if( nextItem && item - nextItem === -1){
                if(!behindSeries.includes(item))behindSeries.push(item);
                if(!behindSeries.includes(nextItem))behindSeries.push(nextItem);
            };
        }
        
    });

    if(frontSeries.length && frontSeries.length <= 3){
        const frontKey = frontSeries.toString();
        if(frontSeriesMap[frontKey] === undefined){           
            frontSeriesMap[frontKey] = 1;
        }
        else if(frontSeriesMap[frontKey]){
            frontSeriesMap[frontKey] ++;
        }
    }
    if(behindSeries.length){
        const behindkey = behindSeries.toString();
        if(behindSeriesMap[behindkey] === undefined){           
            behindSeriesMap[behindkey] = 1;
        }
        else if(behindSeriesMap[behindkey]){
                behindSeriesMap[behindkey] ++;
            }
        
    }

    queryLargeSeries();
    function queryLargeSeries(){
        let writeData = '';
        Object.keys(frontSeriesMap).forEach(function(frontKey){
            if(loopTimes <= 0){
              return writeData += `[${frontKey}]:${frontSeriesMap[frontKey]},`;
            }

            if(frontSeriesMap[frontKey] >= 1000000){
                writeData += `[${frontKey}]:${frontSeriesMap[frontKey]},`;
                frontSeriesMap[frontKey] = 1;
            };           
        })

        Object.keys(frontSeriesMap).forEach(function(behindkey){
            if(loopTimes <= 0){
                return writeData += `[${behindSeriesMap}]:${behindSeriesMap[behindkey]},`;
            }
            if(behindSeriesMap[behindkey] >= 1000000){
                writeData += `#[${behindkey}]:${behindSeriesMap[behindkey]},`;
                behindSeriesMap[behindkey] = 1;       
            };
        })

        if(writeData)writer.write(writeData); 
    }

    // if(frontSeriesMap[frontSeries.toString()] >= 1000000 || behindSeriesMap[behindSeries.toString()] >= 1000000){        
    //     const frontKey = frontSeries.toString();
    //     const behindkey = behindSeries.toString();
    //     console.log("前区连号：",JSON.stringify(frontSeriesMap));
    //     console.log("后区连号：",JSON.stringify(frontSeriesMap));
    //     let writeData = '';
    //         if(frontKey){writeData += `[${frontKey}]:${frontSeriesMap[frontKey]} `;frontSeriesMap[frontKey] = 1}       
    //         if(behindkey){writeData += `#[${behindkey}]:${behindSeriesMap[behindkey]}`;behindSeriesMap[behindkey] = 1}
    //         writer.write(writeData); 
    // }
   
    return frontSeries;
}

