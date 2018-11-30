

const fs = require('fs');
const path = require('path');

let seriesMap = {};
module.exports = function(aTerm){
    //五连号
    //四连号
    //三连号
    //二连号，梯级二连号
    let seriesItems = [];
    aTerm.forEach(function(item,index){
        if(aTerm[index+1] && aTerm[index] - aTerm[index+1] === -1){
            seriesItems.push(item);
        };
    });

    const key = seriesItems.toString();
    if(key){
        if(seriesMap[key] !== undefined){
            seriesMap[key] ++;
        }else{
            seriesMap[key] = 0;
        }
    }

    fs.appendFile(path.resolve(__dirname,'../../db/seriesTimesWhenCreating.log'), JSON.stringify(seriesMap), 'utf8', (err) => {
        if (err) throw err;
    });
    return seriesItems;
}
