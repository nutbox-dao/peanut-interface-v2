import { get } from './axios'

export const getProposal = async (params) => get('/nps/getProposal', params)