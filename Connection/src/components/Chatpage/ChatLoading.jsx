import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

function ChatLoading() {
  return (
    <Grid container spacing={1} direction="column">
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={45} />
      </Grid>
    </Grid>
  );
}

export default ChatLoading;
