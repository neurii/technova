import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req) {
  const { jobDescription } = await req.json();

  const prompt = `
  You are a mock interview assistant. Based on the following job description, generate technical, behavioral, and situational interview questions. Provide example answers for each question.

  Job description: ${jobDescription}

  Please output the questions and answers in this JSON format:
  {
    "technical": [
      {"question": "Technical question 1", "answer": "Answer 1"},
      {"question": "Technical question 2", "answer": "Answer 2"},
      {"question": "Technical question 3", "answer": "Answer 3"}
    ],
    "behavioral": [
      {"question": "Behavioral question 1", "answer": "Answer 1"},
      {"question": "Behavioral question 2", "answer": "Answer 2"},
      {"question": "Behavioral question 3", "answer": "Answer 3"}
    ],
    "situational": [
      {"question": "Situational question 1", "answer": "Answer 1"},
      {"question": "Situational question 2", "answer": "Answer 2"},
      {"question": "Situational question 3", "answer": "Answer 3"}
    ]
  }
  `;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: jobDescription },
      ],
    });

    // Parse the response correctly
    const questions = JSON.parse(response.choices[0].message.content);

    // Ensure output has the three categories
    if (!questions.technical || !questions.behavioral || !questions.situational) {
      throw new Error('Response does not contain all three categories.');
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error generating questions: ', error);
    return NextResponse.json({ error: 'An error occurred while generating your questions' });
  }
}
