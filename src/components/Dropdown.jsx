// import React, { useState } from "react";
// import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// function Dropdown({ options = [], onChange, label }) {
//   const [selectedOption, setSelectedOption] = useState(options[0]?.value || "");

//   const handleChange = (event) => {
//     setSelectedOption(event.target.value);
//     if (onChange) {
//       onChange(event);
//     }
//   };

//   return (
//     <FormControl fullWidth>
//       <InputLabel id="demo-simple-select-label">{label}</InputLabel>
//       <Select
//         value={selectedOption}
//         onChange={handleChange}
//         labelId="demo-simple-select-label"
//         id="demo-simple-select"
//         sx={{
//           maxHeight: "75px",
//           height: "40px",
//           color: "secondary.main",
//         }}
//         renderValue={(selected) => options.find((option) => option.value === selected)?.label}
//       >
//         {options.map((option, index) => (
//           <MenuItem key={index} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// }

// export default Dropdown;

// import React, { useState } from "react";
// import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
// import { ArrowDropDownCircleOutlined } from "@mui/icons-material";

// function Dropdown({ options = [], onChange, label }) {
//   const [selectedOption, setSelectedOption] = useState(options[0]?.value || "");

//   const handleChange = (event) => {
//     setSelectedOption(event.target.value);
//     if (onChange) {
//       onChange(event);
//     }
//   };

//   return (
//     <FormControl fullWidth size="small">
//       <InputLabel id="dropdown-label">{label}</InputLabel>
//       <Select
//         labelId="dropdown-label"
//         id="dropdown"
//         value={selectedOption}
//         onChange={handleChange}
//         label={label}
//         color="secondary"
//         sx={{
//           height: 40,
//         }}
//         // IconComponent={() => (
//         //   <ArrowDropDownCircleOutlined sx={{ color: "secondary.main", cursor: "pointer" }} />
//         // )}
//         // disableRipple
//       >
//         {options.map((option, index) => (
//           <MenuItem key={index} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// }

// export default Dropdown;

// import React, { useState } from "react";
// import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
// import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material"; // 👈 dropdown icon

// function Dropdown({ options = [], onChange, label }) {
//   const [selectedOption, setSelectedOption] = useState(options[0]?.value || "");

//   const handleChange = (event) => {
//     setSelectedOption(event.target.value);
//     if (onChange) {
//       onChange(event);
//     }
//   };

//   return (
//     <FormControl fullWidth size="small">
//       <InputLabel id="dropdown-label">{label}</InputLabel>
//       <Select
//         labelId="dropdown-label"
//         id="dropdown"
//         value={selectedOption}
//         onChange={handleChange}
//         label={label}
//         sx={{
//           maxHeight: "75px",
//           height: "40px",
//           color: "green",
//         }}
//         renderValue={(selected) => options.find((option) => option.value === selected)?.label}
//       >
//         {options.map((option, index) => (
//           <MenuItem key={index} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// }

// export default Dropdown;

// import React, { useState } from "react";
// import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
// import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";

// function Dropdown({ options = [], onChange, label }) {
//   const [selectedOption, setSelectedOption] = useState(options[0]?.value || "");

//   const handleChange = (event) => {
//     setSelectedOption(event.target.value);
//     if (onChange) {
//       onChange(event);
//     }
//   };

//   return (
//     <FormControl fullWidth size="small">
//       <InputLabel id="dropdown-label">{label}</InputLabel>
//       <Select
//         labelId="dropdown-label"
//         id="dropdown"
//         value={selectedOption}
//         onChange={handleChange}
//         label={label}
//         IconComponent={ArrowDropDownIcon}
//         sx={{
//           maxHeight: "75px",
//           height: "40px",
//         }}
//         renderValue={(selected) => options.find((option) => option.value === selected)?.label}
//       >
//         {options.map((option, index) => (
//           <MenuItem key={index} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// }

// export default Dropdown;

import React, { useState, useRef } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function Dropdown({ options = [], onChange, label }) {
  const [selectedOption, setSelectedOption] = useState(options[0]?.value || "");
  const selectRef = useRef();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    onChange?.(event);
  };

  const handleIconClick = () => {
    if (selectRef.current) {
      // Trigger the click on the select input to open the menu
      const selectButton = selectRef.current.querySelector('[role="button"]');
      selectButton?.click();
    }
  };

  return (
    <FormControl fullWidth size="small" ref={selectRef}>
      <InputLabel id="dropdown-label">{label}</InputLabel>
      <Select
        labelId="dropdown-label"
        id="dropdown"
        value={selectedOption}
        onChange={handleChange}
        IconComponent={() => (
          <ArrowDropDownIcon
            onClick={handleIconClick}
            style={{
              color: "black",
              cursor: "pointer",
              pointerEvents: "auto",
              backgroundColor: "transparent",
            }}
          />
        )}
        label={label}
        sx={{ height: 40 }}
        renderValue={(selected) => options.find((option) => option.value === selected)?.label}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
