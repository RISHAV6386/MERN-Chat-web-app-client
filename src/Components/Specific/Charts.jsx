import React from 'react'
import { Line,Doughnut } from "react-chartjs-2";
import { CategoryScale, Chart as Chartjs,Tooltip,Filler,LinearScale,PointElement,LineElement,ArcElement,Legend } from "chart.js";
import { getLast7Days } from '../../Lib/features';
import { orange } from '../../constants/color';
Chartjs.register(CategoryScale,Tooltip,Filler,LinearScale,PointElement,LineElement,ArcElement,Legend );

const labels=getLast7Days()
const LineChartOptions={
    responsive:true,
    plugins:{
        legend:{display:false},
        title:{display:false},
    },
    scales:{
        x:{
            grid:{display:false}
        },
        y:{
            beginAtZero:true,
            grid:{display:false}
        }
    }
}
const LineCharts = ({value=[]}) => {
    const data={
        labels,
        datasets:[{
            data:value,
            label:"Messages",
            fill:false,
            backgroundColor:"rgba(75,192,192,0.2)",
            borderColor:"rgba(75,192,192,1)"
        }]
    }
  return <Line data={data} options={LineChartOptions}/>
}

const doughnutChartOptions={
    responsive:true,
    plugins:{
        legend:{display:false},
    },
    cutout:130
}

const DoughnutChart = ({value=[],labels=[]}) => {
    const data={
        labels,
        datasets:[{
            data:value,
            label:"Total Chats vs Group Chats",
            backgroundColor:["rgba(75,192,192,0.2)",orange],
            borderColor:["rgba(75,192,192,1)",orange],
        }]}
  return <Doughnut style={{zIndex:2}}data={data} options={doughnutChartOptions}/>;
}

export {LineCharts,DoughnutChart}