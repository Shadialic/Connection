import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { useChatState } from '../../context/ChatProvider';
import { isLastMessage, isSameSender } from '../../config/ChatLogics';
import { Avatar, Tooltip } from '@mui/material';
function ScrollableChat({messages}) {
    console.log(messages,'messages');
    const {  user } =useChatState();
  return (
    <div>
        
        <ScrollableFeed>
       {messages&&messages.map((m,i)=>{
        <div
        key={m.id}
        >
            {(isSameSender(messages,m,i,user.id)||
            isLastMessage(messages,i,user.id)
            
        )&&(
            <Tooltip title='s'>
                <Avatar
                    // alt="Remy Sharp"
                    src={i.sender.picture}
                    sx={{ width: 46, height: 46 }}
                  />
                  <h1>{m.content}</h1>
  
</Tooltip>
        )
            }

        </div>
       })}
        </ScrollableFeed>
    </div>
  )
}

export default ScrollableChat