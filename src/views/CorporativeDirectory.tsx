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
import Modal from '../materialui/Modal';

Chart.register(RadialLinearScale, PointElement, LineElement);

const buildEmployeeRows = (employees: Employee[]) => employees
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

const buildEmployeeColums: BuildEmployeeColums = (headers, showSkills) => [
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

const PrivateExample = () => {
  const { getMessages, formatString } = useLocalization();
  const { corporativeDirectory: messages } = getMessages();
  const { localeText } = useDataGrid();
  const { setLoading, setLoadingMessage } = useFeedback();
  const [rows, setRows] = React.useState<GridRowsProp | undefined>(undefined);
  const [openSkillsDialog, setOpenSkillsDialog] = React.useState(false);
  const [skillsDialogTitle, setSkillsDialogTitle] = React.useState('');
  const [skillsChart, setSkillsChart] = React.useState<React.JSX.Element | undefined>(undefined);
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

  const showSkills = (skills: Skill[], name: string) => (
    <Button
      variant="contained"
      size="small"
      onClick={() => {
        setSkillsDialogTitle(formatString(messages.showSkills, name));
        setSkillsChart(
          <Radar
            data={{
              labels: skills.map(({ skill }) => skill),
              datasets: [{ data: skills.map(({ expertise }) => expertise) }],
            }}
            options={{ scales: { r: { min: 0, ticks: { stepSize: 1, display: true } } } }}
          />,
        );
        setOpenSkillsDialog(true);
      }}
      fullWidth
      sx={{ textTransform: 'none' }}
    >
      {formatString(messages.showSkills, name.split(' ')[0])}
    </Button>
  );
  if (!rows) return null;
  return (
    <>
      <Modal
        open={openSkillsDialog}
        setOpen={setOpenSkillsDialog}
        title={skillsDialogTitle}
        removeNegative
        positiveLabel={messages.closeDialog}
        maxWidth="sm"
      >
        {skillsChart}
      </Modal>
      <Paper elevation={3} sx={{ my: 1, height: '80vh' }}>
        <DataGrid
          rows={rows}
          columns={buildEmployeeColums(messages.headers, showSkills)}
          rowHeight={60}
          localeText={localeText}
        />
      </Paper>
    </>
  );
};

export default PrivateExample;
