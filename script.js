//npm install puppeteer
const puppy = require("puppeteer");
const fs = require("fs");

const searching = "Web Development"
let tab;
async function run(){
    const browser = await puppy.launch({
        headless : false,
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', //using chrome browser
        defaultViewport: null,
        args:["--start-maximized"]
    });
    const page = await browser.pages();
    tab = page[0];
    await tab.goto("https://www.youtube.com/",{
        waitUntil: "networkidle2",
        timeout: 0
    });
// waiting and clicking on Sign in option 
    await tab.waitForSelector("tp-yt-paper-button[class='style-scope ytd-button-renderer style-suggestive size-default']", {visible : true, timeout: 0});
    await tab.click("tp-yt-paper-button[class='style-scope ytd-button-renderer style-suggestive size-default']");
//typing the email and clicking to the next button
    await tab.waitForSelector("input[type='email']", {visible: true});
    await tab.type("input[type='email']", "googletempemail@gmail.com");
    await tab.click("div[class='VfPpkd-RLmnJb']");
//typing the password and cicking to the next button
    await tab.waitForSelector("input[type='password']", {visible: true});
    await tab.type("input[type='password']", "1234@Randompassword");
    await tab.click("div[class='VfPpkd-RLmnJb']");

// waiting and typing in the search bar
    await tab.waitForSelector("input[role='combobox']",{
        visible: true,
        timeout: 0
    });
    await tab.type("input[role='combobox']", searching);
//clicking the search button
    await tab.waitForSelector("button[id='search-icon-legacy']",{
        visible: true,
        timeout: 0
    });
    await tab.click("button[id='search-icon-legacy']");
//waiting and clicking on filter options
    await tab.waitForSelector("tp-yt-paper-button[aria-label='Search filters']",{visible : true});
    await tab.click("tp-yt-paper-button[aria-label='Search filters']");
//selecting the playlist option in filter
    await tab.waitForSelector("div[title='Search for Playlist']", {visible: true});
    await tab.click("div[title='Search for Playlist']");
    
    await tab.waitForTimeout(3000);
//again clicking on filter options
    await tab.waitForSelector("tp-yt-paper-button[aria-label='Search filters']",{visible : true});
    await tab.click("tp-yt-paper-button[aria-label='Search filters']");
//selecting the view count option in filter
    await tab.waitForSelector("div[title='Sort by view count']", {visible: true});
    await tab.click("div[title='Sort by view count']");
//saving all the elements visible on the tab in allEle array
    await tab.waitForSelector("a[class='yt-simple-endpoint style-scope ytd-playlist-thumbnail']");
    let allEle = await tab.$$("a[class='yt-simple-endpoint style-scope ytd-playlist-thumbnail']", {visible: true});
    console.log(allEle.length);
//saving all the href attributes i.e. playlist links in arrUrl
    let arrUrl=[];
    for(let i=0; i<allEle.length ;i++){
     arrUrl[i] = await tab.evaluate(function(ele){
        return ele.getAttribute("href");
    }, allEle[i]);
    }
//writing all playlist link data in output.txt file 
    let arr = [];
    for(let i = 0; i < arrUrl.length ; i++) {
        arr.push("https://www.youtube.com"+arrUrl[i]);
    }
    let writeData = arr.join("\r\n\n");
    fs.writeFileSync("output.txt", writeData);

    // for(let i=0;i<arrUrl.length; i++){
    //     console.log("https://www.youtube.com"+arrUrl[i]+" -> ");
    //   }
// Going to top 5 playlist links and saving or removind if already saved all the playlist to the youtube account
    await tab.waitForTimeout(3000);
    for(let i=0 ;i<5 ;i++){
        await tab.goto("https://www.youtube.com"+arrUrl[i]);
        try{
        await tab.waitForSelector("button[aria-label='Save playlist']", {visible: true, timeout: 3000});
        await tab.click("button[aria-label='Save playlist']");
        }catch(e){
           
                await tab.waitForSelector("button[aria-label='Remove from Library']", {visible: true});
                await tab.click("button[aria-label='Remove from Library']");
            
           
        }
    }
//menu options of youtube to show the playlists are saved
    await tab.waitForSelector("yt-icon-button[toggleable='true']", {visible: true});
    await tab.click("yt-icon-button[toggleable='true']");
    try{
    await tab.waitForSelector("a[title='Show more']", {visible: true, timeout: 3000});
    await tab.click("a[title='Show more']");
    }catch(e){
        
    }
    await tab.waitForTimeout(3000);

    
    await tab.waitForSelector("yt-icon-button[toggleable='true']", {visible: true});
    await tab.click("yt-icon-button[toggleable='true']");

    
    await tab.waitForTimeout(1000);
//going to the home page of youtube
    await tab.goto("https://www.youtube.com/",{
        waitUntil: "networkidle2",
        timeout: 0
    });
//closing the browser 
    browser.close();
}
run();
