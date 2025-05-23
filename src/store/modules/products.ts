import { Module } from 'vuex';

interface VPNClient {
  id: number;
  client_id: string;
  client_label: string;
  status: string;
  virtual_ip: string;
  real_ip: string;
  real_port: string;
  connected_since: string;
  disconnected_since: string;
  vpn_port: string;
  server_name: string;
  partner_name: any;
  server_id: number;
  type: string;
}

interface SDA {
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
  type: string;
}

interface Trunk {
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
  type: string;
}

interface ProductState {
  vpnClients: VPNClient[];
  sdas: SDA[];
  trunks: Trunk[];
  currentProduct: VPNClient | SDA | Trunk | null;
  loading: boolean;
  currentMenu: string;
}

const productsModule: Module<ProductState, any> = {
  state: {
    vpnClients: [],
    sdas: [],
    trunks: [],
    currentProduct: null,
    loading: false,
    currentMenu: 'IPBX'
  },
  mutations: {
    setCurrentProduct(state, product: VPNClient | SDA | Trunk) {
      state.currentProduct = product;
    },
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
    setMenu(state, menu: string) {
      state.currentMenu = menu;
    }
  },
  actions: {
    setCurrentProduct({ commit }, product: VPNClient | SDA | Trunk) {
      commit('setCurrentProduct', product);
    },
    setMenu({ commit }, menu: string) {
      commit('setMenu', menu);
    }
  },
  getters: {
    currentProduct: state => state.currentProduct,
    currentMenu: state => state.currentMenu,
    allProducts: state => [
      ...state.vpnClients.map(client => ({ ...client, type: 'vpn_client' })),
      ...state.sdas.map(sda => ({ ...sda, type: 'sda' })),
      ...state.trunks.map(trunk => ({ ...trunk, type: 'trunk' }))
    ],
  }
};

export default productsModule;
