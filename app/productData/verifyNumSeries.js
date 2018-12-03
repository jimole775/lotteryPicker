const fs = require('fs');
const path = require('path');
const IntervalWriter = require('../utils/IntervalWriter.js');
const writer = new IntervalWriter('seriesNumByCreated.log');
let frontSeriesMap = {};
let behindSeriesMap = {};
module.exports = function(aTerm){
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

    const frontKey = frontSeries.toString();
    const behindkey = behindSeries.toString();
    if(frontKey || behindkey){

        if(frontKey){
            if(frontSeriesMap[frontKey] === undefined){           
                frontSeriesMap[frontKey] = 1;
            }
            else if(frontSeriesMap[frontKey]){
                frontSeriesMap[frontKey] ++;
            }
        }

        if(behindkey){
            if(behindSeriesMap[behindkey] === undefined){           
                behindSeriesMap[behindkey] = 1;
            }
            else if(behindSeriesMap[behindkey]){
                behindSeriesMap[behindkey] ++;
            }
        }
        writeDataString = `[${frontKey}]: ${frontSeriesMap[frontKey]} [${behindkey}]:${behindSeriesMap[behindkey]}`;
        writer.write(writeData,function(){ 
            seriesMap = {};
        });
    }
    
    
    return frontSeries;
}

