
// Steem Config
export const STEEM_API_URLS = [
  process.env.STEEM_API_URL || 'https://api.steemitdev.com',
  'https://cn.steems.top',
  'https://api.steemit.com',
  'https://api.justyy.com',
  'https://aksaiapi.wherein.mobi'
]

export const STEEM_CONF_KEY = 'steemNodeKey'

export const LOCALE_KEY = 'localeLanguage'

export const TRON_NODE_API = 'https://api.trongrid.io'
// export const TRON_NODE_API = 'https://api.shasta.trongrid.io'

export const TRC20_APPROVE_AMOUNT = 1e60

export const TSTEEM_TRANSFER_FEE = 0.1
export const STEEM_TO_TSP_FEE = 1
export const TSBD_TRANSFER_FEE = 0.015
export const STEEM_STAKE_FEE = 0.2

export const TRANSFER_FEE_RATIO = 0.002
export const STEEM_TO_TSP_FEE_RATIO = 0.002

export const STEEM_DEX_ACCOUNT = process.env.STEEM_DEX_ACCOUNT || 'nutbox.dex'
export const STEEM_GAS_ACCOUNT = process.env.STEEM_GAS_ACCOUNT || 'nutbox.gas'
export const STEEM_MINE_ACCOUNT = process.env.STEEM_MINE_ACCOUNT || 'nutbox.mine'
export const STEEM_TSP_ACCOUNT = process.env.STEEM_TSP_ACCOUNT || 'nutbox-tsp'

export const TRON_CONTRACT_CALL_PARAMS = { feeLimit: 10_000_000 }

// TSP-TRX 交易对地址
export const TSP_TRX_CONTRACT_ADDRESS = 'TBpTbddofiBrE1AfhQbwU2BhsrBUM2Lnir'
// TSP-LP token 地址
export const TSP_LP_TOKEN_ADDRESS = 'TBpTbddofiBrE1AfhQbwU2BhsrBUM2Lnir'
export const TSP_POOL_ADDRESS = 'TF2Qz1byu4b54HPCKKY8FVwFeocKEZKW9D'
export const TSP_LP_POOL_ADDRESS = 'TTMY4ZkeBxmwj43bmaJUysac8w7ha7Fkhj'

// PNUT_LP  
export const PNUT_LP_TOKEN_ADDRESS = 'TCjk1d9bgrvyiaBTZkdT5DHf4BV1JKVXXG'
export const PNUT_LP_POOL_ADDRESS = 'TFTKJDAC9ZGw8CdcCCSm2wdjGPBheFmgNS'

export const TRON_LINK_ADDR_NOT_FOUND = {
  walletLocked: 'walletLocked',
  noTronLink: 'noTronLink'
}
