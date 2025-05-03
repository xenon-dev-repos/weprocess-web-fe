import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { useToast } from '../services/ToastService';
import { FormGroup, Input, Label, SubmitButton, ErrorMessage } from '../components/shared/FormElements';

const ProfilePage = () => {
  const { user } = useAuth();
  const api = useApi();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    // Load user profile data when component mounts
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await api.getUserProfile();
        
        // Update form with profile data
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          company: profileData.company || '',
        });
      } catch (error) {
        // Toast error is handled by the API service automatically
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [api, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Use the API service to update profile
      await api.updateUserProfile(formData);
      
      // Success toast is handled by the API service automatically
    } catch (error) {
      // Error toast is handled by the API service automatically
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <h1>Your Profile</h1>
        <p>Update your personal information</p>
      </ProfileHeader>

      <ProfileForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Full Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />
          <HelpText>Email address cannot be changed</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Company</Label>
          <Input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </FormGroup>

        <ButtonGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update Profile'}
          </SubmitButton>
          <CancelButton type="button" onClick={() => toast.showInfo('Changes discarded')}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </ProfileForm>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1rem;
  }
`;

const ProfileForm = styled.form`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  background-color: transparent;
  border: 1px solid #ccc;
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
`;

export default ProfilePage; 