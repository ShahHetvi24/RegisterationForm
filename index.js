const express = require('express'); 
const app = express();  
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./model/user');

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@registerationform.l0rvfev.mongodb.net/`)
  .then(() => { 
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
    });
  })
  .catch((err) => { 
    console.error('Failed to connect to MongoDB', err);
  });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/addUser', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      errors: {
        email: { message: 'Email is required' },
        password: { message: 'Password is required' }
      }
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    const savedUser = await user.save();
    res.status(201).send("User added successfully");
  } catch (err) {
    res.status(400).send(err);
  }
});
