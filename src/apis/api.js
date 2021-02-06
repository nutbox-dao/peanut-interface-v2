import { get } from './axios'

export const getProposal = async (params) => get('/api/nps/getProposal', params)