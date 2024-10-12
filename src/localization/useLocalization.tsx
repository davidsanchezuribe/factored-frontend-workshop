import { useContext } from 'react';
import { LocalizationContext } from './withLocalization';
import { LocalizationHook } from './LocalizationTypes';

const useLocalization: LocalizationHook = () => {
  const messages = useContext(LocalizationContext);
  const getAvailableLanguages = () => messages.getAvailableLanguages();
  const getLanguage = () => messages.getLanguage();
  const getMessages = () => messages;
  const setLanguage = (language: string) => {
    if (language !== getLanguage()) messages.setLanguage(language);
  };
  const formatString = (message: string, ...args: string[]) => message.replace(/{(\d+)}/g, (match, index) => args[index] || '');
  return {
    getAvailableLanguages,
    getLanguage,
    getMessages,
    setLanguage,
    formatString,
  };
};

export default useLocalization;
