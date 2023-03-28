import PublicProfilPage from '../components/PublicProfilPage';

const PublicProfile = (props: any) => {
  const { mode } = props;
  return (
    <>
      <PublicProfilPage mode={mode} />
    </>
  );
};

export default PublicProfile;
