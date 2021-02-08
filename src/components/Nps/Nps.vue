<template>
    <div class="nps">
        <h3>
            {{ $t('nps.nps') }}
        </h3>
        <Card v-for="(item,index) in proposalList" :key="item.num">
        <div class="proposal">
            <p style="width:20px">
                {{ index+1 }}
            </p>
            <a target="_blank" :href="'https://blog.nutbox.io/@'+item.author" style="width:100px">
                {{ item.author }}
            </a>
            <a target="_blank" :href="'https://blog.nutbox.io/@'+item.author + '/' + item.permlink" style="flex:1;text-align:left;font-weight:500">
                {{ item.title }}
            </a>
            <p>
                <!--{{ new Date(item.timestamp+'Z') | timeFormat}} -->
                {{ item.status == 'pass' ? $t('nps.pass') : $t('nps.pending') }}
            </p>
        </div>  
        </Card>
    </div>
</template>

<script>
import { getProposal } from '../../apis/api'
import Card from '../ToolsComponents/Card'
import { getDateString } from '../../utils/helper'

export default {
    name: "Nps",
    data(){
        return {
            proposalList:[]
        }
    },
    filters: {
        timeFormat: function(value) {
            return getDateString(value, 8);
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
    }
    .proposal{
        display: flex;
        align-items:center;
        justify-content: space-between;
        min-height: 72px;
        p , a{
            margin: 0 10px;
            color: #333;
        }
        a:hover{
            color: var(--primary);
        }
    }
    
}
</style>