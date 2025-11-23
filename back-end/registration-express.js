const { application } = require("express");
const express = require("express");
const path = require("path")
const app = express();
const location = path.join(__dirname, "../chat/registration.html");
app.use(express.static('../chat'));
// app.use(express.static(temppath));
require("./registration")//importing mongoose file
const db = require("./registration");//importing model
const port = process.env.PORT || 3000;


//registration page
app.get("/register", (req, res) =>
{
    // app.use(express.static('location'));
    res.sendFile(location);
})
app.use(express.json())//to handle json data
app.use(express.urlencoded({ extended: false }))//geting form data
app.post("/register", async (req, res) =>
{
    try
    {
        const password = req.body.pass;
        const conpassword = req.body.conpass;
        if (password === conpassword)
        {
            const regis = new db({
                name: req.body.name,
                gender: req.body.gender,
                email: req.body.email,
                phone: req.body.phone,
                pass: password,
                conpass: conpassword
            })
            const ok = await regis.save();
            res.status(201).send("submit sucessfully")
        }
    } catch (error)
    {
        console.log(error);
        res.status(400).send()
    }
})
app.listen(port, () =>
{
    console.log(`listening at ${port}`);
})



//login page
app.get("/login", (req, res) =>
{
    res.sendFile(path.join(__dirname, "../chat/login.html"));
})
app.post("/login", async (req, res) =>
{
    try
    {
        const mailid = req.body.mail;
        const logpass = req.body.password;
        // console.log("sasti "+mailid)
        // console.log("sasti "+logpass)
        const logAccess = await db.findOne({ email: mailid })//matching id
        // console.log("mahnga "+logAccess.email)
        // console.log("mahnga "+logAccess.pass)
        if (logAccess.pass == req.body.password)
        {
            //  console.log("Access granted");
            res.status(201).send("submited successfully");
        }
        else
        {
            //document.getElementById("msg").style.display = "inline-block";
            console.log("galat hai")
        }
    }
    catch (error)
    {
        console.log(error);
        res.status(400).send()
    }

})
