import Vue from 'vue'
import VueRouter from 'vue-router'
import Wallet from '../components/Wallet/Wallet'
import SteemWallet from '../components/Wallet/SteemWallet'
import TronWallet from '../components/Wallet/TronWallet'
import Swap from '../components/Wallet/Swap'
import Stake from '../components/Stake/Stake'
import Farm from '../components/Farm/Farm'
import TSPPool from '../components/Farm/TSPPool'
import TSPLPPool from '../components/Farm/TSPLPPool'
import LiquidStaking from '../components/LiquidStaking/LiquidStaking'
import TSP from '../components/LiquidStaking/TSP'
import Nps from '../components/Nps/Nps'

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
        path: '',
        name: 'steem',
        component: SteemWallet
      },
      {
        path: 'tron',
        name: 'tron',
        component: TronWallet
      },
      {
        path: 'swap',
        name: 'swap',
        component: Swap
      }
    ]
  },
  {
    path: '/stake',
    name: 'stake',
    component: Stake
  },
  {
    path: '/farm',
    component: Farm,
    redirect: '/farm/tsp',
    children: [
      {
        path: 'tsp',
        component: TSPPool
      },
      {
        path: 'tsplp',
        component: TSPLPPool
      }
    ]
  },
  {
    path: '/liquid-staking',
    component: LiquidStaking,
    redirect: '/liquid-staking/tsp',
    children: [
      {
        path: 'tsp',
        component: TSP
      }
    ]
  },
  {
    path: '/nps',
    component: Nps
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

export default router
