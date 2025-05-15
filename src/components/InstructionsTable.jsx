import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const InstructionsTable = ({
  data = [],
  title = "Instructions",
  subtitle = "",
  tabs = [],
  columns = [],
  onTabChange = () => {},
  customFilters = null,
  renderCell = null,
  itemsPerPage = 5,
  showPagination = true,
  onRowClick = null,
  minHeight  = 'auto',
  noDataCellHeight,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (rowData, index) => {
    setSelectedRow(index === selectedRow ? null : index);
    if (onRowClick) {
      onRowClick(rowData);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    onTabChange(tabId);
  };
  
  return (
    <TableContainer>
      <TableHeader>
        <HeaderText>
          <TableTitle>{title}</TableTitle>
          {subtitle && <SubTitle>{subtitle}</SubTitle>}
        </HeaderText>
        
        <FiltersContainer>
          {customFilters ? (
            customFilters
          ) : (
            tabs.length > 0 && (
              <TabContainer>
                {tabs.map(tab => (
                  <Tab 
                    key={tab.id}
                    $active={activeTab === tab.id}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    {tab.label}
                  </Tab>
                ))}
              </TabContainer>
            )
          )}
        </FiltersContainer>
      </TableHeader>

      <TableContentContainer style={{minHeight: minHeight}}>
      {/* {currentData.length > 0 ? (
        <> */}
          <ScrollableTableContainer>
            <Table>
              <TableHead>
                <tr>
                  {columns.map(column => (
                    <TableHeaderCell 
                      key={column.key} 
                      $width={column.width}
                      $align={column.align}
                    >
                      {column.header}
                    </TableHeaderCell>
                  ))}
                </tr>
              </TableHead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((row, index) => (
                    <TableRow 
                      key={index}
                      onClick={() => handleRowClick(row, index)}
                      $selected={selectedRow === index}
                      $clickable={!!onRowClick}
                    >
                      {columns.map(column => (
                        <TableCell 
                          key={column.key}
                          $align={column.align}
                        >
                          {renderCell 
                            ? renderCell(column.key, row[column.key], row, index)
                            : row[column.key]
                          }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <EmptyStateContainerRow style={{height: noDataCellHeight}}>
                    <TableCell colSpan={columns.length} $align="center">
                      No data available
                    </TableCell>
                  </EmptyStateContainerRow>
                )}
              </tbody>
            </Table>
          </ScrollableTableContainer>
          {showPagination && data.length > itemsPerPage && (
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
                  $active={currentPage === page}
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
          )}
        {/* </>
        ) : (
          <EmptyStateContainer>
            <EmptyStateMessage>No data available</EmptyStateMessage>
          </EmptyStateContainer>
        )} */}
      </TableContentContainer>
    </TableContainer>
  );
};

InstructionsTable.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      width: PropTypes.string,
      align: PropTypes.oneOf(['left', 'center', 'right']),
    })
  ).isRequired,
  onTabChange: PropTypes.func,
  customFilters: PropTypes.node,
  renderCell: PropTypes.func,
  itemsPerPage: PropTypes.number,
  showPagination: PropTypes.bool,
  onRowClick: PropTypes.func,
  minHeight : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noDataCellHeight : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const TableContainer = styled.div`
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    border-radius: 16px;
  }
`;

const TableHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    gap: 24px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (min-width: 768px) {
    gap: 8px;
  }
`;

const TableTitle = styled.h3`
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const SubTitle = styled.p`
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #6b7280;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
  padding: 0;

  @media (min-width: 768px) {
    justify-content: flex-end;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 6px;
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
  padding: 8px 12px;
  cursor: pointer;
  position: relative;
  color: #6b7280;
  min-width: max-content;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  
  ${props => props.$active && `
    font-weight: 500;
    color: #126456;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #126456;
      transition: all 0.2s ease-in-out;
    }
  `}

  &:hover {
    color: #126456;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${props => props.$active ? '#126456' : '#12645680'};
      transition: all 0.2s ease-in-out;
    }
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 6px 10px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 4px 8px;
  }
`;


const TableContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  // min-height: ${props => typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight};
  flex-grow: 1;
  position: relative;
  padding: 0 24px 24px;

  @media (min-width: 768px) {
    padding: 0 24px 24px;
  }

  @media (max-width: 480px) {
    padding: 0 16px 16px;
  }
`;

const ScrollableTableContainer = styled.div`
  // overflow-x: auto;
  margin-bottom: 16px;
  flex: 1;
  

  @media (max-width: 1024px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; 
  }

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const EmptyStateContainerRow = styled.tr`
  height: 309px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TableHead = styled.thead`
  background-color: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: ${props => props.$align || 'left'};
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #4B5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: ${props => props.$width || 'auto'};

  @media (min-width: 1700px) {
    width: ${props => {
      switch (props.$width) {
        case 'wpr': return '150px';
        case 'owner': return '200px';
        case 'serve': return '250px';
        case 'court': return '250px';
        case 'type': return '180px';
        case 'deadline': return '150px';
        case 'status': return '150px';
        case 'invoice_number': return '150px';
        case 'title': return '300px';
        case 'price': return '150px';
        case 'is_paid': return '120px';
        case 'paid_at': return '150px';
        default: return 'auto';
      }
    }};
  }

  @media (min-width: 1440px) and (max-width: 1699px) {
    width: ${props => {
      switch (props.$width) {
        case 'wpr': return '130px';
        case 'owner': return '180px';
        case 'serve': return '220px';
        case 'court': return '220px';
        case 'type': return '160px';
        case 'deadline': return '130px';
        case 'status': return '130px';
        case 'invoice_number': return '130px';
        case 'title': return '250px';
        case 'price': return '130px';
        case 'is_paid': return '100px';
        case 'paid_at': return '130px';
        default: return 'auto';
      }
    }};
  }

  @media (max-width: 1439px) {
    width: ${props => {
      switch (props.$width) {
        case 'wpr': return '110px';
        case 'owner': return '160px';
        case 'serve': return '200px';
        case 'court': return '200px';
        case 'type': return '140px';
        case 'deadline': return '110px';
        case 'status': return '110px';
        case 'invoice_number': return '110px';
        case 'title': return '200px';
        case 'price': return '110px';
        case 'is_paid': return '90px';
        case 'paid_at': return '110px';
        default: return 'auto';
      }
    }};
  }
`;

const TableRow = styled.tr`
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  background-color: ${props => props.$selected ? '#F3F4F6' : 'white'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.$clickable ? '#F9FAFB' : 'white'};
  }
`;

const TableCell = styled.td`
  padding: 16px;
  text-align: ${props => props.$align || 'left'};
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #1F2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0;
  border-bottom: 1px solid #E5E7EB;
`;

const Pagination = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding-top: 5px;
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

  @media (max-width: 480px) {
    font-size: 12px;
  }
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
  background-color: ${props => props.$active ? 'rgba(18, 100, 86, 0.2)' : 'transparent'};
  color: #126456;
  cursor: pointer;
  font-weight: ${props => props.$active ? '600' : '500'};
  
  &:hover {
    background-color: rgba(18, 100, 86, 0.2);
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 12px;
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

export default InstructionsTable;
