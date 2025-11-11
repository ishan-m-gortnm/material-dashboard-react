import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useSortBy, useAsyncDebounce } from "react-table";
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Icon,
  Autocomplete,
  CircularProgress,
  Box,
} from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
import { useLocation } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(globalFilter);

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
  const location = useLocation();

  console.log(location.pathname);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataRows({ pageIndex, pageSize, globalFilter });
      if (result?.data) {
        setData(result.data);
        setTotalCount(result.total || 0);
      }
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, globalFilter, reload]);

  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value);
    setPageIndex(0);
    onSearch?.(value);
  }, 300);

  const entriesStart = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const entriesEnd = Math.min((pageIndex + 1) * pageSize, totalCount);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Paginate dynamically (clean + responsive)
  const renderPagination = () => {
    const items = [];
    const maxVisible = 5;

    const paginationStyle = { margin: "0 2px" }; // spacing between circles

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        items.push(
          <span key={i} style={paginationStyle}>
            <MDPagination item onClick={() => setPageIndex(i)} active={pageIndex === i}>
              {i + 1}
            </MDPagination>
          </span>
        );
      }
    } else {
      items.push(
        <span key={0} style={paginationStyle}>
          <MDPagination item onClick={() => setPageIndex(0)} active={pageIndex === 0}>
            1
          </MDPagination>
        </span>
      );

      if (pageIndex > 2)
        items.push(
          <span key="left" style={paginationStyle}>
            <MDPagination item disabled>
              ...
            </MDPagination>
          </span>
        );

      const start = Math.max(1, pageIndex - 1);
      const end = Math.min(totalPages - 2, pageIndex + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <span key={i} style={paginationStyle}>
            <MDPagination item onClick={() => setPageIndex(i)} active={pageIndex === i}>
              {i + 1}
            </MDPagination>
          </span>
        );
      }

      if (pageIndex < totalPages - 3)
        items.push(
          <span key="right" style={paginationStyle}>
            <MDPagination item disabled>
              ...
            </MDPagination>
          </span>
        );

      items.push(
        <span key={totalPages - 1} style={paginationStyle}>
          <MDPagination
            item
            onClick={() => setPageIndex(totalPages - 1)}
            active={pageIndex === totalPages - 1}
          >
            {totalPages}
          </MDPagination>
        </span>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center", // centers horizontally
          alignItems: "center",
          flexWrap: "wrap", // allows wrapping on small screens
          gap: "6px", // extra gap for wrapping layout
          padding: "10px 0",
        }}
      >
        {items}
      </div>
    );
  };

  return (
    <TableContainer
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: location.pathname === "/user" ? "70vh" : "80vh", // take full viewport height
        minHeight: 0, // important for flex children
        boxShadow: "none",
      }}
    >
      {/* Fixed Header Section */}
      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        p={{ xs: 1.5, sm: 2 }} // 🔹 reduced padding
        gap={1.5}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <MDBox flexShrink={0}>{button}</MDBox>

        {canSearch && (
          <MDBox width={{ xs: "100%", sm: "12rem" }} ml={{ sm: "auto" }}>
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

      {/* Scrollable Table Body */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "auto" }}>
        <Table {...getTableProps()} sx={{ minWidth: 650 }}>
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
            {loading ? (
              <TableRow>
                <DataTableBodyCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    py: 5,
                    px: 2,
                    position: "relative",
                    height: "200px", // enough height for centering
                  }}
                >
                  <MDBox
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <CircularProgress size={40} sx={{ color: "#3498DB" }} />
                  </MDBox>
                </DataTableBodyCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row, key) => {
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
              })
            ) : (
              <TableRow>
                <DataTableBodyCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    py: 5,
                    px: 2,
                    position: "relative",
                    height: "200px",
                  }}
                >
                  <MDBox
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <MDTypography variant="button" color="text">
                      No data available
                    </MDTypography>
                  </MDBox>
                </DataTableBodyCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Footer (Pagination + Entries) */}
      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent={{ xs: "center", sm: "space-between" }} // center on mobile, space-between on desktop
        alignItems="center"
        flexWrap="wrap"
        p={{ xs: 1.5, sm: 2 }} // 🔹 reduced padding
        gap={1.5}
      >
        {showTotalEntries && (
          <MDTypography
            variant="button"
            color="secondary"
            fontWeight="regular"
            textAlign={{ xs: "center", sm: "left" }}
            width={{ xs: "100%", sm: "auto" }}
          >
            Showing {entriesStart} to {entriesEnd} of {totalCount} entries
          </MDTypography>
        )}

        <MDBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent={{ xs: "center", sm: "flex-end" }} // center on mobile only
          gap={{ xs: 1.5, sm: 2 }}
          width={{ xs: "100%", sm: "auto" }}
        >
          {totalPages > 1 && (
            <MDPagination
              variant={pagination?.variant || "gradient"}
              color={pagination?.color || "info"}
              size="small"
            >
              {pageIndex > 0 && (
                <MDPagination item onClick={() => setPageIndex(pageIndex - 1)}>
                  <Icon>chevron_left</Icon>
                </MDPagination>
              )}
              {renderPagination()}
              {pageIndex < totalPages - 1 && (
                <MDPagination item onClick={() => setPageIndex(pageIndex + 1)}>
                  <Icon>chevron_right</Icon>
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
                  setPageIndex(0);
                }}
                size="small"
                sx={{ width: { xs: "5rem", sm: "6rem" } }}
                renderInput={(params) => <MDInput {...params} />}
              />
              <MDTypography variant="caption" color="secondary" ml={1}>
                entries / page
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      </MDBox>
    </TableContainer>
  );
}

DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
  button: null,
};

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
