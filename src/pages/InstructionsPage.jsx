import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../layouts/MainLayout';
import InstructionsTable from '../components/InstructionsTable';
import { instructionsTableData } from '../constants/mockData';

const InstructionsPage = () => {
    const [timeFilter, setTimeFilter] = useState('monthly');
    const [statusFilter, setStatusFilter] = useState('all');
    const [filteredData, setFilteredData] = useState(instructionsTableData);

    const filterButtons = [
        { id: 'all', label: 'All', dotColor: 'white' },
        { id: 'newrequest', label: 'New Requests', dotColor: 'info' },
        { id: 'inprogress', label: 'In Progress', dotColor: 'warning' },
        { id: 'completed', label: 'Completed', dotColor: 'success' }
    ];
  
    const handleTimeFilterChange = (value) => {
      setTimeFilter(value);
      // Filter data based on time period
      let filtered = [];
      switch(value) {
        case 'weekly':
          filtered = instructionsTableData.slice(0, 3); // Example
          break;
        case 'biweekly':
          filtered = instructionsTableData.slice(0, 6); // Example
          break;
        case 'monthly':
          filtered = instructionsTableData; // All data
          break;
        default:
          filtered = instructionsTableData;
      }
      setFilteredData(filtered);
    };

    const handleStatusFilterChange = (filterId) => {
        setStatusFilter(filterId);
        console.log('Filter changed to:', filterId);
    };
  
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
  
  
  // Removed unused activeTab state since we're using the tabId directly from onTabChange
  // If you need activeTab for other purposes, keep it but use it somewhere in your component

//   const handleTabChange = (tabId) => {
//     // Filter data based on selected tab
//     let filtered = [];
//     switch(tabId) {
//       case 'new-requests':
//         filtered = instructionsTableData.filter(item => item.status === '1st attempt');
//         break;
//       case 'in-progress':
//         filtered = instructionsTableData.filter(item => 
//           ['1st attempt', '2nd attempt', '3rd attempt', 'In Transit'].includes(item.status)
//         );
//         break;
//       case 'completed':
//         filtered = instructionsTableData.filter(item => item.status === 'Completed');
//         break;
//       case 'invoices':
//         filtered = instructionsTableData.filter(item => item.type === 'Urgent');
//         break;
//       default:
//         filtered = instructionsTableData;
//     }
//     setFilteredData(filtered);
//   };

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
                // tabs={[
                //     { id: 'new-requests', label: 'New requests' },
                //     { id: 'in-progress', label: 'In progress' },
                //     { id: 'completed', label: 'Completed' },
                //     { id: 'invoices', label: 'Invoices' }
                // ]}
                columns={[
                    { key: 'wpr', header: 'WPR no.' },
                    { key: 'owner', header: 'Owner' },
                    { key: 'serve', header: 'Serve name' },
                    { key: 'court', header: 'Court name' },
                    { key: 'type', header: 'Service type' },
                    { key: 'deadline', header: 'Deadline' },
                    { key: 'status', header: 'Process status' },
                    { key: 'amount', header: 'Amount' },
                ]}
                // onTabChange={handleTabChange}
                customFilters={customFilters}
                renderCell={(key, value) => {
                    if (key === 'status') {
                      return <StatusBadge status={value}>{value}</StatusBadge>;
                    }
                    if (key === 'amount') {
                      return `$${(Math.random() * 1000).toFixed(2)}`; // Example
                    }
                    return value;
                  }}
                minHeight={495}
                noDataCellHeight={420}
                itemsPerPage={8}
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


export default InstructionsPage;
