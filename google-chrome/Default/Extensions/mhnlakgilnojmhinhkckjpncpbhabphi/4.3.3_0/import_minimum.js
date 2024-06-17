(function() {
    const importPath = /*@__PURE__*/ JSON.parse('"minimum.js"');
    import(chrome.runtime.getURL(importPath));
})();