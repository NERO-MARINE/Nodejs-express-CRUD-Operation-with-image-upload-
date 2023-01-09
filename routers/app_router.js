const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../model/user');
const multer = require('multer');
const fs = require('fs');


let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    // file name for uploaded files
    filename: function(req,file,cb){
        // cb(null, file.fieldname+'_'+Date.now()+'_'+file.originalname);
        cb(null, file.fieldname+'_'+file.originalname);
    }
})

let upload = multer({
    storage: storage,
}).single('image');

// post a user into database
router.post('/add', upload, async(req,res)=>{
   try{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    })
     await user.save();
     req.flash('success', 'User added sucessfully')
     res.redirect('/')
   }
   catch(err){
       console.log(err)
   }
})

// find all users
router.get('/profile', async(req,res)=>{
    try{
        const users = await User.find()
        res.render('profile', {users})
    }
    catch(err){
        console.log(err)
    }
})


// edit user
router.get('/edit/:id', async(req,res)=>{
  try{
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
          res.redirect('/');
          return;
    }

    const user = await User.findById(id)
    res.render('update_user', {user})
  }

  catch(err){
      console.log(err)
  }

})

// update user
router.put('/update/:id', upload, async(req,res)=>{
    try{
        const id = req.params.id;
        let new_image = '';
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.redirect('/');
            return;
            }

        if(req.file){
            new_image = req.file.filename;
            // remove the old image with fs module
            try{
                fs.unlinkSync('./uploads/' +req.body.old_image);
            }
            catch(err){
               console.log(err)
            }

        } else{
            new_image = req.body.old_image
        }
          
        const updateUser = await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image
        }, {new: true})
        req.flash('success', 'User update sucessfully')
        res.redirect('/profile');
    }
    catch(err){
        console.log(err)
    }
})

// DELETE USER
router.delete('/delete/:id', async(req,res)=>{
   try{
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.redirect('/');
        return;
    }
    const user = await User.findByIdAndDelete(id);
    if(user.image !== ''){
        fs.unlinkSync('./uploads/' +user.image);
    }
    req.flash('success', 'User deleted sucessfully')
    res.redirect('/')
   }
   catch(err){
       console.log(err);
   }
})


router.get('/', (req,res)=>{
    res.render('index')
})


router.get('/add_users', (req,res)=>{
    res.render('addusers')
})

module.exports = router;