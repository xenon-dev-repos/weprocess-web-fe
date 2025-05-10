import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import InstructionsTable from '../components/InstructionsTable';
import { useAuth } from '../contexts/AuthContext';

const InstructionsPage = () => {
    const [timeFilter, setTimeFilter] = useState('monthly');
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, getServes } = useAuth();

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
        { id: 'in_progress', label: 'In Progress', dotColor: 'warning' },
        { id: 'completed', label: 'Completed', dotColor: 'success' }
    ];
  
    const handleTimeFilterChange = (value) => {
        setTimeFilter(value);
        fetchServes();
    };

    const handleStatusFilterChange = (filterId) => {
        setStatusFilter(filterId);
        fetchServes();
    };

    const fetchServes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user?.id) {
                setError('User ID not found');
                return;
            }

            const response = await getServes({
                status: statusFilter,
                deadline: getDeadlineDate(timeFilter),
                sort_by: 'deadline,price',
                sort_order: 'desc,asc',
                per_page: 10,
                user_id: user.id
            });
            
            if (response.success) {
                setFilteredData(response.data);
            } else {
                setError(response.message || 'Failed to fetch serves');
            }
        } catch (error) {
            console.error('Error fetching serves:', error);
            setError(error.message || 'Failed to fetch serves');
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
        fetchServes();
    }, []);
  
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return { bg: '#dcfce7', color: '#166534' };
            case 'in_progress':
                return { bg: '#fef3c7', color: '#92400e' };
            case 'completed':
                return { bg: '#dbeafe', color: '#1e40af' };
            default:
                return { bg: '#e5e7eb', color: '#374151' };
        }
    };

    return (
        <MainLayout 
            showInstructionsPageHeader={true}
            title="Instructions" 
            filterButtons={filterButtons} 
            onFilterChange={handleStatusFilterChange} 
        >
            <DashboardContainer>
                <MainContent>
                    <TableContainer>
                        <InstructionsTable 
                            data={filteredData}
                            title="Instructions In Progress"
                            subtitle="Monthly instructions requested by firm"
                            columns={[
                                { key: 'id', header: 'WPR no.' },
                                { key: 'title', header: 'Title' },
                                { key: 'recipient_name', header: 'Recipient' },
                                { key: 'recipient_address', header: 'Address' },
                                { key: 'priority', header: 'Priority' },
                                { key: 'deadline', header: 'Deadline' },
                                { key: 'status', header: 'Status' },
                            ]}
                            customFilters={customFilters}
                            renderCell={(key, value, row) => {
                                if (key === 'status') {
                                    const { bg, color } = getStatusBadgeColor(value);
                                    return (
                                        <StatusBadge style={{ backgroundColor: bg, color }}>
                                            {value.replace('_', ' ')}
                                        </StatusBadge>
                                    );
                                }
                                if (key === 'deadline') {
                                    return formatDate(value);
                                }
                                if (key === 'price') {
                                    return `£${parseFloat(value).toFixed(2)}`;
                                }
                                if (key === 'priority') {
                                    return value.charAt(0).toUpperCase() + value.slice(1);
                                }
                                return value;
                            }}
                            minHeight={495}
                            noDataCellHeight={420}
                            itemsPerPage={10}
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
