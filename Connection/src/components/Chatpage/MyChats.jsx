import React from "react";
import {  TextField, IconButton } from '@material-ui/core';

import { SearchOutlined } from '@material-ui/icons';
function MyChats() {
  return (
    <div className="w-[30%] border-r-2">
      <h1 className="font-prompt-semibold text-black text-2xl mb-4 p-4">
        Messages
      </h1>
      <TextField
                fullWidth
                id="standard-bare"
                variant="outlined"
                defaultValue="How can we help"
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchOutlined />
                    </IconButton>
                  ),
                }}
              />
    </div>
  );
}

export default MyChats;
