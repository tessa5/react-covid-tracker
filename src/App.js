import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import './App.css'
import Map from './components/Map'
import Table from './components/Table'
import Statistics from './components/Statistics'
import { sortData, printStat } from './utility'
import Graph from './components/Graph'
import 'leaflet/dist/leaflet.css'

function App() {
    const [country,setCountry] = useState('worldwide')
    const [countries,setCountries] = useState([])
    const [countryInfo, setCountryInfo] = useState({})
    const [tableData, setTableData] = useState([])
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796})
    const [mapZoom, setMapZoom] = useState(3)
    const [mapCountries,setMapCountries] = useState([])
    const [casesType, setCasesType] = useState('cases')

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
        .then((response) => response.json())
        .then((data) => {
            setCountryInfo(data)
        })
    }, [])

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
            .then((response) => response.json())
            .then((data) => {
                const countries = data.map((country) => ({
                    name: country.country,
                    value: country.countryInfo.iso2
                }))

                const sortedData = sortData(data);
                setTableData(sortedData);
                setMapCountries(data)
                setCountries(countries)
            })
        }    

        getCountriesData();
    }, [])

    const onCountryChange =  async (e) => {
        const countryCode = e.target.value;
        setCountry(countryCode);

        const url = countryCode === 'worldwide' ? "https://disease.sh/v3/covid-19/all" :
        `https://disease.sh/v3/covid-19/countries/${countryCode}`
        await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            setCountryInfo(data);
            setCountry(countryCode);

            setMapCenter([data.countryInfo.lat, data.countryInfo.lng]);
            setMapZoom(4);
        })
    }

    return (
        <div className="container">
            <div className="left-side">
                <div className="header">
                <h1>COVID-19 TRACKER</h1>
                <FormControl>
                    <Select
                        variant="outlined"
                        value={country}
                        onChange={onCountryChange}
                    >
                    <MenuItem value='worldwide'>Worldwide</MenuItem>
                    {countries.map((country) => (
                        <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </div>
                <div className="stats">
                    <Statistics
                        isRed
                        active={casesType === 'cases'}
                        onClick={(e) => setCasesType("cases")}
                        title="Coronavirus Cases"
                        cases={printStat(countryInfo.todayCases)}
                        total={printStat(countryInfo.cases)}
                    />
                    <Statistics
                        active={casesType === 'recovered'}
                        onClick={(e) => setCasesType("recovered")}
                        title="Recovered"
                        cases={printStat(countryInfo.todayRecovered)}
                        total={printStat(countryInfo.recovered)}
                    />
                    <Statistics
                        isRed
                        active={casesType === 'deaths'}
                        onClick={(e) => setCasesType("deaths")}
                        title="Deaths"
                        cases={printStat(countryInfo.todayDeaths)}
                        total={printStat(countryInfo.deaths)}
                    />
                </div>
                <Map
                    casesType={casesType}
                    center={mapCenter}
                    zoom={mapZoom}
                    countries={mapCountries}
                />
            </div>
            <Card className="right-side">
                <CardContent>
                    <h2>Live Cases by Country</h2>
                    <Table countries={tableData}/>
                    <h2>Worldwide New {casesType}</h2>
                    <Graph className="graph" casesType={casesType}/>
                </CardContent>
            </Card>
        </div>
    )
}

export default App
