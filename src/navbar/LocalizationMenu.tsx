import React from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import { Language } from './NavBarStructure';
import languageList from './languages';
import CustomMenu from '../materialui/CustomMenu';
import { filterUndefined } from '../utilities';

const flagSVGAddress = (flagImageOrIso3166: string) => {
  const defaultFlagRepo = 'https://purecatamphetamine.github.io/country-flag-icons/3x2/';
  return flagImageOrIso3166.length === 2
    ? `${defaultFlagRepo}${flagImageOrIso3166}.svg`
    : flagImageOrIso3166;
};

type LocalizationMenuProps = {
  languages: Array<Language>,
  setLanguage: (language: string) => void,
  language: string,
  hideOnXS?: boolean,
};

const LocalizationMenu = ({
  languages: rawLanguages,
  setLanguage,
  language:
  selectedId,
  hideOnXS,
}: LocalizationMenuProps) => {
  const languages = rawLanguages.map((rawLanguage) => (typeof rawLanguage === 'string' ? languageList[rawLanguage] : rawLanguage));
  const selectedLanguage = languages.find((language) => language.id === selectedId);
  const MenuIcon = selectedLanguage
    ? { name: selectedLanguage.name, src: flagSVGAddress(selectedLanguage.flagImageOrIso3166) }
    : LanguageIcon;
  const links = filterUndefined(languages.map(({ id, name, flagImageOrIso3166 }) => {
    if (id === selectedId) return undefined;
    return {
      MenuIcon: { name, src: flagSVGAddress(flagImageOrIso3166) },
      name,
      pathOrAction: () => { setLanguage(id); },
    };
  }));
  return (
    <CustomMenu
      hideBreakpoints={hideOnXS ? ['xs', 'sm'] : undefined}
      MenuIcon={MenuIcon}
      links={links}
    />
  );
};

LocalizationMenu.defaultProps = {
  hideOnXS: undefined,
};

export default LocalizationMenu;
