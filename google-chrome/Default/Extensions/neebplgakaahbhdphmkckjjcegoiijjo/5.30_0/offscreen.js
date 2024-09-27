function clear() {
}
const robot = /automated access|api-services-support@/;
chrome.runtime.onMessage.addListener((h, f, v) => {
  if ("offscreen" == h.target) {
    var r = {type:"offscreen"};
    if ("undefined" == typeof h.data) {
      return console.error("offscreen empty data msg: ", JSON.stringify(h)), r.errorCode = 466, v(r), !1;
    }
    putInIframe(h.data, A => {
      const g = document.getElementById("keepa_data");
      if (A) {
        r.errorCode = 411;
      } else {
        try {
          parseIframeContent(g.contentWindow.document, h.data.message, h.data.content, h.data.stockData, B => {
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
function putInIframe(h, f) {
  try {
    const v = document.getElementById("keepa_data");
    v.src = "";
    let r = h.content.replace(/src=".*?"/g, 'src=""');
    h.block && (r = r.replace(new RegExp(h.block, "g"), ""));
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
    f(!0), console.error(JSON.stringify(h) + " " + v);
  }
}
let AmazonSellerIds = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" ");
function parseIframeContent(h, f, v, r, A) {
  if ("undefined" == typeof f.sent) {
    var g = {};
    try {
      for (var B = h.evaluate("//comment()", h, null, XPathResult.ANY_TYPE, null), D = B.iterateNext(), G = ""; D;) {
        G += D.textContent, D = B.iterateNext();
      }
      if (h.querySelector("body").textContent.match(robot) || G.match(robot)) {
        g.status = 403;
        if ("undefined" != typeof f.sent) {
          return;
        }
        A(g);
        return;
      }
    } catch (M) {
    }
    if (f.scrapeFilters && 0 < f.scrapeFilters.length) {
      const M = {}, m = {}, S = {};
      let T, w = "", H = null;
      const O = () => {
        if ("" === w) {
          g.payload = [H];
          g.scrapedData = S;
          for (let a in m) {
            g[a] = m[a];
          }
        } else {
          g.status = 305, g.payload = [H, w, ""];
        }
        "undefined" == typeof f.sent && A(g);
      }, N = function(a, C, c) {
        var n = [];
        if (!a.selectors || 0 == a.selectors.length) {
          if (!a.regExp) {
            return w = "invalid selector, sel/regexp (" + a.name + ")", !1;
          }
          n = h.querySelector("html").innerHTML.match(new RegExp(a.regExp));
          if (!n || n.length < a.reGroup) {
            c = "regexp fail: html - " + a.name + c;
            if (!1 === a.optional) {
              return w = c, !1;
            }
            H += " // " + c;
            return !0;
          }
          return n[a.reGroup];
        }
        let k = [];
        a.selectors.find(d => {
          d = C.querySelectorAll(d);
          return 0 < d.length ? (k = d, !0) : !1;
        });
        if (0 === k.length) {
          if (!0 === a.optional) {
            return !0;
          }
          w = "selector no match: " + a.name + c;
          return !1;
        }
        if (a.parentSelector && (k = [k[0].parentNode.querySelector(a.parentSelector)], null == k[0])) {
          if (!0 === a.optional) {
            return !0;
          }
          w = "parent selector no match: " + a.name + c;
          return !1;
        }
        if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > k.length || !1 === a.multiple && 1 < k.length)) {
          c = "selector multiple mismatch: " + a.name + c + " found: " + k.length;
          if (!1 === a.optional) {
            return w = c, !1;
          }
          H += " // " + c;
          return !0;
        }
        if (a.isListSelector) {
          return M[a.name] = k, !0;
        }
        if (!a.attribute) {
          return w = "selector attribute undefined?: " + a.name + c, !1;
        }
        for (let d in k) {
          if (k.hasOwnProperty(d)) {
            var p = k[d];
            if (!p) {
              break;
            }
            if (a.childNode) {
              a.childNode = Number(a.childNode);
              var u = p.childNodes;
              if (u.length < a.childNode) {
                c = "childNodes fail: " + u.length + " - " + a.name + c;
                if (!1 === a.optional) {
                  return w = c, !1;
                }
                H += " // " + c;
                return !0;
              }
              p = u[a.childNode];
            }
            u = null;
            u = "text" == a.attribute ? p.textContent : "html" == a.attribute ? p.innerHTML : p.getAttribute(a.attribute);
            if (!u || 0 == u.length || 0 == u.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
              c = "selector attribute null: " + a.name + c;
              if (!1 === a.optional) {
                return w = c, !1;
              }
              H += " // " + c;
              return !0;
            }
            if (a.regExp) {
              p = u.match(new RegExp(a.regExp));
              if (!p || p.length < a.reGroup) {
                c = "regexp fail: " + u + " - " + a.name + c;
                if (!1 === a.optional) {
                  return w = c, !1;
                }
                H += " // " + c;
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
        const C = f.scrapeFilters[a], c = C.pageVersionTest;
        D = [];
        G = !1;
        for (const n of c.selectors) {
          if (D = h.querySelectorAll(n), 0 < D.length) {
            G = !0;
            break;
          }
        }
        if (G) {
          if ("undefined" != typeof c.multiple && null != c.multiple) {
            if (!0 === c.multiple && 2 > D.length) {
              continue;
            }
            if (!1 === c.multiple && 1 < D.length) {
              continue;
            }
          }
          if (c.attribute && (G = null, G = "text" == c.attribute ? "" : D[0].getAttribute(c.attribute), null == G)) {
            continue;
          }
          T = a;
          (function() {
            let n = 0, k = [];
            for (var p in C) {
              const b = C[p];
              if (b.name != c.name) {
                var u = h;
                if (b.parentList) {
                  var d = [];
                  if ("undefined" != typeof M[b.parentList]) {
                    d = M[b.parentList];
                  } else {
                    if (!0 === N(C[b.parentList], u, a)) {
                      d = M[b.parentList];
                    } else {
                      break;
                    }
                  }
                  m[b.parentList] || (m[b.parentList] = []);
                  u = 0;
                  for (let e in d) {
                    if (d.hasOwnProperty(e)) {
                      if ("lager" == b.name) {
                        var t = l => {
                          l = l.trim();
                          let z = r.amazonNames[l];
                          return z ? "W" === z ? r.warehouseIds[f.domainId] : "A" === z ? r.amazonIds[f.domainId] : z : (l = l.match(new RegExp(r.sellerId))) && l[1] ? l[1] : null;
                        };
                        let J = f.request.userSession, P = new URL(f.url);
                        u++;
                        try {
                          let l = null, z = null, x = C.sellerId, I = f.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                          if (null == I || 9 > I.length) {
                            continue;
                          }
                          if ("undefined" == typeof x || null == x || null == I || 2 > I.length) {
                            continue;
                          }
                          m[x.parentList][e] && m[x.parentList][e][x.name] ? z = m[x.parentList][e][x.name] : (z = N(x, d[e], a), "boolean" === typeof z && C.sellerName && (z = N(C.sellerName, d[e], a)));
                          if ("boolean" === typeof z) {
                            continue;
                          }
                          if (0 == z.indexOf("https") && m[x.parentList][e].sellerName) {
                            let q = t(m[x.parentList][e].sellerName);
                            null != q && (l = q);
                          }
                          null == l && (l = t(z));
                          if (null == l) {
                            t = !1;
                            try {
                              m[x.parentList][e] && m[x.parentList][e].sellerName && -1 < m[x.parentList][e].sellerName.indexOf("Amazon") && (null == l || 12 > (l + "").length) && (t = !0);
                            } catch (q) {
                              console.error(q);
                            }
                            l = t ? AmazonSellerIds[f.domainId] : l.match(/&seller=([A-Z0-9]{9,21})($|&)/)[1];
                          }
                          let U, E;
                          b.stockForm && (U = d[e].querySelector(b.stockForm));
                          b.stockOfferId && (E = d[e].querySelector(b.stockOfferId));
                          E &&= E.getAttribute(b.stockForm);
                          let Q = 999;
                          if (!E) {
                            try {
                              let q = JSON.parse(b.regExp);
                              if (q.sel1) {
                                try {
                                  let y = JSON.parse(d[e].querySelectorAll(q.sel1)[0].dataset[q.dataSet1]);
                                  E = y[q.val1];
                                  Q = y.maxQty;
                                } catch (y) {
                                }
                              }
                              if (!E && q.sel2) {
                                try {
                                  let y = JSON.parse(d[e].querySelectorAll(q.sel2)[0].dataset[q.dataSet2]);
                                  E = y[q.val2];
                                  Q = y.maxQty;
                                } catch (y) {
                                }
                              }
                            } catch (q) {
                            }
                          }
                          let R = !1;
                          try {
                            R = m[b.parentList][e].isMAP || /(our price|to cart to see|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(d[e].textContent.toLowerCase());
                          } catch (q) {
                          }
                          let W = R || f.maxStockUpdates && n < f.maxStockUpdates;
                          if (U && l && null != J && W) {
                            n++;
                            let q = e + "";
                            const y = C.atcCsrf;
                            let V = null;
                            if (null != y) {
                              try {
                                for (const K of y.selectors) {
                                  let F = h.querySelectorAll(K);
                                  if (0 < F.length) {
                                    F = F[0];
                                    V = attribute = "text" == y.attribute ? F.textContent : "html" == y.attribute ? F.innerHTML : F.getAttribute(y.attribute);
                                    break;
                                  }
                                }
                              } catch (K) {
                              }
                            }
                            let L = !0;
                            setTimeout(() => {
                              chrome.runtime.sendMessage({type:"getStock", asin:I, oid:E, host:P.host, maxQty:Q, sellerId:l, slateToken:f.slateToken, atcCsrf:V, onlyMaxQty:9 == b.reGroup, isMAP:R, referer:P.host + "/dp/" + I, domainId:f.domainId, force:!0, session:J, offscreen:!0}, K => {
                                L && ("undefined" == typeof K || null != K.error && 430 == K.errorCode ? chrome.runtime.sendMessage({type:"getStock", asin:I, oid:E, host:P.host, maxQty:Q, sellerId:l, onlyMaxQty:9 == b.reGroup, isMAP:R, referer:P.host + "/dp/" + I, domainId:f.domainId, force:!0, session:J}, F => {
                                  L && (L = !1, "undefined" != typeof F && (m[b.parentList][q][b.name] = F), 0 == --n && O(g));
                                }) : (L = !1, m[b.parentList][q][b.name] = K, 0 == --n && O(g)));
                              });
                              setTimeout(() => {
                                L && 0 == --n && (L = !1, O(g));
                              }, 4000 + 1800 * n);
                            }, 1);
                          }
                        } catch (l) {
                        }
                      } else {
                        t = N(b, d[e], a);
                        if (!1 === t) {
                          break;
                        }
                        if (!0 !== t) {
                          if (m[b.parentList][e] || (m[b.parentList][e] = {}), b.multiple) {
                            for (let J in t) {
                              t.hasOwnProperty(J) && !b.keepBR && (t[J] = t[J].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
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
                  d = N(b, u, a);
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
                    S[b.name] = d;
                  }
                }
              }
            }
            try {
              if (1 == k.length || "500".endsWith("8") && 0 < k.length) {
                k.shift()();
              } else {
                for (p = 0; p < k.length; p++) {
                  setTimeout(() => {
                    0 < k.length && k.shift()();
                  }, 500 * p);
                }
              }
            } catch (b) {
            }
            0 == n && 0 == k.length && O();
          })();
          B = !0;
        }
      }
      null == T && (w += " // no pageVersion matched", g.payload = [H, w, f.dbg1 ? v : ""], g.status = 308, "undefined" == typeof f.sent && A(g));
    } else {
      g.status = 306, "undefined" == typeof f.sent && A(g);
    }
  }
}
;
