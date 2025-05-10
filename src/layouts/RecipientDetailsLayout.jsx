import styled from 'styled-components';

export const RecipientDetailsLayout = ({ title, children }) => {
  return (
    <LayoutContainer>
      <TitleContainer>{title}</TitleContainer>
      <ContentContainer>{children}</ContentContainer>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  width: 100%;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #F5F5F5;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #242331;
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;