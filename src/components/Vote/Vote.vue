<template>
  <div id="vote">
    <h3>
      {{ $t("vote.title") }}
    </h3>
            <div class="nav">
        </div>
  </div>
</template>

<script>
export default {
    name:"Vote"
};
</script>

<style lang="scss" scoped>
#vote{
    padding: 0px 40px 64px;
    .nav{
        display:flex;
        align-items: left;
        border-bottom:1px solid #ddd;
        a{
            border:0;
            font-size:20px;
            padding:10px 24px;
            margin-top:30px;
            color: #666;
            box-sizing: border-box;
        }
        a:hover{
            background-color:var(--yellow-background);
            text-decoration:none;
        }
        .active{
            color:var(--primary);
            border-bottom: 2px solid var(--primary);
        }
    }
    .stake-box{
        display:flex;
        flex-wrap:wrap;
        align-content:left;
    }

}
</style>