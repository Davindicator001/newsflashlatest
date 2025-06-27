import { supabase } from './server.js';

export const insertUserData = async (formData = {}) => {
    try{
        const {data,error} = await supabase.from('users').insert(formData)
        if(error) throw error;
        return true;
    }catch(error){
        return null;
    }
}

export const insertComment = async (formData = {}) => {
    try{
        const {data,error} = await supabase.from('comments').insert(formData)
        if(error){
            console.log(error)
            throw error
        }
        return true;
    }catch(error){
        return null;
    }
}

export const insertReply = async (formData = {}) => {
    try{
        const {data,error} = await supabase.from('replies').insert(formData)
        if(error){
            console.log("error inserting reply", error)
            throw error
        }
        return true;
    }catch(error){
        return null;
    }
}