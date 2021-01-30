import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'
import { intToAmount, getTron as getTronweb, getBalanceOfToken } from '../utils/chain/tron'
import { getContract } from '../utils/chain/contract'
import { vestsToSteem, getAccountInfo, getSteemBalance, getSbdBalance, getVestingShares } from '../utils/chain/steem'
import { TSP_LP_TOKEN_ADDRESS } from '../config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // steem
    steemAccount: Cookie.get('steemAccount'),
    steemBalance: 0,
    vestsBalance: 0,
    sbdBalance: 0,
    vestsToSteem: 0,
    // tron
    tronAddress: Cookie.get('tronAddress'),
    tronBalanceInt: 0,
    pnutBalanceInt: 0,
    tsteemBalanceInt: 0,
    tsbdBalanceInt: 0,
    tspBalanceInt: 0,
    tspLpBalanceInt: 0,
    // pool info
    delegatedVestsInt: 0,
    depositedTspInt: 0,
    depositedTspLpInt: 0,
  },
  mutations: {
    // steem
    saveSteemAccount: function (state, steemAccount) {
      state.steemAccount = steemAccount
      Cookie.set('steemAccount', steemAccount, '30d')
    },
    saveSteemBalance: function (state, steemBalance) {
      state.steemBalance = steemBalance
    },
    saveVestsBalance: function (state, vestsBalance) {
      state.vestsBalance = vestsBalance
    },
    saveSbdBalance: function (state, sbdBalance) {
      state.sbdBalance = sbdBalance
    },
    saveVestsToSteem: function (state, vestsToSteem) {
      state.vestsToSteem = vestsToSteem
    },
    clearSteemAccount(state){
      state.steemAccount = null
      Cookie.remove('steemAccount')
    },
    // tron
    saveTronAddress: function (state, tronAddress) {
      state.tronAddress = tronAddress
      Cookie.set('tronAddress', tronAddress, '30d')
    },
    savePnutBalanceInt: function (state, pnutBalanceInt) {
      state.pnutBalanceInt = pnutBalanceInt
    },
    saveTronBalanceInt: function (state, tronBalanceInt) {
      state.tronBalanceInt = tronBalanceInt
    },
    saveTsteemBalanceInt: function (state, tsteemBalanceInt) {
      state.tsteemBalanceInt = tsteemBalanceInt
    },
    saveTspBalanceInt: function (state, tspBalanceInt) {
      state.tspBalanceInt = tspBalanceInt
    },
    saveTspLpBalanceInt: function (state, tspLpBalanceInt) {
      state.tspLpBalanceInt = tspLpBalanceInt
    },
    saveTsbdBalanceInt: function (state, tsbdBalanceInt) {
      state.tsbdBalanceInt = tsbdBalanceInt
    },
    // pool info
    saveDelegatedVestsInt: function (state, delegatedVestsInt) {
      state.delegatedVestsInt = delegatedVestsInt
    },
    saveDepositedTspInt: function (state, depositedTspInt) {
      state.depositedTspInt = depositedTspInt
    },
    saveDepositedTspLpInt: function (state, depositedTspLpInt) {
      state.depositedTspLpInt = depositedTspLpInt
    },
  },
  getters: {
    // steem
    spBalance: state => {
      return state.vestsBalance * state.vestsToSteem
    },
    delegatedVests: state => {
      return intToAmount(state.delegatedVestsInt)
    },
    // tron
    tronBalance: state => {
      return intToAmount(state.tronBalanceInt)
    },
    tsteemBalance: state => {
      return intToAmount(state.tsteemBalanceInt)
    },
    tspBalance: state => {
      return intToAmount(state.tspBalanceInt)
    },
    tsbdBalance: state => {
      return intToAmount(state.tsbdBalanceInt)
    },
    tspLpBalance: state => {
      return intToAmount(state.tspLpBalanceInt)
    },
    pnutBalance: state => {
      return intToAmount(state.pnutBalanceInt)
    },
    // pool info
    delegatedSp: state => {
      const delegatedVest = intToAmount(state.delegatedVestsInt)
      return delegatedVest * state.vestsToSteem
    },
    depositedTsp: state => {
      return intToAmount(state.depositedTspInt)
    },
    depositedTspLp: state => {
      return intToAmount(state.depositedTspLpInt)
    }

  },
  actions: {
    // steem
    setVestsToSteem ({ commit }) {
      vestsToSteem(1).then((res) => {
        commit('saveVestsToSteem', res)
      })
    },

    getSteem ({ commit, state }) {
     getSteemBalance(state.steemAccount).then((steem) => {
      commit('saveSteemBalance', steem)
     })
    },

    getSbd ({ commit, state }) {
      getSbdBalance(state.steemAccount).then((sbd) => {
        commit('saveSbdBalance', sbd)
      })
    },

    getVests ({ commit, state }) {
      getVestingShares(state.steemAccount).then((vests) => {
        commit('saveVestsBalance', vests)
      })
    },

    async initializeSteemAccount ({ commit }, steemAccount) {
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
      } catch (err) {
        console.error('initializeSteemAccount Fail:', err.message)
        return false
      }
    },

    // tron
    async getTron(context) {
      try{
        const tronweb = getTronweb()
        const tron = await tronweb.trx.getBalance(context.state.tronAddress)
        context.commit('saveTronBalanceInt', tron)
      }catch(e){
        console.error('Get Tron Fail:', e.message);
      }
    },

    async getTsteem(context) {
      try{
        const contract = await getContract('TSTEEM')
        const tsteem = await contract.balanceOf(context.state.tronAddress).call()
        context.commit('saveTsteemBalanceInt', tsteem)
      }catch(e){
        console.error('Get Tsteem Fail:', e.message);
      }
    },

    async getTsp(context) {
      try{
        const contract = await getContract('TSP')
        const tsp = await contract.balanceOf(context.state.tronAddress).call()
        context.commit('saveTspBalanceInt', tsp)
      }catch(e){
        console.error('Get Tsp Fail:', e.message);
      }
    },

    async getTsbd(context) {
      try{
        const contract = await getContract('TSBD')
        const tsbd = await contract.balanceOf(context.state.tronAddress).call()
        context.commit('saveTsbdBalanceInt', tsbd)
      }catch(e){
        console.error('Get Tsbd Fail:', e.message);
      }
    },

    async getPnut(context) {
      try{
        const contract = await getContract('PNUT')
        const pnut = await contract.balanceOf(context.state.tronAddress).call()
        context.commit('savePnutBalanceInt', pnut)
      }catch(e){
        console.error('Get Pnut Fail:', e.message);
      }
    },

    async getTspLp(context) {
      try{
        const tspAddr = TSP_LP_TOKEN_ADDRESS;
        const tsplpBalance = await getBalanceOfToken(tspAddr, context.state.tronAddress);
        context.commit('saveTspLpBalanceInt',tsplpBalance)
      }catch(e){
        console.error('Get Tsp_Lp Fail:', e.message);
      }
    },

    async initializeTronAccount ({ commit, dispatch}, tronAddress) {
      commit('saveTronAddress', tronAddress)
      dispatch('getTron')
      dispatch('getTsteem')
      dispatch('getTsp')
      dispatch('getTsbd')
      dispatch('getPnut')
      dispatch('getTspLp')
    }
  },
  modules: {
  }
})
