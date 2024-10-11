import React, { useEffect, useState } from 'react';
import GoogleButton from 'react-google-button';
import { Box, Button } from '@mui/material';
import { SignInWithProvider } from '../AuthManagerTypes';
import useLocalization from '../../localization/useLocalization';
import FormField from '../../materialui/FormField';
import facebookButton from '../../images/facebookButton.png';
import twitterButton from '../../images/twitterButton.png';
import {
  checkRedirectResult, signInWithFacebook, signInWithGoogle, signInWithTwitter,
} from '../authManager';
import useFeedback from '../../materialui/useFeedback';

type SocialProvidersProps = {
  authProviders: (string | undefined)[],
  onSuccess?: () => void,
  onSuccessMessage?: string,
  email?: string,
  setResolver?: (resolver: unknown) => void,
  setCheckingRedirect?: (checkingRedirect: boolean) => void,
  mb?: number,
};

const SocialProviders = ({
  authProviders,
  onSuccess,
  onSuccessMessage,
  email,
  setResolver,
  setCheckingRedirect,
  mb = 0,
}: SocialProvidersProps) => {
  const { getMessages, getLanguage } = useLocalization();
  const { socialProviders: messages } = getMessages();
  const languageCode = getLanguage();
  const { fnHardHandler, toast } = useFeedback();
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [facebookSubmitting, setFacebookSubmitting] = useState(false);
  const [twitterSubmitting, setTwitterSubmitting] = useState(false);
  const resolveExistingProvidersError = {
    fn: (errorPayload?: unknown) => {
      if (errorPayload) {
        const providers = (errorPayload as string).split(',');
        const {
          prefix,
          and,
          suffix,
          password,
          emailLink,
        } = messages.existingSignInMethods;
        const translate = (provider: string) => {
          if (provider === 'password') return password;
          if (provider === 'emailLink') return emailLink;
          return provider;
        };
        const providerList = providers.reduce((acum, provider, index) => {
          if (index === providers.length - 2) return `${acum}${translate(provider)} ${and} `;
          if (index === providers.length - 1) return `${acum}${translate(provider)}`;
          return `${acum}${translate(provider)}, `;
        }, '');
        toast(`${prefix} ${providerList}. ${suffix}`, 'error', undefined, null);
      } else {
        toast(messages.providerSignInErrors['auth/account-exists-with-different-credential'], 'error');
      }
    },
    toast: false,
  };
  const googleProvider = authProviders.includes('google.com');
  const facebookProvider = authProviders.includes('facebook.com');
  const twitterProvider = authProviders.includes('twitter.com');
  useEffect(() => {
    if (checkRedirectResult) {
      fnHardHandler(
        checkRedirectResult(),
        {
          onSuccess,
          onSuccessMessage,
          setSubmitting: setCheckingRedirect,
          errorMessages: messages.providerSignInErrors,
          resolveError: {
            'auth/multi-factor-auth-required': setResolver,
            'auth/account-exists-with-different-credential': resolveExistingProvidersError,
            'auth/user-not-signed': false,
          },
        },
      );
    }
  }, []);
  const signInWith = (
    signInWithProvider: SignInWithProvider,
    setProviderSubmitting: (submitting: boolean) => void,
  ) => () => {
    const isMobile = process.env.CUSTOM_AUTH_DOMAIN === '' ? false
      : /Android|iPad|iPhone|iPod/i.test(navigator.userAgent);
    fnHardHandler(
      signInWithProvider(isMobile, languageCode, email),
      {
        resolveError: {
          'auth/multi-factor-auth-required': setResolver,
          'auth/web-storage-unsupported': () => fnHardHandler(
            signInWithProvider(false, languageCode, email),
            {
              errorMessages: messages.providerSignInErrors,
              onSuccess,
              onSuccessMessage,
              setSubmitting: setProviderSubmitting,
              resolveError: {
                'auth/multi-factor-auth-required': setResolver,
              },
            },
          ),
          'auth/popup-blocked': () => fnHardHandler(
            signInWithProvider(true, languageCode, email),
            {
              errorMessages: messages.providerSignInErrors,
              onSuccess,
              onSuccessMessage,
              setSubmitting: setProviderSubmitting,
              resolveError: {
                'auth/multi-factor-auth-required': setResolver,
              },
            },
          ),
          'auth/account-exists-with-different-credential': resolveExistingProvidersError,
        },
        errorMessages: messages.providerSignInErrors,
        onSuccess,
        onSuccessMessage,
        hideLoading: !isMobile,
        setSubmitting: setProviderSubmitting,
      },
    );
  };
  // const Separator = () => (googleProvider || facebookProvider || twitterProvider) && (
  //   <Divider variant="middle" sx={{ mt: 2 }}>{messages.or}</Divider>
  // );
  return (
    <Box mb={mb}>
      { googleProvider && (
        <FormField mt={2}>
          <GoogleButton
            onClick={signInWith(signInWithGoogle, setGoogleSubmitting)}
            disabled={googleSubmitting}
          />
        </FormField>
      )}
      { facebookProvider && (
        <FormField mt={1}>
          <Button
            onClick={signInWith(signInWithFacebook, setFacebookSubmitting)}
            disabled={facebookSubmitting}
          >
            <img width="242" height="40" src={facebookButton} alt={messages.facebookAlt} />
          </Button>
        </FormField>
      )}
      { twitterProvider && (
        <FormField>
          <Button
            onClick={signInWith(signInWithTwitter, setTwitterSubmitting)}
            disabled={twitterSubmitting}
          >
            <img width="242" src={twitterButton} alt={messages.twitterAlt} />
          </Button>
        </FormField>
      )}
    </Box>
  );
};

export default SocialProviders;
