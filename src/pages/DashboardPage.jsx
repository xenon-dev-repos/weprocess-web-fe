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
import CustomSelect from '../components/shared/CustomSelect';
import { getDateRange } from '../utils/helperFunctions';

const graphFilterOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-weekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Annually', value: 'annually' }
];

const DashboardTableFilters = [
      { id: 'new-requests', label: 'New requests' },
      { id: 'in-progress', label: 'In progress' },
      { id: 'completed', label: 'Completed' },
      { id: 'invoices', label: 'Invoices' }
    ]

const columns = [
      { key: 'wpr', header: 'WPR no.' },
      { key: 'owner', header: 'Owner' },
      { key: 'serve', header: 'Serve name' },
      { key: 'court', header: 'Court name' },
      { key: 'type', header: 'Service type' },
      { key: 'deadline', header: 'Deadline' },
      { key: 'status', header: 'Process status' },
    ]

const defaultFilter = graphFilterOptions[2].value;

const DashboardPage = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('new-requests');
  const [statusFilter, setStatusFilter] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [invoicesFilter, setInvoicesFilter] = useState({
      is_paid: '0',
      per_page: 5,
      page: 1
  });
  const [timeFilter, setTimeFilter] = useState(defaultFilter);
  // const [deadlineDate, setDeadlineDate] = useState('');
  const [dateRange, setDateRange] = useState(getDateRange(timeFilter, 'DD/MM/YYYY'));
  const [pagination, setPagination] = useState({
      current_page: 1,
      last_page: 1,
      per_page: 5,
      total: 0
  });
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
      may: { totalRequests: 0 },
      june: { totalRequests: 0 },
      july: { totalRequests: 0 },
      august: { totalRequests: 0 },
      september: { totalRequests: 0 },
      october: { totalRequests: 0 },
      november: { totalRequests: 0 },
      december: { totalRequests: 0 },
    },
    pending_invoices_count: 0
  });
  const { showError } = useToast();
  const { user, getServes } = useAuth();
  const navigation = useNavigation();

  const handleStatusFilterChange = async (tabId) => {
    try {
      setActiveTab(tabId); 
      let status = '';
      switch(tabId) {
        case 'new-requests':
          status = 'new';
          break;
        case 'in-progress':
          status = 'active';
          break;
        case 'completed':
          status = 'completed';
          break;
        case 'invoices':
          status = 'invoices';
          break;
        default:
          status = '';
      }

      setStatusFilter(status);
      setPagination(prev => ({
          ...prev,
          current_page: 1
      }));

    } catch (error) {
      console.error('Error handling tab change:', error);
      showError('Failed to filter instructions');
    }
  };

  const getActiveTabLabel = () => {
    const tabs = DashboardTableFilters;
    const activeTabObj = tabs.find(tab => tab.id === activeTab);
    return activeTabObj ? activeTabObj.label : 'Instructions';
  };

  const handleTimeFilterChange = (value) => {
      // const calculatedDate = getDeadlineDate(value);
      // setDeadlineDate(calculatedDate);
      setTimeFilter(value);
      setDateRange(getDateRange(value, 'DD/MM/YYYY'));
  };

  const handlePageChange = (page) => {
      setPagination(prev => ({
          ...prev,
          current_page: page
      }));
      fetchServes(page)
  };

  const fetchServes = async (page = 1) => {
    try {
      setTableLoading(true);

      if (!user?.id) {
        console.error('User ID not found');
        return;
      }

      // FETCH INVOICES

      if (statusFilter === 'invoices') {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const queryParams = {
            // client_id: user?.id,
            page: page,
            per_page: pagination.per_page,
              ...(invoicesFilter.is_paid !== '' && { is_paid: String(invoicesFilter.is_paid) }),
            // ...(deadline && { deadline: deadlineDate }),
            // ...(dateRange.from_date && { from_date: dateRange.from_date }),
            // ...(dateRange.to_date && { to_date: dateRange.to_date }),
        };
        
        const response = await axios.get(API_ENDPOINTS.INVOICES, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          params: queryParams
        });

        if (response?.data?.data && response?.data?.success) {
          const mappedInvoices = response.data.data.map(invoice => ({
            wpr: invoice.invoice_number,
            owner: invoice.owner || 'N/A',
            serve: invoice.title || 'N/A',
            type: invoice.type || 'N/A',
            court: invoice.issuing_court || 'N/A',
            deadline: invoice.deadline || 'N/A',
            status: invoice.is_paid ? 'Paid' : 'Pending',
          }));
          setFilteredData(mappedInvoices);
          setPagination({
              current_page: response.data.pagination.current_page,
              last_page: response.data.pagination.last_page,
              per_page: response.data.pagination.per_page,
              total: response.data.pagination.total
          });
        } else {
          console.error('Invoice data structure unexpected:', response.data);
          setFilteredData([]);
          setPagination({
              current_page: 1,
              last_page: 1,
              per_page: pagination.per_page,
              total: 0
          });
        }
        return;
      }

      // FETCH SERVES

      const queryParams = {
          client_id: user?.id,
          page: page,
          per_page: pagination.per_page,
          ...(statusFilter && { status: statusFilter }),
          // ...(deadline && { deadline: deadlineDate }),
          // ...(dateRange.from_date && { from_date: dateRange.from_date }),
          // ...(dateRange.to_date && { to_date: dateRange.to_date }),
      };

      const response = await getServes(queryParams);

      console.log(response)

      if (response?.success && response?.data) {
        const mappedData = response.data.map(serve => ({
          wpr: serve.id,
          owner: serve.applicant_name || serve.client_id || 'N/A',
          serve: serve.title,
          type: serve.priority ? serve.priority.charAt(0).toUpperCase() + serve.priority.slice(1) : 'N/A',
          court: serve.issuing_court,
          deadline: serve.deadline,
          status: serve.status,
        }));
        setFilteredData(mappedData);
        if (response?.pagination) {
          setPagination({
              current_page: response.pagination.current_page,
              last_page: response.pagination.last_page,
              per_page: response.pagination.per_page,
              total: response.pagination.total
          });
        }
      } else {
        console.error(response.message || 'Failed to fetch serves');
        setFilteredData([]);
        setPagination({
            current_page: 1,
            last_page: 1,
            per_page: pagination.per_page,
            total: 0
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setFilteredData([]);
      setPagination({
          current_page: 1,
          last_page: 1,
          per_page: pagination.per_page,
          total: 0
      });
    } finally {
      setTableLoading(false);
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

        const queryParams = {
            // client_id: user?.id,
            // page: page,
            // per_page: pagination.per_page,
            // ...(statusFilter && { status: statusFilter }),
            // ...(deadline && { deadline: deadlineDate }),
            ...(dateRange.from_date && { from_date: dateRange.from_date }),
            ...(dateRange.to_date && { to_date: dateRange.to_date }),
        };

        const response = await axios.get(API_ENDPOINTS.DASHBOARD, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          params: queryParams
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, dateRange]);

  useEffect(() => {
    fetchServes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

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
        pieCtx.font = '16px Manrope';
        pieCtx.fontWeight = 500;
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
              backgroundColor: ['#7987FF', '#F765A3', '#A155B9'],
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%', 
            plugins: { 
              legend: { 
                position: 'right',
                labels: {
                  boxWidth: 8,
                  boxHeight: 8, // Add this to make the box square before rounding
                  padding: 10,
                  usePointStyle: true, // This makes the boxes round
                  pointStyle: 'circle' // Explicitly set to circle
                }
              } 
            },
          },
        });
      }
    }

    if (barChartRef.current) {

      const barCtx = barChartRef.current.getContext('2d');

      // 1. Get all 12 months in order
      const allMonths = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];

      // 2. Create color palette for 12 months
      const monthColors = [
        '#FF5B5B', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
        '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
        '#A855F7', '#EF4444'
      ];

      // 3. Prepare data in correct month order
      const monthLabels = [];
      const barData = [];
      const backgroundColors = [];

      allMonths.forEach((month, index) => {
        if (dashboardData.monthly_data[month]) {
          monthLabels.push(month.charAt(0).toUpperCase() + month.slice(1));
          barData.push(dashboardData.monthly_data[month].totalRequests || 0);
          backgroundColors.push(monthColors[index]);
        }
      });

      // 4. Calculate dynamic bar thickness based on available months
      const barThickness = Math.min(80, Math.max(20, 400 / monthLabels.length));
      
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
            labels: monthLabels,
            datasets: [
              {
                label: 'Total Requests',
                data: barData,
                backgroundColor: backgroundColors,
                borderRadius: {
                  topLeft: 20,
                  topRight: 20,
                  bottomLeft: 0,
                  bottomRight: 0
                },
                borderSkipped: false,
                barThickness: barThickness,
                // maxBarThickness: 60
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
                  display: false,
                  drawBorder: false
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
                  drawOnChartArea: true,
                  lineWidth: 0.5,
                  color: '#E5E7EB',
                  drawTicks: false
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
              const {ctx, data, scales: {x, y}} = chart;
              
              ctx.save();
              ctx.font = '700 24px Manrope';
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
                title="Instructions In Progress"
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
            
            <InstructionsTable 
              data={filteredData}
              title={`Instructions ${getActiveTabLabel()}`}
              subtitle={`Monthly instructions requested by ${user?.type === 'firm' ? 'firm' : 'individual'}`}
              tabs={DashboardTableFilters}
              columns={columns}
              onTabChange={handleStatusFilterChange}
              minHeight={352}
              noDataCellHeight={362}
              loading={tableLoading}

              itemsPerPage={pagination.per_page}
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              totalItems={pagination.total}
              onPageChange={handlePageChange}
              onRowClick={handleRowClick}
              serverSidePagination={true}
            />
          </LeftColumn>

          <RightColumn>
            <ChartCard>
              <ChartHeader>
                <ChartTitle>Instructions requested</ChartTitle>
                <CustomSelect
                  options={graphFilterOptions}
                  defaultValue={defaultFilter}
                  // onChange={(value) => console.log('Selected:', value)}
                  onChange={(value) => handleTimeFilterChange(value)}
                />
              </ChartHeader>
              <SubTitle>Monthly instructions requested by {user?.type === 'firm' ? 'firm' : 'individual'}</SubTitle>
              <ChartCanvasWrapper>
                <canvas ref={barChartRef}></canvas>
              </ChartCanvasWrapper>
            </ChartCard>

            <ChartCard>
              <ChartHeader>
                <ChartTitle>Instructions status</ChartTitle>
                <CustomSelect
                  options={graphFilterOptions}
                  defaultValue={defaultFilter}
                  // onChange={(value) => console.log('Selected:', value)}
                  onChange={(value) => handleTimeFilterChange(value)}
                />
              </ChartHeader>
              <SubTitle>Monthly instructions requested by {user?.type === 'firm' ? 'firm' : 'individual'}</SubTitle>
              <ChartCanvasWrapper>
                <canvas ref={pieChartRef}></canvas>
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
    width: 500px;
    min-width: 500px;
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

const ChartCanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 272px;
  max-height: 272px;
  
  canvas {
    width: 100% !important;
    height: 100% !important;
      // min-height: 262px;
  }

  @media (min-width: 1440px) {
    canvas {
      width: 100% !important;
      height: 100% !important;
      // min-height: 262px;
    }
  }
`;

const ChartCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  // min-height: 373px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: -11px 0 20px 0;
`;

export default DashboardPage;
