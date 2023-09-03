import { Text } from '@mantine/core'
import React from 'react'
import '../css/GenerateResults.css';

export default function GenerateResults({data}) {
    
    return (
        <div className="results-page">
            {data && data.questions.map((question, i) => {
                return (
                    <>
                        <Text pb="sm">{question}</Text>
                        <Text pb="sm">{data.solutions[i]}</Text>
                    </>
                   
                )
            })}
        </div>
    )
}
