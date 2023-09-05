import React, {useState} from 'react'
import { ActionIcon, Checkbox, Paper, Text } from '@mantine/core'
import { IconRotateClockwise } from '@tabler/icons-react';

export default function GeneratePaper({props}) {

    return (
        // withBorder
        // , border: `${rem(3)} solid ${selected ? "#90EE90" : "none"}`}}
        <div>
            <Paper className="results-paper" shadow="md">
                <Text my="sm">{props.question}</Text>
                <Text mb="lg" p>{props.solution}</Text>
                {/* <Checkbox label="Keep"/> */}
                <ActionIcon sx={{alignItems: "right"}} variant="light"><IconRotateClockwise/></ActionIcon>
            </Paper>
        </div>
    )
}
