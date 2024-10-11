import React from 'react';
import { RecaptchaVerifier } from 'firebase/auth';
import FormButtons, { FormButtonsProps } from '../../materialui/FormButtons';
import { invisibleRecaptcha } from '../authManager';

const withCaptcha = <P extends FormButtonsProps>(
  BaseFormButtons: React.ComponentType<P>,
) => (props: Omit<P, 'captchaRef'>
  // eslint-disable-next-line react/require-default-props
  & { setVerifier?: (verifier: RecaptchaVerifier | undefined) => void }) => {
    const { setVerifier } = props;
    const captchaRef = setVerifier ? invisibleRecaptcha(setVerifier) : undefined;
    return (
      <BaseFormButtons
      // eslint-disable-next-line react/jsx-props-no-spreading
        {...props as P}
        captchaRef={captchaRef}
      />
    );
  };

export default withCaptcha(FormButtons);
