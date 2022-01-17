document.addEventListener(
  "DOMContentLoaded",
  () => {
    document.getElementById("scrape-button").addEventListener(
      "click",
      () => {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, "scrape");
        });
      },
      false
    );
    const loadButton = document.getElementById("load-button");
    loadButton.addEventListener(
      "click",
      () => {
        loadButton.innerHTML = "0 %";
        loadButton.disabled = true;
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, "load");
        });
      },
      false
    );
    const resetLoadButton = () => {
      loadButton.innerHTML = "Load All";
      loadButton.disabled = false;
    };
    chrome.runtime.onMessage.addListener((request) => {
      request === "complete" && resetLoadButton();
      if (request[0] === "status") {
        loadButton.innerHTML = request[1];
      }
    });
  },
  false
);
