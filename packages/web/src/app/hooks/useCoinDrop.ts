import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const useCoinDrop = () => {
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [dropError, setDropError] = useState<string | null>(null);

  const reset = () => {
    setTokenId(null);
    setDropError(null);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const coinB64 = (reader.result as string).replace(/^data:.+;base64,/, '');

      const { tokenId, error } = await fetch('/api/land-granter/check-coin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coinB64 })
      }).then((r) => r.json());

      if (error) {
        console.error('API error while checking coin:', error);
        setDropError(error);
        return;
      }

      if (tokenId) {
        setTokenId(tokenId);
        return;
      }

      throw new Error('Unexpected response from API');
    };

    reader.readAsDataURL(file);
  };

  const dropzone = useDropzone({
    onDrop,
    accept: 'image/png',
    multiple: false,
    noClick: true,
    preventDropOnDocument: false
  });

  return {
    ...dropzone,
    tokenId: tokenId,
    dropError,
    reset
  };
};
