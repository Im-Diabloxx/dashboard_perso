import { Module } from 'vuex';
import Vue from 'vue';

export interface SIM {
  id: number;
  name: string;
  status: string;
  reference: string;
  final_client: string;
  contract_number: string;
  contract_name: string;
  contract_state: string;
  sim_contract: number;
  last_invoice: string;
  create_date: string;
}

export interface SIMState {
  sims: SIM[];
  currentSIM: SIM | null;
}

const moduleSIM: Module<SIMState, any> = {
  state: {
    sims: [],
    currentSIM: null,
  },
  mutations: {
    setSIMs(state, sims: SIM[]) {
      state.sims = sims;
    },
    setCurrentSIM(state, sim: SIM) {
      state.currentSIM = sim;
    },
    resetSIMs(state) {
      state.currentSIM = null;
      state.sims = [];
    }
  },
  actions: {
    async fetchSIMs({ commit, rootState }) {
      try {
        const response = await Vue.prototype.$axios.get(
          `${process.env.ODOO_API}api/v2/products/sims?session_id=${rootState.session_id}`
        );
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }

        commit('setSIMs', response.data.list);
      } catch (error) {
        console.error('Échec de la récupération des SIMs');
      }
    },
    setCurrentSIM({ commit }, sim: SIM) {
      commit('setCurrentSIM', sim);
    },
    resetSIMs({ commit }) {
      commit('resetSIMs');
    }
  },
  getters: {
    sims: state => state.sims,
    currentSIM: state => state.currentSIM,
    filteredSIMs: (state) => (searchText: string, isSIMActif: boolean, isSIMInactif: boolean) => {
      let filteredSIMs = state.sims;

      if (searchText) {
        const text = searchText.toLowerCase();
        filteredSIMs = filteredSIMs.filter(s =>
          s.name.toLowerCase().includes(text) ||
          s.final_client.toLowerCase().includes(text) ||
          s.reference.toLowerCase().includes(text)
        );
      }

      if (isSIMActif) {
        filteredSIMs = filteredSIMs.filter(s => s.status === 'free');
      }

      if (isSIMInactif) {
        filteredSIMs = filteredSIMs.filter(s => s.status === 'occupied');
      }

      return filteredSIMs;
    },
    totalFreeSims: state => state.sims.filter(s => s.status === 'free').length,
    totalOccuppiedSims: state => state.sims.filter(s => s.status === 'occupied').length,
    totalSims: state => state.sims.length,
  }
};

export default moduleSIM;
