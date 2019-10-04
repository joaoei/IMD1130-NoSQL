const express = require('express')
const redis = require('redis')
const cache = redis.createClient()
const app = express()
const port = 3000

cache.on('connect', () => {
  console.log('Redis is ready');
});

cache.on('error', (e) => {
  console.log('Redis error', e);
});

app.get('/', (req, res) => {
    res.send('Produção iniciada!');

    setInterval(function() {
        cache.rpush(['lista-teste', 'teste'+Math.floor(Math.random() * 10), 'teste'+Math.floor(Math.random() * 10)], function(err, reply) {
            if (err){
                console.log('ERROR')
            }else{
                console.log('OK: '+reply)
            }
        });
    }, 4000);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))