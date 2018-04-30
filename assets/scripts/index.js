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
