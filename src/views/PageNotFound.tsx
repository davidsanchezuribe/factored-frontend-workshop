import React from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import useLocalization from '../localization/useLocalization';
import Dialog from '../materialui/Dialog';
import useTrace from '../useTrace';

const PageNotFound = () => {
  const { pageNotFound: messages } = useLocalization().getMessages();
  const { navigate } = useTrace();
  return (
    <Dialog
      title={messages.title}
      Icon={RemoveCircleIcon}
      iconColor="warning"
      description={messages.description}
      primaryAction={{ action: () => { navigate('/'); }, name: messages.primaryActionLabel }}
    />
  );
};

export default PageNotFound;
