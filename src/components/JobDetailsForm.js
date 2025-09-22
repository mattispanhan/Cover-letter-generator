const JobDetailsForm = ({ jobDescription, resume, updateJobDescription, updateResume }) => {
  const handleJobChange = (field, value) => {
    updateJobDescription({
      ...jobDescription,
      [field]: value
    });
  };

  const handleResumeChange = (value) => {
    if (value.length > 5000) {
      alert('Resume content is too long. Please summarize key points.');
      return;
    }
    updateResume(value);
  };

  return (
    <div>
      <h2>Job Details & Resume</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Job Title:</label>
        <input
          type="text"
          value={jobDescription.title || ''}
          onChange={(e) => handleJobChange('title', e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginTop: '5px'
          }}
          placeholder="e.g., Software Developer, Marketing Manager"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Where did you find this job?</label>
        <input
          type="text"
          value={jobDescription.source || ''}
          onChange={(e) => handleJobChange('source', e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginTop: '5px'
          }}
          placeholder="e.g., LinkedIn, company website, job fair, referral"
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Job Description:</label>
        <textarea
          value={jobDescription.description || ''}
          onChange={(e) => handleJobChange('description', e.target.value)}
          style={{ 
            width: '100%', 
            height: '150px', 
            padding: '10px', 
            marginTop: '5px',
            resize: 'vertical'
          }}
          placeholder="Paste the job description here..."
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Your Resume:</label>
        <textarea
          value={resume || ''}
          onChange={(e) => updateResume(e.target.value)}
          style={{ 
            width: '100%', 
            height: '150px', 
            padding: '10px', 
            marginTop: '5px',
            resize: 'vertical'
          }}
          placeholder="Paste your resume content here..."
        />
      </div>
    </div>
  );
};

export default JobDetailsForm;