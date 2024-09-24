let clearLog = !0;
const offscreenSupported = "undefined" !== typeof chrome.offscreen;
let lastActivity = 0, sellerLockoutDuration = 60000, delayedFetch = !1, ignoreResponseCookies = !1, stockDelay = 0, startedAt = new Date();
setInterval(() => {
  3E5 < Date.now() - lastActivity && chrome.runtime.reload();
}, 144E5);
let hasWebRequestPermission = !!chrome.webRequest, interceptedExtensionCookies = {}, serviceWorkerUrl = chrome.runtime.getURL("").replace(/\/$/, "");
async function waitForCookies(a, c) {
  const d = interceptedExtensionCookies[a]?.promise;
  return new Promise(g => {
    const b = setTimeout(() => {
      console.log("Timeout reached without cookies");
      g(null);
    }, c);
    d || (clearTimeout(b), g(null));
    d.then(e => {
      clearTimeout(b);
      g(e);
    });
  });
}
async function handleGuestSession(a, c) {
  let d = null;
  try {
    d = cloud.getSessionId(settings.extensionCookies[a.domainId]?.cookies);
  } catch (g) {
    console.error(g);
  }
  await swapCookies(a.url, c, a.userCookies);
  delete settings.userCookies["" + a.domainId];
  a.response.cookies = null;
  a.response.text = null;
  delete settings.extensionCookies["" + a.domainId];
  common.reportBug(null, generateBugReport("new s is u s", d, a));
  a.response.status = 900;
}
function updateCookies(a, c) {
  Array.isArray(a) || (a = []);
  Array.isArray(c) || (c = []);
  const d = new Map(a.map(b => [b.name, b])), g = new Set(c.filter(b => "-" !== b.value && "" !== b.value && "delete" !== b.value).map(b => b.name));
  c.forEach(b => {
    if (g.has(b.name)) {
      "-" !== b.value && "" !== b.value && "delete" !== b.value && d.set(b.name, b);
    } else {
      const e = d.get(b.name);
      e && e.secure === b.secure && e.path === b.path ? "" === b.value || "-" === b.value || "delete" === b.value ? d.delete(b.name) : d.set(b.name, b) : "" !== b.value && "-" !== b.value && "delete" !== b.value && d.set(b.name, b);
    }
  });
  return Array.from(d.values());
}
function parseSetCookieString(a) {
  a = a.split(";").map(b => b.trim());
  const [c, d] = a[0].split("="), g = {name:c, value:d, domain:"", path:"", secure:!1, hostOnly:!1, httpOnly:!1, session:!1, storeId:"0", sameSite:"unspecified", expirationDate:0};
  a.slice(1).forEach(b => {
    const [e, m] = b.split("=");
    switch(e.toLowerCase()) {
      case "domain":
        g.domain = m;
        break;
      case "path":
        g.path = m;
        break;
      case "expires":
        g.expirationDate = (new Date(m)).getTime() / 1000;
        break;
      case "secure":
        g.secure = !0;
        break;
      case "hostOnly":
        g.hostOnly = !0;
        break;
      case "httpOnly":
        g.httpOnly = !0;
        break;
      case "session":
        g.session = !0;
        break;
      case "sameSite":
        g.sameSite = !0;
    }
  });
  return g;
}
let AmazonSellerIds = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" "), WarehouseDealsSellerIds = [];
const userAgentData = navigator.userAgentData?.brands.find(({brand:a}) => "Google Chrome" === a), settingKeys = "optOut_crawl revealStock s_boxOfferListing s_boxType s_boxHorizontal webGraphType webGraphRange overlayPriceGraph lastActivated".split(" "), isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent), userAgent = navigator.userAgent.toLowerCase(), isFirefox = userAgent.includes("firefox"), isEdge = userAgent.includes("edge/"), isSafari = /Apple Computer/.test(navigator.vendor) && 
userAgent.includes("safari"), isOpera = userAgent.includes("opera") || userAgent.includes("opr/"), isChrome = !isOpera && !isFirefox && !isEdge && !isSafari, type = isChrome ? "keepaChrome" : isOpera ? "keepaOpera" : isSafari ? "keepaSafari" : isEdge ? "keepaEdge" : "keepaFirefox", browserType = isFirefox ? "Firefox" : isSafari ? "Safari" : isChrome ? "Chrome" : isOpera ? "Opera" : isEdge ? "Edge" : "Unknown";
let installTimestamp = 0;
const runningSince = Date.now();
let settings = {}, cookieOrder = "session-id session-id-time i18n-prefs skin ubid-main sp-cdn session-token".split(" ");
const cookieToString = a => {
  let c = "", d = "";
  var g = {};
  for (let b in a) {
    const e = a[b];
    g[e.name] = e;
  }
  a = [];
  for (let b in cookieOrder) {
    g[cookieOrder[b]] && a.push(g[cookieOrder[b]]);
  }
  for (let b in cookieOrder) {
    delete g[cookieOrder[b]];
  }
  for (let b in g) {
    a.push(g[b]);
  }
  for (let b in a) {
    g = a[b], "-" != g.value && (c += d + g.name + "=" + g.value + ";", d = " ");
  }
  return c;
};
function generateBugReport(a, c, d) {
  return (new Date()).toISOString().substring(0, 19) + ` # ${a} ! ${c} --- ${d.userSession} ${d.url}` + ` status: ${d.response.status}` + ` webreq: ${hasWebRequestPermission}` + ` sc active: ${0 == lastSellerActivity ? "never" : (new Date(lastSellerActivity)).toISOString().substring(0, 19)}` + ` c active: ${0 == lastContentActivity ? "never" : (new Date(lastContentActivity)).toISOString().substring(0, 19)}`;
}
async function updateLocalStorage() {
  await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies), userCookies:await compressObject(settings.userCookies)});
}
const swapCookies = async(a, c, d) => {
  cloud.getSessionId(c);
  cloud.getSessionId(d);
  let g = null != d ? new Set(d.map(e => e.name)) : null, b = [];
  if (null != c) {
    for (let e of c) {
      null != d && g.has(e.name) || (delete e.hostOnly, delete e.session, b.push(chrome.cookies.remove({url:a + e.path, name:e.name})));
    }
  }
  if (null != d) {
    for (let e of d) {
      delete e.hostOnly, delete e.session, e.url = a, b.push(chrome.cookies.set(e));
    }
  }
  await Promise.all(b).catch(e => {
    setTimeout(() => {
      common.reportBug(e, "Error in cookie swap.");
    }, 1);
  });
}, DNR = (() => {
  let a = 100;
  const c = g => 0 === g.length ? Promise.resolve() : chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:g}), d = async() => {
    let g = [], b = chrome.declarativeNetRequest.getSessionRules();
    b.then(e => e.forEach(m => {
      g.push(m.id);
    }));
    await b;
    return c(g);
  };
  (async() => {
    await d();
  })();
  return {addSessionRules:g => {
    let b = [];
    g.forEach(e => {
      const m = ++a;
      e.id = m;
      b.push(m);
    });
    return [chrome.declarativeNetRequest.updateSessionRules({addRules:g}), b];
  }, deleteSessionRules:c, deleteAllRules:d};
})();
class Queue {
  constructor() {
    this._items = [];
  }
  enqueue(a) {
    this._items.push(a);
  }
  dequeue() {
    return this._items.shift();
  }
  get size() {
    return this._items.length;
  }
}
class AutoQueue extends Queue {
  constructor() {
    super();
    this._pendingPromise = !1;
  }
  enqueue(a) {
    return new Promise((c, d) => {
      super.enqueue({action:a, resolve:c, reject:d});
      this.dequeue();
    });
  }
  async dequeue() {
    if (this._pendingPromise) {
      return !1;
    }
    let a = super.dequeue();
    if (!a) {
      return !1;
    }
    try {
      this._pendingPromise = !0;
      let c = await a.action(this);
      this._pendingPromise = !1;
      a.resolve(c);
    } catch (c) {
      this._pendingPromise = !1, a.reject(c);
    } finally {
      this.dequeue();
    }
    return !0;
  }
}
const requestQueue = new AutoQueue(), processRequest = async a => {
  if (a) {
    if (!a.domainId && 0 < a.url.indexOf("amazon.")) {
      console.log("request without domainId");
    } else {
      var c = Date.now();
      lastActivity = c;
      if (!(a.isGuest && !1 === a.ignoreCookies && !hasWebRequestPermission && c - lastSellerActivity < sellerLockoutDuration)) {
        var d = parseInt(c / 1000), g = new URL(a.url);
        a.response = {headers:{}, text:null};
        "undefined" === typeof a.cookies && (a.cookies = []);
        a.userCookies = null;
        var b = null != a.cookies ? cookieToString(a.cookies) : null;
        c = hasWebRequestPermission || !0 === a.ignoreCookies && null != b && 8 < b.length;
        for (let n = 0; n < a.dnr.length; n++) {
          const f = a.dnr[n];
          f.priority = 108108;
          f.condition && (-1 < a.url.indexOf("amazon.") ? f.condition.urlFilter = "||amazon." + getTldByDomain(a.domainId) : f.condition.urlFilter = a.url, f.condition.initiatorDomains = [chrome.runtime.id], delete f.condition.tabIds);
          let l = !1;
          for (let k = 0; k < f.action.requestHeaders.length; k++) {
            const h = f.action.requestHeaders[k];
            "set" == h.operation && ("cookie" == h.header.toLowerCase() ? (null != b ? h.value = h.value.replace("{COOKIE}", b) : (delete h.value, h.operation = "remove"), l = !0) : (h.value = h.value.replace("{ORIGIN}", g.host), a.language && (h.value = h.value.replace("{LANG}", a.language)), a.referer && (h.value = h.value.replace("{REFERER}", a.referer)), a.csrf && (h.value = h.value.replace("{CSRF}", a.csrf))));
          }
          a.isGuest && !l && "modifyHeaders" == f.action.type && (null != b && 0 < a.cookies.length ? f.action.requestHeaders.push({header:"Cookie", operation:"set", value:b}) : f.action.requestHeaders.push({header:"Cookie", operation:"remove"}));
          a.isGuest && c && (f.action.responseHeaders = [{header:"Set-Cookie", operation:"remove"}]);
        }
        try {
          try {
            await DNR.deleteAllRules();
          } catch (l) {
            common.reportBug(l, "Error deleteAllRules.");
            return;
          }
          if (a.isGuest) {
            a.userSession = "";
            var e = {excludedInitiatorDomains:[chrome.runtime.id], isUrlFilterCaseSensitive:!1, urlFilter:"||amazon." + getTldByDomain(a.domainId), resourceTypes:"main_frame sub_frame csp_report font image media object other ping script stylesheet webbundle websocket webtransport xmlhttprequest".split(" ")};
            a.userCookies = await chrome.cookies.getAll({url:a.url});
            if (0 < a.userCookies.length) {
              var m = cloud.getSessionId(a.userCookies);
              if (m && 0 < m.length) {
                if (cloud.getSessionId(a.cookies) == m) {
                  throw "pre r; u s is r c s: " + m + " : " + a.userSession + " - " + a.url + "  sc active: " + (0 == lastSellerActivity ? "never" : (new Date(lastSellerActivity)).toISOString().substring(0, 19)) + " c active: " + (0 == lastContentActivity ? "never" : (new Date(lastContentActivity)).toISOString().substring(0, 19));
                }
                a.userSession = m;
              }
              c || a.dnr.push({priority:108107, action:{type:"modifyHeaders", requestHeaders:[{header:"Cookie", operation:"set", value:cookieToString(a.userCookies)}], responseHeaders:[{header:"Set-Cookie", operation:"remove"}]}, condition:e});
            } else {
              c || a.dnr.push({priority:108107, action:{type:"modifyHeaders", requestHeaders:[{header:"Cookie", operation:"remove"}], responseHeaders:[{header:"Set-Cookie", operation:"remove"}]}, condition:e});
            }
          }
          const [n, f] = DNR.addSessionRules(a.dnr);
          try {
            await n;
          } catch (l) {
            common.reportBug(l, "Error dnrPromise.");
            return;
          }
          var p = "object" === typeof a.urls;
          e = null;
          try {
            if (a.isGuest && (settings.userCookies["" + a.domainId] = a.userCookies, await chrome.storage.local.set({userCookies:await compressObject(settings.userCookies)}), !c)) {
              m = [];
              if (null != a.cookies) {
                for (g = 0; g < a.cookies.length; ++g) {
                  let k = a.cookies[g];
                  try {
                    k.expirationDate = Number(d + 180 + ".108108");
                  } catch (h) {
                    console.error(h);
                  }
                  "sp-cdn" != k.name && m.push(k);
                }
              } else {
                m = null;
              }
              await swapCookies(a.url, a.userCookies, m);
            }
            let l = k => {
              hasWebRequestPermission && (interceptedExtensionCookies[k] = {promise:null, resolve:null}, interceptedExtensionCookies[k].promise = new Promise(h => {
                interceptedExtensionCookies[k].resolve = h;
              }), setTimeout(() => {
                delete interceptedExtensionCookies[k];
              }, 60000));
            };
            if (p) {
              a.url = a.urls[0];
              a.urls.forEach(h => l(h));
              a.responses = {};
              const k = a.urls.map(async h => {
                let q = await fetch(h, a.fetch);
                a.responses[h] = {headers:{}, text:"", status:0};
                a.responses[h].text = await q.text();
                for (let r of q.headers.entries()) {
                  a.responses[h].headers[r[0]] = r[1];
                }
                a.responses[h].status = q.status;
              });
              await Promise.all(k);
            } else {
              l(a.url);
              e = await fetch(a.url, a.fetch);
              if (!delayedFetch || c) {
                a.response.text = await e.text();
              }
              for (let k of e.headers.entries()) {
                a.response.headers[k[0]] = k[1];
              }
              a.response.status = e.status;
            }
          } catch (l) {
          } finally {
            delete a.dnr;
            delete a.fetch;
            if (a.isGuest) {
              let l = await chrome.cookies.getAll({url:a.url}), k = cloud.getSessionId(l);
              if (c) {
                let h = [];
                hasWebRequestPermission && (p ? a.urls.forEach(async q => {
                  q = await waitForCookies(q, 2000);
                  null != q && 0 < q.length && h.concat(q);
                }) : h = await waitForCookies(a.url, 2000));
                p = null;
                if (h && 0 < h.length) {
                  let q = updateCookies(a.cookies, h);
                  a.response.cookies = q;
                  p = cloud.getSessionId(a.response.cookies);
                  p == a.userSession || k == p ? await handleGuestSession(a, l) : "" != p ? settings.extensionCookies["" + a.domainId] = {cookies:a.response.cookies, createDate:Date.now()} : delete settings.extensionCookies["" + a.domainId];
                } else {
                  a.response.cookies = a.cookies;
                }
              } else {
                a.response.cookies = l, k != a.userSession || "" == k && "" == a.userSession ? ("" != k ? settings.extensionCookies["" + a.domainId] = {cookies:a.response.cookies, createDate:Date.now()} : delete settings.extensionCookies["" + a.domainId], await swapCookies(a.url, a.response.cookies, a.userCookies)) : await handleGuestSession(a, l);
              }
            }
            delete settings.userCookies["" + a.domainId];
            await updateLocalStorage();
            await DNR.deleteSessionRules(f);
            delayedFetch && !c && null != e && (a.response.text = await e.text());
            delete interceptedExtensionCookies[a.url];
          }
        } catch (n) {
          a.response.cookies = null, a.response.text = null, a.response.status = 901, delete settings.extensionCookies["" + a.domainId], delete settings.userCookies["" + a.domainId], await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies), userCookies:await compressObject(settings.userCookies)}), await DNR.deleteAllRules(), common.reportBug(n, "rCatch: " + a.url);
        }
      }
    }
  }
}, init = () => {
  isFirefox ? chrome.storage.local.get(["install", "optOutCookies"], a => {
    a.optOutCookies && 3456E5 > Date.now() - a.optOutCookies || (a.install ? common?.register() : chrome.tabs.create({url:chrome.runtime.getURL("chrome/content/onboard.html")}));
  }) : common?.register();
  chrome.storage.local.get(["installTimestamp"], a => {
    a.installTimestamp && 12 < (a.installTimestamp + "").length ? installTimestamp = a.installTimestamp : (installTimestamp = Date.now(), chrome.storage.local.set({installTimestamp}));
  });
}, restoreUserCookies = async() => {
  try {
    for (let a = 0; a < settings.userCookies.length; a++) {
      const c = settings.userCookies[a];
      if (c) {
        const d = "https://www.amazon." + getTldByDomain(a);
        await swapCookies(d, settings.extensionCookies[a]?.cookies || [], c);
        delete settings.userCookies["" + a];
        await chrome.storage.local.set({userCookies:await compressObject(settings.userCookies)});
      }
    }
  } catch (a) {
    common.reportBug(a, "restoreUserCookies");
  }
};
async function decompress(a, c) {
  c = new DecompressionStream("deflate" + (c ? "-raw" : ""));
  let d = c.writable.getWriter();
  d.write(a);
  d.close();
  return await (new Response(c.readable)).arrayBuffer().then(function(g) {
    return (new TextDecoder()).decode(g);
  });
}
async function compress(a, c) {
  c = new CompressionStream("deflate" + (c ? "-raw" : ""));
  let d = c.writable.getWriter();
  d.write((new TextEncoder()).encode(a));
  d.close();
  a = await (new Response(c.readable)).arrayBuffer();
  return new Uint8Array(a);
}
function parseNumberFormat(a) {
  a = a.toString();
  var c = a.includes(".") ? a.split(".")[1].length : 0;
  a = a.replace(".", "");
  return parseInt(a, 10) * Math.pow(10, 2 - c);
}
async function compressObject(a) {
  try {
    let c = await compress(JSON.stringify(a), !0);
    return btoa(String.fromCharCode.apply(null, c));
  } catch (c) {
    return console.error("An error occurred:", c), null;
  }
}
async function decompressObject(a) {
  a = Uint8Array.from(atob(a), c => c.charCodeAt(0));
  return JSON.parse(await decompress(a, !0));
}
chrome.storage.local.set({lastActivated:Date.now()}, () => {
  chrome.storage.local.get(null, async a => {
    try {
      "undefined" != typeof a && (settings = a);
      if (settings.extensionCookies) {
        try {
          settings.extensionCookies = await decompressObject(settings.extensionCookies);
        } catch (c) {
          common.reportBug(c, "1 " + JSON.stringify(a)), settings.extensionCookies = [];
        }
      } else {
        settings.extensionCookies = [];
      }
      if (!hasWebRequestPermission && settings.userCookies) {
        try {
          settings.userCookies = await decompressObject(settings.userCookies), restoreUserCookies();
        } catch (c) {
          common.reportBug(c, "3 " + JSON.stringify(a)), settings.userCookies = [];
        }
      } else {
        settings.userCookies = [];
      }
      init();
      settings.stockCookies && chrome.storage.local.remove("stockCookies");
      settings.guestCookies && chrome.storage.local.remove("guestCookies");
    } catch (c) {
      common.reportBug(c, "4 " + JSON.stringify(a));
    }
  });
});
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
let lifeline = null;
self.onactivate = a => {
};
chrome.alarms.clearAll();
chrome.alarms.create("keepAlive", {periodInMinutes:1});
chrome.alarms.onAlarm.addListener(a => {
  chrome.storage.local.get(["lastActivated"], c => {
    Date.now();
  });
});
let asinCache = {}, lastSellerActivity = 0, lastContentActivity = 0, asinCacheSize = 0;
chrome.runtime.onMessage.addListener((a, c, d) => {
  lastActivity = Date.now();
  if (c.tab && c.tab.url || c.url) {
    switch(a.type) {
      case "restart":
        chrome.runtime.reload();
        break;
      case "setCookie":
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:a.key, value:a.val, secure:!0, expirationDate:(Date.now() / 1000 | 0) + 31536E3});
        "token" == a.key ? settings?.token != a.val && 64 == a.val.length && (settings.token = a.val, chrome.storage.local.set({token:a.val}), chrome.tabs.query({}, b => {
          try {
            b.forEach(e => {
              try {
                e.url && !e.incognito && chrome.tabs.sendMessage(e.id, {key:"updateToken", value:settings.token});
              } catch (m) {
                console.log(m);
              }
            });
          } catch (e) {
            console.log(e);
          }
        })) : (settings[a.key] = a.val, chrome.storage.local.set({[a.key]:a.val}));
        break;
      case "getCookie":
        return chrome.cookies.get({url:"https://keepa.com/extension", name:a.key}, b => {
          null == b ? d({value:null, install:installTimestamp}) : d({value:b.value, install:installTimestamp});
        }), !0;
      case "openPage":
        chrome.windows.create({url:a.url, incognito:!0});
        break;
      case "isPro":
        common.stockData ? d({value:common.stockData.pro, stockData:common.stockData, amazonSellerIds:AmazonSellerIds, warehouseSellerIds:WarehouseDealsSellerIds}) : d({value:null});
        break;
      case "getStock":
        return a.getNewId = !1, common.addStockJob(a, b => {
          if (b.errorCode && 0 < b.errorCode && a.cachedStock && 430 != b.errorCode) {
            d(a.cachedStock);
          } else {
            if (5 == b.errorCode || 429 == b.errorCode || 430 == b.errorCode || 9 == b.errorCode) {
              if (9 == b.errorCode || 430 == b.errorCode) {
                a.getNewId = !0;
              }
              setTimeout(() => {
                common.addStockJob(a, d);
              }, 1);
            } else {
              d(b);
            }
          }
        }), !0;
      case "getFilters":
        d({value:cloud.getFilters()});
        break;
      case "isSellerActive":
        lastSellerActivity = Date.now();
        d({});
        break;
      case "isActive":
        c = Date.now();
        6E5 < c - lastContentActivity && webSocketObj.sendPlainMessage({key:"m1", payload:["c0"]});
        lastActivity = lastContentActivity = c;
        d({});
        break;
      case "sendData":
        c = a.val;
        if (null != c.ratings) {
          let b = c.ratings;
          if (1000 > asinCacheSize) {
            if ("f1" == c.key) {
              if (b) {
                let e = b.length;
                for (; e--;) {
                  var g = b[e];
                  null == g || null == g.asin ? b.splice(e, 1) : (g = c.domainId + g.asin + g.ls, asinCache[g] ? b.splice(e, 1) : (asinCache[g] = 1, asinCacheSize++));
                }
                0 < b.length && webSocketObj.sendPlainMessage(c);
              }
            } else {
              webSocketObj.sendPlainMessage(c);
            }
          } else {
            asinCache = {}, asinCacheSize = 0;
          }
        } else {
          webSocketObj.sendPlainMessage(c);
        }
        d({});
        break;
      case "optionalPermissionsRequired":
        d({value:(isChrome || isFirefox || isOpera) && "undefined" === typeof chrome.webRequest});
        break;
      case "optionalPermissionsDenied":
        console.log("optionalPermissionsDenied");
        d({value:!0});
        break;
      case "optionalPermissions":
        return "undefined" === typeof chrome.webRequest && chrome.permissions.request({permissions:["webRequest"]}, function(b) {
          chrome.runtime.lastError ? common.reportBug("permission error", chrome.runtime.lastError) : (d({value:b}), "undefined" != typeof b && (b ? chrome.runtime.reload() : common.reportBug("permission denied")));
        }), !0;
      default:
        d({});
    }
  }
});
try {
  chrome.action.onClicked.addListener(function(a) {
    chrome.tabs.create({url:"https://keepa.com/#!manage"});
  });
} catch (a) {
  console.log(a);
}
try {
  chrome.contextMenus.removeAll(), chrome.contextMenus.create({title:"View products on Keepa", contexts:["page"], id:"keepaContext", documentUrlPatterns:"*://*.amazon.com/* *://*.amzn.com/* *://*.amazon.co.uk/* *://*.amazon.de/* *://*.amazon.fr/* *://*.amazon.it/* *://*.amazon.ca/* *://*.amazon.com.mx/* *://*.amazon.es/* *://*.amazon.co.jp/* *://*.amazon.in/*".split(" ")}), chrome.contextMenus.onClicked.addListener((a, c) => {
    chrome.tabs.sendMessage(c.id, {key:"collectASINs"}, {}, d => {
      "undefined" != typeof d && chrome.tabs.create({url:"https://keepa.com/#!viewer/" + encodeURIComponent(JSON.stringify(d))});
    });
  });
} catch (a) {
  console.error(a);
}
const common = {version:chrome.runtime.getManifest().version, Guid:function() {
  const a = function(d, g, b) {
    return d.length >= g ? d : a(b + d, g, b || " ");
  }, c = function() {
    let d = (new Date()).getTime();
    return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, function(g) {
      const b = (d + 16 * Math.random()) % 16 | 0;
      d = Math.floor(d / 16);
      return ("x" === g ? b : b & 7 | 8).toString(16);
    });
  };
  return {newGuid:function() {
    var d = "undefined" != typeof self.crypto.getRandomValues;
    if ("undefined" != typeof self.crypto && d) {
      d = new self.Uint16Array(16);
      self.crypto.getRandomValues(d);
      var g = "";
      for (e in d) {
        var b = d[e].toString(16);
        b = a(b, 4, "0");
        g += b;
      }
      var e = g;
    } else {
      e = c();
    }
    return e;
  }};
}(), register:async function() {
  chrome.cookies.onChanged.addListener(d => {
    d.removed || null == d.cookie || "keepa.com" != d.cookie.domain || "/extension" != d.cookie.path || ("token" == d.cookie.name ? settings.token != d.cookie.value && 64 == d.cookie.value.length && (settings.token = d.cookie.value, chrome.tabs.query({}, g => {
      try {
        g.forEach(b => {
          try {
            b.url && !b.incognito && chrome.tabs.sendMessage(b.id, {key:"updateToken", value:settings.token});
          } catch (e) {
            console.log(e);
          }
        });
      } catch (b) {
        console.log(b);
      }
    })) : common.set(d.cookie.name, d.cookie.value));
  });
  let a = !1, c = async d => {
    for (let g = 0; g < d.length; g++) {
      const b = d[g];
      try {
        const e = await chrome.cookies.get({url:"https://keepa.com/extension", name:b});
        if (chrome.runtime.lastError && -1 < chrome.runtime.lastError.message.indexOf("No host permission")) {
          a || (a = !0, common.reportBug(null, "extensionPermission restricted ### " + chrome.runtime.lastError.message));
          break;
        }
        null != e && null != e.value && 0 < e.value.length && common.set(b, e.value);
      } catch (e) {
        console.log(e);
      }
    }
  };
  c(settingKeys);
  try {
    const d = await chrome.cookies.get({url:"https://keepa.com/extension", name:"token"});
    if (null != d && 64 == d.value.length) {
      settings.token = d.value, common.set("token", settings.token);
    } else {
      let g = (Date.now() / 1000 | 0) + 31536E3;
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"optOut_crawl", value:"0", secure:!0, expirationDate:g});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"revealStock", value:"1", secure:!0, expirationDate:g});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxType", value:"0", secure:!0, expirationDate:g});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxOfferListing", value:"1", secure:!0, expirationDate:g});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxHorizontal", value:"0", secure:!0, expirationDate:g});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphType", value:"[1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]", secure:!0, expirationDate:g});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphRange", value:"180", secure:!0, expirationDate:g});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"overlayPriceGraph", value:"0", secure:!0, expirationDate:g});
      c(settingKeys);
      common.storage.get("token", function(b) {
        b = b.token;
        settings.token = b && 64 == b.length ? b : common.Guid.newGuid();
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"token", value:settings.token, secure:!0, expirationDate:g});
      });
    }
  } catch (d) {
    common.reportBug(d, "get token cookie");
  }
  isFirefox ? common.set("addonVersionFirefox", common.version) : common.set("addonVersionChrome", common.version);
  try {
    chrome.runtime.setUninstallURL("https://dyn.keepa.com/app/stats/?type=uninstall&version=" + type + "." + common.version);
  } catch (d) {
  }
  webSocketObj.initWebSocket();
}, storage:chrome.storage.local, parseCookieHeader:(a, c) => {
  if (0 < c.indexOf("\n")) {
    c = c.split("\n");
    a: for (var d = 0; d < c.length; ++d) {
      var g = c[d].substring(0, c[d].indexOf(";")), b = g.indexOf("=");
      g = [g.substring(0, b), g.substring(b + 1)];
      if (2 == g.length && "-" != g[1]) {
        for (b = 0; b < a.length; ++b) {
          if (a[b][0] == g[0]) {
            a[b][1] = g[1];
            continue a;
          }
        }
        a.push(g);
      }
    }
  } else {
    if (c = c.substring(0, c.indexOf(";")), d = c.indexOf("="), c = [c.substring(0, d), c.substring(d + 1)], 2 == c.length && "-" != c[1]) {
      for (d = 0; d < a.length; ++d) {
        if (a[d][0] == c[0]) {
          a[d][1] = c[1];
          return;
        }
      }
      a.push(c);
    }
  }
}, stockRequest:[], stockData:null, stockJobQueue:[], addStockJob:(a, c) => {
  a.gid = common.Guid.newGuid().substr(0, 8);
  a.requestType = -1;
  let d = g => {
    common.stockJobQueue.shift();
    c(g);
    0 < common.stockJobQueue.length && (stockDelay ? setTimeout(() => {
      common.processStockJob(common.stockJobQueue[0][0], common.stockJobQueue[0][1]);
    }, stockDelay) : common.processStockJob(common.stockJobQueue[0][0], common.stockJobQueue[0][1]));
  };
  common.stockJobQueue.push([a, d]);
  1 == common.stockJobQueue.length && common.processStockJob(a, d);
}, processStockJob:async(a, c) => {
  var d = Date.now();
  lastActivity = d;
  if (null == common.stockData.stock) {
    console.log("stock retrieval not initialized"), c({error:"stock retrieval not initialized", errorCode:0});
  } else {
    if (0 == common.stockData.stockEnabled[a.domainId]) {
      console.log("stock retrieval not supported for domain"), c({error:"stock retrieval not supported for domain", errorCode:1});
    } else {
      if (!0 === common.stockData.pro || a.force) {
        if (a.maxQty) {
          if (!a.isMAP && common.stockData.stockMaxQty && a.maxQty < common.stockData.stockMaxQty) {
            c({stock:a.maxQty, limit:!1});
            return;
          }
          a.cachedStock = {stock:a.maxQty, limit:!1, isMaxQty:a.maxQty};
        }
        if (null == a.oid) {
          c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " missing oid.", errorCode:12});
        } else {
          if (d = d - lastSellerActivity < sellerLockoutDuration && (!settings.extensionCookies[a.domainId] || a.getNewId), common.stockData.cartDisabled || a.onlyMaxQty && !a.isMAP || d) {
            c({stock:a.maxQty, limit:!1, isMaxQty:a.maxQty});
          } else {
            if (null == a.sellerId) {
              c({error:"Unable to retrieve stock for this offer. ", errorCode:45});
            } else {
              if (a.queue = [async() => {
                let b = !1, e = !1, m = 0, p = cloud.getSessionId(a.cookies);
                p && (b = !0, p != a.session && (e = !0, m = p));
                if (b && e) {
                  var n = structuredClone(common.stockData.addCart);
                  n.isStock = !0;
                  n.userSession = a.session;
                  n.domainId = a.domainId;
                  n.url = "https://" + a.host + n.url.replaceAll("{SESSION_ID}", m).replaceAll("{OFFER_ID}", a.oid).replaceAll("{ADDCART}", encodeURIComponent(common.stockData.stockAdd[a.domainId])).replaceAll("{ASIN}", a.asin);
                  n.language = common.stockData.languageCode[a.domainId];
                  n.referer = common.stockData.isMobile ? "https://" + a.host + "/gp/aw/d/" + a.asin + "/" : a.referer;
                  n.cookies = a.cookies;
                  n.fetch.body = n.fetch.body.replaceAll("{SESSION_ID}", m).replaceAll("{OFFER_ID}", a.oid).replaceAll("{ADDCART}", encodeURIComponent(common.stockData.stockAdd[a.domainId])).replaceAll("{ASIN}", a.asin);
                  requestQueue.enqueue(() => processRequest(n)).then(async() => {
                    const f = n.response?.text;
                    if (null == f) {
                      a.cookies = null, common.stockData.domainId = -1, c({error:"Stock retrieval failed for this offer. Try reloading the page or restarting your browser if the issue persists. ", errorCode:65});
                    } else {
                      try {
                        let l = common.stockData.stockV.replaceAll("{ASIN}", a.asin), k = f.match(new RegExp(l.replaceAll("{SELLER}", a.sellerId)));
                        k || a.sellerId != AmazonSellerIds[a.domainId] || (k = f.match(new RegExp(l.replaceAll("{SELLER}", WarehouseDealsSellerIds[a.domainId]))));
                        let h = f.match(new RegExp(common.stockData.stockLocation)), q = (new RegExp(common.stockData.limit)).test(f);
                        if (k && k[1]) {
                          const r = parseInt(k[2]), t = parseNumberFormat(k[1]);
                          h = h && h[1] ? h[1] : null;
                          c({stock:r, orderLimit:-1, limit:q, price:t, location:h});
                        } else {
                          const r = f.match(/automated access|api-services-support@/);
                          if (r || a.isRetry) {
                            a.cookies = null, delete settings.extensionCookies[a.domainId], await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
                          }
                          r ? (c({error:"Amazon stock retrieval rate limited (bot detection) of offer: " + a.asin + " id: " + a.gid + " offer: " + a.oid, errorCode:5}), console.log("stock retrieval rate limited for offer: ", a.asin + " " + a.oid + " id: " + a.gid + " seller.id " + a.sellerId, f.length)) : c({error:"Stock retrieval failed for this offer. Try reloading the page after a while. ", errorCode:430});
                        }
                      } catch (l) {
                        a.error = l, console.error("request failed", l), a.callback();
                      }
                    }
                  }).catch(f => {
                    a.error = f;
                    console.error("request failed", f);
                    a.callback();
                  });
                } else {
                  common.reportBug(null, "stock session issue: " + b + " " + e + " c: " + JSON.stringify(a.cookies) + " " + JSON.stringify(a)), c({error:"stock session issue: " + b + " " + e, errorCode:4});
                }
              }], a.getNewId && (common.stockData.geoRetry && (delete settings.extensionCookies[a.domainId], await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)})), a.queue.unshift(async() => {
                let b = structuredClone(common.stockData.geo);
                b.userSession = a.session;
                b.isStock = !0;
                b.domainId = a.domainId;
                settings.extensionCookies[a.domainId]?.cookies && (b.cookies = settings.extensionCookies[a.domainId].cookies);
                b.url = "https://" + common.stockData.offerUrl.replace("{ORIGIN}", a.host).replace("{ASIN}", a.asin).replace("{SID}", a.sellerId);
                b.language = common.stockData.languageCode[a.domainId];
                requestQueue.enqueue(async() => processRequest(b)).then(async() => {
                  if (b.response.text.match(common.stockData.sellerIdBBVerify.replace("{SID}", a.sellerId))) {
                    var e = null;
                    for (var m = 0; m < common.stockData.csrfBB.length; m++) {
                      var p = b.response.text.match(new RegExp(common.stockData.csrfBB[m]));
                      if (null != p && p[1]) {
                        e = p[1];
                        break;
                      }
                    }
                    if (e) {
                      a.csrf = e[1];
                      e = null;
                      for (m = 0; m < common.stockData.offerIdBB.length; m++) {
                        if (p = b.response.text.match(new RegExp(common.stockData.offerIdBB[m])), null != p && p[1]) {
                          e = p[1];
                          break;
                        }
                      }
                      e && (a.oid = e, a.callback());
                    }
                  } else {
                    delete settings.extensionCookies[a.domainId], await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)}), c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " mismatch oid.", errorCode:10});
                  }
                }).catch(async e => {
                  a.error = e;
                  delete settings.extensionCookies[a.domainId];
                  await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
                  console.error("request failed", e);
                });
              })), a.callback = () => a.queue.shift()(), settings.extensionCookies[a.domainId] && 432E5 > Date.now() - settings.extensionCookies[a.domainId].createDate) {
                a.cookies = settings.extensionCookies[a.domainId].cookies, a.callback();
              } else {
                var g = common.stockData.zipCodes[a.domainId];
                if (common.stockData.domainId == a.domainId) {
                  a.requestType = 3;
                  let b = structuredClone(common.stockData.addressChange);
                  b.userSession = a.session;
                  b.isStock = !0;
                  b.domainId = a.domainId;
                  b.url = "https://" + a.host + b.url;
                  b.csrf = "";
                  b.language = common.stockData.languageCode[a.domainId];
                  b.fetch.body = b.fetch.body.replace("{ZIPCODE}", g);
                  requestQueue.enqueue(() => processRequest(b)).then(() => {
                    a.cookies = b.response.cookies;
                    a.callback();
                  }).catch(e => {
                    a.error = e;
                    c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:73});
                    console.error("request failed", e);
                  });
                } else {
                  let b = structuredClone(common.stockData.geo);
                  b.userSession = a.session;
                  b.isStock = !0;
                  b.url = "https://" + a.host + b.url;
                  b.language = common.stockData.languageCode[a.domainId];
                  b.domainId = a.domainId;
                  requestQueue.enqueue(() => processRequest(b)).then(async() => {
                    let e = b.response.text, m = e?.match(new RegExp(common.stockData.csrfGeo));
                    if (null != m) {
                      b.csrf = m[1];
                      let p = structuredClone(common.stockData.toaster);
                      p.userSession = a.session;
                      p.isStock = !0;
                      p.url = "https://" + a.host + p.url.replace("{TIME_MS}", Date.now());
                      p.domainId = a.domainId;
                      p.language = common.stockData.languageCode[a.domainId];
                      p.cookies = b.response.cookies;
                      p.csrf = b.csrf;
                      requestQueue.enqueue(() => processRequest(p)).then(() => {
                        let n = structuredClone(common.stockData.setAddress);
                        n.userSession = a.session;
                        n.domainId = a.domainId;
                        n.isStock = !0;
                        n.url = "https://" + a.host + n.url;
                        n.language = common.stockData.languageCode[a.domainId];
                        n.csrf = b.csrf;
                        n.cookies = p.response.cookies;
                        requestQueue.enqueue(() => processRequest(n)).then(() => {
                          let f = structuredClone(common.stockData.addressChange);
                          f.userSession = a.session;
                          f.domainId = a.domainId;
                          n.isStock = !0;
                          f.url = "https://" + a.host + f.url;
                          f.language = common.stockData.languageCode[a.domainId];
                          e = n.response.text;
                          let l = e?.match(new RegExp(common.stockData.csrfSetAddress));
                          null != l && (f.csrf = l[1]);
                          f.cookies = n.response.cookies;
                          f.fetch.body = f.fetch.body.replace("{ZIPCODE}", g);
                          a.requestType = 3;
                          requestQueue.enqueue(() => processRequest(f)).then(() => {
                            a.cookies = f.response.cookies;
                            a.callback();
                          }).catch(async k => {
                            a.error = k;
                            console.error("request failed", k);
                            delete settings.extensionCookies[a.domainId];
                            await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
                            c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:72});
                          });
                        }).catch(async f => {
                          a.error = f;
                          console.error("request failed", f);
                          delete settings.extensionCookies[a.domainId];
                          await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
                          c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:71});
                        });
                      }).catch(async n => {
                        a.error = n;
                        console.error("request failed", n);
                        delete settings.extensionCookies[a.domainId];
                        await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
                        c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:70});
                      });
                    } else {
                      if (429 == b.response.status) {
                        const p = a.isMainRetry;
                        setTimeout(() => {
                          p ? c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:429}) : (a.isMainRetry = !0, common.addStockJob(a, c));
                        }, 1156);
                        p || (common.stockJobQueue.shift(), 0 < common.stockJobQueue.length && common.processStockJob(common.stockJobQueue[0][0], common.stockJobQueue[0][1]));
                      } else {
                        delete settings.extensionCookies[a.domainId], await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)}), c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:7});
                      }
                    }
                  }).catch(async e => {
                    a.error = e;
                    console.error("request failed " + a.url, e);
                    delete settings.extensionCookies[a.domainId];
                    await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
                    c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:74});
                  });
                }
              }
            }
          }
        }
      } else {
        console.log("stock retrieval not pro"), c({error:"stock retrieval failed, not subscribed", errorCode:2});
      }
    }
  }
}, set:function(a, c, d) {
  const g = {};
  g[a] = c;
  common.storage.set(g, d);
}, lastBugReport:0, reportBug:function(a, c, d) {
  console.error(a, c);
  const g = a ? a : Error();
  common.storage.get(["token"], function(b) {
    var e = Date.now();
    if (!(12E5 > e - common.lastBugReport || /(dead object)|(Script error)|(setUninstallURL)|(File error: Corrupted)|(operation is insecure)|(\.location is null)/i.test(a))) {
      common.lastBugReport = e;
      e = "";
      var m = common.version;
      c = c || "";
      try {
        if (e = g.stack.split("\n").splice(1).join("&ensp;&lArr;&ensp;"), !/(keepa|content)\.js/.test(e) || e.startsWith("https://www.amazon") || e.startsWith("https://smile.amazon") || e.startsWith("https://sellercentral")) {
          return;
        }
      } catch (n) {
      }
      try {
        e = e.replace(RegExp("chrome-extension://.*?/content/", "g"), "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
      } catch (n) {
      }
      if ("object" == typeof a) {
        try {
          a = a instanceof Error ? a.toString() : JSON.stringify(a);
        } catch (n) {
        }
      }
      null == d && (d = {exception:a, additional:c, url:chrome.runtime.id, stack:e});
      d.keepaType = type;
      d.version = m;
      var p = JSON.stringify(d);
      setTimeout(function() {
        fetch("https://dyn.keepa.com/service/bugreport/?user=" + b.token + "&type=" + browserType + "&version=" + m + "&delayed=" + (delayedFetch ? 1 : 0) + "&timeout=" + sellerLockoutDuration, {method:"POST", body:p, mode:"cors", cache:"no-cache", credentials:"same-origin", redirect:"error"});
      }, 50);
    }
  });
}};
let webSocketObj = {server:["wss://dyn-2.keepa.com", "wss://dyn.keepa.com"], serverIndex:0, lastDomain:0, clearTimeout:0, webSocket:null, sendPlainMessage:async function(a) {
  isMobile || (a = JSON.stringify(a), webSocketObj.webSocket.send(await compress(a, !1)));
}, sendMessage:async function(a) {
  isMobile || ((a = await compress(JSON.stringify(a), !1)) && 1 == webSocketObj.webSocket.readyState && webSocketObj.webSocket.send(a), clearLog && console.clear());
}, initWebSocket:function() {
  if (!isMobile) {
    var a = settings.optOut_crawl;
    offscreenSupported || (a = "1");
    if (settings.token && 64 == settings.token.length) {
      const c = function() {
        if (null == webSocketObj.webSocket || 1 != webSocketObj.webSocket.readyState) {
          webSocketObj.serverIndex %= webSocketObj.server.length;
          if ("undefined" == typeof a || "undefined" == a || null == a || "null" == a) {
            a = "0";
          }
          const d = webSocketObj.server[webSocketObj.serverIndex] + "/apps/cloud/?app=" + type + "&version=" + common.version + "&i=" + installTimestamp + "&mf=3&optOut=" + a + "&time=" + Date.now() + "&id=" + chrome.runtime.id + "&wr=" + (hasWebRequestPermission ? 1 : 0) + "&offscreen=" + (offscreenSupported ? 1 : 0) + "&mobile=" + isMobile, g = new WebSocket(d, settings.token);
          g.binaryType = "arraybuffer";
          g.onmessage = async function(b) {
            if (0 != b.data.byteLength) {
              b = b.data;
              var e = null;
              b instanceof ArrayBuffer && (b = await decompress(b, !0));
              try {
                e = JSON.parse(b);
              } catch (m) {
                common.reportBug(m, b);
                return;
              } finally {
                b = b = null;
              }
              lastActivity = Date.now();
              108 != e.status && ("" == e.key ? common.stockData.domainId = e.domainId : 108108 == e.timeout ? (e.stockDataV3 && (common.stockData = e.stockDataV3, common.stockData.cookieOrder && (cookieOrder = common.stockData.cookieOrder), e.stockDataV3.amazonIds && (AmazonSellerIds = e.stockDataV3.amazonIds), e.stockDataV3.warehouseIds && (WarehouseDealsSellerIds = e.stockDataV3.warehouseIds), common.stockData.sellerLockoutDuration && (sellerLockoutDuration = common.stockData.sellerLockoutDuration), 
              common.stockData.delayedFetch && (delayedFetch = common.stockData.delayedFetch), common.stockData.ignoreWebRequest && (hasWebRequestPermission = !1), hasWebRequestPermission && chrome.webRequest?.onHeadersReceived.addListener(m => {
                if (m.initiator == serviceWorkerUrl) {
                  var p = m.responseHeaders;
                  m = m.url;
                  var n = [];
                  for (let f = 0; f < p.length; ++f) {
                    "set-cookie" == p[f].name.toLowerCase() && n.push(parseSetCookieString(p[f].value));
                  }
                  interceptedExtensionCookies[m].resolve(n);
                }
              }, {urls:["<all_urls>"]}, ["responseHeaders", "extraHeaders"]), common.stockData.stockDelay && (stockDelay = common.stockData.stockDelay)), "undefined" != typeof e.keepaBoxPlaceholder && common.set("keepaBoxPlaceholder", e.keepaBoxPlaceholder), "undefined" != typeof e.keepaBoxPlaceholderBackup && common.set("keepaBoxPlaceholderBackup", e.keepaBoxPlaceholderBackup), "undefined" != typeof e.keepaBoxPlaceholderBackupClass && common.set("keepaBoxPlaceholderBackupClass", e.keepaBoxPlaceholderBackupClass), 
              "undefined" != typeof e.keepaBoxPlaceholderAppend && common.set("keepaBoxPlaceholderAppend", e.keepaBoxPlaceholderAppend), "undefined" != typeof e.keepaBoxPlaceholderBackupAppend && common.set("keepaBoxPlaceholderBackupAppend", e.keepaBoxPlaceholderBackupAppend)) : (e.domainId && (webSocketObj.lastDomain = e.domainId), cloud.onMessage(e)));
            }
          };
          g.onclose = function(b) {
            setTimeout(() => {
              36E5 < Date.now() - startedAt && 180000 < Date.now() - lastActivity ? chrome.runtime.reload() : c();
            }, 18E4 * Math.random());
          };
          g.onerror = function(b) {
            webSocketObj.serverIndex++;
            g.close();
          };
          g.onopen = function() {
            cloud.abortJob(414, null, null);
          };
          webSocketObj.webSocket = g;
        }
      };
      c();
    }
  }
}}, cloud = function() {
  function a(f, l) {
    if (null != f) {
      f.sent = !0;
      f = {key:f.key, messageId:f.messageId, sessionId:b(settings.extensionCookies[f.domainId]?.cookies), payload:[], status:200};
      for (let k in l) {
        f[k] = l[k];
      }
      return f;
    }
  }
  async function c(f) {
    if (-1 == f.url.indexOf("keepa.com/")) {
      f.request.cookies = settings.extensionCookies[f.domainId]?.cookies;
      try {
        f.request.userSession = "guest";
      } catch (l) {
      }
    }
    g(f, function(l) {
      let k = {payload:[]};
      if (l) {
        if (l.match(n)) {
          k.status = 403;
        } else {
          if (f.contentFilters && 0 < f.contentFilters.length) {
            for (let h in f.contentFilters) {
              let q = l.match(new RegExp(f.contentFilters[h]));
              if (q) {
                k.payload[h] = q[1].replace(/\n/g, "");
              } else {
                k.status = 305;
                k.payload[h] = l;
                break;
              }
            }
          } else {
            k.payload = [l];
          }
        }
      }
      "undefined" == typeof f.sent && webSocketObj.sendMessage(a(f, k));
    });
  }
  async function d(f) {
    f.request.cookies = settings.extensionCookies[f.domainId]?.cookies;
    f.request.userSession = "guest";
    g(f, function(l) {
      null == l && "undefined" == typeof f.sent && webSocketObj.sendMessage(a(f, {payload:[], status:305}));
    });
  }
  function g(f, l) {
    1 == f.httpMethod && f.scrapeFilters && 0 < f.scrapeFilters.length && (p = {scrapeFilters:f.scrapeFilters, dbg1:f.dbg1, dbg2:f.dbg2, domainId:f.domainId});
    f.request.domainId = f.domainId;
    requestQueue.enqueue(() => processRequest(f.request)).then(async() => {
      try {
        "object" === typeof f.request.urls && (f.request.response.text = "", f.request.urls.forEach(h => {
          h = f.request.responses[h];
          200 == h.status ? null != h.text && 10 < h.text.length && (f.request.response.text += h.text) : m(h.status, null, f);
        }));
      } catch (h) {
        console.error(h);
      }
      let k = f?.request?.response?.text;
      if (offscreenSupported && null != k && "" != k) {
        if ("o0" == f.key) {
          l(k);
        } else {
          k = k.replace(/src=".*?"/g, 'src=""');
          f.block && (k = k.replace(new RegExp(f.block, "g"), ""));
          try {
            await setupOffscreenDocument(), chrome.runtime.sendMessage({type:"parse", target:"offscreen", data:{content:k, message:f, stockData:common.stockData}}, h => {
              h = h.response;
              h = a(f, h);
              webSocketObj.sendMessage(h);
              chrome.offscreen.closeDocument();
            });
          } catch (h) {
            common.reportBug(h), f.request.isStock ? l(null) : m(410, null, f);
          }
        }
      } else {
        l(null);
      }
    }).catch(k => {
      console.error("request failed", k);
      f.request.error = k;
      f.request.isStock ? l(null) : m(410, null, f);
    });
  }
  function b(f) {
    try {
      if (f) {
        for (let l = 0; l < f.length; ++l) {
          let k = f[l];
          if ("session-id" == k.name && 16 < k.value.length && 65 > k.value.length) {
            return k.value;
          }
        }
      }
    } catch (l) {
      console.log(l);
    }
    return "";
  }
  async function e(f) {
    delete settings.extensionCookies["" + f];
    await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
  }
  function m(f, l, k) {
    if (null != k) {
      try {
        if ("undefined" != typeof k.sent) {
          return;
        }
        const h = a(k, {});
        l && (h.payload = l);
        h.status = f;
        webSocketObj.sendMessage(h);
        chrome.offscreen.closeDocument();
      } catch (h) {
        common.reportBug(h, "abort");
      }
    }
    clearLog && console.clear();
  }
  let p = null;
  const n = /automated access|api-services-support@/;
  return {onMessage:function(f) {
    switch(f.key) {
      case "update":
        chrome.runtime.requestUpdateCheck(function(l, k) {
          "update_available" == l && chrome.runtime.reload();
        });
        break;
      case "o0":
        c(f);
        break;
      case "o1":
        d(f);
        break;
      case "o2":
        e(f.domainId);
        break;
      case "1":
        chrome.runtime.reload();
    }
  }, endSession:e, getSessionId:b, getOutgoingMessage:a, getFilters:function() {
    return p;
  }, abortJob:m};
}(), getTldByDomain = a => {
  a = parseInt(a);
  switch(a) {
    case 1:
      return "com";
    case 2:
      return "co.uk";
    case 3:
      return "de";
    case 4:
      return "fr";
    case 5:
      return "co.jp";
    case 6:
      return "ca";
    case 7:
      return "cn";
    case 8:
      return "it";
    case 9:
      return "es";
    case 10:
      return "in";
    case 11:
      return "com.mx";
    case 12:
      return "com.br";
    case 13:
      return "com.au";
    case 14:
      return "nl";
    default:
      return "com";
  }
}, creating;
async function setupOffscreenDocument() {
  const a = chrome.runtime.getURL("offscreen.html");
  chrome.runtime.getContexts && 0 < (await chrome.runtime.getContexts({contextTypes:["OFFSCREEN_DOCUMENT"], documentUrls:[a]})).length || (creating ||= chrome.offscreen.createDocument({url:"offscreen.html", reasons:["DOM_PARSER"], justification:"Extracting information from HTML"}).then(c => {
    creating = null;
    return c;
  }), await creating);
}
;
