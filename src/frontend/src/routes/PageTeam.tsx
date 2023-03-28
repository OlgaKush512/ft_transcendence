import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import MainLayout from '../layouts/MainLayout';

const PageTeam = () => {
  const theTheme = useTheme();
  return (
    <>
      <MainLayout />
      <Container
        // disableGutters={true}
        maxWidth="xl"
        // sx={{ border: 'solid' }}
      >
        <Grid container columns={12} mb={5} mt={10}>
          <Grid item xs={12} justifyContent="center">
            <Paper
              sx={{
                minHeight: { xs: '90vh' },
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
              elevation={0}
            >
              <Typography
                variant="h2"
                fontWeight={300}
                pt={10}
                alignItems="center"
                textAlign="center"
                color={theTheme.palette.text.secondary}
              >
                Let's transceeeeend!
              </Typography>
              <Grid container columns={10}>
                {/* <div
                  style={{
                    border: '5px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                > */}
                {/* <Stack direction="row" spacing={15}> */}
                <Grid
                  item
                  xs={10}
                  lg={2}
                  display="flex"
                  justifyContent="center"
                  mt={10}
                  pb={10}
                >
                  <Card sx={{ borderRadius: '16px' }}>
                    <CardMedia
                      sx={{
                        height: { lg: 340, xs: 600 },
                        width: { lg: 220, xs: 440 },
                      }}
                      image="https://cdn.intra.42.fr/users/9f0a91e97042ae840a9a1681b47183d7/cmarteau.jpg"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        textAlign="center"
                      >
                        cmarteau
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        Capucine Marteau
                      </Typography>
                    </CardContent>
                    {/* </Grid> */}

                    <div
                      style={{
                        border: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <CardActions>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://github.com/capmann"
                        >
                          GITHUB
                        </Button>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://profile.intra.42.fr/users/cmarteau"
                        >
                          INTRA
                        </Button>
                      </CardActions>
                    </div>
                  </Card>
                </Grid>
                <Grid
                  item
                  xs={10}
                  lg={2}
                  display="flex"
                  justifyContent="center"
                  mt={10}
                  pb={10}
                >
                  <Card sx={{ borderRadius: '16px' }}>
                    <CardMedia
                      sx={{
                        height: { lg: 340, xs: 600 },
                        width: { lg: 220, xs: 440 },
                      }}
                      image="https://cdn.intra.42.fr/users/f36a757a74e1a99591e4bb8d1015f7f9/threiss.jpg"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        textAlign="center"
                      >
                        threiss
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        Theresa Reiss
                      </Typography>
                    </CardContent>
                    <div
                      style={{
                        border: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <CardActions>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://github.com/There0513"
                        >
                          GITHUB
                        </Button>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://profile.intra.42.fr/users/threiss"
                        >
                          INTRA
                        </Button>
                      </CardActions>
                    </div>
                  </Card>
                </Grid>
                <Grid
                  item
                  xs={10}
                  lg={2}
                  display="flex"
                  justifyContent="center"
                  mt={10}
                  pb={10}
                >
                  <Card sx={{ borderRadius: '16px' }}>
                    <CardMedia
                      sx={{
                        height: { lg: 340, xs: 600 },
                        width: { lg: 220, xs: 440 },
                      }}
                      image="https://cdn.intra.42.fr/users/3710d8a2732390d37aa4207607bba4d0/sferard.jpg"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        textAlign="center"
                      >
                        sferard
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        Séverin Férard
                      </Typography>
                    </CardContent>
                    <div
                      style={{
                        border: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <CardActions>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://github.com/severinferard"
                        >
                          GITHUB
                        </Button>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://profile.intra.42.fr/users/sferard"
                        >
                          INTRA
                        </Button>
                      </CardActions>
                    </div>
                  </Card>
                </Grid>
                <Grid
                  item
                  xs={10}
                  lg={2}
                  display="flex"
                  justifyContent="center"
                  mt={10}
                  pb={10}
                >
                  <Card sx={{ borderRadius: '16px' }}>
                    <CardMedia
                      sx={{
                        height: { lg: 340, xs: 600 },
                        width: { lg: 220, xs: 440 },
                      }}
                      image="https://cdn.intra.42.fr/users/2e3b8baabb877b8cb89160fc4a209459/okushnir.jpg"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        textAlign="center"
                      >
                        okushnir
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        Olga Kushnirova
                      </Typography>
                    </CardContent>
                    <div
                      style={{
                        border: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <CardActions>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://github.com/OlgaKush512"
                        >
                          GITHUB
                        </Button>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://profile.intra.42.fr/users/okushnir"
                        >
                          INTRA
                        </Button>
                      </CardActions>
                    </div>
                  </Card>
                </Grid>
                <Grid
                  item
                  xs={10}
                  lg={2}
                  display="flex"
                  justifyContent="center"
                  mt={10}
                  pb={10}
                >
                  <Card sx={{ borderRadius: '16px' }}>
                    <CardMedia
                      sx={{
                        height: { lg: 340, xs: 600 },
                        width: { lg: 220, xs: 440 },
                      }}
                      image="https://cdn.intra.42.fr/users/97f2f5465f5ae587cbb5e45b6355d04c/tkomaris.jpg"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        textAlign="center"
                      >
                        tkomaris
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        Tatiana Komaristaia
                      </Typography>
                    </CardContent>
                    <div
                      style={{
                        border: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <CardActions>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://github.com/tkomaris"
                        >
                          GITHUB
                        </Button>
                        <Button
                          size="small"
                          target="_blank"
                          href="https://profile.intra.42.fr/users/tkomaris"
                        >
                          INTRA
                        </Button>
                      </CardActions>
                    </div>
                  </Card>
                </Grid>

                {/* </Stack> */}
                {/* </div> */}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default PageTeam;
