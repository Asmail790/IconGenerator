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



test('has title', async ({ page }) => {
  const email = getEmail()
  await page.goto('/');
  await page.waitForEvent
  await page.getByTestId("sign-in-button").click()
  await page.getByRole("button").click()
  await page.getByText(email).click()
  const loggedIn = await page.getByTestId("user-email")



  
   expect(loggedIn).toHaveText(email)
});

