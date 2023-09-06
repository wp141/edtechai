import { NativeSelect, NumberInput, Tabs, Text, TextInput, Button, Checkbox, Loader, Radio, Group, Stepper, Grid } from '@mantine/core'
import React, {useState, useEffect, useRef} from 'react'
import { config } from '../constants'
import '../css/Generate.css';
import GenerateResults from './GenerateResults';
import GenerateForm from './GenerateForm';
import GenerateDocEditor from './GenerateDocEditor';
import GenerateExport from './GenerateExport';

export default function Generate() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [course, setCourse] = useState(null);
  const [results, setResults] = useState({});

  const [selected, setSelected] = useState({questions: [], solutions: []});
  // const [showResults, setShowResults] = useState(false);
  
  // Question Gen States
  const topicQ = useRef("");
  const yearQ = useRef("12");
  const difficultyQ = useRef("Easy");
  const numberQ = useRef(1);
  const stylingQ = useRef("None");
  const genSolutionsQ = useRef(false);

  const questionRefs = {
    topicQ,
    yearQ,
    difficultyQ,
    numberQ,
    stylingQ,
    genSolutionsQ,
  }

  // Assignment Gen States
  const topicA = useRef("");
  const yearA = useRef("12");
  const difficultyA = useRef("Easy");
  const assessmentFormA = useRef("Written");
  const marksA = useRef(20);
  const taskForA = useRef("individual");
  
  const assignmentRefs = {
    topicA,
    yearA,
    difficultyA,
    assessmentFormA,
    marksA,
    taskForA,
  }

  // Exam Gen States
  const topicE = useRef("");
  const yearE = useRef("12");
  const difficultyE = useRef("Easy");
  const multisE = useRef(20);
  const shortsE = useRef(5);
  const longsE = useRef(1);

  const examRefs = {
    topicE,
    yearE,
    difficultyE,
    multisE,
    shortsE,
    longsE,
  }

  // Stepper States

  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const [docContent, setDocContent] = useState("");

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
    console.log(topicQ);

    const formData = new FormData(e.target);
    formData.append("course", course);
    formData.append("topic", topicQ.current.value);
    formData.append("year", yearQ.current.value);
    formData.append("difficulty", difficultyQ.current.value);
    formData.append("number", numberQ.current.value);
    formData.append("styling", stylingQ.current.value);
    formData.append("solutions", genSolutionsQ.current.checked);

    console.log(formData);
    setGenerating(true);
    setResults({});
    nextStep();

    const reqURL = config.url.API_URL.concat("/generate-questions");
    fetch(reqURL, {
        method: 'POST',
        body: formData})
    .then(res => {
      if (res.status == 200) {
        res.json().then(data => {
          console.log(data);
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
            <GenerateForm props={{courses, course, setCourse, generateQuestions}} refs={{...questionRefs, ...assignmentRefs, ...examRefs,}}/>
          </Stepper.Step>
          <Stepper.Step label="Review" description="Review" allowNextStepsSelect={false} loading={generating}>
            <GenerateResults props={{results, selected, setSelected, nextStep}}/>
          </Stepper.Step>
          <Stepper.Step label="Finalise" description="Finalise" allowNextStepsSelect={false}>
            <GenerateDocEditor props={{results, nextStep, docContent, setDocContent}} refs={{topicQ}}/>
          </Stepper.Step>
          <Stepper.Completed>
            <GenerateExport props={{docContent}}/>
          </Stepper.Completed>
        </Stepper>
        
    </div>
  )
}
