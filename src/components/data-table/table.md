# Data Table Component Ecosystem

This document provides a comprehensive overview of the `DataTable` component found in `src/components/data-table/data-table.tsx`, its features, how to use it, and its interaction with related utility functions and sub-components.

## 1. Introduction

The `DataTable` component is a powerful and flexible solution for displaying and managing tabular data. It is built on top of [TanStack Table v8](https://tanstack.com/table/v8) and provides a rich set of features including server-side pagination, sorting, filtering, row selection, column customization (visibility, order, resizing), and data export. It's designed to be highly configurable and extensible.

## 2. Core Features

- **Server-Side Operations:** Primarily designed for server-side data handling. Pagination, sorting, and filtering parameters are sent to the backend via the `fetchDataFn`.
- **Client-Side Operations (Simulated):** While built for server-side, client-side operations can be simulated by providing a `fetchDataFn` that processes a local dataset and implements pagination, sorting, and filtering logic itself. For true client-side TanStack Table capabilities, `manualPagination`, `manualSorting`, and `manualFiltering` would need to be `false`, which is not the default setup of this component.
- **Pagination:** Customizable page size and navigation.
- **Sorting:** Single-column sorting with direction (asc/desc).
- **Filtering:**
  - Global search filter.
  - Date range filter.
  - Per-column filtering with configurable options (`columnFilterOptions`).
- **Row Selection:**
  - Checkbox-based row selection.
  - Optional click-row-to-select functionality.
  - Ability to get all selected items, even across pages (using `fetchByIdsFn`).
  - Clear all selections.
- **Column Customization:**
  - **Visibility:** Show/hide columns, with state persisted (optionally in URL).
  - **Order:** Reorder columns via drag-and-drop, with order persisted in `localStorage`.
  - **Resizing:** Adjust column widths, with sizes persisted in `localStorage`.
- **Toolbar:** Integrated toolbar (`DataTableToolbar`) for search, filters, view options, actions on selected items, and data export.
- **Data Export:** Built-in support for exporting data (configuration via `exportConfig`).
- **State Management:** Flexible state management with optional URL persistence for most states (page, size, filters, sorting, column visibility) using a custom `createConditionalStateHook`.
- **Loading & Error States:** Clear visual feedback for data loading and error occurrences.
- **Customization:**
  - Custom toolbar content via `renderToolbarContent`.
  - Custom column rendering via the `getColumns` prop.
- **React Query Integration:** Supports using React Query hooks for data fetching.

## 3. How to Use

### Props

The `DataTable` component accepts the following props:

| Prop                   | Type                                                                                               | Required | Default            | Description                                                                                                                           |
| :--------------------- | :------------------------------------------------------------------------------------------------- | :------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `config`               | `TableConfig` (object)                                                                             | No       | `{}`               | Overrides default table behaviors (e.g., `enableUrlState`, `enableRowSelection`). See `TableConfig` type in `table-config.ts`.        |
| `getColumns`           | `(deselectionHandler: ((rowId: string) => void) \| null) => ColumnDef<TData, TValue>[]`            | Yes      |                    | Function that returns an array of TanStack Table column definitions. Receives a deselection handler for potential custom row actions. |
| `fetchDataFn`          | `(params: DataFetchParams) => Promise<DataFetchResult<TData>>` OR React Query hook                 | Yes      |                    | Function to fetch data. If it's a React Query hook, it should have an `isQueryHook: true` property.                                   |
| `fetchByIdsFn`         | `(ids: (string \| number)[]) => Promise<TData[]>`                                                  | No       |                    | Function to fetch specific data items by their IDs. Used by `getSelectedItems`.                                                       |
| `exportConfig`         | `ExportConfig` (object)                                                                            | No       |                    | Configuration for data export functionality (entity name, column mapping, etc.).                                                      |
| `idField`              | `keyof TData`                                                                                      | No       | `"id"`             | The unique identifier field in your data objects.                                                                                     |
| `pageSizeOptions`      | `number[]`                                                                                         | No       | `[10,20,30,40,50]` | Array of numbers for page size selection in pagination.                                                                               |
| `renderToolbarContent` | `(toolbarProps: CustomToolbarProps<TData>) => React.ReactNode`                                     | No       |                    | Function to render custom content/actions within the toolbar.                                                                         |
| `columnFilterOptions`  | Array of `{ columnId: string; title: string; options: { label: string; value: string; icon? }[] }` | No       |                    | Configuration for dropdown filters for specific columns.                                                                              |

### Basic Setup Example

```tsx
import { DataTable } from \'@/components/data-table/data-table\';
import { ColumnDef } from \'@tanstack/react-table\';

interface MyDataItem {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// Define your columns
const myColumns: ColumnDef<MyDataItem>[] = [
  // Select column (if row selection is enabled)
  {
    id: \'select\',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: \'name\',
    header: \'Name\',
  },
  {
    accessorKey: \'email\',
    header: \'Email\',
  },
  {
    accessorKey: \'createdAt\',
    header: \'Created At\',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  // ... other columns
];

// Define your data fetching function
const fetchData = async (params) => {
  // params will include: page, limit, search, from_date, to_date, sort_by, sort_order, column_filters
  const response = await fetch(`/api/my-data?page=${params.page}&limit=${params.limit}&search=${params.search || \'\'}...`);
  const result = await response.json();
  return {
    data: result.items,
    pagination: {
      page: result.currentPage,
      limit: result.pageSize,
      total_pages: result.totalPages,
      total_items: result.totalItems,
    },
  };
};

const MyTableComponent = () => {
  return (
    <DataTable<MyDataItem, unknown>
      getColumns={() => myColumns}
      fetchDataFn={fetchData}
      idField="id"
      config={{
        enableRowSelection: true,
        enableUrlState: true, // Persist state in URL
      }}
      columnFilterOptions={[
        {
          columnId: \'status\', // Assuming you have a \'status\' column
          title: \'Status\',
          options: [
            { label: \'Active\', value: \'active\' },
            { label: \'Inactive\', value: \'inactive\' },
          ],
        },
      ]}
    />
  );
};
```

## 4. Data Fetching

### Server-Side (Default)

The component is optimized for server-side data operations.
The `fetchDataFn` prop is crucial. It receives an object with the following parameters:

- `page`: Current page number.
- `limit`: Number of items per page (pageSize).
- `search`: Global search term (string).
- `from_date`: Start date for date range filter (string).
- `to_date`: End date for date range filter (string).
- `sort_by`: Column ID to sort by (string).
- `sort_order`: Sort direction (`"asc"` or `"desc"`).
- `column_filters`: An object where keys are column IDs and values are arrays of selected filter values (e.g., `{ status: ["active", "pending"] }`).

Your `fetchDataFn` should make an API call using these parameters and return a promise that resolves to an object with:

- `data`: An array of data items for the current page.
- `pagination`: An object with `page`, `limit`, `total_pages`, and `total_items`.

### React Query Integration

If your `fetchDataFn` is a React Query hook, you must add a property `isQueryHook: true` to the function object. The `DataTable` will then call it as a hook and use its `isLoading`, `isSuccess`, `isError`, `data`, and `error` properties. The hook itself should manage its dependencies on `page`, `pageSize`, `search`, etc.

### "Client-Side" Data

To handle data entirely on the client-side (e.g., for a small, static dataset):

1.  Your `fetchDataFn` would not make an API call. Instead, it would take the full dataset, apply the pagination, sorting, and filtering logic based on the input parameters, and return the sliced/sorted/filtered data as if it came from a server.
2.  This approach "simulates" server-side operations. For true client-side TanStack Table features (where the library handles filtering/sorting/pagination internally), you would set `manualPagination`, `manualSorting`, and `manualFiltering` to `false` in the `useReactTable` options. This component currently hardcodes them to `true`.

## 5. State Management

- **URL State:** If `config.enableUrlState` is `true`, the following states are synced with the URL query parameters: `page`, `pageSize`, `search`, `dateRange`, `sortBy`, `sortOrder`, `columnVisibility`, `columnFilters`. This is managed by the `createConditionalStateHook` utility.
- **Local State:**
  - `columnOrder`: Persisted in `localStorage` under the key `"data-table-column-order"`.
  - `columnSizing`: Persisted in `localStorage` by the `useTableColumnResize` hook, typically using the `tableId` (default or from `config.columnResizingTableId`).
  - `selectedItemIds`: The primary state for row selection, managed internally. `rowSelection` for TanStack Table is derived from this.

## 6. Key Functionalities Explained

- **Pagination:** Handled by `DataTablePagination` component. `onPaginationChange` updates `page` and `pageSize` state, which triggers data refetch.
- **Sorting:** Clicking column headers (if sortable) updates `sortBy` and `sortOrder` state, triggering refetch. Managed by `createSortingHandler`.
- **Filtering:**
  - Global search: Input in `DataTableToolbar` updates `search` state.
  - Date range: `DatePicker` in `DataTableToolbar` updates `dateRange` state.
  - Column filters: Dropdowns (configured by `columnFilterOptions`) in `DataTableToolbar` update `columnFilters` state.
    All filter changes trigger data refetch. `serverColumnFilters` memoizes the `columnFilters` into the format expected by the API.
- **Row Selection:**
  - `selectedItemIds`: A `Record<string | number, boolean>` stores the IDs of selected items. This is the source of truth.
  - `rowSelection`: A `Record<string, boolean>` (mapping row index to selection state) is derived for TanStack Table.
  - `handleRowSelectionChange`: Updates `selectedItemIds` based on changes from TanStack Table.
  - `getSelectedItems`: Retrieves full data for all selected items. It uses items from the current page if available, and fetches others using `fetchByIdsFn`.
- **Column Customization:**
  - **Visibility:** `ViewOptions` component in `DataTableToolbar` allows toggling column visibility. State managed by `columnVisibility`.
  - **Order:** Drag-and-drop column headers. State managed by `columnOrder` and persisted. `resetColumnOrder` function available.
  - **Resizing:** Drag column resizers (`DataTableResizer`). State managed by `columnSizing` (via `useTableColumnResize` hook) and persisted. `resetColumnSizing` function available.

## 7. Related Components and Hooks

The `DataTable` component relies on several other components and hooks within the `src/components/data-table/` directory:

### Sub-Components:

- **`DataTableToolbar.tsx`:** Renders the toolbar above the table. Includes:
  - Search input.
  - Date range picker (`DatePicker.tsx`).
  - Column-specific filters (`ColumnFilter.tsx` - used internally by toolbar based on `columnFilterOptions`).
  - View options dropdown (`ViewOptions.tsx`) for column visibility.
  - Data export button (`DataExport.tsx`).
  - Actions for selected items (e.g., delete).
  - Placeholder for custom toolbar content (`renderToolbarContent`).
- **`DataTablePagination.tsx`:** Renders pagination controls.
- **`DataTableResizer.tsx`:** Visual element for dragging to resize columns.
- **`ColumnHeader.tsx`:** A utility component often used for creating sortable column headers with filtering capabilities (though filtering UI might be in the toolbar).
- **`DatePicker.tsx`:** Component for selecting date ranges.

### Hooks:

- **`hooks/use-table-column-resize.ts`:** Manages column resizing logic, including persistence to `localStorage`.
- **`utils/table-config.ts` (`useTableConfig`):** Merges default table configuration with user-provided overrides.
- **`utils/conditional-state.ts` (`createConditionalStateHook`):** Creates state hooks that can optionally sync with URL parameters. This is a key part of the state management strategy.
- **`utils/table-state-handlers.ts`:** Contains helper functions to create handlers for TanStack Table events (sorting, filtering, visibility) and to convert state formats (e.g., `createSortingState`).
- **`utils/column-sizing.ts`:** Provides utilities for initializing and managing column sizes (e.g., `initializeColumnSizes`).
- **`utils/search.ts` (`preprocessSearch`):** Potentially for cleaning or modifying the search term before sending to the API.
- **`utils/url-state.ts`:** Likely contains the core logic for reading/writing state to URL parameters, used by `conditional-state.ts`.

### UI Primitives:

The `DataTable` also uses generic UI components from `src/components/ui/` like `Table`, `Button`, `Input`, `DropdownMenu`, `Skeleton`, `Alert`, etc.

## 8. Customization

- **Toolbar:** Use the `renderToolbarContent` prop to inject custom React components or actions into the toolbar. This prop receives `selectedRows`, `allSelectedIds`, `totalSelectedCount`, and `resetSelection`.
- **Columns:** The `getColumns` prop gives full control over column definitions, including custom cell rendering, header rendering, and enabling/disabling features per column.
- **Styling:** Standard CSS and Tailwind CSS classes can be used for styling. The table has classes like `resizable-table` when resizing is enabled.
- **Configuration:** The `config` prop allows fine-tuning many behaviors like enabling/disabling row selection, URL state persistence, etc.

## 9. Server-Side vs. Client-Side Considerations

- **Server-Side (Recommended for large datasets):**
  - **Pros:** Efficient for large datasets as only a subset of data is sent to the client. Complex filtering/sorting can be offloaded to the database.
  - **How:** This is the default mode. Implement `fetchDataFn` to query your backend with pagination, sorting, and filtering parameters.
- **Client-Side (Simulated, for small datasets):**
  - **Pros:** Can be faster for small, already-loaded datasets as no network requests are needed for sorting/filtering/pagination after initial load.
  - **How:**
    1.  Load the entire dataset initially.
    2.  Your `fetchDataFn` will not make API calls. Instead, it will receive the full dataset and apply the `page`, `limit`, `search`, `sort_by`, `sort_order`, and `column_filters` parameters to this local array. It should then return the appropriate slice of data and pagination info.
  - **Note:** This component is primarily architected for server-side operations due to `manualPagination`, `manualSorting`, `manualFiltering` being set to `true`. True client-side TanStack Table behavior (where the library itself handles these operations without manual intervention) would require modifying the `useReactTable` options.

This `DataTable` component provides a robust foundation for displaying interactive data grids in your application. By understanding its props, features, and the roles of its associated utilities, you can effectively integrate and customize it to meet your specific needs.
