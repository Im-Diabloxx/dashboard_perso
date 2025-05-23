import { Module } from 'vuex';
import Vue from 'vue';

export interface Trunk {
  id: number;
  client: string;
  username: string;
  secret: string;
  state: string;
  max_calls: number;
  contract_number: string;
  server_name: string;
  server_cn: string;
  sdas: Array<any>;
  last_invoice: string;
  create_date: string;
}

export interface TrunkState {
  trunks: Trunk[];
  currentTrunk: Trunk | null;
}

const moduleTrunk: Module<TrunkState, any> = {
  state: {
    trunks: [],
    currentTrunk: null,
  },
  mutations: {
    setTrunks(state, trunks: Trunk[]) {
      state.trunks = trunks;
    },
    setCurrentTrunk(state, trunk: Trunk) {
      state.currentTrunk = trunk;
    },
    resetTrunk(state) {
      state.currentTrunk = null;
      state.trunks = [];
    }
  },
  actions: {
    async fetchTrunks({ commit, rootState }) {
      try {
        const apiUrl = process.env.ODOO_API;
        const sessionId = rootState.session_id;
        if (!apiUrl || !sessionId) {
          throw new Error('API URL or session ID is missing');
        }
        const response = await Vue.prototype.$axios.get(`${apiUrl}api/products/trunks?session_id=${sessionId}`);
        commit('setTrunks', response.data.list);
      } catch (error) {
        console.error('Failed to fetch trunks');
      }
    },
    setCurrentTrunk({ commit }, trunk: Trunk) {
      commit('setCurrentTrunk', trunk);
    },
    resetTrunk({ commit }) {
      commit('resetTrunk');
    }
  },
  getters: {
    trunks: state => state.trunks,
    totalConnectedTrunks: state => {
      return Object.values(state.trunks).filter(t => {
        return t.state === 'terminated' || t.state === 'on_finish';
      }).length;
    },
    totalTrunks: state => {
      return Object.values(state.trunks).length;
    },
    currentTrunk: state => state.currentTrunk,
    getSdasFromTrunk: (state) => (username: string) => {
      const index = state.trunks.findIndex(t => t.username === username);
      if (index !== -1) {
        return state.trunks[index]
      }
      return null
    },
    filteredTrunks: (state) => (searchText: string, isTrunkReady: boolean, isTrunkNotReady: boolean) => {
      let filteredTrunks = state.trunks;

      if (searchText) {
        const text = searchText.toLowerCase();
        filteredTrunks = filteredTrunks.filter(t => 
          t.username.toLowerCase().includes(text) ||
          t.secret.toLowerCase().includes(text) ||
          t.client.toLowerCase().includes(text) ||
          t.state.toLowerCase().includes(text)
        );
      }

      if (isTrunkReady) {
        filteredTrunks = filteredTrunks.filter(t => t.state === 'terminated' || t.state === 'on_finish');
      }

      if (isTrunkNotReady) {
        filteredTrunks = filteredTrunks.filter(t => t.state === 'quotation' || t.state === 'order');
      }

      return filteredTrunks;
    }
  }
};

export default moduleTrunk;
