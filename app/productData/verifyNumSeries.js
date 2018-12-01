const fs = require('fs');
const path = require('path');
const intervalWriter = require('../utils/intervalWriter.js');
let seriesMap = {};
module.exports = function(aTerm){
    //五连号
    //四连号
    //三连号
    //二连号，梯级二连号
    let seriesItems = [];
    aTerm.forEach(function(item,index){
        var nextItem = aTerm[index+1];
        if( nextItem && item - nextItem === -1){
            if(!seriesItems.includes(item))seriesItems.push(item);
            if(!seriesItems.includes(nextItem))seriesItems.push(nextItem);
        };
    });

    const key = seriesItems.toString();
    if(key){
        if(seriesMap[key] !== undefined){
            seriesMap[key] ++;
        }else{
            seriesMap[key] = 0;
        }
        const writeData = `${key}:${seriesMap[key]}`;

        new intervalWriter('seriesNumState',writeData,function(){
            seriesMap = {};
        });
    }
    
    
    return seriesItems;
}

