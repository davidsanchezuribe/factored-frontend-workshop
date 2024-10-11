import React from 'react';

const PrivateExample = ({ authUser }: WithAuthProps) => {
  const { idToken } = authUser;
  return (
    <p>{idToken}</p>
  );
};

export default PrivateExample;
