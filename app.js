const path = require('path');
const express= require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

//Load config
dotenv.config( {path: './config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express();

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(methodOverride(function(req,res)  {
    if (req.body && typeof req.body == 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars Helpers 
const {formatDate, select} = require('./helpers/hbs.js')

//Handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs'
    })
);

app.set('view engine', '.hbs')

//Session middleware 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    
    })
}))


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/boards', require('./routes/boards'))

const PORT = process.env.PORT || 8880


app.listen(PORT, () => console.log(`Server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`))