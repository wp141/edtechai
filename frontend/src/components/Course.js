import { Text, Button, FileInput, Modal, Loader } from '@mantine/core'
import React, {useEffect, useState} from 'react'
import { useLocation, Link } from 'react-router-dom';
import { IconUpload } from '@tabler/icons-react';
import { config } from '../constants'
import '../css/Course.css';

function Course({course}) {

    const { state } = useLocation();
    const [toggleUpload, setToggleUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState(null);

    async function uploadResource(e) {
        e.preventDefault();
        console.log(file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("course", state.course._id)

        const reqURL = config.url.API_URL.concat("/resource");
        fetch(reqURL, {
            method: 'POST',
            body: formData})
        .then(res => {
            if (res.status == 200) {
                console.log("success");
                setToggleUpload(false);
                getCourseData();
            } else {
                console.log("error");
            }
        })
    }

    async function getCourseData() {
        setLoading(true);
        const reqURL = config.url.API_URL.concat(`/course?id=${state.course._id}`);
        fetch(reqURL).then(res => {
            if (res.status == 200) {
                res.json().then(data => {
                    setCourseData(data);
                    setLoading(false);
                })
            } else {
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        getCourseData();
    }, [])

    return (
        <div>  
            <div className="course-header">
                <Text fw={500} m="md" td="underline">{state.course.name}</Text>
                <Button m="md" onClick={() => setToggleUpload(true)}>Add Resource</Button>
            </div>
            <Text mx="md" td="underline">Course Resources</Text>
            {loading ? 
                <Loader mx="md"/> 
                : 
                <>
                    {courseData !== null && courseData.resources.length > 0 ? 
                        courseData.resources.map((resource) => (
                            <Text fz="sm" mx="md" key={resource._id}>{resource.filename}</Text>
                        ))
                        : 
                        <></>
                    }
                </>
                
            }
            <Modal opened={toggleUpload} onClose={() => (setToggleUpload(false))} title="Upload New Course Resource" centered className="resource-modal">
                <form onSubmit={uploadResource}>
                    <FileInput required value={file} onChange={setFile} label="Upload (allowed file types .pdf .txt .docx)" placeholder="Upload..." icon={<IconUpload/>}/> 
                    <Button my="md" type="submit">Upload</Button>
                </form>
            </Modal>
        </div>

    )
}

export default Course