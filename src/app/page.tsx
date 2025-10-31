import TriviaGame from '@/components/trivia-game';
import { BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 mb-2">
            <BrainCircuit className="h-12 w-12 text-primary" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-foreground">
              Trivia Master
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Pon a prueba tu conocimiento de cultura general.
          </p>
        </header>
        <TriviaGame />
      </div>
    </main>
  );
}
