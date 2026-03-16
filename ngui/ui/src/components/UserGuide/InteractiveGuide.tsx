import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepContent, Button, LinearProgress, Chip } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { GuideStep } from './useUserGuide';

interface InteractiveGuideProps {
  steps: GuideStep[];
  currentStep: number;
  progress: number;
  onComplete: (id: string) => void;
  onStepChange: (step: number) => void;
  onReset: () => void;
}

export const InteractiveGuide: React.FC<InteractiveGuideProps> = ({
  steps, currentStep, progress, onComplete, onStepChange, onReset,
}) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Typography variant="subtitle1">新手引导</Typography>
      <Chip label={`${progress}%`} size="small" color={progress === 100 ? 'success' : 'primary'} />
      {progress === 100 && <Button size="small" onClick={onReset}>重新开始</Button>}
    </Box>
    <LinearProgress variant="determinate" value={progress} sx={{ mb: 2, borderRadius: 1 }} />
    <Stepper activeStep={currentStep} orientation="vertical">
      {steps.map((step, index) => (
        <Step key={step.id} completed={step.completed}>
          <StepLabel
            icon={step.completed ? <CheckCircle color="success" /> : <RadioButtonUnchecked />}
            onClick={() => onStepChange(index)}
            sx={{ cursor: 'pointer' }}
          >
            {step.title}
          </StepLabel>
          <StepContent>
            <Typography variant="body2" sx={{ mb: 1 }}>{step.description}</Typography>
            {!step.completed && (
              <Button size="small" variant="contained" onClick={() => { onComplete(step.id); onStepChange(index + 1); }}>
                标记完成
              </Button>
            )}
          </StepContent>
        </Step>
      ))}
    </Stepper>
  </Box>
);

export default InteractiveGuide;
