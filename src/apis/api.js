import { get } from './axios'

const API_URL ='https://service.nutbox.io'

export const getProposal = async (params) => get(API_URL + '/nps/getProposal', params)

export const getApys = async () => get(API_URL + '/service/getApys')

export const getPnutLpExchangeInfo = async () => get('https://api.just.network/swap/scan/statusinfo?exchangeAddress=TPt2a3GtKMY5972mWa2aL3KKVY6ScWX2G2')

export const getTspLpExchangeInfo = async () => get('https://api.just.network/swap/scan/statusinfo?exchangeAddress=TBpTbddofiBrE1AfhQbwU2BhsrBUM2Lnir')

export const getAirdropInfo = async (params) => get(API_URL + '/airdrop/find', params)