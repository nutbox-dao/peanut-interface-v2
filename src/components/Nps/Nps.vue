<template>
    <div class="nps">
        <h3>
            {{ $t('nps.nps') }}
        </h3>
        <Card v-for="(item,index) in proposalList" :key="item.num">
            <p>
                {{ index }}
            </p>
            <p>
                {{ item.author }}
            </p>
            <p>
                {{ item.permlink }}
            </p>
            <p>
                {{ item.timestamp }}
            </p>
        </Card>
    </div>
</template>

<script>
import { getProposal } from '../../apis/api'
import Card from '../ToolsComponents/Card'

export default {
    name: "Nps",
    data(){
        return {
            proposalList:[]
        }
    },
    components: {
        Card,
    },
    methods: {
    },
    async mounted () {
        const res = await getProposal()
        this.proposalList = res
        console.log(res);
    }
}
</script>

<style lang="less" scoped>
.nps{
    padding: 0px 40px 64px;
    h3{
        margin-bottom: 64px;
    }
    .card{
        margin-top: 20px;
        display: flex;
        align-items:center;
        justify-content: space-between;
    }
    
}
</style>