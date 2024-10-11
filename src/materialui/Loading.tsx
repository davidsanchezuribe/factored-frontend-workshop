import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography } from '@mui/material';

type LoadingFunctionalProps = {
  loading: boolean,
};

export type LoadingStyleProps = {
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit',
  size?: 'small' | 'medium' | 'large' | number,
  thickness?: | number,
  horizontal?: number,
  vertical?: number,
  message?: string,
};

type LoadingProps = LoadingFunctionalProps & LoadingStyleProps;

const sizeToNumber = { small: 25, medium: 50, large: 75 };

const Loading = ({
  loading,
  color = 'primary',
  size = 'medium',
  thickness,
  horizontal = 50,
  vertical = 50,
  message,
}: LoadingProps) => {
  if (!loading) return null;
  const sizeNumber = typeof size === 'number' ? size : sizeToNumber[size];
  const textWidth = 200;
  return (
    <>
      <Box
        position="absolute"
        top={`${vertical}%`}
        right={`${horizontal}%`}
        mt={-sizeNumber / 15}
        mr={-sizeNumber / 15}
      >
        <CircularProgress
          color={color}
          size={sizeNumber}
          thickness={thickness}
        />
      </Box>
      { message && (
      <Box
        position="absolute"
        top={`${vertical}%`}
        right={`${horizontal}%`}
        mt={sizeNumber / 14}
        mr={-textWidth / 16}
      >
        <Typography
          align="center"
          width={textWidth}
        >
          {message}
        </Typography>
      </Box>
      )}

    </>
  );
};

Loading.defaultProps = {
  color: undefined,
  size: undefined,
  thickness: undefined,
  horizontal: undefined,
  vertical: undefined,
  message: undefined,
};

export type WithLoadingProps = {
  loading: boolean,
  setLoading: (loading: boolean) => void,
  setLoadingMessage: (loadingMessage: string | undefined) => void,
};

export const withLoading = <P extends WithLoadingProps>(
  Component: React.ComponentType<P>,
  loadingStyleProps?: LoadingStyleProps,
) => (props: Omit<P, keyof WithLoadingProps>) => {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);
    return (
      <>
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props as P}
          loading={loading}
          setLoading={setLoading}
          setLoadingMessage={setLoadingMessage}
        />
        <Loading
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...loadingStyleProps}
          loading={loading}
          message={loadingMessage}
        />
      </>
    );
  };

export default Loading;
