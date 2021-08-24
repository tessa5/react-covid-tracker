import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'

function Statistics({title, cases, total}) {
    return (
       <Card>
           <CardContent>
               <Typography color="textSecondary">
                   {title}
               </Typography>
               <h3>
                   {cases}
               </h3>
               <Typography color="textSecondary">
                   {total}
               </Typography>
           </CardContent>
       </Card>
    )
}

export default Statistics
