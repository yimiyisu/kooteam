import cnLang from "./lang";
import actions from "./actions";

export default function (height, data) {
    const columns = {
        resizer: {
            inRealTime: false,
            dots: 0
        },
        data: {
            label: {
                id: 'label',
                data: 'label',
                expander: true,
                isHTML: false,
                width: 400,
                header: {
                    content: '任务标题'
                }
            }
        }
    };

    return {
        plugins: [
            ItemMovement({
                moveable: true,
                resizeable: true,
                collisionDetection: true
            }),
            CalendarScroll(),
            WeekendHighlight()
        ],
        locale: cnLang,
        height: height,
        list: {
            toggle: {
                display: false
            },
            rows: data.rows,
            rowHeight: 38,
            columns
        },
        chart: {
            items: data.items,
            time: {
                period: 'day',
                additionalSpaces: {
                    day: {before: 1, after: 1, period: 'month'},
                    week: {before: 1, after: 1, period: 'year'},
                    month: {before: 6, after: 6, period: 'year'},
                    year: {before: 12, after: 12, period: 'year'}
                }
            }
        },
        expander: {
            padding: 4,
        },
        actions: {
            'chart-timeline-items-row-item': actions.item,
            // 'chart-timeline-grid': actions.grid,
            'chart-timeline-grid-row-block': actions.grid,
            'list-column-row': actions.row
        }
    };
}