const express = require('express')
const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000

mongoose
	.connect(
		'mongodb://localhost:27017/api', 
		{useNewUrlParser: true}
	)
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

var userSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  idade: {type: Number, min: 0, required: true},
  premium: {type: Boolean, required: true},
  id_user: {type: Number}
});
userSchema.plugin(AutoIncrement, {id:'order_seq', inc_field: 'id_user'});
var User = mongoose.model('User', userSchema);

app.post('/api/createUser', function(req, res) {
    var nome    = req.body.nome;
    var idade   = req.body.idade;
    var premium = req.body.premium;

    var u = new User({
	    nome: nome,
	    idade: idade,
	    premium: premium
    });

    u.save(function(err, thor) {
		if (err) {
			res.send(err);
		} else {
			console.dir(u);
			res.send('Usuario salvo.');
		}
		
	});
});

app.get('/api/users', (req, res) => {
	User.find(function(err, users) {
		if (err) res.send(err);
		res.send(users);
	});
})

app.get('/api/user/:id', (req, res) => {
	const id = req.params.id;
	User.find({ id_user: id}, function(err, user) {
		if (err) res.send(err);
		res.send(user);
	});
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

