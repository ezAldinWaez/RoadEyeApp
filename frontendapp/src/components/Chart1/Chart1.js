import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const Chart1 = ({ data }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'line',
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

    console.log(data)

    data?.forEach(item => {
      const { time_in_video, objects } = item;
      objects?.forEach(obj => {
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
          categories: data?.map(item => item.time_in_video),
        },
        yaxis: {
          ...chartData.options.yaxis,
          min: 0,
          max: 500,
        },
      },
    });
  }, [data]);

  return (
    // <div style={{flex: '1', padding: '20px', maxHeight: '60vh', margin: '0px 20px 50px'}}>
    <div id="chart" className="d-flex justify-content-center" style={{width: '47%'}}>
      <ReactApexChart position={'center'} options={chartData.options} series={chartData.series} type="line"/>
    </div>
    // {/* <div id="html-dist"></div> */}
    // </div>
  );
}

export default Chart1;
