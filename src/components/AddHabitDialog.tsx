"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { SmilePlus } from 'lucide-react'; // Default icon

interface AddHabitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (name: string, icon: string, points: number) => void;
}

export function AddHabitDialog({ isOpen, onClose, onAddHabit }: AddHabitDialogProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [points, setPoints] = useState<number>(10);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Habit name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (points <= 0) {
      toast({
        title: "Validation Error",
        description: "Points must be a positive number.",
        variant: "destructive",
      });
      return;
    }
    onAddHabit(name, icon.trim() || 'Activity', points); // Default icon if not provided
    toast({
      title: "Habit Added",
      description: `"${name}" has been added to your list.`,
    });
    setName('');
    setIcon('');
    setPoints(10);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) onClose(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogDescription>
            Define a new habit you want to track. Provide a Lucide icon name (e.g., Dumbbell, BookOpen).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Morning Run"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Dumbbell (default: Activity)"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="points" className="text-right">
              Points
            </Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
              placeholder="e.g., 10"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Add Habit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
