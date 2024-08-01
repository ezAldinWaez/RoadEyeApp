import React from 'react'
import ReactApexChart from 'react-apexcharts';

class Chart1 extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [
          {
            name: "High - 2013",
            data: [38, 39, 43, 46, 42, 42, 43]
          },
          {
            name: "Low - 2013",
            data: [22, 21, 24, 28, 27, 23, 23]
          }
        ],
        options: {
          chart: {
            type: 'line',
            
            // dropShadow: {
            //   enabled: false,
            //   color: '#000',
            //   top: 18,
            //   left: 7,
            //   blur: 10,
            //   opacity: 0.2
            // },
            // zoom: {
            //   enabled: false
            // },
            toolbar: {
              show: false
            }
          },
          colors: ['#77B6EA', '#545454'],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: 'smooth',
            width: '2'
          },
          title: {
            text: 'Average High & Low Temperature',
            align: 'center',
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          markers: {
            size: 5, //Point under all values (when making hover) 
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            title: {
              text: 'Month'
            }
          },
          yaxis: {
            title: {
              text: 'Temperature'
            },
            min: 10,
            max: 200
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -25
          }
        },     
      };
    }

    render() {
      return (
        <div>
          <div id="chart" className='d-flex justify-content-center'>
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} width={350}  />
          </div>
          <div id="html-dist"></div>
        </div>
      );
    }
  }

  export default Chart1;