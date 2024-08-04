// import React from 'react'
// import ReactApexChart from 'react-apexcharts';

// class Chart1 extends React.Component {
//     constructor(props) {
//       super(props);

//       this.state = {
      
//         series: [
//           {
//             name: "High - 2013",
//             data: [38, 39, 43, 46, 42, 42, 43]
//           },
//           {
//             name: "Low - 2013",
//             data: [22, 21, 24, 28, 27, 23, 23]
//           }
//         ],
//         options: {
//           chart: {
//             type: 'line',
            
//             // dropShadow: {
//             //   enabled: false,
//             //   color: '#000',
//             //   top: 18,
//             //   left: 7,
//             //   blur: 10,
//             //   opacity: 0.2
//             // },
//             // zoom: {
//             //   enabled: false
//             // },
//             toolbar: {
//               show: false
//             }
//           },
//           colors: ['#77B6EA', '#545454'],
//           dataLabels: {
//             enabled: true,
//           },
//           stroke: {
//             curve: 'smooth',
//             width: '2'
//           },
//           title: {
//             text: 'Average High & Low Temperature',
//             align: 'center',
//           },
//           grid: {
//             borderColor: '#e7e7e7',
//             row: {
//               colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
//               opacity: 0.5
//             },
//           },
//           markers: {
//             size: 5, //Point under all values (when making hover) 
//           },
//           xaxis: {
//             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//             title: {
//               text: 'Month'
//             }
//           },
//           yaxis: {
//             title: {
//               text: 'Temperature'
//             },
//             min: 10,
//             max: 200
//           },
//           legend: {
//             position: 'top',
//             horizontalAlign: 'right',
//             floating: true,
//             offsetY: -25,
//             offsetX: -25
//           }
//         },     
//       };
//     }

//     render() {
//       return (
//         <div>
//           <div id="chart" className='d-flex justify-content-center'>
//             <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} width={350}  />
//           </div>
//           <div id="html-dist"></div>
//         </div>
//       );
//     }
//   }

//   export default Chart1;

import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const Chart1 = ({ data }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'line',
        width: 100,
        height: 100,
        toolbar: {
          show: false,
        },
      },
      colors: [
        '#77B6EA', // Light Blue
        '#545454', // Dark Gray
        '#FF4560', // Red
        '#775DD0', // Purple
        '#00E396', // Green
        '#FEB019', // Yellow
        '#FF7F50', // Coral
        '#008FFB', // Blue
        '#00C8FF', // Light Cyan
        '#FF4560', // Red
        '#F3A4B5', // Light Pink
        '#00C08B', // Teal
      ],
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      title: {
        text: 'Speed over Time',
        align: 'center',
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      markers: {
        size: 2,
      },
      xaxis: {
        title: {
          text: 'Time in Video (seconds)',
        },
      },
      yaxis: {
        title: {
          text: 'Speed (Pixel/Sec)',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -25,
      },
    },
  });

  useEffect(() => {
    // Prepare the series data
    const seriesData = {};

    data.forEach(item => {
      const { time_in_video, objects } = item;
      objects.forEach(obj => {
        const { id, speed } = obj;
        if (!seriesData[id]) {
          seriesData[id] = {
            name: `Object ${id}`,
            data: [],
          };
        }
        seriesData[id].data.push([time_in_video, Math.round(speed)]);
      });
    });

    const allSpeeds = data?.flatMap(item => item.objects?.map(obj => Math.round(obj.speed))) || [];

    setChartData({
      series: Object.values(seriesData),
      options: {
        ...chartData.options,
        xaxis: {
          ...chartData.options.xaxis,
          categories: data.map(item => item.time_in_video),
        },
        yaxis: {
          ...chartData.options.yaxis,
          min: 0,
          max: 1000,
        },
      },
    });
  }, [data]);

  return (
    <div style={{flex: '1'}}>
      <div id="chart" className="d-flex justify-content-center">
        <ReactApexChart options={chartData.options} series={chartData.series} type="line"/>
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default Chart1;
