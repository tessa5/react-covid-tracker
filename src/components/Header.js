import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import Statistics from './Statistics';
import './Header.css'
import Map from './Map';
import Table from './Table'
import { sortData} from "../utility"
import Graph from './Graph';

function Header() {
const [countries, setCountries] = useState([]);
const [country, setCountry] = useState('worldwide')
const [countryInfo, setCountryInfo] = useState({})
const [tableData, setTableData] = useState([])

useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
        setCountryInfo(data)
    })
    
}, [])

useEffect(() => {
    const getcountryData = async ()=> {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
            const countries = data.map((country) => (
                {
                    name: country.country,
                    value: country.countryInfo.iso2
                }
            ))
            const sortedData = sortData(data)
            setTableData(sortedData);
            setCountries(countries)
        })
    }
    getcountryData();
}, [])
const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
            setCountry(countryCode);
            setCountryInfo(data);
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
                    <MenuItem value="worldwide">Worldwide</MenuItem>
                    {countries.map((country) => (
                        <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))}
                    
                </Select>
            </FormControl>
        </div>
        <div className="stats">
            <Statistics
                title="Coronavirus Cases"
                cases= {countryInfo.todayCases}
                total={countryInfo.cases}
            />
            <Statistics
                title="Recovered"
                cases= {countryInfo.todayRecovered}
                total={countryInfo.recovered}
            />
            <Statistics
                title="Deaths"
                cases= {countryInfo.todayDeaths}
                total={countryInfo.deaths}
            />
        
    </div>
    <Map/>
    </div>
            <Card className="right-side">
                <CardContent>
                    <h2>Live Cases by Country</h2>
                    <Table countries={tableData}/>
                    <h2>Worldwide New Cases</h2>
                    <Graph/>
                </CardContent>
            </Card>
    </div>
    )
}

export default Header
