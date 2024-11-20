import { Module } from 'vuex';
import axios from 'axios';

export interface SDA {
  id: number;
  name: string;
  status: string;
  final_client: string;
  contract_number: string;
  rio: string;
  trunk_infos: {
    username: string;
    secret: string;
    max_calls: number;
  };
  city: string;
  call_code: string;
  country_code: string;
  insee_code: string;
  last_invoice: string;
  create_date: string;
}

export interface SDAState {
  sdas: SDA[];
  currentSDA: SDA | null;
}

const moduleSDA: Module<SDAState, any> = {
  state: {
    sdas: [],
    currentSDA: null,
  },
  mutations: {
    setSDAs(state, sdas: SDA[]) {
      state.sdas = sdas;
    },
    setCurrentSDA(state, sda: SDA) {
      state.currentSDA = sda;
    },
    resetSDAs(state) {
      state.currentSDA = null;
      state.sdas = [];
    }
  },
  actions: {
    async fetchSDAs({ commit, rootState }) {
      try {
        const response = await axios.get(`${process.env.ODOO_API}api/products/sdas?session_id=${rootState.session_id}`);
        commit('setSDAs', response.data.list);
      } catch (error) {
        console.error('Failed to fetch SDAs');
      }
    },
    setCurrentSDA({ commit }, sda: SDA) {
      commit('setCurrentSDA', sda);
    },
    resetSDAs({ commit }) {
      commit('resetSDAs');
    }
  },
  getters: {
    sdas: state => state.sdas,
    currentSDA: state => state.currentSDA,
    filteredSDAs: (state) => (searchText: string, isSDAActif: boolean, isSDAInactif: boolean) => {
      let filteredSDAs = state.sdas;

      if (searchText) {
        const text = searchText.toLowerCase();
        filteredSDAs = filteredSDAs.filter(s => 
          s.name.toLowerCase().includes(text) ||
          s.final_client.toLowerCase().includes(text)
        );
      }

      if (isSDAActif) {
        filteredSDAs = filteredSDAs.filter(s => s.status === 'free');
      }

      if (isSDAInactif) {
        filteredSDAs = filteredSDAs.filter(s => s.status === 'occupied');
      }

      return filteredSDAs;
    },
    totalFreeSdas: state => state.sdas.filter(s => s.status === 'free').length,
    totalOccuppiedSdas: state => state.sdas.filter(s => s.status === 'occupied').length,
    totalSdas: state => state.sdas.length,
  }
};

export default moduleSDA;
