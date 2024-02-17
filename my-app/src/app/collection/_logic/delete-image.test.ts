import { test, expect, describe } from "@jest/globals";
import { createImageRemover } from "./delete-image";
import { removeImage } from "@/db/db-interface";

describe("ImageRemover", () => {
  test("base test", () => {
    const images = ["image1", "image2"] as const;
    const imagetoBeDeleted = "image1";
    const imagesBeforeDeletion = new Set(images);
    const imagesAfterDeletion = new Set(images);
    imagesAfterDeletion.delete(imagetoBeDeleted);

    const DbImageremover = createFakeDBImageRemover(imagesBeforeDeletion);

    const removeImage = createImageRemover({
      db: {
        removeImage: DbImageremover,
      },
      imageIdGetter: (url: string) => url,
    });

    removeImage("image1", "");
    expect(imagesBeforeDeletion).toEqual(imagesAfterDeletion);
  });
});

function createFakeDBImageRemover(images: Set<string>): removeImage {
  return async (image, _) => {
    images.delete(image);
  };
}
