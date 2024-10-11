import React from 'react';
import useLocalization from '../localization/useLocalization';

const HomePage = () => {
  const messages = useLocalization().getMessages();
  return (
    <h1>{messages.homepage.helloWorld}</h1>
  );
};

export default HomePage;
