import { getContract } from "./contract";

import { getAccounts } from "@/utils/web3/account";
import { ethers } from "ethers";
import { waitForTx, getProvider } from "./ethers";

import { BSC_PNUT_CONTRACT, BSC_PNUT_RECEIVE_ACCOUNT } from "@/config";
import store from '@/store'

// get ERC20 info from home chain.
export const getERC20Info = async address => {
  return new Promise(async (resolve, reject) => {
    let contract;
    try {
      contract = await getContract("ERC20", address);
    } catch (e) {
      console.log(666);
      reject(e);
      return;
    }
    try {
      const tokens = await getAllTokenFromBackend();
      let infos = await aggregate([
        {
          target: address,
          call: ["name()(string)"],
          returns: [["name"]]
        },
        {
          target: address,
          call: ["symbol()(string)"],
          returns: [["symbol"]]
        },
        {
          target: address,
          call: ["decimals()(uint8)"],
          returns: [["decimals"]]
        },
        {
          target: address,
          call: ["totalSupply()(uint256)"],
          returns: [["totalSupply"]]
        }
      ]);
      const tokenFromBackend = tokens?.filter(
        token => token.address.toLowerCase() === address.toLowerCase()
      );
      let icon = null;
      let price = null;
      if (tokenFromBackend && tokenFromBackend.length > 0) {
        icon = tokenFromBackend[0].icon;
        price = tokenFromBackend[0].price;
      }
      resolve({
        name: infos?.results?.transformed?.name,
        symbol: infos?.results?.transformed?.symbol,
        decimal: infos?.results?.transformed?.decimals,
        totalSupply: infos?.results?.transformed?.totalSupply,
        price,
        address,
        icon
      });
    } catch (e) {
      console.log("Wrong BEP20 address", e);
      reject(e);
    }
  });
};

/**
 * get home chain balance
 * @returns
 */
export const getBalance = async () => {
  const provider = await getProvider();
  const account = await getAccounts();
  return await provider.getBalance(account);
};

/**
 * get specil erc20 of user
 * @param {*} erc20
 * @returns
 */
export const getERC20Balance = async () => {
  return new Promise(async resolve => {
    try {
      const erc20Contract = await getContract("ERC20", BSC_PNUT_CONTRACT);
      const account = await getAccounts();
      if (!account) return 0;
      const balanceBI = await erc20Contract.balanceOf(account);
      store.commit('saveBscPnutBalanceInt', balanceBI);
      resolve(balanceBI);
    } catch (e) {
      resolve(-1);
    }
  });
};

/**
 * get specil erc20 of user
 * @param {*} erc20
 * @returns
 */
export const transfer = async amount => {
  return new Promise(async resolve => {
    try {
      const erc20Contract = await getContract("ERC20", BSC_PNUT_CONTRACT);

      const tx = await erc20Contract.transfer(
        BSC_PNUT_RECEIVE_ACCOUNT,
        ethers.utils.parseUnits(amount.toString(), 18)
      );

      await waitForTx(tx.hash);
      resolve(tx.hash);
    } catch (e) {
      console.log(e);
      resolve(-1);
    }
  });
};
