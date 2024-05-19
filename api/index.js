const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadmiddleware = multer({dest:'uploads/'});
const fs = require('fs');

const salt= bcrypt.genSaltSync(10);
const tokensalt = 'AnonymousShad0w8';

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://vikramviks0802:ei6kTjyQQjnoletR@cluster0.kalkm7h.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) => {
    const {username,password} = req.body;
        try {
            const userDoc = await User.create({
                username, 
                password:bcrypt.hashSync(password,salt),
            });
            res.json(userDoc);
        } catch (e) {
            res.status(400).json(e);
        }  
});

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const pk = bcrypt.compareSync(password,userDoc.password);
    if(pk){
        //logged in
        jwt.sign({username, id:userDoc._id}, tokensalt, {}, (err,token) =>{
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
    }
    else{
        res.status(400).json('wrong credentials');
    }
})

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, tokensalt, {}, (err,info) =>{
        if(err) throw err;
        res.json(info);
    });
    res.json(req.cookies);
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post',uploadmiddleware.single('file'), async (req,res) =>{
    const {originalname,path} = req.file;
    const part = originalname.split('.');
    const ext = part[part.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, tokensalt, {}, async (err,info) =>{
        if(err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
            title:title,
            summary:summary,
            content:content,
            cover:newPath,
            author:info.id,
        });
        res.json(postDoc);
    });

});

app.put('/post' ,uploadmiddleware.single('file'), async(req,res) => {
    var newPath = null;
    if(req.file){
        const {originalname,path} = req.file;
        const part = originalname.split('.');
        const ext = part[part.length - 1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, tokensalt, {}, async (err,info) =>{
        if(err) throw err;
        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author._id) === JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('NOT THE AUTHOR');
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });
})

app.get('/post', async (req,res) => {
    res.json(
        await Post.find()
        .populate('author',['username'])
        .sort({createdAt:-1})
        .limit(20)
    );
});

app.get('/post/:id' , async (req,res) =>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

app.listen(4000);


//mongodb+srv://vikramviks0802:ei6kTjyQQjnoletR@cluster0.kalkm7h.mongodb.net/
