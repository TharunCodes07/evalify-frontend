"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Announcements,
  type DndContextProps,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import tunnel from "tunnel-rat";

const t = tunnel();

export type { DragEndEvent } from "@dnd-kit/core";

export type KanbanItemProps = {
  id: string;
  name: string;
  column: string;
};

export type KanbanColumnProps = {
  id: string;
  name: string;
};

type KanbanContextProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps
> = {
  columns: C[];
  data: T[];
  activeCardId: string | null;
  isDragging: boolean;
};

const KanbanContext = createContext<KanbanContextProps>({
  columns: [],
  data: [],
  activeCardId: null,
  isDragging: false,
});

export type KanbanBoardProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className={cn(
        "flex size-full min-h-40 flex-col divide-y overflow-hidden rounded-md border bg-secondary text-xs shadow-sm ring-2 transition-all",
        isOver ? "ring-primary" : "ring-transparent",
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};

export type KanbanCardProps<T extends KanbanItemProps = KanbanItemProps> = T & {
  children?: ReactNode;
  className?: string;
};

export const KanbanCard = <T extends KanbanItemProps = KanbanItemProps>({
  id,
  name,
  children,
  className,
}: KanbanCardProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
  });
  const { activeCardId } = useContext(KanbanContext) as KanbanContextProps;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div style={style} {...listeners} {...attributes} ref={setNodeRef}>
        <Card
          className={cn(
            "cursor-grab gap-4 rounded-md p-3 shadow-sm",
            isDragging && "pointer-events-none cursor-grabbing opacity-30",
            className
          )}
        >
          {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
        </Card>
      </div>
      {activeCardId === id && (
        <t.In>
          <Card
            className={cn(
              "cursor-grab gap-4 rounded-md p-3 shadow-sm ring-2 ring-primary",
              isDragging && "cursor-grabbing",
              className
            )}
          >
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </t.In>
      )}
    </>
  );
};

export type KanbanCardsProps<T extends KanbanItemProps = KanbanItemProps> =
  Omit<HTMLAttributes<HTMLDivElement>, "children" | "id"> & {
    children: (item: T) => ReactNode;
    id: string;
  };

export const KanbanCards = <T extends KanbanItemProps = KanbanItemProps>({
  children,
  className,
  ...props
}: KanbanCardsProps<T>) => {
  const { data } = useContext(KanbanContext) as KanbanContextProps<T>;
  const filteredData = data.filter((item) => item.column === props.id);
  const items = filteredData.map((item) => item.id);

  // Make the cards container droppable as well
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: `${props.id}-cards`,
  });

  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div
          ref={setDroppableRef}
          className={cn(
            "flex flex-grow flex-col gap-2 p-2 min-h-[100px]",
            isOver && "bg-accent/20",
            className
          )}
          {...props}
        >
          {filteredData.map(children)}
        </div>
      </SortableContext>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export type KanbanHeaderProps = HTMLAttributes<HTMLDivElement>;

export const KanbanHeader = ({ className, ...props }: KanbanHeaderProps) => (
  <div className={cn("m-0 p-2 font-semibold text-sm", className)} {...props} />
);

export type KanbanProviderProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps
> = Omit<DndContextProps, "children"> & {
  children: (column: C) => ReactNode;
  className?: string;
  columns: C[];
  data: T[];
  onDataChange?: (data: T[]) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
};

export const KanbanProvider = <
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps
>({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
  columns,
  data,
  onDataChange,
  ...props
}: KanbanProviderProps<T, C>) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedData, setDraggedData] = useState<T[]>(data);

  const displayData = useMemo(() => {
    return isDragging ? draggedData : data;
  }, [isDragging, draggedData, data]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveCardId(active.id as string);
    setIsDragging(true);
    setDraggedData([...data]); 
    onDragStart?.(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !isDragging) {
      onDragOver?.(event);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeItem = data.find((item) => item.id === activeId);
    if (!activeItem) {
      onDragOver?.(event);
      return;
    }

    let targetColumnId: string;
    const overItem = data.find((item) => item.id === overId);

    if (overItem) {
      targetColumnId = overItem.column;
    } else {
      const targetColumn = columns.find((col) => col.id === overId);
      if (targetColumn) {
        targetColumnId = targetColumn.id;
      } else {
        const cardsDropId = overId.toString();
        if (cardsDropId.endsWith("-cards")) {
          const columnId = cardsDropId.replace("-cards", "");
          const targetColumn = columns.find((col) => col.id === columnId);
          if (targetColumn) {
            targetColumnId = targetColumn.id;
          } else {
            onDragOver?.(event);
            return;
          }
        } else {
          onDragOver?.(event);
          return;
        }
      }
    }

    if (activeItem.column !== targetColumnId) {
      let newData = [...data];
      const activeIndex = newData.findIndex((item) => item.id === activeId);
      newData[activeIndex] = {
        ...newData[activeIndex],
        column: targetColumnId,
      };

      // If dropped over another item, reorder within the column
      if (overItem) {
        const overIndex = newData.findIndex((item) => item.id === overId);
        newData = arrayMove(newData, activeIndex, overIndex);
      }

      setDraggedData(newData);
    } else if (overItem) {
      // Same column, just reordering
      let newData = [...data];
      const activeIndex = newData.findIndex((item) => item.id === activeId);
      const overIndex = newData.findIndex((item) => item.id === overId);

      if (activeIndex !== overIndex) {
        newData = arrayMove(newData, activeIndex, overIndex);
        setDraggedData(newData);
      }
    }

    onDragOver?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveCardId(null);
    setIsDragging(false);

    if (!over) {
      setDraggedData(data); // Reset to original data
      onDragEnd?.(event);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Find the active item in original data
    const activeItem = data.find((item) => item.id === activeId);
    if (!activeItem) {
      setDraggedData(data);
      onDragEnd?.(event);
      return;
    }

    // Determine the target column
    let targetColumnId: string;
    const overItem = data.find((item) => item.id === overId);

    if (overItem) {
      targetColumnId = overItem.column;
    } else {
      // Check if dropped over a column directly
      const targetColumn = columns.find((col) => col.id === overId);
      if (targetColumn) {
        targetColumnId = targetColumn.id;
      } else {
        // Check if dropped over a cards container (ends with -cards)
        const cardsDropId = overId.toString();
        if (cardsDropId.endsWith("-cards")) {
          const columnId = cardsDropId.replace("-cards", "");
          const targetColumn = columns.find((col) => col.id === columnId);
          if (targetColumn) {
            targetColumnId = targetColumn.id;
          } else {
            setDraggedData(data);
            onDragEnd?.(event);
            return;
          }
        } else {
          setDraggedData(data);
          onDragEnd?.(event);
          return;
        }
      }
    }

    // Create the final data state
    let newData = [...data];
    const activeIndex = newData.findIndex((item) => item.id === activeId);

    // Check if there's actually a change
    let hasChange = false;

    if (activeItem.column !== targetColumnId) {
      // Column changed
      hasChange = true;
      newData[activeIndex] = {
        ...newData[activeIndex],
        column: targetColumnId,
      };

      if (overItem) {
        const overIndex = newData.findIndex((item) => item.id === overId);
        newData = arrayMove(newData, activeIndex, overIndex);
      }
    } else if (overItem) {
      // Same column, check if position changed
      const overIndex = newData.findIndex((item) => item.id === overId);
      if (activeIndex !== overIndex) {
        hasChange = true;
        newData = arrayMove(newData, activeIndex, overIndex);
      }
    }

    // Only call onDataChange if there's an actual change
    if (hasChange) {
      onDataChange?.(newData);
    }

    setDraggedData(data); // Reset dragged data
    onDragEnd?.(event);
  };

  const handleDragCancel = () => {
    setActiveCardId(null);
    setIsDragging(false);
    setDraggedData(data); // Reset to original data
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      const { name, column } = data.find((item) => item.id === active.id) ?? {};
      const columnName = columns.find((col) => col.id === column)?.name;
      return `Picked up the card "${name}" from the "${columnName}" column`;
    },
    onDragOver({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};

      const overItem = data.find((item) => item.id === over?.id);
      if (overItem) {
        const newColumn = columns.find(
          (column) => column.id === overItem.column
        )?.name;
        return `Dragged the card "${name}" over the "${newColumn}" column`;
      }

      const newColumn = columns.find((column) => column.id === over?.id)?.name;
      return `Dragged the card "${name}" over the "${newColumn}" column`;
    },
    onDragEnd({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};

      const overItem = data.find((item) => item.id === over?.id);
      if (overItem) {
        const newColumn = columns.find(
          (column) => column.id === overItem.column
        )?.name;
        return `Dropped the card "${name}" into the "${newColumn}" column`;
      }

      const newColumn = columns.find((column) => column.id === over?.id)?.name;
      return `Dropped the card "${name}" into the "${newColumn}" column`;
    },
    onDragCancel({ active }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      return `Cancelled dragging the card "${name}"`;
    },
  };

  return (
    <KanbanContext.Provider
      value={{
        columns,
        data: displayData,
        activeCardId,
        isDragging,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        accessibility={{ announcements }}
        {...props}
      >
        <div
          className={cn(
            "grid size-full auto-cols-fr grid-flow-col gap-4",
            className
          )}
        >
          {columns.map((column) => children(column))}
        </div>
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              <t.Out />
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </KanbanContext.Provider>
  );
};
