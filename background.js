chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getTabs") {
      const windowId = request.windowId;
      chrome.tabs.query({windowId: windowId}, (tabs) => {
        const tabUrls = tabs.map(tab => ({ url: tab.url }));
        sendResponse({ tabs: tabUrls });
      });
      // Return true to indicate that the response will be sent asynchronously
      return true;
    }
  });
  