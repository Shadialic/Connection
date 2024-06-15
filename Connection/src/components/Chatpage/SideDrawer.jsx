import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
function SideDrawer() {
  const [search, serSearch] = useState();
  const [searchResult, serSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState();

  return (
    <div>
      <Tooltip title="Search Users to chat" arrow>
        <Button>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Button>
      </Tooltip>
    </div>
  );
}

export default SideDrawer;
