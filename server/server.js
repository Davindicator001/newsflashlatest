import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { registerUser, loginUser, verifyToken, fetchUserData } from './auth.js';
import { fetchBlogsData, fetchBlogData, fetchCommmentsData, fetchRepliesData } from './blog.js';
import { likeBLog, likeComment, addComment, addReply } from './user.js';
dotenv.config({path: "../.env"});

const app = express();
const PORT = process.env.PORT
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET = process.env.SUPABASE_SECRET;
app.use(express.json());
app.use(cors());
export const supabase = createClient(SUPABASE_URL,SUPABASE_SECRET);

app.post('/api/register', registerUser);
app.post('/api/login', loginUser);

app.get('/user', verifyToken, fetchUserData);

app.get('/posts', fetchBlogsData);
app.get('/posts/:blogId', fetchBlogData);
app.put('/posts/:blogId/:userId/like', likeBLog);

app.get('/posts/:blogId/comments', fetchCommmentsData);
app.post('/posts/:blogId/comment', addComment);
app.put('/comments/:commentId/:userId/like', likeComment);

app.get('/posts/:blogId/replies', fetchRepliesData);
app.post('/posts/:commentId/reply', addReply);

app.get('/', (req,res)=>{
    return res.status(200).json({status:true, message: "All GOOD, Server's UP"})
})
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})