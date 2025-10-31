'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { questions, type Question } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Lightbulb, CheckCircle2, XCircle, Sparkles, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { getAiAssistedHint } from '@/ai/flows/ai-assisted-hint';
import { adjustDifficulty } from '@/ai/flows/dynamic-difficulty-adjustment';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

// Utility to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function TriviaGame() {
  const [difficulty, setDifficulty] = useState(5);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [performanceHistory, setPerformanceHistory] = useState<boolean[]>([]);
  const [showDifficultyAlert, setShowDifficultyAlert] = useState(false);
  const [suggestedDifficulty, setSuggestedDifficulty] = useState(0);
  const [isGameReady, setIsGameReady] = useState(false);

  const { toast } = useToast();

  const startGame = useCallback((diff: number) => {
    const questionsInDifficultyRange = questions.filter(
      q => q.difficulty <= diff + 2 && q.difficulty >= diff - 2
    );
    let selectedQuestions = shuffleArray(questionsInDifficultyRange).slice(0, 10);
    
    if (selectedQuestions.length < 5) { // Ensure there are enough questions
        selectedQuestions = shuffleArray(questions).slice(0, 10);
        toast({
            title: "Pocas preguntas",
            description: "No hay suficientes preguntas para esta dificultad. Mostrando preguntas generales."
        })
    }

    setFilteredQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameOver(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPerformanceHistory([]);
    setIsGameReady(true);
  }, [toast]);

  useEffect(() => {
    startGame(difficulty);
  }, [difficulty, startGame]);

  const currentQuestion = useMemo(() => {
    if (isGameReady && filteredQuestions.length > 0 && currentQuestionIndex < filteredQuestions.length) {
      return filteredQuestions[currentQuestionIndex];
    }
    return null;
  }, [currentQuestionIndex, filteredQuestions, isGameReady]);

  useEffect(() => {
    if (currentQuestion) {
      setShuffledOptions(shuffleArray(currentQuestion.options));
      setHint(null);
      setIncorrectAttempts(0);
    }
  }, [currentQuestion]);
  
  const handleDifficultyAdjustment = useCallback(async (history: boolean[]) => {
    try {
      const { adjustedDifficulty } = await adjustDifficulty({
        currentDifficulty: difficulty,
        recentPerformance: history,
      });
      if (adjustedDifficulty !== difficulty && Math.abs(adjustedDifficulty - difficulty) > 0) {
        setSuggestedDifficulty(Math.round(adjustedDifficulty));
        setShowDifficultyAlert(true);
      }
    } catch (error) {
      console.error("Error adjusting difficulty:", error);
      toast({
        variant: "destructive",
        title: "Error de IA",
        description: "No se pudo obtener la sugerencia de dificultad.",
      });
    }
  }, [difficulty, toast]);

  useEffect(() => {
    if (performanceHistory.length > 0 && performanceHistory.length % 5 === 0) {
      handleDifficultyAdjustment(performanceHistory.slice(-5));
    }
  }, [performanceHistory, handleDifficultyAdjustment]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || !currentQuestion) return;

    const correct = answer === currentQuestion.correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setPerformanceHistory(prev => [...prev, correct]);

    if (correct) {
      setScore(prev => prev + 10 * difficulty);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#4169E1', '#FFFFFF']
      });
    } else {
      setIncorrectAttempts(prev => prev + 1);
    }
  };
  
  const handleGetHint = async () => {
    if (!currentQuestion || !selectedAnswer) return;
    setIsHintLoading(true);
    try {
      const result = await getAiAssistedHint({
        question: currentQuestion.question,
        options: currentQuestion.options,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
      });
      setHint(result.hint);
    } catch (error) {
      console.error("Error getting hint:", error);
      toast({
        variant: "destructive",
        title: "Error de IA",
        description: "No se pudo generar la pista. Inténtalo de nuevo.",
      });
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setGameOver(true);
    }
  };

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) {
      return "justify-start text-base h-auto py-3";
    }
    const isCorrectAnswer = option === currentQuestion?.correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrectAnswer) {
      return "justify-start text-base h-auto py-3 bg-accent hover:bg-accent/90 text-accent-foreground border-yellow-500 ring-2 ring-yellow-400";
    }
    if (isSelected && !isCorrect) {
      return "justify-start text-base h-auto py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground border-red-700";
    }
    return "justify-start text-base h-auto py-3 bg-secondary/50 text-muted-foreground opacity-60";
  };
  
  if (!isGameReady || !currentQuestion) {
     return <Card className="w-full shadow-2xl text-center p-8"><p>Cargando juego...</p></Card>
  }

  if (gameOver) {
    return (
      <Card className="w-full text-center shadow-2xl animate-in fade-in-50">
        <CardHeader>
          <Trophy className="mx-auto h-16 w-16 text-accent" />
          <CardTitle className="text-4xl font-bold">¡Juego Terminado!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl text-muted-foreground mb-4">Tu puntuación final es:</p>
          <p className="text-6xl font-bold text-primary">{score}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => startGame(difficulty)} size="lg">
            <RotateCcw className="mr-2" />
            Jugar de Nuevo
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full shadow-2xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-5">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground">Pregunta {currentQuestionIndex + 1} de {filteredQuestions.length}</p>
            <div className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-lg font-bold shadow-md">
              {score} Puntos
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / filteredQuestions.length) * 100} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <CardTitle className="text-2xl md:text-3xl font-semibold leading-tight min-h-[96px] flex items-center">{currentQuestion.question}</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shuffledOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="lg"
                className={getButtonClass(option)}
                onClick={() => handleAnswerSelect(option)}
                disabled={!!selectedAnswer}
              >
                <span className="flex items-center gap-3 w-full">
                  {selectedAnswer && (option === currentQuestion.correctAnswer ? <CheckCircle2 className="text-green-400 flex-shrink-0" /> : (option === selectedAnswer && <XCircle className="text-red-400 flex-shrink-0" />))}
                  <span className="text-left flex-grow">{option}</span>
                </span>
              </Button>
            ))}
          </div>

          {selectedAnswer && !isCorrect && incorrectAttempts > 0 && !hint && (
            <div className="text-center pt-4">
              <Button onClick={handleGetHint} disabled={isHintLoading} variant="secondary">
                {isHintLoading ? (
                  <>Obteniendo pista...</>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Necesito una pista
                  </>
                )}
              </Button>
            </div>
          )}

          {hint && (
            <Alert className="bg-primary/10 border-primary/30 animate-in fade-in-50">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-bold">Pista de la IA</AlertTitle>
              <AlertDescription className="text-foreground/90">{hint}</AlertDescription>
            </Alert>
          )}

        </CardContent>
        {selectedAnswer && (
          <CardFooter className="flex justify-end pt-4">
            <Button onClick={handleNextQuestion} size="lg" className="animate-pulse">
              {currentQuestionIndex < filteredQuestions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl">Ajustes de Dificultad</CardTitle>
            <CardDescription>Ajusta la dificultad para la próxima partida.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4">
                <Label htmlFor="difficulty-slider" className="whitespace-nowrap text-base">Dificultad: <span className="font-bold text-primary">{difficulty}</span></Label>
                <Slider
                    id="difficulty-slider"
                    min={1}
                    max={10}
                    step={1}
                    value={[difficulty]}
                    onValueChange={(value) => setDifficulty(value[0])}
                />
            </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={showDifficultyAlert} onOpenChange={setShowDifficultyAlert}>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¡Sugerencia de la IA!</AlertDialogTitle>
              <AlertDialogDescription>
                  Basado en tu rendimiento, te sugerimos cambiar la dificultad a nivel {suggestedDifficulty}. ¿Quieres ajustarla para la siguiente partida?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, gracias</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                  setDifficulty(suggestedDifficulty);
                  setShowDifficultyAlert(false);
              }}>
                  Sí, ajustar
              </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
