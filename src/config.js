
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

export const TSTEEM_TRANSFER_FEE = 0.1
export const TSBD_TRANSFER_FEE = 0.015
export const TRANSFER_FEE_RATIO = 0.002

export const STEEM_DEX_ACCOUNT = process.env.STEEM_DEX_ACCOUNT || 'nutbox.dex'
export const STEEM_GAS_ACCOUNT = process.env.STEEM_GAS_ACCOUNT || 'nutbox.gas'

export const TRON_CONTRACT_CALL_PARAMS = { feeLimit: 20_000_000 }

// TSP-TRX 交易对地址
export const TSP_TRX_CONTRACT_ADDRESS = 'TBpTbddofiBrE1AfhQbwU2BhsrBUM2Lnir'
// TSP-LP token 地址
export const TSP_LP_TOKEN_ADDRESS = 'TBpTbddofiBrE1AfhQbwU2BhsrBUM2Lnir'

export const TRON_LINK_ADDR_NOT_FOUND = {
  walletLocked: 'walletLocked',
  noTronLink: 'noTronLink'
}
