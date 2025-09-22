import { useState } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import ReceiverInfoForm from './ReceiverInfoForm';
import JobDetailsForm from './JobDetailsForm';
import PreferencesForm from './PreferencesForm';
import QuestionsForm from './QuestionsForm';
import CoverLetterResult from './CoverLetterResult';

const StepWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    receiverInfo: {
      name: '',
      title: '',
      company: '',
      address: ''
    },
    jobDescription: {
      title: '',
      source: '',
      description: ''
    },
    resume: '', 
    preferences: {},
    answers: {}
  });

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <PersonalInfoForm 
            data={formData.personalInfo}
            updateData={(data) => updateFormData('personalInfo', data)}
          />
        );
      case 2:
        return (
          <ReceiverInfoForm 
            data={formData.receiverInfo}
            updateData={(data) => updateFormData('receiverInfo', data)}
          />
        );
      case 3:
        return (
          <JobDetailsForm 
            jobDescription={formData.jobDescription}
            resume={formData.resume}
            updateJobDescription={(data) => updateFormData('jobDescription', data)}
            updateResume={(data) => updateFormData('resume', data)}
          />
        );
      case 4:
        return (
          <PreferencesForm 
            data={formData.preferences}
            updateData={(data) => updateFormData('preferences', data)}
          />
        );
      case 5:
        return (
          <QuestionsForm 
            answers={formData.answers}
            updateAnswers={(data) => updateFormData('answers', data)}
          />
        );
      case 6:
        return <CoverLetterResult formData={formData} />;
      default:
        return <div>Step 1</div>;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Cover Letter Generator</h1>
      
      {/* Progress */}
      <div>Step {currentStep} of 6</div>
      
      {/* Content */}
      {renderStep()}
      
      {/* Navigation */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={prevStep} 
          disabled={currentStep === 1}
          style={{ padding: '10px 20px' }}
        >
          Previous
        </button>
        <button 
          onClick={nextStep} 
          disabled={currentStep === 6}
          style={{ padding: '10px 20px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepWizard;