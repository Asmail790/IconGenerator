import { afterEach, beforeEach, test, expect, describe } from "@jest/globals";
import { up } from "./migration";
import { createSQLiteDB } from "./sqlite.db";

async function createInMemoryDB() {
  const dbInterface = createSQLiteDB(":memory:");
  await up(dbInterface.adapter());

  return dbInterface;
}

function getFakeData() {
  return {
    Users: [
      {
        email: "email",
        userId: "user1",
        images: [
          {
            data: Buffer.from("image", "binary"),
            color: "color",
            style: "style",
            description: "description",
            id: "user1-image1",
          },
          {
            data: Buffer.from("image", "binary"),
            color: "color2",
            style: "style2",
            description: "description2",
            id: "user1-image2",
          },
        ],
        tokens: 0,
      },
      {
        email: "email2",
        userId: "user2",
        tokens: 1,
        images: [],
      },
    ] as const,
  };
}

async function insertFakeData() {
  const user1 = getFakeData().Users[0];
  const user2 = getFakeData().Users[1];

  const adapter = await getDB().adapter();
  await adapter
    .insertInto("User")
    .values({ email: user1.email, id: user1.userId })
    .execute();

  await adapter
    .insertInto("User")
    .values({ email: user2.email, id: user2.userId })
    .execute();

  await adapter
    .insertInto("Icon")
    .values([
      {
        ...user1.images[0],
        userId: user1.userId,
      },
      {
        ...user1.images[1],
        userId: user1.userId,
      },
    ])
    .execute();

  await adapter
    .insertInto("ImageToken")
    .values({ userId: user2.userId, tokens: user2.tokens })
    .execute();
}

let _db: Awaited<ReturnType<typeof createInMemoryDB>> | undefined = undefined;

function getDB() {
  if (_db == undefined) {
    throw Error("_db undefined");
  }

  return _db;
}

describe("sqlit-tests", () => {
  beforeEach(async () => {
    _db = await createInMemoryDB();
    await insertFakeData();
  });

  afterEach(async () => {
    await getDB().originalDB().close();
  });

  test("addToTotalCost", async () => {
    const newCost = 10;

    await getDB().addToTotalCost(newCost);
    const item = await getDB()
      .adapter()
      .selectFrom("OtherProperties")
      .select("value")
      .executeTakeFirst();

    expect(item).toBeDefined();
    expect(Number(item?.value)).toBe(newCost);

    await getDB().addToTotalCost(newCost);
    const newItem = await getDB()
      .adapter()
      .selectFrom("OtherProperties")
      .select("value")
      .executeTakeFirst();
    expect(Number(newItem?.value)).toBe(newCost * 2);
  });

  test("getUserId", async () => {
    const item = await getDB().getUserId("email");
    expect(item).toBeDefined();
  });

  test("getUserId", async () => {
    const item = await getDB().getUserId("email");
    expect(item).toBeDefined();
  });

  test("saveImage", async () => {
    const color = "red";
    const style = "metalic";
    const description = "what ";
    const userId = getFakeData().Users[0].userId;

    const data = Buffer.from("xas2", "binary");

    await getDB().saveImage({
      color,
      style,
      userId,
      data,
      description,
    });

    const { data: arraybuffer } = await getDB()
      .adapter()
      .selectFrom("Icon")
      .select(["data", "id"])
      .where("userId", "=", userId)
      .executeTakeFirstOrThrow();

    const newBuffer = Buffer.from(arraybuffer);
    expect(data.buffer).toEqual(newBuffer.buffer);
  });

  test("getImage", async () => {
    const userId = getFakeData().Users[0].userId;
    const imageId = getFakeData().Users[0].images[0].id;
    const image = getFakeData().Users[0].images[0].data;

    const result = await getDB().getImageData({ imageId, userId });

    expect(image.buffer).toEqual(result.buffer);
  });

  test("removeImage", async () => {
    const imageIds = getFakeData().Users[0].images.map((img) => img.id);
    const userId = getFakeData().Users[0].userId;
    const dbInterface = getDB();

    await Promise.all(
      imageIds.map(
        async (imageId) => await dbInterface.removeImage({ imageId, userId })
      )
    );

    const size = await getDB()
      .adapter()
      .selectFrom("Icon")
      .select((eb) => eb.fn.countAll<number>().as("totalImages"))
      .executeTakeFirstOrThrow()
      .then((q) => q.totalImages);
    expect(size).toBe(0);
  });

  test("getImageProperties", async () => {
    const userId = getFakeData().Users[0].userId;

    const imageIds = getFakeData().Users[0].images.map((img) => img.id);

    const getImageProperties = getFakeData().Users[0].images.map(
      ({ color, description, id, style }) => ({ color, description, id, style })
    );

    const getImageProperties2 = await getDB().getImageProperties({
      userId,
      imageIds,
    });

    expect(getImageProperties2).toEqual(getImageProperties);
  });
  test("totalNumberOfImages", async () => {
    const userId = getFakeData().Users[0].userId;
    const total = await getDB().totalNumberOfImages({ userId });
    expect(total).toBe(2);
  }),
    test("getTotalCost", async () => {
      let totalCost = await getDB().getTotalCost();
      expect(totalCost).toBe(0);

      await getDB()
        .adapter()
        .insertInto("OtherProperties")
        .values({ property: "totalCost", value: String(100) })
        .execute();

      totalCost = await getDB().getTotalCost();
      expect(totalCost).toBe(100);
    });

  test("setTokens", async () => {
    const userId = getFakeData().Users[0].userId;
    await getDB().setTokens({ userId, numberOfTokens: 100 });

    let tokens = await getDB()
      .adapter()
      .selectFrom("ImageToken")
      .select("tokens")
      .where("userId", "=", userId)
      .executeTakeFirstOrThrow()
      .then((q) => q.tokens);

    expect(tokens).toBe(100);

    await getDB().setTokens({ userId, numberOfTokens: 300 });
  });

  test("decreaseToken", async () => {
    const user = getFakeData().Users[1];
    await getDB().decreaseToken({
      userId: user.userId,
      tokensSpend: user.tokens,
    });

    const tokens = await getDB()
      .adapter()
      .selectFrom("ImageToken")
      .select("ImageToken.tokens")
      .where("ImageToken.userId", "=", user.userId)
      .executeTakeFirstOrThrow()
      .then((r) => r.tokens);

    expect(tokens).toBe(0);
  }),
    test("getNumberOfTokens", async () => {
      const user = getFakeData().Users[1];
      const tokens = await getDB().getNumberOfTokens(user.userId);
      expect(tokens).toBe(user.tokens);
    });
});
