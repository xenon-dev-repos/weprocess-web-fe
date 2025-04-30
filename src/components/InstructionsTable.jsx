
import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const InstructionsTable = ({ data = [], title = "Instructions In Progress", subtitle = "Monthly instructions requested by firm" }) => {
  const [activeTab, setActiveTab] = useState('in-progress');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
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

  const handleRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };
  
  return (
    <TableContainer>
      <TableHeader>
        <HeaderText>
          <TableTitle>{title}</TableTitle>
          <SubTitle>{subtitle}</SubTitle>
        </HeaderText>
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
      </TableHeader>
      
      <ScrollableTableContainer>
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
              <TableRow 
                key={index}
                onClick={() => handleRowClick(index)}
                selected={selectedRow === index}
              >
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
      </ScrollableTableContainer>
      
      <Pagination>
        <PaginationInfo>
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
        </PaginationInfo>
        <PaginationControls>
          <PaginationArrowButton 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </PaginationArrowButton>
          <PaginationArrowButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </PaginationArrowButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationNumberButton 
              key={page}
              active={currentPage === page}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationNumberButton>
          ))}
          
          <PaginationArrowButton 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </PaginationArrowButton>
          <PaginationArrowButton 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </PaginationArrowButton>
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


const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const HeaderText = styled.div`
  margin-bottom: 16px;
  gap: 8px;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const TableTitle = styled.h3`
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const SubTitle = styled.p`
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
  padding: 0;

  @media (min-width: 768px) {
    justify-content: flex-end;
    padding: 0 20px;
    gap: 24px;
  }
`;

const Tab = styled.button`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  position: relative;
  color: #6b7280;
  min-width: max-content;
  
  ${props => props.active && `
    font-weight: 500;
    color: #126456;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 2px;
      background-color: #126456;
    }
  `}
`;

const ScrollableTableContainer = styled.div`
  overflow-x: auto;
  width: 100%;

  @media (min-width: 768px) {
    overflow-x: visible;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const TableHead = styled.thead`
  background-color: #F5F5F5;
  
  tr {
    th {
      &:first-child {
        padding-left: 20px;
      }
    }
  }
`;

const TableHeaderCell = styled.th`
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  padding: 16px 12px;
  text-align: left;
  vertical-align: middle;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: rgba(18, 100, 86, 0.08);
  }

  ${props => props.selected && `
    background-color: rgba(18, 100, 86, 0.08) !important;
  `}
`;

const TableCell = styled.td`
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0px;
  color: #1f2937;
  padding: 16px 12px;
  vertical-align: middle;
  
  &:first-child {
    padding-left: 20px;
  }
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

const Pagination = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 16px 20px;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
`;

const PaginationInfo = styled.p`
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const PaginationNumberButton = styled.button`
  font-family: 'Manrope', sans-serif;
  width: 32px;
  height: 32px;
  border-radius: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${props => props.active ? 'rgba(18, 100, 86, 0.2)' : 'transparent'};
  color: #126456;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '500'};
  
  &:hover {
    background-color: rgba(18, 100, 86, 0.2);
  }
`;

const PaginationArrowButton = styled.button`
  font-family: 'Manrope', sans-serif;
  padding: 6px;
  border: none;
  background: none;
  color: #126456;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;