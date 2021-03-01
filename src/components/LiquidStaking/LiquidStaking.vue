<template>
  <div class="liquid-staking">
    <h3>{{ $t("liquidStaking.liquidStaking") }}</h3>
    <div class="exchange-box">
      <div class="tsp-exchange">
        <TSP :fromSteemToTron="true"></TSP>
        <TSP :fromSteemToTron="false"></TSP>
      </div>
    </div>
  </div>
</template>

<script>
import TSP from "./TSP";
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
  .exchange-box {
    padding-top: 76px;
    justify-content: center;
    align-content: center;
    display: flex;
  }
  .tsp-exchange {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    max-width: 1100px;
  }
}
</style>
