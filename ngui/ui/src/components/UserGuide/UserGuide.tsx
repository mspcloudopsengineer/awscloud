import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { FormattedMessage } from "react-intl";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface GuideStep {
  title: string;
  description: string;
}

interface UserGuideProps {
  faqItems?: FAQItem[];
  guideSteps?: GuideStep[];
  dataSourceCount?: number;
  organizationId?: string;
  organizationName?: string;
}

const defaultFaqItems: FAQItem[] = [
  {
    question: "How do I connect a cloud data source?",
    answer: "Navigate to Data Sources and click Connect. Follow the wizard to add AWS, Azure, GCP, or other providers.",
    category: "Getting Started",
  },
  {
    question: "How are costs calculated?",
    answer: "Costs are imported from your cloud provider billing data and processed daily.",
    category: "Billing",
  },
];

const defaultGuideSteps: GuideStep[] = [
  { title: "Connect a data source", description: "Add your first cloud account to start importing cost data." },
  { title: "Review your expenses", description: "Check the Expenses page to see your cloud spending breakdown." },
  { title: "Set up pools and budgets", description: "Organize resources into pools and set budget limits." },
];
export const UserGuide: React.FC<UserGuideProps> = ({
  faqItems = defaultFaqItems,
  guideSteps = defaultGuideSteps,
  dataSourceCount = 0,
  organizationName,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaq = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <FormattedMessage id="userGuide.gettingStarted" defaultMessage="Getting Started" />
          </Typography>
          {organizationName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <FormattedMessage
                id="userGuide.welcome"
                defaultMessage="Welcome to {org}. You have {count} data source(s) connected."
                values={{ org: organizationName, count: dataSourceCount }}
              />
            </Typography>
          )}
          <Stepper activeStep={activeStep} orientation="vertical">
            {guideSteps.map((step, index) => (
              <Step key={step.title} completed={index < activeStep}>
                <StepLabel>{step.title}</StepLabel>
                <StepContent>
                  <Typography variant="body2">{step.description}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Button size="small" variant="contained" onClick={() => setActiveStep(index + 1)} sx={{ mr: 1 }}>
                      <FormattedMessage id="userGuide.next" defaultMessage="Next" />
                    </Button>
                    {index > 0 && (
                      <Button size="small" onClick={() => setActiveStep(index - 1)}>
                        <FormattedMessage id="userGuide.back" defaultMessage="Back" />
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <FormattedMessage id="userGuide.faq" defaultMessage="Frequently Asked Questions" />
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {filteredFaq.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              <FormattedMessage id="userGuide.noResults" defaultMessage="No matching questions found." />
            </Typography>
          ) : (
            filteredFaq.map((item, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">{item.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserGuide;