const express = require("express");
const path = require("path");
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

// Database Connection
require("./registration"); // connecting to db
const db = require("./registration"); // importing model

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../chat')));

// Routes

// Chat Page (Home)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../chat/chat.html"));
});

// Registration Page
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../chat/registration.html"));
});

app.post("/register", async (req, res) => {
    try {
        const password = req.body.pass;
        const conpassword = req.body.conpass;
        if (password === conpassword) {
            const regis = new db({
                name: req.body.name,
                gender: req.body.gender,
                email: req.body.email,
                phone: req.body.phone,
                pass: password,
                conpass: conpassword
            });
            await regis.save();
            res.status(201).send("Submitted successfully");
        } else {
            res.status(400).send("Passwords do not match");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Error registering user");
    }
});

// Login Page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../chat/login.html"));
});

app.post("/login", async (req, res) => {
    try {
        const mailid = req.body.mail;
        const logpass = req.body.password;
        const logAccess = await db.findOne({ email: mailid });

        if (logAccess && logAccess.pass === logpass) {
            res.status(201).send("Submitted successfully");
        } else {
            res.status(400).send("Invalid Credentials");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Error logging in");
    }
});

// Socket.io Logic
const users = {};

io.on('connection', socket => {
    // Handle new user join
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // Handle message send
    socket.on('send', msg => {
        socket.broadcast.emit("receive", { message: msg, name: users[socket.id] });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        }
    });
});

server.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
