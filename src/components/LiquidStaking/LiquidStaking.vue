<template>
  <div class="liquid-staking">
    <h3>{{ $t("liquidStaking.liquidStaking") }}</h3>
    <div class="nav"></div>
    <div class="tsp-exchange">
    <TSP :fromSteemToTron='true'></TSP>
    <TSP :fromSteemToTron='false'></TSP>
    </div>

  </div>
</template>

<script>
import TSP from './TSP'
import Login from "../Login";
export default {
  name: "LiquidStaking",
  components: {
    Login,
    TSP,
  },
};
</script>

<style lang="less" scoped>
.liquid-staking {
  padding: 0px 40px 64px;
  .nav {
    display: flex;
    align-items: left;
    border-bottom: 1px solid #ddd;
    a {
      border: 0;
      font-size: 20px;
      padding: 10px 24px;
      margin-top: 30px;
      color: #666;
      box-sizing: border-box;
    }
    a:hover {
      background-color: var(--yellow-background);
      text-decoration: none;
    }
    .active {
      color: var(--primary);
      border-bottom: 2px solid var(--primary);
    }
  }
  .tsp-exchange{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}
</style>
