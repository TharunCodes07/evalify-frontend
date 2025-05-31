"use client";
import { useState, useEffect } from "react";
import { ViewToggle, ViewMode } from "@/components/view-toggle";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { DataGrid } from "@/components/data-grid/data-grid";
import { GridItem } from "@/components/data-grid/grid-item";
import { Team } from "@/types/types";
import { Users } from "lucide-react";
import { getColumns } from "@/components/teams/team-columns";
import { useTeams } from "@/components/teams/hooks/use-teams";

function useTeamsForDataTable(page: number, pageSize: number, search: string) {
  return useTeams(search, page - 1, pageSize);
}

useTeamsForDataTable.isQueryHook = true;

export default function TeamsPage() {
  const [viewmode, setViewMode] = useState<ViewMode>("table");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("team-view") as ViewMode;
    if ((saved && saved === "table") || saved === "grid") {
      setViewMode(saved);
    }
  }, []);

  const handleViewModeChange = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
    localStorage.setItem("team-view", newViewMode);
  };
  const handleClick = (team: Team) => {
    router.push(`/team/${team.id}`);
  };

  const columnsWrapper = () => {
    return getColumns(handleClick);
  };

  const renderTeamGrid = (
    team: Team,
    index: number,
    isSelected: boolean,
    onToggleSelect: () => void
  ) => {
    return (
      <GridItem<Team>
        key={team.id}
        item={team}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        onCardClick={handleClick}
        fieldConfig={{
          id: "id",
          title: "name",
          description: "description",
          createdAt: "createdAt",
          badge: {
            field: "projectCount",
            label: "Projects:",
            variant: "secondary",
          },
          stats: [
            {
              field: "members",
              label: "member(s)",
              icon: Users,
              format: (value: unknown) =>
                Array.isArray(value) ? value.length : 0,
            },
          ],
        }}
        entityName="team"
      />
    );
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Teams Page</h1>
        <div className="flex items-center gap-4">
          <ViewToggle
            view={viewmode}
            onViewChange={handleViewModeChange}
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
              entityName: "teams",
              columnMapping: {},
              columnWidths: [],
              headers: [],
            }}
            getColumns={columnsWrapper}
            fetchDataFn={useTeamsForDataTable}
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
            renderGridItem={renderTeamGrid}
            fetchDataFn={useTeamsForDataTable}
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
