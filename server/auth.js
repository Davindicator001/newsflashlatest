import bcrypt from 'bcrypt';
import { insertUserData } from './database.js';
import dotenv from 'dotenv';
import { supabase } from './server.js';
import jwt from 'jsonwebtoken';

dotenv.config({ path: "../.env" });

const JWT_SECRET = process.env.JWT_SECRET;
export const registerUser = async (req, res) => {
    try {
        const { email, username, password} = req.body;
        const {data,error} = await supabase.from("users")
                                    .select("email")
                                    .eq("email",email)
        if (error) throw error;
        if(data.length < 1){
            const hashedPassword = await bcrypt.hash(password,10);
            const userData = {
                email,
                username,
                password: hashedPassword
            };
        const success = await insertUserData(userData);
        
        if (success) {
            const token = jwt.sign({email: userData.email}, JWT_SECRET, {expiresIn:'30d'});
            return res.status(200).json({ token: token, user:{
                email,
                username,
            },message: "user registered Successfully" });
        } else throw "Error inserting UserData";
        }
        else{
            return res.status(401).json({message: "user already registered"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Internal Server Error` });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data:userData, error } = await supabase.from('users').select('*').eq("email",email).single();
        if (!userData) throw "User not found";
        if(error) throw error;

        const isMatch = await bcrypt.compare(password,userData.password);
        if(isMatch){
            const token = jwt.sign({email: userData.email,id: userData.id}, JWT_SECRET, {expiresIn:'30d'});
            return res.status(200).json({token: token,user: {
                username: userData.username,
                id: userData.id
            }, message: "Login Successfully"});
        }else throw "Invalid Credentials";
    }catch(error){
        console.log(error);
        return res.status(500).json({message: `${error}`});
    }
}

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
};

export const fetchUserData = async (req, res) => {
    try {
      const decoded = req.user
      const userEmail = decoded.email;
  
      if (!userEmail) {
          return res.status(400).json({ message: 'Email not found in token' });
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (userError) {
        console.error('Error fetching user data from Supabase:', userError);
        return res.status(500).json({ message: 'Error fetching user data', details: userError.message });
      }
  
      if (!userData) {
          return res.status(404).json({ message: 'User not found' });
      }
      
      const responseData = {
        email: userData.email,
        username: userData.username,
        id: userData.id
      };
      return res.status(200).json(responseData);
  
    } catch (error) {
      console.error('Token verification or other error in fetchUserData:', error);
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Invalid or Expired Token', details: error.message });
      }
      return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
  };