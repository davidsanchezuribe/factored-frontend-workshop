const authDomain = process.env.CUSTOM_AUTH_DOMAIN === ''
  ? process.env.AUTH_DOMAIN : process.env.CUSTOM_AUTH_DOMAIN;

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

export default firebaseConfig;
