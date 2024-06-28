import { Router } from 'express';
import {postUser,LoadUser, getAllUsers, otpVerification, searchUsers} from '../controller/auth.js'; 
import multer from 'multer';
const userRouter = Router();
const upload = multer({ dest: 'uploads/' });

userRouter.post('/login',LoadUser);
userRouter.post('/otp',otpVerification);

userRouter.post('/Signup',upload.single('image'),postUser)
userRouter.get('/searchUsers',searchUsers)
userRouter.get('/getAllUsers',getAllUsers)


export default userRouter;
