
const fs = require('fs');
const path = require('path');
const verifySeriesNum = require('./verifyNumSeries.js');
// 10000000组 tenMillion.json
// 1000000组 oneMillion.json
// 100000组 hundredThousand.json
// 10000组 tenThousand.json
// 1000组 oneThousand.json
// 100组 hundred.json
// 10组 ten.json
// 1组 theOne.json


let tenMillionBatch = 5000000;
let oneMillionBatch = 1000000;
let hundredThousandBatch = 100000;
let tenThousandBatch = 10000;
let oneThousandBatch = 1000;
let hundredBatch = 100;
let tenBatch = 10;
let theOneBatch = 1;       

function logAwardState(data){
    console.log(JSON.stringify(data));
    fs.appendFile(path.resolve(__dirname,'../../db/awardState.log'), JSON.stringify(data), 'utf8', (err) => {
        if (err) throw err;
    });  
    // resetDataModel(data);
}

function resetDataModel(data){

    data = {
        no1:{
            awardTimes:0,  
            awardDistance:[],
            rollTimes:0
        },
        no2:{
            awardTimes:0,  
            awardDistance:[],
            rollTimes:0                      
        },
        no3:{
            awardTimes:0,  
            awardDistance:[],
            rollTimes:0                     
        },
        no4:{
            awardTimes:0,  
            awardDistance:[],
            rollTimes:0                      
        }
    };
}

fs.readFile(path.resolve(__dirname,'../../db/front_rate_foundation.json'),function(err,frontData){
    fs.readFile(path.resolve(__dirname,'../../db/behind_rate_foundation.json'),function(err,behindData){     
        const frontRateFoun = JSON.parse(frontData.toString());
        const behindRateFoun = JSON.parse(behindData.toString());
        // building('tenMillionBatch',10);
        matchRightBatch([5,11,16,28,35],[6,9]);
        function building(type,times){
            let i = times;
            const ws = fs.createWriteStream(path.resolve(__dirname,'../../db/',type + '.log'),'utf8');
            while(i--){
                ws.write(createABatch().toString() + '\r\n');
            }
            ws.end();
        }

        function matchRightBatch(fronts,behinds){
            let keepFetch = true;
            let awardState = {
                no1:{
                    awardTimes:0,  
                    awardDistance:[],
                    rollTimes:0
                },
                no2:{
                    awardTimes:0,  
                    awardDistance:[],
                    rollTimes:0                      
                },
                no3:{
                    awardTimes:0,  
                    awardDistance:[],
                    rollTimes:0                     
                },
                no4:{
                    awardTimes:0,  
                    awardDistance:[],
                    rollTimes:0                      
                }
            };
            while(keepFetch){
                awardState.no1.rollTimes++;
                awardState.no2.rollTimes++;
                awardState.no3.rollTimes++;
                awardState.no4.rollTimes++;
                let frontMatchedTimes = 0;
                let behindMatchedTimes = 0;
                let batch = createABatch();   
                var seriesItem = verifySeriesNum(batch);

                if(seriesItem.length > 2){
                    continue;
                }

                batch.forEach(function(item,index){
                    if(index < 5 && fronts.includes(item)){
                        frontMatchedTimes ++;
                    }else if(behinds.includes(item)){
                        behindMatchedTimes ++;
                    }
                });

                if(frontMatchedTimes === 5 && behindMatchedTimes === 2){
                    console.log('中得一等奖',batch.toString());           
                    awardState.no1.awardTimes ++;
                    awardState.no1.awardDistance.push(awardState.no1.rollTimes);    
                    awardState.no1.rollTimes = 0;                    
                    logAwardState(awardState);   
                } 
                if(frontMatchedTimes === 5 && behindMatchedTimes === 1){   
                    console.log('中得二等奖',batch.toString());   
                    awardState.no2.awardTimes ++;
                    awardState.no2.awardDistance.push(awardState.no2.rollTimes);
                    awardState.no2.rollTimes = 0;                   
                    logAwardState(awardState);       
                } 
                if(frontMatchedTimes === 5 && behindMatchedTimes === 0
                    || frontMatchedTimes === 4 && behindMatchedTimes === 2){   
                        console.log('中得三等奖',batch.toString()); 
                    awardState.no3.awardTimes ++;
                    awardState.no3.awardDistance.push(awardState.no3.rollTimes);
                    awardState.no3.rollTimes = 0;                  
                    logAwardState(awardState);       
                } 
                if(frontMatchedTimes === 4 && behindMatchedTimes === 1
                    || frontMatchedTimes === 3 && behindMatchedTimes === 2){   
                        console.log('中得四等奖',batch.toString());   
                    awardState.no4.awardTimes ++;
                    awardState.no4.awardDistance.push(awardState.no4.rollTimes);
                    awardState.no4.rollTimes = 0;                  
                    logAwardState(awardState);         
                } 

            }
        }

        function createABatch(){
            let fronts = [];
            let behinds = [];
            let newItem;
            while(fronts.length < 5){
                newItem = pickOne('front'); 
                if(!fronts.includes(newItem)){
                    fronts.push(newItem);  
                }
            }   
                        
            while(behinds.length < 2){
                newItem = pickOne('behind'); 
                if(!behinds.includes(newItem)){
                    behinds.push(newItem);  
                }
            }   
            fronts = fronts.sort(function(a,b){return a-b});
            behinds = behinds.sort(function(a,b){return a-b});         

            return fronts.concat(behinds);
        }
        

        function pickOne(type){
            let result = '';
            if(type==='front'){
                result = frontRateFoun[suffixPick(10000) - 1]
            }
            if(type==='behind'){
                result = behindRateFoun[suffixPick(10000) - 1]
            }
            return parseInt(result);
        }
        
        function suffixPick(limit){
            return Math.ceil(Math.random()*limit);
        }


    });
});

