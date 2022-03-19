import { getEthWeb } from "./web3.js";
import store from "@/store";

import { ethers } from "ethers";

import { sleep } from "../helper.js";
import { errCode, BSC_CHAIN_ID } from "@/config.js";
import { signMessage } from "./utils";

/**
 * Get metamask accounts
 * @returns all accounts
 */
export const getAccounts = async (update = false) => {
  const metamask = await getEthWeb();
  const unlock = await metamask._metamask.isUnlocked();
  if (!unlock) {
    //store.commit("web3/saveAccount", null);
    return;
  }
  while (true) {
    if (parseInt(store.state.chainId) > 0) {
      break;
    }
    await sleep(0.3);
  }
  if (parseInt(store.state.chainId !== parseInt(BSC_CHAIN_ID))) {
    //store.commit("web3/saveAccount", null);
    return;
  }
  /*  if (store.state.web3.account && !update) {
    return store.state.web3.account;
  } */
  const accounts = await metamask.request({
    method: "eth_requestAccounts"
  });
  let account = accounts[0];
  account = ethers.utils.getAddress(account);
  //store.commit("web3/saveAccount", account);
  //store.commit("web3/saveAllAccounts", accounts);
  console.log(accounts[0]);
  store.commit('saveBscAddress', accounts[0])
  return accounts[0];
};

/**
 * Monitor BSC account change event
 */
export const accountChanged = async refresh => {
  const metamask = await getEthWeb();
  metamask.on("accountsChanged", accounts => {
    console.log("Changed accounts", accounts);
    store.commit("web3/saveAccount", ethers.utils.getAddress(accounts[0]));
    refresh();
    return;
    store.commit("web3/saveAccount", ethers.utils.getAddress(accounts[0]));
    store.commit("web3/saveStakingFactoryId", null);
    store.commit("web3/saveMyPools", null);
    store.commit("web3/saveAllAssetsOfUser", null);
    store.commit("web3/saveCommunityInfo", null);
    getMyCommunityInfo(true)
      .then(res => {
        if (res) {
          getNonce(true);
          getDistributionEras(true);
        }
      })
      .catch(console.error);
  });
};

export const updateAllUsersByPolling = async () => {
  while (true) {
    await getUsers();
    await sleep(10);
  }
};
