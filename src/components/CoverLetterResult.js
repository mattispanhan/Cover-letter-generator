import React, { useState, useEffect } from 'react';

const CoverLetterResult = ({ formData }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    generateCoverLetter();
  }, []);

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setCoverLetter(data.coverLetter);
      } else {
        setCoverLetter('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setCoverLetter('Error: Failed to connect to server');
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    alert('Cover letter copied to clipboard!');
  };

  const downloadLetter = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'cover-letter.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isGenerating) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Generating Your Cover Letter...</h2>
        <p>Please wait while we craft your personalized cover letter.</p>
        <div style={{ margin: '20px 0', fontSize: '24px' }}>⏳</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Generated Cover Letter</h2>
      
      <div style={{ 
        border: '1px solid #ccc', 
        padding: '20px', 
        marginBottom: '20px',
        backgroundColor: '#f9f9f9',
        whiteSpace: 'pre-wrap',
        fontFamily: 'serif'
      }}>
        {coverLetter}
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={copyToClipboard}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Copy to Clipboard
        </button>
        <button 
          onClick={downloadLetter}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default CoverLetterResult;