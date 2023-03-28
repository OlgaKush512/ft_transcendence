export interface IIntraProfile {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  url: string;
  displayname: string;
  // image_url: string;
  image: { link: string };
}
/**
 * reduce the profile object returned by the 42 api to only keep the properties we're interrested in.
 */
export const reduceProfile = ({
  displayname,
  email,
  first_name,
  id,
  image,
  last_name,
  login,
  url,
  usual_full_name,
  ...others
}: IIntraProfile) => ({
  displayname,
  email,
  first_name,
  id,
  image,
  last_name,
  login,
  url,
  usual_full_name,
});
