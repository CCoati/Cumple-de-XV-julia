import Hero from '@/components/Hero';
import AudioPlayer from '@/components/AudioPlayer';
import Introduction from '@/components/Introduction';
import Countdown from '@/components/Countdown';
import EventDetails from '@/components/EventDetails';
import Location from '@/components/Location';
import Gifts from '@/components/Gifts';
import RSVPForm from '@/components/RSVPForm';
import ClosingSection from '@/components/ClosingSection';
import SectionDivider from '@/components/decorative/SectionDivider';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <AudioPlayer />
      <Hero />

      <SectionDivider variant="botanical" className="py-2" />

      <Introduction />

      <SectionDivider variant="line" className="py-2" />

      <Countdown />

      <SectionDivider variant="botanical" className="py-2" />

      <EventDetails />

      <SectionDivider variant="dots" className="py-2" />

      <Location />

      <SectionDivider variant="botanical" className="py-2" />

      <Gifts />

      <SectionDivider variant="line" className="py-2" />

      <RSVPForm />

      <ClosingSection />
    </main>
  );
}
