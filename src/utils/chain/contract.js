import { getTronLink, getTron } from './tron.js'
import axios from 'axios'

const CONTRACT_JSON_NAME_LIST = {
    PNUT: "NutboxPeanuts.json",
    TSBD: "NutboxSbd.json",
    TSTEEM: "NutboxSteem.json",
    TSP: "NutboxTsp.json",
    PNUT_POOL: "PeanutsPoolV2.json",
    TSP_LP_POOL: "TspLpPool.json",
    TSP_POOL: "TspPooling.json"
}

var contracts = {
    PNUT: {},
    TSBD:{},
    TSTEEM: {},
    TSP: {},
    PNUT_POOL:{},
    TSP_LP_POOL:{},
    TSP_POOL:{}
}

export const getAbiAndContractAddress = async function (symbol) {
    symbol = symbol.toUpperCase()
    const tronweb = getTron()
    const res = await axios.get('/' + CONTRACT_JSON_NAME_LIST[symbol])
    const abi = res.data.abi
    const address = tronweb.address.fromHex(res.data.networks["*"].address)
    return { abi, address }
}

export const getContract = async function (symbol) {
    symbol = symbol.toUpperCase()
    let instance = contracts[symbol]
    if (Object.keys(instance).length !== 0) {
        return instance
    }
    const tronLink = await getTronLink()
    const { abi, address } = await getAbiAndContractAddress(symbol)
    instance = tronLink.contract(abi, address)
    contracts[symbol] = instance
    return instance
}