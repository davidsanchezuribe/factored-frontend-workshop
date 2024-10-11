import React, { useState } from 'react';

export type WithMultipleFileUploaderProps = {
  files: (File | null)[],
  openFileUploader: (fileUploaderNum: number) => () => void,
  clearFile: (fileNum: number) => () => void,
};

const withMultipleFileUploader = <P extends WithMultipleFileUploaderProps>(
  Component: React.ComponentType<P>,
  fileType: 'image' = 'image',
  fileNumber: number = 1,
) => (props: Omit<P, keyof WithMultipleFileUploaderProps>) => {
    const inputRefs: React.RefObject<HTMLInputElement>[] = [];
    for (let i = 0; i < fileNumber; i += 1) {
      inputRefs.push(React.createRef<HTMLInputElement>());
    }
    const [files, setFiles] = useState<(File | null)[]>([]);
    const openFileUploader = (
      fileUploaderNum: number,
    ) => () => { inputRefs[fileUploaderNum].current?.click(); };
    const clearFile = (fileNum: number) => () => {
      setFiles(Object.assign([], files, { [fileNum]: null }));
    };
    const handleFileChange = (
      fileNum: number,
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        setFiles(Object.assign([], files, { [fileNum]: file }));
      }
    };
    return (
      <>
        {Array.from(Array(fileNumber).keys()).map((index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="file"
            accept={fileType === 'image' ? 'image/*' : undefined}
            onChange={handleFileChange(index)}
            hidden
          />
        ))}
        <Component
            // eslint-disable-next-line react/jsx-props-no-spreading
          {...props as P}
          files={files}
          openFileUploader={openFileUploader}
          clearFile={clearFile}
        />
      </>
    );
  };

export default withMultipleFileUploader;
