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
                  $height="56px"
                />
              </PhoneInputContainer>
            ) : field.type === 'date' ? (
              <Input
                type={field.type || 'text'}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleDateChange(field.name, e.target.value)}
                required={field.required}
                $height="56px"
                min={field.name === 'date_of_next_hearing' ? today : undefined}
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