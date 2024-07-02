import React from "react";
import NavBar from "../Layouts/NavBar";
import { Box } from "@mui/material";
import SingleChat from "./SingleChat";

function ChatBox({ fetchAgain, setFetchAgain }) {
  return (
    <>
      <Box className="flex flex-col w-full h-full">
        <NavBar />
        <Box className="w-full h-3/4">
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
      </Box>
    </>
  );
}

export default ChatBox;
