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
 */(()=>{class s extends AudioWorkletProcessor{constructor(){super(),this.defaultSampleSize=64e3,this.isRecording=!1,this.buffer=[],this.port.onmessage=this.handleMessage.bind(this)}process(s){const e=s[0];if(e.length>0&&this.isRecording){const s=e[0];this.buffer.push(...s),this.buffer.length>=this.sampleSize&&this.sendBuffer()}return!0}handleMessage({data:s}){"start"===s.state&&(Number.isInteger(s.sampleRate)&&Number.isInteger(s.chunksize)?this.sampleSize=s.sampleRate*s.chunksize:this.sampleSize=this.defaultSampleSize,this.isRecording=!0),"stop"===s.state&&(this.isRecording=!1,this.sendBuffer(!0))}sendBuffer(s=!1){this.port.postMessage({buffer:this.buffer.splice(0,this.sampleSize),isLast:s})}}registerProcessor("pcm-processor",s)})();
//# sourceMappingURL=../../sourceMap/chrome/MockingBird-Package/scripts/worklet_processor.js.map