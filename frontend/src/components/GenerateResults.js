import { Paper, Text, HoverCard, ActionIcon } from '@mantine/core'
import React from 'react'
import '../css/GenerateResults.css';
import { IconMessage, IconPencil, IconRotateClockwise, IconTrash } from '@tabler/icons-react';

export default function GenerateResults({data}) {
    
    return (
        <div className="results">
            {/* <Paper className="results-paper" shadow="md"> */}
                {data && data.questions.map((question, i) => {
                    return (
                        <HoverCard width={200} shadow="md">
                            <HoverCard.Target>
                                <Paper withBorder className="results-paper" shadow="md">   
                                    <Text my="sm">{question}</Text>
                                    <Text mb="lg" p>{data.solutions[i]}</Text>
                                </Paper>
                            </HoverCard.Target>
                            <HoverCard.Dropdown className="results-tools">
                                <ActionIcon><IconRotateClockwise/></ActionIcon>
                                <ActionIcon color="red"><IconTrash/></ActionIcon>
                                <ActionIcon><IconPencil/></ActionIcon>
                                <ActionIcon><IconMessage/></ActionIcon>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    
                    )
                })}
            
            
        </div>
    )
}
