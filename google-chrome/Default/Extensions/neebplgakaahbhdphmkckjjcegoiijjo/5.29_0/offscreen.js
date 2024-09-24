function clear() {
}
const robot = /automated access|api-services-support@/;
chrome.runtime.onMessage.addListener((l, f, v) => {
  if ("offscreen" == l.target) {
    var r = {type:"offscreen"};
    if ("undefined" == typeof l.data) {
      return console.error("offscreen empty data msg: ", JSON.stringify(l)), r.errorCode = 466, v(r), !1;
    }
    putInIframe(l.data, A => {
      const g = document.getElementById("keepa_data");
      if (A) {
        r.errorCode = 411;
      } else {
        try {
          parseIframeContent(g.contentWindow.document, l.data.message, l.data.content, l.data.stockData, B => {
            r.response = B;
            v(r);
            g.src = "";
            g.removeAttribute("srcdoc");
            clear();
          });
          return;
        } catch (B) {
          console.error(B), r.error = B, r.errorCode = 410;
        }
      }
      v(r);
      g.src = "";
      g.removeAttribute("srcdoc");
      clear();
    });
    return !0;
  }
});
function putInIframe(l, f) {
  try {
    const v = document.getElementById("keepa_data");
    v.src = "";
    let r = l.content.replace(/src=".*?"/g, 'src=""');
    l.block && (r = r.replace(new RegExp(l.block, "g"), ""));
    let A = !1;
    v.srcdoc = r;
    v.onload = function() {
      A || (v.onload = void 0, A = !0, setTimeout(function() {
        f(!1);
      }, 80));
    };
    v.onerror = function() {
      A || (v.onload = void 0, A = !0, f(!0));
    };
  } catch (v) {
    f(!0), console.error(JSON.stringify(l) + " " + v);
  }
}
let AmazonSellerIds = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" ");
function parseIframeContent(l, f, v, r, A) {
  if ("undefined" == typeof f.sent) {
    var g = {};
    try {
      for (var B = l.evaluate("//comment()", l, null, XPathResult.ANY_TYPE, null), C = B.iterateNext(), F = ""; C;) {
        F += C.textContent, C = B.iterateNext();
      }
      if (l.querySelector("body").textContent.match(robot) || F.match(robot)) {
        g.status = 403;
        if ("undefined" != typeof f.sent) {
          return;
        }
        A(g);
        return;
      }
    } catch (J) {
    }
    if (f.scrapeFilters && 0 < f.scrapeFilters.length) {
      const J = {}, m = {}, Q = {};
      let R, x = "", G = null;
      const L = () => {
        if ("" === x) {
          g.payload = [G];
          g.scrapedData = Q;
          for (let a in m) {
            g[a] = m[a];
          }
        } else {
          g.status = 305, g.payload = [G, x, ""];
        }
        "undefined" == typeof f.sent && A(g);
      }, K = function(a, D, c) {
        var n = [];
        if (!a.selectors || 0 == a.selectors.length) {
          if (!a.regExp) {
            return x = "invalid selector, sel/regexp (" + a.name + ")", !1;
          }
          n = l.querySelector("html").innerHTML.match(new RegExp(a.regExp));
          if (!n || n.length < a.reGroup) {
            c = "regexp fail: html - " + a.name + c;
            if (!1 === a.optional) {
              return x = c, !1;
            }
            G += " // " + c;
            return !0;
          }
          return n[a.reGroup];
        }
        let h = [];
        a.selectors.find(d => {
          d = D.querySelectorAll(d);
          return 0 < d.length ? (h = d, !0) : !1;
        });
        if (0 === h.length) {
          if (!0 === a.optional) {
            return !0;
          }
          x = "selector no match: " + a.name + c;
          return !1;
        }
        if (a.parentSelector && (h = [h[0].parentNode.querySelector(a.parentSelector)], null == h[0])) {
          if (!0 === a.optional) {
            return !0;
          }
          x = "parent selector no match: " + a.name + c;
          return !1;
        }
        if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > h.length || !1 === a.multiple && 1 < h.length)) {
          c = "selector multiple mismatch: " + a.name + c + " found: " + h.length;
          if (!1 === a.optional) {
            return x = c, !1;
          }
          G += " // " + c;
          return !0;
        }
        if (a.isListSelector) {
          return J[a.name] = h, !0;
        }
        if (!a.attribute) {
          return x = "selector attribute undefined?: " + a.name + c, !1;
        }
        for (let d in h) {
          if (h.hasOwnProperty(d)) {
            var p = h[d];
            if (!p) {
              break;
            }
            if (a.childNode) {
              a.childNode = Number(a.childNode);
              var u = p.childNodes;
              if (u.length < a.childNode) {
                c = "childNodes fail: " + u.length + " - " + a.name + c;
                if (!1 === a.optional) {
                  return x = c, !1;
                }
                G += " // " + c;
                return !0;
              }
              p = u[a.childNode];
            }
            u = null;
            u = "text" == a.attribute ? p.textContent : "html" == a.attribute ? p.innerHTML : p.getAttribute(a.attribute);
            if (!u || 0 == u.length || 0 == u.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
              c = "selector attribute null: " + a.name + c;
              if (!1 === a.optional) {
                return x = c, !1;
              }
              G += " // " + c;
              return !0;
            }
            if (a.regExp) {
              p = u.match(new RegExp(a.regExp));
              if (!p || p.length < a.reGroup) {
                c = "regexp fail: " + u + " - " + a.name + c;
                if (!1 === a.optional) {
                  return x = c, !1;
                }
                G += " // " + c;
                return !0;
              }
              n.push("undefined" == typeof p[a.reGroup] ? p[0] : p[a.reGroup]);
            } else {
              n.push(u);
            }
            if (!a.multiple) {
              break;
            }
          }
        }
        return a.multiple ? n : n[0];
      };
      B = !1;
      for (let a in f.scrapeFilters) {
        if (B) {
          break;
        }
        const D = f.scrapeFilters[a], c = D.pageVersionTest;
        C = [];
        F = !1;
        for (const n of c.selectors) {
          if (C = l.querySelectorAll(n), 0 < C.length) {
            F = !0;
            break;
          }
        }
        if (F) {
          if ("undefined" != typeof c.multiple && null != c.multiple) {
            if (!0 === c.multiple && 2 > C.length) {
              continue;
            }
            if (!1 === c.multiple && 1 < C.length) {
              continue;
            }
          }
          if (c.attribute && (F = null, F = "text" == c.attribute ? "" : C[0].getAttribute(c.attribute), null == F)) {
            continue;
          }
          R = a;
          (function() {
            let n = 0, h = [];
            for (var p in D) {
              const b = D[p];
              if (b.name != c.name) {
                var u = l;
                if (b.parentList) {
                  var d = [];
                  if ("undefined" != typeof J[b.parentList]) {
                    d = J[b.parentList];
                  } else {
                    if (!0 === K(D[b.parentList], u, a)) {
                      d = J[b.parentList];
                    } else {
                      break;
                    }
                  }
                  m[b.parentList] || (m[b.parentList] = []);
                  u = 0;
                  for (let e in d) {
                    if (d.hasOwnProperty(e)) {
                      if ("lager" == b.name) {
                        var t = k => {
                          k = k.trim();
                          let z = r.amazonNames[k];
                          return z ? "W" === z ? r.warehouseIds[f.domainId] : "A" === z ? r.amazonIds[f.domainId] : z : (k = k.match(new RegExp(r.sellerId))) && k[1] ? k[1] : null;
                        };
                        let I = f.request.userSession, M = new URL(f.url);
                        u++;
                        try {
                          let k = null, z = null, y = D.sellerId, H = f.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                          if (null == H || 9 > H.length) {
                            continue;
                          }
                          if ("undefined" == typeof y || null == y || null == H || 2 > H.length) {
                            continue;
                          }
                          m[y.parentList][e] && m[y.parentList][e][y.name] ? z = m[y.parentList][e][y.name] : (z = K(y, d[e], a), "boolean" === typeof z && D.sellerName && (z = K(D.sellerName, d[e], a)));
                          if ("boolean" === typeof z) {
                            continue;
                          }
                          if (0 == z.indexOf("https") && m[y.parentList][e].sellerName) {
                            let q = t(m[y.parentList][e].sellerName);
                            null != q && (k = q);
                          }
                          null == k && (k = t(z));
                          if (null == k) {
                            t = !1;
                            try {
                              m[y.parentList][e] && m[y.parentList][e].sellerName && -1 < m[y.parentList][e].sellerName.indexOf("Amazon") && (null == k || 12 > (k + "").length) && (t = !0);
                            } catch (q) {
                              console.error(q);
                            }
                            k = t ? AmazonSellerIds[f.domainId] : k.match(/&seller=([A-Z0-9]{9,21})($|&)/)[1];
                          }
                          let S, E;
                          b.stockForm && (S = d[e].querySelector(b.stockForm));
                          b.stockOfferId && (E = d[e].querySelector(b.stockOfferId));
                          E &&= E.getAttribute(b.stockForm);
                          let N = 999;
                          if (!E) {
                            try {
                              let q = JSON.parse(b.regExp);
                              if (q.sel1) {
                                try {
                                  let w = JSON.parse(d[e].querySelectorAll(q.sel1)[0].dataset[q.dataSet1]);
                                  E = w[q.val1];
                                  N = w.maxQty;
                                } catch (w) {
                                }
                              }
                              if (!E && q.sel2) {
                                try {
                                  let w = JSON.parse(d[e].querySelectorAll(q.sel2)[0].dataset[q.dataSet2]);
                                  E = w[q.val2];
                                  N = w.maxQty;
                                } catch (w) {
                                }
                              }
                            } catch (q) {
                            }
                          }
                          let O = !1;
                          try {
                            O = m[b.parentList][e].isMAP || /(our price|to cart to see|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(d[e].textContent.toLowerCase());
                          } catch (q) {
                          }
                          let U = O || f.maxStockUpdates && n < f.maxStockUpdates;
                          if (S && k && null != I && U) {
                            n++;
                            let q = e + "", w = !0;
                            setTimeout(() => {
                              chrome.runtime.sendMessage({type:"getStock", asin:H, oid:E, host:M.host, maxQty:N, sellerId:k, onlyMaxQty:9 == b.reGroup, isMAP:O, referer:M.host + "/dp/" + H, domainId:f.domainId, force:!0, session:I, offscreen:!0}, P => {
                                w && ("undefined" == typeof P || null != P.error && 430 == P.errorCode ? chrome.runtime.sendMessage({type:"getStock", asin:H, oid:E, host:M.host, maxQty:N, sellerId:k, onlyMaxQty:9 == b.reGroup, isMAP:O, referer:M.host + "/dp/" + H, domainId:f.domainId, force:!0, session:I}, T => {
                                  w && (w = !1, "undefined" != typeof T && (m[b.parentList][q][b.name] = T), 0 == --n && L(g));
                                }) : (w = !1, m[b.parentList][q][b.name] = P, 0 == --n && L(g)));
                              });
                              setTimeout(() => {
                                w && 0 == --n && (w = !1, L(g));
                              }, 4000 + 1800 * n);
                            }, 1);
                          }
                        } catch (k) {
                        }
                      } else {
                        t = K(b, d[e], a);
                        if (!1 === t) {
                          break;
                        }
                        if (!0 !== t) {
                          if (m[b.parentList][e] || (m[b.parentList][e] = {}), b.multiple) {
                            for (let I in t) {
                              t.hasOwnProperty(I) && !b.keepBR && (t[I] = t[I].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                            }
                            t = t.join("\u271c\u271c");
                            m[b.parentList][e][b.name] = t;
                          } else {
                            m[b.parentList][e][b.name] = b.keepBR ? t : t.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                          }
                        }
                      }
                    }
                  }
                } else {
                  d = K(b, u, a);
                  if (!1 === d) {
                    break;
                  }
                  if (!0 !== d) {
                    if (b.multiple) {
                      for (let e in d) {
                        d.hasOwnProperty(e) && !b.keepBR && (d[e] = d[e].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                      }
                      d = d.join();
                    } else {
                      b.keepBR || (d = d.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                    }
                    Q[b.name] = d;
                  }
                }
              }
            }
            try {
              if (1 == h.length || "500".endsWith("8") && 0 < h.length) {
                h.shift()();
              } else {
                for (p = 0; p < h.length; p++) {
                  setTimeout(() => {
                    0 < h.length && h.shift()();
                  }, 500 * p);
                }
              }
            } catch (b) {
            }
            0 == n && 0 == h.length && L();
          })();
          B = !0;
        }
      }
      null == R && (x += " // no pageVersion matched", g.payload = [G, x, f.dbg1 ? v : ""], g.status = 308, "undefined" == typeof f.sent && A(g));
    } else {
      g.status = 306, "undefined" == typeof f.sent && A(g);
    }
  }
}
;
