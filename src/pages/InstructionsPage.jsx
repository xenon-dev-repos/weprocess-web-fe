import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import InstructionsTable from '../components/InstructionsTable';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../hooks/useNavigation';
import LoadingOnPage from '../components/shared/LoadingOnPage';
import { ROUTES } from '../constants/routes';

const InstructionsPage = () => {
    const [timeFilter, setTimeFilter] = useState('monthly');
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, getServes } = useAuth();
    const navigation = useNavigation();

    const getDeadlineDate = (filter) => {
        const today = new Date();
        switch(filter) {
            case 'weekly':
                return new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];
            case 'biweekly':
                return new Date(today.setDate(today.getDate() + 14)).toISOString().split('T')[0];
            case 'monthly':
                return new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
            default:
                return new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
        }
    };

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

    const fetchServes = async (status = statusFilter) => {
        try {
            setLoading(true);
            
            if (!user?.id) {
                console.error('User ID not found');
                return;
            }

            // Only include status in params if it's not empty
            const params = {
                client_id: user.id,
                ...(status && { status: status })
            };

            const response = await getServes(params);
            
            if (response.success) {
                setFilteredData(response.serves.data || []);
            } else {
                console.error(response.message || 'Failed to fetch serves');
            }
        } catch (error) {
            console.error('Error fetching serves:', error);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
        if (user?.id) {
            fetchServes(statusFilter);
        }
    }, [statusFilter, user?.id]);
  
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

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        // Handles both "YYYY-MM-DD" and "DD/MM/YYYY"
        if (dateStr.includes('/')) return dateStr;
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return { label: 'Pending', bg: '#dcfce7', color: '#166534' };
            case 'completed': return { label: 'Completed', bg: '#dbeafe', color: '#1e40af' };
            case 'active': return { label: 'In Progress', bg: '#e0e7ff', color: '#3730a3' };
            case 'new': return { label: 'New', bg: '#e5e7eb', color: '#374151' };
            default: return { label: status, bg: '#e5e7eb', color: '#374151' };
        }
    };

    const mapServeToTableRow = (serve) => ({
        wpr: serve.id,
        owner: serve.applicant_name || serve.client_id || 'N/A',
        serve: serve.title,
        type: serve.priority ? serve.priority.charAt(0).toUpperCase() + serve.priority.slice(1) : 'N/A',
        court: serve.issuing_court,
        recipientName: serve.recipient_name,
        recipientAddress: serve.recipient_address,
        dateIssues: formatDate(serve.date_of_submission) !== 'N/A' ? formatDate(serve.date_of_submission) : formatDate(serve.created_at),
        deadline: serve.deadline,
        status: serve.status,
    });

    const columns = [
        { key: 'wpr', header: 'WPR no.', width: 'wpr' },
        { key: 'owner', header: 'Owner', width: 'owner' },
        { key: 'serve', header: 'Serve name', width: 'serve' },
        { key: 'court', header: 'Court name', width: 'court' },
        { key: 'type', header: 'Service type', width: 'type' },
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
            {loading && <LoadingOnPage />}
            <DashboardContainer>
                <MainContent>
                    <TableContainer>
                        <InstructionsTable 
                            data={tableData}
                            title="Instructions In Progress"
                            subtitle="Monthly instructions requested by firm"
                            columns={columns}
                            customFilters={customFilters}
                            renderCell={(key, value) => {
                                if (key === 'status') {
                                    const { label, bg, color } = getStatusBadge(value);
                                    return (
                                        <StatusBadge style={{ backgroundColor: bg, color }}>
                                            {label}
                                        </StatusBadge>
                                    );
                                }
                                if (key === 'dateIssues' || key === 'deadline') {
                                    return formatDate(value);
                                }
                                return value;
                            }}
                            minHeight={495}
                            noDataCellHeight={420}
                            itemsPerPage={10}
                            onRowClick={handleRowClick}
                        />
                    </TableContainer>
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

const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
`;

const StatusBadge = styled.span`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    text-transform: capitalize;
`;

export default InstructionsPage;
