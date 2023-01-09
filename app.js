const express = require('express');
const mongoose = require('mongoose');
const appRoutes = require('./routers/app_router');
const connectFlash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');



const port = process.env.PORT || 3000;

const app = express();


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.use(express.static('uploads'));

const URI = 'mongodb+srv://codenero:Bambi890@nodenero.4pkajfo.mongodb.net/image-upload?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);

mongoose.connect(URI)
.then(()=>{
    console.log('connected to db')
    app.listen(port, ()=>{
        console.log(`listening for request at ${port}`)
    })
})

.catch((err)=>{
    console.log(err)
})

// use express-session

// use express session
app.use(session({
    secret: 'This is my secret002',
    resave: false,
    saveUninitialized: false,
    
}))

// use connectFlash
app.use(connectFlash());

app.use((req,res,next)=>{
    res.locals.messages = req.flash()
    next();
})

app.use(methodOverride('_method'))

// routes
app.use(appRoutes)



