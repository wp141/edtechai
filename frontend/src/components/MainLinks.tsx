import React from 'react';
import {
  IconBooks,
  IconTargetArrow,
  IconSettings,
  IconBulb,
} from '@tabler/icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
}

function MainLink({ icon, color, label, link }: MainLinkProps) {
  return (
    <Link to={link}>
        <UnstyledButton
        sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
            backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            },
        })}
        >
        <Group>
            <ThemeIcon color={color} variant="light">
            {icon}
            </ThemeIcon>

            <Text size="sm">{label}</Text>
        </Group>
        </UnstyledButton>
    </Link>
  );
}

const data = [
  { icon: <IconBooks size="4rem" />, color: 'blue', label: 'Courses', link: "/" },
  { icon: <IconBulb size="4rem" />, color: 'teal', label: 'Generate', link: "/generate" },
  { icon: <IconTargetArrow size="4rem" />, color: 'violet', label: 'Marking', link: "/marking" },
  { icon: <IconSettings size="4rem" />, color: 'grape', label: 'Settings', link: "/settings" },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}