import React, { useMemo, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useSortBy, usePagination, useAsyncDebounce } from "react-table";
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Box,
  CircularProgress,
  Icon,
} from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
import { useLocation } from "react-router-dom";

/**
 * Clean, server-driven DataTable
 * - properly uses react-table pagination plugin
 * - supports server-side sorting & global filter (debounced)
 * - avoids unnecessary wrappers inside MDPagination
 * - memoizes where appropriate
 */

export default function DataTable({
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
  hidePagination = false,
}) {
  const defaultPageSize = entriesPerPage?.defaultValue || 10;
  const entries = useMemo(
    () => (entriesPerPage?.entries || [5, 10, 15, 20, 25]).map(String),
    [entriesPerPage]
  );

  const columns = useMemo(() => table.columns || [], [table]);

  // local UI state
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const location = useLocation();

  // react-table state is the source of truth for pagination/sorting/filter
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // the current page rows (react-table pagination)
    // state & helpers
    state: { pageIndex, pageSize, sortBy, globalFilter },
    gotoPage,
    setPageSize,
    setGlobalFilter,
    toggleSortBy,
  } = useTable(
    {
      columns,
      data: [], // data comes from server; we won't pass it to react-table directly
      manualPagination: true,
      manualSortBy: true,
      manualGlobalFilter: true,
      initialState: { pageIndex: 0, pageSize: defaultPageSize },
      pageCount: Math.ceil(totalCount / defaultPageSize),
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // local copy of rows to render (filled from server)
  const [rowsData, setRowsData] = useState([]);

  // Fetch data callback — stable reference with useCallback
  const loadServerData = useCallback(
    async ({ pageIndex: pi, pageSize: ps, globalFilter: gf, sortBy: sb }) => {
      try {
        setLoading(true);
        const payload = {
          pageIndex: pi,
          pageSize: ps,
          globalFilter: gf || "",
          sortBy: sb && sb.length ? sb[0] : null,
        };

        const result = await fetchDataRows(payload);
        // Expecting { data: [], total: number }
        const data = result?.data || [];
        const total = Number(result?.total ?? 0);

        setRowsData(data);
        setTotalCount(total);
      } catch (err) {
        // keep UI consistent — real app should show toast or error UI
        console.error("DataTable fetch error:", err);
        setRowsData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [fetchDataRows]
  );

  // debounced search so we don't hammer the server
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || "");
    gotoPage(0);
    onSearch?.(value);
  }, 300);

  // trigger load whenever server-driven params change
  useEffect(() => {
    loadServerData({ pageIndex, pageSize, globalFilter, sortBy });
  }, [loadServerData, pageIndex, pageSize, globalFilter, sortBy, reload]);

  // Derived values for footer
  const entriesStart = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const entriesEnd = Math.min((pageIndex + 1) * pageSize, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Pagination items (no extra wrappers, direct MDPagination.item children)
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        items.push(
          <MDPagination item key={i} onClick={() => gotoPage(i)} active={pageIndex === i}>
            {i + 1}
          </MDPagination>
        );
      }
    } else {
      // first
      items.push(
        <MDPagination item key={0} onClick={() => gotoPage(0)} active={pageIndex === 0}>
          1
        </MDPagination>
      );

      // left ellipsis
      if (pageIndex > 2)
        items.push(
          <MDPagination item key="left-ellipsis" disabled>
            ...
          </MDPagination>
        );

      const start = Math.max(1, pageIndex - 1);
      const end = Math.min(totalPages - 2, pageIndex + 1);
      for (let i = start; i <= end; i++) {
        items.push(
          <MDPagination item key={i} onClick={() => gotoPage(i)} active={pageIndex === i}>
            {i + 1}
          </MDPagination>
        );
      }

      if (pageIndex < totalPages - 3)
        items.push(
          <MDPagination item key="right-ellipsis" disabled>
            ...
          </MDPagination>
        );

      items.push(
        <MDPagination
          item
          key={totalPages - 1}
          onClick={() => gotoPage(totalPages - 1)}
          active={pageIndex === totalPages - 1}
        >
          {totalPages}
        </MDPagination>
      );
    }

    return items;
  };

  return (
    <TableContainer
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: location.pathname === "/user" ? "70vh" : "80vh",
        minHeight: 0,
        boxShadow: "none",
      }}
    >
      {/* Header */}
      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        p={{ xs: 1.5, sm: 2 }}
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
              size="small"
              fullWidth
              defaultValue={globalFilter || ""}
              onChange={(e) => onSearchChange(e.currentTarget.value)}
            />
          </MDBox>
        )}
      </MDBox>

      {/* Body */}
      <Box sx={{ position: "relative", flexGrow: 1, overflow: "auto" }}>
        <Table {...getTableProps()} sx={{ minWidth: 650 }}>
          <MDBox component="thead">
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const sortProps = isSorted ? column.getSortByToggleProps() : {};
                  return (
                    <DataTableHeadCell
                      key={column.id}
                      {...column.getHeaderProps(sortProps)}
                      width={column.width || "auto"}
                      align={column.align || "left"}
                      sorted={
                        isSorted && column.isSorted
                          ? column.isSortedDesc
                            ? "desc"
                            : "asce"
                          : "none"
                      }
                    >
                      {column.render("Header")}
                    </DataTableHeadCell>
                  );
                })}
              </TableRow>
            ))}
          </MDBox>

          <TableBody {...getTableBodyProps()}>
            {loading ? (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0, // top:0; right:0; bottom:0; left:0;
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "none", // allows clicks to pass through if needed
                }}
              >
                <CircularProgress size={40} />
              </Box>
            ) : rowsData.length > 0 ? (
              rowsData.map((rowItem, rIdx) => (
                // prefer a stable unique key if available on your row objects
                <TableRow key={rowItem.id ?? rIdx}>
                  {columns.map((col) => (
                    <DataTableBodyCell
                      key={col.id || col.accessor}
                      noBorder={noEndBorder && rIdx === rowsData.length - 1}
                      align={col.align || "left"}
                    >
                      {/* render cell value using accessor or custom Cell function */}
                      {col.Cell
                        ? col.Cell({ value: rowItem[col.accessor], row: rowItem })
                        : rowItem[col.accessor]}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0, // top:0; right:0; bottom:0; left:0;
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "none", // allows clicks to pass through if needed
                }}
              >
                <MDTypography variant="button" color="text">
                  No data available
                </MDTypography>
              </Box>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Footer */}
      {!hidePagination && (
        <MDBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent={{ xs: "center", sm: "space-between" }}
          alignItems="center"
          flexWrap="wrap"
          p={{ xs: 1.5, sm: 2 }}
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
            justifyContent={{ xs: "center", sm: "flex-end" }}
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
                  <MDPagination item onClick={() => gotoPage(pageIndex - 1)}>
                    <Icon>chevron_left</Icon>
                  </MDPagination>
                )}

                {renderPaginationItems()}

                {pageIndex < totalPages - 1 && (
                  <MDPagination item onClick={() => gotoPage(pageIndex + 1)}>
                    <Icon>chevron_right</Icon>
                  </MDPagination>
                )}
              </MDPagination>
            )}

            {entriesPerPage && (
              <MDBox display="flex" alignItems="center" ml={{ xs: 0, sm: 2 }}>
                <MDInput
                  select
                  value={String(pageSize)}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    gotoPage(0);
                  }}
                  size="small"
                  sx={{ width: { xs: "5rem", sm: "6rem" } }}
                  SelectProps={{ native: true }}
                >
                  {entries.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </MDInput>
                <MDTypography variant="caption" color="secondary" ml={1}>
                  entries / page
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </MDBox>
      )}
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
