import { NativeSelect, NumberInput, Tabs, Text, TextInput, Button, Checkbox, Loader, Radio, Group, Stepper, Grid } from '@mantine/core'
import React, {useState, useEffect, useRef} from 'react'
import { config } from '../constants'
import '../css/Generate.css';
import GenerateResults from './GenerateResults';
import GenerateForm from './GenerateForm';

export default function Generate() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [course, setCourse] = useState(null);
  const [results, setResults] = useState({});

  const [selected, setSelected] = useState({questions: [], solutions: []});
  // const [showResults, setShowResults] = useState(false);
  
  // Question Gen States
  const topic = useRef("");
  const year = useRef("12");
  const difficulty = useRef("Easy");
  const number = useRef(1);
  const styling = useRef("None");
  const genSolutions = useRef(false);

  // Stepper States

  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
    setResults({});
    nextStep();
    const formData = new FormData(e.target);
    formData.append("course", course);
    formData.append("topic", topic.current.value);
    formData.append("year", year.current.value);
    formData.append("difficulty", difficulty.current.value);
    formData.append("number", number.current.value);
    formData.append("styling", styling.current.value);
    formData.append("solutions", genSolutions.current.checked);

    const reqURL = config.url.API_URL.concat("/generate-questions");
    fetch(reqURL, {
        method: 'POST',
        body: formData})
    .then(res => {
      if (res.status == 200) {
        res.json().then(data => {
          setResults(data);
          setGenerating(false);
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
        <Stepper px="md" m="md" active={active} onStepClick={setActive} breakpoint="sm" allowNextStepsSelect={false}>
          <Stepper.Step label="Describe" description="Describe" allowNextStepsSelect={false}>
          <div className="generate-form">
            <GenerateForm props={{courses, course, setCourse, generateQuestions}} refs={{topic, year, difficulty, number, styling, genSolutions}}/>
        </div>
          </Stepper.Step>
          <Stepper.Step label="Review" description="Review" allowNextStepsSelect={false} loading={generating}>
            <GenerateResults props={{results, selected, setSelected, nextStep}}/>
          </Stepper.Step>
          <Stepper.Step label="Finalise" description="Finalise" allowNextStepsSelect={false}>
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
        {/* {showResults ? <GenerateResults data={results}/>
        :
        generating ? <Loader className="generate-loader"/> 
        :
        
        } */}
        
    </div>
  )
}
