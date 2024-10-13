import React from 'react';
import { Button, Paper } from '@mui/material';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { Radar } from 'react-chartjs-2';
import {
  Chart, LineElement, PointElement, RadialLinearScale,
} from 'chart.js';
import { getEmployeeData, Skill } from './corporateDirectoryApiClient';
import useFeedback from '../materialui/useFeedback';
import useLocalization from '../localization/useLocalization';
import useDataGrid from '../materialui/useDataGrid';
import Modal from '../materialui/Modal';
import { radarOptions, radarStyle } from './radarStyle';
import { buildEmployeeColums, buildEmployeeRows } from './employeeDataGridBuilder';

Chart.register(RadialLinearScale, PointElement, LineElement);

const CorporativeDirectory = () => {
  const { getMessages, formatString } = useLocalization();
  const { corporativeDirectory: messages } = getMessages();
  const { localeText } = useDataGrid();
  const { setLoading, setLoadingMessage, toast } = useFeedback();
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
      })
      .catch((error) => { toast(error, 'error'); });
      return () => { setLoadingMessage(undefined); };
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
              datasets: [{ ...radarStyle, data: skills.map(({ expertise }) => expertise) }],
            }}
            options={radarOptions}
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

export default CorporativeDirectory;
