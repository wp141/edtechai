import { Breadcrumbs, Text, Button } from '@mantine/core'
import React from 'react'
import { useLocation, Link } from 'react-router-dom';

function Course({course}) {

    const { state } = useLocation();

    return (
        <div>
            <div>
                <Link style={{ textDecoration: 'none' }} to="/">
                    <Text fw={500} fz="lg" m="md">Courses</Text>
                </Link>
                <Text fz="md" m="md">{state.course.name}</Text>
            </div>

        </div>
    )
}

export default Course