import { Paper, Text, HoverCard, ActionIcon, Loader, Affix, Button, rem } from '@mantine/core'
import React from 'react'
import '../css/GenerateResults.css';
import { IconChevronsRight, IconMessage, IconPencil, IconRotateClockwise, IconTrash } from '@tabler/icons-react';
import GeneratePaper from './tiles/GeneratePaper';

export default function GenerateResults({props}) {

    console.log(props);
    return (
        <div className="results">
            {props.results.questions ? 
                <>
                    {props.results.questions.map((question, i) => {
                        const solution = props.results.solutions[i];
                        return (
                            <GeneratePaper props={{question, solution, ...props}} />
                        )
                    })}
                    <Affix position={{ bottom: rem(40), right: rem(40) }}>
                        <Button size="lg" onClick={() => props.nextStep()}>Next<IconChevronsRight/></Button>
                    </Affix>
                </>
               
                : 
                <>
                    {/* <Loader className="results-loader"/> */}
                </>
            }
            
            
        </div>
    )
}
