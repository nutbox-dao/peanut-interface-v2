import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'
import {
  intToAmount,
  getTronLink,
  getBalanceOfToken,
  getTron as Tron
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
  TSP_POOL_ADDRESS,
  TSP_LP_TOKEN_ADDRESS,
  PNUT_LP_TOKEN_ADDRESS,
  TSP_LP_POOL_ADDRESS,
  PNUT_LP_POOL_ADDRESS,
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
    pnutLpBalanceInt: 0,
    // pool info
    delegatedVestsInt: 0,
    depositedTspInt: 0,
    depositedTspLpInt: 0,
    depositedPnutLpInt: 0,
    totalDelegatedVestsInt: 0,
    totalDepositedTspInt: 0,
    totalDepositedTspLpInt: 0,
    totalDepositedPnutLpInt: 0,
    // approvement
    approvedTsp: false,
    approvedTspLp: false,
    approvedPnutLp: false,

    // contract
    contracts: {
      PNUT: {},
      TSBD: {},
      TSTEEM: {},
      TSP: {},
      PNUT_POOL: {},
      TSP_LP_POOL: {},
      PNUT_LP_POOL: {},
      TSP_POOL: {},
      PNUT_TRX: {}
    },

    // apy
    apy: Cookie.get('apy') || '0.0%'
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
    savePnutLpBalanceInt: function (state, pnutLpBalanceInt) {
      state.pnutLpBalanceInt = pnutLpBalanceInt
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
    saveDepositedPnutLpInt: function (state, depositedPnutLpInt) {
      state.depositedPnutLpInt = depositedPnutLpInt
    },
    saveTotalDelegatedVestsInt: function (state, totalDelegatedVestsInt) {
      state.totalDelegatedVestsInt = totalDelegatedVestsInt
    },
    saveTotalDepositedTspInt: function (state, totalDepositedTspInt) {
      state.totalDepositedTspInt = totalDepositedTspInt
    },
    saveTotalDepositedTspLpInt: function (state, totalDepositedTspLpInt) {
      state.totalDepositedTspLpInt = totalDepositedTspLpInt
    },
    saveTotalDepositedPnutLpInt: function (state, totalDepositedPnutLpInt) {
      state.totalDepositedPnutLpInt = totalDepositedPnutLpInt
    },
    // approve ment
    saveApprovedTSP: function (state, approvedTsp) {
      state.approvedTsp = approvedTsp
    },
    saveApprovedTSPLP: function (state, approvedTspLp) {
      state.approvedTspLp = approvedTspLp
    },
    saveApprovedPNUTLP: function (state, approvedPnutLp) {
      state.approvedPnutLp = approvedPnutLp
    },
    // contract
    savePNUTContract: function (state, contract) {
      state.contracts['PNUT'] = contract
    },
    saveTSBDContract: function (state, contract) {
      state.contracts['TSBD'] = contract
    },
    saveTSTEEMContract: function (state, contract) {
      state.contracts['TSTEEM'] = contract
    },
    saveTSPContract: function (state, contract) {
      state.contracts['TSP'] = contract
    },
    savePNUT_POOLContract: function (state, contract) {
      state.contracts['PNUT_POOL'] = contract
    },
    saveTSP_LP_POOLContract: function (state, contract) {
      state.contracts['TSP_LP_POOL'] = contract
    },
    savePNUT_LP_POOLContract: function (state, contract) {
      state.contracts['PNUT_LP_POOL'] = contract
    },
    saveTSP_POOLContract: function (state, contract) {
      state.contracts['TSP_POOL'] = contract
    },
    savePNUT_TRXContract: function (state, contract) {
      state.contracts['PNUT_TRX'] = contract
    },

    saveApy: function (state, apy) {
      state.apy = apy
      Cookie.set('apy', apy, '30d')
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
      if (!state.tronAddress) {
        return ''
      }
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
    pnutLpBalance: state => {
      return intToAmount(state.pnutLpBalanceInt) || 0
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
    },
    depositedPnutLp: state => {
      return intToAmount(state.depositedPnutLpInt) || 0
    },

    totalDelegatedSp: state => {
      const totalDelegatedVest = intToAmount(state.totalDelegatedVestsInt)
      return totalDelegatedVest * state.vestsToSteem
    },
    totalDepositedTsp: state => {
      return intToAmount(state.totalDepositedTspInt) || 0
    },
    totalDepositedTspLp: state => {
      return intToAmount(state.totalDepositedTspLpInt) || 0
    },
    totalDepositedPnutLp: state => {
      return intToAmount(state.totalDepositedPnutLpInt) || 0
    },
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
        // console.error('initializeSteemAccount Fail:', err.message)
        return false
      }
    },

    // tron
    async getTron(context) {
      const func = async () => {
        try {
          const tronweb = Tron()
          const tron = await tronweb.trx.getBalance(context.state.tronAddress)
          context.commit('saveTronBalanceInt', tron)
        } catch (e) {
          // console.error('Get Tron Fail:', e.message)
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
          // console.error('Get Tsteem Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Tsteem Fail:', e.message)
      })
    },

    async getTsp(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSP')
          const tsp = await contract.balanceOf(context.state.tronAddress).call()
          context.commit('saveTspBalanceInt', tsp || 0)
        } catch (e) {
          // console.error('Get Tsp Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Tsp Fail:', e.message)
      })
    },

    async getTsbd(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSBD')
          const tsbd = await contract.balanceOf(context.state.tronAddress).call()
          context.commit('saveTsbdBalanceInt', tsbd || 0)
        } catch (e) {
          // console.error('Get Tsbd Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Tsbd Fail:', e.message)
      })
    },

    async getPnut(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('PNUT')
          const pnut = await contract.balanceOf(context.state.tronAddress).call()
          context.commit('savePnutBalanceInt', pnut || 0)
        } catch (e) {
          // console.error('Get Pnut Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Pnut Fail:', e.message)
      })
    },

    async getTspLp(context) {
      retryMethod(async () => {
        try {
          const tspAddr = TSP_LP_TOKEN_ADDRESS
          const tsplpBalance = await getBalanceOfToken(tspAddr, context.state.tronAddress)
          context.commit('saveTspLpBalanceInt', tsplpBalance || 0)
        } catch (e) {
          // console.error('Get Tsp_Lp Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Tsp_Lp Fail:', e.message)
      })
    },

    async getPnutLp(context) {
      retryMethod(async () => {
        try {
          const pnutLpAddr = PNUT_LP_TOKEN_ADDRESS
          const pnutLpBalance = await getBalanceOfToken(pnutLpAddr, context.state.tronAddress)
          context.commit('savePnutLpBalanceInt', pnutLpBalance || 0)
        } catch (e) {
          console.error('Get Pnut_Lp Fail:', e)
          throw e
        }
      }).catch((e) => {
        console.error('Get Pnut_Lp Fail:', e.message)
      })
    },

    async getDelegatedSp(context) {
      retryMethod(async () => {
        try {
          const contranct = await getContract('PNUT_POOL')
          let amount = await contranct.delegators(context.state.tronAddress).call() // balanceOfDelegate
          amount = amount.amount
          context.commit('saveDelegatedVestsInt', amount || 0)
        } catch (e) {
          // console.error('Get Delegated SP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Delegated SP Fail:', e.message)
      })
    },

    async getDepositedTsp(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSP_POOL')
          let amount = await contract.delegators(context.state.tronAddress).call()
          amount = amount.tspAmount
          context.commit('saveDepositedTspInt', amount || 0)
        } catch (e) {
          // console.error('Get Deposited TSP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Deposited TSP Fail:', e.message)
      })
    },

    async getDepositedTspLp(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSP_LP_POOL')
          let amount = await contract.delegators(context.state.tronAddress).call()
          amount = amount.tspLPAmount
          context.commit('saveDepositedTspLpInt', amount || 0)
        } catch (e) {
          // console.error('Get Deposited TSP_LP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Deposited TSP_LP Fail:', e.message)
      })
    },

    async getDepositedPnutLp(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('PNUT_LP_POOL')
          let amount = await contract.delegators(context.state.tronAddress).call()
          amount = amount.pnutLpAmount
          context.commit('saveDepositedPnutLpInt', amount || 0)
        } catch (e) {
          console.error('Get Deposited PNUT_LP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Deposited PNUT_LP Fail:', e.message)
      })
    },

    async getTotalDelegatedSP(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('PNUT_POOL')
          let amount = await contract.totalDepositedSP().call()
          context.commit('saveTotalDelegatedVestsInt', amount || 0)
        } catch (e) {
          // console.error('Get Total Deposited SP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Total Deposited SP Fail:', e.message)
      })
    },

    async getTotalDepositedTsp(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSP_POOL')
          let amount = await contract.totalDepositedTSP().call()
          context.commit('saveTotalDepositedTspInt', amount || 0)
        } catch (e) {
          // console.error('Get Total Deposited TSP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Total Deposited TSP Fail:', e.message)
      })
    },

    async getTotalDepositedTspLp(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSP_LP_POOL')
          let amount = await contract.totalDepositedTSPLP().call()
          context.commit('saveTotalDepositedTspLpInt', amount || 0)
        } catch (e) {
          // console.error('Get Total Deposited TSP LP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Total Deposited TSP LP Fail:', e.message)
      })
    },

    async getTotalDepositedPnutLp(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('PNUT_LP_POOL')
          let amount = await contract.totalDepositedPnutLp().call()
          context.commit('saveTotalDepositedPnutLpInt', amount || 0)
        } catch (e) {
          console.error('Get Total Deposited PNUT LP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get Total Deposited PNUT LP Fail:', e.message)
      })
    },

    async getApprovedTSP(context) {
      retryMethod(async () => {
        try {
          const contract = await getContract('TSP')
          let amount = await contract.allowance(context.state.tronAddress, TSP_POOL_ADDRESS).call()
          context.commit('saveApprovedTSP', intToAmount(amount) > 1e6)
        } catch (e) {
          // console.error('Get ApprovedTSP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error("Get Approve TSP fail", e.message);
      })
    },

    async getApprovedTSPLP(context) {
      retryMethod(async () => {
        try {
          const tronWeb = await getTronLink()
          const tron = Tron()
          const params = [{
              type: 'address',
              value: context.state.tronAddress
            },
            {
              type: 'address',
              value: TSP_LP_POOL_ADDRESS
            }
          ]
          const tx = await tronWeb.transactionBuilder
            .triggerConstantContract(TSP_LP_TOKEN_ADDRESS,
              'allowance(address,address)', {},
              params,
              context.state.tronAddress)
          const amount = tx && tx.constant_result && tx.constant_result[0] && tron.toDecimal('0x' + tx.constant_result[0])
          context.commit('saveApprovedTSPLP', intToAmount(amount) > 1e6)
        } catch (e) {
          // console.error('Get ApprovedTSPLP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error("Get Approve TSPLP fail", e);
      })
    },

    async getApprovedPNUTLP(context) {
      retryMethod(async () => {
        try {
          const tronWeb = await getTronLink()
          const tron = Tron()
          const params = [{
              type: 'address',
              value: context.state.tronAddress
            },
            {
              type: 'address',
              value: PNUT_LP_POOL_ADDRESS
            }
          ]
          const tx = await tronWeb.transactionBuilder
            .triggerConstantContract(PNUT_LP_TOKEN_ADDRESS,
              'allowance(address,address)', {},
              params,
              context.state.tronAddress)
          const amount = tx && tx.constant_result && tx.constant_result[0] && tron.toDecimal('0x' + tx.constant_result[0])
          context.commit('saveApprovedPNUTLP', intToAmount(amount) > 1e6)
        } catch (e) {
          console.error('Get ApprovedPNUTLP Fail:', e.message)
          throw e
        }
      }).catch((e) => {
        console.error('Get ApprovedPNUTLP Fail:', e);
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
      dispatch('getPnutLp')
      dispatch('getDelegatedSp')
      dispatch('getDepositedTsp')
      dispatch('getDepositedTspLp')
      dispatch('getDepositedPnutLp')
      dispatch('getTotalDelegatedSP')
      dispatch('getTotalDepositedTsp')
      dispatch('getTotalDepositedTspLp')
      dispatch('getTotalDepositedPnutLp')
      dispatch('getApprovedTSP')
      dispatch('getApprovedTSPLP')
      dispatch('getApprovedPNUTLP')
    }
  },
  modules: {}
})
