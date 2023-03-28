import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

const YouAreNumber = (props: any) => {
  const { myIndex } = props;

  return (
    <>
      <Grid item xs={9} md={3} p={5} alignItems="center">
        <Paper variant="outlined" sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.01)'
          }}>
          <Stack>
            <Typography
              variant="h6"
              fontWeight={300}
              mt={2}
              mb={2}
              textAlign="center"
            >
              You are number:
            </Typography>
            <Box
              minHeight="30vh"
              width="100%"
              m="auto"
              // border="solid"
              display="flex"
              alignItems="center"
            >
              <Grid container columns={11}>
                <Grid item xs={1} />
                <Grid
                  item
                  xs={9}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Paper
                    sx={{
                      borderRadius: '100px',
                      bgcolor: 'secondary.main',
                      width: 150,
                      height: 'auto',
                    }}
                  >
                    <Box
                      display="flex"
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 150,
                        height: 150,
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 1000,
                        }}
                      >
                        {myIndex}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={1} />
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </>
  );
};

export default YouAreNumber;
