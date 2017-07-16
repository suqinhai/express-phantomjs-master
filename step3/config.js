module.exports = {
    port : 8000,
    mongodb : 'mongodb://localhost:27017/phantom',
    device: {
        iphone5: {
            name : 'iphone5',
            width: 320,
            height: 568,
            ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
        },
        iphone6: {
            name : 'iphone6',
            width: 375,
            height: 667,
            ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
        },
        ipad: {
            name : 'ipad',
            width: 768,
            height: 1024,
            ua: "Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
        }
    }
}