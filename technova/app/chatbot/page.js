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
    <Box p={5} sx={{ backgroundColor: '#f9e7e3', color: '#4b2e2e', fontFamily: '"Times New Roman", Times, serif' }}>
      <Typography 
        variant="h2"
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          fontFamily: '"Times New Roman", Times, serif', 
          fontWeight: 'bold',
          color: '#41281D'
        }}>
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
          sx={{
            fontFamily: '"Times New Roman", Times, serif',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#e65e7e'
              },
              '&:hover fieldset': {
                borderColor: '#cf222e',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#cf222e',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'gray',
              fontFamily: '"Times New Roman", Times, serif',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#cf222e',
            }
          }}
        />
        <Button
          variant="contained"
          onClick={generateQuestions}
          disabled={loading || !jobDescription}
          sx={{
            backgroundColor: '#e0a6a4',
            color: '#f7f7f7',
            fontFamily: '"Times New Roman", Times, serif',
            '&:hover': {
              backgroundColor: '#d88c91',
            }
          }}
        >
          {loading ? 'Generating Questions...' : 'Generate Interview Questions'}
        </Button>
      </Stack>

      {['technical', 'behavioral', 'situational'].map((category) => (
        <Box 
          mt={5} 
          key={category} 
          sx={{ 
            border: '1px solid #e65e7e',
            borderRadius: '10px', 
            padding: '20px', 
            backgroundColor: '#f7f7f7',
            fontFamily: '"Times New Roman", Times, serif'
          }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#4b2e2e', fontFamily: '"Times New Roman", Times, serif' }}>
            {category.charAt(0).toUpperCase() + category.slice(1)} Questions
          </Typography>
          {questions[category].length === 0 && (
            <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', color: '#4b2e2e' }}>
              No questions generated yet.
            </Typography>
          )}
          {questions[category].map((question, index) => (
            <Accordion key={index} sx={{ fontFamily: '"Times New Roman", Times, serif' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', color: '#4b2e2e' }}>
                  {question.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ fontFamily: '"Times New Roman", Times, serif', color: '#4b2e2e' }}>
                <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', color: '#4b2e2e' }}>
                  {question.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}
    </Box>
  );
}
