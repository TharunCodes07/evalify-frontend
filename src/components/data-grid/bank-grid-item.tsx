"use client";

import { Bank } from "@/types/question-bank";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  User,
  FileQuestion,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface BankGridItemProps {
  bank: Bank;
  isSelected: boolean;
  onToggleSelect: () => void;
  enableSelection?: boolean;
  onCardClick?: (bank: Bank) => void;
}

export function BankGridItem({
  bank,
  isSelected,
  onToggleSelect,
  enableSelection = true,
  onCardClick,
}: BankGridItemProps) {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(bank);
    }
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-200 cursor-pointer",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {enableSelection && (
              <div
                className="p-2 -m-2 cursor-pointer rounded hover:bg-muted/50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect();
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onToggleSelect}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle
                className="text-lg font-semibold line-clamp-1"
                title={bank.name}
              >
                {bank.name}
              </CardTitle>
              <div className="mt-1">
                <Badge variant="secondary" className="text-xs">
                  Semester {bank.semester}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(bank.id);
                }}
              >
                Copy bank ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit bank
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete bank
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <p
            className="text-sm text-muted-foreground line-clamp-2"
            title={bank.description}
          >
            {bank.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <FileQuestion className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">{bank.questionCount || 0}</span>
            <span className="text-muted-foreground ml-1">questions</span>
          </div>
          {bank.createdBy && (
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">by</span>
              <span
                className="ml-1 font-medium truncate"
                title={bank.createdBy.name}
              >
                {bank.createdBy.name}
              </span>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(bank.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
