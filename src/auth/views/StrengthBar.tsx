import React from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import useLocalization from '../../localization/useLocalization';

type StrengthBarProps = {
  password?: string,
};

const StrengthBar = ({ password }: StrengthBarProps) => {
  const { getMessages } = useLocalization();
  const { strengthBar: messages } = getMessages();
  return (
    <PasswordStrengthBar
      password={password}
      scoreWords={[
        messages.level1,
        messages.level1,
        messages.level2,
        messages.level3,
        messages.level4,
      ]}
      shortScoreWord={messages.tooShort}
    />
  );
};

StrengthBar.defaultProps = {
  password: undefined,
};

export default StrengthBar;
