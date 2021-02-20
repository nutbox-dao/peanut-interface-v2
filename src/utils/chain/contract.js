import { getTronLink, getTron } from './tron.js'
import axios from 'axios'

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
  if (contractAdd[symbol] && contractAdd[symbol].length > 0){
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
