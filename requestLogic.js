
const http = require('http');

class Request{
    constructor(){
    }
    fetch(options,callback){
        this.req = http.request(options, (res) => {
            res.setEncoding('utf8');
            const htmlChunk = [];
            res.on('data', (chunk) => {
                htmlChunk.push(chunk);
            });
            res.on('end', () => {
                if(callback && typeof callback === "function")callback(htmlChunk);
            });        
        });
        
        this.req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });
        
        this.req.end();
    }
}

module.exports = Request;