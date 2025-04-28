import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TableContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const SubTitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.button`
  padding: 1rem;
  background: none;
  border: none;
  border-bottom: ${props => props.active ? '2px solid #3b82f6' : '2px solid transparent'};
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableHead = styled.thead`
  & tr {
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
`;

const TableHeaderCell = styled.th`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  padding: 0.75rem 1rem;
  white-space: nowrap;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  &:hover {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  font-size: 0.875rem;
  color: #1f2937;
  padding: 0.75rem 1rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
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

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
`;

const PaginationInfo = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PaginationButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: ${props => props.active ? '#e5e7eb' : 'transparent'};
  color: ${props => props.active ? '#1f2937' : '#4b5563'};
  cursor: pointer;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const InstructionsTable = ({ data = [], title = "Instructions In Progress", subtitle = "Monthly instructions requested by firm" }) => {
  const [activeTab, setActiveTab] = useState('in-progress');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const tabs = [
    { id: 'new-requests', label: 'New requests' },
    { id: 'in-progress', label: 'In progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'invoices', label: 'Invoices' }
  ];
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  return (
    <TableContainer>
      <TableHeader>
        <div>
          <TableTitle>{title}</TableTitle>
          <SubTitle>{subtitle}</SubTitle>
        </div>
      </TableHeader>
      
      <TabContainer>
        {tabs.map(tab => (
          <Tab 
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabContainer>
      
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>WPR no.</TableHeaderCell>
            <TableHeaderCell>Owner</TableHeaderCell>
            <TableHeaderCell>Serve name</TableHeaderCell>
            <TableHeaderCell>Court name</TableHeaderCell>
            <TableHeaderCell>Service type</TableHeaderCell>
            <TableHeaderCell>Deadline</TableHeaderCell>
            <TableHeaderCell>Process status</TableHeaderCell>
          </tr>
        </TableHead>
        <tbody>
          {currentData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.wpr}</TableCell>
              <TableCell>{row.owner}</TableCell>
              <TableCell>{row.serve}</TableCell>
              <TableCell>{row.court}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.deadline}</TableCell>
              <TableCell>
                <StatusBadge status={row.status}>
                  {row.status}
                </StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      
      <Pagination>
        <PaginationInfo>
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
        </PaginationInfo>
        <PaginationControls>
          <PaginationButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </PaginationButton>
          <PaginationButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </PaginationButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationButton 
              key={page}
              active={currentPage === page}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationButton>
          ))}
          
          <PaginationButton 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </PaginationButton>
          <PaginationButton 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </PaginationButton>
        </PaginationControls>
      </Pagination>
    </TableContainer>
  );
};

InstructionsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      wpr: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      owner: PropTypes.string.isRequired,
      serve: PropTypes.string.isRequired,
      court: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  ),
  title: PropTypes.string,
  subtitle: PropTypes.string
};

export default InstructionsTable; 