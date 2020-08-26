import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./globalComponents";
import VueMeta from "vue-meta";
import VueShortkey from "vue-shortkey";
import Vue2TouchEvents from "vue2-touch-events";

Vue.use(VueMeta);
Vue.use(VueShortkey);
Vue.use(Vue2TouchEvents);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
