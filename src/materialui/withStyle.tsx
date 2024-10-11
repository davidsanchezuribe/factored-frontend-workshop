import React, { useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import theme from './theme';
import Toast, { useToast } from './Toast';
import {
  FeedbackContext, FeedbackContextType, handler, hardHandler,
} from './useFeedback';
import Loading from './Loading';

const withStyle = (BaseApp: React.ComponentType) => () => {
  const {
    open, setOpen, info, toast,
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);
  const fnHandler = handler(setLoading, toast);
  const fnHardHandler = hardHandler(setLoading, toast);
  const feedback: FeedbackContextType = useMemo(() => ({
    fnHandler,
    fnHardHandler,
    toast,
    loading,
    setLoading,
    setLoadingMessage,
  }), []);
  return (
    <ThemeProvider theme={theme}>
      <Container fixed>
        <FeedbackContext.Provider value={feedback}>
          <CssBaseline />
          <BaseApp />
          <Toast
            open={open}
            setOpen={setOpen}
            info={info}
          />
          <Loading
            loading={loading}
            message={loadingMessage}
          />
        </FeedbackContext.Provider>
      </Container>
    </ThemeProvider>
  );
};

export default withStyle;
