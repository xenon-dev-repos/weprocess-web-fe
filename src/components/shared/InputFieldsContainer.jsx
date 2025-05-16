// InputFieldsContainer.js
import styled from 'styled-components';
import { FormGroup2, Input, Label, PhoneInputContainer, CountryCode, FlagIcon } from './FormElements';

export const InputFieldsContainer = ({ 
    fields = [], 
    formData = {}, 
    handleChange = () => {},
    handleDateChange = () => {}
  }) => {

    const today = new Date().toISOString().split('T')[0];

    // Enhanced date change handler with validation
    const handleDateChangeWithValidation = (fieldName, value) => {
      // First update the field value
      handleDateChange(fieldName, value);
      
      // Additional validation for date relationships
      if (fieldName === 'date_of_submission' && 
          formData.date_of_next_hearing && 
          value > formData.date_of_next_hearing) {
        // Clear next hearing date if it's now invalid
        handleDateChange('date_of_next_hearing', '');
      }
    };

    // Get the min date for date_of_next_hearing
    const getMinDateForNextHearing = () => {
      return formData.date_of_submission || today;
    };

    // Check if date_of_next_hearing should be enabled
    const isNextHearingEnabled = Boolean(formData.date_of_submission);

    return (
      <Container>
        {fields.map((field, index) => (
          <FormGroup2 key={index} >
            <Label>{field.label}</Label>
            {field.type === 'phone' ? (
              <PhoneInputContainer>
                <CountryCode $height={'56px'}>
                  <FlagIcon src={field.flagIcon} alt='Flag'/>
                  <span>{field.countryCode}</span>
                </CountryCode>
                <Input
                  type="tel"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={field.phoneNumber} 
                  onChange={handleChange}
                  required={field.required}
                  ref={field.phoneInputRef}
                  minLength="10"
                  pattern="[\d\s]{10,}" 
                  $height="56px"
                />
              </PhoneInputContainer>
            ) : field.type === 'date' ? (
              <Input
                type={field.type || 'text'}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => {
                  if (['date_of_submission', 'date_of_next_hearing'].includes(field.name)) {
                    handleDateChangeWithValidation(field.name, e.target.value);
                  } else {
                    handleDateChange(field.name, e.target.value);
                  }
                }}
                required={field.required}
                $height="56px"
                min={
                  field.name === 'date_of_next_hearing' 
                    ? getMinDateForNextHearing() 
                    : field.name === 'date_of_submission' 
                      ? today 
                      : undefined
                }
                disabled={field.name === 'date_of_next_hearing' && !isNextHearingEnabled}
              />
            ) : field.type === 'email' ? (
              <Input
                type="email"
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                $height="56px"
                pattern="[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            ) : (
              <Input
                type={field.type || 'text'}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                $height="56px"
                minLength={field.type === 'email' ? 5 : undefined}
                pattern={field.type === 'email' ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" : undefined}
              />
            )}
          </FormGroup2>
        ))}
      </Container>
    );
  };


const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 24px;

  @media (max-width: 1440px) {
    gap: 22px;
  }

  @media (max-width: 1280px) {
    gap: 20px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 18px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;