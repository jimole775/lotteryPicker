const fs = require('fs');
const path = require('path');
let loopTimes = 10000;
let front_foundation = [];
let behind_foundation = [];
fs.readFile(path.resolve(__dirname,'../db/fronts_amount.txt'),function(err,data){
    const fronts_amount = JSON.parse(data.toString('utf-8'));
    let i = loopTimes;
    while(i--){

    }
    console.log(fronts_amount);
});
fs.readFile(path.resolve(__dirname,'../db/behinds_amount.txt'),function(err,data){
    const behinds_amount = JSON.parse(data.toString('utf-8'));

});

