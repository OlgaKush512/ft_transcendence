import ProfilePage from '../components/ProfilePage';

const Profile = (props: any) => {
  const { mode } = props;
  return <ProfilePage mode={mode} />;
};

export default Profile;
