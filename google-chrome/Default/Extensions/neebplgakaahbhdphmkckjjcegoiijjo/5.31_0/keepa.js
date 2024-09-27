let clearLog = !0;
const offscreenSupported = "undefined" !== typeof chrome.offscreen;
let lastActivity = 0, sellerLockoutDuration = 60000, delayedFetch = !1, ignoreResponseCookies = !1, stockDelay = 0, startedAt = new Date();
setInterval(() => {
  3E5 < Date.now() - lastActivity && chrome.runtime.reload();
}, 144E5);
let hasWebRequestPermission = !!chrome.webRequest, interceptedExtensionCookies = {}, serviceWorkerUrl = chrome.runtime.getURL("").replace(/\/$/, "");
async function waitForCookies(a, c) {
  const e = interceptedExtensionCookies[a]?.promise;
  return new Promise(f => {
    const b = setTimeout(() => {
      console.log("Timeout reached without cookies");
      f(null);
    }, c);
    e || (clearTimeout(b), f(null));
    e.then(d => {
      clearTimeout(b);
      f(d);
    });
  });
}
async function handleGuestSession(a, c) {
  let e = null;
  try {
    e = cloud.getSessionId(settings.extensionCookies[a.domainId]?.cookies);
  } catch (f) {
    console.error(f);
  }
  await swapCookies(a.url, c, a.userCookies);
  delete settings.userCookies["" + a.domainId];
  a.response.cookies = null;
  a.response.text = null;
  delete settings.extensionCookies["" + a.domainId];
  common.reportBug(null, generateBugReport("new s is u s", e, a));
  a.response.status = 900;
}
function updateCookies(a, c) {
  Array.isArray(a) || (a = []);
  Array.isArray(c) || (c = []);
  const e = new Map(a.map(b => [b.name, b])), f = new Set(c.filter(b => "-" !== b.value && "" !== b.value && "delete" !== b.value).map(b => b.name));
  c.forEach(b => {
    if (f.has(b.name)) {
      "-" !== b.value && "" !== b.value && "delete" !== b.value && e.set(b.name, b);
    } else {
      const d = e.get(b.name);
      d && d.secure === b.secure && d.path === b.path ? "" === b.value || "-" === b.value || "delete" === b.value ? e.delete(b.name) : e.set(b.name, b) : "" !== b.value && "-" !== b.value && "delete" !== b.value && e.set(b.name, b);
    }
  });
  return Array.from(e.values());
}
function parseSetCookieString(a) {
  a = a.split(";").map(b => b.trim());
  const [c, e] = a[0].split("="), f = {name:c, value:e, domain:"", path:"", secure:!1, hostOnly:!1, httpOnly:!1, session:!1, storeId:"0", sameSite:"unspecified", expirationDate:0};
  a.slice(1).forEach(b => {
    const [d, l] = b.split("=");
    switch(d.toLowerCase()) {
      case "domain":
        f.domain = l;
        break;
      case "path":
        f.path = l;
        break;
      case "expires":
        f.expirationDate = (new Date(l)).getTime() / 1000;
        break;
      case "secure":
        f.secure = !0;
        break;
      case "hostOnly":
        f.hostOnly = !0;
        break;
      case "httpOnly":
        f.httpOnly = !0;
        break;
      case "session":
        f.session = !0;
        break;
      case "sameSite":
        f.sameSite = !0;
    }
  });
  return f;
}
let AmazonSellerIds = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" "), WarehouseDealsSellerIds = [];
const userAgentData = navigator.userAgentData?.brands.find(({brand:a}) => "Google Chrome" === a), settingKeys = "optOut_crawl revealStock s_boxOfferListing s_boxType s_boxHorizontal webGraphType webGraphRange overlayPriceGraph lastActivated".split(" "), isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent), userAgent = navigator.userAgent.toLowerCase(), isFirefox = userAgent.includes("firefox"), isEdge = userAgent.includes("edge/"), isSafari = /Apple Computer/.test(navigator.vendor) && 
userAgent.includes("safari"), isOpera = userAgent.includes("opera") || userAgent.includes("opr/"), isChrome = !isOpera && !isFirefox && !isEdge && !isSafari, type = isChrome ? "keepaChrome" : isOpera ? "keepaOpera" : isSafari ? "keepaSafari" : isEdge ? "keepaEdge" : "keepaFirefox", browserType = isFirefox ? "Firefox" : isSafari ? "Safari" : isChrome ? "Chrome" : isOpera ? "Opera" : isEdge ? "Edge" : "Unknown";
let installTimestamp = 0;
const runningSince = Date.now();
let settings = {}, cookieOrder = "session-id session-id-time i18n-prefs skin ubid-main sp-cdn session-token".split(" ");
const cookieToString = a => {
  let c = "", e = "";
  var f = {};
  for (let b in a) {
    const d = a[b];
    f[d.name] = d;
  }
  a = [];
  for (let b in cookieOrder) {
    f[cookieOrder[b]] && a.push(f[cookieOrder[b]]);
  }
  for (let b in cookieOrder) {
    delete f[cookieOrder[b]];
  }
  for (let b in f) {
    a.push(f[b]);
  }
  for (let b in a) {
    f = a[b], "-" != f.value && (c += e + f.name + "=" + f.value + ";", e = " ");
  }
  return c;
};
function generateBugReport(a, c, e) {
  return (new Date()).toISOString().substring(0, 19) + ` # ${a} ! ${c} --- ${e.userSession} ${e.url}` + ` status: ${e.response.status}` + ` webreq: ${hasWebRequestPermission}` + ` sc active: ${0 == lastSellerActivity ? "never" : (new Date(lastSellerActivity)).toISOString().substring(0, 19)}` + ` c active: ${0 == lastContentActivity ? "never" : (new Date(lastContentActivity)).toISOString().substring(0, 19)}`;
}
async function updateLocalStorage() {
  await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies), userCookies:await compressObject(settings.userCookies)});
}
const swapCookies = async(a, c, e) => {
  cloud.getSessionId(c);
  cloud.getSessionId(e);
  let f = null != e ? new Set(e.map(d => d.name)) : null, b = [];
  if (null != c) {
    for (let d of c) {
      null != e && f.has(d.name) || (delete d.hostOnly, delete d.session, b.push(chrome.cookies.remove({url:a + d.path, name:d.name})));
    }
  }
  if (null != e) {
    for (let d of e) {
      delete d.hostOnly, delete d.session, d.url = a, b.push(chrome.cookies.set(d));
    }
  }
  await Promise.all(b).catch(d => {
    setTimeout(() => {
      common.reportBug(d, "Error in cookie swap.");
    }, 1);
  });
}, DNR = (() => {
  let a = 100;
  const c = f => 0 === f.length ? Promise.resolve() : chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:f}), e = async() => {
    let f = [], b = chrome.declarativeNetRequest.getSessionRules();
    b.then(d => d.forEach(l => {
      f.push(l.id);
    }));
    await b;
    return c(f);
  };
  (async() => {
    await e();
  })();
  return {addSessionRules:f => {
    let b = [];
    f.forEach(d => {
      const l = ++a;
      d.id = l;
      b.push(l);
    });
    return [chrome.declarativeNetRequest.updateSessionRules({addRules:f}), b];
  }, deleteSessionRules:c, deleteAllRules:e};
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
    return new Promise((c, e) => {
      super.enqueue({action:a, resolve:c, reject:e});
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
        var e = parseInt(c / 1000), f = new URL(a.url);
        a.response = {headers:{}, text:null};
        "undefined" === typeof a.cookies && (a.cookies = []);
        a.userCookies = null;
        var b = null != a.cookies ? cookieToString(a.cookies) : null;
        c = hasWebRequestPermission || !0 === a.ignoreCookies && null != b && 8 < b.length;
        for (let n = 0; n < a.dnr.length; n++) {
          const g = a.dnr[n];
          g.priority = 108108;
          g.condition && (-1 < a.url.indexOf("amazon.") ? g.condition.urlFilter = "||amazon." + getTldByDomain(a.domainId) : g.condition.urlFilter = a.url, g.condition.initiatorDomains = [chrome.runtime.id], delete g.condition.tabIds);
          let m = !1;
          for (let k = 0; k < g.action.requestHeaders.length; k++) {
            const h = g.action.requestHeaders[k];
            "set" == h.operation && ("cookie" == h.header.toLowerCase() ? (null != b ? h.value = h.value.replace("{COOKIE}", b) : (delete h.value, h.operation = "remove"), m = !0) : (h.value = h.value.replace("{ORIGIN}", a.originHost ? a.originHost : f.host), a.language && (h.value = h.value.replace("{LANG}", a.language)), a.referer && (h.value = h.value.replace("{REFERER}", a.referer)), a.csrf && (h.value = h.value.replace("{CSRF}", a.csrf)), a.atcCsrf && (h.value = h.value.replace("{ATCCSRF}", 
            a.atcCsrf)), a.slateToken && (h.value = h.value.replace("{STOKEN}", a.slateToken))));
          }
          a.isGuest && !m && "modifyHeaders" == g.action.type && (null != b && 0 < a.cookies.length ? g.action.requestHeaders.push({header:"Cookie", operation:"set", value:b}) : g.action.requestHeaders.push({header:"Cookie", operation:"remove"}));
          a.isGuest && c && (g.action.responseHeaders = [{header:"Set-Cookie", operation:"remove"}]);
        }
        try {
          try {
            await DNR.deleteAllRules();
          } catch (m) {
            common.reportBug(m, "Error deleteAllRules.");
            return;
          }
          if (a.isGuest) {
            a.userSession = "";
            var d = {excludedInitiatorDomains:[chrome.runtime.id], isUrlFilterCaseSensitive:!1, urlFilter:"||amazon." + getTldByDomain(a.domainId), resourceTypes:"main_frame sub_frame csp_report font image media object other ping script stylesheet webbundle websocket webtransport xmlhttprequest".split(" ")};
            a.userCookies = await chrome.cookies.getAll({url:a.url});
            if (0 < a.userCookies.length) {
              var l = cloud.getSessionId(a.userCookies);
              if (l && 0 < l.length) {
                if (cloud.getSessionId(a.cookies) == l) {
                  throw "pre r; u s is r c s: " + l + " : " + a.userSession + " - " + a.url + "  sc active: " + (0 == lastSellerActivity ? "never" : (new Date(lastSellerActivity)).toISOString().substring(0, 19)) + " c active: " + (0 == lastContentActivity ? "never" : (new Date(lastContentActivity)).toISOString().substring(0, 19));
                }
                a.userSession = l;
              }
              c || a.dnr.push({priority:108107, action:{type:"modifyHeaders", requestHeaders:[{header:"Cookie", operation:"set", value:cookieToString(a.userCookies)}], responseHeaders:[{header:"Set-Cookie", operation:"remove"}]}, condition:d});
            } else {
              c || a.dnr.push({priority:108107, action:{type:"modifyHeaders", requestHeaders:[{header:"Cookie", operation:"remove"}], responseHeaders:[{header:"Set-Cookie", operation:"remove"}]}, condition:d});
            }
          }
          const [n, g] = DNR.addSessionRules(a.dnr);
          try {
            await n;
          } catch (m) {
            common.reportBug(m, "Error dnrPromise.");
            return;
          }
          var p = "object" === typeof a.urls;
          d = null;
          try {
            if (a.isGuest && (settings.userCookies["" + a.domainId] = a.userCookies, await chrome.storage.local.set({userCookies:await compressObject(settings.userCookies)}), !c)) {
              l = [];
              if (null != a.cookies) {
                for (f = 0; f < a.cookies.length; ++f) {
                  let k = a.cookies[f];
                  try {
                    k.expirationDate = Number(e + 180 + ".108108");
                  } catch (h) {
                    console.error(h);
                  }
                  "sp-cdn" != k.name && l.push(k);
                }
              } else {
                l = null;
              }
              await swapCookies(a.url, a.userCookies, l);
            }
            let m = k => {
              hasWebRequestPermission && (interceptedExtensionCookies[k] = {promise:null, resolve:null}, interceptedExtensionCookies[k].promise = new Promise(h => {
                interceptedExtensionCookies[k].resolve = h;
              }), setTimeout(() => {
                delete interceptedExtensionCookies[k];
              }, 60000));
            };
            if (p) {
              a.url = a.urls[0];
              a.urls.forEach(h => m(h));
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
              m(a.url);
              d = await fetch(a.url, a.fetch);
              if (!delayedFetch || c) {
                a.response.text = await d.text();
              }
              for (let k of d.headers.entries()) {
                a.response.headers[k[0]] = k[1];
              }
              a.response.status = d.status;
            }
          } catch (m) {
          } finally {
            delete a.dnr;
            delete a.fetch;
            if (a.isGuest) {
              let m = await chrome.cookies.getAll({url:a.url}), k = cloud.getSessionId(m);
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
                  p == a.userSession || k == p ? await handleGuestSession(a, m) : "" != p ? settings.extensionCookies["" + a.domainId] = {cookies:a.response.cookies, createDate:Date.now()} : delete settings.extensionCookies["" + a.domainId];
                } else {
                  a.response.cookies = a.cookies;
                }
              } else {
                a.response.cookies = m, k != a.userSession || "" == k && "" == a.userSession ? ("" != k ? settings.extensionCookies["" + a.domainId] = {cookies:a.response.cookies, createDate:Date.now()} : delete settings.extensionCookies["" + a.domainId], await swapCookies(a.url, a.response.cookies, a.userCookies)) : await handleGuestSession(a, m);
              }
            }
            delete settings.userCookies["" + a.domainId];
            await updateLocalStorage();
            await DNR.deleteSessionRules(g);
            delayedFetch && !c && null != d && (a.response.text = await d.text());
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
        const e = "https://www.amazon." + getTldByDomain(a);
        await swapCookies(e, settings.extensionCookies[a]?.cookies || [], c);
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
  let e = c.writable.getWriter();
  e.write(a);
  e.close();
  return await (new Response(c.readable)).arrayBuffer().then(function(f) {
    return (new TextDecoder()).decode(f);
  });
}
async function compress(a, c) {
  c = new CompressionStream("deflate" + (c ? "-raw" : ""));
  let e = c.writable.getWriter();
  e.write((new TextEncoder()).encode(a));
  e.close();
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
chrome.runtime.onMessage.addListener((a, c, e) => {
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
            b.forEach(d => {
              try {
                d.url && !d.incognito && chrome.tabs.sendMessage(d.id, {key:"updateToken", value:settings.token});
              } catch (l) {
                console.log(l);
              }
            });
          } catch (d) {
            console.log(d);
          }
        })) : (settings[a.key] = a.val, chrome.storage.local.set({[a.key]:a.val}));
        break;
      case "getCookie":
        return chrome.cookies.get({url:"https://keepa.com/extension", name:a.key}, b => {
          null == b ? e({value:null, install:installTimestamp}) : e({value:b.value, install:installTimestamp});
        }), !0;
      case "openPage":
        chrome.windows.create({url:a.url, incognito:!0});
        break;
      case "isPro":
        common.stockData ? e({value:common.stockData.pro, stockData:common.stockData, amazonSellerIds:AmazonSellerIds, warehouseSellerIds:WarehouseDealsSellerIds}) : e({value:null});
        break;
      case "getStock":
        return a.getNewId = !1, common.addStockJob(a, b => {
          if (b.errorCode && 0 < b.errorCode && a.cachedStock && 430 != b.errorCode) {
            e(a.cachedStock);
          } else {
            if (5 == b.errorCode || 429 == b.errorCode || 430 == b.errorCode || 9 == b.errorCode) {
              if (9 == b.errorCode || 430 == b.errorCode) {
                a.getNewId = !0;
              }
              setTimeout(() => {
                common.addStockJob(a, e);
              }, 1);
            } else {
              e(b);
            }
          }
        }), !0;
      case "getFilters":
        e({value:cloud.getFilters()});
        break;
      case "isSellerActive":
        lastSellerActivity = Date.now();
        e({});
        break;
      case "isActive":
        c = Date.now();
        6E5 < c - lastContentActivity && webSocketObj.sendPlainMessage({key:"m1", payload:["c0"]});
        lastActivity = lastContentActivity = c;
        e({});
        break;
      case "sendData":
        c = a.val;
        if (null != c.ratings) {
          let b = c.ratings;
          if (1000 > asinCacheSize) {
            if ("f1" == c.key) {
              if (b) {
                let d = b.length;
                for (; d--;) {
                  var f = b[d];
                  null == f || null == f.asin ? b.splice(d, 1) : (f = c.domainId + f.asin + f.ls, asinCache[f] ? b.splice(d, 1) : (asinCache[f] = 1, asinCacheSize++));
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
        e({});
        break;
      case "optionalPermissionsRequired":
        e({value:(isChrome || isFirefox || isOpera) && "undefined" === typeof chrome.webRequest});
        break;
      case "optionalPermissionsDenied":
        console.log("optionalPermissionsDenied");
        e({value:!0});
        break;
      case "optionalPermissions":
        return "undefined" === typeof chrome.webRequest && chrome.permissions.request({permissions:["webRequest"]}, function(b) {
          chrome.runtime.lastError ? common.reportBug("permission error", chrome.runtime.lastError) : (e({value:b}), "undefined" != typeof b && (b ? chrome.runtime.reload() : common.reportBug("permission denied")));
        }), !0;
      default:
        e({});
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
    chrome.tabs.sendMessage(c.id, {key:"collectASINs"}, {}, e => {
      "undefined" != typeof e && chrome.tabs.create({url:"https://keepa.com/#!viewer/" + encodeURIComponent(JSON.stringify(e))});
    });
  });
} catch (a) {
  console.error(a);
}
const common = {version:chrome.runtime.getManifest().version, Guid:function() {
  const a = function(e, f, b) {
    return e.length >= f ? e : a(b + e, f, b || " ");
  }, c = function() {
    let e = (new Date()).getTime();
    return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, function(f) {
      const b = (e + 16 * Math.random()) % 16 | 0;
      e = Math.floor(e / 16);
      return ("x" === f ? b : b & 7 | 8).toString(16);
    });
  };
  return {newGuid:function() {
    var e = "undefined" != typeof self.crypto.getRandomValues;
    if ("undefined" != typeof self.crypto && e) {
      e = new self.Uint16Array(16);
      self.crypto.getRandomValues(e);
      var f = "";
      for (d in e) {
        var b = e[d].toString(16);
        b = a(b, 4, "0");
        f += b;
      }
      var d = f;
    } else {
      d = c();
    }
    return d;
  }};
}(), register:async function() {
  chrome.cookies.onChanged.addListener(e => {
    e.removed || null == e.cookie || "keepa.com" != e.cookie.domain || "/extension" != e.cookie.path || ("token" == e.cookie.name ? settings.token != e.cookie.value && 64 == e.cookie.value.length && (settings.token = e.cookie.value, chrome.tabs.query({}, f => {
      try {
        f.forEach(b => {
          try {
            b.url && !b.incognito && chrome.tabs.sendMessage(b.id, {key:"updateToken", value:settings.token});
          } catch (d) {
            console.log(d);
          }
        });
      } catch (b) {
        console.log(b);
      }
    })) : common.set(e.cookie.name, e.cookie.value));
  });
  let a = !1, c = async e => {
    for (let f = 0; f < e.length; f++) {
      const b = e[f];
      try {
        const d = await chrome.cookies.get({url:"https://keepa.com/extension", name:b});
        if (chrome.runtime.lastError && -1 < chrome.runtime.lastError.message.indexOf("No host permission")) {
          a || (a = !0, common.reportBug(null, "extensionPermission restricted ### " + chrome.runtime.lastError.message));
          break;
        }
        null != d && null != d.value && 0 < d.value.length && common.set(b, d.value);
      } catch (d) {
        console.log(d);
      }
    }
  };
  c(settingKeys);
  try {
    const e = await chrome.cookies.get({url:"https://keepa.com/extension", name:"token"});
    if (null != e && 64 == e.value.length) {
      settings.token = e.value, common.set("token", settings.token);
    } else {
      let f = (Date.now() / 1000 | 0) + 31536E3;
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"optOut_crawl", value:"0", secure:!0, expirationDate:f});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"revealStock", value:"1", secure:!0, expirationDate:f});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxType", value:"0", secure:!0, expirationDate:f});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxOfferListing", value:"1", secure:!0, expirationDate:f});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxHorizontal", value:"0", secure:!0, expirationDate:f});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphType", value:"[1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]", secure:!0, expirationDate:f});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphRange", value:"180", secure:!0, expirationDate:f});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"overlayPriceGraph", value:"0", secure:!0, expirationDate:f});
      c(settingKeys);
      common.storage.get("token", function(b) {
        b = b.token;
        settings.token = b && 64 == b.length ? b : common.Guid.newGuid();
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"token", value:settings.token, secure:!0, expirationDate:f});
      });
    }
  } catch (e) {
    common.reportBug(e, "get token cookie");
  }
  isFirefox ? common.set("addonVersionFirefox", common.version) : common.set("addonVersionChrome", common.version);
  try {
    chrome.runtime.setUninstallURL("https://dyn.keepa.com/app/stats/?type=uninstall&version=" + type + "." + common.version);
  } catch (e) {
  }
  webSocketObj.initWebSocket();
}, storage:chrome.storage.local, parseCookieHeader:(a, c) => {
  if (0 < c.indexOf("\n")) {
    c = c.split("\n");
    a: for (var e = 0; e < c.length; ++e) {
      var f = c[e].substring(0, c[e].indexOf(";")), b = f.indexOf("=");
      f = [f.substring(0, b), f.substring(b + 1)];
      if (2 == f.length && "-" != f[1]) {
        for (b = 0; b < a.length; ++b) {
          if (a[b][0] == f[0]) {
            a[b][1] = f[1];
            continue a;
          }
        }
        a.push(f);
      }
    }
  } else {
    if (c = c.substring(0, c.indexOf(";")), e = c.indexOf("="), c = [c.substring(0, e), c.substring(e + 1)], 2 == c.length && "-" != c[1]) {
      for (e = 0; e < a.length; ++e) {
        if (a[e][0] == c[0]) {
          a[e][1] = c[1];
          return;
        }
      }
      a.push(c);
    }
  }
}, stockRequest:[], stockData:null, stockJobQueue:[], addStockJob:(a, c) => {
  a.gid = common.Guid.newGuid().substr(0, 8);
  a.requestType = -1;
  let e = !1, f = d => {
    e || (e = !0, clearTimeout(b), common.stockJobQueue.shift(), c(d), 0 < common.stockJobQueue.length && (stockDelay ? setTimeout(() => {
      common.processStockJob(common.stockJobQueue[0][0], common.stockJobQueue[0][1]);
    }, stockDelay) : common.processStockJob(common.stockJobQueue[0][0], common.stockJobQueue[0][1])));
  }, b = setTimeout(() => {
    f({error:"stock retrieval timeout", errorCode:0});
  }, 5000);
  common.stockJobQueue.push([a, f]);
  1 == common.stockJobQueue.length && common.processStockJob(a, f);
}, processStockJob:async(a, c) => {
  var e = Date.now();
  lastActivity = e;
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
          if (e = e - lastSellerActivity < sellerLockoutDuration && (!settings.extensionCookies[a.domainId] || a.getNewId), (a.offscreen ? common.stockData.cartDisabledOffscreen : common.stockData.cartDisabled) || a.onlyMaxQty && !a.isMAP || e) {
            c({stock:a.maxQty, limit:!1, isMaxQty:a.maxQty});
          } else {
            if (null == a.sellerId) {
              c({error:"Unable to retrieve stock for this offer. ", errorCode:45});
            } else {
              if (a.queue = [async() => {
                let b = !1, d = !1, l = 0, p = cloud.getSessionId(a.cookies);
                p && (b = !0, p != a.session && (d = !0, l = p));
                if (b && d) {
                  var n = structuredClone(common.stockData.addCart);
                  n.isStock = !0;
                  n.userSession = a.session;
                  n.csrf = a.csrf;
                  n.atcCsrf = a.atcCsrf;
                  n.slateToken = a.slateToken;
                  n.originHost = a.host;
                  n.domainId = a.domainId;
                  n.url = n.url.replaceAll("{SESSION_ID}", l).replaceAll("{TLD}", getTldByDomain(a.domainId)).replaceAll("{OFFER_ID}", a.oid).replaceAll("{MARKETPLACE}", common.stockData.marketplaceIds[a.domainId]).replaceAll("{ADDCART}", encodeURIComponent(common.stockData.stockAdd[a.domainId])).replaceAll("{ASIN}", a.asin);
                  n.language = common.stockData.languageCode[a.domainId];
                  n.referer = common.stockData.isMobile ? "https://" + a.host + "/gp/aw/d/" + a.asin + "/" : a.referer;
                  n.cookies = a.cookies;
                  n.fetch.body = n.fetch.body.replaceAll("{SESSION_ID}", l).replaceAll("{CSRF}", encodeURIComponent(a.csrf)).replaceAll("{OFFER_ID}", a.oid).replaceAll("{ADDCART}", encodeURIComponent(common.stockData.stockAdd[a.domainId])).replaceAll("{ASIN}", a.asin);
                  requestQueue.enqueue(() => processRequest(n)).then(async() => {
                    const g = n.response?.text, m = n.response?.status;
                    if (null == g) {
                      a.cookies = null, common.stockData.domainId = -1, c({error:"Stock retrieval failed for this offer. Try reloading the page or restarting your browser if the issue persists. ", errorCode:65});
                    } else {
                      try {
                        if (422 == m || 200 == m) {
                          let k = JSON.parse(g), h = (new RegExp(common.stockData.limit)).test(JSON.stringify(k.entity.items[0].responseMessage));
                          c({stock:k.entity.items[0].quantity, orderLimit:-1, limit:h, price:-3, location:null});
                        } else {
                          c({error:"Stock retrieval failed for this offer. Try reloading the page after a while. ", errorCode:m});
                        }
                      } catch (k) {
                        a.error = k, console.error("request failed", k), a.callback();
                      }
                    }
                  }).catch(g => {
                    a.error = g;
                    console.error("request failed", g);
                    a.callback();
                  });
                } else {
                  common.reportBug(null, "stock session issue: " + b + " " + d + " c: " + JSON.stringify(a.cookies) + " " + JSON.stringify(a)), c({error:"stock session issue: " + b + " " + d, errorCode:4});
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
                    var d = null;
                    for (var l = 0; l < common.stockData.csrfBB.length; l++) {
                      var p = b.response.text.match(new RegExp(common.stockData.csrfBB[l]));
                      if (null != p && p[1]) {
                        d = p[1];
                        break;
                      }
                    }
                    if (d) {
                      a.csrf = d;
                      d = null;
                      for (l = 0; l < common.stockData.offerIdBB.length; l++) {
                        if (p = b.response.text.match(new RegExp(common.stockData.offerIdBB[l])), null != p && p[1]) {
                          d = p[1];
                          break;
                        }
                      }
                      if (d) {
                        a.oid = d;
                        a.callback();
                        return;
                      }
                    }
                  }
                  delete settings.extensionCookies[a.domainId];
                  await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
                  c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " mismatch oid.", errorCode:10});
                }).catch(async d => {
                  a.error = d;
                  delete settings.extensionCookies[a.domainId];
                  await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
                  console.error("request failed", d);
                });
              })), a.callback = () => a.queue.shift()(), settings.extensionCookies[a.domainId] && 432E5 > Date.now() - settings.extensionCookies[a.domainId].createDate) {
                a.cookies = settings.extensionCookies[a.domainId].cookies, a.callback();
              } else {
                var f = common.stockData.zipCodes[a.domainId];
                if (common.stockData.domainId == a.domainId) {
                  a.requestType = 3;
                  let b = structuredClone(common.stockData.addressChange);
                  b.userSession = a.session;
                  b.isStock = !0;
                  b.domainId = a.domainId;
                  b.url = "https://" + a.host + b.url;
                  b.csrf = "";
                  b.language = common.stockData.languageCode[a.domainId];
                  b.fetch.body = b.fetch.body.replace("{ZIPCODE}", f);
                  requestQueue.enqueue(() => processRequest(b)).then(() => {
                    a.cookies = b.response.cookies;
                    a.callback();
                  }).catch(d => {
                    a.error = d;
                    c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:73});
                    console.error("request failed", d);
                  });
                } else {
                  let b = structuredClone(common.stockData.geo);
                  b.userSession = a.session;
                  b.isStock = !0;
                  b.url = "https://" + a.host + b.url;
                  b.language = common.stockData.languageCode[a.domainId];
                  b.domainId = a.domainId;
                  requestQueue.enqueue(() => processRequest(b)).then(async() => {
                    let d = b.response.text, l = d?.match(new RegExp(common.stockData.csrfGeo));
                    if (null != l) {
                      b.csrf = l[1];
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
                          let g = structuredClone(common.stockData.addressChange);
                          g.userSession = a.session;
                          g.domainId = a.domainId;
                          n.isStock = !0;
                          g.url = "https://" + a.host + g.url;
                          g.language = common.stockData.languageCode[a.domainId];
                          d = n.response.text;
                          let m = d?.match(new RegExp(common.stockData.csrfSetAddress));
                          null != m && (g.csrf = m[1]);
                          g.cookies = n.response.cookies;
                          g.fetch.body = g.fetch.body.replace("{ZIPCODE}", f);
                          a.requestType = 3;
                          requestQueue.enqueue(() => processRequest(g)).then(() => {
                            a.cookies = g.response.cookies;
                            a.callback();
                          }).catch(async k => {
                            a.error = k;
                            console.error("request failed", k);
                            delete settings.extensionCookies[a.domainId];
                            await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
                            c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:72});
                          });
                        }).catch(async g => {
                          a.error = g;
                          console.error("request failed", g);
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
                  }).catch(async d => {
                    a.error = d;
                    console.error("request failed " + a.url, d);
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
}, set:function(a, c, e) {
  const f = {};
  f[a] = c;
  common.storage.set(f, e);
}, lastBugReport:0, reportBug:function(a, c, e) {
  console.error(a, c);
  const f = a ? a : Error();
  common.storage.get(["token"], function(b) {
    var d = Date.now();
    if (!(12E5 > d - common.lastBugReport || /(dead object)|(Script error)|(setUninstallURL)|(File error: Corrupted)|(operation is insecure)|(\.location is null)/i.test(a))) {
      common.lastBugReport = d;
      d = "";
      var l = common.version;
      c = c || "";
      try {
        if (d = f.stack.split("\n").splice(1).join("&ensp;&lArr;&ensp;"), !/(keepa|content)\.js/.test(d) || d.startsWith("https://www.amazon") || d.startsWith("https://smile.amazon") || d.startsWith("https://sellercentral")) {
          return;
        }
      } catch (n) {
      }
      try {
        d = d.replace(RegExp("chrome-extension://.*?/content/", "g"), "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
      } catch (n) {
      }
      if ("object" == typeof a) {
        try {
          a = a instanceof Error ? a.toString() : JSON.stringify(a);
        } catch (n) {
        }
      }
      null == e && (e = {exception:a, additional:c, url:chrome.runtime.id, stack:d});
      e.keepaType = type;
      e.version = l;
      var p = JSON.stringify(e);
      setTimeout(function() {
        fetch("https://dyn.keepa.com/service/bugreport/?user=" + b.token + "&type=" + browserType + "&version=" + l + "&delayed=" + (delayedFetch ? 1 : 0) + "&timeout=" + sellerLockoutDuration, {method:"POST", body:p, mode:"cors", cache:"no-cache", credentials:"same-origin", redirect:"error"});
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
          const e = webSocketObj.server[webSocketObj.serverIndex] + "/apps/cloud/?app=" + type + "&version=" + common.version + "&i=" + installTimestamp + "&mf=3&optOut=" + a + "&time=" + Date.now() + "&id=" + chrome.runtime.id + "&wr=" + (hasWebRequestPermission ? 1 : 0) + "&offscreen=" + (offscreenSupported ? 1 : 0) + "&mobile=" + isMobile, f = new WebSocket(e, settings.token);
          f.binaryType = "arraybuffer";
          f.onmessage = async function(b) {
            if (0 != b.data.byteLength) {
              b = b.data;
              var d = null;
              b instanceof ArrayBuffer && (b = await decompress(b, !0));
              try {
                d = JSON.parse(b);
              } catch (l) {
                common.reportBug(l, b);
                return;
              } finally {
                b = b = null;
              }
              lastActivity = Date.now();
              108 != d.status && ("" == d.key ? common.stockData.domainId = d.domainId : 108108 == d.timeout ? (d.stockDataV3 && (common.stockData = d.stockDataV3, common.stockData.cookieOrder && (cookieOrder = common.stockData.cookieOrder), d.stockDataV3.amazonIds && (AmazonSellerIds = d.stockDataV3.amazonIds), d.stockDataV3.warehouseIds && (WarehouseDealsSellerIds = d.stockDataV3.warehouseIds), common.stockData.sellerLockoutDuration && (sellerLockoutDuration = common.stockData.sellerLockoutDuration), 
              common.stockData.delayedFetch && (delayedFetch = common.stockData.delayedFetch), common.stockData.ignoreWebRequest && (hasWebRequestPermission = !1), hasWebRequestPermission && chrome.webRequest?.onHeadersReceived.addListener(l => {
                if (l.initiator == serviceWorkerUrl) {
                  var p = l.responseHeaders;
                  l = l.url;
                  var n = [];
                  for (let g = 0; g < p.length; ++g) {
                    "set-cookie" == p[g].name.toLowerCase() && n.push(parseSetCookieString(p[g].value));
                  }
                  interceptedExtensionCookies[l].resolve(n);
                }
              }, {urls:["<all_urls>"]}, ["responseHeaders", "extraHeaders"]), common.stockData.stockDelay && (stockDelay = common.stockData.stockDelay)), "undefined" != typeof d.keepaBoxPlaceholder && common.set("keepaBoxPlaceholder", d.keepaBoxPlaceholder), "undefined" != typeof d.keepaBoxPlaceholderBackup && common.set("keepaBoxPlaceholderBackup", d.keepaBoxPlaceholderBackup), "undefined" != typeof d.keepaBoxPlaceholderBackupClass && common.set("keepaBoxPlaceholderBackupClass", d.keepaBoxPlaceholderBackupClass), 
              "undefined" != typeof d.keepaBoxPlaceholderAppend && common.set("keepaBoxPlaceholderAppend", d.keepaBoxPlaceholderAppend), "undefined" != typeof d.keepaBoxPlaceholderBackupAppend && common.set("keepaBoxPlaceholderBackupAppend", d.keepaBoxPlaceholderBackupAppend)) : (d.domainId && (webSocketObj.lastDomain = d.domainId), cloud.onMessage(d)));
            }
          };
          f.onclose = function(b) {
            setTimeout(() => {
              36E5 < Date.now() - startedAt && 180000 < Date.now() - lastActivity ? chrome.runtime.reload() : c();
            }, 18E4 * Math.random());
          };
          f.onerror = function(b) {
            webSocketObj.serverIndex++;
            f.close();
          };
          f.onopen = function() {
            cloud.abortJob(414, null, null);
          };
          webSocketObj.webSocket = f;
        }
      };
      c();
    }
  }
}}, cloud = function() {
  function a(g, m) {
    if (null != g) {
      g.sent = !0;
      g = {key:g.key, messageId:g.messageId, sessionId:b(settings.extensionCookies[g.domainId]?.cookies), payload:[], status:200};
      for (let k in m) {
        g[k] = m[k];
      }
      return g;
    }
  }
  async function c(g) {
    if (-1 == g.url.indexOf("keepa.com/")) {
      g.request.cookies = settings.extensionCookies[g.domainId]?.cookies;
      try {
        g.request.userSession = "guest";
      } catch (m) {
      }
    }
    f(g, function(m) {
      let k = {payload:[]};
      if (m) {
        if (m.match(n)) {
          k.status = 403;
        } else {
          if (g.contentFilters && 0 < g.contentFilters.length) {
            for (let h in g.contentFilters) {
              let q = m.match(new RegExp(g.contentFilters[h]));
              if (q) {
                k.payload[h] = q[1].replace(/\n/g, "");
              } else {
                k.status = 305;
                k.payload[h] = m;
                break;
              }
            }
          } else {
            k.payload = [m];
          }
        }
      }
      "undefined" == typeof g.sent && webSocketObj.sendMessage(a(g, k));
    });
  }
  async function e(g) {
    g.request.cookies = settings.extensionCookies[g.domainId]?.cookies;
    g.request.userSession = "guest";
    f(g, function(m) {
      null == m && "undefined" == typeof g.sent && webSocketObj.sendMessage(a(g, {payload:[], status:305}));
    });
  }
  function f(g, m) {
    1 == g.httpMethod && g.scrapeFilters && 0 < g.scrapeFilters.length && (p = {scrapeFilters:g.scrapeFilters, dbg1:g.dbg1, dbg2:g.dbg2, domainId:g.domainId});
    g.request.domainId = g.domainId;
    requestQueue.enqueue(() => processRequest(g.request)).then(async() => {
      try {
        "object" === typeof g.request.urls && (g.request.response.text = "", g.request.urls.forEach(h => {
          h = g.request.responses[h];
          200 == h.status ? null != h.text && 10 < h.text.length && (g.request.response.text += h.text) : l(h.status, null, g);
        }));
      } catch (h) {
        console.error(h);
      }
      let k = g?.request?.response?.text;
      if (offscreenSupported && null != k && "" != k) {
        if ("o0" == g.key) {
          m(k);
        } else {
          k = k.replace(/src=".*?"/g, 'src=""');
          g.block && (k = k.replace(new RegExp(g.block, "g"), ""));
          try {
            await setupOffscreenDocument(), chrome.runtime.sendMessage({type:"parse", target:"offscreen", data:{content:k, message:g, stockData:common.stockData}}, h => {
              h = h.response;
              h = a(g, h);
              webSocketObj.sendMessage(h);
              chrome.offscreen.closeDocument();
            });
          } catch (h) {
            common.reportBug(h), g.request.isStock ? m(null) : l(410, null, g);
          }
        }
      } else {
        m(null);
      }
    }).catch(k => {
      console.error("request failed", k);
      g.request.error = k;
      g.request.isStock ? m(null) : l(410, null, g);
    });
  }
  function b(g) {
    try {
      if (g) {
        for (let m = 0; m < g.length; ++m) {
          let k = g[m];
          if ("session-id" == k.name && 16 < k.value.length && 65 > k.value.length) {
            return k.value;
          }
        }
      }
    } catch (m) {
      console.log(m);
    }
    return "";
  }
  async function d(g) {
    delete settings.extensionCookies["" + g];
    await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
  }
  function l(g, m, k) {
    if (null != k) {
      try {
        if ("undefined" != typeof k.sent) {
          return;
        }
        const h = a(k, {});
        m && (h.payload = m);
        h.status = g;
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
  return {onMessage:function(g) {
    switch(g.key) {
      case "update":
        chrome.runtime.requestUpdateCheck(function(m, k) {
          "update_available" == m && chrome.runtime.reload();
        });
        break;
      case "o0":
        c(g);
        break;
      case "o1":
        e(g);
        break;
      case "o2":
        d(g.domainId);
        break;
      case "1":
        chrome.runtime.reload();
    }
  }, endSession:d, getSessionId:b, getOutgoingMessage:a, getFilters:function() {
    return p;
  }, abortJob:l};
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
