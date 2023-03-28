import { Box, Container, Grid, Paper, Tab, Tabs } from '@mui/material';
import { createContext, useState } from 'react';
import ListOfBlocked from './ListOfBlocked';
import ListOfFriends from './ListOfFriends';
import { useQuery } from 'react-query';
import { myApi } from '../tools/apiHandler';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  data: any;
  refetch: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, refetch, ...other } = props;

  const theTab = () => {
    if (value === index && value === 0)
      return <ListOfFriends data={props.data} refetch={props.refetch} />;
    if (value === index && value === 1)
      return <ListOfBlocked data={props.data} refetch={props.refetch} />;
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

const FriendsPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { data, refetch } = useQuery(
    'friends',
    () => myApi.usersControllerGetFriends(),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      cacheTime: 0,
      refetchInterval: 5000,
    },
  );

  return (
    <>
      <Container>
        <Paper sx={{ height: '90vh', borderRadius: '16px' }} elevation={1}>
          <Grid container columns={10} justifyContent="center" mt={10}>
            <Grid
              item
              xs={8}
              gap={2}
              sx={{
                mt: { xs: '50px' },
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    centered
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="FRIENDS" {...a11yProps(0)} />
                    <Tab label="BLOCKED" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Paper variant="outlined" sx={{ mt: '10px' }}>
                    <TabPanel
                      value={value}
                      index={0}
                      data={data ? data.data : null}
                      refetch={refetch}
                    />
                    <TabPanel
                      value={value}
                      index={1}
                      data={data ? data.data : null}
                      refetch={refetch}
                    />
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default FriendsPage;
