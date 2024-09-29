'use client';

import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function InterviewAssistant() {
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState({
    technical: [],
    behavioral: [],
    situational: []
  });
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setQuestions(data);
      setJobDescription(''); // Clear input after submission
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('An error occurred while generating questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} sx={{ backgroundColor: 'white', color: 'black' }}>
      <Typography variant="h4" gutterBottom>
        Mock Interview Assistant
      </Typography>
      <Stack spacing={3}>
        <TextField
          label="Paste Job Description"
          multiline
          rows={6}
          variant="outlined"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={generateQuestions}
          disabled={loading || !jobDescription}
        >
          {loading ? 'Generating Questions...' : 'Generate Interview Questions'}
        </Button>
      </Stack>

      {['technical', 'behavioral', 'situational'].map((category) => (
        <Box mt={5} key={category}>
          <Typography variant="h5" gutterBottom>
            {category.charAt(0).toUpperCase() + category.slice(1)} Questions
          </Typography>
          {questions[category].length === 0 && <Typography>No questions generated yet.</Typography>}
          {questions[category].map((question, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{question.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{question.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}
    </Box>
  );
}
