/*!
 * 
 *     MCAFEE RESTRICTED CONFIDENTIAL
 *     Copyright (c) 2024 McAfee, LLC
 *
 *     The source code contained or described herein and all documents related
 *     to the source code ("Material") are owned by McAfee or its
 *     suppliers or licensors. Title to the Material remains with McAfee
 *     or its suppliers and licensors. The Material contains trade
 *     secrets and proprietary and confidential information of McAfee or its
 *     suppliers and licensors. The Material is protected by worldwide copyright
 *     and trade secret laws and treaty provisions. No part of the Material may
 *     be used, copied, reproduced, modified, published, uploaded, posted,
 *     transmitted, distributed, or disclosed in any way without McAfee's prior
 *     express written permission.
 *
 *     No license under any patent, copyright, trade secret or other intellectual
 *     property right is granted to or conferred upon you by disclosure or
 *     delivery of the Materials, either expressly, by implication, inducement,
 *     estoppel or otherwise. Any license under such intellectual property rights
 *     must be expressed and approved by McAfee in writing.
 *
 */(()=>{"use strict";const t=0,o=0,r=1,e=2,n=3,c=4,a=1,s=2,l=3,i=4,d={BACKGROUND:"BACKGROUND",CONTENT:"CONTENT",TELEMETRY:"TELEMETRY"},F={DEFAULT:"color: #000000; font-weight: normal; font-style:normal; background: #FFFFFF;",BACKGROUND:"color: #8D0DBA; font-weight: bold; background: #FFFFFF;",CONTENT:"color: #F54A26; font-weight: bold; background: #FFFFFF;",TELEMETRY:"color: #147831; font-weight: bold; background: #FFFFFF;"};class g{static log(t,o=null){m(t,a,o)}static error(t,o=null){m(t,s,o)}static warn(t,o=null){m(t,l,o)}static debug(t,o=null){m(t,i,o)}}const m=(g,m,f)=>{const u=t;if(u===o)return;let h="chrome-extension:"===location.protocol?d.BACKGROUND:d.CONTENT;f&&d[f]&&(h=f);const E=new Date,b=m===s?g:`%c[${h} ${E.toLocaleString([],{hour:"2-digit",minute:"2-digit",hour12:!0})}]: %c${g}`,w=F.DEFAULT;let T=F[h];if(T||(T=w),u>=e&&m===s&&console.error(g),u>=r&&m===a&&console.log(b,T,w),u>=n&&m===l){const t="color: #FFA500; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cWARN - ${b}`,t,T,w)}if(u>=c&&m===i){const t="color: #FF33D7; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cDEBUG - ${b}`,t,T,w)}},f=async(t,o,r,e)=>{try{u(t,o,r,e)}catch(t){g.warn(`[broadcast] Unexpected error when calling command: "${o}", err: ${t.message}`)}},u=(t,o,r,e,n=null)=>{if(!chrome.tabs)throw new Error('"tabs" permission not set in manifest.');return chrome.tabs.sendMessage(e,{ipcId:t,command:o,...r},{frameId:n})},h=(t,o={},r)=>(async(t,o,r={},e={})=>{try{if(e?.tabId){const{tabId:n,frameId:c}=e;return await u(t,o,r,n,c)}if(e?.broadcast){const n=await chrome.tabs.query({}),{broadcastIgnoreId:c=[]}=e;return n.filter((({id:t})=>!c.includes(t))).forEach((({id:e})=>{f(t,o,r,e)})),!0}return await chrome.runtime.sendMessage({ipcId:t,command:o,...r})}catch(t){return g.warn(`Unexpected error when calling command: "${o}", err: ${t.message}`),null}})("WA",t,o,r),E="MB_PRE_CHECK_INJECTION";(class{static start(){try{h(E)}catch(t){}}}).start()})();
//# sourceMappingURL=../sourceMap/chrome/scripts/content_mb_precheck_injection.js.map