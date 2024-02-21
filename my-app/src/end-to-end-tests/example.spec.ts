import { test, expect } from '@playwright/test';
import { down,up } from '@/db/kysely/sqlite.migration';
import { createSQLiteDB } from '@/db/kysely/sqlite.db';
import 'dotenv/config'

function cleanUpDB(url:string){
  const db = createSQLiteDB(url)
  down(db.adapter())
  up(db.adapter())
}

function getEmail(){
  const email = process.env["EMAIL"]

  if (email ===undefined){
    throw Error("email undefined")
  }
  return email
}

test.beforeEach(()=>{
  const sqliteFilePath = "../../sqlite.db"
  cleanUpDB(sqliteFilePath)
})



test('login', async ({ page }) => {

  test.expect(9).toBe(9)
  

});

