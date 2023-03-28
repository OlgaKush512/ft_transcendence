import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, useTheme } from '@mui/material';
import './GameCardAction.css';

export default function GameCardAction(props: any) {
  const { image, alt, disabled, selected, onClick } = props;
  const theTheme = useTheme();

  const ret = theTheme.palette.mode;

  return (
    <Card
      className={ret}
      style={{
        willChange: 'transform',
        borderRadius: '16px',
        borderColor: selected ? theTheme.palette.success.main : 'transparent',
        borderWidth: '0.5rem',
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <CardActionArea
        disabled={disabled}
        sx={{
          backgroundColor: selected ? theTheme.palette.success.main : '#000',
        }}
        onClick={onClick}
      >
        <CardMedia
          component="img"
          sx={{
            position: 'relative',
            opacity: disabled && !selected ? '0.6' : '0.8',
            borderRadius: '8px',
          }}
          style={{
            filter: disabled && !selected ? 'grayscale(100%)' : undefined,
          }}
          image={image}
          alt={alt}
        />
        <Typography
          gutterBottom
          variant="h5"
          mt={-5}
          textAlign="center"
          color="white"
          sx={{
            position: 'fixed',
            width: '100%',
            willChange: 'transform',
            zIndex: '0',
            opacity: disabled && !selected ? '0.6' : '1',
          }}
        >
          {alt}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
