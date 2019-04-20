<template>
    <tr>
        <th>
            <span>所有事项</span>
        </th>
        <td :key="'scale'"
            :class="{'weekend':start.isWeekend,'month':start.isFirst}">{{start.text}}
        </td>
        <td v-for="(item,idx) in data" :key="'scale'+idx"
            :class="{'weekend':item.isWeekend,'month':item.isFirst}">{{item.text}}
        </td>
    </tr>
</template>
<script>
    export default {
        props: ["data", "start"],
        data: function () {
            return {
                list: []
            }
        },
        created: function () {

        }
    }
</script>