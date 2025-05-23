import Vue from "vue";
import Router, { RouteConfig } from "vue-router";

/**
 * PAGES
 */
import Login from "../comps/auth/Login.vue";
import Reset from "../comps/auth/Reset.vue";
import ResetValidation from "../comps/auth/ResetValidation.vue";
import Products from "../comps/products/Products.vue";
import ProductsServers from "../comps/products/backup/ProductsServers.vue";
import ProductsLicence from "../comps/products/licence/ProductsLicence.vue";
import Dashboard from "../comps/dashboard/Dashboard.vue";
import Configuration from "../comps/settings/Configuration.vue";
import Profile from "../comps/profile/Profile.vue";
import Billing from "../comps/invoice/Billing.vue";
import Tickets from "../comps/tickets/Tickets.vue";
import Shop from "../comps/command/Shop.vue";
import TicketMessage from "../comps/tickets/TicketMessage.vue";
import CommandProduct from "../comps/command/CommandProduct.vue";
import CreateBill from "../comps/invoice/CreateBill.vue";
import CommandTrunk from "../comps/command/CommandTrunk.vue";
import OpenVPN from "../comps/vpn/OpenVPN.vue";
// import OpenVPNClient from "../comps/vpn/OpenVPNClient.vue";
import OpenVPNRules from "../comps/vpn/OpenVPNRules.vue";
import IPBXManagement from "../comps/products/ipbx/IPBXManagement.vue";
import ProductsCertificates from "../comps/products/certificate/ProductsCertificates.vue";
import ProductsIpbxCallLog from "../comps/products/ipbx/ProductsIpbxCallLog.vue";
import ProductsIpbxAdmin from "../comps/products/ipbx/ProductsIpbxAdmin.vue";
import Statistics from "../comps/stats/Statistics.vue";
import ProductSimConsommation from "../comps/products/sim/ProductSimConsommation.vue";

import VueToastr from "vue-toastr";
import VueCookies from "vue-cookies";

Vue.use(Router);
Vue.use(VueToastr, {
  defaultPosition: "toast-top-right",
  defaultType: "info",
  defaultTimeout: 3000
});

Vue.use(VueCookies);

/*
function parseJWT (token) {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
}
*/

const routes: Array<RouteConfig> = [
  { path: "/", name: "menu", component: Dashboard },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/statistics", name: "Statistics", component: Statistics },
  { path: "/configuration", name: "Configuration", component: Configuration },
  { path: "/profile", name: "Profile", component: Profile },
  { path: "/products", name: "Products", component: Products },
  { path: "/products/licence", name: "ProductsLicence", component: ProductsLicence },
  { path: "/products/servers", name: "ProductsServers", component: ProductsServers },
  { path: "/products/ipbx", name: "IPBXManagement", component: IPBXManagement },
  { path: "/products/letsencrypt", name: "ProductsCertificates", component: ProductsCertificates },
  { path: "/products/ipbx/calllog", name: "ProductsIpbxCallLog", component: ProductsIpbxCallLog },
  { path: "/products/ipbx/administration", name: "ProductsIpbxAdmin", component: ProductsIpbxAdmin },
  { path: "/products/command", name: "CommandProduct", component: CommandProduct },
  { path: "/billing/create", name: "CreateBill", component: CreateBill },
  { path: "/products/trunk/command", name: "CommandTrunk", component: CommandTrunk },
  { path: "/products/sim/consommation", name: "ProductSimConsommation", component: ProductSimConsommation },
  { path: "/billing", name: "Billing", component: Billing },
  { path: "/support", name: "Tickets", component: Tickets },
  { path: "/shop", name: "Shop", component: Shop },
  { path: "/support/ticket", name: "TicketMessage", component: TicketMessage },
  { path: "/ping", name: "PagePing" },
  { path: "/vpn", name: "OpenVPN", component: OpenVPN },
  // { path: "/vpn/client", name: "OpenVPNClient", component: OpenVPNClient },
  { path: "/vpn/rules", name: "OpenVPNRules", component: OpenVPNRules },
  { path: "/login", name: "Login", component: Login },
  { path: "/reset-password", name: "Reset", component: Reset },
  { path: "/reset-password/validation", name: "ResetValidation", component: ResetValidation }
];

export default new Router({
  mode: "history",
  routes
});
