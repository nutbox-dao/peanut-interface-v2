import { get } from './axios'

export const getProposal = async (params) => get('http://127.0.0.1:3000/nps/getProposal', params)