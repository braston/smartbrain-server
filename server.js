const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const postgres = knex ({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {rejectUnauthorized: false}
    }
  });

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, resp) => resp.send('Not So Fast..'));
app.post('/signin', (req, res) => {signin.handleSignIn( req, res, postgres, bcrypt)});
app.post('/register', (req, res) => { register.handleRegister(req, res, postgres, bcrypt) });
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, postgres)});
app.put('/image', (req, res) => {image.handleImage(req, res, postgres)});
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});
app.listen(process.env.PORT || 3000, () => {
})