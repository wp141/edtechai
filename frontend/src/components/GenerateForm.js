import { NativeSelect, NumberInput, Tabs, Text, TextInput, Button, Checkbox, Loader, Radio, Group, Stepper, Grid } from '@mantine/core'
import React, {useState, useEffect, useRef} from 'react'
import { config } from '../constants'
import '../css/Generate.css';

export default function GenerateForm({props, refs}) {

    return (
        <div>
            <Tabs defaultValue="questions">
                <Tabs.List>
                <Tabs.Tab value="questions">Questions</Tabs.Tab>
                <Tabs.Tab value="assignment">Assignment</Tabs.Tab>
                <Tabs.Tab value="exam">Exam</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="questions" pt="xs">
                <form onSubmit={props.generateQuestions}>
                    <Grid>
                    <Grid.Col sm={12} lg={6}>
                        <NativeSelect
                        label="Select Course"
                        data={props.courses.map((course) => ({value: course._id, label: course.name, key: course._id}))}
                        onChange={(event) => props.setCourse(event.currentTarget.value)}

                        />
                        <TextInput ref={refs.topic} label="Topic Area" placeholder="Topic"/>
                        
                        <NativeSelect
                        label="Year Level"
                        data={["5","6","7","8","9","10","11","12"]}
                        defaultValue={"12"}
                        ref={refs.year}
                        />
                        <Checkbox my="sm" label="Generate Solutions" ref={refs.genSolutions} defaultChecked={false}/>
                        
                    </Grid.Col>
                    <Grid.Col sm={12} lg={6}>
                        <NativeSelect
                            label="Difficulty Level"
                            data={["Easy", "Medium", "Hard"]}
                            defaultValue={"Easy"}
                            ref={refs.difficulty}
                        />
                        <NumberInput label="Number of Questions" defaultValue={1} ref={refs.number}/>
                        <NativeSelect 
                        label="Question Styling"
                        data={["None", "NESA Verbs", "IB Command Terms"]}
                        ref={refs.styling}
                        />
                    
                    </Grid.Col>

                    </Grid>  
                    
                    <Button my="sm" variant="light" type="submit" disabled={props.generating}>Generate</Button>
                </form>
                </Tabs.Panel>

                <Tabs.Panel value="assignment" pt="xs">
                <form>
                    <TextInput ref={refs.topic} label="Topic Area" placeholder="Topic"/>
                    <NativeSelect
                    label="Year Level"
                    data={["5","6","7","8","9","10","11","12"]}
                    defaultValue={"12"}
                    ref={refs.year}
                    />
                    <NativeSelect
                    label="Difficulty Level"
                    data={["Easy", "Medium", "Hard"]}
                    defaultValue={"Easy"}
                    ref={refs.difficulty}
                    />
                    <NativeSelect
                    label="Assessment Form"
                    data={["Written", "Video", "Oral"]}
                    defaultValue={"Easy"}
                    ref={refs.difficulty}
                    />
                    <NumberInput label="Number of Marks" defaultValue={20}/>
                    <Radio.Group my="sm" defaultValue="individual">
                    <Group>
                        <Radio value="individual" label="Individual"/>
                        <Radio value="group" label="Group"/>
                    </Group>
                    </Radio.Group>
                    {/* <Checkbox my="sm" label="Generate Marking Criteria" defaultChecked={false}/> */}
                    <Button my="sm" variant="light" type="submit" disabled={props.generating}>Generate</Button>
                    
                </form>
                </Tabs.Panel>

                <Tabs.Panel value="exam" pt="xs">
                <form>
                    <TextInput ref={refs.topic} label="Topic Area" placeholder="Topic"/>
                    <NativeSelect
                    label="Year Level"
                    data={["5","6","7","8","9","10","11","12"]}
                    defaultValue={"12"}
                    ref={refs.year}
                    />
                    {/* <NativeSelect
                    label="Difficulty Level"
                    data={["Easy", "Medium", "Hard"]}
                    defaultValue={"Easy"}
                    ref={difficulty}
                    /> */}
                    <NumberInput label="Number of Mulitple Choice Questions" defaultValue={10}/>
                    <NumberInput label="Number of Short Answer Questions" defaultValue={5}/>
                    <NumberInput label="Number of Essay Questions" defaultValue={1}/>
                    <Button my="sm" variant="light" type="submit" disabled={props.generating}>Generate</Button>
                </form>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}
