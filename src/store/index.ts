import Vue from "vue";
import Vuex, { ActionContext, Module } from "vuex";
import Datastore from "nedb-promises";

import vpn from "@/store/modules/vpn";
import trunk from "@/store/modules/trunk";
import sda from "@/store/modules/sda";
import products from "@/store/modules/products";
import ipbx from "@/store/modules/ipbx";
import sim from "@/store/modules/sim";

Vue.use(Vuex);

let db = Datastore.create({ filename: "iprateur.db", autoload: true });

interface GlobalState {
  id: string | null;
  session_id: string | null;
  last_update: string | null;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  roles: string[] | null;
  id_company: string | null;
  company_name: string | null;
  id_picture: string | null;
  data: any | null;
  hash: string | null;
  allowed_routes: string[] | null;
  default_route: string | null;
  id_vpn: string | null;
  id_server_vpn: string | null;
  csrf_token: string | null;
  image: string | null;
  devMode: boolean | null;
}

const store = new Vuex.Store({
  modules: {
    vpn,
    trunk,
    sda,
    products,
    ipbx,
    sim
  },

  state: {
    id: null,
    session_id: null,
    last_update: null,
    name: null,
    first_name: null,
    last_name: null,
    email: null,
    roles: null,
    id_company: null,
    company_name: null,
    id_picture: null,
    data: null,
    hash: null,
    allowed_routes: null,
    default_route: null,
    id_vpn: null,
    id_server_vpn: null,
    csrf_token: null,
    image: null,
    devMode: null,
  },

  mutations: {
    updateUser(state: GlobalState, user: Partial<GlobalState>) {
      if (user === null) {
        Object.assign(state, {
          id: null,
          session_id: null,
          last_update: null,
          name: null,
          first_name: null,
          last_name: null,
          email: null,
          roles: null,
          id_company: null,
          company_name: null,
          id_picture: null,
          data: null,
          hash: null,
          allowed_routes: null,
          default_route: null,
          id_vpn: null,
          id_server_vpn: null,
          csrf_token: null,
          image: null,
          devMode: null,
        });
      } else {
        Object.assign(state, user);
      }
    },
  },

  actions: {
    updateUser({ commit, dispatch }: ActionContext<GlobalState, GlobalState>, user: Partial<GlobalState>) {
      commit("updateUser", user);
      dispatch("saveToDb");
    },
    removeUser({ commit, dispatch }: ActionContext<GlobalState, GlobalState>) {
      commit("updateUser", null);
      dispatch("saveToDb");
    },
    async loadFromDb({ commit }: ActionContext<GlobalState, GlobalState>) {
      const data = await db.findOne({});
      if (data) {
        commit("updateUser", data);
      }
    },
    async saveToDb({ state }: ActionContext<GlobalState, GlobalState>) {
      try {
        await db.update({}, state, { upsert: true });
      } catch (error) {
        console.error("Failed to save user to DB:", error);
      }
    },
  },

  getters: {
    getUser(state: GlobalState): GlobalState {
      return state;
    },
  },
});

export default store;
