import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'
import {
  intToAmount,
  getTron as getTronweb,
  getBalanceOfToken
} from '../utils/chain/tron'
import {
  getContract
} from '../utils/chain/contract'
import {
  retryMethod
} from '../utils/helper'
import {
  vestsToSteem,
  getAccountInfo,
  getSteemBalance,
  getSbdBalance,
  getVestingShares
} from '../utils/chain/steem'
import {
  TSP_LP_TOKEN_ADDRESS,
  TRON_CONTRACT_CALL_PARAMS
} from '../config'

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
    depositedTspLpInt: 0
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
    clearSteemAccount(state) {
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
    }
  },
  getters: {
    // steem
    spBalance: state => {
      return state.vestsBalance * state.vestsToSteem || 0
    },
    delegatedVests: state => {
      return intToAmount(state.delegatedVestsInt) || 0
    },
    // tron
    tronAddrFromat: state => {
      return state.tronAddress.substring(0, 6) + '...' + state.tronAddress.substring(30)
    },
    tronBalance: state => {
      return intToAmount(state.tronBalanceInt) || 0
    },
    tsteemBalance: state => {
      return intToAmount(state.tsteemBalanceInt) || 0
    },
    tspBalance: state => {
      return intToAmount(state.tspBalanceInt) || 0
    },
    tsbdBalance: state => {
      return intToAmount(state.tsbdBalanceInt) || 0
    },
    tspLpBalance: state => {
      return intToAmount(state.tspLpBalanceInt) || 0
    },
    pnutBalance: state => {
      return intToAmount(state.pnutBalanceInt) || 0
    },
    // pool info
    delegatedSp: state => {
      const delegatedVest = intToAmount(state.delegatedVestsInt)
      return delegatedVest * state.vestsToSteem
    },
    depositedTsp: state => {
      return intToAmount(state.depositedTspInt) || 0
    },
    depositedTspLp: state => {
      return intToAmount(state.depositedTspLpInt) || 0
    }

  },
  actions: {
    // steem
    setVestsToSteem({
      commit
    }) {
      vestsToSteem(1).then((res) => {
        commit('saveVestsToSteem', res)
      })
    },

    getSteem({
      commit,
      state
    }) {
      getSteemBalance(state.steemAccount).then((steem) => {
        commit('saveSteemBalance', steem)
      })
    },

    getSbd({
      commit,
      state
    }) {
      getSbdBalance(state.steemAccount).then((sbd) => {
        commit('saveSbdBalance', sbd)
      })
    },

    getVests({
      commit,
      state
    }) {
      getVestingShares(state.steemAccount).then((vests) => {
        commit('saveVestsBalance', vests)
      })
    },

    async initializeSteemAccount({
      commit
    }, steemAccount) {
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
      const func = async () => {
        try {
          const tronweb = getTronweb()
          const tron = await tronweb.trx.getBalance(context.state.tronAddress)
          context.commit('saveTronBalanceInt', tron)
        } catch (e) {
          console.error('Get Tron Fail:', e.message)
          throw e
        }
      }
      retryMethod(func)
    },

    async getTsteem(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSTEEM')
          const tsteem = await contract.balanceOf(context.state.tronAddress).call()
          context.commit('saveTsteemBalanceInt', tsteem)
        } catch (e) {
          console.error('Get Tsteem Fail:', e.message)
          throw e
        }
      })
    },

    async getTsp(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSP')
          const tsp = await contract.balanceOf(context.state.tronAddress).call()
          context.commit('saveTspBalanceInt', tsp || 0)
        } catch (e) {
          console.error('Get Tsp Fail:', e.message)
          throw e
        }
      })
    },

    async getTsbd(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSBD')
          const tsbd = await contract.balanceOf(context.state.tronAddress).call()
          context.commit('saveTsbdBalanceInt', tsbd || 0)
        } catch (e) {
          console.error('Get Tsbd Fail:', e.message)
          throw e
        }
      })
    },

    async getPnut(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('PNUT')
          const pnut = await contract.balanceOf(context.state.tronAddress).call()
          context.commit('savePnutBalanceInt', pnut || 0)
        } catch (e) {
          console.error('Get Pnut Fail:', e.message)
          throw e
        }
      })
    },

    async getTspLp(context) {
      retryMethod(async () => {
        try {
          const tspAddr = TSP_LP_TOKEN_ADDRESS
          const tsplpBalance = await getBalanceOfToken(tspAddr, context.state.tronAddress)
          context.commit('saveTspLpBalanceInt', tsplpBalance || 0)
        } catch (e) {
          console.error('Get Tsp_Lp Fail:', e.message)
          throw e
        }
      })
    },

    async getDelegatedSp(context) {
      retryMethod(async () => {
        try {
          const contranct = await getContract('PNUT_POOL')
          let amount = await contranct.delegators(context.state.tronAddress).call(); //balanceOfDelegate
          amount = amount.amount
          context.commit('saveDelegatedVestsInt', amount || 0)
        } catch (e) {
          console.error('Get Delegated SP Fail:', e.message);
          throw e;
        }
      })
    },

    async getDepositedTsp(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSP_POOL')
          let amount = await contract.delegators(context.state.tronAddress).call();
          amount = amount.tspAmount
          context.commit('saveDepositedTspInt', amount || 0)
        } catch (e) {
          console.error('Get Deposited TSP Fail:', e.message);
          throw e
        }
      })
    },

    async initializeTronAccount({
      commit,
      dispatch
    }, tronAddress) {
      commit('saveTronAddress', tronAddress)
      dispatch('getTron')
      dispatch('getTsteem')
      dispatch('getTsp')
      dispatch('getTsbd')
      dispatch('getPnut')
      dispatch('getTspLp')
      dispatch('getDelegatedSp')
      dispatch('getDepositedTsp')
    }
  },
  modules: {}
})
