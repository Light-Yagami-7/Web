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
 */(()=>{"use strict";const n=0,t=0,e=1,o=2,i=3,c=4,s=1,r=2,d=3,a=4,l={BACKGROUND:"BACKGROUND",CONTENT:"CONTENT",TELEMETRY:"TELEMETRY"},u={DEFAULT:"color: #000000; font-weight: normal; font-style:normal; background: #FFFFFF;",BACKGROUND:"color: #8D0DBA; font-weight: bold; background: #FFFFFF;",CONTENT:"color: #F54A26; font-weight: bold; background: #FFFFFF;",TELEMETRY:"color: #147831; font-weight: bold; background: #FFFFFF;"};class m{static log(n,t=null){g(n,s,t)}static error(n,t=null){g(n,r,t)}static warn(n,t=null){g(n,d,t)}static debug(n,t=null){g(n,a,t)}}const g=(m,g,p)=>{const h=n;if(h===t)return;let F="chrome-extension:"===location.protocol?l.BACKGROUND:l.CONTENT;p&&l[p]&&(F=p);const f=new Date,T=g===r?m:`%c[${F} ${f.toLocaleString([],{hour:"2-digit",minute:"2-digit",hour12:!0})}]: %c${m}`,E=u.DEFAULT;let C=u[F];if(C||(C=E),h>=o&&g===r&&console.error(m),h>=e&&g===s&&console.log(T,C,E),h>=i&&g===d){const n="color: #FFA500; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cWARN - ${T}`,n,C,E)}if(h>=c&&g===a){const n="color: #FF33D7; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cDEBUG - ${T}`,n,C,E)}};class p{constructor(n,t){this.pingCommand=n,this.ipcId=t,this.mainFunction="function"==typeof this.main?((n,t)=>{let e;return(...o)=>(n&&(e=n.apply(t||void 0,o),n=null,t=null),e)})(this.main,this):()=>{},this.basePingListener(),this.addIdentifier()}basePingListener(){((n,t=null,e)=>{"function"==typeof e?chrome.runtime.onMessage.addListener(((o,i,c)=>{if(i.id===chrome.runtime.id&&"object"==typeof o&&!Array.isArray(o)&&o?.ipcId===n)return e({promises:t,request:o,sender:i,sendResponse:c})})):m.error("Provided with invalid callback function")})(this.ipcId,null,(({request:n,sendResponse:t})=>{const{command:e,...o}=n;if(e===this.pingCommand)return m.debug(`File Injection [pinged]: Received ${e} command`),t({content:!0}),"function"==typeof this.mainFunction&&this.mainFunction(o),"function"==typeof this.callback&&this.callback(),!0}))}addIdentifier(){var n;n=()=>{const n=document.createElement("span");n.id=this.pingCommand,n.style.cssText="display:none",document.body.appendChild(n)},"undefined"!=typeof document&&null!==document&&("complete"===document.readyState||"loading"!==document.readyState&&!document.documentElement.doScroll?n():document.addEventListener("DOMContentLoaded",n))}}const h="PING_CONTENT_MB_INJECT_SCRIPT",F="MB",f={MB_CONTENT_PAGE_INJECT:"MockingBird-Package/scripts/mockingbird_content_page_inject.js",MB_CONTENT_MAIN:"MockingBird-Package/scripts/mockingbird_content_main.js"};(new class extends p{constructor(){super(h,F)}init(){const n=document.createElement("script");n.src=chrome.runtime.getURL(f.MB_SCRIPT_ATTACH_SHADOW),(document.head||document.documentElement).appendChild(n),m.log("[MB:MockingBirdContentPageInject] patching shadow.")}}).init()})();
//# sourceMappingURL=../../sourceMap/chrome/MockingBird-Package/scripts/mockingbird_content_page_inject.js.map