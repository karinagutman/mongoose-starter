const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = 3000;

mongoose.connect('mongodb://localhost:27017/social', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => console.log('connected to MongoDB'));

const User = new mongoose.model('User', {
	name: String,
	username: {
		type: String,
		required: true
	},
	email: String,
	created: {
		type: Date,
		default: new Date()
	}
});


const Post = new mongoose.model('Post', {
    content: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: new Date()
    },
    userId: {
        type: String,
        required: true
    }
});


app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.put('/user', (req, res) => {
	const user = new User(req.body);
	user.save()
	.then((user) => res.status(201).json(user))
	.catch(err => res.status(400).json(err));

});

app.put('/post',(req,res) => {
	const post = new Post(req.body);
	post.save()
	.then((post) => res.status(201).json(post))
	.catch(err => res.status(400).json(err));

});





app.get('/user', (req, res) => {
	User.find()
	.then((users) => res.json(users))
	.catch(err => res.json(err));
});

app.get('/post', (req,res) => {
	Post.find()
	.then((posts) => res.json(posts))
	.catch(err => res.status(400).json(err));

});

app.get('/user/:id', (req, res) => {
	User.findById(req.params.id)
	.then(user => {
		if(!user) {
			res.sendStatus(404);
			return;
		}
		res.json(user);
	})
	.catch(err => res.status(400).json(err));
	
});

app.get('/post/:id', (req,res) => {
	Post.findById(req.params.id)
	.then(post => {
		if(!post) {
			res.sendStatus(404);
			return;
		}
		res.json(post);
	})
	.catch(err => res.status(400).json(err));

});

app.get('user/:id/posts',(req,res) => {
	Post.find({userId: req.params.id})
	.then(posts => {
		if(!posts){
			res.sendStatus(404);
			return; 
		}
		res.json(posts);
	})
	.catch(err => {
		console.log(err);
		res.sendStatus(400);
	});

});





app.post('/user/:id', (req, res) => {
	User.findById(req.params.id)
	.then(user => {
		if(!user) {
			res.sendStatus(404);
			return;
		}
		user.update(req.body)
			.then(() => res.sendStatus(200))
			.catch(err => res.status(400).json(err));
	})
	.catch(err => res.status(400).json(err))

});

app.post('/post/:id',(req,res) => {
	Post.findById(req.params.id)
	.then(post => {
		if(!post) {
			res.sendStatus(404);
			return;
		}
		post.update(req.body)
			.then(() => res.sendStatus(200))
			.catch(err => res.status(400).json(err));
	})
	.catch(err => res.status(400).json(err))
});




app.delete('/user/:id', (req, res) => {
	User.findByIdAndDelete(rep.params.id)
	.then(user => {
		if(!user) {
			res.sendStatus(404);
			return;
		}
		user.remove()
		.then(() => res.sendStatus(204))
		.catch(err => res.status(400).json(err));

	})
	.catch(err => res.status(400).json(err));

});

app.delete('/post/:id', (req,res) => {
	Post.findByIdAndDelete(req.params.id)
	.then(post => {
		if(!post) {
			res.sendStatus(404);
			return;
		}
		post.remove()
		.then(() => res.sendStatus(204))
		.catch(err => res.status(400).json(err));
	})
	.catch(err => res.status(400).json(err));
});


app.listen(port, () => console.log(`Server listening on port ${port}!`));