import { Text, Container, Grid, Button, Progress, Loader, Modal, TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Course from './tiles/CourseTile'
import '../css/Courses.css';
import { config } from '../constants'
import { IconPlus } from '@tabler/icons-react';

export default function Courses() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");

  async function createCourse(e) {
    e.preventDefault();
    const reqURL = config.url.API_URL.concat("/course");
    fetch(reqURL, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        "name" : name
      })}).then(res => {
        if (res.status == 200) {
          console.log("success");
          setCreating(false);
          getCourses();
        } else {
          console.log("error");
        }
      })
  }

  async function getCourses() {
    setLoading(true);
    const reqURL = config.url.API_URL.concat("/courses");
    fetch(reqURL).then(res => {
      if (res.status == 200) {
        res.json().then(data => {
          setCourses(data);
          setLoading(false);
        })
      } else {
        setLoading(false);
      }
    })
  }

  useEffect(() => {
    getCourses();
  }, [])

  return (
    <div className="courses">
      <div className="courses-header">
        <Text fw={500} fz="lg" m="md">Courses</Text>
        <Button m="md" onClick={() => setCreating(true)}><IconPlus size={18}/></Button>
        {/* <IconPhotoCirclePlus></IconPhotoCirclePlus> */}
      </div>
      {loading ? 
        <div className="courses-loading">
          {/* <Loader/>  */}
        </div>
        : 
        <Grid p="md">
          {courses.length > 0 ? 
            courses.map((course) => (
              <Grid.Col sm={6} lg={3} key={course._id}>
                <Course course={course}/>
              </Grid.Col>
            ))
            : 
            <>
            </>
          }
        </Grid>
      }
      <Modal opened={creating} onClose={() => (setCreating(false))} title="Create Course" centered className="course-modal">
        <form onSubmit={createCourse}>
          <TextInput label="Course Name" placeholder="Enter course name here" my="md" required value={name} onChange={(event) => setName(event.currentTarget.value)}/>
          {/* <Modal.CloseButton>Create</Modal.CloseButton> */}
          <Button my="md" type="submit">Create</Button>
        </form>
        
      </Modal>
    </div>
  )
}
