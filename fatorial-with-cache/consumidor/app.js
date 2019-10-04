const express = require('express')
const redis = require('redis')
const cache = redis.createClient()
const app = express()
const port = 3001

cache.on('connect', () => {
  console.log('Redis is ready');
});

cache.on('error', (e) => {
  console.log('Redis error', e);
});

app.get('/', (req, res) => {
    res.send('Consumidor 1 iniciado');

    setInterval(function() {
        cache.brpop(['lista-teste', 0], function (err, data) {
            if (err){
                console.log('ERROR CONS 1')
            }else{
                console.log('OK CONS 1', data)
            }
        });
    }, 2000);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))