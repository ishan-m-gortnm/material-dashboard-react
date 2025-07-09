// // import { useMemo, useState } from "react";
// // import PropTypes from "prop-types";
// // import { useTable, useSortBy, useGlobalFilter, useAsyncDebounce } from "react-table";

// // // @mui/material
// // import Table from "@mui/material/Table";
// // import TableBody from "@mui/material/TableBody";
// // import TableContainer from "@mui/material/TableContainer";
// // import TableRow from "@mui/material/TableRow";
// // import Icon from "@mui/material/Icon";
// // import Autocomplete from "@mui/material/Autocomplete";

// // // Material Dashboard Components
// // import MDBox from "components/MDBox";
// // import MDTypography from "components/MDTypography";
// // import MDInput from "components/MDInput";
// // import MDPagination from "components/MDPagination";

// // // Custom Head and Body Cells
// // import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
// // import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";

// // function DataTable({
// //   canSearch,
// //   showTotalEntries,
// //   table,
// //   pagination,
// //   button,
// //   isSorted,
// //   noEndBorder,
// //   pageIndex,
// //   pageSize,
// //   totalCount,
// //   onPageChange,
// //   onPageSizeChange,
// //   onSearch,
// // }) {
// //   const columns = useMemo(() => table.columns, [table]);
// //   const data = useMemo(() => table.rows, [table]);

// //   const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
// //     { columns, data, manualPagination: true, pageCount: Math.ceil(totalCount / pageSize) },
// //     useGlobalFilter,
// //     useSortBy
// //   );

// //   const [search, setSearch] = useState("");

// //   const onSearchChange = useAsyncDebounce((value) => {
// //     onSearch(value);
// //   }, 300);

// //   const entriesStart = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
// //   const entriesEnd = Math.min((pageIndex + 1) * pageSize, totalCount);

// //   const totalPages = Math.ceil(totalCount / pageSize);
// //   const paginationButtons = Array.from({ length: totalPages }, (_, i) => (
// //     <MDPagination item key={i} onClick={() => onPageChange(i)} active={pageIndex === i}>
// //       {i + 1}
// //     </MDPagination>
// //   ));

// //   return (
// //     <TableContainer sx={{ boxShadow: "none" }}>
// //       <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
// //         {button}
// //         {canSearch && (
// //           <MDBox width="12rem" ml="auto">
// //             <MDInput
// //               placeholder="Search..."
// //               value={search}
// //               size="small"
// //               fullWidth
// //               onChange={({ currentTarget }) => {
// //                 setSearch(currentTarget.value);
// //                 onSearchChange(currentTarget.value);
// //               }}
// //             />
// //           </MDBox>
// //         )}
// //       </MDBox>

// //       <Table {...getTableProps()}>
// //         <MDBox component="thead">
// //           {headerGroups.map((headerGroup, key) => (
// //             <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
// //               {headerGroup.headers.map((column, idx) => (
// //                 <DataTableHeadCell
// //                   key={idx}
// //                   {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
// //                   width={column.width || "auto"}
// //                   align={column.align || "left"}
// //                   sorted={
// //                     isSorted && column.isSorted ? (column.isSortedDesc ? "desc" : "asce") : "none"
// //                   }
// //                 >
// //                   {column.render("Header")}
// //                 </DataTableHeadCell>
// //               ))}
// //             </TableRow>
// //           ))}
// //         </MDBox>
// //         <TableBody {...getTableBodyProps()}>
// //           {rows.map((row, key) => {
// //             prepareRow(row);
// //             return (
// //               <TableRow key={key} {...row.getRowProps()}>
// //                 {row.cells.map((cell, idx) => (
// //                   <DataTableBodyCell
// //                     key={idx}
// //                     noBorder={noEndBorder && rows.length - 1 === key}
// //                     align={cell.column.align || "left"}
// //                     {...cell.getCellProps()}
// //                   >
// //                     {cell.render("Cell")}
// //                   </DataTableBodyCell>
// //                 ))}
// //               </TableRow>
// //             );
// //           })}
// //         </TableBody>
// //       </Table>

// //       <MDBox
// //         display="flex"
// //         flexDirection={{ xs: "column", sm: "row" }}
// //         justifyContent="space-between"
// //         alignItems={{ xs: "flex-start", sm: "center" }}
// //         p={3}
// //       >
// //         {showTotalEntries && (
// //           <MDBox mb={{ xs: 3, sm: 0 }}>
// //             <MDTypography variant="button" color="secondary" fontWeight="regular">
// //               Showing {entriesStart} to {entriesEnd} of {totalCount} entries
// //             </MDTypography>
// //           </MDBox>
// //         )}

// //         {totalPages > 1 && (
// //           <MDPagination
// //             variant={pagination?.variant || "gradient"}
// //             color={pagination?.color || "info"}
// //           >
// //             {pageIndex > 0 && (
// //               <MDPagination item onClick={() => onPageChange(pageIndex - 1)}>
// //                 <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
// //               </MDPagination>
// //             )}
// //             {paginationButtons}
// //             {pageIndex < totalPages - 1 && (
// //               <MDPagination item onClick={() => onPageChange(pageIndex + 1)}>
// //                 <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
// //               </MDPagination>
// //             )}
// //           </MDPagination>
// //         )}

// //         <MDBox display="flex" alignItems="center">
// //           <Autocomplete
// //             disableClearable
// //             value={pageSize.toString()}
// //             options={["5", "10", "15", "20", "25"]}
// //             onChange={(event, newValue) => onPageSizeChange(parseInt(newValue, 10))}
// //             size="small"
// //             sx={{ width: "5rem" }}
// //             renderInput={(params) => <MDInput {...params} />}
// //           />
// //           <MDTypography variant="caption" color="secondary">
// //             &nbsp;&nbsp;entries per page
// //           </MDTypography>
// //         </MDBox>
// //       </MDBox>
// //     </TableContainer>
// //   );
// // }

// // DataTable.defaultProps = {
// //   canSearch: false,
// //   showTotalEntries: true,
// //   pagination: { variant: "gradient", color: "info" },
// //   isSorted: true,
// //   noEndBorder: false,
// //   button: null,
// // };

// // DataTable.propTypes = {
// //   canSearch: PropTypes.bool,
// //   showTotalEntries: PropTypes.bool,
// //   table: PropTypes.objectOf(PropTypes.array).isRequired,
// //   pagination: PropTypes.shape({
// //     variant: PropTypes.oneOf(["contained", "gradient"]),
// //     color: PropTypes.oneOf([
// //       "primary",
// //       "secondary",
// //       "info",
// //       "success",
// //       "warning",
// //       "error",
// //       "dark",
// //       "light",
// //     ]),
// //   }),
// //   isSorted: PropTypes.bool,
// //   noEndBorder: PropTypes.bool,
// //   button: PropTypes.element,
// //   pageIndex: PropTypes.number.isRequired,
// //   pageSize: PropTypes.number.isRequired,
// //   totalCount: PropTypes.number.isRequired,
// //   onPageChange: PropTypes.func.isRequired,
// //   onPageSizeChange: PropTypes.func.isRequired,
// //   onSearch: PropTypes.func,
// // };

// // export default DataTable;

// /**
// =========================================================
// * Material Dashboard 2 React - v2.2.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2023 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

// import { useMemo, useEffect, useState } from "react";

// // prop-types is a library for typechecking of props
// import PropTypes from "prop-types";

// // react-table components
// import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";

// // @mui material components
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableContainer from "@mui/material/TableContainer";
// import TableRow from "@mui/material/TableRow";
// import Icon from "@mui/material/Icon";
// import Autocomplete from "@mui/material/Autocomplete";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDInput from "components/MDInput";
// import MDPagination from "components/MDPagination";

// // Material Dashboard 2 React example components
// import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
// import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
// import button from "assets/theme/components/button";

// function DataTable({
//   entriesPerPage,
//   canSearch,
//   showTotalEntries,
//   table,
//   pagination,
//   button,
//   isSorted,
//   noEndBorder,
//   fetchDataRows,
//   onSearch,
// }) {
//   const defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : 5;
//   const entries = entriesPerPage.entries
//     ? entriesPerPage.entries.map((el) => el.toString())
//     : ["5", "10", "15", "20", "25"];
//   const columns = useMemo(() => table.columns, [table]);
//   // let data = useMemo(() => table.rows, [table]);
//   const [data, setData] = useState([]);
//   const tableInstance = useTable(
//     { columns, data, initialState: { pageIndex: 0 } },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     rows,
//     page,
//     pageOptions,
//     canPreviousPage,
//     canNextPage,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     setGlobalFilter,
//     state: { pageIndex, pageSize, globalFilter },
//   } = tableInstance;

//   // Set the default value for the entries per page when component mounts
//   useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);
//   useEffect(() => {
//     const fetchData = async () => {
//       const newData = await fetchDataRows({ pageIndex, pageSize, globalFilter });

//       if (newData && Array.isArray(newData)) {
//         setData(newData);
//       }
//     };

//     fetchData();
//   }, [pageIndex, pageSize, globalFilter]);

//   // Set the entries per page value based on the select value
//   const setEntriesPerPage = (value) => setPageSize(value);

//   // Render the paginations
//   const renderPagination = pageOptions.map((option) => (
//     <MDPagination
//       item
//       key={option}
//       onClick={() => gotoPage(Number(option))}
//       active={pageIndex === option}
//     >
//       {option + 1}
//     </MDPagination>
//   ));

//   // Handler for the input to set the pagination index
//   const handleInputPagination = ({ target: { value } }) =>
//     value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));

//   // Customized page options starting from 1
//   const customizedPageOptions = pageOptions.map((option) => option + 1);

//   // Setting value for the pagination input
//   const handleInputPaginationValue = ({ target: value }) => gotoPage(Number(value.value - 1));

//   // Search input value state
//   const [search, setSearch] = useState(globalFilter);

//   // Search input state handle
//   const onSearchChange = useAsyncDebounce((value) => {
//     setGlobalFilter(value || undefined);
//     onSearch(value);
//   }, 100);

//   // A function that sets the sorted value for the table
//   const setSortedValue = (column) => {
//     let sortedValue;

//     if (isSorted && column.isSorted) {
//       sortedValue = column.isSortedDesc ? "desc" : "asce";
//     } else if (isSorted) {
//       sortedValue = "none";
//     } else {
//       sortedValue = false;
//     }

//     return sortedValue;
//   };

//   // Setting the entries starting point
//   const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

//   // Setting the entries ending point
//   let entriesEnd;

//   if (pageIndex === 0) {
//     entriesEnd = pageSize;
//   } else if (pageIndex === pageOptions.length - 1) {
//     entriesEnd = rows.length;
//   } else {
//     entriesEnd = pageSize * (pageIndex + 1);
//   }

//   return (
//     <TableContainer sx={{ boxShadow: "none" }}>
//       <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
//         {button}

//         {canSearch && (
//           <MDBox width="12rem" ml="auto">
//             <MDInput
//               placeholder="Search..."
//               value={search}
//               size="small"
//               fullWidth
//               onChange={({ currentTarget }) => {
//                 setSearch(search);
//                 onSearchChange(currentTarget.value);
//               }}
//             />
//           </MDBox>
//         )}
//       </MDBox>

//       <Table {...getTableProps()} sx={{ position: "relative" }}>
//         <MDBox component="thead">
//           {headerGroups.map((headerGroup, key) => (
//             <TableRow
//               key={key}
//               {...headerGroup.getHeaderGroupProps()}
//               sx={{ position: "sticky", top: 0 }}
//             >
//               {headerGroup.headers.map((column, idx) => (
//                 <DataTableHeadCell
//                   key={idx}
//                   {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
//                   width={column.width ? column.width : "auto"}
//                   align={column.align ? column.align : "left"}
//                   sorted={setSortedValue(column)}
//                 >
//                   {column.render("Header")}
//                 </DataTableHeadCell>
//               ))}
//             </TableRow>
//           ))}
//         </MDBox>
//         <TableBody {...getTableBodyProps()}>
//           {page.map((row, key) => {
//             prepareRow(row);
//             return (
//               <TableRow key={key} {...row.getRowProps()}>
//                 {row.cells.map((cell, idx) => (
//                   <DataTableBodyCell
//                     key={idx}
//                     noBorder={noEndBorder && rows.length - 1 === key}
//                     align={cell.column.align ? cell.column.align : "left"}
//                     {...cell.getCellProps()}
//                   >
//                     {cell.render("Cell")}
//                   </DataTableBodyCell>
//                 ))}
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>

//       <MDBox
//         display="flex"
//         flexDirection={{ xs: "column", sm: "row" }}
//         justifyContent="space-between"
//         alignItems={{ xs: "flex-start", sm: "center" }}
//         p={3}
//       >
//         {showTotalEntries && (
//           <MDBox mb={{ xs: 3, sm: 0 }}>
//             <MDTypography variant="button" color="secondary" fontWeight="regular">
//               Showing {entriesStart} to {entriesEnd} of {rows.length} entries
//             </MDTypography>
//           </MDBox>
//         )}
//         {pageOptions.length > 1 && (
//           <MDPagination
//             variant={pagination.variant ? pagination.variant : "gradient"}
//             color={pagination.color ? pagination.color : "info"}
//           >
//             {canPreviousPage && (
//               <MDPagination item onClick={() => previousPage()}>
//                 <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
//               </MDPagination>
//             )}
//             {renderPagination.length > 6 ? (
//               <MDBox width="5rem" mx={1}>
//                 <MDInput
//                   inputProps={{ type: "number", min: 1, max: customizedPageOptions.length }}
//                   value={customizedPageOptions[pageIndex]}
//                   onChange={(handleInputPagination, handleInputPaginationValue)}
//                 />
//               </MDBox>
//             ) : (
//               renderPagination
//             )}
//             {canNextPage && (
//               <MDPagination item onClick={() => nextPage()}>
//                 <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
//               </MDPagination>
//             )}
//           </MDPagination>
//         )}
//         {entriesPerPage && (
//           <MDBox display="flex" alignItems="center">
//             <Autocomplete
//               disableClearable
//               value={pageSize.toString()}
//               options={entries}
//               onChange={(event, newValue) => {
//                 setEntriesPerPage(parseInt(newValue, 10));
//               }}
//               size="small"
//               sx={{ width: "5rem" }}
//               renderInput={(params) => <MDInput {...params} />}
//             />
//             <MDTypography variant="caption" color="secondary">
//               &nbsp;&nbsp;entries per page
//             </MDTypography>
//             {/* {renderPagination} */}
//           </MDBox>
//         )}
//       </MDBox>
//     </TableContainer>
//   );
// }

// // Setting default values for the props of DataTable
// DataTable.defaultProps = {
//   entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
//   canSearch: false,
//   showTotalEntries: true,
//   pagination: { variant: "gradient", color: "info" },
//   isSorted: true,
//   noEndBorder: false,
// };

// // Typechecking props for the DataTable
// DataTable.propTypes = {
//   entriesPerPage: PropTypes.oneOfType([
//     PropTypes.shape({
//       defaultValue: PropTypes.number,
//       entries: PropTypes.arrayOf(PropTypes.number),
//     }),
//     PropTypes.bool,
//   ]),
//   canSearch: PropTypes.bool,
//   showTotalEntries: PropTypes.bool,
//   table: PropTypes.objectOf(PropTypes.array).isRequired,
//   pagination: PropTypes.shape({
//     variant: PropTypes.oneOf(["contained", "gradient"]),
//     color: PropTypes.oneOf([
//       "primary",
//       "secondary",
//       "info",
//       "success",
//       "warning",
//       "error",
//       "dark",
//       "light",
//     ]),
//   }),
//   isSorted: PropTypes.bool,
//   noEndBorder: PropTypes.bool,
//   button: PropTypes.element,
// };

// export default DataTable;

import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useSortBy } from "react-table";

// MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";

// Custom components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
import { useAsyncDebounce } from "react-table";

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  button,
  isSorted,
  noEndBorder,
  fetchDataRows,
  reload,
  onSearch,
}) {
  const defaultPageSize = entriesPerPage.defaultValue || 10;
  const entries = entriesPerPage.entries?.map((e) => e.toString()) || ["5", "10", "15", "20", "25"];

  const columns = useMemo(() => table.columns, [table]);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [globalFilter, setGlobalFilter] = useState("");

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      manualGlobalFilter: true,
      pageCount: Math.ceil(totalCount / pageSize),
    },
    useGlobalFilter,
    useSortBy
  );

  const fetchData = async () => {
    const result = await fetchDataRows({ pageIndex, pageSize, globalFilter });
    if (result && Array.isArray(result.data)) {
      setData(result.data);
      setTotalCount(result.total || 0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, globalFilter, reload]);

  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value);
    setPageIndex(0); // Reset to page 1
    onSearch?.(value);
  }, 300);

  const [search, setSearch] = useState(globalFilter);

  const entriesStart = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const entriesEnd = Math.min((pageIndex + 1) * pageSize, totalCount);
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginationButtons = Array.from({ length: totalPages }, (_, i) => (
    <MDPagination item key={i} onClick={() => setPageIndex(i)} active={pageIndex === i}>
      {i + 1}
    </MDPagination>
  ));

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        {button}
        {canSearch && (
          <MDBox width="12rem" ml="auto">
            <MDInput
              placeholder="Search..."
              value={search}
              size="small"
              fullWidth
              onChange={({ currentTarget }) => {
                setSearch(currentTarget.value);
                onSearchChange(currentTarget.value);
              }}
            />
          </MDBox>
        )}
      </MDBox>

      <Table {...getTableProps()}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup, key) => (
            <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <DataTableHeadCell
                  key={idx}
                  {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                  width={column.width || "auto"}
                  align={column.align || "left"}
                  sorted={
                    isSorted && column.isSorted ? (column.isSortedDesc ? "desc" : "asce") : "none"
                  }
                >
                  {column.render("Header")}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, key) => {
            prepareRow(row);
            return (
              <TableRow key={key} {...row.getRowProps()}>
                {row.cells.map((cell, idx) => (
                  <DataTableBodyCell
                    key={idx}
                    noBorder={noEndBorder && rows.length - 1 === key}
                    align={cell.column.align || "left"}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </DataTableBodyCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={3}
      >
        {showTotalEntries && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              Showing {entriesStart} to {entriesEnd} of {totalCount} entries
            </MDTypography>
          </MDBox>
        )}

        {totalPages > 1 && (
          <MDPagination
            variant={pagination?.variant || "gradient"}
            color={pagination?.color || "info"}
          >
            {pageIndex > 0 && (
              <MDPagination item onClick={() => setPageIndex(pageIndex - 1)}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>
            )}
            {paginationButtons}
            {pageIndex < totalPages - 1 && (
              <MDPagination item onClick={() => setPageIndex(pageIndex + 1)}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        )}

        {entriesPerPage && (
          <MDBox display="flex" alignItems="center">
            <Autocomplete
              disableClearable
              value={pageSize.toString()}
              options={entries}
              onChange={(event, newValue) => {
                setPageSize(parseInt(newValue, 10));
                setPageIndex(0); // Reset to first page on pageSize change
              }}
              size="small"
              sx={{ width: "5rem" }}
              renderInput={(params) => <MDInput {...params} />}
            />
            <MDTypography variant="caption" color="secondary">
              &nbsp;&nbsp;entries per page
            </MDTypography>
          </MDBox>
        )}
      </MDBox>
    </TableContainer>
  );
}

// Default Props
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
  button: null,
};

// Prop Types
DataTable.propTypes = {
  entriesPerPage: PropTypes.shape({
    defaultValue: PropTypes.number,
    entries: PropTypes.arrayOf(PropTypes.number),
  }),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.shape({
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array,
  }).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  button: PropTypes.element,
  fetchDataRows: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
};

export default DataTable;
