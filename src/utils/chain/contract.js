import { getTronLink, getTron, getTronLinkAddr, amountToInt } from './tron.js'
import axios from 'axios'
import { APPROVE_TOKEN_CONTRACT_PAIR, TRC20_APPROVE_AMOUNT, TRON_LINK_ADDR_NOT_FOUND } from '../../config'

const CONTRACT_JSON_NAME_LIST = {
  PNUT: 'NutboxPeanutsTest.json',
  TSBD: 'NutboxSbd.json',
  TSTEEM: 'NutboxSteem.json',
  TSP: 'NutboxTsp.json',
  PNUT_POOL: 'PeanutsPoolV2.json',
  TSP_LP_POOL: 'TspLpPool.json',
  TSP_POOL: 'TspPooling.json',
  PNUT_LP_POOL: 'PnutLpPool.json',
  PNUT_TRX: 'PnutTrxToken.json',
}

var contracts = {
  PNUT: {},
  TSBD: {},
  TSTEEM: {},
  TSP: {},
  PNUT_POOL: {},
  TSP_LP_POOL: {},
  PNUT_LP_POOL: {},
  TSP_POOL: {},
  PNUT_TRX: {}
}

var contractAdd = {
  PNUT: '',
  TSBD: '',
  TSTEEM: '',
  TSP: '',
  PNUT_POOL: '',
  TSP_LP_POOL: '',
  PNUT_LP_POOL: '',
  TSP_POOL: '',
  PNUT_TRX: ''
}

export const getContractAddress = async function (symbol) {
  if (contractAdd[symbol] && contractAdd[symbol].length > 0) {
    return contractAdd[symbol]
  }
  return
}

export const getAbiAndContractAddress = async function (symbol) {
  symbol = symbol.toUpperCase()
  const tronweb = getTron()
  const res = await axios.get('/' + CONTRACT_JSON_NAME_LIST[symbol])
  const abi = res.data.abi
  const address = tronweb.address.fromHex(res.data.networks['*'].address)
  return { abi, address }
}

export const getContract = async function (symbol) {
  symbol = symbol.toUpperCase()
  let instance = contracts[symbol]
  if (Object.keys(instance).length !== 0) {
    return instance
  }
  const tronLink = await getTronLink()
  if (!tronLink) return
  const { abi, address } = await getAbiAndContractAddress(symbol)
  contractAdd[symbol] = address
  instance = tronLink.contract(abi, address)
  contracts[symbol] = instance
  return instance
}

export const approveContract = async function (symbol) {
  symbol = symbol.toUpperCase()
  const token = APPROVE_TOKEN_CONTRACT_PAIR[symbol][0]
  const pool = APPROVE_TOKEN_CONTRACT_PAIR[symbol][1]
  try {
    const user = await getTronLinkAddr()
    if (user === TRON_LINK_ADDR_NOT_FOUND.noTronLink || user === TRON_LINK_ADDR_NOT_FOUND.walletLocked) return;
    const approveInt = amountToInt(TRC20_APPROVE_AMOUNT)
    const tronLink = await getTronLink()
    const params = [
      { type: 'address', value: pool },
      { type: 'uint256', value: approveInt }
    ]
    const { result, transaction } = await tronLink.transactionBuilder.triggerSmartContract(
      token,
      'approve(address,uint256)',
      { feeLimit: 20_000_000 },
      params,
      user
    )

    if (result && result.result !== true) {
      // this.showTip(this.$t('error.error'), this.$t('error.approveFail'))
      console.log('failt');
      return 1
    }

    const signedTx = await tronLink.trx.sign(transaction)

    const { txid } = await tronLink.trx.sendRawTransaction(signedTx)

    if (txid && (await isTransactionSuccess(txid))) {
      return 0
    } else {
      if (txid && (await isInsufficientEnerge(txid))) {
      //   this.showTip(
      //     this.$t('error.error'),
      //     this.$t('error.insufficientEnerge')
      //   )
        return 2
      } else {
        console.log('else');
        return 1
      }
    }
  } catch (err) {
    console.error(err);
    return 1
  }
}