const PreferencesForm = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  return (
    <div>
      <h2>Cover Letter Preferences</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Tone:</label>
        <select
          value={data.tone || 'professional'}
          onChange={(e) => handleChange('tone', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        >
          <option value="professional">Professional</option>
          <option value="conversational">Conversational</option>
          <option value="enthusiastic">Enthusiastic</option>
          <option value="formal">Formal</option>
        </select>
      </div>



      <div style={{ marginBottom: '15px' }}>
        <label>Primary Emphasis:</label>
        <select
          value={data.emphasis || 'experience'}
          onChange={(e) => handleChange('emphasis', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        >
          <option value="experience">Work Experience</option>
          <option value="skills">Technical Skills</option>
          <option value="education">Education</option>
          <option value="achievements">Achievements</option>
          <option value="passion">Passion & Motivation</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Approach:</label>
        <select
          value={data.approach || 'traditional'}
          onChange={(e) => handleChange('approach', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        >
          <option value="traditional">Traditional</option>
          <option value="creative">Creative</option>
          <option value="storytelling">Storytelling</option>
          <option value="problem-solution">Problem-Solution</option>
        </select>
      </div>
    </div>
  );
};

export default PreferencesForm;