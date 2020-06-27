// importing modules
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser');
const http = require("http").Server(app);
const session = require('express-session')
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var find = require('mongoose-find-or-create');

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1:27017/jobportal', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Database Connected"))
    .catch((error) => console.log(error))

const users = require('./db/models/users');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION, RSA_NO_PADDING } = require('constants');
const jobpost = require('./db/models/jobpost');
const jobseeker = require('./db/models/jobseeker');
const apply = require('./db/models/apply');
const { findOne } = require('./db/models/users');
var formate = 'YYYY-MM-DD HH:mm:ss';

// app.use(passport.initialize());
// app.use(passport.session());


app.use(express.json())
app.use(session({
    secret: "122334455qqaawwsseedftgyu667788990",
    resave: false,
    saveUninitialized: true
}))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Method", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

var configAuth = {
    googleAuth: {
        clientID: '897835104905-04nuvhtb8vhqmlipm0r48neprov844sd.apps.googleusercontent.com',
        clientSecret: 'kTndI4RvSeTSw63U-StxY5JN',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
}


//POST API
var sess;
app.post('/userlogin', function (req, res) {
    sess = req.session;
    users.findOne({
        email: req.body.email,
        password: req.body.password
    }).then(userdata => {
        if (userdata) {
            sess.userdata = userdata
            console.log(userdata)
            var ps = userdata.position;
            if (ps == "jobseeker") {
                console.log("positions Data: " + ps)
                // res.redirect('./recruiters.html')
                res.render('jobseeker', sess.userdata);
            } else {
                console.log("Recruiter", userdata)
                res.render('recruiters', userdata);
            }
            // res.redirect('./jobseeker.html')
        }
        else {
            res.send("No Such User Found")
        }
    })
})



app.post('/useradd', (req, res) => {
    console.log("My registration", req.body)
    users.findOne({
        email: req.body.email
    }).then(usad => {
        if (usad == req.body.email) {
            res.send("s Already Exists")
        } else {
            (new users({
                'username': req.body.username,
                'name': req.body.name,
                'email': req.body.email,
                'password': req.body.password,
                'dob': req.body.dob,
                'country': req.body.country,
                'city': req.body.city,
                'position': req.body.position,
            }))
                .save()
                .then((usd) => {
                    console.log(usd)
                    res.render('login')
                }).catch((error) => console.log(error))
        }
    })
})


app.post('/jobpost', (req, res) => {
    // console.log("Jobs Data", req.body),
    sess = req.session;
    (new jobpost({
        'rname': req.body.rname,
        'rmail': req.body.rmail,
        'jobtitle': req.body.jobtitle,
        'jobdescription': req.body.jobdescription,
        'companyname': req.body.companyname,
        'companylocation': req.body.companylocation
    }))
        .save()
        .then((usd) => {
            sess.usd = usd;
            // if(sess.usd){
            jobpost.find({
                // rname: sess.usd.email
            }).then(getdata => {
                console.log('New Data', getdata);
                // res.render('alljobspost', JSON.stringify(getdata));
                res.render('alljobspost', { data: getdata });
                res.end()
            }).catch((error) => console.log(error))
            // res.render('alljobspost', usd);
        })
    // .catch((error) => console.log(error))
})

app.post('/jobdatas', (req, res) => {
    (new jobseeker({
        'name': req.body.name,
        'jobtitle': req.body.jobtitle,
        'companylocation': req.body.companylocation,
        'resume': req.body.resume
    }))
        .save()
        .then((jobsearch) => {
            console.log('All Job Search Data', jobsearch)
            res.render('userjobdata', jobsearch)
        }).catch((error) => console.log(error))
})

// app.post('/applied', (req, res) => {
//     (new jobseeker({
//         'name': req.body.name,
//         'jobtitle': req.body.jobtitle,
//         'companylocation': req.body.companylocation,
//         'resume': req.body.resume
//     }))
//         .save()
//         .then((jobsearch) => {
//             console.log('All Job Search Data', jobsearch)
//             res.render('userjobdata', jobsearch)
//         }).catch((error) => console.log(error))
// })

app.post('/apply', (req, res) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    var d = new Date();
    var date1 = d;

    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.uid);
    console.log(req.body.jid);
    console.log(req.body.jobtitle);
    // req.end();

    (new apply({
        'jobid': (req.body.jid).trim(),
        'uid': (req.body.uid).trim(),
        'email': (req.body.email).trim(),
        'status': ('pending').trim(),
        'created_on': date1
    }))
        .save()
        .then((applydata) => {
            console.log('All Job Search Data', applydata)
            res.render('thankyou_page', applydata)
        }).catch((error) => console.log(error))
    // users.findOneAndUpdate({ email: req.body.email })
    //     .then(aply => {
    //         console.log("Assus", aply);
    //         res.send(aply)
    //     }).catch((error) => console.log(error))
})

// static file add
app.use(express.static(path.join(__dirname, '/public')))

//GET API
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/home', (req, res) => {
    res.render('index')
})

app.get('/jobseeker', (req, res) => {
    res.render('jobseeker')
})

app.get('/recruiters', (req, res) => {
    res.render('recruiters')
})

app.get('/alljobspost', (req, res) => {
    res.render('alljobspost')
})

app.get('/userjobdata', (req, res) => {
    res.render('userjobdata')
})

// app.get('/currentopening', (req, res) => {
//     sess = req.session;
//     (new jobpost({
//         'rname': req.body.rname,
//         'rmail': req.body.rmail,
//         'jobtitle': req.body.jobtitle,
//         'jobdescription': req.body.jobdescription,
//         'companyname': req.body.companyname,
//         'companylocation': req.body.companylocation
//     }))
//         .save()
//         .then((usd) => {
//             sess.usd = usd;
//             // if(sess.usd){
//             jobpost.find({
//                 // rname: sess.usd.email
//             }).then(getdata => {
//                 console.log('New Data Get', sess.userdata);
//                 res.render('currentopening', { data: getdata, userData: sess.userdata });
//                 res.end()
//             }).catch((error) => console.log(error))

//         })
// })

app.get('/currentopening', (req, res) => {
    // res.render('currentopening')
    sess = req.session;
    (new jobpost({
        'rname': req.body.rname,
        'rmail': req.body.rmail,
        'jobtitle': req.body.jobtitle,
        'jobdescription': req.body.jobdescription,
        'companyname': req.body.companyname,
        'companylocation': req.body.companylocation
    }))
        .save()
        .then((usd) => {
            sess.usd = usd;
            // if(sess.usd){
            jobpost.find({
                // rname: sess.usd.email
            }).then(getdata => {
                console.log('New Data Get', sess.userdata);
                // res.render('alljobspost', JSON.stringify(getdata));
                res.render('currentopening', { data: getdata, userData: sess.userdata });
                res.end()
            }).catch((error) => console.log(error))
        })
})

app.get('/new_details', (req, res) => {
    var jid = req.query.jid;
    apply.find({
        jobid: '5eefb777458ebc2b7c0960e4'
    })
    apply.aggregate([{
        $lookup: {
            from: "jobposts",
            localField: "uid",
            foreignField: "_id",
            as: "Data"
        }
    }])
        .then(getdata => {
            console.log('New Data Get', getdata);

            res.render('new_details', { data: getdata })
            res.end()
        }).catch((error) => console.log(error))
})


//#region Google Strategy

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
},
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            users.findOne({ googleId: profile.id }, (req, res, err, user) => {
                if (err)
                    return done(err);
                if (user)
                    return done(null, user);
                else {
                    (new users({
                        'id': profile.id,
                        // 'token': accessToken,
                        'name': profile.displayName,
                        'email': profile.emails[0].value,
                    }))
                        .save()
                        .then((profile) => profile)
                }
            });
        })
    }
));


app.get('/auth/google', passport.authenticate('google', {scope: [ 'profile', 'email' ]}
), (req, res) => {
    console.log('res#######', res);
    console.log('req########', req);
});

// app.get('/auth/google/callback', passport.authenticate('google'),(req, res) => {
//     // failureRedirect: '/',
//     // successRedirect: '/'
//     res.render('profile');
// });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('I am working!')
    res.redirect('/');
  });

//#endregion Google Strategy


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // fs.mkdirSync(AIfolder, { recursive: true });
    console.log("Node Backend Server running on port*: " + PORT);
});
