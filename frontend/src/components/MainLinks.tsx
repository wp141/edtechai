import React from 'react';
import {
  IconBooks,
  IconTargetArrow,
  IconSettings,
  IconBulb,
} from '@tabler/icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
}

function MainLink({ icon, color, label, link }: MainLinkProps) {

  const location = useLocation()

  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
        <UnstyledButton
        sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            paddingBlock: theme.spacing.lg,
            borderRadius: theme.radius.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
            backgroundColor: !location.pathname.startsWith(link) ? "" : theme.colors.gray[0],

            '&:hover': {
            backgroundColor:
              location.pathname.startsWith(link) ? (theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]) : ""
            },
        })}
        >
        <Group>
            <ThemeIcon color={color} variant="light">
            {icon}
            </ThemeIcon>

            <Text size="lg">{label}</Text>
        </Group>
        </UnstyledButton>
    </Link>
  );
}

const data = [
  { icon: <IconBooks size="4rem" />, color: 'blue', label: 'Courses', link: "/courses" },
  { icon: <IconBulb size="4rem" />, color: 'teal', label: 'Generate', link: "/generate" },
  { icon: <IconTargetArrow size="4rem" />, color: 'violet', label: 'Marking', link: "/marking" },
  { icon: <IconSettings size="4rem" />, color: 'grape', label: 'Settings', link: "/settings" },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label}/>);
  return <div>{links}</div>;
}