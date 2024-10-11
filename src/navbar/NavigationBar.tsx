import React from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import NavBarStructure from './NavBarStructure';
import Home from './Home';
import { HamburgerPages, NormalPages } from './Pages';
import SearchBar from './SearchBar';
import IconPages from './IconPages';
import LocalizationMenu from './LocalizationMenu';
import LoggedMenu from './LoggedMenu';
import NotLoggedMenu from './NotLoggedMenu';
import ScrollToTopButton from './ScrollToTopButton';

const NavigationBar = ({
  homeInfo,
  pages,
  searchField,
  loggedSession,
  notLoggedSession,
  iconPages,
  localization,
}: NavBarStructure) => {
  const { hasLogo, logoImageOrAppName, homePath } = homeInfo;
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Home
            hasLogo={hasLogo}
            logoImageOrAppName={logoImageOrAppName}
            homePath={homePath}
            xs={false}
          />
          <HamburgerPages pages={pages || []} />
          <Home
            hasLogo={hasLogo}
            logoImageOrAppName={logoImageOrAppName}
            homePath={homePath}
            xs
          />
          <NormalPages pages={pages || []} />
          {searchField && (
            <SearchBar
              placeholder={searchField.placeholder}
              action={searchField.action}
              hideOnXS={searchField.hideOnXS}
            />
          )}
          {localization && (
            <LocalizationMenu
              languages={localization.languages}
              setLanguage={localization.setLanguage}
              language={localization.language}
              hideOnXS={localization.hideOnXS}
            />
          )}
          <IconPages icons={iconPages || []} />
          {loggedSession && (
            <LoggedMenu
              accountTooltipName={loggedSession.accountTooltipName}
              userName={loggedSession.userName}
              userImage={loggedSession.userImage}
              userPages={loggedSession.userPages}
              logout={loggedSession.logout}
              greetingMessage={loggedSession.greetingMessage}
              showLogoutButton={loggedSession.showLogoutButton}
            />
          )}
          {notLoggedSession && !loggedSession && (
            <NotLoggedMenu
              accountTooltipName={notLoggedSession.accountTooltipName}
              signIn={notLoggedSession.signIn}
              signUp={notLoggedSession.signUp}
            />
          )}
        </Toolbar>
      </Container>
      <ScrollToTopButton />
    </AppBar>
  );
};

export default NavigationBar;
