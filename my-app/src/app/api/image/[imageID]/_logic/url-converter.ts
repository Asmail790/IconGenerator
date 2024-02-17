// TODO find better solution

export const imageIdToURL = (id: string) => `/api/image/${id}`;
export const URLtoImageID = (url: string) => {
  const id = url.split("/")[3];
  if (id === undefined) {
    throw Error("Image id undefined");
  }
  return id;
};
