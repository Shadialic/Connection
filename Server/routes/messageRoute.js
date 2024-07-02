import { Router } from 'express';
import { deleteMessage, editMessage, getAllMessages, sendMessae } from '../controller/messageController.js'
const messageRouter=Router()

messageRouter.post('/',sendMessae)
messageRouter.get('/:chatId',getAllMessages)
messageRouter.put('/delete/:id',deleteMessage)
messageRouter.put('/edit',editMessage)






export default messageRouter;