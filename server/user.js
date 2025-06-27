import {supabase} from './server.js';
import { insertComment, insertReply } from './database.js';
function contains(arr=[], value){
    if(arr.findIndex(id => id == value) >= 0){
        return true;
    }else return false;
}
export const likeBLog = async (req,res) =>{
    try{
        const {userId,blogId} = req.params;
        const {data,error} = await supabase.from("blog_posts").select("*").eq("id",blogId).single();
        if(error) throw error;
        var like_value = [];
        var likes = 0;
        if(contains(data.user_liked, userId)){
            like_value = data.user_liked.filter( id => id != userId);
            likes = like_value.length
        }else{
            like_value = [...data.user_liked,userId];
            likes = like_value.length
        }
        const newData = {
            user_liked: like_value,
            likes: likes
        };
        const {data:success,error:UpdateError} = await supabase.from("blog_posts").update(newData).eq("id",blogId);
        if(!UpdateError){
            return res.status(200).json({message:"Post liked successfully"});
        }else throw UpdateError;
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const likeComment = async (req,res) =>{
    try{
        const {userId,commentId} = req.params;
        const {data,error} = await supabase.from("comments").select("*").eq("id",commentId).single();
        if(error) throw error;
        var like_value = [];
        var likes = 0;
        if(contains(data.user_liked, userId)){
            like_value = data.user_liked.filter( id => id != userId);
            likes = like_value.length
        }else{
            like_value = [...data.user_liked,userId];
            likes = like_value.length
        }
        const newData = {
            user_liked: like_value,
            likes: likes
        };
        const {data:success,error:UpdateError} = await supabase.from("comments").update(newData).eq("id",commentId);
        if(!UpdateError){
            return res.status(200).json({message:"Comment liked successfully"});
        }else throw `Error updating ${UpdateError}`;
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const addComment = async (req,res) =>{
    try{
        const {blogId} = req.params;
        const comment = req.body;
        const success = await insertComment(comment);
        if(success){
            const blog_comment = await supabase.from("blog_posts").select("comments").eq("id",blogId).single();
            const {error} = await supabase.from("blog_posts").update({comments: blog_comment.comments +1}).eq("id",blogId);
            if(error) throw error;
            return res.status(200).json({message: "Comment Added Successfully"});
        }else throw "Error adding Comment"
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
export const addReply = async (req,res) =>{
    try{
        const {commentId} = req.params;
        const reply = req.body;
        const success = await insertReply(reply);
        if(success){
            const {data:comment_reply} = await supabase.from("comments").select("replies,blog_post_id").eq("id",commentId).single();
            const {data:blog_comments} = await supabase.from("blog_posts").select("comments").eq("id",comment_reply.blog_post_id).single();
            const {error} = await supabase.from("blog_posts").update({comments: blog_comments.comments +1}).eq("id",comment_reply.blog_post_id);
            if(error) throw error;
            const {error: RepliesError} = await supabase.from("comments").update({replies: comment_reply.replies + 1}).eq("id",commentId);
            if(RepliesError) throw `Reply increament error ${RepliesError}`;
            return res.status(200).json({message: "Comment Added Successfully"});
        }else throw "Error adding Reply"
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}