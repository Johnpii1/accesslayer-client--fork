import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MarketplaceSidebarProps {
  className?: string;
}

const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={isOpen}
          className="bg-slate-900 border-white/10"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-950 border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-black text-white tracking-tight">Navigation</h2>
          </div>
          <nav className="flex-1 space-y-2">
            <a href="/" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Home</a>
            <a href="/creators" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Creators</a>
            <a href="/activity" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Activity</a>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default MarketplaceSidebar;
