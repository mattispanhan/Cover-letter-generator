const ReceiverInfoForm = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  return (
    <div>
      <h2>Recipient Information</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Information about who you're addressing this cover letter to:
      </p>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Person you're addressing this to:</label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="e.g., John Smith, Hiring Manager (or leave blank for 'Dear Hiring Manager')"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Position (if available):</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="e.g., Senior HR Manager, Talent Acquisition Specialist"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Company:</label>
        <input
          type="text"
          value={data.company || ''}
          onChange={(e) => handleChange('company', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="Company name"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Company Address:</label>
        <textarea
          value={data.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          style={{ 
            width: '100%', 
            height: '80px', 
            padding: '8px', 
            marginTop: '5px',
            resize: 'vertical'
          }}
          placeholder="Company address (optional)"
        />
      </div>
    </div>
  );
};

export default ReceiverInfoForm;