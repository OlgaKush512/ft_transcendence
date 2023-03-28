import { useTheme } from "@mui/material";
import robot from "../../assets/img/robot.gif";

function Default() {
  
  const theTheme = useTheme();
  
  return (
    <div
      className="Default"
      style={{ justifyContent: "center", alignItems: "center", backgroundColor: theTheme.palette.background.paper }}
    >
      <h1>Welcome to the chat!</h1>
      <img src={robot} alt="my-gif" />
    </div>
  );
}

export default Default;
