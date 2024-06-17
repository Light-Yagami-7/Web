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
 */(()=>{"use strict";const e="PING_IFRAME_BLOCK";const o=0,t=0,n=1,i=2,r=3,c=4,s=1,l=2,d=3,a=4,u={BACKGROUND:"BACKGROUND",CONTENT:"CONTENT",TELEMETRY:"TELEMETRY"},m={DEFAULT:"color: #000000; font-weight: normal; font-style:normal; background: #FFFFFF;",BACKGROUND:"color: #8D0DBA; font-weight: bold; background: #FFFFFF;",CONTENT:"color: #F54A26; font-weight: bold; background: #FFFFFF;",TELEMETRY:"color: #147831; font-weight: bold; background: #FFFFFF;"};class g{static log(e,o=null){F(e,s,o)}static error(e,o=null){F(e,l,o)}static warn(e,o=null){F(e,d,o)}static debug(e,o=null){F(e,a,o)}}const F=(e,g,F)=>{const f=o;if(f===t)return;let h="chrome-extension:"===location.protocol?u.BACKGROUND:u.CONTENT;F&&u[F]&&(h=F);const p=new Date,T=g===l?e:`%c[${h} ${p.toLocaleString([],{hour:"2-digit",minute:"2-digit",hour12:!0})}]: %c${e}`,E=m.DEFAULT;let b=m[h];if(b||(b=E),f>=i&&g===l&&console.error(e),f>=n&&g===s&&console.log(T,b,E),f>=r&&g===d){const e="color: #FFA500; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cWARN - ${T}`,e,b,E)}if(f>=c&&g===a){const e="color: #FF33D7; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cDEBUG - ${T}`,e,b,E)}};class f{constructor(e){this.pingCommand=e,this.basePingListener(),this.addIdentifier()}basePingListener(e=null){((e,o=null,t)=>{"function"==typeof t?chrome.runtime.onMessage.addListener(((n,i,r)=>{if(i.id===chrome.runtime.id&&"object"==typeof n&&!Array.isArray(n)&&n?.ipcId===e)return t({promises:o,request:n,sender:i,sendResponse:r})})):g.error("Provided with invalid callback function")})("WA",null,(({request:o,sendResponse:t})=>{const{command:n}=o;if(n===this.pingCommand)return g.debug(`File Injection [pinged]: Received ${n} command`),t({content:!0}),"function"==typeof e&&e(),!0}))}addIdentifier(){var e;e=()=>{const e=document.createElement("span");e.id=this.pingCommand,e.style.cssText="display:none",document.body.appendChild(e)},"undefined"!=typeof document&&null!==document&&("complete"===document.readyState||"loading"!==document.readyState&&!document.documentElement.doScroll?e():document.addEventListener("DOMContentLoaded",e))}}(new class extends f{constructor(){super(e),this.routeToBP=this.routeToBlockPage.bind(this)}main(){this.basePingListener(this.routeToBP)}getIFrameBlockPageUrl(){return chrome.runtime.getURL("html/iframe_block_page.html")}routeToBlockPage(){const e=this.getIFrameBlockPageUrl();window.location.replace(e)}}).main()})();
//# sourceMappingURL=../sourceMap/chrome/scripts/iframe_block.js.map