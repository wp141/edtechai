import { NativeSelect, NumberInput, Tabs, Text, TextInput, Button, Checkbox, Loader, Radio, Group, Stepper, Grid } from '@mantine/core'
import React, {useState, useEffect, useRef} from 'react'
import { config } from '../constants'
import '../css/Generate.css';

export default function GenerateForm({props, refs}) {

    console.log(refs);
    console.log(props);

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
                        <TextInput ref={refs.topicQ} label="Topic Area" placeholder="Topic"/>
                        
                        <NativeSelect
                        label="Year Level"
                        data={["5","6","7","8","9","10","11","12"]}
                        defaultValue={"12"}
                        ref={refs.yearQ}
                        />
                        <Checkbox my="sm" label="Generate Solutions" ref={refs.genSolutionsQ} defaultChecked={false}/>
                        
                    </Grid.Col>
                    <Grid.Col sm={12} lg={6}>
                        <NativeSelect
                            label="Difficulty Level"
                            data={["Easy", "Medium", "Hard"]}
                            defaultValue={"Easy"}
                            ref={refs.difficultyQ}
                        />
                        <NumberInput label="Number of Questions" defaultValue={1} ref={refs.numberQ}/>
                        <NativeSelect 
                        label="Question Styling"
                        data={["None", "NESA Verbs", "IB Command Terms"]}
                        ref={refs.stylingQ}
                        />
                    
                    </Grid.Col>

                    </Grid>  
                    
                    <Button my="sm" variant="light" type="submit" disabled={props.generating}>Generate</Button>
                </form>
                </Tabs.Panel>

                <Tabs.Panel value="assignment" pt="xs">
                <form>
                    <NativeSelect
                        label="Select Course"
                        data={props.courses.map((course) => ({value: course._id, label: course.name, key: course._id}))}
                        onChange={(event) => props.setCourse(event.currentTarget.value)}
                    />
                    <TextInput ref={refs.topicA} label="Topic Area" placeholder="Topic"/>
                    <NativeSelect
                    label="Year Level"
                    data={["5","6","7","8","9","10","11","12"]}
                    defaultValue={"12"}
                    ref={refs.yearA}
                    />
                    <NativeSelect
                    label="Difficulty Level"
                    data={["Easy", "Medium", "Hard"]}
                    defaultValue={"Easy"}
                    ref={refs.difficultyA}
                    />
                    <NativeSelect
                    label="Assessment Form"
                    data={["Written", "Video", "Oral"]}
                    defaultValue={"Written"}
                    ref={refs.assessmentFormA}
                    />
                    <NumberInput label="Number of Marks" defaultValue={20} ref={refs.marksA}/>
                    <Radio.Group my="sm" defaultValue="individual" ref={refs.taskForA}>
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
                    <NativeSelect
                        label="Select Course"
                        data={props.courses.map((course) => ({value: course._id, label: course.name, key: course._id}))}
                        onChange={(event) => props.setCourse(event.currentTarget.value)}
                        />
                    <TextInput ref={refs.topicE} label="Topic Area" placeholder="Topic"/>
                    <NativeSelect
                    label="Year Level"
                    data={["5","6","7","8","9","10","11","12"]}
                    defaultValue={"12"}
                    ref={refs.yearE}
                    />
                    <NativeSelect
                    label="Difficulty Level"
                    data={["Easy", "Medium", "Hard"]}
                    defaultValue={"Easy"}
                    ref={refs.difficultyE}
                    />
                    <NumberInput label="Number of Mulitple Choice Questions" defaultValue={10} ref={refs.multisE}/>
                    <NumberInput label="Number of Short Answer Questions" defaultValue={5} ref={refs.shortsE}/>
                    <NumberInput label="Number of Long Answer Questions" defaultValue={1} ref={refs.longsE}/>
                    <Button my="sm" variant="light" type="submit" disabled={props.generating}>Generate</Button>
                </form>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}
