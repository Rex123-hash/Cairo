/**
 * Ambient type declarations for browser globals injected at runtime.
 */

interface Window {
  /** Google Analytics 4 gtag.js function. Present when GA is loaded. */
  gtag: (
    command: "config" | "event" | "set" | "js",
    targetOrDate: string | Date,
    params?: Record<string, unknown>,
  ) => void;

  /** Google Charts namespace — available after loader.js initialises. */
  google: {
    charts: {
      load: (version: string, options: Record<string, unknown>) => void;
      setOnLoadCallback: (callback: () => void) => void;
    };
    visualization: {
      DataTable: new () => GoogleDataTable;
      PieChart: new (container: HTMLElement) => GooglePieChart;
      LineChart: new (container: HTMLElement) => GoogleLineChart;
    };
  };
}

interface GoogleDataTable {
  addColumn: (type: string, label: string) => void;
  addRows: (rows: Array<Array<string | number | null>>) => void;
}

interface GooglePieChart {
  draw: (data: GoogleDataTable, options: Record<string, unknown>) => void;
  clearChart: () => void;
}

interface GoogleLineChart {
  draw: (data: GoogleDataTable, options: Record<string, unknown>) => void;
  clearChart: () => void;
}
