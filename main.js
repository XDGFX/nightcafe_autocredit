/**
 * Automatically claim Nightcafe free credits (run once per day).
 *
 * Requires a .env file with the following variables:
 * - FIREBASE_KEY
 * - FIREBASE_VAL
 *
 * These are LocalStorage values which you can obtain from the Nightcafe website:
 * 1. Open the Nightcafe website in your browser
 * 2. Login if you haven't already
 * 3. Open the developer console (F12) and go to the 'Storage' tab
 * 4. Find the 'firebase:authUser:[user]' key and copy the key and value
 * 5. Create a .env file in the same directory as this script and add the following line:
 *      FIREBASE_KEY=firebase:authUser:[user]
 *      FIREBASE_VAL=[value]
 * 6. Run the script
 */

import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("Setting auth...");

    // Set localstorage login data
    await page.evaluateOnNewDocument((token) => {
        localStorage.clear();
        localStorage.setItem(process.env.FIREBASE_KEY, token);
    }, process.env.FIREBASE_VAL);

    console.log("Navigating to page...");

    // Open the page
    await page.goto(
        "https://creator.nightcafe.studio/my-creations?claimTopup=true"
    );

    console.log("Waiting for page to load...");

    // Wait for the button to load
    await page.waitForXPath("//button[contains(., 'Claim 5 credits')]");

    console.log("Clicking button...");

    // Click the button
    setTimeout(async () => {
        await page.screenshot({ path: "page_loaded.png" });

        const [button] = await page.$x(
            "//button[contains(., 'Claim 5 credits')]"
        );
        await button.click();
    }, 5000);
})();
