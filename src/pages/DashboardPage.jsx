import React from 'react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Chart } from 'chart.js/auto';
import { MainLayout } from '../layouts/MainLayout';
import { StatCard } from '../components/dashboard/StatCard';
import InstructionsTable from '../components/InstructionsTable';
import { instructionsTableData, statusMockData, InstructionsMockData } from '../constants/mockData';

const DashboardPage = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [filteredData, setFilteredData] = useState(instructionsTableData);

  const handleTabChange = (tabId) => {
    let filtered = [];
    switch(tabId) {
      case 'new-requests':
        filtered = instructionsTableData.filter(item => item.status === '1st attempt');
        break;
      case 'in-progress':
        filtered = instructionsTableData.filter(item => 
          ['1st attempt', '2nd attempt', '3rd attempt', 'In Transit'].includes(item.status)
        );
        break;
      case 'completed':
        filtered = instructionsTableData.filter(item => item.status === 'Completed');
        break;
      case 'invoices':
        filtered = instructionsTableData.filter(item => item.type === 'Urgent');
        break;
      default:
        filtered = instructionsTableData;
    }
    setFilteredData(filtered);
  };
  
  useEffect(() => {
    let pieChartInstance = null;
    let barChartInstance = null;

    if (pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext('2d');
      
      pieChartInstance = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['On Hold', 'In Progress', 'Completed'],
          datasets: [{
            data: [statusMockData.onHold, statusMockData.inProgress, statusMockData.completed],
            backgroundColor: ['#6B7280', '#FF5B5B', '#8B5CF6'],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { 
              position: 'right',
              labels: {
                boxWidth: 12,
                padding: 10
              }
            } 
          },
        },
      });
    }

    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext('2d');
      
      barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March'],
          datasets: [
            {
              label: 'Total requests',
              data: [
                InstructionsMockData.january.totalRequests,
                InstructionsMockData.february.totalRequests,
                InstructionsMockData.march.totalRequests
              ],
              backgroundColor: '#000',
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { position: 'top' } },
        },
      });
    }
    
    return () => {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
      if (barChartInstance) {
        barChartInstance.destroy();
      }
    };
  }, []);

  return (
    <MainLayout isDashboardPage={true}>
      <DashboardContainer>
        <MainContent>
          <LeftColumn>
            <StatsGrid>
              <StatCard 
                title="Total Instructions"
                subtitle="Count of the instructions created"
                value="250"
                subtext="27 this month"
                subtextColor="#0F800A"
                subtextBg="#DEFFE4"
              />
              
              <StatCard 
                title="Instructions in Progress"
                subtitle="Total count of in progress instructions"
                value="7"
                subtext="4 urgent"
                subtextColor="#B71C1C"
                subtextBg="#FFEAEA"
              />
              
              <StatCard 
                title="Instructions Completed"
                subtitle="Instructions completed this month"
                value="50"
                subtext="5 pending invoices"
                subtextColor="#B71C1C"
                subtextBg="#FFE5E5"
              />
            </StatsGrid>
            
            <TableContainer>
              <InstructionsTable 
                data={filteredData}
                title="Instructions In Progress"
                subtitle="Monthly instructions requested by firm"
                tabs={[
                  { id: 'new-requests', label: 'New requests' },
                  { id: 'in-progress', label: 'In progress' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'invoices', label: 'Invoices' }
                ]}
                columns={[
                  { key: 'wpr', header: 'WPR no.' },
                  { key: 'owner', header: 'Owner' },
                  { key: 'serve', header: 'Serve name' },
                  { key: 'court', header: 'Court name' },
                  { key: 'type', header: 'Service type' },
                  { key: 'deadline', header: 'Deadline' },
                  { key: 'status', header: 'Process status' },
                ]}
                onTabChange={handleTabChange}
                renderCell={(key, value) => {
                  if (key === 'status') {
                    return <StatusBadge $status={value}>{value}</StatusBadge>;
                  }
                  return value;
                }}
                minHeight={348}
                noDataCellHeight={309}
              />
            </TableContainer>
          </LeftColumn>

          <RightColumn>
            <ChartCard>
              <ChartHeader>
                <ChartTitle>Instructions requested</ChartTitle>
                <Select>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annually</option>
                </Select>
              </ChartHeader>
              <SubTitle>Monthly instructions requested by firm</SubTitle>
              <ChartCanvasWrapper>
                <canvas ref={barChartRef} height="180"></canvas>
              </ChartCanvasWrapper>
            </ChartCard>

            <ChartCard>
              <ChartHeader>
                <ChartTitle>Instructions status</ChartTitle>
                <Select>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annually</option>
                </Select>
              </ChartHeader>
              <SubTitle>Monthly instructions requested by firm</SubTitle>
              <ChartCanvasWrapper>
                <canvas ref={pieChartRef} height="180"></canvas>
              </ChartCanvasWrapper>
            </ChartCard>
          </RightColumn>
        </MainContent>
      </DashboardContainer>
    </MainLayout>
  );
};

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1728px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 1280px) {
    flex-direction: row;
  }
  
  @media (max-width: 1280px) {
  gap: 24px;
}
`;

const LeftColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 1280px) {
    width: 400px;
    min-width: 400px;
    margin-left: 24px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  width: 100%;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
`;

const ChartCanvasWrapper = styled.div`
  height: 214px;
  position: relative;
  width: 100%;
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;

const ChartCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const Select = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  color: #4b5563;
  background-color: white;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  
  ${props => {
    switch (props.$status) {
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


export default DashboardPage;
