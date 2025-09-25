export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { personalInfo, receiverInfo, jobDescription, resume, preferences, answers } = req.body;

    // Create prompt
    const prompt = createPrompt(personalInfo, receiverInfo, jobDescription, resume, preferences, answers);

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
}

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
 
   - If ${receiverInfo.name} exists → "Dear Ms./Mr. ${receiverInfo.name},"

   - Else if ${receiverInfo.title} exists → "To ${receiverInfo.title},"

   - Otherwise → "To whom it may concern,"

INTRO PARAGRAPH
- Begin with the phrase: "I am writing..."

- State the purpose of the letter: applying for ${jobDescription.title}.

- Mention the source: ${jobDescription.source} (e.g., "I became aware of the opening through…").

- Present strongest qualification: from ${resume} (e.g., "I will be graduating with a degree in…").

- Add motivation from ${answers.motivation}.

BODY PARAGRAPH(S)
- Organize clearly into 1-3 paragraphs:

- Relevant Experience: Highlight strongest elements from ${resume} and ${answers.relevant_experience}, making connections with the job ad. Use correct past tenses (have worked, have gained, have improved, etc.).

- Unique Value: Use ${answers.unique_value} to show what sets the candidate apart.

- Challenges & Growth: If ${answers.challenges} or ${answers.growth} are provided, integrate them naturally to demonstrate resilience and ambition.

- Refer to CV if necessary: "You will see in my CV that I have…"

FINAL BODY PARAGRAPH
- Add a last note of motivation (optional but encouraged).

- Make a call to action: request an interview/phone conversation.

- Provide contact details: include ${personalInfo.phone} and ${personalInfo.email}.

- Close with gratitude: "Thank you for your time and consideration."

CLOSING
- End with: "Sincerely,"

- Leave space for signature.

- Print full name: ${personalInfo.name}

This should guarantee a standing out and professional cover letter.

EXAMPLE VARIABLE USAGE
- ${personalInfo.name} → Daniel A. Stevens

- ${personalInfo.email} → daniel.stevens@email.com

- ${personalInfo.phone} → (330) 672-2360

- ${personalInfo.address} → 138 Water Street, Kent, Ohio 44240

- ${receiverInfo} → Ms. Anne E. Little, Director of Athletics, Winston-Salem State University, etc.

- ${jobDescription} → Assistant Athletic Director for Sports Information, source = “university career   center”

- ${resume} → List of experiences and skills from the CV

- ${answers} → Motivation, relevant experience, unique value, challenges, growth`;
}

// Hugging Face API call
async function generateWithHuggingFace(prompt) {
  try {
    const response = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a professional cover letter writing assistant. Generate polished, formal cover letters following the exact format and structure provided in the user's instructions."
            },
            
            {
              role: "user",
              content: prompt
            }
          ],
          model: "openai/gpt-oss-20b:nebius",
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Error generating cover letter';
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw new Error('Failed to generate cover letter with AI');
  }
}
