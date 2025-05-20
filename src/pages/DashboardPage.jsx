import React from 'react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Chart } from 'chart.js/auto';
import { MainLayout } from '../layouts/MainLayout';
import { StatCard, StatSubtitle, StatTitle } from '../components/dashboard/StatCard';
import InstructionsTable from '../components/InstructionsTable';
import { API_ENDPOINTS } from '../constants/api';
import axios from 'axios';
import { useToast } from '../services/ToastService';
import LoadingOnPage from '../components/shared/LoadingOnPage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../hooks/useNavigation';
import CustomSelect from '../components/shared/CustomSelect';
import { capitalizeFirstLetter, getDateRange } from '../utils/helperFunctions';
import { defaultIntervalFilter, InstructionsTableStatusFilters, IntervalFilters } from '../constants/filters';

const columns = [
    { key: 'wpr', header: 'WPR no.' },
    { key: 'owner', header: 'Owner' },
    { key: 'serve', header: 'Serve name' },
    { key: 'court', header: 'Court name' },
    { key: 'type', header: 'Service type' },
    { key: 'deadline', header: 'Deadline' },
    { key: 'status', header: 'Process status' },
];

const DashboardPage = () => {
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);
    
    // Loading states
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [doughnutLoading, setDoughnutLoading] = useState(false);
    const [barGraphLoading, setBarGraphLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    
    // Data states
    const [summaryData, setSummaryData] = useState({
        serves_count: 0,
        in_progress_count: 0,
        urgent_in_progress_count: 0,
        completed_count: 0,
        pending_invoice_count: 0
    });
    const [doughnutData, setDoughnutData] = useState({
        on_hold: 0,
        in_progress: 0,
        completed: 0
    });

    const [barGraphData, setBarGraphData] = useState([]);
    
    const [filteredData, setFilteredData] = useState([]);
    const [activeTab, setActiveTab] = useState('new-requests');
    const [statusFilter, setStatusFilter] = useState('');
    const [invoicesFilter] = useState({is_paid: '0',});
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 5,
        total: 0
    });
    
    const { showError } = useToast();
    const { user, getServes } = useAuth();
    const navigation = useNavigation();

    const handleRowClick = (rowData) => {
      if (typeof navigation.handleNavigationFromTableRow === 'function') {
          navigation.handleNavigationFromTableRow(rowData, true);
      }
    };

    const handleStatusFilterChange = async (tabId) => {
        try {
            setActiveTab(tabId);
            let status = '';
            switch (tabId) {
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
        const tabs = InstructionsTableStatusFilters;
        const activeTabObj = tabs.find(tab => tab.id === activeTab);
        return activeTabObj ? activeTabObj.label : 'Instructions';
    };

    const handleBarGraphIntervalFilterChange = (value) => {
        fetchBarGraphData(value);
    };

    const handleDoughnutIntervalFilterChange = (value) => {
        const range = getDateRange(value);
        fetchDoughnutData(range.from_date, range.to_date);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({
            ...prev,
            current_page: page
        }));
        fetchServes(page);
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
                    page: page,
                    per_page: pagination.per_page,
                    ...(invoicesFilter.is_paid !== '' && { is_paid: String(invoicesFilter.is_paid) }),
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
            };

            const response = await getServes(queryParams);

            if (response?.success && response?.data) {
                const mappedData = response.data.map(serve => ({
                    wpr: serve.id,
                    owner: serve.applicant_name || serve.client_id || 'N/A',
                    serve: serve.title,
                    type: capitalizeFirstLetter(serve.priority) || 'N/A',
                    court: serve.issuing_court,
                    deadline: serve.deadline || 'N/A',
                    status: capitalizeFirstLetter(serve.status),
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

    const fetchSummaryData = async () => {
        try {
            setSummaryLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(API_ENDPOINTS.DASHBOARD_SUMMARY, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                setSummaryData({
                    serves_count: response.data.data.serves_count,
                    in_progress_count: response.data.data.in_progress_count,
                    urgent_in_progress_count: response.data.data.urgent_in_progress_count,
                    completed_count: response.data.data.completed_count,
                    pending_invoice_count: response.data.data.pending_invoice_count
                });
            }
        } catch (error) {
            console.error('Error fetching summary data:', error);
            showError('Failed to load dashboard summary data');
        } finally {
            setSummaryLoading(false);
        }
    };

    const fetchDoughnutData = async (from_date, to_date) => {
        try {
            setDoughnutLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(API_ENDPOINTS.DASHBOARD_SERVES_STATUS_DOUGHNUT_GRAPH, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                params: {
                    from_date: from_date,
                    to_date: to_date
                }
            });

            if (response.data.success) {
                setDoughnutData({
                    on_hold: response.data.data.on_hold,
                    in_progress: response.data.data.in_progress,
                    completed: response.data.data.completed
                });
            }
        } catch (error) {
            console.error('Error fetching doughnut data:', error);
            showError('Failed to load doughnut chart data');
        } finally {
            setDoughnutLoading(false);
        }
    };

    const fetchBarGraphData = async (intervalFilter) => {
        try {
            setBarGraphLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(API_ENDPOINTS.DASHBOARD_SERVES_REQUESTED_BAR_GRAPH, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                params: {
                    interval: intervalFilter
                }
            });

            if (response.data.success) {
                setBarGraphData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching bar graph data:', error);
            showError('Failed to load bar graph data');
        } finally {
            setBarGraphLoading(false);
        }
    };

    useEffect(() => {
        const range = getDateRange(defaultIntervalFilter);
        fetchSummaryData();
        fetchBarGraphData(defaultIntervalFilter);
        fetchDoughnutData(range.from_date || '', range.to_date || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                doughnutData.on_hold,
                doughnutData.in_progress,
                doughnutData.completed
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
                // pieCtx.fillText('No data available', rect.width / 2, rect.height / 2);
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
                                    boxHeight: 8,
                                    padding: 10,
                                    usePointStyle: true,
                                    pointStyle: 'circle'
                                }
                            }
                        },
                    },
                });
            }
        }

        if (barChartRef.current) {
            const barCtx = barChartRef.current.getContext('2d');

            // Prepare data for bar chart
            const labels = barGraphData.map(item => item.title);
            const data = barGraphData.map(item => item.count);
            const tooltips = barGraphData.map(item => item.tooltip);

            // Generate colors for bars
            const backgroundColors = labels.map((_, index) => {
                const colors = ['#FF5B5B', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
                    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
                    '#A855F7', '#EF4444'];
                return colors[index % colors.length];
            });

            // Calculate dynamic bar thickness based on available data points
            const barThickness = Math.min(80, Math.max(20, 400 / labels.length));

            // Check if there's any data
            const hasBarData = data.some(value => value > 0);

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
                // barCtx.fillText('No data available', rect.width / 2, rect.height / 2);
            } else {
                barChartInstance = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Total Requests',
                                data: data,
                                backgroundColor: backgroundColors,
                                borderRadius: {
                                    topLeft: 20,
                                    topRight: 20,
                                    bottomLeft: 0,
                                    bottomRight: 0
                                },
                                borderSkipped: false,
                                barThickness: barThickness,
                            }
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                top: 30
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
                                callbacks: {
                                    label: function(context) {
                                        const index = context.dataIndex;
                                        return tooltips[index];
                                    }
                                }
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
    }, [doughnutData, barGraphData]);

    return (
        <MainLayout isDashboardPage={true}>
            {summaryLoading && <LoadingOnPage />}
            <DashboardContainer>
                <MainContent>
                    <LeftColumn>
                        <StatsGrid>
                            <StatCard
                                title="Total Instructions"
                                subtitle="Count of the instructions created"
                                value={summaryData.serves_count.toString()}
                                subtext={`${summaryData.in_progress_count} this month`}
                                subtextColor="#0F800A"
                                subtextBg="#DEFFE4"
                            />

                            <StatCard
                                title="Instructions In Progress"
                                subtitle="Total count of in progress instructions"
                                value={summaryData.in_progress_count.toString()}
                                subtext={`${summaryData.urgent_in_progress_count} urgent`}
                                subtextColor="#B71C1C"
                                subtextBg="#FFEAEA"
                            />

                            <StatCard
                                title="Instructions Completed"
                                subtitle="Instructions completed this month"
                                value={summaryData.completed_count.toString()}
                                subtext={`${summaryData.pending_invoice_count} pending invoices`}
                                subtextColor="#B71C1C"
                                subtextBg="#FFE5E5"
                            />
                        </StatsGrid>

                        <InstructionsTable
                            data={filteredData}
                            title={`Instructions ${getActiveTabLabel()}`}
                            subtitle={`Monthly instructions requested by ${user?.type === 'firm' ? 'firm' : 'individual'}`}
                            tabs={InstructionsTableStatusFilters}
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
                                <StatTitle>Instructions requested</StatTitle>
                                <CustomSelect
                                    options={IntervalFilters}
                                    defaultValue={defaultIntervalFilter}
                                    onChange={(value) => handleBarGraphIntervalFilterChange(value)}
                                />
                            </ChartHeader>
                            <StatSubtitle style={{marginTop: -6.5}}>Monthly instructions requested by {user?.type === 'firm' ? 'firm' : 'individual'}</StatSubtitle>
                            <ChartCanvasWrapper>
                                {(barGraphData.length === 0) ? (
                                    <LoadingOverlay>No data available</LoadingOverlay>
                                ) : (
                                  <>
                                    {barGraphLoading && <LoadingOverlay>Loading...</LoadingOverlay>}
                                    <canvas ref={barChartRef}></canvas>
                                  </>
                                )}
                            </ChartCanvasWrapper>
                        </ChartCard>

                        <ChartCard>
                            <ChartHeader>
                                <StatTitle>Instructions status</StatTitle>
                                <CustomSelect
                                    options={IntervalFilters}
                                    defaultValue={defaultIntervalFilter}
                                    onChange={(value) => handleDoughnutIntervalFilterChange(value)}
                                />
                            </ChartHeader>
                            <StatSubtitle style={{marginTop: -6.5}}>Monthly instructions requested by {user?.type === 'firm' ? 'firm' : 'individual'}</StatSubtitle>
                            <ChartCanvasWrapper>
                              {(doughnutData.on_hold === 0 && doughnutData.in_progress === 0 && doughnutData.completed === 0 ) ? (
                                <LoadingOverlay>No data available</LoadingOverlay>
                              ) : (
                                <>
                                  {doughnutLoading && <LoadingOverlay>Loading...</LoadingOverlay>}
                                  <canvas ref={pieChartRef}></canvas>
                                </>
                              )}
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
  min-height: 278.5px;
  max-height: 278.5px;
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }

  @media (min-width: 1440px) {
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
  z-index: 10;

  color: #6B7280;
  padding: 16px;
  font-style: italic;
  font-weight: 400;
  font-size: 16px;
  
  @media (max-width: 1440px) {
    font-size: 15px;
  }
  
  @media (max-width: 1280px) {
    font-size: 14px;
  }
  
  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 12px;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    padding: 8px;
  }

  &:empty::after {
    content: "No data available";
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  &:hover:empty::after {
    opacity: 0.9;
  }
`;

const ChartCard = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export default DashboardPage;
