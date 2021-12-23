const fs = require('fs');
const puppeteer = require('puppeteer');
const S3 = require('aws-sdk/clients/s3');

async function puppeteerScript() {
  // Launch Browser
  const browser = await puppeteer.launch({    
    args: [
        '--disable-dev-shm-usage',
        '--disable-dev-tools',
        '--disable-gpu',
        '--headless',
        '--no-startup-window',
        '--single-process',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--no-zygote',
        //'--user-data-dir=/tmp/chrome-user-data',
        ''
    ],
    defaultViewport: {
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        isMobile: false,
        isLandscape: true,
        hasTouch: false
    },
    pipe: true,
    waitForInitialPage: true,
  });
  // Open page
  const page = await browser.newPage();
  page.goto( 'https://www.horlogeparlante.com/heure-paris-france-2988507fs/' );
  let promise = new Promise((resolve, reject) => {
    page.on('load', async (content) => {

      try {
        // Take a Screenshot
        let ssBuffer = await page.screenshot({
          type: 'png',
          fullPage: true
        });


        // Connect to S3
        const s3 = new S3();
        // Put screenshot into Bucket
        const objectParams = {
          Bucket: 'dabos-bucket',
          Key: 'screenshot-' + Date.now() +  '.png',
          Body: ssBuffer
        };

        await s3.putObject( objectParams ).promise();
        resolve();
      }
      catch (error) {
        console.log('error', error.message);
        reject(error);
      }
      finally {
        // close browser
        await browser.close();
      }
    });
  });
  // Return a promise
  return promise;
}

exports.handler = async function handler(event) {
  return puppeteerScript();
};
