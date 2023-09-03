import { Text, Button, FileInput, Modal, Loader, Table, ActionIcon } from '@mantine/core'
import React, {useEffect, useState} from 'react'
import { useLocation, Link } from 'react-router-dom';
import { IconTrash, IconUpload } from '@tabler/icons-react';
import { config } from '../constants'
import '../css/Course.css';

function Course({course}) {

    const ths = (
        <tr>
          <th>Resource Name</th>
          <th>Upload Date</th>
          <th>Uploader</th>
          <th>Source</th>
          <th></th>
        </tr>
    );

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
                    console.log(data);
                    setLoading(false);
                })
            } else {
                setLoading(false);
            }
        })
    }

    async function deleteResource(resource) {
        const reqURL = config.url.API_URL.concat(`/resource?resource=${resource}&course=${state.course._id}`);
        fetch(reqURL, {
            method: 'DELETE',
        }).then(res => {
            if (res.status == 200) {
                console.log("success");
                getCourseData();
            } else {
                console.log("error");
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
            {/* <Text mx="md" td="underline">Course Resources</Text> */}
            <div className="resources-table" style={{marginRight: "2rem"}}>
                {loading ? 
                    <Loader mx="md"/> 
                    : 
                    <Table m="md" striped highlightOnHover withBorder>
                        <thead>{ths}</thead>
                        <tbody>
                        {courseData !== null && courseData.resources.length > 0 ? 
                            courseData.resources.map((resource) => (
                                <tr key={resource._id}>
                                    <td style={{width: "40%"}}>{resource.filename}</td>
                                    <td>{resource.uploadDate}</td>
                                    <td>{resource.uploader}</td>
                                    <td><IconUpload/></td>
                                    <td>
                                        <ActionIcon 
                                            disabled
                                            sx={{ 
                                                backgroundColor: "transparent",
                                                color: "rgb(255, 107, 107)",
                                            }}
                                            variant="light" 
                                            onClick={() => deleteResource(resource._id)}>
                                            <IconTrash/>
                                        </ActionIcon>
                                    </td>
                                </tr>
                            ))
                            : 
                            <></>
                        }
                        </tbody>
                    </Table>
                    
                }
            </div>
            
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