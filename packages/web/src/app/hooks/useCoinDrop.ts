import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const useCoinDrop = (
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [coinCreator, setCoinCreator] = useState<string | null>(null);
  const [dropError, setDropError] = useState<string | null>(null);

  const reset = () => {
    setTokenId(null);
    setDropError(null);
    setCoinCreator(null);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const coinB64 = (reader.result as string).replace(/^data:.+;base64,/, '');

      setProcessing(true);
      const { tokenId, coinCreator, error } = await fetch(
        '/api/land-granter/check-coin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ coinB64 })
        }
      ).then((r) => r.json());
      setProcessing(false);

      if (error) {
        console.error('API error while checking coin:', error);
        setDropError(error);
        return;
      }

      if (tokenId != null && coinCreator != null) {
        setTokenId(tokenId);
        setCoinCreator(coinCreator);
        return;
      }

      throw new Error('Unexpected response from API');
    };

    reader.readAsDataURL(file);
  };

  const dropzone = useDropzone({
    onDrop,
    accept: 'image/png,image/jpeg',
    multiple: false,
    // noClick: true,
    preventDropOnDocument: false
  });

  return {
    ...dropzone,
    tokenId: tokenId,
    coinCreator: coinCreator,
    dropError,
    reset
  };
};
