function getJobTitle() {
    const selectors = [
        "h1",
        "[data-testid*='job-title']",
        "[class*='job-title']",
        "[class*='jobTitle']",
        "[class*='position-title']"
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);

        if (element && element.innerText.trim()) {
            return element.innerText.trim();
        }
    }

    return document.title;
}


function getCompany() {
    const selectors = [
        "[class*='company']",
        "[class*='employer']",
        "[data-testid*='company']"
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);

        if (element && element.innerText.trim()) {
            return element.innerText.trim();
        }
    }

    return "Unknown";
}


function getLocation() {
    const selectors = [
        "[class*='location']",
        "[class*='Location']",
        "[data-testid*='location']"
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);

        if (element && element.innerText.trim()) {
            return element.innerText.trim();
        }
    }

    return "Unknown";
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "GET_JOB_INFO") {

        sendResponse({
            title: getJobTitle(),
            company: getCompany(),
            location: getLocation()
        });
    }

});