import axios from 'axios'
import Tron from 'tronweb'
import { TRON_NODE_API, TRON_LINK_ADDR_NOT_FOUND, TRON_PNUT_CONTRACT } from '../../config.js'
import { sleep } from '../helper'

function initTron (symbol) {
  const HttpProvider = Tron.providers.HttpProvider
  const fullNode = new HttpProvider(TRON_NODE_API)
  const solidityNode = new HttpProvider(TRON_NODE_API)
  const eventServer = new HttpProvider(TRON_NODE_API)
  const privateKey = null
  if (privateKey) {
    return new Tron(fullNode, solidityNode, eventServer, privateKey)
  } else {
    return new Tron(fullNode, solidityNode, eventServer)
  }
}

export function getTron (symbol = 'DEFAULT') {
  return initTron(symbol)
}

export async function getTronLinkAddr () {
  let addr = null
  const tronLink = await getTronLink()
  if (!tronLink) {
    // console.log('no tron link')
    return TRON_LINK_ADDR_NOT_FOUND.noTronLink
  }
  addr = tronLink.defaultAddress.base58
  // console.log('address',addr)
  if (addr) {
    return addr
  } else {
    await sleep(1)
    addr = tronLink.defaultAddress.base58
    return addr || TRON_LINK_ADDR_NOT_FOUND.walletLocked
  }
}

export const getTronLink = async function () {
  var tronlink = window.tronWeb
  for (let i = 0; i < 10; i++) {
    if (tronlink) {
      // console.log('get tron link success')
      return tronlink
    }
    tronlink = window.tronWeb
    // console.log('not get tron link',window.tronWeb)
    await sleep(0.5)
  }
  return window.tronWeb
}

export const transferPnut = async function (to, amount, memo = "") {
  const method = "transfer(address,uint256)";
  const params = [
    { type: "address", value: to },
    { type: "uint256", value: amount },
  ];
  const tronweb = await getTronLink()
  const user = await getTronLinkAddr()
console.log('param',params);
  const {result,transaction} = await tronweb.transactionBuilder.triggerSmartContract(
    TRON_PNUT_CONTRACT,
    method,
    {
      feeLimit: 10_000_000,
    },
    params,
    user
  );
  console.log(28984,transaction);
  if (
    !result ||
    result["result"] !== true
  ) {
    console.error(
      `Create Transaction Fail.\n\tContract:${TRON_PNUT_CONTRACT};\n\tMethod:${method}\n\tParams:${params}`
    );
    return false;
  }
  // add memo
  const trans = await tronweb.transactionBuilder.addUpdateData(transaction, memo, 'utf8');
  console.log('add memo',trans);
  // Sign transaction
  const signedTx = await tronweb.trx.sign(trans);
  console.log(23521,signedTx);
  // Broadcast transaction
  const broadcastTx= await tronweb.trx.sendRawTransaction(signedTx);
  console.log('txid',broadcastTx);
  return false;
  // Validate transaction
  if (
    txid &&
    (await isTransactionSuccess(txid))
  ) {
    return true;
  } else {
    return false;
  }
  
};

export function getAddress (hex) {
  const tron = getTron()
  return tron.address.fromHex(hex)
}

export const isAddress = async function (addr) {
  if (!addr) {
    return false
  }
  const tronweb = getTron()
  return tronweb.isAddress(addr)
}

export const amountToInt = function (amount) {
  const tron = getTron()
  return tron.toBigNumber(amount * 1e6).toFixed(0)
}

export const intToAmount = function (integer) {
  const tron = getTron()
  return tron.toBigNumber(integer * 1e-6).toFixed(6)
}

export const toInt = function (number) {
  const tron = getTron()
  return parseInt(tron.toBigNumber(number))
}

export const getTransaction = async function (trxId) {
  try {
    const tron = getTron()
    return await tron.trx.getTransaction(trxId)
  } catch (e) {
    // console.log("Fail to get transaction [%s]; error = [%s]", trxId, e);
    return null
  }
}

const getTransactionResult = function (trxId) {
  return new Promise(async (resolve, reject) => {
    const read = async (retries = 20) => {
      const trx = await getTransaction(trxId)
      // console.log(trx,trxId)
      if (trx && trx.ret) {
        resolve(trx.ret)
      } else {
        setTimeout(async () => {
          if (retries > 0) {
            await read(retries - 1)
          } else {
            // reject("Failed to get transaction result of", trxId);
          }
        }, 1000)
      }
    }
    read()
  })
}

export const isTransactionSuccess = async function (trxId) {
  const ret = await getTransactionResult(trxId)
  return ret && ret[0] && ret[0].contractRet === 'SUCCESS'
}

export const isInsufficientEnerge = async function (trxId) {
  const ret = trxId && (await getTransactionResult(trxId))
  return ret && ret[0] && ret[0].contractRet === 'OUT_OF_ENERGY'
}

export const contractConfig = {
  feeLimit: 20 * 1000000 // 20 TRX (1TRX = 1,000,000SUN),
  // shouldPollResponse: true,
}

export const getBalanceOfToken = async function (token, user) {
  const tron = getTron()
  const balance = await tron.transactionBuilder
    .triggerConstantContract(token,
      'balanceOf(address)',
      {},
      [{ type: 'address', value: user }],
      user)
  // console.log("banlanceof",balance)
  return balance && balance.constant_result && balance.constant_result[0] && tron.toDecimal('0x' + balance.constant_result[0])
}

export const getSupplyOfToken = async function (token) {
  const tron = getTron()
  const supply = await tron.transactionBuilder
    .triggerConstantContract(token,
      'totalSupply()',
      {},
      [],
      token)
  // console.log("total supply",tron.toDecimal('0x'+supply['constant_result'][0]))
  return supply && supply.constant_result && supply.constant_result[0] && tron.toDecimal('0x' + supply.constant_result[0])
}

function runOnce (fn, context) { // 控制让函数只触发一次
  return function () {
    try {
      fn.apply(context || this, arguments)
    } catch (e) {
      console.error(e)// 一般可以注释掉这行
    } finally {
      fn = null
    }
  }
}

// whatch the tronlink address every 5sec，if changed callback the new address
export const watchWallet = runOnce(wa)

async function wa (callback) {
  try {
    const addr = await getTronLinkAddr()
    if (!addr) {
      return
    }
    const originalAddr = localStorage.getItem('tronLinkAddress')
    if (addr && originalAddr && callback && addr !== originalAddr) {
      callback(addr)
    }
    localStorage.setItem('tronLinkAddress', addr)
  } catch (e) {
    console.log('watch wallet fail:', e)
  } finally {
    setTimeout(() => {
      wa(callback)
    }, 500)
  }
}

export const getTronPrice = function () {
  return new Promise(async resolve => {
    const res = await axios.request({
      method: 'get',
      url: 'https://api.coingecko.com/api/v3/coins/tron',
      headers: {
        accept: 'application/json'
      }
    })
    const arr = res.data.tickers
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].target === 'USDT') {
        resolve(parseFloat(arr[i].last))
      }
    }
    resolve(1)
  })
}

export const getPnutPrice = function () {
  return new Promise(async resolve => {
    const res = await axios.request({
      method: 'get',
      url: 'https://api.justswap.io/v2/allpairs',
      headers: {
        accept: 'application/json'
      },
      params: {
        page_size: 2500,
        page_num: 1
      }
    })
    const price = res.data.data['0_TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW'].price
    resolve(parseFloat(price))
  })
}
