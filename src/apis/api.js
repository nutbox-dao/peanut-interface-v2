import { get } from './axios'

export const getProposal = async (params) => get('http://1.15.101.110:3000/nps/getProposal', params)