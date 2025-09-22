const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();

// Initialize Hugging Face client
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to call backend
app.use(express.json()); // Parse JSON requests

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Generate cover letter endpoint
app.post('/api/generate-cover-letter', async (req, res) => {
  try {
    const { personalInfo, receiverInfo, jobDescription, resume, preferences, answers,} = req.body;

    // Create prompt for AI
    const prompt = createPrompt(personalInfo, receiverInfo, jobDescription, resume, preferences, answers,);

    // Call Hugging Face API
    const coverLetter = await generateWithHuggingFace(prompt);
    
    res.json({ 
      success: true, 
      coverLetter: coverLetter 
    });

  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate cover letter' 
    });
  }
});

function createPrompt(personalInfo, receiverInfo, jobDescription, resume, preferences, answers,) {

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

3- Recipient's address: Use ${receiverInfo.name}, ${receiverInfo.title}, ${receiverInfo.company}, and      ${receiverInfo.address} (max 6 lines).

4- Salutation:
 
   - If ${receiverInfo.name} exists → “Dear Ms./Mr. ${receiverInfo.name},”

   - Else if ${receiverInfo.title} exists → “To ${receiverInfo.title},”

   - Otherwise → “To whom it may concern,”

INTRO PARAGRAPH
- Begin with the phrase: “I am writing...”

- State the purpose of the letter: applying for ${jobDescription.title}.

- Mention the source: ${jobDescription.source} (e.g., “I became aware of the opening through…”).

- Present strongest qualification: from ${resume} (e.g., “I will be graduating with a degree in…”).

- Add motivation from ${answers.motivation}.

BODY PARAGRAPH(S)
- Organize clearly into 1-3 paragraphs:

- Relevant Experience: Highlight strongest elements from ${resume} and ${answers.relevant_experience},   making connections with the job ad. Use correct past tenses (have worked, have gained, have improved,   etc.).

- Unique Value: Use ${answers.unique_value} to show what sets the candidate apart.

- Challenges & Growth: If ${answers.challenges} or ${answers.growth} are provided, integrate them   naturally to demonstrate resilience and ambition.

- Refer to CV if necessary: “You will see in my CV that I have…”

FINAL BODY PARAGRAPH
- Add a last note of motivation (optional but encouraged).

- Make a call to action: request an interview/phone conversation.

- Provide contact details: include ${personalInfo.phone} and ${personalInfo.email}.

- Close with gratitude: “Thank you for your time and consideration.”

CLOSING
- End with: “Sincerely,”

- Leave space for signature.

- Print full name: ${personalInfo.name}

EXAMPLE VARIABLE USAGE
- ${personalInfo.name} → Daniel A. Stevens

- ${personalInfo.email} → daniel.stevens@email.com

- ${personalInfo.phone} → (330) 672-2360

- ${personalInfo.address} → 138 Water Street, Kent, Ohio 44240

- ${receiverInfo} → Ms. Anne E. Little, Director of Athletics, Winston-Salem State University, etc.

- ${jobDescription} → Assistant Athletic Director for Sports Information, source = “university career   center”

- ${resume} → List of experiences and skills from the CV

- ${answers} → Motivation, relevant experience, unique value, challenges, growth

This should guarantee a standing out and professional cover letter.`;
}

// Hugging Face API call using OpenAI format
async function generateWithHuggingFace(prompt) {
  try {
    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.2-3B-Instruct",
      messages: [
        {
          role: "system",
          content: "You are an assistant specialized in writing professional cover letters. Follow the instructions carefully and always respect the formal structure. Use the variables provided by the user to generate a polished and tailored cover letter."
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;