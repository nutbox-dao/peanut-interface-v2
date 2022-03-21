import { getContract, contractAddress } from "./contract";
import store from '@/store'
import { ethers } from "ethers";
import { waitForTx } from "./ethers";
import { getAccounts } from "./account";

export const getApproveBiz = async () => {
    const pnut = await getContract('Pnut');
    const account = await getAccounts();
    const allownce = await pnut.allowance(account, contractAddress["Biz"]);
    store.commit('saveApprovementBiz', allownce.toString() / 1e18 > 1e12);
    store.commit('saveLoadingApprovementBiz', false)
}

export const approveBiz = async () => {
    const pnut = await getContract('Pnut');
    const tx = await pnut.approve(contractAddress["Biz"], ethers.constants.MaxUint256)
    await waitForTx(tx.hash)
}

export const payUpvote = async (author, permlink, amount) => {
    const biz = await getContract('Biz');
    const tx = await biz.addNewPayment(author, permlink, ethers.utils.parseUnits(amount.toString(), 18))
    await waitForTx(tx.hash)
}