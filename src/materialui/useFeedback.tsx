import { createContext, useContext } from 'react';
import { WithLoadingProps } from './Loading';
import {
  ToastFn, WithToastProps,
} from './Toast';

type HandlerActions = {
  onSuccess?: () => void,
  onError?: () => void,
  onSuccessMessage?: string,
  onSuccessSeverity?: 'success' | 'warning' | 'info' | 'error',
  setSubmitting?: (isSubmitting: boolean) => void,
  keepSubmittingOnSuccess?: boolean,
  hideLoading?: boolean,
};

type SetPayloadAction<T> = T extends void ? { } : { setPayload?: (payload: T) => void };

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const handler = (
  setLoading: (loading: boolean) => void,
  toast: ToastFn,
) => <T extends unknown>(
  asyncFn: () => Promise<T>,
  actions?: HandlerActions & SetPayloadAction<T>,
) => {
  const {
    hideLoading,
    onSuccess,
    onError,
    onSuccessMessage,
    onSuccessSeverity = 'success',
    setSubmitting,
    keepSubmittingOnSuccess,
  } = actions || {};
  if (setSubmitting) setSubmitting(true);
  if (!hideLoading) setLoading(true);
  asyncFn().then((result) => {
    if (actions && 'setPayload' in actions && actions.setPayload) {
      const { setPayload } = actions;
      setPayload(result);
    }
    if (onSuccess) onSuccess();
    if (onSuccessMessage) toast(onSuccessMessage, onSuccessSeverity);
    if (setSubmitting && !keepSubmittingOnSuccess) setSubmitting(false);
  }).catch((error: unknown) => {
    if (onError) onError();
    const errorMessage = getErrorMessage(error);
    toast(errorMessage, 'error');
    if (setSubmitting) setSubmitting(false);
  }).finally(() => {
    if (!hideLoading) setLoading(false);
  });
};

type ResolveError<E extends string> = Partial<{
  [key in E]: ((errorPayload?: unknown) => void)
  | boolean
  | { fn: ((errorPayload?: unknown) => void), toast?: boolean }
}>;

type FnHandler = ReturnType<typeof handler>;

const handleError = <E extends string>(
  toastFn: ToastFn,
  errorCode: E,
  errorPayload?: unknown,
  resolveError?: ResolveError<E>,
  errorMessages?: { [code in E]: string },
) => {
  const resolve = resolveError ? resolveError[errorCode] : undefined;
  const errorMessage = errorMessages ? errorMessages[errorCode] : errorCode;
  if (resolve !== undefined) {
    if (typeof resolve === 'function') {
      resolve(errorPayload);
    } else if (typeof resolve === 'boolean') {
      if (resolve) toastFn(errorMessage, 'error');
    } else {
      const { fn, toast } = resolve;
      fn(errorPayload);
      if (toast) toastFn(errorMessage, 'error');
    }
  } else {
    toastFn(errorMessage, 'error');
  }
};

export type HardHandlerPromise<
  E extends string,
  T = void,
> = () => Promise<void | { payload: T } | { errorCode: E, errorPayload?: unknown }>;

type HardHandlerActions<E extends string> = {
  errorMessages?: { [code in E]: string },
  resolveError?: ResolveError<E>,
};

export const hardHandler = (
  setLoading: (loading: boolean) => void,
  toast: ToastFn,
) => <T, E extends string>(
  asyncFn: HardHandlerPromise<E, T>,
  actions?: HandlerActions & SetPayloadAction<T> & HardHandlerActions<E>,
) => {
  const {
    errorMessages,
    hideLoading,
    onSuccess,
    onError,
    onSuccessMessage,
    onSuccessSeverity = 'success',
    resolveError,
    setSubmitting,
    keepSubmittingOnSuccess,
  } = actions || {};
  if (setSubmitting) setSubmitting(true);
  if (!hideLoading) setLoading(true);
  asyncFn().then((result) => {
    if (result instanceof Object) {
      if ('errorCode' in result) {
        if (onError) onError();
        const { errorCode, errorPayload } = result;
        handleError(toast, errorCode, errorPayload, resolveError, errorMessages);
        if (setSubmitting) setSubmitting(false);
      } else {
        if (actions && 'setPayload' in actions && actions.setPayload) {
          const { setPayload } = actions;
          const { payload } = result;
          if (payload) setPayload(payload);
        }
        if (onSuccess) onSuccess();
        if (onSuccessMessage) toast(onSuccessMessage, onSuccessSeverity);
        if (setSubmitting && !keepSubmittingOnSuccess) setSubmitting(false);
      }
    } else {
      if (onSuccess) onSuccess();
      if (onSuccessMessage) toast(onSuccessMessage, onSuccessSeverity);
      if (setSubmitting && !keepSubmittingOnSuccess) setSubmitting(false);
    }
  }).catch((error: unknown) => {
    if (onError) onError();
    const errorMessage = getErrorMessage(error);
    toast(errorMessage, 'error');
    if (setSubmitting) setSubmitting(false);
  }).finally(() => {
    if (!hideLoading) setLoading(false);
  });
};

type FnHardHandler = ReturnType<typeof hardHandler>;

export const dummy = (error?: string) => new Promise<void | { errorCode: string }>((resolve) => {
  setTimeout(() => { if (error) { resolve({ errorCode: error }); } else { resolve(); } }, 3000);
});

export type FeedbackContextType = ({
  fnHandler: FnHandler,
  fnHardHandler: FnHardHandler,
} & WithToastProps & WithLoadingProps) | undefined;

export const FeedbackContext = createContext<FeedbackContextType>(undefined);

const useFeedback = () => {
  const feedback = useContext(FeedbackContext);
  if (feedback === undefined) throw new Error('FeedbackContext is not implemented');
  return feedback;
};

export default useFeedback;
