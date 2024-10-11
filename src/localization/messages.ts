import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { AppMessages } from './LocalizationTypes';
import english from './english';
import spanish from './spanish';

const messages: AppMessages & LocalizedStringsMethods = new LocalizedStrings({
  en: english,
  es: spanish,
});

export default messages;
