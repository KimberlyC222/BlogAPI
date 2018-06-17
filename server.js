
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to BlogPosts
// so there's some data to look at
BlogPosts.create('Lorem', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
BlogPosts.create('Curabitur', 'Curabitur tortor. Pellentesque nibh. Aenean quam.');
BlogPosts.create('Quisque', 'Quisque volutpat condimentum velit. Class torquent per conubia nostra, per inceptos himenaeos.');

// when the root of this router is called with GET, return
// all current BlogPost items
app.get('/blogposts', (req, res) => {
  res.json(BlogPosts.get());
});

// when new blogpost added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
app.post('/blogposts', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['title', 'article'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  app.put('/blogposts/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'article', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blogpost, id: \`${req.params.id}\``);

  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    article: req.body.article
  });

  res.status(204).end();
});

  const item = BlogPosts.create(req.body.title, req.body.article);
  res.status(201).json(item);
});

app.delete('/blogposts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blogpost item \`${req.params.id}\``);
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
