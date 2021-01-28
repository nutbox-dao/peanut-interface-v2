import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    steemAccount: Cookie.get('steemAccount'),
    tronAddres: Cookie.get('tronAddress'),
    steemBalance: 0,
    spBalance: 0,
    tronBalance: 0,
    tsteemBalance: 0,
    tspBalance: 0,
    tspLpBalance: 0,
    sbdBalance: 0,
    delegatedSp: 0,
    depositedTsp: 0,
    depositedTspLp: 0
  },
  mutations: {
    saveSteemAccount: function (state, steemAccount) {
      state.steemAccount = steemAccount
      Cookie.set('steemAccount', steemAccount, '30d')
    },
    saveTronAddress: function (state, tronAddress) {
      state.tronAddress = tronAddress
      Cookie.set('tronAddress', tronAddress, '30d')
    },
    saveSteemBalance: function (state, steemBalance) {
      state.steemBalance = steemBalance
    },
    saveSpBalance: function (state, spBalance) {
      state.spBalance = spBalance
    },
    saveTronBalance: function (state, tronBalance) {
      state.tronBalance = tronBalance
    }
  },
  actions: {
  },
  modules: {
  }
})
