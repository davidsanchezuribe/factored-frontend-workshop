import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Avatar, Box } from '@mui/material';
import { Employee, Skill } from './corporateDirectoryApiClient';

export const buildEmployeeRows = (employees: Employee[]) => employees
  .map((employee, index) => ({
    id: index,
    avatar: employee.avatar,
    name: employee.name,
    position: employee.position,
    skills: employee.skills,
  }));

type BuildEmployeeColums = (
  headers: { avatar: string, name: string, position: string, skills: string },
  showSkills: (skills: Skill[], name: string) => React.JSX.Element,
) => GridColDef[];

const boldHeader = (header: string) => () => <strong>{header}</strong>;

export const buildEmployeeColums: BuildEmployeeColums = (headers, showSkills) => [
  {
    field: 'avatar',
    renderHeader: boldHeader(headers.avatar),
    width: 150,
    headerAlign: 'center',
    renderCell: ({ value: avatar }) => {
      const imageURL = `images/${avatar}`;
      return (
        <Box display="flex" justifyContent="center">
          <Avatar src={imageURL} sx={{ mt: 1 }} />
        </Box>
      );
    },
  },
  {
    field: 'name', renderHeader: boldHeader(headers.name), minWidth: 150, flex: 1,
  },
  {
    field: 'position', renderHeader: boldHeader(headers.position), minWidth: 150, flex: 1,
  },
  {
    field: 'skills',
    renderHeader: boldHeader(headers.skills),
    minWidth: 150,
    flex: 1,
    renderCell: ({ value: skills, row: { name } }) => showSkills(skills, name),
    headerAlign: 'center',
  },
];
