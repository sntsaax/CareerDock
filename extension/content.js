chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "GET_PAGE_DATA") {

        const pageData = {
            url: window.location.href,
            title: document.title,
            content: document.body.innerText || ""
        };

        sendResponse(pageData);
    }

});