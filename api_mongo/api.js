const express = require('express')
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
	.connect(
		'mongodb://localhost:27017/api', 
		{useNewUrlParser: true}
	)
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  idade: {type: Number, min: 0, required: true},
  premium: {type: Boolean, required: true},
  id_user: {type: Number}
});
userSchema.plugin(AutoIncrement, {id:'order_seq', inc_field: 'id_user'});
const User = mongoose.model('User', userSchema);

app.post('/api/createUser', (req, res) => {
    const { nome, idade, premium } = req.body;
    const u = new User({ nome, idade, premium });

    u.save(err => {
		if (err) {
			res.send(err);
		} else {
			console.dir(u);
			res.send('Usuario salvo.');
		}
	});
});

app.get('/api/users', (req, res) => {
	User.find((err, users) => {
        res.send(err || users);
	});
})

app.get('/api/user/:id', (req, res) => {
	const id = req.params.id;
	User.find({ id_user: id}, (err, user) => {
		res.send(err || user);
	});
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

