import { useParams } from 'react-router-dom';
import Game from './game';

const GamePage = () => {
  const gameId = useParams().id;
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Game watch={false} />
      <a target="_blank" href={`/app/watch/${gameId}`}>
        {/* watch link */}
      </a>
    </div>
  );
};

export default GamePage;
