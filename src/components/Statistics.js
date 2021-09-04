import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './Statistics.css'

function Statistics( { title, cases, active, isRed, total, ...props}) {
    return (
        <div>
            <Card onClick={props.onClick} className={`box ${active && "box--selected"} ${
        isRed && "box--red"
        }`}>
                <CardContent>
                    <Typography className="title" color="textSecondary">
                        {title}
                    </Typography>
                    <h2 className={`cases ${!isRed && "cases--green"}`}>{cases}</h2>
                    <Typography className="total">
                        {total} Total
                    </Typography>
                </CardContent>
            </Card> 
        </div>
    )
}

export default Statistics
