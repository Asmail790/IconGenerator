import { createMySQLDB } from "@/db/mysql/mysql.db";
import { createSQLiteDB } from "@/db/sqlite/sqlite.db";
import { up as upSqlite } from "@/db/sqlite/sqlite.migration";
import { up as upMysql } from "@/db/mysql/mysql.migration";
import { createPool } from "mysql2";

async function SetUp() {

/*
in terminal
docker run --name test --rm -e MYSQL_ROOT_PASSWORD=password -p 3307:3306 -d mysql:latest 
create table Containers;
const poolargs: Parameters<typeof createPool>[0] = {
    user: "root",
    password: "password",
    host:"localhost",
    database:"Containers",
    port:3307
};
const db2 = createMySQLDB(poolargs);
upMysql(db2.adapter());
*/

  const db = createSQLiteDB("sqlite.db");


  return db;
}

const promiseDB = SetUp();

export { promiseDB };
