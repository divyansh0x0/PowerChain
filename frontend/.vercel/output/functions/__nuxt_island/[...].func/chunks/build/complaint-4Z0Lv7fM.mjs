import { defineComponent, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@iconify/vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "complaint",
  __ssrInlineRender: true,
  setup(__props) {
    const name = ref("");
    const phone = ref("");
    const area = ref("");
    const pincode = ref("");
    const description = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(_attrs)} data-v-b0691757><div class="complaint-container" data-v-b0691757><h2 class="title" data-v-b0691757>Report a Power Outage</h2><form class="complaint-form" data-v-b0691757><div class="form-group" data-v-b0691757><label for="name" data-v-b0691757>Full Name</label><input id="name"${ssrRenderAttr("value", name.value)} type="text" placeholder="Enter your name" required data-v-b0691757></div><div class="form-group" data-v-b0691757><label for="phone" data-v-b0691757>Phone Number</label><input id="phone"${ssrRenderAttr("value", phone.value)} type="tel" placeholder="Enter your phone number" required data-v-b0691757></div><div class="form-group" data-v-b0691757><label for="area" data-v-b0691757>Area / Locality</label><input id="area"${ssrRenderAttr("value", area.value)} type="text" placeholder="Enter your area or village name" disabled readonly data-v-b0691757></div><div class="form-group" data-v-b0691757><label for="pincode" data-v-b0691757>Pincode</label><input id="pincode"${ssrRenderAttr("value", pincode.value)} type="text" placeholder="e.g. 560001" disabled readonly data-v-b0691757></div><div class="form-group" data-v-b0691757><label for="description" data-v-b0691757>Describe the Issue</label><textarea id="description" rows="4" placeholder="Describe the power issue or duration of outage..." data-v-b0691757>${ssrInterpolate(description.value)}</textarea></div><div class="form-group" data-v-b0691757><button type="submit" class="submit-btn" data-v-b0691757>Submit Complaint</button></div></form></div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/complaint.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const complaint = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b0691757"]]);

export { complaint as default };
//# sourceMappingURL=complaint-4Z0Lv7fM.mjs.map
