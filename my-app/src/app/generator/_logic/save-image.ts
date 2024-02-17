import { DBInterface } from "@/db/removeImage";
import { db } from "@/global.config/db";
type TSuccessfulImageDownload = {
  successful: true;
  buffer: Buffer;
};

type TUnsuccessfulImageDownload = {
  successful: false;
  message: string;
};

type ImageDownloadStatus =
  | TSuccessfulImageDownload
  | TUnsuccessfulImageDownload;

type SaveImageSuccessful = {
  successful: true;
};

type SaveImageUnsuccessful = {
  successful: false;
  message: string;
};

export type SaveImageStatus = SaveImageSuccessful | SaveImageUnsuccessful;
export type TImageFetcher = (url: string) => Promise<ImageDownloadStatus>;

type DBUtils = Pick<DBInterface, "getImageData"|"saveImage"> 
async function saveImage(args: {
  userId: string;
  description: string;
  color: string;
  style: string;
  db: DBUtils;
  url: string;
  getImageData: TImageFetcher;
}): Promise<SaveImageStatus> {
  const { userId, description, color, style, db, url, getImageData } = args;

  const response = await getImageData(url);
  if (!response.successful) {
    return {
      successful: false,
      message: response.message,
    };
  }

  const data = response.buffer;
  await db.saveImage({ color, style, description, data, userId });

  return { successful: true };
}

const imageFetcher: TImageFetcher = async (url) => {

  const response = await fetch(url);
  if (!response.ok) {
    return {
      successful: false,
      message: "Image could not be fetched to the server.",
    };
  }

  const buffer = await response
    .blob()
    .then((b) => b.arrayBuffer())
    .then((b) => Buffer.from(b));
  return {
    successful: true,
    buffer,
  };
};

export function createImageSaver(config: {
  db: DBUtils;
  getImageData: TImageFetcher;
}) {
  return (args: {
    userId: string;
    description: string;
    color: string;
    style: string;
    url: string;
  }) => saveImage({ ...args, ...config });
}

export const defaultImageSaver = createImageSaver({ db, getImageData: imageFetcher });

 
