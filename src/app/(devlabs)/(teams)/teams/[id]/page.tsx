"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ViewToggle, ViewMode } from "@/components/view-toggle";
import { DataTable } from "@/components/data-table/data-table";
import { DataGrid } from "@/components/data-grid/data-grid";
import { GridItem } from "@/components/data-grid/grid-item";
import { Project } from "@/types/types";
import { useParams } from "next/navigation";
import { getColumns } from "@/components/projects/project-columns";
import { useProjects } from "@/components/projects/hooks/use-projects";

function useProjectsForDataTable(
  page: number,
  pageSize: number,
  search: string
) {
  const params = useParams<{ id: string }>();
  return useProjects(params.id, search, page - 1, pageSize);
}

useProjectsForDataTable.isQueryHook = true;

export default function ProjectsPage() {
  const [viewmode, setViewMode] = useState<ViewMode>("table");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("project-view") as ViewMode;
    if ((saved && saved === "table") || saved === "grid") {
      setViewMode(saved);
    }
  }, []);

  const handleViewModedChange = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
    localStorage.setItem("project-view", newViewMode);
  };

  const handleClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  const columnsWrapper = () => {
    return getColumns(handleClick);
  };

  const renderProjectGrid = (
    project: Project,
    index: number,
    isSelected: boolean,
    onToggleSelect: () => void
  ) => {
    return (
      <GridItem<Project>
        key={project.id}
        item={project}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        onCardClick={handleClick}
        fieldConfig={{
          id: "id",
          title: "title",
          createdAt: "createdAt",
        }}
      />
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Team Projects</h1>
        <div className="flex items-center gap-4">
          <ViewToggle
            view={viewmode}
            onViewChange={handleViewModedChange}
            className="shrink-0"
          />
        </div>
      </div>

      <div>
        {viewmode === "table" ? (
          <DataTable
            config={{
              enableUrlState: false,
              enableExport: true,
              enableDateFilter: false,
            }}
            exportConfig={{
              entityName: "projects",
              columnMapping: {},
              columnWidths: [],
              headers: [],
            }}
            getColumns={columnsWrapper}
            fetchDataFn={useProjectsForDataTable}
            idField="id"
            onRowClick={handleClick}
          />
        ) : (
          <DataGrid
            config={{
              enableUrlState: false,
            }}
            exportConfig={{
              entityName: "teams",
              columnMapping: {},
              columnWidths: [],
              headers: [],
            }}
            getColumns={columnsWrapper}
            renderGridItem={renderProjectGrid}
            fetchDataFn={useProjectsForDataTable}
            idField="id"
            gridConfig={{
              columns: { default: 1, md: 2, lg: 3, xl: 4 },
              gap: 6,
            }}
            pageSizeOptions={[12, 24, 36, 48]}
          />
        )}
      </div>
    </div>
  );
}
