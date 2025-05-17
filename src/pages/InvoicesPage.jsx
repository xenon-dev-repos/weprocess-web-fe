import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import InstructionsTable from '../components/InstructionsTable';
import { API_ENDPOINTS } from '../constants/api';
import axios from 'axios';
import { useToast } from '../services/ToastService';
import LoadingOnPage from '../components/shared/LoadingOnPage';
import { useNavigation } from '../hooks/useNavigation';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/helperFunctions';

const InvoicesPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({
        is_paid: '',
        per_page: 10,
        page: 1
    });
    const { showError } = useToast();
    const navigation = useNavigation();
    const { user } = useAuth();
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const mapServeToTableRow = (invoice) => ({
        id: invoice.id,
        owner: invoice.owner || 'N/A',
        title: invoice.title,
        type: invoice.type || 'N/A',
        issuing_court: invoice.issuing_court,
        recipient_name: invoice.recipient_name,
        recipient_address: invoice.recipient_address,
        date_issued: formatDate(invoice.date_issued) !== 'N/A' ? formatDate(invoice.date_issued) : formatDate(invoice.created_at),
        deadline: invoice.deadline,
        is_paid: invoice.is_paid,
    });

    const columns = [
        { key: 'id', header: 'WPR no.', width: 'id' },
        { key: 'owner', header: 'Owner', width: 'owner' },
        { key: 'title', header: 'Serve name', width: 'title' },
        { key: 'type', header: 'Service type', width: 'type' },
        { key: 'issuing_court', header: 'Court name', width: 'issuing_court' },
        { key: 'recipient_name', header: "Recipient's Name", width: 'recipient_name' },
        { key: 'recipient_address', header: "Recipient's Address", width: 'recipient_address' },
        { key: 'date_issued', header: 'Date Issues', width: 'date_issued' },
        { key: 'deadline', header: 'Deadline', width: 'deadline' },
        { key: 'is_paid', header: 'Process status', width: 'status' }
    ];

    const tableData = filteredData.map(mapServeToTableRow);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Build query parameters
            const queryParams = new URLSearchParams();
            if (filters.is_paid !== '') queryParams.append('is_paid', filters.is_paid);
            queryParams.append('per_page', filters.per_page.toString());
            queryParams.append('page', filters.page.toString());
            
            const response = await axios.get(`${API_ENDPOINTS.INVOICES}?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response?.data?.data) {
                setFilteredData(response.data.data || []);
                setPagination({
                    current_page: response.data.pagination.current_page,
                    last_page: response.data.pagination.last_page,
                    per_page: response.data.pagination.per_page,
                    total: response.data.pagination.total
                });
            } else {
                setFilteredData([]);
                setPagination({
                    current_page: 1,
                    last_page: 1,
                    per_page: filters.per_page,
                    total: 0
                });
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setError(error.message || 'Failed to fetch invoices');
            showError(error.message || 'Failed to fetch invoices');
            setFilteredData([]);
            setPagination({
                current_page: 1,
                last_page: 1,
                per_page: filters.per_page,
                total: 0
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [filters]);

    const handleFilterChange = (filterId) => {
        setFilters(prev => ({
            ...prev,
            is_paid: filterId === 'paid' ? '1' : filterId === 'unpaid' ? '0' : '',
            page: 1
        }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({
            ...prev,
            page: page
        }));
    };

    const handleRowClick = (rowData) => {
        if (typeof navigation.handleNavigationFromTableRow === 'function') {
            navigation.handleNavigationFromTableRow(rowData)
        };
    }

    return (
        <MainLayout 
            isInvoicePage={true}
            title="Invoices"
            filterButtons={[
                { id: '', label: 'All', dotColor: 'white' },
                { id: 'paid', label: 'Paid', dotColor: 'success' },
                { id: 'unpaid', label: 'Unpaid', dotColor: 'warning' }
            ]}
            onFilterChange={handleFilterChange}
        >
            {/* {loading && <LoadingOnPage />} */}

            <DashboardContainer>
                <MainContent>
                    <InstructionsTable 
                        data={tableData}
                        title="All Invoices"
                        subtitle={`Monthly invoices generated by ${user?.type === 'firm' ? 'firm' : 'individual'}`}
                        columns={columns}
                        minHeight={495}
                        noDataCellHeight={495}
                        loading={loading}

                        // TODO: Use these props for pagination on dashboard and serves page
                        error={error}
                        onRowClick={handleRowClick}
                        serverSidePagination={true}
                        itemsPerPage={pagination.per_page}
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        totalItems={pagination.total}
                        onPageChange={handlePageChange}
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

export default InvoicesPage;
