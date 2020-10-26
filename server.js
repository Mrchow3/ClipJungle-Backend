require('dotenv').config()
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Set up Morgan
const logger = require('morgan')
app.use(logger('dev'))


// Set up CORS
const cors = require('cors')
app.use(cors())

// Allow server to parse data
app.use(express.urlencoded({extended: false}))
app.use(express.json())


// Initalize MongoDB
const initializeDB = require('./config/db.config')
const db = initializeDB()

// Get Redis
const { redis } = require('./config/redis.config');

// Set up Flash and Session
const flash = require('express-flash')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

app.use(flash())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redis})
}))

// Initialize Passport Local
const passport = require('passport')
const initializePassport = require('./config/passport.config')

initializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())

// Set API routes
const usersRouter = require('./routes/users.routes')

app.use('/api/users', usersRouter)

// Run server on port
const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));