import { Button, Stack } from "@mui/material";
import { useState } from "react";

const UploadButtons = (props: {variantOfButton: 'text' | 'outlined' | 'contained', onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange']}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const colorText =
    props.variantOfButton === 'contained'
      ? 'palette.primary.contrastText'
      : 'palette.primary.main';
  return (
    <Stack direction="row" alignItems="center" spacing={2} mt="30px">
      <Button
        variant={props.variantOfButton}
        component="label"
        sx={{ color: colorText }}
      >
        Change Image
        <input hidden accept="image/*" multiple type="file" onChange={props.onChange}/>
      </Button>
    </Stack>
  );
};
export default UploadButtons;
