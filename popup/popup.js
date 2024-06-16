document.getElementById('getTabsButton').addEventListener('click', function() {
    const filename = document.getElementById('filenameInput').value || 'tab_urls';
    chrome.windows.getCurrent({populate: true}, function(window) {
      const windowId = window.id;
      chrome.runtime.sendMessage({ message: "getTabs", windowId: windowId }, function(response) {
        const tabLinksDiv = document.getElementById('tabLinks');
        const saveButton = document.getElementById('saveTabsButton');
        tabLinksDiv.innerHTML = ''; // Clear previous links
  
        const urls = response.tabs.map(tab => tab.url);
        
        urls.forEach(function(url) {
          const linkElement = document.createElement('div');
          linkElement.textContent = url;
          tabLinksDiv.appendChild(linkElement);
        });
  
        if (urls.length > 0) {
          saveButton.style.display = 'block';
          saveButton.onclick = function() {
            saveUrlsToFile(urls, filename);
          };
          // Automatically save the URLs to a file
          saveUrlsToFile(urls, filename);
        } else {
          saveButton.style.display = 'none';
        }
      });
    });
  });
  
  document.getElementById('openTabsButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
  });
  
  document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const urls = e.target.result.split('\n').filter(url => url.trim().length > 0);
        urls.forEach(function(url) {
          chrome.tabs.create({ url: url });
        });
      };
      reader.readAsText(file);
    }
  });
  
  function saveUrlsToFile(urls, filename) {
    const blob = new Blob([urls.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.urls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  