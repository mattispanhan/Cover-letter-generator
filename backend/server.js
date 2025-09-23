const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const serverless = require('serverless-http');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Hugging Face client
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working on Vercel!' });
});

app.post('/api/generate-cover-letter', async (req, res) => {
  try {
    const { personalInfo, receiverInfo, jobDescription, resume, preferences, answers } = req.body;

    const prompt = createPrompt(personalInfo, receiverInfo, jobDescription, resume, preferences, answers);
    const coverLetter = await generateWithHuggingFace(prompt);

    res.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ success: false, error: 'Failed to generate cover letter' });
  }
});

// Prompt creator
function createPrompt(personalInfo, receiverInfo, jobDescription, resume, preferences, answers) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `You are an assistant specialized in writing professional cover letters. Follow the instructions carefully and always respect the formal structure. Use the variables provided by the user to generate a polished and tailored cover letter.

PERSONAL INFO:
Name: ${personalInfo.name}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}

RECIPIENT INFO:
Addressing to: ${receiverInfo.name || 'Not provided'} ${receiverInfo.title || 'Not provided'}
Company: ${receiverInfo.company || 'Not provided'}
Company Address: ${receiverInfo.address || 'Not provided'}

JOB DESCRIPTION:
Title: ${jobDescription.title}
Source: ${jobDescription.source}
Description: ${jobDescription.description}

RESUME/BACKGROUND:
${resume}

PREFERENCES:
- Tone: ${preferences.tone || 'professional'}
- Emphasis: ${preferences.emphasis || 'experience'}

ANSWERS TO QUESTIONS:
- Motivation: ${answers.motivation || ''}
- Relevant Experience: ${answers.relevant_experience || ''}
- Unique Value: ${answers.unique_value || ''}
- Challenges: ${answers.challenges || ''}
- Career Growth: ${answers.growth || ''}

Instructions to Follow:

HEADER & FORMATTING
1- Sender's address: Use ${personalInfo.address} on two lines. Do not include the sender's name here.
2- Date: Write this exact date: ${currentDate}
3- Recipient's address: Use ${receiverInfo.name}, ${receiverInfo.title}, ${receiverInfo.company}, and ${receiverInfo.address} (max 6 lines).
4- Salutation:
   - If ${receiverInfo.name} exists → “Dear Ms./Mr. ${receiverInfo.name},”
   - Else if ${receiverInfo.title} exists → “To ${receiverInfo.title}, ”
   - Otherwise → “To whom it may concern,”

INTRO PARAGRAPH
- Begin with the phrase: “I am writing...”
- State the purpose of the letter: applying for ${jobDescription.title}.
- Mention the source: ${jobDescription.source}.
- Present strongest qualification from ${resume}.
- Add motivation from ${answers.motivation}.

BODY PARAGRAPH(S)
- Relevant Experience: Use ${answers.relevant_experience}.
- Unique Value: Use ${answers.unique_value}.
- Challenges & Growth: Use ${answers.challenges} and ${answers.growth}.
- Refer to CV if necessary.

FINAL BODY PARAGRAPH
- Motivation + call to action.
- Provide contact details: ${personalInfo.phone}, ${personalInfo.email}.
- Close with gratitude.

CLOSING
- End with: “Sincerely,”
- Leave space for signature.
- Print full name: ${personalInfo.name}`;
}

// Hugging Face API call
async function generateWithHuggingFace(prompt) {
  try {
    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.2-3B-Instruct",
      messages: [
        {
          role: "system",
          content: "You are an assistant specialized in writing professional cover letters."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw new Error('Failed to generate cover letter with AI');
  }
}

//function for Vercel
module.exports = app;
module.exports.handler = serverless(app);
