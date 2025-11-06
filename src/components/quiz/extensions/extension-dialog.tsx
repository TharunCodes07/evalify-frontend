import { useState } from "react";
import { ExtensionRequest } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { InputNumber } from "@/components/ui/input-number";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";

interface ExtensionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGrantExtension: (request: ExtensionRequest) => void;
  isLoading: boolean;
}

export function ExtensionDialog({
  isOpen,
  onClose,
  onGrantExtension,
  isLoading,
}: ExtensionDialogProps) {
  const [additionalMinutes, setAdditionalMinutes] = useState(15);
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (additionalMinutes > 0) {
      onGrantExtension({
        additionalMinutes,
        reason: reason.trim() || "Extension granted by faculty",
      });
      setAdditionalMinutes(15);
      setReason("");
    }
  };

  const handleClose = () => {
    setAdditionalMinutes(15);
    setReason("");
    onClose();
  };

  const presetMinutes = [5, 10, 15, 30, 60];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Grant Time Extension
          </DialogTitle>
          <DialogDescription>
            Grant additional time for this quiz attempt. The student will be
            notified of the extension.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="minutes">Additional Minutes</Label>
            <div className="space-y-3">
              <InputNumber
                id="minutes"
                value={additionalMinutes}
                onChange={(value) => setAdditionalMinutes(value || 15)}
                min={1}
                max={180}
                placeholder="Enter minutes"
              />
              <div className="flex gap-2 flex-wrap">
                {presetMinutes.map((minutes) => (
                  <Button
                    key={minutes}
                    type="button"
                    variant={
                      additionalMinutes === minutes ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setAdditionalMinutes(minutes)}
                  >
                    {minutes}m
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for extension..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || additionalMinutes <= 0}
            >
              {isLoading ? "Granting..." : "Grant Extension"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
