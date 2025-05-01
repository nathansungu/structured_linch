const { createSecretKey } = require('crypto');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)

const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'linchking'
}
const sessionStore = new MySQLStore(options)

const sessionconfig = session({
    secret: '1234', 
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true, 
        secure: false, 
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 10000
    },    
})

module.exports = sessionconfig;