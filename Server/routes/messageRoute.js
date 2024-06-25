import { Router } from 'express';
import { getAllMessages, sendMessae } from '../controller/messageController.js'
const messageRouter=Router()

messageRouter.post('/',sendMessae)
messageRouter.get('/:chatId',getAllMessages)




export default messageRouter;