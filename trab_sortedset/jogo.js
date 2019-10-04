const express = require('express')
const redis = require('redis')
const client = redis.createClient()
const app = express()
const port = 3000

client.on('connect', () => {
  console.log('Redis is ready');
});

client.on('error', (e) => {
  console.log('Redis error', e);
});

app.get('/addpoints/:points/:player', (req, res) => {
    const points = req.params.points;
    const player = req.params.player;   
    
    if (points > 0) {
        client.zincrby("ranking", points, player, function (err, resp) {
            if (err) throw err;

            res.send("Pontos adicionados com sucesso. Valor atual: "+resp)
        });
    } else {
        res.send("Erro: Valor de pontuação invalido");
    }
})

app.get('/removepoints/:points/:player', (req, res) => {
    const points = req.params.points;
    const player = req.params.player;   
    
    if (points > 0) {
        client.zincrby("ranking", -1*points, player, function (err, resp) {
            if (err) throw err;

            res.send("Pontos removidos com sucesso. Valor atual: "+resp)
        });
    } else {
        res.send("Erro: Valor de pontuação invalido");
    }
})

app.get('/listtop10', (req, res) => {
    client.zrevrange("ranking", 0, 9, "withscores", function (err, listwithscores) {
        if (err) throw err;

        let resp = "";
        let count = 1;
        for (var i = 0; i < listwithscores.length; i = i + 2) {
            resp += count +" - Jogador: "+ listwithscores[i] +" Pontos: "+ listwithscores[i+1] + "<br>";
            count++;
        }

        res.send(resp)
    });
})

app.get('/getPlayer10', (req, res) => {
    client.zrevrange("ranking", 9, 9, function (err, player) {
        if (err) throw err;
        
        res.send(player)
    });
})

app.get('/removeall', (req, res) => {
    client.zremrangebyrank("ranking", 0, -1, function (err, resp) {
        if (err) throw err;

        res.send("removed all")
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))