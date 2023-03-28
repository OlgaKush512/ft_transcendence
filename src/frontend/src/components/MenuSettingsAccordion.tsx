import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Divider, Grid, ListItem, Switch } from '@mui/material';
import { Settings } from '@mui/icons-material';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@mui/material/styles';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import { useState } from 'react';

export default function MenuSettingsAccordion(props: any) {
  const { mode, setMode } = props;

  const theTheme = useTheme();

  const [checked, setChecked] = useState(theTheme.palette.mode === 'dark');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(mode === 'light' ? 'dark' : 'light');
    setChecked(event.target.checked);
  };

  const colorPaper = theTheme.palette.background.paper.slice(0, 7) + 'FF';

  return (
    <Accordion
      sx={{
        boxShadow: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.001)',
      }}
      disableGutters

      //   fontSize="small"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          flexDirection: 'row-reverse',
          // '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
        }}
      >
        <Typography sx={{ ml: '10px' }}>Settings</Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ disableGutters: 'true' }}>
        <Grid container direction="column">
          <Divider />
          <ListItem button key={1} disableGutters>
            <ModeNightIcon />
            <Switch
              size="small"
              checked={checked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            {/* <Typography>Dark Mode</Typography> */}
          </ListItem>

          <ListItem button key={2} disableGutters>
            <MusicOffIcon />
            <Switch
              size="small"
              /*onChange={(e) => setMode(mode === 'light' ? 'dark' : 'light')}
               */
            />
            {/* <Typography>Sounds</Typography> */}
          </ListItem>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
