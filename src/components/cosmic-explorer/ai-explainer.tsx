'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { getExplanation, getHypotheticalScenario } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { WandSparkles, BrainCircuit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/context/language-context';

interface AiExplainerProps {
  objectName: string;
}

export function AiExplainer({ objectName }: AiExplainerProps) {
  const { t, language } = useLanguage();
  const [explanation, setExplanation] = React.useState('');
  const [hypothetical, setHypothetical] = React.useState('');
  const [scenarioResult, setScenarioResult] = React.useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = React.useState(false);
  const [isLoadingScenario, setIsLoadingScenario] = React.useState(false);
  const [isExplanationDialogOpen, setIsExplanationDialogOpen] = React.useState(false);
  const [isScenarioDialogOpen, setIsScenarioDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleExplain = async () => {
    setIsLoadingExplanation(true);
    setExplanation('');
    const result = await getExplanation(objectName, language === 'es' ? 'Spanish' : 'English');
    setIsLoadingExplanation(false);
    if (result.success && result.explanation) {
      setExplanation(result.explanation);
      setIsExplanationDialogOpen(true); 
    } else {
      toast({
        variant: 'destructive',
        title: t('toast.error.title'),
        description: result.error || t('toast.error.defaultAi'),
      });
    }
  };

  const handleScenario = async () => {
    if (!hypothetical.trim()) {
      toast({
        variant: 'destructive',
        title: t('toast.error.title'),
        description: t('toast.error.scenarioRequired'),
      });
      return;
    }
    setIsLoadingScenario(true);
    setScenarioResult('');
    const result = await getHypotheticalScenario(objectName, hypothetical, language === 'es' ? 'Spanish' : 'English');
    setIsLoadingScenario(false);
    if (result.success && result.evaluation) {
      setScenarioResult(result.evaluation);
      setIsScenarioDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: t('toast.error.title'),
        description: result.error || t('toast.error.scenarioFailed'),
      });
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <Button onClick={handleExplain} disabled={isLoadingExplanation} className="mt-2 w-full">
          <WandSparkles className="mr-2 h-4 w-4" />
          {isLoadingExplanation ? t('ai.explainer.loading') : `${t('ai.explainer.button')} "${objectName}"`}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid w-full gap-2">
           <Label htmlFor="hypothetical-scenario">{t('ai.hypothetical.label')}</Label>
          <Textarea 
            id="hypothetical-scenario"
            placeholder={t('ai.hypothetical.placeholder')} 
            value={hypothetical}
            onChange={(e) => setHypothetical(e.target.value)}
            disabled={isLoadingScenario}
          />
          <Button onClick={handleScenario} disabled={isLoadingScenario}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            {isLoadingScenario ? t('ai.hypothetical.loading') : t('ai.hypothetical.button')}
          </Button>
        </div>
      </div>

      <AlertDialog open={isExplanationDialogOpen} onOpenChange={setIsExplanationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('ai.explainer.dialogTitle')} {objectName}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="prose prose-invert text-foreground max-h-[60vh] overflow-y-auto">
               {explanation}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsExplanationDialogOpen(false)}>{t('common.close')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isScenarioDialogOpen} onOpenChange={setIsScenarioDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('ai.hypothetical.dialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="prose prose-invert text-foreground max-h-[60vh] overflow-y-auto">
                {scenarioResult}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsScenarioDialogOpen(false)}>{t('common.close')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
