import React from 'react';
import {
  Box, Fab, Fade, useScrollTrigger,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getBreakpointValue } from '../materialui/getBreakpoint';

const ScrollToTopButton = () => {
  const trigger = useScrollTrigger({
    target: window || undefined,
    disableHysteresis: true,
    threshold: 100,
  });
  const size: 'small' | 'medium' | 'large' = getBreakpointValue(['small', 'medium', 'medium', 'large', 'large']);
  const position = getBreakpointValue([16, 24, 24, 32, 32]);
  return (
    <Fade in={trigger}>
      <Box
        onClick={() => { window.scrollTo(0, 0); }}
        role="presentation"
        sx={{ position: 'fixed', bottom: position, right: position }}
      >
        <Fab size={size} aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Fade>
  );
};

export default ScrollToTopButton;
