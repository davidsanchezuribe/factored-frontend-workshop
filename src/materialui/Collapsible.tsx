import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { useSetting } from '../settings/withSettings';

export const Accordion = styled((props: AccordionProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

export const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

type CollapsibleProps = {
  id?: string,
  components: ({ title: string, component: React.JSX.Element } | undefined)[],
  mt?: number,
  mb?: number,
  collapse?: boolean,
};

const Collapsible = ({
  id,
  components,
  mt = 2,
  mb = 0,
  collapse,
}: CollapsibleProps) => {
  const { useStringSetting } = useSetting();
  const expandedInit = collapse ? 'false' : 'panel0';
  const [expanded, setExpanded] = id ? useStringSetting(`${id}Collapsible`, expandedInit) : useState(expandedInit);
  const handleChange = (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : 'false');
  };
  return (
    <Box mt={mt} mb={mb}>
      {components.map((item, index) => {
        if (!item) return null;
        const { title, component } = item;
        const panelId = `panel${index}`;
        return (
          <Accordion key={title} expanded={expanded === panelId} onChange={handleChange(panelId)}>
            <AccordionSummary aria-controls={title} id={`panel${index}d-header`}>
              <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>{component}</AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default Collapsible;
