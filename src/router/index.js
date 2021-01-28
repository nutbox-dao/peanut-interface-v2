import Vue from 'vue'
import VueRouter from 'vue-router'
import Wallet from '../components/Wallet/Wallet'
import SteemWallet from '../components/Wallet/SteemWallet'
import TronWallet from '../components/Wallet/TronWallet'
import Swap from '../components/Wallet/Swap'
import Stake from '../components/Stake/Stake'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/wallet'
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: Wallet,
    children: [
      {
        path: '/',
        name: 'steem',
        component: SteemWallet
      },
      {
        path: '/wallet/tron',
        name: 'tron',
        component: TronWallet
      },
      {
        path: '/wallet/swap',
        name: 'swap',
        component: Swap
      }
    ]
  },
  {
    path: '/stake',
    name: 'stake',
    component: Stake
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

export default router
