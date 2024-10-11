import React from 'react';
import { WithAuthProps } from './WithAuthProps';

const PrivateExample = ({ authUser }: WithAuthProps) => {
  const { idToken } = authUser;
  return (
    <p>{idToken}</p>
  );
};

export default PrivateExample;
