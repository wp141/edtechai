import { NativeSelect, NumberInput, Tabs, Text, TextInput, Button, Checkbox, Loader, Radio, Group } from '@mantine/core'
import React, {useState, useEffect, useRef} from 'react'
import { config } from '../constants'
import '../css/Generate.css';
import GenerateResults from './GenerateResults';

export default function Generate() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [course, setCourse] = useState(null);
  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);
  
  // Question Gen States
  const topic = useRef("");
  const year = useRef("12");
  const difficulty = useRef("Easy");
  const number = useRef(1);
  const styling = useRef("None");
  const genSolutions = useRef(false);

  async function getCourses() {
    setLoading(true);
    const reqURL = config.url.API_URL.concat("/courses");
    fetch(reqURL).then(res => {
      if (res.status == 200) {
        res.json().then(data => {
          setCourses(data);
          setLoading(false);
          if (data.length > 0) {
            setCourse(data[0]._id);
          }
        })
      } else {
        setLoading(false);
      }
    })
  }

  async function generateQuestions(e) {
    e.preventDefault();
    setGenerating(true);
    const formData = new FormData();

    formData.append("course", course);
    formData.append("topic", topic.current.value);
    formData.append("year", year.current.value);
    formData.append("difficulty", difficulty.current.value);
    formData.append("number", number.current.value);
    formData.append("styling", styling.current.value);
    formData.append("solutions", genSolutions.current.checked);

    const reqURL = config.url.API_URL.concat("/generate");
    fetch(reqURL, {
        method: 'POST',
        body: formData})
    .then(res => {
      if (res.status == 200) {
        res.json().then(data => {
          setGenerating(false);
          setResults(data);
          setShowResults(true);
        })
      } else {
        setGenerating(false);
      }
    })
  }

  useEffect(() => {
    getCourses();
  }, [])

  return (
    <div>
        <div className="generate-header">
          <Text fw={500} fz="lg" p="md">Generate</Text>
        </div>
        {showResults ? <GenerateResults data={results}/>
        :
        generating ? <Loader className="generate-loader"/> 
        :
        <div className="generate-form">
            <NativeSelect
              label="Select Course"
              data={courses.map((course) => ({value: course._id, label: course.name, key: course._id}))}
              onChange={(event) => setCourse(event.currentTarget.value)}
              description="Generation will use the content from this course"
              className="generate-coursepicker"
            />
            <Tabs defaultValue="questions">
              <Tabs.List>
                <Tabs.Tab value="questions">Questions</Tabs.Tab>
                <Tabs.Tab value="assignment">Assignment</Tabs.Tab>
                <Tabs.Tab value="exam">Exam</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="questions" pt="xs">
                <form onSubmit={generateQuestions}>
                  <TextInput ref={topic} label="Topic Area" placeholder="Topic"/>
                  <NativeSelect
                    label="Year Level"
                    data={["5","6","7","8","9","10","11","12"]}
                    defaultValue={"12"}
                    ref={year}
                  />
                  <NativeSelect
                    label="Difficulty Level"
                    data={["Easy", "Medium", "Hard"]}
                    defaultValue={"Easy"}
                    ref={difficulty}
                  />
                  <NumberInput label="Number of Questions" defaultValue={1} ref={number}/>
                  <NativeSelect 
                    label="Question Styling"
                    data={["None", "NESA Verbs", "IB Command Terms"]}
                    ref={styling}
                  />
                  <Checkbox my="sm" label="Generate Solutions" ref={genSolutions} defaultChecked={false}/>
                  <Button my="sm" variant="light" type="submit" disabled={generating}>Generate</Button>
                </form>
              </Tabs.Panel>

              <Tabs.Panel value="assignment" pt="xs">
                <form>
                  <TextInput ref={topic} label="Topic Area" placeholder="Topic"/>
                  <NativeSelect
                    label="Year Level"
                    data={["5","6","7","8","9","10","11","12"]}
                    defaultValue={"12"}
                    ref={year}
                  />
                  <NativeSelect
                    label="Difficulty Level"
                    data={["Easy", "Medium", "Hard"]}
                    defaultValue={"Easy"}
                    ref={difficulty}
                  />
                  <NativeSelect
                    label="Assessment Form"
                    data={["Written", "Video", "Oral"]}
                    defaultValue={"Easy"}
                    ref={difficulty}
                  />
                  <NumberInput label="Number of Marks" defaultValue={20} ref={number}/>
                  <Radio.Group my="sm" defaultValue="individual">
                    <Group>
                      <Radio value="individual" label="Individual"/>
                      <Radio value="group" label="Group"/>
                    </Group>
                  </Radio.Group>
                  {/* <Checkbox my="sm" label="Generate Marking Criteria" defaultChecked={false}/> */}
                  <Button my="sm" variant="light" type="submit" disabled={generating}>Generate</Button>
                  
                </form>
              </Tabs.Panel>

              <Tabs.Panel value="exam" pt="xs">
                <form>
                  <TextInput ref={topic} label="Topic Area" placeholder="Topic"/>
                  <NativeSelect
                    label="Year Level"
                    data={["5","6","7","8","9","10","11","12"]}
                    defaultValue={"12"}
                    ref={year}
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
                  <Button my="sm" variant="light" type="submit" disabled={generating}>Generate</Button>
                </form>
              </Tabs.Panel>
            </Tabs>

        </div>
        }
        
    </div>
  )
}
