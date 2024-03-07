import {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from "vitest";
import { DBInterface } from "./interface";
import { Kysely } from "kysely";
import { Schema } from "./schema";

import { createSQLiteDB } from "./sqlite/sqlite.db";
import { createMySQLDB } from "./mysql/mysql.db";
import { createPostgresDB } from "./postgres/postgres.db";

import { down as sqliteDown, up as sqliteUp } from "./sqlite/sqlite.migration";
import { down as mySQLDown, up as mySQLUp } from "./mysql/mysql.migration";
import {
  down as postgresDown,
  up as postgresUp,
} from "./postgres/postgres.migration";

import { MySqlContainer, StartedMySqlContainer } from "@testcontainers/mysql";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

function getFakeData() {
  return {
    Users: [
      {
        email: "email",
        userId: "a78072dd-ebdc-4859-a303-7f003529ee3c",
        images: [
          {
            data: Buffer.from("image", "binary"),
            color: "color",
            style: "style",
            description: "description",
            id: "a05bcd02-68b7-4028-ab93-3134c42476bb",
          },
          {
            data: Buffer.from("image", "binary"),
            color: "color2",
            style: "style2",
            description: "description2",
            id: "77278be4-814d-4063-ab16-34490fb22899",
          },
        ] as const,
        tokens: 0,
      },
      {
        email: "email2",
        userId: "0e55f7d8-028b-4063-9894-6feff0e1adc3",
        tokens: 1,
        images: [],
      },
    ] as const,
  };
}

async function insertFakeData(db: DBInterface) {
  const user1 = getFakeData().Users[0];
  const user2 = getFakeData().Users[1];

  const adapter = db.adapter();
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

type TSetUp = {
  getDB: () => DBInterface;
  beforeEach?: () => Promise<void>;
  beforeAll?: () => Promise<void>;

  afterEach?: () => Promise<void>;
  afterAll?: () => Promise<void>;
};
function sqlite(): TSetUp {
  let _db: Awaited<ReturnType<typeof createSQLiteDB>> | undefined = undefined;

  function getDB() {
    if (_db == undefined) {
      throw Error("_db undefined");
    }

    return _db;
  }

  async function createInMemoryDB() {
    const dbInterface = createSQLiteDB(":memory:");
    await sqliteUp(dbInterface.adapter());

    return dbInterface;
  }

  return {
    getDB: getDB,

    async afterEach() {
      await getDB().originalDB().close();
    },

    async beforeEach() {
      _db = await createInMemoryDB();
    },
  };
}

function mySQL(): TSetUp {
  let _container: StartedMySqlContainer | undefined = undefined;
  let _dbInterface: ReturnType<typeof createMySQLDB> | undefined = undefined;

  async function createContainer() {
    _container = await new MySqlContainer().start();
  }

  function getContainer() {
    if (_container === undefined) {
      throw Error("undefined container");
    }
    return _container;
  }

  async function createDB() {
    const container = await getContainer();
    const poolargs = {
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getUserPassword(),
    };

    _dbInterface = createMySQLDB(poolargs);
  }

  function getDB() {
    if (_dbInterface === undefined) {
      throw Error("undefined DB interface");
    }
    return _dbInterface;
  }

  async function destroyContainer() {
    const dbInterface = getDB();
    const mysql2 = dbInterface.originalDB();

    await new Promise<void>((resolve) => {
      mysql2.getConnection((_, connection) => {
        connection.release();
        resolve();
      });
    });

    await new Promise<void>((resolve) => {
      mysql2.end(() => resolve());
    });

    const container = await getContainer();

    await container.stop();
  }

  async function createTables() {
    const dbInterface = getDB();
    await mySQLUp(dbInterface.adapter());
  }

  async function destroyTables() {
    const dbInterface = getDB();
    await mySQLDown(dbInterface.adapter());
  }

  return {
    getDB: getDB,
    async beforeAll() {
      await createContainer();
      await createDB();
    },
    async beforeEach() {
      await createTables();
    },
    async afterEach() {
      await destroyTables();
    },
    async afterAll() {
      await destroyContainer();
    },
  };
}

function postgres(): TSetUp {
  let _container: StartedPostgreSqlContainer | undefined = undefined;
  let _dbInterface: ReturnType<typeof createPostgresDB> | undefined = undefined;

  async function createContainer() {
    _container = await new PostgreSqlContainer().start();
  }

  function getContainer() {
    if (_container === undefined) {
      throw Error("undefined container");
    }
    return _container;
  }

  async function createDB() {
    const container = await getContainer();
    const args = {
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getPassword(),
    };

    _dbInterface = createPostgresDB(args);
  }

  function getDB() {
    if (_dbInterface === undefined) {
      throw Error("undefined DB interface");
    }
    return _dbInterface;
  }

  async function destroyContainer() {
    const dbInterface = getDB();
    const postgres = dbInterface.originalDB();

    await postgres.end();
    await getContainer().stop();
  }

  async function createTables() {
    const dbInterface = getDB();
    await postgresUp(dbInterface.adapter());
  }

  async function destroyTables() {
    const dbInterface = getDB();
    await postgresDown(dbInterface.adapter());
  }

  return {
    getDB: getDB,
    async beforeAll() {
      await createContainer();
      await createDB();
    },
    async beforeEach() {
      await createTables();
    },
    async afterEach() {
      await destroyTables();
    },
    async afterAll() {
      await destroyContainer();
    },
  };
}

const dbs = [postgres].map((setup) => ({ setup, dbName: setup.name } as const));

describe.each(dbs)("$dbName", ({ setup, dbName }) => {
  const {
    beforeAll: beforeAll_,
    beforeEach: beforeEach_,
    afterEach: afterEach_,
    afterAll: afterAll_,
    getDB,
  } = setup();



  beforeAll(async () => {
    if (beforeAll_ !== undefined) {
      await beforeAll_();
    }
  });

  afterAll(async () => {
    if (afterAll_ !== undefined) {
      await afterAll_();
    }
  });

  afterEach(async () => {
    if (afterEach_ !== undefined) {
      await afterEach_();
    }
  });

  beforeEach(async () => {
    if (beforeEach_ !== undefined) {
      await beforeEach_();
      await insertFakeData(getDB());
    }
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
      .select((eb) => eb.fn.countAll().as("totalImages"))
      .executeTakeFirstOrThrow()
      .then((q) => parseInt(String(q.totalImages)));


    expect(size).toBe(0);
  });

  test("getImageProperties", async () => {
    const userId = getFakeData().Users[0].userId;

    const imageIds = getFakeData().Users[0].images.map((img) => img.id);

    const expectedImageProperties = getFakeData().Users[0].images.map(
      ({ color, description, id, style }) => ({ color, description, id, style })
    );

    const imageProperties = await getDB().getImageProperties({
      userId,
      imageIds,
    });

    for (const img of expectedImageProperties) {
      expect(imageProperties).toContainEqual(img);

    }
  });
  test("totalNumberOfImages", async () => {
    const userId = getFakeData().Users[0].userId;
    const total = await getDB().totalNumberOfImages({ userId });
    expect(total).toBe(2);
  });

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
