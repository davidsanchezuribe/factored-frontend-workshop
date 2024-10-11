import React, { useEffect, useState, createRef } from 'react';
import {
  Card, IconButton, Slider, Stack,
  Tooltip,
} from '@mui/material';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import ReplayIcon from '@mui/icons-material/Replay';
import SaveIcon from '@mui/icons-material/Save';
import ImageEditor from 'react-avatar-editor';
import Center from '../../../materialui/Center';
import useLocalization from '../../../localization/useLocalization';

type AvatarEditorProps = {
  file: File
  clearFile: () => void,
  setBlob: (blob: Blob) => void,
  size?: number,
  collapse?: boolean,
};

const AvatarEditor = ({
  file,
  clearFile,
  setBlob,
  size = 250,
  collapse,
}: AvatarEditorProps) => {
  const { getMessages } = useLocalization();
  const { preferences: { avatar: { notTouched } } } = getMessages();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const touched = scale !== 1 || rotate !== 0;
  const reset = () => { setScale(1); setRotate(0); };
  const editor = createRef<ImageEditor>();
  const fileURL = URL.createObjectURL(file);
  const sliderColor = 'primary';
  const saveImage = () => {
    if (editor.current) {
      const canvas = editor.current.getImageScaledToCanvas().toDataURL('image/jpeg');
      fetch(canvas)
        .then((res) => res.blob())
        .then((blob) => { setBlob(blob); clearFile(); })
        .catch(() => {});
    }
  };
  useEffect(() => { reset(); }, [file]);
  return (
    <Center>
      <Card>
        <Stack direction={collapse ? 'column' : 'row'} alignItems="center" spacing={1}>
          <ImageEditor
            ref={editor}
            image={fileURL}
            width={size}
            height={size}
            scale={scale}
            rotate={rotate}
            color={[255, 255, 255, 0.6]} // RGBA
            borderRadius={size / 2}
          />
          <Stack direction={collapse ? 'column-reverse' : 'row'} spacing={1}>
            <Stack direction={collapse ? 'row-reverse' : 'column'} alignItems="center">
              <Rotate90DegreesCwIcon color={sliderColor} />
              <Slider
                color={sliderColor}
                value={rotate}
                min={-180}
                max={180}
                orientation={collapse ? 'horizontal' : 'vertical'}
                onChange={(_, newValue) => { if (typeof newValue === 'number') setRotate(newValue); }}
                sx={collapse ? { width: size * 0.8, mx: 1 } : { height: size * 0.8, my: 1 }}
              />
              <Rotate90DegreesCcwIcon color={sliderColor} />
            </Stack>
            <Stack direction={collapse ? 'row-reverse' : 'column'} alignItems="center">
              <AddCircleOutlineIcon color={sliderColor} />
              <Slider
                color={sliderColor}
                value={scale * 50}
                min={15}
                max={85}
                orientation={collapse ? 'horizontal' : 'vertical'}
                onChange={(_, newValue) => { if (typeof newValue === 'number') setScale(newValue / 50); }}
                sx={collapse ? { width: size * 0.8, mx: 1 } : { height: size * 0.8, my: 1 }}
              />
              <RemoveCircleOutlineIcon color={sliderColor} />
            </Stack>
          </Stack>
          <Stack direction={collapse ? 'row' : 'column-reverse'}>
            <IconButton onClick={clearFile}><ClearIcon /></IconButton>
            <Tooltip title={touched ? undefined : notTouched} placement={collapse ? 'bottom' : 'right'}>
              <span>
                <IconButton onClick={reset} disabled={!touched}>
                  <ReplayIcon />
                </IconButton>
              </span>
            </Tooltip>
            <IconButton onClick={saveImage}><SaveIcon /></IconButton>
          </Stack>
        </Stack>
      </Card>
    </Center>
  );
};

export default AvatarEditor;
