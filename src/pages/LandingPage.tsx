import { useState, useEffect, useMemo } from 'react';
import { courseService, type Course } from '@/services/course.service';
import SearchBar from '@/components/common/SearchBar';
import CreatorCard from '@/components/common/CreatorCard';
import { CreatorGridSkeleton } from '@/components/common/CreatorSkeleton';
import EmptyState from '@/components/common/EmptyState';

// ✅ NEW IMPORTS
import { Button } from '@/components/ui/button';
import { UnavailableAction } from '@/components/ui/unavailable-action';

const DEMO_CREATORS: Course[] = [
  {
    id: '1',
    title: 'Alex Rivers',
    description: 'Digital Artist & Illustrator',
    price: 0.05,
    instructorId: 'arivers',
    category: 'Art',
    level: 'BEGINNER',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
];

function LandingPage() {
  const [creators, setCreators] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCreators = async () => {
      setIsLoading(true);
      try {
        const data = await courseService.getCourses();
        setCreators(data.length > 0 ? data : DEMO_CREATORS);
      } catch {
        setCreators(DEMO_CREATORS);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    fetchCreators();
  }, []);

  const filteredCreators = useMemo(() => {
    return creators.filter(
      creator =>
        creator.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.instructorId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [creators, searchQuery]);

  const handleResetSearch = () => setSearchQuery('');

  return (
    <main className="relative min-h-screen bg-black px-6 py-12">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Access Layer
          </h1>

          {/* ✅ TOOLTIP BUTTON */}
          <div className="flex justify-center mb-6">
            <UnavailableAction disabled={true} reason="Feature coming soon">
              <Button>Buy Access</Button>
            </UnavailableAction>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </header>

        {/* CONTENT */}
        <section>
          {isLoading ? (
            <CreatorGridSkeleton count={3} />
          ) : filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCreators.map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          ) : (
            <EmptyState
  image="/images/no-results.png"
  title="No creators found"
  description="Try a different search"
  onReset={handleResetSearch}
/>
          )}
        </section>

      </div>
    </main>
  );
}

export default LandingPage;