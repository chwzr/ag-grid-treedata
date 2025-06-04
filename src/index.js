"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import { getData } from "./data.jsx";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
  RowSelectionModule,
  createGrid,
  AllCommunityModule,
} from "ag-grid-community";
import { TreeDataModule, AllEnterpriseModule } from "ag-grid-enterprise";
import { themeBalham } from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  RowSelectionModule,
  ValidationModule /* Development Only */,
  AllEnterpriseModule,
  AllCommunityModule,
]);

import { colorSchemeDark } from "ag-grid-community";

const myTheme = themeBalham.withPart(colorSchemeDark);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "2025-01",
      cellClass: "ag-right-aligned-cell",
      children: [
        {
          headerName: "plan",
          field: "values.plan.2025-01",
          cellStyle: { textAlign: "right" },
          valueFormatter: (p) =>
            new Intl.NumberFormat("de-DE", {
              notation: "standard",
              useGrouping: false,
              minimumFractionDigits: 1,
            }).format(p.value) + " %",
          aggFunc: "iop",
        },
        {
          headerName: "forecast",
          field: "values.forecast.2025-01",
          cellStyle: { textAlign: "right" },
        },
        // {
        //   headerName: "delta",
        //   valueGetter: (p) => {
        //     console.log(p);
        //     return 1;
        //     return p.data["forecast"]["2025-01"] - p.data["plan"]["2025-01"];
        //   },
        // },
      ],
    },
    {
      headerName: "2025-02",
      children: [
        {
          headerName: "plan",
          field: "values.plan.2025-02",
          cellStyle: { textAlign: "right" },
          valueFormatter: (p) =>
            new Intl.NumberFormat("de-DE", {
              notation: "standard",
              useGrouping: false,
              minimumFractionDigits: 1,
            }).format(p.value) + " %",
        },
        // {
        //   headerName: "forecast",
        //   field: "values.forecast.2025-02",
        //   aggFunc: "sum",
        // },
      ],
    },
    {
      headerName: "2025-03",
      children: [
        {
          headerName: "plan",
          field: "values.plan.2025-03",
          cellStyle: { textAlign: "right" },
          valueFormatter: (p) =>
            new Intl.NumberFormat("de-DE", {
              notation: "standard",
              useGrouping: false,
              minimumFractionDigits: 1,
            }).format(p.value) + " %",
        },
        // {
        //   headerName: "forecast",
        //   field: "values.forecast.2025-03",
        //   aggFunc: "sum",
        // },
      ],
    },
    {
      headerName: "2025-05",
      children: [
        {
          headerName: "plan",
          field: "values.plan.2025-05",
          cellStyle: { textAlign: "right" },
          valueFormatter: (p) =>
            new Intl.NumberFormat("de-DE", {
              notation: "standard",
              useGrouping: false,
              minimumFractionDigits: 1,
            }).format(p.value) + " %",
        },
        // {
        //   headerName: "forecast",
        //   field: "values.forecast.2025-05",
        //   aggFunc: "sum",
        // },
      ],
    },
    {
      headerName: "2025-06",
      children: [
        {
          headerName: "plan",
          field: "values.plan.2025-06",
          cellStyle: { textAlign: "right" },
          valueFormatter: (p) =>
            new Intl.NumberFormat("de-DE", {
              notation: "standard",
              useGrouping: false,
              minimumFractionDigits: 1,
            }).format(p.value) + " %",
          // aggFunc: "sum",
        },
        // {
        //   headerName: "forecast",
        //   field: "values.forecast.2025-06",
        //   aggFunc: "sum",
        // },
      ],
    },
    {
      headerName: "2025-04",
      children: [
        {
          headerName: "plan",
          field: "values.plan.2025-04",
          cellStyle: { textAlign: "right" },
          valueFormatter: (p) =>
            new Intl.NumberFormat("de-DE", {
              notation: "standard",
              useGrouping: false,
              minimumFractionDigits: 1,
            }).format(p.value) + " %",
        },
        // {
        //   headerName: "forecast",
        //   field: "values.forecast.2025-04",
        //   aggFunc: "sum",
        //   editable: true,
        // },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      // flex: 1,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Partitions",
      minWidth: 210,
      fixed: true,
      lockPinned: true,
      cellRendererParams: {
        suppressCount: true,
      },
    };
  }, []);
  const getDataPath = useCallback((data) => data.path, []);

  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      groupSelects: "filteredDescendants",
    };
  }, []);

  const aggFuncs = useMemo(() => {
    return {
      iop: (params) => {
        // console.log(params);
        if (params.rowNode.leafGroup) {
          return 50;
        }
        const values = params.values;
        return 100;
      },
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          theme={myTheme}
          rowData={rowData}
          groupSuppressBlankHeader={false}
          alwaysAggregateAtRootLevel={false}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          treeData={true}
          groupDefaultExpanded={-1}
          groupTotalRow={"bottom"}
          aggFuncs={aggFuncs}
          getDataPath={getDataPath}
          onCellEditingStopped={(e) => alert(e.node.id)}
          enableGroupEdit={true}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  // <StrictMode>
  <GridExample />
  // </StrictMode>
);
window.tearDownExample = () => root.unmount();
