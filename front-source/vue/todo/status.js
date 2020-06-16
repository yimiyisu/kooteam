let now = parseInt(new Date().getTime() / 1000)

export default {
    props: ['value'],
    data() {
        return {
            categorys: [],
            category: null
        }
    },
    render() {
        let that = this, thing = that.value, color, title;
        if (thing.status === 1) {
            color = 'ft gray';
            title = "已完成"
        } else if (thing.end && thing.end < now) {
            color = 'ft red';
            title = "已超时"
        } else {
            color = 'ft green';
            title = "未完成"
        }
        // if (thing.projectId) {
        //     let categorys = ProjectStore.get(thing.projectId), category;
        //     that.categorys = categorys;
        //     categorys.forEach(item => {
        //         item.id === thing.category && (category = item)
        //     });
        //     if (category) {
        //         color = 'ft hover ' + category.color;
        //         title = category.title;
        //     }
        //     return (
        //         <z-popover width='120' popper-class='z-project-pop' trigger='hover'>
        //             <ul>
        //                 {categorys.map((item) => {
        //                     return <li on-click={() => that.change(item)}>
        //                         <span class={'ft hover ' + item.color}>{item.title}</span>
        //                     </li>
        //                 })}
        //             </ul>
        //             <span slot='reference' class={color}>{title}</span>
        //         </z-popover>
        //     )
        // }
        return <span class={color}>{title}</span>;
    },
    methods: {
        async change(val) {
            let thing = this.value, params = {_id: thing._id, category: val.id};
            val.type === 1 && (params.status = val.type);
            await $.post(params, "/thing/patch.do");
            Vue.set(this.value, "category", val.id);
            $.emit("thingUpdate", thing, 'category');
            let content = "更新了任务状态" + val.title;
            $.post({thingId: thing._id, content: content}, '/put/thingLog.json', function (reback) {
            });
            // this.value.category = val.id
        }
    }
}
