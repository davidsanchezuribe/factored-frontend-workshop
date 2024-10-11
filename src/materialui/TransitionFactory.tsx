import React from 'react';
import { Slide, SlideProps } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

type CustomTransitionProps = {
  slide?: 'left' | 'right' | 'up' | 'down' | true,
};

const UpTransition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
// eslint-disable-next-line react/jsx-props-no-spreading
) => <Slide direction="up" ref={ref} {...props} />);

const RightTransition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
// eslint-disable-next-line react/jsx-props-no-spreading
) => <Slide direction="right" ref={ref} {...props} />);

const DownTransition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
// eslint-disable-next-line react/jsx-props-no-spreading
) => <Slide direction="down" ref={ref} {...props} />);

const LeftTransition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
// eslint-disable-next-line react/jsx-props-no-spreading
) => <Slide direction="left" ref={ref} {...props} />);

const ForwardTransition = ({ slide }: CustomTransitionProps) => {
  if (slide === true || slide === 'up') return UpTransition;
  if (slide === 'right') return RightTransition;
  if (slide === 'down') return DownTransition;
  return LeftTransition;
};

const NormalTransition = ({ slide }: CustomTransitionProps) => {
  const direction = slide === true ? 'up' : slide;
  return ({
    appear, children, container, easing, in: inProp, ref, timeout,
  }: SlideProps) => (
    <Slide
      appear={appear}
      container={container}
      direction={direction}
      easing={easing}
      in={inProp}
      ref={ref}
      timeout={timeout}
    >
      {children}
    </Slide>
  );
};

type TransitionFactoryProps = {
  slide?: 'left' | 'right' | 'up' | 'down' | boolean,
  forwardRef?: boolean,
};

const TransitionFactory = ({ slide, forwardRef }: TransitionFactoryProps) => {
  if (!slide) return undefined;
  if (forwardRef) return ForwardTransition({ slide });
  return NormalTransition({ slide });
};

export default TransitionFactory;
