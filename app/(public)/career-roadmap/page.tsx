import { Metadata } from 'next';
import { CareerRoadmap } from '@/shared/components/public/CareerRoadmap';

export const metadata: Metadata = {
  title: 'Career Roadmap | Digo Academy',
  description: 'Explore AWS career paths, required skills, certifications, and Digo Academy learning tracks.',
};

export default function CareerRoadmapPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center pt-16 pb-24 sm:pt-24 sm:pb-32">
      <CareerRoadmap />
    </main>
  );
}
