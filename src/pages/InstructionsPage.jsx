import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import CustomDataTable from '../components/CustomDataTable';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../hooks/useNavigation';
import LoadingOnPage from '../components/shared/LoadingOnPage';
import { ROUTES } from '../constants/routes';
import { capitalizeFirstLetter, formatDate, getDateRange, getFilterLabel } from '../utils/helperFunctions.jsx';
import CustomSelect from '../components/shared/CustomSelect';
import { defaultIntervalFilter, IntervalFilters } from '../constants/filters';

const columns = [
    { key: 'wpr', header: 'WPR no.', width: 'id' },
    { key: 'owner', header: 'Owner', width: 'owner' },
    { key: 'serve', header: 'Serve name', width: 'title' },
    { key: 'type', header: 'Service type', width: 'type' },
    { key: 'court', header: 'Court name', width: 'issuing_court' },
    { key: 'recipient_name', header: "Recipient's Name", width: 'recipient_name' },
    { key: 'recipient_address', header: "Recipient's Address", width: 'recipient_address' },
    { key: 'date_of_submission', header: 'Date Issues', width: 'date_issued' },
    { key: 'deadline', header: 'Deadline', width: 'deadline' },
    { key: 'status', header: 'Process status', width: 'status' }
];

const InstructionsPage = () => {
    const [timeFilter, setTimeFilter] = useState(defaultIntervalFilter);
    // const [deadlineDate, setDeadlineDate] = useState('');
    const [dateRange, setDateRange] = useState(getDateRange(timeFilter, 'DD/MM/YYYY'));
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, getServes } = useAuth();
    const navigation = useNavigation();

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const filterButtons = [
        { id: '', label: 'All', dotColor: 'white' },
        { id: 'new', label: 'New requests', dotColor: 'info' },
        { id: 'active', label: 'In Progress', dotColor: 'warning' },
        { id: 'completed', label: 'Completed', dotColor: 'success' }
    ];
  
    const handleTimeFilterChange = (value) => {
        // const calculatedDate = getDeadlineDate(value);
        // setDeadlineDate(calculatedDate);
        setTimeFilter(value);
        setDateRange(getDateRange(value, 'DD/MM/YYYY'));
    };

    const handleStatusFilterChange = (filterId) => {
        setStatusFilter(filterId);
        setPagination(prev => ({
            ...prev,
            current_page: 1
        }));
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
            setLoading(true);
            setFilteredData([]);
            
            if (!user?.id) {
                console.error('User ID not found');
                return;
            }

            const queryParams = {
                client_id: user?.id,
                page: page,
                per_page: pagination.per_page,
                ...(statusFilter && { status: statusFilter }),
                // ...(deadline && { deadline: deadlineDate }),
                ...(dateRange.from_date && { from_date: dateRange.from_date }),
                ...(dateRange.to_date && { to_date: dateRange.to_date }),
            };

            const response = await getServes(queryParams);
            
            if (response?.success && response?.data) {
                setFilteredData(response?.data || []);
                if (response?.pagination) {
                    setPagination({
                        current_page: response.pagination.current_page,
                        last_page: response.pagination.last_page,
                        per_page: response.pagination.per_page,
                        total: response.pagination.total
                    });
                }
            } else {
                setFilteredData([]);
                setPagination({
                    current_page: 1,
                    last_page: 1,
                    per_page: pagination.per_page,
                    total: 0
                });
                console.error(response.message || 'Failed to fetch serves');
            }
        } catch (error) {
            console.error('Error fetching serves:', error);
            setFilteredData([]);
            setPagination({
                current_page: 1,
                last_page: 1,
                per_page: pagination.per_page,
                total: 0
            });
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
        if (user?.id) {
            fetchServes();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, statusFilter, dateRange]);
  
    const customFilters = (
        <CustomSelect
            options={IntervalFilters}
            defaultValue={defaultIntervalFilter}
            onChange={(value) => handleTimeFilterChange(value)}
        />
    );

    const mapServeToTableRow = (serve) => ({
        wpr: serve.id,
        owner: serve.applicant_name || serve.client_id || 'N/A',
        serve: serve.title,
        type: serve.priority ? serve.priority.charAt(0).toUpperCase() + serve.priority.slice(1) : 'N/A',
        court: serve.issuing_court,
        recipient_name: serve.recipient_name,
        recipient_address: serve.recipient_address,
        date_of_submission: formatDate(serve.date_of_submission) !== 'N/A' ? formatDate(serve.date_of_submission) : formatDate(serve.created_at),
        deadline: serve.deadline,
        status: capitalizeFirstLetter(serve.status)
    });

    const tableData = filteredData.map(mapServeToTableRow);
    
    const handleRowClick = (rowData) => {
        if (typeof navigation.handleNavigationFromTableRow === 'function') {
            navigation.handleNavigationFromTableRow(rowData, true)
        };
    }

    return (
        <MainLayout 
            isInstructionsPage={true}
            title="Instructions" 
            filterButtons={filterButtons} 
            onFilterChange={handleStatusFilterChange} 
        >
            {/* {loading && <LoadingOnPage />} */}

            <DashboardContainer>
                <MainContent>
                    <CustomDataTable 
                        data={tableData}
                        title="Instructions In Progress"
                        subtitle={`${getFilterLabel(IntervalFilters, timeFilter)} instructions requested by ${user?.type === 'firm' ? 'firm' : 'individual'}`}
                        columns={columns}
                        customFilters={customFilters}
                        minHeight={495}
                        noDataCellHeight={495}
                        loading={loading}

                        itemsPerPage={pagination.per_page}
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        totalItems={pagination.total}
                        onPageChange={handlePageChange}
                        onRowClick={handleRowClick}
                        serverSidePagination={true}
                    />
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

export default InstructionsPage;
