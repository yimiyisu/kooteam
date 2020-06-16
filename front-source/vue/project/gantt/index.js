import Merge from "./merge"
import ConfigFunc from "./config"

export default {
    props: ['value'],
    data() {
        return {
            instance: null,
            height: 0
        }
    },
    created() {
        this.calHeight();
        $.lib(['gantt/gantt.js', 'gantt/style.css'], this.init);
        $.on('ganttConfig', (prop, value) => {
            if (value === 'now') {
                let gstc = this.instance;

                // gstc.state.subscribe('config.plugin.ItemMovement', itemMovement => {
                //     if (!itemMovement || !itemMovement.item) return
                //     state.update(
                //         `config.chart.items.${itemMovement.item.id}.isResizing`,
                //         itemMovement.item.resizing
                //     )
                // });
                return gstc.api.scrollToTime(gstc.api.time.date().valueOf())
            }
            if (prop === 'period') {
                GSTC.api.setPeriod(value)
            }
        })
    },
    destroyed() {
        this.instance.app.destroy()
        $.off('ganttConfig')
        window.removeEventListener('resize', this.calHeight)
    },
    render() {
        return <div class='k-project-gantt'></div>
    },
    methods: {
        calHeight() {
            if (this.height === 0) {
                window.addEventListener('resize', this.calHeight)
            } else {
                this.instance.state.update('config.height', this.height)
            }
            let currentHeight =
                (document.documentElement.clientHeight || document.body.clientHeight) -
                120
            currentHeight !== this.height && (this.height = currentHeight)
        },
        init() {
            // let data = await $.get(
            //     {_id: this.value._id, status: 0},
            //     '/project/thingList.do');
            let data = Merge(this.value.things);
            let Config = ConfigFunc(this.height, data),
                GSTCState = GSTC.api.stateFromConfig(Config),
                element = this.$el
            GSTCState.subscribe('config.plugin.ItemMovement', itemMovement => {
                if (!itemMovement || !itemMovement.item) return
                GSTCState.update(
                    `config.chart.items.${itemMovement.item.id}.isResizing`,
                    itemMovement.item.resizing
                )
            });
            element.addEventListener('gstc-loaded', () => {
                this.instance.api.scrollToTime(new Date().getTime())
            });
            this.instance = GSTC({
                element,
                state: GSTCState
            });
        }
    }
}
