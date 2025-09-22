const PersonalInfoForm = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  return (
    <div>
      <h2>Personal Information</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Full Name:</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="Your full name"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="your.email@example.com"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Phone:</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="(555) 123-4567"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Address:</label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => handleChange('address', e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="City, State"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;