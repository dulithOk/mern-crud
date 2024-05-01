const express = require('express');
const posts = require('../models/post');
const mongoose = require('mongoose');
const routes = express.Router();

const cors = require('cors'); // Import CORS middleware



// Use CORS middleware
routes.use(cors());

//save post

routes.post('/post/save', async (req, res) => {
    
    const { topic } = req.query;
    //res.setHeader("Access-Control-Allow-Origin", "*")
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    try {

     // Check if a post with the same topic already exists
    const existingPost = await posts.findOne({ topic: topic });
    if (existingPost) {
        
      // If a post with the same topic exists, return an error response
      return res.json({ isDuplicate: !!existingPost }); // Send true if duplicate found, false otherwise
    }
      // Assuming you're using Mongoose and 'posts' is your model
      const newPost = new posts(req.body);
      await newPost.save();
      
      return res.status(200).json({
        success: "Post saved successfully"
      });
    } catch (err) {
      console.log("Error:", err);
      return res.status(400).json({
        error: err.message
      });
    }
  });

/*routes.post('/post/save',(req,res)=>{

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    let newPost = new posts(req.body);

    console.log('fgfg',newPost);
    
    newPost.save()
        .then(() => {
            return res.status(200).json({
                success: "Post saved successfully"
            });
        })
        .catch((err) => {
            console.log("Error is", err);
            return res.status(400).json({
                error: err
            });
        });

});*/

routes.get('/get/all',(req,res)=>{

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    posts.find().exec()
        .then(posts => {
            return res.status(200).json({
                success: true,
                existingPosts: posts
            });
        })
        .catch(err => {
            return res.status(400).json({
                error: err
            });
        });


});

routes.put('/update/:id', (req, res) => {
    const postId = req.params.id;
    const update = req.body; // Assuming the update object is sent in the request body
    console.log("dfdf",update);
    // Validate if postId is a valid ObjectId (assuming you're using MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Find the post by its ID and update it
    posts.findByIdAndUpdate(postId, update, { new: true })
        .then(updatedPost => {
            if (!updatedPost) {
                return res.status(404).json({ error: 'Post not found' });
            }
            return res.status(200).json({ success: true, updatedPost });
        })
        .catch(err => {
            return res.status(500).json({ error: 'Internal server error' });
        });
});

routes.delete('/delete/:id',(req,res)=>{

    const postId = req.params.id;

    // Validate if postId is a valid ObjectId (assuming you're using MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    posts.findByIdAndDelete(postId)
    .then(deletedPost =>{

        if (!deletedPost) {

            return res.status(404).json({ error: 'Post not found' });
        }
        return res.status(200).json({ success: true, deletedPost });
    })

    .catch((err)=>{

        return res.status(500).json({

            error:err
        });
    });
});

//get a specific post

routes.get("/post/:id",(req,res)=>{

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    let postId = req.params.id;
    console.log(postId);

    posts.findById(postId)
    .then(post=>{

        if(!post){

            console.log('not found');
            return res.status(404).json({
                
                success:false,
                message : "not found"
                
            });

        }
        console.log('good');
        return res.status(200).json({

            success:true,
            message : post
        });

    })
    .catch(err=>{
       
        console.log('errrrrrrrr');
        return res.status(400).json({

            success:false,
            error : err
        });
    })



});


module.exports = routes;
