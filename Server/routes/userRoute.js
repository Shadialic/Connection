import { Router } from 'express';
import {postUser} from '../controller/auth.js'; 
import multer from 'multer';
const userRouter = Router();
const upload = multer({ dest: 'uploads/' });
// userRouter.get('/user',LoadUser);
userRouter.post('/Signup',upload.single('image'),postUser)

export default userRouter;
