import { Card, Image, Text } from '@mantine/core'
import React, {useEffect} from 'react'
import { Link } from 'react-router-dom';

function Course({course}) {
    return (
        <Link to={course._id} state={{course : course}} style={{ textDecoration: 'none' }}>
            <Card shadow="sm" radius="md" withBorder>
                <Card.Section>
                    <Image height={160} src={null} withPlaceholder/>
                    <Text weight={500} p="xs">
                        {course.name}
                    </Text>
                </Card.Section>
            </Card>
        </Link>
        
  )
}

export default Course