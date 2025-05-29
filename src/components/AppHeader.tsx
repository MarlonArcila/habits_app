
import { PlusCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  onAddHabitClick: () => void;
}

export function AppHeader({ onAddHabitClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <svg width="32" height="32" viewBox="0 0 100 100" className="mr-2 fill-primary">
            <path d="M50,5A10,10,0,0,0,40,15V25H25A10,10,0,0,0,15,35V50A10,10,0,0,0,25,60H40V70A10,10,0,0,0,50,80A10,10,0,0,0,60,70V60H75A10,10,0,0,0,85,50V35A10,10,0,0,0,75,25H60V15A10,10,0,0,0,50,5ZM25,35H75V50H25V35Z" />
             <path d="M50,10 C50,10 55,15 55,25 L45,25 C45,15 50,10 50,10 M25,45 L25,55 L15,55 C15,45 25,45 25,45 M75,45 L75,55 L85,55 C85,45 75,45 75,45 M50,80 C50,80 55,85 55,90 L45,90 C45,85 50,80 50,80" fillOpacity="0.5" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Habitual</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" passHref>
            <Button variant="outline" size="sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Button onClick={onAddHabitClick} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
        </div>
      </div>
    </header>
  );
}
