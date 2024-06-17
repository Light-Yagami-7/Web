(function() {
    const importPath = /*@__PURE__*/ JSON.parse('"iframeDocumentStart.js"');
    import(chrome.runtime.getURL(importPath));
})();