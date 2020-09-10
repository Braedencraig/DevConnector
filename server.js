const express = require('express');
const connectDB = require('./config/db')
const path = require('path')

const app = express();

// Connect Database here! Bring in mongoDB from config/db.js
connectDB();

// Init Middleware, where body parser would happen but is included in express now
app.use(express.json({ extended: false }))

// app.get('/', (req, res) => res.send('API Running'));
// We could go app.gets for all in routes/api but going to get messy so we break it up into different components

// Define routes here
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

// // Serve static assets  in production
// if(process.env.NODE_ENV === 'production') {
//   // set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => { 
//     res.sendFile(path.resolve()(__dirname, 'client', ' build', 'index.html'))
//   })
// }


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));