import z from 'zod';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavBarStructure from './NavBarStructure';
import logoImage from '../images/logo.png';
import userAvatar from '../images/userAvatar.jpg';
import { customFetch } from '../utilities';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loggedSession = {
  userName: 'David',
  logout: {
    // eslint-disable-next-line no-console
    name: 'Logout',
    pathOrAction: () => { console.log('Logging Out...'); },
  },
  showLogoutButton: true,
  userImage: userAvatar,
  userPages: [
    { name: 'My Wishlist', pathOrAction: { route: '/wishlist' } },
    { name: 'My Profile', pathOrAction: { route: '/userProfile' } },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notLoggedSession = {
  signIn: {
    name: 'Log in',
    pathOrAction: { route: '/login', disableOnMatch: true },
  },
  signUp: {
    name: 'Sign Up',
    pathOrAction: { route: '/signup' },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const syncSearch = (searchString: string) => `?q=${searchString}`;

const asyncSearch = (searchString: string) => {
  const catBreed = searchString;
  return customFetch(
    `https://api.thecatapi.com/v1/images/search?q=${catBreed}`,
    'GET',
    undefined,
    z.array(z.object({ url: z.string() })),
  )
    .then(([{ url }]) => url);
};

const localization = {
  languages: [
    { id: 'en', name: 'English', flagImageOrIso3166: 'US' },
    { id: 'es', name: 'Español', flagImageOrIso3166: 'ES' },
    { id: 'pt', name: 'Português', flagImageOrIso3166: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/BR.svg' },
  ],
  setLanguage: (language: string) => { console.log(language); },
  language: 'en',
  hideOnXS: true,
};

const example: NavBarStructure = {
  homeInfo: {
    hasLogo: true,
    logoImageOrAppName: logoImage,
    homePath: '/home',
  },
  pages: [
    { name: 'About', pathOrAction: { route: '/about', decoreOnMatch: true, disableOnMatch: true } },
    { name: 'Blog', pathOrAction: { route: '/blog' } },
  ],
  searchField: {
    placeholder: 'Cat breed',
    action: asyncSearch,
    hideOnXS: true,
  },
  iconPages: [
    {
      MenuIcon: MailIcon,
      tooltip: 'mail',
      badgeContent: 17,
      isAlert: true,
      pathOrAction: { route: 'mail', disableOnMatch: false },
      hideBreakpoints: ['xs'],
    },
    {
      MenuIcon: NotificationsIcon,
      tooltip: 'notifications',
      badgeContent: 2,
      isAlert: false,
      pathOrAction: { route: 'alerts' },
      hideBreakpoints: ['xs'],
    },
  ],
  localization,
  loggedSession,
  // notLoggedSession,
};

export default example;
