import { Router } from 'express';
import {postUser,LoadUser} from '../controller/auth.js'; 
import multer from 'multer';
const userRouter = Router();
const upload = multer({ dest: 'uploads/' });


userRouter.post('/login',LoadUser);
userRouter.post('/Signup',upload.single('image'),postUser)

export default userRouter;
