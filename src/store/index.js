import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'
import { intToAmount } from '../utils/chain/tron'
import { vestsToSteem, getAccountInfo, getSteemBalance, getSbdBalance, getVestingShares } from '../utils/chain/steem'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    steemAccount: Cookie.get('steemAccount'),
    tronAddres: Cookie.get('tronAddress'),
    steemBalance: 0,
    vestsBalance: 0,
    sbdBalance: 0,
    tronBalanceInt: 0,
    tsteemBalanceInt: 0,
    tspBalanceInt: 0,
    tspLpBalanceInt: 0,
    delegatedVestsInt: 0,
    depositedTspInt: 0,
    depositedTspLpInt: 0,
    vestsToSteem: 0,
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
    saveVestsBalance: function (state, vestsBalance) {
      state.vestsBalance = vestsBalance
    },
    saveTronBalanceInt: function (state, tronBalanceInt) {
      state.tronBalanceInt = tronBalanceInt
    },
    saveTsteemBalanceInt: function (state, tsteemBalanceInt){
      state.tsteemBalanceInt = tsteemBalanceInt
    },
    saveTspBalanceInt: function (state, tspBalanceInt){
      state.tspBalanceInt = tspBalanceInt
    },
    saveTspLpBalanceInt: function (state, tspLpBalanceInt){
      state.tspLpBalanceInt = tspLpBalanceInt
    },
    saveSbdBalance: function (state, sbdBalance) {
      state.sbdBalance = sbdBalance
    },
    saveDelegatedVestsInt: function (state, delegatedVestsInt) {
      state.delegatedVestsInt = delegatedVestsInt
    },
    saveDepositedTspInt: function (state, depositedTspInt) {
      state.depositedTspInt = depositedTspInt
    },
    saveDepositedTspLpInt: function (state, depositedTspLpInt) {
      state.depositedTspLpInt = depositedTspLpInt
    },
    saveVestsToSteem: function (state, vestsToSteem) {
      state.vestsToSteem = vestsToSteem
    }
  },
  getters: {
    spBalance: state => {
      return state.vestsBalance * state.vestsToSteem
    },
    tronBalance: state => {
      return intToAmount(state.tronBalanceInt)
    },
    tsteemBalance: state => {
      return intToAmount(state.tsteemBalanceInt)
    },
    tspBalance: state => {
      return intToAmount(state.tspBalanceInt)
    },
    tspLpBalance: state => {
      return intToAmount(state.tspLpBalanceInt)
    },
    delegatedVests: state =>{
      return intToAmount(state.delegatedVestsInt)
    },
    delegatedSp: state => {
      const delegatedVest = intToAmount(state.delegatedVestsInt)
      return delegatedVest * state.vestsToSteem
    },
    depositedTsp: state =>{
      return intToAmount(state.depositedTspInt)
    },
    depositedTspLp: state => {
      return intToAmount(state.depositedTspLpInt)
    }

  },
  actions: {
    setVestsToSteem ({ commit }) {
      vestsToSteem(1).then((res) => {
        commit('saveVestsToSteem',res)
      })
    },

    async getSteem({ commit, state }) {
      const steem = await getSteemBalance(state.steemAccount)
      commit('saveSteemBalance', steem)
    },

    async getSbd({ commit,state }) {
      const sbd = await getSbdBalance(state.steemAccount)
      commit('saveSbdBalance', sbd)
    },

    async getVests({ commit,state }) {
      const vests = await getVestingShares(state.steemAccount)
      commit('saveVestsBalance', vests)
    },

    async initializeSteemAccount({ commit }, steemAccount) {
      try {
        const account = await getAccountInfo(steemAccount)
        const steem = parseFloat(account.balance)
        const sbd = parseFloat(account.sbd_balance)
        const vests = parseFloat(account.vesting_shares) - parseFloat(account.delegated_vesting_shares)
        commit('saveSteemBalance', steem)
        commit('saveSbdBalance', sbd)
        commit('saveVestsBalance', vests)
        commit('saveSteemAccount', steemAccount)
        return true
      }catch(err){
        console.error(`initializeSteemAccount Fail:`, err.message);
        return false
      }
    },
    
    async initializeTronAccount(context, tronAddress) {

    }
  },
  modules: {
  }
})
