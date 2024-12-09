<template>
    <el-row>
        <el-col :span="12" class="date">
            <img class="image" src="//b.ebus.vip/f01/67/40213c1dc0834a79d2227a.jpg" />
            <h1>Kooteam Demo</h1>
                 <el-text class="dateDisplay">{{textDate}}</el-text>
            <el-calendar v-model="current" :range="calendarRange">
                <template #date-cell="{ data }">
                    {{ data.day.split('-').slice(1).join('-') }}
                    {{ data.isSelected ? '✔️' : '' }}
                </template>
            </el-calendar>
        </el-col>
        <el-col :span="12" class="detail">
            <h2>需要多长时间？</h2>
            <p class="introduceTime">30分钟</p>
            <h2>什么时间最合适？</h2>
            <h2>显示{{ showDate }}的时间安排</h2>
            <div>
                <el-segmented v-model="selectedOption" :options="segmentOptions" block size="large" />
                <div v-show="selectedOption === 'option1'">
                    <el-scrollbar height="400px">
                        <p v-for="(item, index) in optionLists[selectedOption]" :class="{ 'selected-time': index === selectedTimeIndex }" :key="index" @click="handleTime(item, index)">{{item}}</p>
                    </el-scrollbar>
                </div>
                <div v-show="selectedOption === 'option2'">
                    <el-scrollbar height="400px">
                        <p v-for="(item, index) in optionLists[selectedOption]" :class="{ 'selected-time': index === selectedTimeIndex }" :key="index" @click="handleTime(item, index)">{{item}}</p>
                    </el-scrollbar>
                </div>
            </div>
            <el-button @click="next">下一步</el-button>
        </el-col>
    </el-row>
</template>
<script>
export default {
    data() {
        return {
            dateText: '',
            current: '',
            selectedTime: '',
            calendarRange: [],
            selectedTimeIndex: '',
            selectedOption: 'option1',
            segmentOptions: [
                { label: '上午', value: 'option1' },
                { label: '下午', value: 'option2' }],
                optionLists: {
                    option1: ['09:00', '10:00','11:00'],
                    option2: ['13:00', '14:00','15:00','16:00','17:00']
                },
        };
    },
    computed: {
        textDate() {
            const { current } = this
            return current ? $.dayjs(current).format('MM月 YYYY'): current
        },
        showDate() {
            const { current } = this
            return current ? $.dayjs(current).format('YYYY年MM月DD日'): current
        }
    },
    mounted() {
        const dateObj = new Date();
        const currentDate = $.dayjs(dateObj).format('YYYY-MM-DD');
        this.current = currentDate;
    },
    methods:{
        handleTime(item, index) {
            this.selectedTime = `预约演示的时间为：${this.showDate} ${item}`;
            this.selectedTimeIndex = index;
            // const time = this.selectedTime;
            this.$emit('time-selected', this.selectedTime);
            // this.sendDataToServer(time);
        },
        next() {
            let active=1;
            this.$emit('next', active);
        },
    }
};
</script>
<style lang="scss" scoped>
.date {
    padding:20px 10px;
    background-image: linear-gradient(to right bottom, var(--a-color-primary-dark-2), var(--a-color-primary-light-5));
    text-align: center;
}
h1 {
    color: var(--a-border-color)
}
.introduceTime{
    text-align: center;
    font-size: 16px;
    padding:5px 0;
    margin-bottom: 100px;
    background-color: var(--a-border-color-dark);
    border: 2px solid var(--a-border-color-darker);
}
p{
    font-size: 20px;
    border: 2px solid var(--a-border-color-darker);
    background-color: var(--a-bg-color);
    text-align: center;
    padding: 6px 0;
    margin: 15px 10px;
}
p:hover{
    cursor: pointer;
}
.image {
    width: 72px;
    height: 72px;
    border-radius: 50px;
    border: 4px solid var(--a-bg-color);
}

.dateDisplay {
    color: var(--a-fill-color-extra-light);
    font-size: 24px;
    font-weight: bold;
}
.detail{
    padding: 20px;
}
.selected-time {
    background-color: var(--a-color-primary-light-7);
}
.a-button{
    font-size: 16px;
    width: 25%;
    display: inline-block;
    position: relative;
    left: 70%;
}
</style>