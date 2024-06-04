import React, { useContext } from 'react';
import DataContext from '../contexts/dataContext';
import { TaskBar, List } from '@react95/core';
import styled from 'styled-components';
import logoPump from './logo_pump.ico'; // Adjust the path as necessary

const Link = styled.a`
  text-decoration: none;
  color: inherit;
`;

const IconImg = styled.img`
  height: 20px;  // Adjust size as needed
  width: 20px;
  margin-right: 5px;
`;

function Taskbar() {
    const { projectRepo, react95Repo } = useContext(DataContext).getProjectInfo();
    console.log(projectRepo, react95Repo);

    return (
        <TaskBar
            list={
                <List>
                    <List.Item className="pointer" icon="brush">
                        <Link href={react95Repo} target="_blank">Paint</Link>
                    </List.Item>
                    <List.Divider />
                    <List.Item className="pointer">
                        <Link href={projectRepo} target="_blank">
                            <IconImg src={logoPump} alt="Pump Icon" />
                            Pump.fun
                        </Link>
                    </List.Item>
                </List>
            }
        />
    );
}

export default Taskbar;
