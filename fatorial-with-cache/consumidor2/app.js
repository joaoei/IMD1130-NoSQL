const express = require('express')
const redis = require('redis')
const cache = redis.createClient()
const app = express()
const port = 3002

cache.on('connect', () => {
  console.log('Redis is ready');
});

cache.on('error', (e) => {
  console.log('Redis error', e);
});

app.get('/', (req, res) => {
    res.send('Consumidor 2 iniciado');
    
    setInterval(function() {
        cache.brpop(['lista-teste', 0], function (err, data) {
            if (err){
                console.log('ERROR CONS 2')
            }else{
                console.log('OK CONS 2', data)
            }
        });
    }, 1000);

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))