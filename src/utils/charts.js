/**
 *
 * @param {当期ECharts实例对象} chart  //Current ECharts instance object
 * @param {当期ECharts Option选项} chartOption //Current ECharts Options Options
 * @param {函数的Options} options //options for functions
 * Example: loopShowTooltip(chart, chartOption, { interval: 1000, loopSeries: true })
 * Note: The series of chartOption must have a value (i.e. length) when passed, if not, don't call the function.
 */
export function loopShowTooltip(chart, chartOption, options) {
  let defaultOptions = {
    interval: 2000, // Loop list time
    loopSeries: false, // Loop Series
    seriesIndex: 0,
    updateData: null,
  }
  if (!chart || !chartOption) {
    return
  }

  let dataIndex = 0 // The data index, initialized to -1, is to determine if this is the first execution
  let seriesIndex = 0 // series index
  let timeTicket = 0
  let seriesLen = chartOption.series.length // series length
  let dataLen = 0 // Number of data in a series
  let chartType // Type of series
  let first = true
  let lastShowSeriesIndex = 0
  let lastShowDataIndex = 0
  if (seriesLen === 0) {
    return
  }

  //Pending List
  //If you don't loop series, seriesIndex specifies the series to display tooltip, 
  //the default is 0 if you don't specify it, and the default is the first one if you specify more than one.
  //When looping series, seriesIndex specifies the series to be looped, if not specified, all series will be looped from 0, 
  //if a single one is specified, it is equivalent to no loop, if multiple ones are specified
  //Should I add the start series index and the start data index?

  if (options) {
    options.interval = options.interval || defaultOptions.interval
    options.loopSeries = options.loopSeries || defaultOptions.loopSeries
    options.seriesIndex = options.seriesIndex || defaultOptions.seriesIndex
    options.updateData = options.updateData || defaultOptions.updateData
  } else {
    options = defaultOptions
  }

  //If the set seriesIndex is invalid, the default is 0
  if (options.seriesIndex < 0 || options.seriesIndex >= seriesLen) {
    seriesIndex = 0
  } else {
    seriesIndex = options.seriesIndex
  }

  /**
   * clean up timeticket
   */
  function clearLoop() {
    if (timeTicket) {
      clearInterval(timeTicket)
      timeTicket = 0
    }
    chart.off('mousemove', stopAutoShow)
    zRender.off('mousemove', zRenderMouseMove)
    zRender.off('globalout', zRenderGlobalOut)
  }

  /**
   * cancel Highlight
   */
  function cancelHighlight() {
    /**
     * if dataIndex is 0 means the last series finished displaying, 
     * if it is a cyclic series and the series index is 0 then last time it is seriesLen-1, otherwise it is seriesIndex-1.
     * The current series if it is not a recurring series.
     * If dataIndex>0 then it is the current series.
     */
    let tempSeriesIndex =
      dataIndex === 0
        ? options.loopSeries
          ? seriesIndex === 0
            ? seriesLen - 1
            : seriesIndex - 1
          : seriesIndex
        : seriesIndex
    let tempType = chartOption.series[tempSeriesIndex].type

    if (tempType === 'pie' || tempType === 'radar') {
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: lastShowSeriesIndex,
        dataIndex: lastShowDataIndex,
      }) //wait: If the series number is 0 and the series is recurring, determine whether the last series type is pie, radar
    }
  }

  /**
   * Automatic Rotation: tooltip
   */
  function autoShowTip() {
    let invalidSeries = 0
    let invalidData = 0

    function showTip() {
      //Determining whether to update data
      if (
        dataIndex === 0 &&
        !first &&
        typeof options.updateData === 'function'
      ) {
        options.updateData()
        chart.setOption(chartOption)
      }

      let series = chartOption.series
      let currSeries = series[seriesIndex]
      if (
        !series ||
        series.length === 0 ||
        !currSeries ||
        !currSeries.type ||
        !currSeries.data ||
        !currSeries.data.length
      ) {
        return
      }
      chartType = currSeries.type // Series Type
      dataLen = currSeries.data.length // Number of data in a series

      let tipParams = { seriesIndex: seriesIndex }
      switch (chartType) {
        case 'pie':
        case 'map':
        case 'chord':
          tipParams.name = currSeries.data[dataIndex].name
          break
        case 'radar': // Radar diagram
          tipParams.seriesIndex = seriesIndex
          tipParams.dataIndex = dataIndex
          break
        default:
          tipParams.dataIndex = dataIndex
          break
      }

      if (chartType === 'pie' || chartType === 'radar') {
        if (!first) {
          cancelHighlight()
        }

        // Highlight the current graph
        chart.dispatchAction({
          type: 'highlight',
          seriesIndex: seriesIndex,
          dataIndex: dataIndex,
        })
      }

      // show tooltip
      tipParams.type = 'showTip'

      // Prevent updateData from processing tooltip first 
      // and then refreshing data to export tooltip display incorrectly
      setTimeout(() => {
        chart.dispatchAction(tipParams)
      }, 0)

      lastShowSeriesIndex = seriesIndex
      lastShowDataIndex = dataIndex
      dataIndex = (dataIndex + 1) % dataLen
      if (options.loopSeries && dataIndex === 0) {
        // A data index of 0 means that the current series of data has been cycled through
        invalidData = 0
        seriesIndex = (seriesIndex + 1) % seriesLen
        if (seriesIndex === options.seriesIndex) {
          invalidSeries = 0
        }
      }

      first = false
    }

    showTip()
    timeTicket = setInterval(showTip, options.interval)
  }

  // Close Rotation
  function stopAutoShow() {
    if (timeTicket) {
      clearInterval(timeTicket)
      timeTicket = 0

      if (chartType === 'pie' || chartType === 'radar') {
        cancelHighlight()
      }
    }
  }

  let zRender = chart.getZr()

  function zRenderMouseMove(param) {
    if (param.event) {
      // Stop mouse-over events on canvas from bubbling
      param.event.cancelBubble = true
    }

    stopAutoShow()
  }

  // Resume auto-rotation when leaving the echarts chart
  function zRenderGlobalOut() {
    if (!timeTicket) {
      autoShowTip()
    }
  }

  // Stop rotation when the mouse is over the echarts chart
  chart.on('mousemove', stopAutoShow)
  zRender.on('mousemove', zRenderMouseMove)
  zRender.on('globalout', zRenderGlobalOut)

  autoShowTip()

  return {
    clearLoop: clearLoop,
  }
}
