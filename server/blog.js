import { supabase } from "./server.js";

export const fetchBlogsData = async (req,res) =>{
    try{
        const {tab} = req.params
        const{data,error} = await supabase.from("blog_posts")
                                    .select("*")
                                    .limit(10);
        if(error) throw error;
        return res.status(200).json(data);
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"internal server error"})
    }
}

export const fetchBlogData = async (req,res) =>{
    try{
        const {blogId} = req.params;
        const {data,error} = await supabase.from("blog_posts")
                                            .select("*")
                                            .eq("id",blogId)
                                            .single();
        if(error) throw error;
        const post = {
            title: data.title,
            content: data.content,
            likes: data.user_liked.length,
            id: data.id,
            user_liked: data.user_liked
        }
        return res.status(200).json(post);
    }catch(error){
        console.log(error);
        return res.status(500).json({message:'Internal Server Error'})
    }
}
export const fetchCommmentsData = async (req,res) =>{
    try{
        const {blogId} = req.params;
        const {data,error} = await supabase.from("comments")
                                            .select("author,id,text,user_liked,likes,created_at")
                                            .eq("blog_post_id",blogId)
        if(error) throw error
        return res.status(200).json(data);
    }catch(error){
        console.log(error);
        return res.status(500).json({message:'Internal Server Error'})
    }
}
export const fetchRepliesData = async (req,res) =>{
    try{
        const {blogId} = req.params;
        const {data,error} = await supabase.from("replies")
                                            .select("*")
                                            .eq("blog_post_id",blogId)
        if(error) throw error
        return res.status(200).json(data);
    }catch(error){
        console.log(error);
        return res.status(500).json({message:'Internal Server Error'})
    }
}
