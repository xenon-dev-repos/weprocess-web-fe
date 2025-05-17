import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import InstructionsTable from '../components/InstructionsTable';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../hooks/useNavigation';
import LoadingOnPage from '../components/shared/LoadingOnPage';
import { ROUTES } from '../constants/routes';
import { formatDate } from '../utils/helperFunctions';

const InstructionsPage = () => {
    const [timeFilter, setTimeFilter] = useState('monthly');
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, getServes } = useAuth();
    const navigation = useNavigation();

    // const [pagination, setPagination] = useState({
    //     current_page: 1,
    //     last_page: 1,
    //     per_page: 10,
    //     total: 0
    // });

    // const getDeadlineDate = (filter) => {
    //     const today = new Date();
    //     switch(filter) {
    //         case 'weekly':
    //             return new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];
    //         case 'biweekly':
    //             return new Date(today.setDate(today.getDate() + 14)).toISOString().split('T')[0];
    //         case 'monthly':
    //             return new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
    //         default:
    //             return new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
    //     }
    // };

    const filterButtons = [
        { id: '', label: 'All', dotColor: 'white' },
        { id: 'pending', label: 'Pending', dotColor: 'info' },
        { id: 'active', label: 'In Progress', dotColor: 'warning' },
        { id: 'completed', label: 'Completed', dotColor: 'success' }
    ];
  
    const handleTimeFilterChange = (value) => {
        setTimeFilter(value);
        fetchServes(statusFilter);
    };

    const handleStatusFilterChange = (filterId) => {
        setStatusFilter(filterId);
        fetchServes(filterId);
    };

    // const handleTimeFilterChange = (value) => {
    //     setTimeFilter(value);
    //     fetchServes(statusFilter, pagination.current_page);
    // };

    // const handleStatusFilterChange = (filterId) => {
    //     setStatusFilter(filterId);
    //     // Reset to first page when filter changes
    //     setPagination(prev => ({
    //         ...prev,
    //         current_page: 1
    //     }));
    //     fetchServes(filterId, 1);
    // };

    // const handlePageChange = (page) => {
    //     setPagination(prev => ({
    //         ...prev,
    //         current_page: page
    //     }));
    //     fetchServes(statusFilter, page);
    // };

    const fetchServes = async (status = statusFilter) => {
        try {
            setLoading(true);
            
            if (!user?.id) {
                console.error('User ID not found');
                return;
            }

            const params = {
                client_id: user.id,
                // page: page,
                // per_page: pagination.per_page,
                ...(status && { status: status })
            };

            const response = await getServes(params);
            
            if (response.success && response?.serves?.data) {
                setFilteredData(response.serves.data || []);
                if (response.serves.pagination) {
                    // setPagination({
                    //     current_page: response.serves.pagination.current_page || 1,
                    //     last_page: response.serves.pagination.last_page || 1,
                    //     per_page: response.serves.pagination.per_page || 10,
                    //     total: response.serves.pagination.total || 0
                    // });
                }
            } else {
                setFilteredData([]);
                // setPagination({
                //     current_page: 1,
                //     last_page: 1,
                //     per_page: filters.per_page,
                //     total: 0
                // });
                console.error(response.message || 'Failed to fetch serves');
            }
        } catch (error) {
            console.error('Error fetching serves:', error);
            setFilteredData([]);
            // setPagination({
            //     current_page: 1,
            //     last_page: 1,
            //     per_page: filters.per_page,
            //     total: 0
            // });
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
        if (user?.id) {
            fetchServes(statusFilter);
        }
    }, [statusFilter, user?.id]);

    // useEffect(() => {
    //     if (user?.id) {
    //         fetchServes(statusFilter, pagination.current_page);
    //     }
    // }, [user?.id, pagination.current_page]);
  
    const customFilters = (
      <select 
        value={timeFilter}
        onChange={(e) => handleTimeFilterChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '12px',
          border: '1px solid #ddd'
        }}
      >
        <option value="weekly">Weekly</option>
        <option value="biweekly">Bi-weekly</option>
        <option value="monthly">Monthly</option>
      </select>
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
        status: serve.status,
    });

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
                    <InstructionsTable 
                        data={tableData}
                        title="Instructions In Progress"
                        subtitle={`Monthly instructions requested by ${user?.type === 'firm' ? 'firm' : 'individual'}`}
                        columns={columns}
                        customFilters={customFilters}
                        minHeight={495}
                        noDataCellHeight={495}
                        itemsPerPage={10}
                        onRowClick={handleRowClick}
                        loading={loading}

                        // itemsPerPage={pagination.per_page}
                        // currentPage={pagination.current_page}
                        // totalPages={pagination.last_page}
                        // totalItems={pagination.total}
                        // onPageChange={handlePageChange}
                        // onRowClick={handleRowClick}
                        // serverSidePagination={true}
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

const StatusBadge = styled.span`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    text-transform: capitalize;
`;

export default InstructionsPage;
