const express =require("express");
const path=require("path");
const exphbs=require("express-handlebars");
const port = process.env.PORT||3000;
const app=express();

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/layout/chat.hbs"));
})
app.listen(port,()=>{
    console.log(`listening at ${port}`);
})



var hbs= exphbs.create({
    extname:'hbs',
    defaultLayout:'main',
    layoutdir:path.join(__dirname,'views/layout')
})
app.set('views',path.join(__dirname,'../views'));
app.set('view engine','hbs');
app.engine('hbs',hbs.engine);
