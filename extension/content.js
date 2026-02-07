(() => {
  console.log("SafeSpeak content script loaded");

  const blockedHosts = [
    "accounts.google.com",
    "google.com",
    "chrome://",
    "edge://",
    "localhost"
  ];

  if (blockedHosts.some(h => location.href.includes(h))) return;

  chrome.storage.sync.get(
    ["enabled", "keywords", "showBadge"],
    (settings) => {
      if (settings.enabled === false) return;

      const keywords = (settings.keywords || "")
        .split(",")
        .map(w => w.trim().toLowerCase())
        .filter(Boolean);

      if (!keywords.length) return;

      if (settings.showBadge !== false) {
        const badge = document.createElement("div");
        badge.innerText = "SafeSpeak ON";
        Object.assign(badge.style, {
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999999,
          background: "#111",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          opacity: 0.85
        });
        document.body.appendChild(badge);
      }

      const highlight = () => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              if (!node.parentElement) return NodeFilter.FILTER_REJECT;
              if (node.parentElement.tagName === "SCRIPT") return NodeFilter.FILTER_REJECT;
              if (node.parentElement.tagName === "STYLE") return NodeFilter.FILTER_REJECT;

              const text = node.nodeValue.toLowerCase();
              return keywords.some(k => text.includes(k))
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
            }
          }
        );

        let node;
        while ((node = walker.nextNode())) {
          const span = document.createElement("span");
          span.style.background = "yellow";
          span.style.border = "2px solid red";
          span.style.padding = "2px";
          span.textContent = node.nodeValue;
          node.parentNode.replaceChild(span, node);
        }
      };

      // initial
      highlight();

      // dynamic content (Reddit/X)
      const observer = new MutationObserver(() => highlight());
      observer.observe(document.body, { childList: true, subtree: true });
    }
  );
})();
