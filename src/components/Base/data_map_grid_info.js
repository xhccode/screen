const pie = function (name, data) {
  return {
    color: ['#0f8e79', '#19dcbc', '#68e0cc', '#76c1b5', '#9abdb8'],
    tooltip: {
      trigger: 'item'
    },
    legend:{
      show:true,
      bottom:0,
      width:'100%',
      padding:[0, 20],
      textStyle:{
        width: 120,
        color: '#fff'
      }    
    },
    series: [
      {
        name,
        type: 'pie',
        radius: ['30%', '45%'],
        center:['50%','40%'],
        data,
        label: {
          color: '#fff',
          formatter: '{b}\n{c}'
        },
        labelLine: {
          length: 5,
          length2: 5
        }
      }
    ]
  }
}

const ring = function (name, data) {
  return {
    color: ['#0f8e79', '#19dcbc', '#68e0cc', '#76c1b5', '#9abdb8'],
    legend:{
      show:true,
      bottom:0,
      width:'100%',
      textStyle:{
        color:'#fff'
      } 
    },
    series: [
      {
        name,
        type: 'pie',
        radius: ['30%', '45%'],
        center:['50%','40%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10
        },
        label: {
          color: '#fff',
          formatter: '{b}\n{c}'
        },
        labelLine: {
          length: 5,
          length2: 5
        },
        data
      }
    ]
  }
}

export default {
  pie,
  ring
}
