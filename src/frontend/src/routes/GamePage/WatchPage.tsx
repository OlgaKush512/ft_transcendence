import Game from './game';

const WatchPage = () => {
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
      <Game watch={true} />
    </div>
  );
};

export default WatchPage;
