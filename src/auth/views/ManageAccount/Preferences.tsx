import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Avatar, IconButton, ImageList, ImageListItem, Paper, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InputTextFMUI from '../../../materialui/InputFieldFMUI';
import useLocalization from '../../../localization/useLocalization';
import FormButtons from '../../../materialui/FormButtons';
import { localNameProfanityFilter } from '../../ProfanityFilterManager';
import Center from '../../../materialui/Center';
import { getBreakpoint } from '../../../materialui/getBreakpoint';
import withFileUploader, { WithFileUploaderProps } from '../../../wrappers/withFileUploader';
import AvatarEditor from './AvatarEditor';
import { UpdateUser } from '../../AuthManagerTypes';
import useFeedback from '../../../materialui/useFeedback';

export type UserPreferences = {
  displayNameNullable: boolean,
  localDisplayNameProfanityFilter: boolean,
  apiDisplayNameProfanityFilter: boolean,
  userAvatar: boolean,
  userPic: boolean,
  userPicProfanityFilter: boolean,
};

type PreferencesProps = {
  actualDisplayName: string | null,
  actualPhotoURL: string | null,
  userPreferences?: UserPreferences,
  userRefresh: (refreshTime?: number) => () => void,
  updateUser: UpdateUser,
};

type FormValues = {
  displayName: string,
  photoURL: string | null,
};

const Preferences = ({
  actualDisplayName,
  actualPhotoURL,
  userPreferences,
  userRefresh,
  updateUser,
  file,
  openFileUploader,
  clearFile,
}: PreferencesProps & WithFileUploaderProps) => {
  const { getMessages } = useLocalization();
  const { preferences: messages } = getMessages();
  const breakpoint = getBreakpoint();

  const [showUploadIcon, setShowUploadIcon] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const initialValues: FormValues = {
    displayName: actualDisplayName || '',
    photoURL: actualPhotoURL,
  };
  const {
    displayNameNullable,
    localDisplayNameProfanityFilter,
    apiDisplayNameProfanityFilter,
    userAvatar,
    userPic,
    userPicProfanityFilter,
  } = userPreferences || {};
  const avatars = userAvatar ? require.context('./avatarImages', true, /\.(svg)$/).keys().map((image) => image.replace('./', 'images/')) : undefined;
  const buildDisplayNameValidation = () => {
    const base = displayNameNullable
      ? Yup.string().max(32, messages.displayName.max)
      : Yup.string().max(32, messages.displayName.max).required(messages.displayName.required);
    return localDisplayNameProfanityFilter ? base.test('displayName', messages.displayName.profane, (value) => !localNameProfanityFilter(value)) : base;
  };
  const displayNameValidation = buildDisplayNameValidation();
  const { fnHardHandler } = useFeedback();
  return (
    <Formik
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={Yup.object({
        displayName: displayNameValidation,
      })}
      onReset={() => { setBlob(null); }}
      onSubmit={({ displayName, photoURL }, { setSubmitting }) => {
        fnHardHandler(
          updateUser(
            displayName,
            blob || photoURL,
            apiDisplayNameProfanityFilter,
            userPicProfanityFilter,
          ),
          {
            onSuccess: blob ? userRefresh(1000) : userRefresh(0),
            errorMessages: messages.errors,
            setSubmitting,
            onSuccessMessage: messages.preferencesUpdated,
          },
        );
      }}
    >
      {({
        values: { photoURL }, setFieldValue, dirty,
      }) => (
        <Form noValidate>
          <InputTextFMUI
            name="displayName"
            label={messages.displayName.label}
            required={!displayNameNullable}
            inputProps={{ maxLength: 32 }}
          />
          <Center>
            <IconButton
              color="primary"
              size="small"
              onClick={openFileUploader}
              onMouseOver={() => { setShowUploadIcon(true); }}
              onMouseOut={() => { setShowUploadIcon(false); }}
              sx={{ height: 120, width: 120 }}
              disabled={!userPic}
            >
              <Avatar
                alt={actualDisplayName || messages.avatar.profilePicture}
                src={(blob && URL.createObjectURL(blob))
                      || photoURL || actualDisplayName || undefined}
                sx={{
                  fontSize: 45,
                  height: '100%',
                  width: '100%',
                  opacity: showUploadIcon ? 0.4 : undefined,
                }}
              />
              {userPic && showUploadIcon && (
              <AddIcon
                sx={{
                  height: '80%',
                  width: '80%',
                  position: 'absolute',
                }}
              />
              ) }
            </IconButton>
          </Center>
          <Center>
            <Typography variant="body1" alignContent="center" mr={1}>{messages.avatar.profilePicture}</Typography>
            {userPic && <IconButton color="primary" aria-label={messages.avatar.uploadPicture} onClick={openFileUploader}><AddIcon /></IconButton>}
            {photoURL && <IconButton color="primary" aria-label={messages.avatar.clearPicture} onClick={() => { setBlob(null); setFieldValue('photoURL', null); }}><DeleteIcon /></IconButton>}
          </Center>
          {file && (
            <AvatarEditor
              file={file}
              clearFile={clearFile}
              setBlob={setBlob}
              size={250}
              collapse={breakpoint === 'xs'}
            />
          )}
          { !file && avatars && avatars.length > 0 && (
            <Paper elevation={3} sx={{ borderRadius: 2 }}>
              <ImageList
                cols={breakpoint === 'xs' || breakpoint === 'sm' ? 3 : 4}
                rowHeight="auto"
                gap={8}
                sx={{ width: 'auto', height: 280, mx: 1 }}
              >
                {avatars.map((avatar) => {
                  if (avatar === photoURL) return undefined;
                  return (
                    <ImageListItem key={avatar}>
                      <IconButton size="small" onClick={() => { setBlob(null); setFieldValue('photoURL', avatar); }}>
                        <Avatar
                          alt={avatar}
                          src={avatar}
                          sx={{ height: 100, width: 'auto' }}
                        />
                      </IconButton>
                    </ImageListItem>
                  );
                })}
              </ImageList>
            </Paper>
          )}
          <FormButtons
            resetLabel={messages.reset}
            continueLabel={messages.updatePreferences}
            disable={!dirty && !blob}
            continueTooltip={!dirty && !blob ? messages.sameValuesTooltip : undefined}
            mt={2}
          />
        </Form>
      )}
    </Formik>
  );
};

Preferences.defaultProps = {
  userPreferences: undefined,
};

export default withFileUploader(Preferences, 'image');
