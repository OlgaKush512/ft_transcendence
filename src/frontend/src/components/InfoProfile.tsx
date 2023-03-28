import { Box, Grid, Tab, Tabs } from '@mui/material';
import React from 'react';
import AchievementsTab from './tabs/AchievementsTab';
import HistoryTab from './tabs/HistoryTab';
import ProfilTab from './tabs/ProfilTab';
import SettingsTab from './tabs/SettingsTab';
import StatTab from './tabs/StatTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  const theTab = () => {
    if (value === index && value === 0) return <ProfilTab />;
    if (value === index && value === 1) return <SettingsTab />;
    if (value === index && value === 2) return <HistoryTab />;
    if (value === index && value === 3) return <StatTab />;
    if (value === index && value === 4) return <AchievementsTab />;
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && theTab()}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const InfoProfile = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid
        item
        xs={10}
        sm={6}
        display="flex"
        justifyContent="center"
        textAlign="center"
        
        sx={{ minHeight: { xs: '60vh', sm: '90vh' } }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '80%' },
            mt: '150px',
          }}
          textAlign="center"
          
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="PROFILE" {...a11yProps(0)} />
              <Tab label="SETTINGS" {...a11yProps(1)} />
              <Tab label="HISTORY" {...a11yProps(2)} />
              <Tab label="STAT" {...a11yProps(3)} />
              <Tab label="ACHIEVEMENT" {...a11yProps(4)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0} />
          <TabPanel value={value} index={1} />
          <TabPanel value={value} index={2} />
          <TabPanel value={value} index={3} />
          <TabPanel value={value} index={4} />
        </Box>
      </Grid>
    </>
  );
};

export default InfoProfile;
