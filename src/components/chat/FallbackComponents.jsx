import React from 'react';
import styled from 'styled-components';

export const FallbackChatSidebar = () => {
  return (
    <SidebarContainer>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Chat Sessions</h3>
        <p>Unable to load chat sessions</p>
      </div>
    </SidebarContainer>
  );
};

export const FallbackChatWindow = () => {
  return (
    <WindowContainer>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h3>Chat Window</h3>
        <p>Unable to load the chat window</p>
        <p>Please try refreshing the page</p>
      </div>
    </WindowContainer>
  );
};

const SidebarContainer = styled.div`
  width: 320px;
  border-right: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 40%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const WindowContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`; 