import { NFTStorage, File } from "nft.storage";

// TODO: move to env
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQ4MkU1NzdiQzUxOTljNzcyOUZkOTJCMDI1MDBGMzdkRDEwNEQyODgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMTgxNjA4OTMyNSwibmFtZSI6ImV4cXVpc2l0ZS5sYW5kIn0.JvW4HAbfHt5AmQv9gDNeSzt_YE3FqmcH7CoLLHgmDOE";
const client = new NFTStorage({ token: apiKey });

export const useUploadSVG = async (svg: string) => {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const uplaodedSVG = await client.storeBlob(blob);
  console.log(uplaodedSVG);
  // ipfs://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m/metadata.json
  return uplaodedSVG;
};
