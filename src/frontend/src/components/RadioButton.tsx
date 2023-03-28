import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { RoomType } from "../routes/Chat/types";

export default function RowRadioButtonsGroup({ value, onChange }: { value: RoomType; onChange: (type: RoomType) => void }) {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Room Type</FormLabel>
      <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" value={value} onChange={(e) => onChange(e.target.value as RoomType)}>
        <FormControlLabel value="public" control={<Radio />} label="Public" />
        <FormControlLabel value="protected" control={<Radio />} label="Protected" />
      </RadioGroup>
    </FormControl>
  );
}
