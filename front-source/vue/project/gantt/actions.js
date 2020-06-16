const updateThingDate = $.debounce(function(item) {
  console.log(item)
  $.post({}, '/thing/patch.do')
}, 500)
// 任务点击
class ItemClickAction {
  constructor(element, data) {
    this.data = data
    this.onClick = this.onClick.bind(this)
    element.addEventListener('click', this.onClick)
  }

  destroy(element, data) {
    element.removeEventListener('click', this.onClick)
  }

  update(element, data) {
    const hasClass = element.classList.contains('resizing')
    if (data.item.isResizing && !hasClass) {
      element.classList.add('resizing')
    } else if (!data.item.isResizing && hasClass) {
      // 移动结束
      debugger
      updateThingDate(item.data)
      element.classList.remove('resizing')
    }
  }

  onClick(event) {
    $.emit('thingDetail', this.data.item.id)
  }
}

// 点击任务列查看详情
class RowClickAction {
  constructor(element, data) {
    this.data = data
    this.onClick = this.onClick.bind(this)
    element.addEventListener('click', this.onClick)
  }

  destroy(element, data) {
    element.removeEventListener('click', this.onClick)
  }

  onClick(event) {
    $.emit('thingDetail', this.data.rowId)
  }
}

// 点击空单元格，创建任务
class GridClickAction {
  constructor(element, data) {
    this.data = data
    this.onClick = this.onClick.bind(this)
    element.addEventListener('dblclick', this.onClick)
  }

  destroy(element, data) {
    element.removeEventListener('dblclick', this.onClick)
  }

  onClick(event) {
    let time = this.data.time,
      begin = $.date(parseInt(time.leftGlobal) / 1000),
      end = $.date(parseInt(time.rightGlobal / 1000))
    $.emit('thingAdd', { range: [begin, end] })
  }
}

export default {
  item: [ItemClickAction],
  row: [RowClickAction],
  grid: [GridClickAction]
}
