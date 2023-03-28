// import { Sound } from 'react-sound';
import TheMusic from '../music/StartPageMusic.mp3';

const MusicBackground = (props: any) => {
  const { handleSongLoading, handleSongPlaying, handleSongFinishedPlaying } = props;
  return <div>{/* <Sound url={TheMusic} /> */}</div>;
};

export default MusicBackground;
