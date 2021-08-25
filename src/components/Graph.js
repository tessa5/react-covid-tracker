import React, { useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import numeral from 'numeral';

function Graph() {
    const [data,setData] = useState({});

    const buildChart = (data, casesType = "cases") => {
        const chartData = [];
        let lastDataPoint;
        for(let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint,
                };
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }
    const options = {
        legend: {
            display: false,
        },
        elements: {
            point: {
                radius: 0,
            },
        },
        maintainAspectRatio : false,
        tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
                label: function (tooltipItem, data) {
                    return numeral(tooltipItem.value).format("+0,0");
                },
            },
        },
        scales: {
            xAxes: [
                {
                    type: 'time',
                    time: {
                        format: "MM/DD/YY",
                        tooltipFormat: "ll"
                    },
                },
            ],
            yAxes: [
                {
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            return numeral(value).format("0a");
                        }
                    }
                }
            ]
        }
    }

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then(response => response.json())
        .then(data => {
            const chartData = buildChart(data);
            setData(chartData);
        })
        
    }, [])

    return (
        <div>
            {data?.length > 0 && (
                <Line
                data={{
                    datasets: [{
                        data:data,
                        borderColor: "#CC1034",
                        backgroundColor: "rgba(204, 16, 52, 0.5 )",
                    }]
                }}
                options= {options}
            />
            )}
            
        </div>
    )
}

export default Graph
