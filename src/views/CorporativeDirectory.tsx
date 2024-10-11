import React from 'react';
import {
  Avatar, Box, Button, Paper,
} from '@mui/material';
import {
  DataGrid, GridColDef, GridRowsProp,
} from '@mui/x-data-grid';
import { Radar } from 'react-chartjs-2';
import {
  Chart, LineElement, PointElement, RadialLinearScale,
} from 'chart.js';
import { Employee, getEmployeeData, Skill } from './corporateDirectoryApiClient';
import useFeedback from '../materialui/useFeedback';
import useLocalization from '../localization/useLocalization';
import useDataGrid from '../materialui/useDataGrid';

Chart.register(RadialLinearScale, PointElement, LineElement);

const buildEmployeeRows = (employees: Employee[]) => employees
  .map((employee, index) => ({
    id: index,
    avatar: employee.avatar,
    name: employee.name,
    position: employee.position,
    skills: employee.skills,
  }));

type BuildEmployeeColums = (showSkills: (skills: Skill[]) => void) => GridColDef[];

const buildEmployeeColums: BuildEmployeeColums = (showSkills) => [
  {
    field: 'avatar',
    headerName: 'avatar',
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
  { field: 'name', headerName: 'name', width: 150 },
  { field: 'position', headerName: 'position', width: 150 },
  {
    field: 'skills',
    headerName: 'skills',
    width: 200,
    renderCell: ({ value: skills, row: { name } }) => (
      <Button
        variant="contained"
        size="small"
        onClick={() => { showSkills(skills); }}
        fullWidth
        sx={{ textTransform: 'none' }}
      >
        {`${name} skills`}
      </Button>
    ),
  },
];

const PrivateExample = () => {
  const { getMessages } = useLocalization();
  const { corporativeDirectory: messages } = getMessages();
  const { localeText } = useDataGrid();
  const { setLoading, setLoadingMessage } = useFeedback();
  const [rows, setRows] = React.useState<GridRowsProp | undefined>(undefined);
  React.useEffect(() => {
    setLoading(!rows);
  }, [rows]);
  React.useEffect(() => {
    setLoadingMessage(messages.retrievingData);
    getEmployeeData()
      .then((employees) => {
        setRows(buildEmployeeRows(employees));
      });
    // .catch((error) => {});
  }, []);

  const showSkills = (skills: Skill[]) => {
    console.log(skills);
  };
  if (!rows) return null;
  return (
    <Paper elevation={3} sx={{ my: 1, height: '80vh' }}>
      <DataGrid
        rows={rows}
        columns={buildEmployeeColums(showSkills)}
        rowHeight={60}
        localeText={localeText}
      />
    </Paper>
  );
};

export default PrivateExample;
