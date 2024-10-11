import React, { useState } from 'react';

export type WithFileUploaderProps = {
  file: File | null,
  openFileUploader: () => void,
  clearFile: () => void,
};

const withFileUploader = <P extends WithFileUploaderProps>(
  Component: React.ComponentType<P>,
  fileType?: 'image',
) => (props: Omit<P, keyof WithFileUploaderProps>) => {
    const inputRef = React.createRef<HTMLInputElement>();
    const openFileUploader = () => inputRef.current?.click();
    const [file, setFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    };
    const clearFile = () => { setFile(null); };
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept={fileType === 'image' ? 'image/*' : undefined}
          hidden
          onChange={handleFileChange}
        />
        <Component
            // eslint-disable-next-line react/jsx-props-no-spreading
          {...props as P}
          file={file}
          openFileUploader={openFileUploader}
          clearFile={clearFile}
        />
      </>
    );
  };

export default withFileUploader;
