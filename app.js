const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const _ = require('lodash')
const session = require('express-session')
const flash = require('express-flash')
// db
const mongoose = require('./db/mongoose')
// const auth = require('./middleware/auth')
// models
const Notes = require('./models/Notes')
const Users = require('./models/Users')
// middleware
const auth = require('./middleware/auth')


app.set('view engine', 'pug')

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "creatornpm"
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash())

app.use('/assets', express.static(__dirname + '/public'))

app.use(function (req, res, next) {
    if (req.session.token) {
        res.locals.originalUser = req.session.token
    }
    next()
})

app.get('/add', auth, function (req, res, next) {
    res.render("index", {
        errors: req.flash('errors')
    })
})

app.post('/saveNotes', auth, function (req, res) {
    let user = req.user
    let output = _.pick(req.body, 'title', 'body')
    let note = new Notes()

    note.title = output.title
    note.body = output.body

    note.save(function (err, doc) {
        if (err) next(err)
        Users.findByIdAndUpdate(user._id, { $push: { "notes": doc._id } }, function (err, output) {
            // console.log("DONEEEE")
            return res.redirect('/add')
        })
    })
})
// generates user's specific saved notes
app.get('/usersData', auth, function (req, res) {
    let user = req.user

    Users.findById(user._id).populate('notes').exec(function (err, doc) {
        console.log("length ==> " + doc.notes.length)
        res.send(doc.notes)
    })
})

app.get('/', function (req, res) {
    res.render('home')
})

app.get('/getAllIds', function (req, res, next) {
    Notes.find().exec(function (err, docs) {
        return res.send(docs)
    })
})

app.get('/removeNote/:id', auth, function (req, res, next) {
    let id = req.params.id
    let user = req.user

    Users.findByIdAndUpdate(user._id, {
        $pull: { "notes": id }
    }, function (err, doc) {
        // console.log("UPDATED DOC " + doc)
    })

    Notes.findByIdAndRemove(id).exec(function (err, doc) {
        console.log(doc)
    })
})

app.get('/login', function (req, res, next) {
    res.render('accounts/login', {
        errors: req.flash('errors')
    })
})

app.post('/login', function (req, res, next) {
    // console.log(req.body)
    let body = _.pick(req.body, ['email', 'password'])

    Users.findByCredentials(body.email, body.password, function (err, user) {
        if (err) {
            req.flash('errors', 'Invalid email or password.');
            res.redirect('/login');
        } else {
            user.generateAuthToken(function (token) {
                req.flash('success', 'Successfull login!!!!');
                req.session.token = user.tokens[0].token;
                req.session.userName = user.name;
                res.redirect('/add');
            });
        }
    });

})

app.get('/signup', function (req, res, next) {
    res.render('accounts/signup', {
        errors: req.flash('errors')
    })
})

app.post('/signup', function (req, res, next) {
    let body = _.pick(req.body, ['email', 'password', 'confirm', 'name'])
    // validations
    if (body.email == '' || body.password == '' || body.confirm == '' || body.name == '' || (body.password).length < 5 || body.confirm != body.password) {
        req.flash('errors', 'Something went wrong sign in again.')
        return res.redirect('/signup')
    }

    Users.findOne({ email: body.email }, function (err, doc) {
        if (err) next(err)

        if (doc === null) {
            let user = new Users(body)
            user.save(function (err, doc) {
                if (err) console.log(err)
                user.generateAuthToken(function (token) {
                    req.session.token = user.tokens[0].token
                    req.session.userName = user.name
                    res.redirect('/add')
                })
            })
        } else {
            req.flash('errors', 'Email ID already exists.')
            res.redirect('/signup')
        }
    })
})

app.get('/logout', auth, function (req, res) {
    Users.findByIdAndUpdate(
        { _id: req.user.id },
        {
            $pull: { "tokens": { "token": req.session.token } }
        }, { returnNewDocument: true }, function (err, res) {
            // console.log("RES ===>>>" + res);
        }
    )
    req.session.destroy()
    res.redirect('/')
});

app.listen(3000, function () {
    console.log("Server is up on port 3000")
})
