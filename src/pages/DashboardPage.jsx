import React from 'react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Chart } from 'chart.js/auto';
import { MainLayout } from '../layouts/MainLayout';
import { StatCard } from '../components/dashboard/StatCard';
import InstructionsTable from '../components/InstructionsTable';
import { API_ENDPOINTS } from '../constants/api';
import axios from 'axios';
import { useToast } from '../services/ToastService';
import LoadingOnPage from '../components/shared/LoadingOnPage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../hooks/useNavigation';

const DashboardPage = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    total_serves_count: 0,
    current_month_serves_count: 0,
    urgent_serves_count: 0,
    status_data: {
      on_hold: 0,
      in_progress: 0,
      completed: 0
    },
    monthly_data: {
      january: { totalRequests: 0 },
      february: { totalRequests: 0 },
      march: { totalRequests: 0 },
      april: { totalRequests: 0 },
      may: { totalRequests: 0 }
    },
    pending_invoices_count: 0
  });
  const { showError } = useToast();
  const { user, getServes } = useAuth();
  const navigation = useNavigation();

  const handleTabChange = async (tabId) => {
    try {
      let status = '';
      switch(tabId) {
        case 'new-requests':
          status = 'pending';
          break;
        case 'in-progress':
          status = 'active';
          break;
        case 'completed':
          status = 'completed';
          break;
        default:
          status = '';
      }
      await fetchServes(status);
    } catch (error) {
      console.error('Error handling tab change:', error);
      showError('Failed to filter instructions');
    }
  };

  const fetchServes = async (status = '') => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        console.error('User ID not found');
        return;
      }

      const params = {
        client_id: user.id,
        ...(status && { status: status })
      };

      const response = await getServes(params);
      
      if (response.success) {
        const mappedData = response.serves.data.map(serve => ({
          wpr: serve.id,
          owner: serve.applicant_name || serve.client_id || 'N/A',
          serve: serve.title,
          type: serve.priority ? serve.priority.charAt(0).toUpperCase() + serve.priority.slice(1) : 'N/A',
          court: serve.issuing_court,
          deadline: serve.deadline,
          status: serve.status,
        }));
        setFilteredData(mappedData);
      } else {
        console.error(response.message || 'Failed to fetch serves');
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching serves:', error);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(API_ENDPOINTS.DASHBOARD, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchServes(); // Fetch initial serves data
  }, [user?.id]);

  useEffect(() => {
    let pieChartInstance = null;
    let barChartInstance = null;

    if (pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext('2d');
      const pieData = [
        dashboardData.status_data.on_hold,
        dashboardData.status_data.in_progress,
        dashboardData.status_data.completed
      ];
      
      // Check if there's any data
      const hasPieData = pieData.some(value => value > 0);
      
      if (!hasPieData) {
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = pieCtx.canvas.getBoundingClientRect();
        
        // Set the canvas size accounting for device pixel ratio
        pieCtx.canvas.width = rect.width * dpr;
        pieCtx.canvas.height = rect.height * dpr;
        
        // Scale the context to ensure correct drawing
        pieCtx.scale(dpr, dpr);
        
        // Set canvas CSS size
        pieCtx.canvas.style.width = `${rect.width}px`;
        pieCtx.canvas.style.height = `${rect.height}px`;
        
        // Clear the canvas
        pieCtx.clearRect(0, 0, pieCtx.canvas.width, pieCtx.canvas.height);
        
        // Draw the text
        pieCtx.font = '14px Manrope';
        pieCtx.fillStyle = '#1F2937';
        pieCtx.textAlign = 'center';
        pieCtx.textBaseline = 'middle';
        pieCtx.fillText('No data available', rect.width / 2, rect.height / 2);
      } else {
        pieChartInstance = new Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: ['On Hold', 'In Progress', 'Completed'],
            datasets: [{
              data: pieData,
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
    }

    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext('2d');
      const barData = [
        dashboardData.monthly_data.january.totalRequests,
        dashboardData.monthly_data.february.totalRequests,
        dashboardData.monthly_data.march.totalRequests,
        dashboardData.monthly_data.april.totalRequests,
        dashboardData.monthly_data.may.totalRequests
      ];
      
      // Check if there's any data
      const hasBarData = barData.some(value => value > 0);
      
      if (!hasBarData) {
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = barCtx.canvas.getBoundingClientRect();
        
        // Set the canvas size accounting for device pixel ratio
        barCtx.canvas.width = rect.width * dpr;
        barCtx.canvas.height = rect.height * dpr;
        
        // Scale the context to ensure correct drawing
        barCtx.scale(dpr, dpr);
        
        // Set canvas CSS size
        barCtx.canvas.style.width = `${rect.width}px`;
        barCtx.canvas.style.height = `${rect.height}px`;
        
        // Clear the canvas
        barCtx.clearRect(0, 0, barCtx.canvas.width, barCtx.canvas.height);
        
        // Draw the text
        barCtx.font = '14px Manrope';
        barCtx.fillStyle = '#1F2937';
        barCtx.textAlign = 'center';
        barCtx.textBaseline = 'middle';
        barCtx.fillText('No data available', rect.width / 2, rect.height / 2);
      } else {
        barChartInstance = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [
              {
                label: 'Total Requests',
                data: barData,
                backgroundColor: ['#000', '#000', '#000', '#000', '#FF5B5B'],
                borderRadius: {
                  topLeft: 20,
                  topRight: 20,
                  bottomLeft: 0,
                  bottomRight: 0
                },
                borderSkipped: false,
                barThickness: 40,
                maxBarThickness: 40
              }
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 30  // Add padding to make room for labels
              }
            },
            scales: { 
              y: { 
                beginAtZero: true,
                grid: {
                  display: false
                },
                ticks: {
                  display: false
                },
                border: {
                  display: false
                }
              },
              x: {
                grid: {
                  display: false
                },
                border: {
                  display: false
                }
              }
            },
            plugins: { 
              legend: { 
                display: false 
              },
              tooltip: {
                enabled: false
              }
            }
          },
          plugins: [{
            id: 'customLabels',
            afterDraw(chart) {
              const {ctx, data, chartArea, scales: {x, y}} = chart;
              
              ctx.save();
              ctx.font = '600 14px Manrope';
              ctx.fillStyle = '#1F2937';
              ctx.textAlign = 'center';
              
              data.datasets[0].data.forEach((value, index) => {
                if (value > 0) {
                  const xPos = x.getPixelForValue(index);
                  const yPos = y.getPixelForValue(value);
                  const text = value.toString();
                  
                  // Draw the value above the bar
                  ctx.fillText(text, xPos, yPos - 10);
                }
              });
              ctx.restore();
            }
          }]
        });
      }
    }
    
    return () => {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
      if (barChartInstance) {
        barChartInstance.destroy();
      }
    };
  }, [dashboardData]);

  const handleRowClick = (rowData) => {
    if (typeof navigation.handleNavigationFromTableRow === 'function') {
      navigation.handleNavigationFromTableRow(rowData, true);
    }
  };

  return (
    <MainLayout isDashboardPage={true}>
      {loading && <LoadingOnPage />}
      <DashboardContainer>
        <MainContent>
          <LeftColumn>
            <StatsGrid>
              <StatCard 
                title="Total Instructions"
                subtitle="Count of the instructions created"
                value={dashboardData.total_serves_count.toString()}
                subtext={`${dashboardData.current_month_serves_count} this month`}
                subtextColor="#0F800A"
                subtextBg="#DEFFE4"
              />
              
              <StatCard 
                title="Instructions in Progress"
                subtitle="Total count of in progress instructions"
                value={dashboardData.status_data.in_progress.toString()}
                subtext={`${dashboardData.urgent_serves_count} urgent`}
                subtextColor="#B71C1C"
                subtextBg="#FFEAEA"
              />
              
              <StatCard 
                title="Instructions Completed"
                subtitle="Instructions completed this month"
                value={dashboardData.status_data.completed.toString()}
                subtext={`${dashboardData.pending_invoices_count} pending invoices`}
                subtextColor="#B71C1C"
                subtextBg="#FFE5E5"
              />
            </StatsGrid>
            
            <TableContainer>
              <InstructionsTable 
                data={filteredData}
                title="Instructions In Progress"
                subtitle={`Monthly instructions requested by ${user?.type === 'firm' ? 'firm' : 'individual'}`}
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
                onRowClick={handleRowClick}
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
              <SubTitle>Monthly instructions requested by {user?.type === 'firm' ? 'firm' : 'individual'}</SubTitle>
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
              <SubTitle>Monthly instructions requested by {user?.type === 'firm' ? 'firm' : 'individual'}</SubTitle>
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
  border-radius: 20px;
  padding: 8px 16px;
  color: #4b5563;
  background-color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.67' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;

  &:hover {
    border-color: #9ca3af;
  }

  &:focus {
    border-color: #043F35;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
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
