import React from 'react'
import ReactApexChart from 'react-apexcharts';

function generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
  
      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

class Chart2 extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
            name: 'TEAM 1',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 60
            })
          },
          {
            name: 'TEAM 2',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 60
            })
          },
          {
            name: 'TEAM 3',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 30, {
              min: 10,
              max: 60
            })
          },
          {
            name: 'TEAM 4',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
              min: 10,
              max: 60
            })
          },
          {
            name: 'TEAM 5',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 30, {
              min: 10,
              max: 60
            })
          },
        ],
        options: {
          chart: {
            type: 'scatter',
            zoom: {
              type: 'xy'
            }
          },
          dataLabels: {
            enabled: false
          },
          grid: {
            xaxis: {
              lines: {
                show: true
              }
            },
            yaxis: {
              lines: {
                show: true
              }
            },
          },
          xaxis: {
            type: 'datetime',
          },
          yaxis: {
            max: 70
          }
        },
      
      
      };
    }

  

    render() {
      return (
        <div>
          <div id="chart" className='d-flex justify-content-center'>
            <ReactApexChart options={this.state.options} series={this.state.series} type="scatter" height={350} width={350} />
          </div>
          <div id="html-dist"></div>
        </div>
      );
    }
  }

export default Chart2