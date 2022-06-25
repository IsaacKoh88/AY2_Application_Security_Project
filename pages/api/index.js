//import executeQuery from '../../db/db'
//import type { NextApiRequest, NextApiResponse } from 'next'

const nextjs = require("nextjs")
const cookieParser = require("cookie-parser")
const csurf = require("csurf")
const csrfProtection = csurf({ cookie: { httpOnly: True } })
const jwt = require("jwonwebtoken")
const path = require("path")
const app = nextjs()


const jwtsecret = "12345678910"

app.use(nextjs.static("public"))
app.set("view engine", "ejs") //EJS is a template engine for javascript
app.set("views", path.join(__dirname, "views")) //__dirname is an env var that tells the absolute path of the directory containing the file being executed

app.use(cookieParser())

app.get("/", (req,res) => {
    jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
        if (err) {
            res.render("login")
        } else {
            res.render("logged-in", { name: decoded.name })
        }
    })
})

app.get("/login", (req, res) => {
    if (req.body.username === "email@email.com" && req.body.password === "password") {
        res.cookie("cookieToken", jwt.sign({ name: "user1", key: "key1" }, jwtsecret), { httpOnly: true }) //httpOnly mitigates the risk of client side script accessing the protected cookie
        res.redirect("/")
    } else {
        res.send(`<p>Incorrect Login. <a href = "/">return</a></p>`)
    }
})

app.get("/logout", (req,res) => {
    res.clearCookie("cookieToken")
    res.redirect("/")
})

//have a GET request that is protected by a token but doesnt need CSRF because it doesnt modify any data
app.get("/get-secret-data", mustBeLoggedIn, (req,res) => {
    res.send(`<a href="/">return</a>`)
})

//api endpoint
app.get("/ajax-example", mustBeLoggedIn, (req,res) => { //ajax allows web pages to be updated asynchronously by exchanging data with a web server bts
    res.json({ message:""})
})

//Our token checker middleware
function mustBeLoggedIn(req, res, next) {
    jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
        if (err) {
            res.redirect("/")
        } else {
            next()
        }
    })
}


app.listen(3000)