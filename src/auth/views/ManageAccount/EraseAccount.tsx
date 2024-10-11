import React from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import useLocalization from '../../../localization/useLocalization';
import Center from '../../../materialui/Center';
import useFeedback from '../../../materialui/useFeedback';
import { AuthUser, DeleteAccount } from '../../AuthManagerTypes';
import Reauthentication, { useReauthentication } from '../Reauthentication';

type DeleteAccountProps = {
  authUser: AuthUser,
  deleteAccount: DeleteAccount;
};

const EraseAccount = ({
  authUser,
  deleteAccount,
}: DeleteAccountProps) => {
  const { getMessages } = useLocalization();
  const { eraseAccount: messages } = getMessages();
  const { fnHardHandler } = useFeedback();
  const { openModal, setOpenModal, reauthenticate } = useReauthentication();
  const [data, setData] = React.useState(false);
  const [account, setAccount] = React.useState(false);
  return (
    <>
      <Typography mt={2} mx={2} textAlign="center">{messages.warning}</Typography>
      <Divider sx={{ mt: 2, mx: 4 }} />
      <Stack direction="row" mt={3} mx={3} alignItems="center">
        <Checkbox color="error" checked={data} onChange={(e) => { setData(e.target.checked); }} />
        <Typography ml={1}>{messages.deleteData}</Typography>
      </Stack>
      <Stack direction="row" mt={1} mx={3} alignItems="center">
        <Checkbox color="error" checked={account} onChange={(e) => { setAccount(e.target.checked); }} />
        <Typography ml={1}>{messages.deleteAccount}</Typography>
      </Stack>
      <Center mt={2} mb={2}>
        <Tooltip title={!data || !account ? messages.notSelected : undefined}>
          <span>
            <Button
              variant="contained"
              color="error"
              disabled={!data || !account}
              onClick={() => {
                fnHardHandler(
                  deleteAccount(),
                  {
                    errorMessages: messages.errors,
                    resolveError: {
                      'auth/requires-recent-login': reauthenticate(),
                      'auth/user-token-expired': reauthenticate(),
                    },
                    // onSuccessMessage: enrolledPhone
                    //   ? messages.unenrolledPhoneMFA : messages.unenrolledTotpMFA,
                    // onSuccess: userRefresh,
                    // setSubmitting,
                    // keepSubmittingOnSuccess: true,
                  },
                );
              }}
            >
              {messages.delete}
            </Button>
          </span>
        </Tooltip>
      </Center>
      <Reauthentication
        authUser={authUser}
        openModal={openModal}
        setOpenModal={setOpenModal}
        successMessage={messages.deleteReauthenticated}
        emailHint="delete"
      />
    </>
  );
};

export default EraseAccount;
