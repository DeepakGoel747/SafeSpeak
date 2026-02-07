const enabledToggle = document.getElementById("enabled");
const showBadgeToggle = document.getElementById("showBadge");
const thresholdSlider = document.getElementById("threshold");
const keywordInput = document.getElementById("keywords");
const clearBtn = document.getElementById("clearKeywords");
const status = document.getElementById("status");

// Load saved settings
chrome.storage.sync.get(
  ["enabled", "threshold", "keywords", "showBadge"],
  (data) => {
    enabledToggle.checked = data.enabled ?? true;
    showBadgeToggle.checked = data.showBadge ?? true;
    thresholdSlider.value = data.threshold ?? 0.3;
    keywordInput.value = data.keywords ?? "";
  }
);

// Save settings
function saveSettings() {
  chrome.storage.sync.set({
    enabled: enabledToggle.checked,
    showBadge: showBadgeToggle.checked,
    threshold: parseFloat(thresholdSlider.value),
    keywords: keywordInput.value
  });

  status.innerText = "Settings saved ";
  setTimeout(() => (status.innerText = ""), 1500);
}

enabledToggle.addEventListener("change", saveSettings);
showBadgeToggle.addEventListener("change", saveSettings);
thresholdSlider.addEventListener("change", saveSettings);
keywordInput.addEventListener("change", saveSettings);

// Clear keywords button
clearBtn.addEventListener("click", () => {
  keywordInput.value = "";

  chrome.storage.sync.set({ keywords: "" }, () => {
    status.innerText = "Keywords cleared ";
    setTimeout(() => (status.innerText = ""), 1500);
  });
});
