import '../css/App.css';
import { useState } from 'react';
import { MainLinks } from './MainLinks.tsx';
import Generate from './Generate.js';
import Marking from './Marking.js';
import Settings from './Settings.js';
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme}  from '@mantine/core';
import Courses from './Courses';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Course from './Course';

function App() {

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <AppShell
          styles={{
            main: {
              background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={
            <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
              <MainLinks className="main-links"/>
            </Navbar>
          }
          header={
            <Header height={{ base: 50, md: 70 }} p="md" >
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                  />
                </MediaQuery>
                
                <Text fz="xl">EdTech AI Demo</Text>
              </div>
            </Header>
          }
        >
          <Routes>
            <Route path="/courses" element={<Courses />}/>
            <Route path="/generate" element={<Generate />}/>
            <Route path="/marking" element={<Marking />}/>
            <Route path="/settings" element={<Settings />}/>
            <Route path="/courses/:id" element={<Course/>} />
          </Routes>

        </AppShell>
      </BrowserRouter>

    </div>
  );
}

export default App;
