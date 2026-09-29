const express = require("express");
const path = require("path");
const { v4 : uuidv4 } = require ('uuid');
const multer  = require('multer'); //multer
const fs = require("fs"); //filesystem
const methodOverride = require('method-override'); //method-override



const app = express();
const port = 3000;


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'))



app.use(express.urlencoded({extended : true}));//middleware 

app.listen(port,() => {
    console.log("listening on port 3000");
});

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public');
    },
    filename: function(req, file, cb){
        // const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

let posts = [
    {
        id : uuidv4(),
        image : "/mtdp.jpg",
        username : "raheman.4",
        name : "MD Raheman",
        postsCount : "2",
        followers : "359",
        following : "293",
        content : "رحمان 📍Hyd nov_13🎂 Hodophile detox building physique "
    },
    {
        id : uuidv4(),
        image : "/mtdp.jpg",
        username : "swathirojha",
        name : "Swatii",
        postsCount : "220",
        followers : "616k",
        following : "486",
        content : "Digital creator Motorcycles | Travel | Lifestyle | Fitness YT - 620 k + Neuro Physio लोकाः समस्ताः सुखिनो भवन्तु। youtube.com/@swatirojha?si=Y9f82hb5hD3yt-G4"
    }
]

app.get("/posts",(req, res)=>{
    res.render("index.ejs",{ posts });
});

app.get("/people",(req, res)=>{
    res.render("People.ejs",{ posts });
});

app.get("/posts/:id",(req, res)=>{
    let {id} = req.params;
    let post = posts.find((p) => id === p.id); 
    console.log(post);
    res.render("index.ejs",{ posts: [post] });// chatGpt
})

app.get("/people/new",(req, res)=>{
    res.render("new.ejs");
});

app.get("/posts/:id/edit",(req, res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id); 
    res.render("edit.ejs", { posts });
});

app.delete("/posts/:id/",(req, res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id); 
    res.redirect(`/people`);
})

app.patch("/posts/:id", (req, res)=>{
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent; 
    console.log(post);
    res.redirect(`/posts/${id}`); 
})

app.post("/newPeople", upload.single("avatar"),(req, res)=>{
    let { username, name, postsCount, followers, following, content } = req.body;
    posts.push({
        id: uuidv4(),
        image: req.file ? `/${req.file.filename}` : "/mtdp.jpg",
        username,
        name,
        postsCount,
        followers,
        following,
        content
    });
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/people");
});






