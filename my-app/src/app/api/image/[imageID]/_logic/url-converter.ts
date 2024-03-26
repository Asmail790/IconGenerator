// TODO find better solution

export const imageIdToURL = (id: string) => `/api/image/${id}`;


export const URLtoImageID = (url: string) => {

  if (! url.includes("/api/image/")){
    throw Error("url do not include /api/image/")
  }
  const id = url.split("/")[3];
  if (id === undefined) {
    throw Error("Image id undefined");
  }
  return id;
};
