
const fs = require('fs');
const path = require('path');
const verifySeriesNum = require('./verifyNumSeries.js');
const IntervalWriter = require('../utils/IntervalWriter.js');
const tools = require('../utils/tools.js');

let aBillion = 1000000000;
let tenMillionBatch = 10000000;
let oneMillionBatch = 1000000;
let hundredThousandBatch = 100000;
let tenThousandBatch = 10000;
let oneThousandBatch = 1000;
let hundredBatch = 100;
let tenBatch = 10;
let theOneBatch = 1;       


// 14,19,23,27,34,#06,#12
const awardTarget_front = [14,19,23,27,34];
const awardTarget_behind = [06,12];
const no1Writer = new IntervalWriter(`${awardTarget_front.join('.')}#${awardTarget_behind.join('.')}-awardState.no1.log`);
const no2Writer = new IntervalWriter(`${awardTarget_front.join('.')}#${awardTarget_behind.join('.')}-awardState.no2.log`);
const no3Writer = new IntervalWriter(`${awardTarget_front.join('.')}#${awardTarget_behind.join('.')}-awardState.no3.log`);
// const no4Writer = new IntervalWriter('awardState.no4.log');

fs.readFile(path.resolve(__dirname,'../../db/baseStorage/front_rate_foundation.json'),function(err,frontData){
    fs.readFile(path.resolve(__dirname,'../../db/baseStorage/behind_rate_foundation.json'),function(err,behindData){     
        const frontRateFoun = JSON.parse(frontData.toString());
        const behindRateFoun = JSON.parse(behindData.toString());
        // building('tenMillionBatch',10);
        // 07,10,22,23,33,#08,#11
        matchRightBatch(awardTarget_front,awardTarget_behind);
        // function building(type,times){
        //     let i = times;
        //     const ws = fs.createWriteStream(path.resolve(__dirname,'../../db/',type + '.log'),'utf8');
        //     while(i--){
        //         ws.write(createABatch().toString() + '\r\n');
        //     }
        //     ws.end();
        // }

        function matchRightBatch(fronts,behinds){
            let awardState = {
                no1:0,
                no2:0,
                no3:0,
                // no4:0,
                rollTimeSum:'',
                rollTimeCalc:0
            };
            while(aBillion--){
                awardState.rollTimeCalc ++;
                if(awardState.rollTimeCalc >= 1000000){
                    awardState.rollTimeSum += 'i'; 
                    if(awardState.rollTimeSum.length > 10){
                        awardState.rollTimeSum = awardState.rollTimeSum.replace(/i{10}/g,'v');
                        awardState.rollTimeSum = awardState.rollTimeSum.replace(/v{10}/g,'w');
                        awardState.rollTimeSum = awardState.rollTimeSum.replace(/w{10}/g,'x');
                    }
                    awardState.rollTimeCalc = 0;
                }
                let frontMatchedTimes = 0;
                let behindMatchedTimes = 0;
                let batch = createABatch();   
                var seriesItem = verifySeriesNum(batch,aBillion);
                // 如果有连号超过3次，就废弃这个摇号
                if(seriesItem.length > 2){
                    aBillion ++;
                    continue;
                }
                batch.forEach(function(item,index){
                    if(index < 5 && fronts.includes(item)){
                        frontMatchedTimes ++;
                    }else if(behinds.includes(item)){
                        behindMatchedTimes ++;
                    }
                });

                awardState.no1++;
                awardState.no2++;
                awardState.no3++;
                // awardState.no4++;
                if(frontMatchedTimes === 5 && behindMatchedTimes === 2){  
                    afterAwarded(awardState,1,awardState.rollTimeSum+awardState.rollTimeCalc);
                } 
                if(frontMatchedTimes === 5 && behindMatchedTimes === 1){   
                    afterAwarded(awardState,2,awardState.rollTimeSum+awardState.rollTimeCalc);  
                } 
                if(frontMatchedTimes === 5 && behindMatchedTimes === 0
                    || frontMatchedTimes === 4 && behindMatchedTimes === 2){   
                        afterAwarded(awardState,3,awardState.rollTimeSum+awardState.rollTimeCalc); 
                } 
                if(frontMatchedTimes === 4 && behindMatchedTimes === 1
                    || frontMatchedTimes === 3 && behindMatchedTimes === 2){ 
                        // afterAwarded(awardState,4,awardState.rollTimeSum);    
                } 

            }
        }

        
        function afterAwarded(awardState,awardLevel,rollTimeSum){ 
            const writeData = `rollTimeSum:${rollTimeSum} awardDistance:${awardState['no' + awardLevel]}`; 
            const writerMap = {
                1:no1Writer,
                2:no2Writer,
                3:no3Writer,
                // 4:no4Writer
            }
            awardState['no' + awardLevel] = 0;
            writerMap[awardLevel].write(writeData);
            // console.log('摇奖存储：',awardState);
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

