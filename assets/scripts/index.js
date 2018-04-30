'use strict';

import { supportIframeHeight } from './supportIframeHeight';
import bindDrager from './drager';
import bindEmbeddeds from './embedded';

$(document).ready(() => {
  if (!document.querySelector) return false;
  supportIframeHeight();
  bindEmbeddeds();
  bindDrager();
  return true;
});
// drager.js 拖拽
// embedded.js 主要控制
// store.js 数据库indexedDB
// supportIframeHeight 解决 iframe 的 height="100%" 的问题
// tool 一些计算结果的方法
