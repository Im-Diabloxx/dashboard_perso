// @ts-ignore
import {ActionContext, ActionTree, Dictionary, GetterTree, Module, MutationTree} from 'vuex';
import {applyPattern} from "@/utils/ipbx";
import Vue from 'vue'
import store from "@/store/index";
import parsePhoneNumber from 'libphonenumber-js'
import axios from 'axios';

function debugLog(...args) {console.log("[DEBUGPLUS] ", ...args)}

const submenu_list_size = 20;
const default_period_dates = false;
const default_days_period = 1;
const default_sort_order_call_logs = "desc";
const default_sort_key_call_logs = "unix_time";

export interface CallLogStatus {
  answered: boolean,
  queue: boolean,
  transfer: boolean,
  voice_mail: boolean,
  svi: boolean,
  fail: boolean
}

export interface ModuleIPBX {
  cn: string,
  days_period: number,
  days_period_start: number,
  days_period_end: number,
  contacts: any[],
  call_logs: any[],
  call_logs_displayed: any[],
  call_log_raw: any[],
  servers: any[],
  subsidiaries: any[],
  groups: any[],
  users: any[],
  phones: any[],
  materials: any[],
  queues: any[],
  sdas: any[],
  queue_log: any[],
  init: {
    contacts: boolean,
    call_logs: boolean,
    call_logs_displayed: boolean,
    call_log_raw: boolean,
    queue_log: boolean,
  },
  loading: {
    contacts: boolean,
    call_logs: boolean,
    call_logs_displayed: boolean,
    call_log_raw: boolean,
    queue_log: boolean,
  },
  error: {
    contacts: boolean,
    call_logs: boolean,
    call_log_raw: boolean,
    queue_log: boolean,
  },
  page: {
    call_logs: number,
  },
  period: {
    call_log_raw: number,
    queue_log: number,
  },
  sort: {
    order: {
      call_logs: string,
    },
    key: {
      call_logs: string,
    },
  },
  search_call_logs: string[]
}

class State implements ModuleIPBX {
  cn: string = "";
  days_period: number = default_days_period;
  days_period_start: number = 0;
  days_period_end: number = 0;
  contacts: any[] = [];
  call_logs: any[] = [];
  call_logs_displayed: any[] = [];
  call_log_raw: any[] = [];
  queue_log: any[] = [];
  servers: any[] = [];
  subsidiaries: any[] = [];
  groups: any[] = [];
  users: any[] = [];
  phones: any[] = [];
  materials: any[] = [];
  queues: any[] = [];
  sdas: any[] = [];
  init = {
    contacts: false,
    call_logs: false,
    call_logs_displayed: false,
    call_log_raw: false,
    queue_log: false,
  };
  loading = {
    contacts: false,
    call_logs: false,
    call_logs_displayed: false,
    call_log_raw: false,
    queue_log: false,
  };
  error = {
    contacts: false,
    call_logs: false,
    call_log_raw: false,
    queue_log: false,
  };
  page = {
    call_logs: 0,
  };
  period = {
    call_log_raw: default_days_period,
    queue_log: default_days_period,
  };
  sort = {
    order: {
      call_logs: default_sort_order_call_logs,
    },
    key: {
      call_logs: default_sort_key_call_logs,
    },
  };
  search_call_logs: string[] = [];
}

const state: State = new State();

const mutations: MutationTree<State> = {
  SET_CN(state, cn: string) {
      state.cn = cn;
  },
  SET_CALL_LOGS_PERIOD(state, days: number) {
    state.days_period = days;
  },
  SET_CALL_LOGS_DATES(state, body: object) {
    state.days_period_start = body.start;
    state.days_period_end = body.end;
  },
  SET_CALL_LOGS_SORT(state, body: object) {
    state.sort.order.call_logs = body.order;
    state.sort.key.call_logs = body.key;
  },
  SET_CALL_LOGS_SEARCH(state, keys: string[]) {
    state.search_call_logs = keys;
  },
  SET_CONTACTS(state: State, body: any[]) {
    state.contacts.length = 0;
    state.contacts = [
      ...new Map(body.map((item) => [item["id_contact"], item])).values(),
    ].sort((x, y) => x.title.localeCompare(y.title)) ;
  },
  SET_CONTACT_LOADING(state: State, body: boolean) {
    state.loading.contacts = body;
  },
  SET_CONTACT_ERROR(state: State, body: boolean) {
    state.error.contacts = body;
  },
  SET_CALL_LOGS_RAW(state: State, body: any[]) {
    state.call_log_raw.length = 0;
    state.call_log_raw = body;
  },
  MERGE_CALL_LOGS_RAW(state: State, body: any[]) {
    const ids_already_there = state.call_log_raw.map(msg => msg.id);
    const to_add = body.filter(msg => !ids_already_there.includes(msg.id));

    if (to_add.length > 0) {
      state.call_log_raw = state.call_log_raw.concat(to_add).sort((x, y) => y.id - x.id);
    }
  },
  SET_CALL_LOGS_RAW_LOADING(state: State, body: boolean) {
    state.loading.call_log_raw = body;
  },
  SET_CALL_LOGS_RAW_ERROR(state: State, body: boolean) {
    state.error.call_log_raw = body;
  },
  INCREMENT_PAGE_CALL_LOGS_RAW(state: State, body: number) {
    state.period.call_log_raw += 1;
  },
  SET_QUEUE_LOG(state: State, body: any[]) {
    state.queue_log.length = 0;
    state.queue_log = body;
  },
  MERGE_QUEUE_LOG(state: State, body: any[]) {
    const ids_already_there = state.queue_log.map(msg => msg.unique_id);
    const to_add = body.filter(msg => !ids_already_there.includes(msg.unique_id));

    if (to_add.length > 0) {
      state.queue_log = state.queue_log.concat(to_add).sort((x, y) => y.unique_id - x.unique_id);
    }
  },
  SET_QUEUE_LOG_LOADING(state: State, body: boolean) {
    state.loading.queue_log = body;
  },
  SET_QUEUE_LOG_ERROR(state: State, body: boolean) {
    state.error.queue_log = body;
  },
  INCREMENT_PAGE_QUEUE_LOG(state: State, body: number) {
    state.period.queue_log += 1;
  },
  SET_CALL_LOGS_LOADING(state: State, body: boolean) {
    state.loading.call_logs = body;
  },
  SET_CALL_LOGS(state: State, body: any[]) {
    state.call_logs.length = 0;
    state.call_logs = body;
    state.init.call_logs = true;
  },
  MERGE_CALL_LOGS(state: State, body: any[]) {
    const ids_already_there = state.call_logs.map(msg => msg.unique_id);
    const to_add = body.filter(msg => !ids_already_there.includes(msg.unique_id));

    if (to_add.length > 0) {
      state.call_logs = state.call_logs.concat(to_add);
    }
  },
  SET_CALL_LOGS_DISPLAYED(state: State, body: any[]) {
    state.call_logs_displayed.length = 0;
    state.call_logs_displayed = body;
    state.init.call_logs_displayed = true;
  },
  SET_CALL_LOGS_DISPLAYED_LOADING(state: State, body: boolean) {
    state.loading.call_logs_displayed = body;
  },
  RESET_CALL_LOGS(state) {
    state.queue_log.length = 0;
    state.call_log_raw.length = 0;
    state.call_logs.length = 0;
    state.call_logs_displayed.length = 0;

    state.init.queue_log = false;
    state.init.call_log_raw = false;
    state.init.call_logs = false;
    state.init.call_logs_displayed = false;

    state.loading.queue_log = false;
    state.loading.call_log_raw = false;
    state.loading.call_logs = false;
    state.loading.call_logs_displayed = false;

    state.error.queue_log = false;
    state.error.call_log_raw = false;
    state.error.call_logs = false;

    state.period.queue_log = 0;
    state.period.call_log_raw = 0;
    state.page.call_logs = 0;

    state.sort.order.call_logs = default_sort_order_call_logs;
    state.sort.key.call_logs = default_sort_key_call_logs;
    state.search_call_logs = [];
  },
  RESET_ALL(state) {
    state.cn = "";
    state.days_period = default_days_period;
    state.days_period_start = 0;
    state.days_period_end = 0;
    state.contacts.length = 0;
    state.queue_log.length = 0;
    state.call_log_raw.length = 0;
    state.call_logs.length = 0;
    state.call_logs_displayed.length = 0;

    state.init.contacts = false;
    state.init.queue_log = false;
    state.init.call_log_raw = false;
    state.init.call_logs = false;
    state.init.call_logs_displayed = false;

    state.loading.contacts = false;
    state.loading.queue_log = false;
    state.loading.call_log_raw = false;
    state.loading.call_logs = false;
    state.loading.call_logs_displayed = false;

    state.error.contacts = false;
    state.error.queue_log = false;
    state.error.call_log_raw = false;
    state.error.call_logs = false;

    state.period.queue_log = 0;
    state.period.call_log_raw = 0;
    state.page.call_logs = 0;

    state.sort.order.call_logs = default_sort_order_call_logs;
    state.sort.key.call_logs = default_sort_key_call_logs;
    state.search_call_logs = [];

    state.servers = [];
    state.subsidiaries = [];
    state.groups = [];
    state.users = [];
    state.phones = [];
    state.materials = [];
    state.queues = [];
    state.sdas = [];

  },
  SET_SERVERS(state, servers) {
    state.servers = servers;
  },
  SET_SUBSIDIARIES(state, subsidiaries) {
    state.subsidiaries = subsidiaries;
  },
  SET_GROUPS(state, groups) {
    state.groups = groups;
  },
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_PHONES(state, phones) {
    state.phones = phones;
  },
  SET_MATERIALS(state, materials) {
    state.materials = materials;
  },
  SET_QUEUES(state, queues) {
    state.queues = queues;
  },
  SET_SDAS(state, sdas) {
    state.sdas = sdas;
  }
}

const getters: GetterTree<State, any> = {
  getServers: state => state.servers,
  getSubsidiaries: state => state.subsidiaries,
  getGroups: state => state.groups,
  getUsers: state => state.users,
  getPhones: state => state.phones,
  getMaterials: state => state.materials,
  getQueues: state => state.queues,
  getSdas: state => state.sdas,
  getCn(state: State) {
      return state.cn;
  },
  getContacts(state: State) {
    return state.contacts;
  },
  getCallLogs(state: State) {
    return state.call_logs_displayed;
  },
  getCallLogsInitialized(state: State) {
    return state.init.call_logs_displayed
  },
  getCallLogsLoading(state: State) {
    return state.loading.call_logs_displayed
  },
  getCallLog(state: State) {
    return (unique_id: string) => {
      return state.call_logs.find(item => (item.unique_id === unique_id));
    }
  },
  getCallLogsPeriod(state: State) {
    return state.days_period;
  },
  getCallLogsDaysLoaded(state: State) {
    return state.days_period*state.period.queue_log;
  }

}


function getCalleerIdentity(calleer): string {
  let identity = "";

  if (calleer?.contact?.title) {
    identity = calleer.contact.title;
    if (calleer?.number_E164) {
      identity += " (" + calleer.number_E164 + ")";
    }
  }
  else if (calleer?.name) {
    identity = calleer.name
    if (calleer?.number_E164) {
      identity += " (" + calleer.number_E164 + ")";
    }
  }
  else if(calleer.number_E164) {
    identity = calleer.number_E164;
  }

  return identity
}


function getCallerInfo(log: object) {
  let caller = {};
  if (log.type === "incoming") {
    caller.contact = getContact(log.src);
  }
  else if (log.src_id_user) {
    caller.contact = getUserInfoByUserID(log.src_id_user);
  }
  else {
    caller.contact = getContact(log.src);
  }
  caller.number = log.src;
  caller.number_E164 = numberToE164(log.src);

  caller.identity = getCalleerIdentity(caller);

  return caller;
}

function isInteger(str: string): boolean {
  return /^\d+$/.test(str);
}

function getCalleeInfo(log: object) {
  let callee = {};
  let contact;
  if (log.type === "incoming") {
    contact = getContact(log.dst);
  }
  else if (log.dst_id_user) {
    contact = getUserInfoByUserID(log.dst_id_user);
  }
  else {
    contact = getContact(log.dst);
  }
  if (contact)
    callee.contact = contact;

  let number = log.dst;
  if (isInteger(log.dst))
    number = log.dst;
  else if (log.sda)
    number = log.sda;

  if (number != "") {
    callee.number = number;
    callee.number_E164 = numberToE164(number)
    callee.identity = getCalleerIdentity(callee);
  }

  return callee;
}


function getGeneralInfo(log: object) {
  let general = {
    unique_id: log.unique_id,
    unix_time: log.unix_time,
    date: this.$dayjs.unix(log.unix_time).locale('FR-fr').format('DD-MM-YYYY'),
    time: this.$dayjs.unix(log.unix_time).locale('FR-fr').format('HH:mm:ss'),
    type: log.type,
    sda: log.sda,
    ctx: log.ctx,
  }

  return general;
}

function  numberToE164(number: string) {
  const phoneNumber = parsePhoneNumber(number, 'FR')
  if (phoneNumber && phoneNumber.isValid()) {
    return phoneNumber.formatInternational();
  }
  return number;
}

function getNameCallerID(input: string): string {
  const regex = /->(.*?)"/;
  const match = input.match(regex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  return "";
}

function analyzeCallLogFlow(call_flow: any[], queue_logs: any []) {
  let general = {};
  let status = {} as CallLogStatus;
  let caller = {};
  let last_callee = undefined;
  let last_call_duration = 0;
  let events = [];
  let hangup_time = 0;
  let start_time = 0;
  let previous_start = 0;
  let queueParsed = [];
  let transferPending = undefined;


  for (const [index, log] of call_flow.entries()) {
    //Get caller infos
    if (index === 0) {
      caller = getCallerInfo(log);
      general = getGeneralInfo(log);
    }

    let queue_log = undefined;
    if ((log.lastapp === "Queue" || log.lastapp === "Hangup") && !queueParsed.includes(log.unique_id)) //Hangup: cas appel queue avec EXITWITHTIMEOUT
      queue_log = queue_logs.find(queue => queue.unique_id === log.unique_id)

    if (queue_log) {
      //Pour ne traiter qu'une fois les queues events de ce unique_id
      queueParsed.push(log.unique_id)
      let start_queue = 0;
      for (const event of queue_log.events) {
        if (event.event === "ENTERQUEUE") {
          start_queue = event.unix_time;
          const name = event.queue_name;

          if (transferPending) {
            const callee = {
              type: "queue",
              name: "la file d'attente " + name,
            }
            events.push({ type: transferPending.type, action: "Transfer", action_type: transferPending.action_type, start: transferPending.start, callee: callee });
            status.transfer = true;
            transferPending = undefined;
          }

          events.push({ type: "queue", action: "Enter", start: event.unix_time, name: name });
          status.queue = true;
          last_callee = { type: "queue", name: name };
        }
        else if (event.event === "CONNECT") {
          const contact = getUserInfoByUserID(event.id_user);
          if (!contact) 
            continue; //Appel nom pris par un membre (playback automatique)

          const number = contact?.phones?.find(p => p.type === "INTERNAL_NUMBER")?.number || "";
          const start = event.unix_time - event.data3;
          const duration = Number(event.data3);
          const name = event.queue_name;
          const callee = {
            contact: contact,
            number: number,
            number_E164: number,
            id_phone: event.id_phone,
            duration: duration
          };
          const queue = {
            name: name,
          };

          const eventToUpdate = events.find(e => e.type === "queue" && e.action === "Ring" && e.start === start);
          if (eventToUpdate) {
            let calle_exist = eventToUpdate.callees.filter(c => c.number !== callee.number);
            calle_exist.push(callee);
            eventToUpdate.callees = calle_exist;
            eventToUpdate.duration = duration;
          } else {
            events.push({ type: "queue", action: "Ring", start: start, duration: duration, queue: queue, callees: [callee] });
          }

          previous_start = start;
          hangup_time = start + duration;
        }
        else if (event.event === "BLINDTRANSFER" || event.event === "ATTENDEDTRANSFER") {
          const start = previous_start + Number(event.data3);
          const duration = event.unix_time - start;
          const contact = getUserInfoByUserID(event.id_user);
          const number = contact?.phones?.find(p => p.type === "INTERNAL_NUMBER")?.number || "";
          const name = event.queue_name;
          const callee = {
            contact: contact,
            number: number,
            number_E164: number,
          };
          const queue = {
            name: name,
          };
          events.push({ type: "queue", action: "Call", start: start, duration: duration , queue: queue, callee: callee });

          if (event.event === "BLINDTRANSFER") {
            transferPending = {
              type: "queue",
              action_type: "Blind",
              start: event.unix_time,
              callee: {
                contact: getContact(event.data1),
                number: event.data1,
                number_E164: numberToE164(event.data1)
              }
            };
          }
          else {
            transferPending = {
              type: "queue",
              action_type: "Attended",
              start: event.unix_time
            };
          }          
          hangup_time = event.unix_time
        }
        else if (event.event === "COMPLETEAGENT" || event.event === "COMPLETECALLER") {
          const start = event.unix_time - event.data2;
          const duration = Number(event.data2);
          const contact = getUserInfoByUserID(event.id_user);
          if (!contact) 
            continue; //Appel nom pris par un membre (playback automatique)
          const number = contact?.phones?.find(p => p.type === "INTERNAL_NUMBER")?.number || "";
          const name = event.queue_name;
          const callee = {
            contact: contact,
            number: number,
            number_E164: numberToE164(number),
          };
          const queue = {
            name: name,
          };
          events.push({ type: "queue", action: "Call", start: start, duration: duration, queue: queue, callee: callee});
          status.answered = true;
          last_callee = callee;
          last_call_duration = duration;
          hangup_time = event.unix_time
        }
        else if (event.event === "RINGNOANSWER") { //Aucum membre de la file d'attente n'a répondu.
          if (start_queue === 0)
            start_queue = event.unix_time;
          const start = start_queue;
          const duration = event.unix_time - start;
          const contact = getUserInfoByUserID(event.id_user);
          const number = contact?.phones?.find(p => p.type === "INTERNAL_NUMBER")?.number || "";
          const name = event.queue_name;
  
          const callee = {
            contact: contact,
            number: number,
            number_E164: number,
            id_phone: event.id_phone,
            duration: duration
          };
          const queue = {
            name: name,
          };
          const eventToUpdate = events.find(e => e.type === "queue" && e.action === "Ring" && e.start === start);
          if (eventToUpdate) {
            let calle_exist = eventToUpdate.callees.filter(c => c.number !== callee.number);
            calle_exist.push(callee);
            eventToUpdate.callees = calle_exist;
            eventToUpdate.duration = duration;
          } else {
            events.push({ type: "queue", action: "Ring", start: start, duration: duration, queue: queue, callees: [callee] });
          }
          status.answered = false;
          last_callee = { type: "queue", name: name }
          last_call_duration = duration;
          hangup_time = event.unix_time;
        }
        else if (event.event === "RINGCANCELED") { //Aucum membre de la file n'est disponible.
          const start = start_queue;
          const duration = event.unix_time - start;
          const contact = getUserInfoByUserID(event.id_user);
          const number = contact?.phones?.find(p => p.type === "INTERNAL_NUMBER")?.number || "";
          const name = event.queue_name;

          const callee = {
            contact: contact,
            number: number,
            number_E164: number,
            id_phone: event.id_phone,
            duration: duration
          };
          const queue = {
            name: name,
          };
          const eventToUpdate = events.find(e => e.type === "queue" && e.action === "Wait" && e.start === start);
          if (eventToUpdate) {
            let calle_exist = eventToUpdate.callees.filter(c => c.number !== callee.number);
            calle_exist.push(callee);
            eventToUpdate.callees = calle_exist;
            eventToUpdate.duration = duration;
          } else {
            events.push({ type: "queue", action: "Wait", start: start, duration: duration, queue: queue, callees: [callee] });
          }
          status.answered = false;
          last_callee = { type: "queue", name: name }
          last_call_duration = duration;
          hangup_time = event.unix_time;
        }
        else if (event.event === "ABANDON") { //Fin d'appel par l'appelant.
          const start = event.unix_time;
          const name = event.queue_name;
          events.push({ type: "queue", action: "Abandon", start: start });
          status.answered = false;
          last_callee = { type: "queue", name: name };
          last_call_duration = start - start_queue;
          hangup_time = start+1;
        }
        else if (event.event === "EXITWITHTIMEOUT") { //Fin d'appel par l'appelant.
          const start = event.unix_time;
          const duration = Number(event.data3); //Doit correspondre au tempps d'attente max configuré pour la queue
          const name = event.queue_name;
          events.push({ type: "queue", action: "Timeout", start: start, configuration: duration });
          status.answered = false;
          last_callee = { type: "queue", name: name }
          last_call_duration = duration;
          hangup_time = start;
        }
      }
    }
    else if (log.lastapp === "Dial" && log.disposition === "NO ANSWER") {
      const start = log.unix_time;
      const duration = log.duration;
      const callee = {
        contact: getContact(log.dst),
        number: log.dst,
        number_E164: numberToE164(log.dst),
        duration: duration
      };

      const eventToUpdate = events.find(e => e.type === "direct" && e.action === "Ring" && e.start === start);
      if (eventToUpdate) {
        eventToUpdate.callees.push(callee);
      } else {
        events.push({ type: "direct", action: "Ring", start: start, duration: duration, callees: [callee] });
      }
      status.answered = false;
      last_callee = callee;
      last_call_duration = log.duration;

      hangup_time = log.unix_time + log.duration;
      previous_start = log.unix_time;
    }
    else if ((log.lastapp === "VoiceMail" || log.lastapp === "VoiceMailMain") && log.disposition === "ANSWERED") { //Mevo
      const start = log.unix_time;
      const duration = log.duration;// - (log.unix_time - previous_start);
      let action_type = "Speak";
      let callee = {};
      if (log.dst === "*0*") {
        status.answered = true;
        action_type = "Read";
        callee = {
          name: "Messagerie" ,
          number: log.dst,
          number_E164: numberToE164(log.dst),
        };

      }
      else if (isInteger(log.dst)) {
        callee = {
          contact: getContact(log.dst),
          number: log.dst,
          number_E164: numberToE164(log.dst),
        };
      }
      else {
        callee.name = getNameCallerID(log.caller_id);
        if (log.sda) {
          callee.number = log.sda;
          callee.number_E164 = numberToE164(log.sda);
        }
      }
     
      events.push({ type: "direct", action: "VoiceMail", action_type: action_type, start: start, duration: duration, callee: callee});
      status.voice_mail = true;
      last_callee = callee;
      last_call_duration = duration;
      transferPending = undefined;
      hangup_time = start + duration;
    }
    else if (log.lastapp === "Dial" && log.disposition === "ANSWERED") {
      let start = log.unix_time;
      let start_call = log.unix_time;
      let duration_ring = -1;
      let callee = undefined;

      if (status.transfer) //Cas lorsqu'on a transféré vers une file d'attente
        continue;

      if (transferPending) {
        callee = transferPending.callee;    
        start = log.unix_time;
       //on ne peut pas le connaitre la durée de la sonnerie.
      }
      else if (events.find(e => e.action == "Call" ) && log.type !== "outgoing") { //cas déjà un appel répondu
        const contact = getUserInfoByUserID(log.dst_id_user);
        const number = contact?.phones?.find(p => p.type === "INTERNAL_NUMBER")?.number || "";
        callee = {
          contact: contact,
          number: number,
          number_E164: number,
        };

        start = log.unix_time;

        transferPending = {
          type: "direct",
          action_type: "Blind",
          start: log.unix_time,
          callee: callee
        };
      }
      else if (log.type !== "outgoing") {
        callee = {
          contact: getUserInfoByUserID(log.dst_id_user),
          number: log.dst,
          number_E164: numberToE164(log.dst),
        };  
        start = log.unix_time;
        duration_ring = log.duration - log.billsec;
      }
      else {
        callee = {
          contact: getContact(log.dst),
          number: log.dst,
          number_E164: numberToE164(log.dst),
        };     
        start = log.unix_time;
        duration_ring = log.duration - log.billsec;
      }
      

      if (duration_ring >= 0) {
        callee.duration = duration_ring;
        start_call += duration_ring;
      }

      if (transferPending) {
        events.push({ type: transferPending.type, action: "Transfer", action_type: transferPending.action_type, start: transferPending.start, callee: transferPending.callee });
        status.transfer = true;
        transferPending = undefined;
      }
      
      const eventToUpdate = events.find(e => e.type === "direct" && e.action === "Ring" && e.start === start);
      if (eventToUpdate) {
        eventToUpdate.callees.push(callee);
      }
      else {
        events.push({ type: "direct", action: "Ring", start: start, duration: duration_ring, callees: [callee] });
      }
      last_callee = callee;
      last_call_duration = log.billsec;

      events.push({ type: "direct", action: "Call", start: start_call, duration: log.billsec, callee: callee });
      status.answered = true;
      
      hangup_time = log.unix_time + log.duration;
    }
    else if ((log.lastapp === "Dial" && log.disposition === "FAILED") ||
             (log.lastapp === "Set" && log.disposition === "FAILED") ||
             (log.lastapp === "Goto" && log.disposition === "FAILED")) {
      const start = log.unix_time;
      last_callee = getCalleeInfo(log);
      last_call_duration = log.billsec;
      events.push({ type: "direct", action: "Fail", start: start, callee: last_callee });
      status.fail = true;
      hangup_time = start;
    }
    else if (log.lastapp === "Dial" && log.disposition === "CONGESTION") {
      const start = log.unix_time;
      const duration = log.duration;
      last_callee = getCalleeInfo(log);
      last_call_duration = duration;
      events.push({ type: "direct", action: "Congestion", start: start, callee: last_callee, duration: duration });
      status.fail = true;
      hangup_time = start + duration;
    }
    else if ((log.lastapp === "Playback" || log.lastapp === "WaitExten") && log.disposition === "ANSWERED") {
      const start = log.unix_time
      const duration = log.duration;
      
      if (log.ctx.startsWith("svi_")) {
        const svi = {
          name: "SVI",
        }; 
        events.push({ type: "svi", action: "Enter", start: start, svi: svi });
        events.push({ type: "svi", action: "Playback", start: start, svi: svi, duration: duration });
        status.svi = true;
        last_callee = {type: "svi", name: "SVI"};
      }
      else {
        events.push({ type: "direct", action: "Playback", start: start, duration: duration });
        last_callee = getCalleeInfo(log);
      }

      last_call_duration = duration;
      hangup_time = start + duration;
    }
    else if (log.lastapp === "Wait" && log.disposition === "NO ANSWER") {
      const start = log.unix_time;
      const duration = log.duration;
      const callee = {
        contact: getContact(log.dst),
        number: log.dst,
        number_E164: numberToE164(log.dst),
        duration: duration
      };

      events.push({ type: "direct", action: "Wait", start: start, duration: duration, callee: callee });
      status.answered = false;
      last_callee = callee;
      last_call_duration = log.duration;

      hangup_time = log.unix_time + log.duration;
      previous_start = log.unix_time;

    }
    else if (log.lastapp === "ConfBridge" && log.disposition === "ANSWERED") {
      const start_call = log.unix_time
      const callee = {
        name: "Bridge",
        number: log.dst,
        number_E164: numberToE164(log.dst),
        identity : getCalleerIdentity(last_callee)
      }; 

      events.push({ type: "bridge", action: "Call", start: start_call, duration: log.billsec, callee: callee });
      status.answered = true;
      last_callee = callee;
      last_call_duration = log.billsec;

      hangup_time = log.unix_time + log.duration;

    }
    else if (log.lastapp === "Hangup" && log.disposition === "ANSWERED") {
      if (queueParsed.includes(log.unique_id))
        continue; //Déjà traiter dans les avec la table queue_log
      status.answered = false;
      const callee = {
        contact: getContact(log.dst),
        number: log.dst,
        number_E164: numberToE164(log.dst),
        duration: 0
      };
      last_callee = callee;
      last_call_duration = 0;

      hangup_time = log.unix_time + log.duration;
    }
    else if (log.lastapp === "Queue" && log.disposition === "NO ANSWER") {
      if (queueParsed.includes(log.unique_id))
        continue; //Déjà traiter dans les avec la table queue_log

      status.answered = false;
      const start = log.unix_time
      const duration = log.duration
      const callee = {
        contact: getContact(log.dst),
        number: log.dst,
        number_E164: numberToE164(log.dst),
      };
      last_callee = callee;
      last_call_duration = 0;

      hangup_time = start + duration;
    }
    else if (log.lastapp === "Queue" && log.disposition === "ANSWERED") {
      if (queueParsed.includes(log.unique_id))
        continue; //Déjà traiter dans les avec la table queue_log

      status.answered = false;
      const start = log.unix_time
      const duration = log.duration
      const callee = {
        contact: getContact(log.dst),
        number: log.dst,
        number_E164: numberToE164(log.dst),
        duration: duration
      };
      events.push({ type: "queue", action: "Call", start: start, duration: duration, callee: callee });
      last_callee = callee;
      last_call_duration = duration;

      hangup_time = start + duration;
    }
    else if (log.lastapp === "SayDigits") {
      status.answered = false;
      const start = log.unix_time
      const duration = log.duration
      const callee = {
        contact: getContact(log.dst),
        number: log.dst,
        number_E164: numberToE164(log.dst),
      };
      events.push({ type: "direct", action: "NotConfigured", start: start, duration: duration, callee: callee });
      last_callee = callee;
      last_call_duration = 0;

      hangup_time = start + duration;
    }
  }
  
  events = events.sort((a, b) => a.start - b.start);
  //Recalcule des durations car il peut y avoir des erreurs.
  for (let i = 0; i < events.length - 1; i++) {
    events[i].duration = events[i + 1].start - events[i].start;
  }

  // Ajout du premier event
  const firstElemet = events[0];
  if (firstElemet?.start)
    start_time = firstElemet.start;
  else
    start_time = call_flow[0].unix_time;
  events.unshift({ type: "Start", action: general.type, start: start_time, sda: general.sda });

  // Ajout du dernier event
  const lastEvent = events[events.length - 1];
  if (!lastEvent.duration)
    lastEvent.duration = 0;
  if ((lastEvent.start + lastEvent.duration) > hangup_time || hangup_time == 0)
    hangup_time = lastEvent.start + lastEvent.duration;
  events.push({ type: "Hangup", action: "Hangup", start: hangup_time });

  // Vérifie si on a bien identifié le destinataire 
  if (last_callee == undefined) {
    if (lastEvent.callee) {
      last_callee = lastEvent.callee;
    }
    else {
      last_callee = {
        contact: getContact(call_flow[0].dst),
        number: call_flow[0].dst,
        number_E164: numberToE164(call_flow[0].dst),
      }
    }
  }
  if (!last_callee.identity)
    last_callee.identity = getCalleerIdentity(last_callee);

  general.last_call_duration = last_call_duration;
  general.session_duration = general.unix_time - hangup_time;
  
  return {general: general, status: status, caller: caller, callee: last_callee, events: events}
}


function getUserInfoByInternalNumber(phone_number: string) {
  let contact = store.state.ipbx.contacts.filter(contact => contact?.phones.some((phone: any) => phone.number === phone_number && phone.type === "INTERNAL_NUMBER"));
  if (contact.length === 0)
    return undefined;

  return contact[0];
}

function getUserInfoByNumber(phone_number: number) {
  let contact = store.state.ipbx.contacts.filter(contact => contact?.phones.some((phone: any) => phone.number === phone_number));

  if (contact.length === 0 || contact.length > 1)
    return undefined;

  return contact[0];
}

function getUserInfoByUserID(id_user: number) {
  let contact = store.state.ipbx.contacts.filter(contact => Number(contact.id_user) === id_user);

  if (contact.length === 0)
      return undefined;

  return contact[0];
}


function getContact(number: string) {
  let contact = getUserInfoByInternalNumber(number);
  if (contact) 
    return contact;

  contact = getUserInfoByNumber(number);
  if (contact)
    return contact;
}


function transform_contact(contactResponeses: any[]): any[] {
  return contactResponeses.map(contact => {
      return {
          title: applyPattern("%f %L", contact.firstname || "", contact.lastname || ""),
          ...contact,
      }
  });
}

function transform_queue_log(queue_log_raw: any[]): any[] {
  const groupedLogs = queue_log_raw.reduce((acc, log) => {
      if (!acc[log.unique_id]) {
          acc[log.unique_id] = {
              unique_id: log.unique_id,
              name: log.queue_name,
              events: []
          };
      }
      acc[log.unique_id].events.push(log);
      return acc;
  }, {});

  const queue_log = Object.values(groupedLogs).map(group => {
      // Tri du tableau
      group.events.sort((a, b) => {
        // Comparaison des unix_time
          if (a.unix_time !== b.unix_time) {
            return a.unix_time - b.unix_time;
        }
        
        // Si unix_time est égal, priorité à "ENTERQUEUE"
        if (a.event === "ENTERQUEUE" && b.event !== "ENTERQUEUE") {
            return -1;
        }
        if (a.event !== "ENTERQUEUE" && b.event === "ENTERQUEUE") {
            return 1;
        }
        
        // Si les deux sont égaux et aucun n'est "ENTERQUEUE", ils sont égaux
        return 0;
      });
      return group;
  });

  return queue_log;
}

// call_log_raw doit être rangé dans l'ordre avec unique_id
function transform_call_logs(call_log_raw: any[], queue_log: any[]): any[] {
  let call_logs = [];
  let groupMap = new Map();

  const addToGroup = (group, item) => {
    group.call_flow.push(item);
    if (!group.unique_ids.includes(item.unique_id)) {
      group.unique_ids.push(item.unique_id);
    }
  };

  //Groups calls informations
  for (const item of call_log_raw) {
    let group = null;
    //On vérifie s'il existe déjà un groupe associé à cette entrée
    for (const [key, value] of groupMap.entries()) {
      if (value.unique_ids.includes(item.linked_id)) {
        group = value;
        break;
      }
    }
  
    if (!group) {
      //Création d'un nouveau groupe
      group = {
        unique_id: item.linked_id,
        call_flow: [],
        unique_ids: [item.linked_id]
      };
      groupMap.set(item.linked_id, group);
    }
    addToGroup(group, item);
  }

  
  // Finalize remaining groups
  for (const group of groupMap.values()) {
    if (group) {
      const queue_logs = queue_log.filter(log => group.unique_ids.includes(log.unique_id));
      if (group.call_flow.length === 0) {
        console.error('Call empty for: ', group);
        continue;
      }
      const call_flow = group.call_flow.sort((a, b) => a.unix_time - b.unix_time); // Trie par unix_time
      const {general, status, caller, callee, events} = analyzeCallLogFlow(call_flow, queue_logs);
      const call =  {
        unique_id: general.unique_id,
        unix_time: general.unix_time,
        date: general.date,
        time: general.time,
        type: general.type,
        sda: general.sda,
        ctx: general.ctx,
        caller: caller,
        callee: callee,
        last_call_duration: general.last_call_duration,
        session_duration: general.session_duration,
        call_flow: call_flow,
        unique_ids: group.unique_ids,
        queue_logs: queue_logs,
        status: status,
        events: events
      }
      call_logs.push(call);
    }
  }
  return call_logs;
}

function search_call_logs(call_logs: any[], query: string):  any[] {
  const queryLowerCase = query.toLowerCase();
  const search = (call) => {
    return ((call.date && call.date.toLowerCase().includes(queryLowerCase)) ||
        (call.time && call.time.toLowerCase().includes(queryLowerCase)) ||
        (call.callee?.identity && call.callee.identity.toLowerCase().includes(queryLowerCase)) ||
        (call.caller?.identity && call.caller.identity.toLowerCase().includes(queryLowerCase)) );
  };
  return call_logs.filter(call_log => search(call_log));
};


function sort_call_logs(call_logs: any[], key: string, order: string ): any[] {
  switch (key) {
    case 'unix_time':
      if (order === "asc")
        return call_logs.sort((a, b) => a.unix_time - b.unix_time);
      else
        return call_logs.sort((b, a) => a.unix_time - b.unix_time);
    case 'type':
      if (order === "asc")
        return call_logs.sort((a, b) => a.type.localeCompare(b.type));
      else
        return call_logs.sort((b, a) => a.type.localeCompare(b.type));
    case 'caller':
      if (order === "asc")
        return call_logs.sort((a, b) => a.caller.identity.localeCompare(b.caller.identity));
      else
        return call_logs.sort((b, a) => a.caller.identity.localeCompare(b.caller.identity));
    case 'callee':
      if (order === "asc")
        return call_logs.sort((a, b) => a.callee.identity.localeCompare(b.callee.identity));
      else
        return call_logs.sort((b, a) => a.callee.identity.localeCompare(b.callee.identity));
    case 'last_call_duration':
      if (order === "asc")
        return call_logs.sort((a, b) => a.last_call_duration - b.last_call_duration);
      else
        return call_logs.sort((b, a) => a.last_call_duration - b.last_call_duration);
    default:
      console.warn('Sort Call logs not support key: ', key);
      return call_logs;
  }  
}

function transform_call_logs_displayed( call_logs: any[] ):any[] {
  for (const searchKey of store.state.ipbx.search_call_logs)
    call_logs = search_call_logs(call_logs, searchKey);

  return sort_call_logs(call_logs, store.state.ipbx.sort.key.call_logs, store.state.ipbx.sort.order.call_logs);
}

const header = {
  'Content-Type': 'application/json'
}

const actions: ActionTree<State, any> = {
  // @ts-ignore
  async fetchSubsidiaries({ commit, getters, state }) {
    const sessionId = getters.getUser.session_id;
    const cn = state.cn;
    try {
      const response = await axios.get(`${process.env.ODOO_API}api/v2/ipbx/subsidiaries?session_id=${sessionId}&cn=${cn}`);
      commit('SET_SUBSIDIARIES', response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des filiales:', error);
    }
  },
  async fetchGroups({ commit, getters, state }) {
    const sessionId = getters.getUser.session_id;
    const cn = state.cn;
    try {
      const response = await axios.get(`${process.env.ODOO_API}api/v2/ipbx/groups?session_id=${sessionId}&cn=${cn}`);
      commit('SET_GROUPS', response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes:', error);
    }
  },
  async fetchUsers({ commit, getters, state }) {
    const sessionId = getters.getUser.session_id;
    const cn = state.cn;
    try {
      const response = await axios.get(`${process.env.ODOO_API}api/v2/ipbx/users?session_id=${sessionId}&cn=${cn}`);
      commit('SET_USERS', response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  },
  async fetchServers({ commit, getters, state }) {
    const sessionId = getters.getUser.session_id;
    const cn = state.cn;
    try {
      const response = await axios.get(`${process.env.ODOO_API}api/v2/ipbx/servers?session_id=${sessionId}&cn=${cn}`);
      commit('SET_SERVERS', response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  },
  async fetchPhones({ commit, getters, state }) {
    const sessionId = getters.getUser.session_id;
    const cn = state.cn;
    try {
      const response = await axios.get(`${process.env.ODOO_API}api/v2/ipbx/phones?session_id=${sessionId}&cn=${cn}`);
      commit('SET_PHONES', response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  },
  async fetchMaterials({ commit, getters, state }) {
    const sessionId = getters.getUser.session_id;
    const cn = state.cn;
    try {
      const response = await axios.get(`${process.env.ODOO_API}api/v2/ipbx/materials?session_id=${sessionId}&cn=${cn}`);
      commit('SET_MATERIALS', response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des matériels:', error);
    }
  },
  async fetchQueues({ commit, getters, state }) {
    const sessionId = getters.getUser.session_id;
    const cn = state.cn;
    try {
      const response = await axios.get(`${process.env.ODOO_API}api/v2/ipbx/queues?session_id=${sessionId}&cn=${cn}`);
      commit('SET_QUEUES', response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des files d\'attente:', error);
    }
  },
  async fetchSdas({ commit, getters, state }) {
    const sessionId = getters.getUser.session_id;
    const cn = state.cn;
    try {
      const response = await axios.get(`${process.env.ODOO_API}api/v2/ipbx/sdas?session_id=${sessionId}&cn=${cn}`);
      commit('SET_SDAS', response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des SDA:', error);
    }
  },
  async fetchAllEntities({ dispatch }) {
    await dispatch('fetchServers');
    await dispatch('fetchSubsidiaries');
    await dispatch('fetchGroups');
    await dispatch('fetchUsers');
    await dispatch('fetchPhones');
    await dispatch('fetchMaterials');
    await dispatch('fetchSdas');
    await dispatch('fetchQueues');
  },
  SET_CN: ({ commit }, body) => {
      commit("RESET_ALL");
      commit("SET_CN", body);
  },
  SET_CALL_LOGS_PERIOD: ({ commit, dispatch }, body) => {
    commit("SET_CALL_LOGS_PERIOD", body);
    commit("RESET_CALL_LOGS");
    dispatch("GET_CALL_LOGS");
  },
  SET_CALL_LOGS_DATES: ({ commit, dispatch }, body) => {
    commit("SET_CALL_LOGS_PERIOD", -1);
    commit("SET_CALL_LOGS_DATES", body);
    commit("RESET_CALL_LOGS");

    dispatch("GET_CALL_LOGS");
  },
  SET_CALL_LOGS_SORT: ({ commit, dispatch, state }, body) => {
    commit("SET_CALL_LOGS_SORT", body);
    dispatch('UPDATE_CALL_LOGS_DISPLAYED');
  },
  SET_CALL_LOGS_SEARCH: ({ commit, dispatch, state }, body) => {
    commit("SET_CALL_LOGS_SEARCH", body);
    dispatch('UPDATE_CALL_LOGS_DISPLAYED');
  },
  UPDATE_CALL_LOGS_DISPLAYED: ({ commit, state }) => {
    const call_logs_displayed = transform_call_logs_displayed([...state.call_logs]);
    commit('SET_CALL_LOGS_DISPLAYED', call_logs_displayed);
  },
  async GET_CALL_LOGS({commit, dispatch, state}) {
    commit('SET_CALL_LOGS_DISPLAYED_LOADING', true);
    if (state.contacts.length === 0) {
      await dispatch('GET_CONTACTS');
    }
    await dispatch("GET_QUEUE_LOG");
    
    await dispatch("GET_CALL_LOGS_RAW");
    dispatch('UPDATE_CALL_LOGS_DISPLAYED');

    commit('SET_CALL_LOGS_DISPLAYED_LOADING', false);
  },
  async GET_CONTACTS({commit, state}) {
    if (state.loading.contacts) {
        console.warn('CONTACTS_ALREADY_LOADING');
        return;
    }
    commit('SET_CONTACT_LOADING', true);

    let url = process.env.ODOO_API + 'api/v2/ipbx/contact?session_id=' + store.getters.getUser.session_id;
    url += '&cn=' + state.cn;

    await axios.get(url, { headers: header })
      .then((response: {
          data: any[];
      }) => {
        if (response?.data?.data) {
          commit('SET_CONTACT_ERROR', false);
          let contacts = transform_contact(response.data.data);
          commit('SET_CONTACTS', contacts);
        }
      })
      .catch((error: any) => {
        console.error(error);
        commit('SET_CONTACT_ERROR', true);
      })
      .finally(() => {
        commit('SET_CONTACT_LOADING', false)
      });
  },
  async GET_CALL_LOGS_RAW({commit, dispatch, state}) {
    if (state.loading.call_log_raw) {
        console.warn('GET_CALL_RAW_ALREADY_LOADING');
        return;
    }
    commit('SET_CALL_LOGS_RAW_LOADING', true);

    let url = process.env.ODOO_API + 'api/v2/ipbx/call/history/raw?session_id=' + store.getters.getUser.session_id + '&cn=' + state.cn;  

    if (state.days_period === 1)
      url += '&begin=' + state.period.call_log_raw * state.days_period + '&end=' + state.period.call_log_raw*state.days_period;
    else if (state.days_period > 1)
      url += '&begin=' + ((state.period.call_log_raw + 1) * state.days_period - 1) + '&end=' + state.period.call_log_raw*state.days_period;
    else
      url += '&begin=' + state.days_period_start + '&end=' + state.days_period_end;

    url += '&cn=' + state.cn + 
    await axios.get(url)
        .then((response: {
            data: any[];
        }) => {
            if (response?.data?.data) {
                commit('SET_CALL_LOGS_RAW_ERROR', false);
                const call_log_raw = response.data.data

                const call_logs = transform_call_logs(call_log_raw, state.queue_log);

                if (state.period.call_log_raw === 0) {
                    commit('SET_CALL_LOGS_RAW', call_log_raw);
                    commit('SET_CALL_LOGS', call_logs);

                } else {
                    commit('MERGE_CALL_LOGS_RAW', call_log_raw);
                    commit('MERGE_CALL_LOGS', call_logs);
                }
                commit('INCREMENT_PAGE_CALL_LOGS_RAW');
            }
        })
        .catch((error: any) => {
            console.error(error);
            commit('SET_CALL_LOGS_RAW_ERROR', true);
        })
        .finally(() => {
            commit('SET_CALL_LOGS_RAW_LOADING', false)
        });
  },
  async GET_QUEUE_LOG({commit, dispatch, state}) {
    if (state.loading.queue_log) {
        console.warn('GET_CALL_RAW_ALREADY_LOADING');
        return;
    }
    commit('SET_QUEUE_LOG_LOADING', true);

    let url = process.env.ODOO_API + 'api/v2/ipbx/queue/history/raw?session_id=' + store.getters.getUser.session_id + '&cn=' + state.cn;   
    if (state.days_period === 1)
      url += '&begin=' + state.period.queue_log * state.days_period + '&end=' + state.period.queue_log * state.days_period;
    else if (state.days_period > 1)
      url += '&begin=' + ((state.period.queue_log + 1) * state.days_period - 1) + '&end=' + state.period.queue_log * state.days_period;
    else
      url += '&begin=' + state.days_period_start + '&end=' + state.days_period_end;

    await axios.get(url)
        .then((response: {
            data: any[];
        }) => {
            if (response?.data?.data) {
                commit('SET_QUEUE_LOG_ERROR', false);
                let queue_log = transform_queue_log(response.data.data);

                if (state.period.queue_log === 0) {
                    commit('SET_QUEUE_LOG', queue_log);
                } else {
                    commit('MERGE_QUEUE_LOG', queue_log);                   
                }
                commit('INCREMENT_PAGE_QUEUE_LOG');
            }
        })
        .catch((error: any) => {
            console.error(error);
            commit('SET_QUEUE_LOG_ERROR', true);
        })
        .finally(() => {
            commit('SET_QUEUE_LOG_LOADING', false)
        });
  }
}

const module: Module<State, any> = {
  state,
  mutations,
  getters,
  actions
}

export default module
