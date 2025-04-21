import React from "react";
import { Typography } from "@material-tailwind/react";

function Placeholder({ title = "Coming Soon" }) {
  return (
    <div className="flex items-center justify-center h-full py-40">
      <Typography variant="h4" color="blue-gray">
        {title}
      </Typography>
    </div>
  );
}

export default Placeholder;
