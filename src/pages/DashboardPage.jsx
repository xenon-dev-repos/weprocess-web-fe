import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Chart } from 'chart.js/auto';
import InstructionsTable from '../components/InstructionsTable';
import { instructionsTableData, statusData, monthlyInstructionsData } from '../constants/mockData';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoCircle = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  color: var(--primary-color);
  font-weight: bold;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.a`
  padding: 0.5rem 1rem;
  ${props => props.active && `
    background-color: #e2e8f0;
    color: var(--primary-color);
    border-radius: 0.25rem;
  `}
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Icon = styled.span`
  cursor: pointer;
`;

const UserAvatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  background-color: var(--primary-color);
  color: white;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
`;

const NewButton = styled.button`
  background-color: #eab308;
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StatCard = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatNumber = styled.span`
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
`;

const StatSubtext = styled.span`
  font-size: 0.875rem;
  color: ${props => props.color || '#9ca3af'};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ChartContainer = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 1.5rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const Select = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.25rem;
  color: #4b5563;
`;

const SubTitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  text-align: left;
`;

const TableHead = styled.thead`
  & tr {
    font-size: 0.875rem;
    color: #4b5563;
  }
`;

const TableCell = styled.td`
  padding: 0.5rem;
`;

const TableHeaderCell = styled.th`
  padding: 0.5rem;
`;

const TableRow = styled.tr`
  border-top: 1px solid #e5e7eb;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  ${props => {
    switch (props.status) {
      case '1st attempt':
        return 'background-color: #dcfce7; color: #166534;';
      case '2nd attempt':
        return 'background-color: #fef3c7; color: #92400e;';
      case '3rd attempt':
        return 'background-color: #fee2e2; color: #b91c1c;';
      case 'In Transit':
        return 'background-color: #dbeafe; color: #1e40af;';
      default:
        return 'background-color: #e5e7eb; color: #374151;';
    }
  }}
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const PaginationInfo = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
`;

const PaginationControls = styled.div`
  display: flex;
  items-align: center;
  gap: 0.5rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: ${props => props.active ? '#e5e7eb' : 'transparent'};
`;

const DashboardPage = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  
  useEffect(() => {
    // Bar Chart
    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext('2d');
      
      // Destroy existing chart if it exists
      if (barChartRef.current.chart) {
        barChartRef.current.chart.destroy();
      }
      
      barChartRef.current.chart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March'],
          datasets: [
            {
              label: 'New requests',
              data: [
                monthlyInstructionsData.january.newRequests,
                monthlyInstructionsData.february.newRequests,
                monthlyInstructionsData.march.newRequests
              ],
              backgroundColor: '#000',
            },
            {
              label: 'In progress',
              data: [
                monthlyInstructionsData.january.inProgress,
                monthlyInstructionsData.february.inProgress,
                monthlyInstructionsData.march.inProgress
              ],
              backgroundColor: '#FF5B5B',
            },
            {
              label: 'Completed',
              data: [
                monthlyInstructionsData.january.completed,
                monthlyInstructionsData.february.completed,
                monthlyInstructionsData.march.completed
              ],
              backgroundColor: '#E6E6FA',
            },
          ],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { position: 'top' } },
        },
      });
    }
    
    // Pie Chart
    if (pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext('2d');
      
      // Destroy existing chart if it exists
      if (pieChartRef.current.chart) {
        pieChartRef.current.chart.destroy();
      }
      
      pieChartRef.current.chart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['On Hold', 'In Progress', 'Completed'],
          datasets: [{
            data: [statusData.onHold, statusData.inProgress, statusData.completed],
            backgroundColor: ['#6B7280', '#FF5B5B', '#8B5CF6'],
          }],
        },
        options: {
          plugins: { legend: { position: 'right' } },
        },
      });
    }
    
    // Cleanup on component unmount
    return () => {
      if (barChartRef.current?.chart) {
        barChartRef.current.chart.destroy();
      }
      if (pieChartRef.current?.chart) {
        pieChartRef.current.chart.destroy();
      }
    };
  }, []);
  
  return (
    <DashboardContainer>
      <Header>
        <Logo>
          <LogoCircle>
            <LogoText>WP</LogoText>
          </LogoCircle>
          <span>WeProcess</span>
        </Logo>
        <Navigation>
          <NavLink href="#" active={true}>Dashboard</NavLink>
        </Navigation>
        <UserActions>
          <Icon>🔍</Icon>
          <Icon>🔔</Icon>
          <Icon>✉️</Icon>
          <UserAvatar src="https://via.placeholder.com/40" alt="User" />
        </UserActions>
      </Header>
      
      <MainContent>
        <DashboardHeader>
          <Title>Good Morning, Andrew!</Title>
          <NewButton>
            <span>+</span> New Instruction
          </NewButton>
        </DashboardHeader>
        
        <StatsGrid>
          <StatCard>
            <StatTitle>Total Instructions</StatTitle>
            <StatValue>
              <StatNumber>250</StatNumber>
              <StatSubtext>27 this month</StatSubtext>
            </StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Instructions in Progress</StatTitle>
            <StatValue>
              <StatNumber>7</StatNumber>
              <StatSubtext color="#FF5B5B">4 urgent</StatSubtext>
            </StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Instructions Completed</StatTitle>
            <StatValue>
              <StatNumber>50</StatNumber>
              <StatSubtext color="#FF5B5B">5 with pending invoices</StatSubtext>
            </StatValue>
          </StatCard>
          
          <StatCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatTitle>Instructions requested by firm</StatTitle>
              <Select>
                <option>Quantity</option>
              </Select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563' }}>
              <StatNumber>{monthlyInstructionsData.january.newRequests}</StatNumber>
              <StatNumber>{monthlyInstructionsData.february.newRequests}</StatNumber>
              <StatNumber>{monthlyInstructionsData.march.newRequests}</StatNumber>
            </div>
          </StatCard>
        </StatsGrid>
        
        <ContentGrid>
          <InstructionsTable data={instructionsTableData} />
          
          <StatCard>
            <ChartHeader>
              <ChartTitle>Instructions status</ChartTitle>
              <Select>
                <option>Weekly</option>
              </Select>
            </ChartHeader>
            <SubTitle>Monthly instructions requested by firm</SubTitle>
            <canvas ref={pieChartRef} height="180"></canvas>
          </StatCard>
        </ContentGrid>
        
        <ChartContainer>
          <ChartTitle>Instructions requested by firm</ChartTitle>
          <canvas ref={barChartRef} height="250"></canvas>
        </ChartContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardPage;
