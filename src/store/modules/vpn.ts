import { Module } from 'vuex';
import Vue from 'vue';
import mqtt, { MqttClient } from 'mqtt/dist/mqtt.min.js';

interface Connection {
  virtual_ip: string;
  real_ip: string;
  real_port: string;
  connected_since: string;
}

interface Client {
  id: string | number;
  client_id: string;
  client_label: string;
  status: string;
  virtual_ip: string;
  connections?: { [key: string]: Connection };
  vpn_port: string;
  server_name: string;
  partner_name: any;
  server_id: number;
  note: string;
  note_modification_date: string;
}

interface Server {
  vpn_port: string;
  server_name: string;
  partner_name: any;
  server_id: number;
}

interface VPNState {
  clients: { [key: string]: Client };
  servers: { [key: number]: Server };
  mqttClient: MqttClient | null;
  mqttTopic: string;
  notes: any[];
  phoneConnections: any[];
  session_id: string | null;
  last_change_phone: { type: 'connect' | 'disconnect'; cn: string } | null;
  last_change_ipbx: { type: 'connect' | 'disconnect'; cn: string } | null;
}

const isMultiConnectionServer = (port: string) => port === '9996' || port === '9995' || port === '9999';

const mqttListener = (topic: string, message: Buffer, commit: any, state: VPNState) => {
  try {
    const messageStr = message.toString();
    if (!messageStr.trim()) return;

    const data = JSON.parse(messageStr);
    if (!data || Object.keys(data).length === 0) return;

    if (topic.startsWith('openvpn/')) {
      /*
      const connectionType = data.status === 'connected' ? 'connect' : 'disconnect';
      if (data.vpn_port === '9996') {
        commit('updateLastChangePhone', { type: connectionType, cn: data.client_id });
      }
      if (data.vpn_port !== '9996' && data.vpn_port !== '9999' && data.vpn_port !== '9998') {
        commit('updateLastChangeIpbx', { type: connectionType, cn: data.client_id });
      }
      */
      commit('updateClient', data);

      commit('updateServer', {
        vpn_port: data.vpn_port,
        server_name: data.server_name,
        partner_name: data.partner_name,
        server_id: data.server_id,
      });

      const clientNote = state.notes.find(note => note.client_id === data.client_id);
      if (clientNote) {
        commit('updateClientNote', {
          clientId: data.id,
          note: clientNote.note,
          noteModificationDate: clientNote.note_modification_date,
        });
      }
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
};

const connect = (options: mqtt.IClientOptions, commit: any, state: VPNState, dispatch: any, url: any) => {
  const client = mqtt.connect(url, options);

  client.on('connect', () => {
    commit('setMqttClient', client);
    const topics = state.mqttTopic;
    topics.forEach(topic => {
      client.subscribe(topic, (err: any) => {
        if (err) {
          // console.error(`Error subscribing to topic: ${topic}`, err);
        }
      });
    });
  });

  client.on('message', (topic: string, message: Buffer) => {
    mqttListener(topic, message, commit, state);
  });

  /*
  client.on('close', () => {
    console.log('MQTT client closed');
  });

  client.on('error', (err: any) => {
    console.error('MQTT client error', err);
  });
  */
};

const moduleVPN: Module<VPNState, any> = {
  state: {
    clients: {},
    servers: {},
    mqttClient: null,
    mqttTopic: '',
    notes: [],
    phoneConnections: [],
    session_id: null as string | null,
    last_change_phone: null,
    last_change_ipbx: null
  },

  mutations: {
    setSessionId(state, sessionId: string | null) {
      state.session_id = sessionId;
    },
    setClients(state, clients: Client[]) {
      state.clients = {};
      clients.forEach(client => {
        Vue.set(state.clients, client.id, client);
      });
    },
    setServers(state, servers: Server[]) {
      state.servers = {};
      servers.forEach(server => {
        Vue.set(state.servers, server.server_id, server);
      });
    },
    setNotes(state, notes) {
      state.notes = notes;
    },
    updateLastChangePhone(state, lastChange) {
      state.last_change_phone = lastChange;
    },
    updateLastChangeIpbx(state, lastChange) {
      state.last_change_ipbx = lastChange;
    },
    updateClient(state, updatedClient) {
      const existingClient = state.clients[updatedClient.id];
      if (existingClient) {
        Vue.set(state.clients, updatedClient.id, {
          ...existingClient,
          ...updatedClient
        });
      } else {
        Vue.set(state.clients, updatedClient.id, updatedClient);
      }
    },
    updateClientNote(state, { clientId, note, noteModificationDate }) {
      if (state.clients[clientId]) {
        Vue.set(state.clients[clientId], 'note', note);
        Vue.set(state.clients[clientId], 'note_modification_date', noteModificationDate);
      }
    },
    updateServer(state, updatedServer) {
      Vue.set(state.servers, updatedServer.server_id, updatedServer);
    },
    revokeClient(state, revokedClientId) {
      Vue.delete(state.clients, revokedClientId);
    },
    resetClientsAndServers(state) {
      state.clients = {};
      state.servers = {};
      state.notes = [];
    },
    setMqttTopic(state, topic: string) {
      state.mqttTopic = topic;
    },
    setMqttClient(state, client: MqttClient | null) {
      state.mqttClient = client;
    },
    resetMqttState(state) {
      state.mqttClient = null;
      state.mqttTopic = '';
    }
  },

  actions: {
    updateClientNote({ commit }, { clientId, note, noteModificationDate }) {
      commit('updateClientNote', { clientId, note, noteModificationDate });
    },
    async fetchClientNotes({ commit }) {
      const apiUrl = process.env.ODOO_API;
      const sessionId = this.state.session_id;
      if (!apiUrl || !sessionId) {
        throw new Error('API URL or session ID is missing');
      }
      const response = await Vue.prototype.$axios.get(`${apiUrl}api/v2/ipbx/note/list?session_id=${sessionId}`);
      const notes = response.data.notes;
      commit('setNotes', notes);
    },
    async initializeMqtt({ state, commit, dispatch }) {
      const apiUrl = process.env.ODOO_API;
      const sessionId = this.state.session_id;
      if (!apiUrl || !sessionId) {
        throw new Error('API URL or session ID is missing');
      }
      const response = await Vue.prototype.$axios.get(`${apiUrl}api/v2/mqtt/credentials?session_id=${sessionId}`);
      const topic = response.data.MQTT_TOPIC;
      commit('setMqttTopic', topic);
      commit('setSessionId', sessionId);

      const credentials = {
        url: response.data.MQTT_URL,
        clientId: response.data.MQTT_CLIENT_ID,
        username: response.data.MQTT_USERNAME,
        password: response.data.MQTT_PASSWORD,
      };

      const options = {
        clientId: `'${credentials.clientId}${this.state.id}'`,
        username: credentials.username,
        password: credentials.password,
        keepalive: 25,
        clean: true,
        reconnectPeriod: 10 * 1000
      };

      connect(options, commit, state, dispatch, credentials.url);
    },
    mqttMessage({ commit, state }, { topic, message }) {
      mqttListener(topic, message, commit, state);
    },
    disconnectMqtt({ state, commit }) {
      const client = state.mqttClient;
      if (client && typeof client.end === 'function') {
        client.end();
        commit('resetMqttState');
      }
    },
    updateClient({ commit }, client) {
      commit('updateClient', client);
    },
    updateServer({ commit }, server) {
      commit('updateServer', server);
    },
    revokeClient({ commit }, client_id) {
      commit('revokeClient', client_id);
    },
    resetClientsAndServers({ commit }) {
      commit('resetClientsAndServers');
    }
  },

  getters: {
    clients: state => Object.values(state.clients),
    clientsWithoutPhones: state => 
      Object.values(state.clients).filter(client => 
        client.vpn_port !== '9996' &&
        client.vpn_port !== '9995' &&
        client.vpn_port !== '9999'
      ),
    ipbxOnly: state => 
      Object.values(state.clients).filter(client => 
        client.vpn_port !== '9996' && 
        client.vpn_port !== '9995' &&
        client.vpn_port !== '9998'
      ),
    ipbxWithoutGuests: state => 
      Object.values(state.clients).filter(client => 
        client.vpn_port !== '9996' && 
        client.vpn_port !== '9995' &&
        client.vpn_port !== '9998' && 
        client.vpn_port !== '9999'
      ),
    phonesOnly: state => 
      Object.values(state.clients).filter(client => 
        client.vpn_port === '9996' || client.vpn_port === '9995'
      ),
    servers: state => Object.values(state.servers),
    getVPNClientByCn: (state) => (cn: string) => {
      return Object.values(state.clients).find(client => client.client_id === cn) || null;
    },
    getClientConnections: (state) => (clientId: string) => {
      const client = Object.values(state.clients).find(c => c.client_id === clientId);
      return client?.connections || {};
    },
    isClientConnected: (state) => (clientId: string) => {
      const client = Object.values(state.clients).find(c => c.client_id === clientId);
      if (!client) return false;
      return isMultiConnectionServer(client.vpn_port) 
        ? Object.keys(client.connections || {}).length > 0 
        : client.status === 'connected';
    },
    totalConnectedClients: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients).filter(client => {
        if (isMultiConnectionServer(client.vpn_port)) {
          return Object.keys(client.connections || {}).length > 0;
        }
        return client.status === 'connected' && client.vpn_port !== '9996' && client.vpn_port !== '9995';
      }).length;
    },
    totalClients: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients).filter(client => client.vpn_port !== '9996' && client.vpn_port !== '9995' && client.vpn_port !== '9999').length;
    },
    totalDisconnectedClients: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients).filter(client => {
        if (isMultiConnectionServer(client.vpn_port)) {
          return Object.keys(client.connections || {}).length === 0;
        }
        return client.status === 'disconnected' && client.vpn_port !== '9996' && client.vpn_port !== '9995' && client.vpn_port !== '9999';
      }).length;
    },
    totalClientsGuest: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients)
        .filter(client => client.vpn_port === '9999')
        .reduce((total, client) => total + Object.keys(client.connections || {}).length, 0);
    },
    totalPhones: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients).filter(client => (client.vpn_port === '9996' || client.vpn_port === '9995')).length;
    },
    totalPhonesClientNotActivated: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients).filter(client => (client.vpn_port === '9996' || client.vpn_port === '9995') && client.status === 'disconnected').length;
    },
    totalConnectedPhones: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients)
        .filter(client => client.vpn_port === '9996' || client.vpn_port === '9995')
        .reduce((total, client) => total + Object.keys(client.connections || {}).length, 0);
    },
    totalClientWithNoConnectedPhones: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients)
        .filter(client => 
          (client.vpn_port === '9996' || client.vpn_port === '9995') && 
          (!client.connections || Object.keys(client.connections).length === 0)
        ).length;
    },
    totalDisconnectedPhones: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients).filter(client => 
        (client.vpn_port === '9996' || client.vpn_port === '9995') && Object.keys(client.connections || {}).length === 0
      ).length;
    },
    getActiveConnections: (state) => (clientId: string) => {
      const client = Object.values(state.clients).find(c => c.client_id === clientId);
      if (!client || !client.connections) return [];
      return Object.entries(client.connections).map(([key, conn]) => ({
        id: key,
        ...conn
      }));
    },
    lastChangeIpbx: (state) => state.last_change_ipbx,
    lastChangePhone: (state) => state.last_change_phone,
    getVirtualIpByClientId: (state) => (clientId: any) => {
      const client = Object.values(state.clients).find(client => client.client_id === clientId);
      return client ? client.virtual_ip : null;
    }
  }
};

export default moduleVPN;