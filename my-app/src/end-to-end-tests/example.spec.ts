import { test, expect, Page } from '@playwright/test';
import { down,up } from '@/db/sqlite/sqlite.migration';
import { createSQLiteDB } from '@/db/sqlite/sqlite.db';
import 'dotenv/config'
import { afterAll } from 'vitest';
import Path from "path"
import { login, logout } from './auth/log-in';
import { predefinedColors } from '@/_constants/colors';
import { TStyle, styles } from '@/_constants/styles';

async function cleanUpDB(url:string){
  const db = createSQLiteDB(url)
  await down(db.adapter())
  await up(db.adapter())

}


test.beforeEach(async ()=>{
  let path = Path.join(__filename,"../../../sqlite.db")
  path = Path.normalize(path)
  await cleanUpDB(path)
})



test('generate', async ({ page }) => {
  await page.goto('/');
  
  await login(page)

  await page.getByRole('link', { name: 'icon generator' }).click();
  await page.locator('[id="\\#b91c1c-color"]').click();
  await page.locator('#pixelated-color').click();
  await page.getByPlaceholder('Description').click();
  await page.getByPlaceholder('Description').fill('An icon for mobile repear');
  await page.getByRole('button', { name: 'Generate images' }).click();
});


test("create icon,search and delete",async({page})=>{
  // generate 
  await page.goto('/');
  
  await login(page)
  await page.goto('/');

  await page.getByRole('link', { name: 'icon generator' }).click();
  await page.locator('[id="\\#b91c1c-color"]').click();
  await page.locator('#pixelated-color').click();
  await page.getByPlaceholder('Description').click();
  await page.getByPlaceholder('Description').fill('red');
  await page.getByLabel('Number of images to generate').click();
  await page.getByLabel('Number of images to generate').fill("1");
  await page.getByRole('button', { name: 'Generate images' }).click();


  //
  await page.getByTestId('save-button').click();


  // searching
  await page.getByRole('link', { name: 'my collection' }).click();
  await page.locator('input[name="description"]').click();
  await page.locator('input[name="description"]').fill('red');
  await page.locator('input[name="description"]').press('Enter');

  // deleting
  await page.getByRole('button', { name: 'delete', exact: true }).click();
})


test("login logout",async ({page})=>{
  await page.goto('/');
  await login(page)
  await logout(page)
  await page.getByTestId("auth-session-loading-state")
  await page.getByTestId("sign-in-button").click()
})


// test("generate many and navigate using pagination",async ({page})=>{
//   await page.goto('/');
//   await login(page)
//   await page.getByRole('link', { name: 'icon generator' }).click();
//   await page.locator('[id="\\#b91c1c-color"]').click();
//   await page.locator('#pixelated-color').click();
//   await page.getByPlaceholder('Description').click();
//   await page.getByPlaceholder('Description').fill('red');
//   await page.getByLabel('Number of images to generate').click();
//   await page.getByLabel('Number of images to generate').fill("1");
  
//   for(let i=0;i <15;i++){
//     await page.getByRole('button', { name: 'Generate images' }).click();
//     await page.getByTestId('save-button').click({noWaitAfter:true,force:true});
//   }
// })