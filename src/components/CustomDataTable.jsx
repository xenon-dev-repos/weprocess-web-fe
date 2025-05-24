import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { StatSubtitle, StatTitle } from './dashboard/StatCard';

const CustomDataTable = ({
  data = [],
  title = "Instructions",
  subtitle = "",
  tabs = [],
  columns = [],
  onTabChange = () => {},
  customFilters = null,
  onRowClick = null,
  minHeight = 'auto',
  noDataCellHeight,
  loading = false,
  error = null,
  serverSidePagination = false,
  itemsPerPage = 5,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  showPagination = true,
  onPageChange = () => {},
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [selectedRow, setSelectedRow] = useState(null);
  
 // For client-side pagination (if needed)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = serverSidePagination ? data : data.slice(startIndex, endIndex);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
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
    onTabChange(tabId);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      if (currentPage <= 3) {
        pageNumbers.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pageNumbers;
  };
  
  return (
    <TableContainer>
      <TableHeader>
        <HeaderText>
          <StatTitle>{title}</StatTitle>
          {subtitle && <StatSubtitle>{subtitle}</StatSubtitle>}
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

      <TableContentContainer style={{ minHeight: minHeight }}>
          <ScrollableTableContainer style={{ minHeight: minHeight+18 }}>
            <Table>
              <TableHead $hasData={currentData.length > 0}>
                <HeaderRow>
                  {columns.map(column => (
                    <TableHeaderCell 
                      key={column.key} 
                      $width={column.width}
                      $align={column.align}
                    >
                      {column.header}
                    </TableHeaderCell>
                  ))}
                </HeaderRow>
              </TableHead>
              <tbody>
                {loading ? (
                  <EmptyStateContainerRow style={{ height: noDataCellHeight }}>
                    <EmptyTableCell colSpan={columns.length} $align="center">
                      Loading...
                    </EmptyTableCell>
                  </EmptyStateContainerRow>
                ) : error ? (
                  <EmptyStateContainerRow style={{ height: noDataCellHeight }}>
                    <EmptyTableCell colSpan={columns.length} $align="center">
                      {error}
                    </EmptyTableCell>
                  </EmptyStateContainerRow>
                ) : currentData.length > 0 ? (
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
                          {(column.key === 'status' || column.key === 'is_paid') ? (
                            <StatusBadge $status={row[column.key]}>
                              {column.key === 'is_paid' ? (row[column.key] ? 'Paid' : 'Pending') : row[column.key]}
                            </StatusBadge>
                          ) : (
                            row[column.key]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <EmptyStateContainerRow style={{ height: noDataCellHeight }}>
                    <EmptyTableCell colSpan={columns.length} $align="center">
                      No data available
                    </EmptyTableCell>
                  </EmptyStateContainerRow>
                )}
              </tbody>
            </Table>
          </ScrollableTableContainer>

          {showPagination && !loading && !error && totalItems > 0 && (
            <Pagination>
              <PaginationInfo>
                Showing {data.length > 0 ? startIndex + 1 : 0} to {Math.min(
                  serverSidePagination 
                    ? (currentPage - 1) * itemsPerPage + data.length 
                    : endIndex, 
                  totalItems
                )} of {totalItems} {totalItems === 1 ? 'entry' : 'entries'}
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
                
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <PaginationEllipsis key={`ellipsis-${index}`}>...</PaginationEllipsis>
                  ) : (
                    <PaginationNumberButton 
                      key={page}
                      $active={currentPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationNumberButton>
                  )
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
          
      </TableContentContainer>
    </TableContainer>
  );
};

CustomDataTable.propTypes = {
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
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  totalItems: PropTypes.number,
  showPagination: PropTypes.bool,
  onPageChange: PropTypes.func,
  onRowClick: PropTypes.func,
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noDataCellHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
  error: PropTypes.string,
  serverSidePagination: PropTypes.bool,
};

const TableContainer = styled.div`
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
`;

// const TableContainer = styled.div`
//   background-color: white;
//   border-radius: 24px;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//   overflow: hidden;
//   display: flex;
//   flex-direction: column;
//   height: 100%;

//   @media (max-width: 768px) {
//     border-radius: 16px;
//   }
// `;

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
  gap: 2px;

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
  margin-top: -4px;

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
  flex-grow: 1;
  position: relative;
  padding: 0 24px 24px;

  @media (max-width: 768px) {
    padding: 0 16px 16px;
  }
`;

const ScrollableTableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 16px;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;

  // &::-webkit-scrollbar {
  //   height: 8px;
  // }

  // &::-webkit-scrollbar-track {
  //   background: transparent;
  // }

  // &::-webkit-scrollbar-thumb {
  //   background-color: #E5E7EB;
  //   border-radius: 4px;
  // }

  // @media (min-width: 1024px) {
  //   overflow-x: visible;
  // }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;

  @media (max-width: 1023px) {
    width: max-content;
    min-width: 100%;
  }
`;

const TableHead = styled.thead`
  background-color: #F9FAFB;
  border-bottom: ${props => props.$hasData ? '1px solid #E5E7EB' : ''};
`;

const HeaderRow = styled.tr`
  background-color: #F9FAFB;
  border-radius: 16px;
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: ${props => props.$align || 'left'};
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #4B5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  border-bottom: 1px solid #E5E7EB;

  &:first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  &:last-child {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  /* Dynamic width calculation based on viewport width */
  width: ${props => {
    // Base widths for different column types (now matching exactly with keys)
    const baseWidths = {
      // From columns array
      id: 80,          // WPR no.
      owner: 120,       // Owner
      title: 120,       // Serve name
      service_type: 110,        // Service type
      issuing_court: 160, // Court name
      recipient_name: 160, // Recipient's Name
      recipient_address: 160, // Recipient's Address
      date_issued: 120,  // Date Issued
      deadline: 120,     // Deadline
      is_paid: 100,      // Process status
      status: 120,
      invoice_number: 120,
      price: 120,
      paid_at: 120
    };

    // Get the appropriate width key (fallback to 'id' if not specified)
    const widthKey = props.$width || 'id';
    const baseWidth = baseWidths[widthKey] || baseWidths['id'];

    // Scale factor based on viewport width
    const viewportWidth = window.innerWidth;
    let scaleFactor = 1;
    
    if (viewportWidth >= 1700) {
      scaleFactor = 1.2;
    } else if (viewportWidth >= 1440) {
      scaleFactor = 1.1;
    } else if (viewportWidth >= 1280) {
      scaleFactor = 1;
    } else {
      scaleFactor = 0.9;
    }

    // Calculate the final width with minimum of 80px
    const calculatedWidth = Math.max(baseWidth * scaleFactor, 80);
    
    return `${calculatedWidth}px`;
  }};
`;

const TableRow = styled.tr`
  height: 63px;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  background-color: ${props => props.$selected ? '#F3F4F6' : 'white'};
  transition: background-color 0.2s ease;
  border-radius: 20px;

  &:hover {
    background-color: ${props => props.$clickable ? '#F0F6E3' : 'white'};
  }

  td:first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  td:last-child {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
`;

const TableCell = styled.td`
  padding: 16px;
  text-align: ${props => props.$align || 'left'};
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #222222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0;
`;

const EmptyStateContainerRow = styled.tr`
  height: ${props => props.height || '309px'};
`;

const EmptyTableCell = styled.td`
  text-align: ${props => props.$align || 'center'};
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

const Pagination = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding-top: 12px;
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

const PaginationEllipsis = styled.span`
  padding: 0 8px;
  color: #6B7280;
  font-size: 14px;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  
  ${props => {

    // if (!props.$status) {
    //   return 'background-color: #e5e7eb; color: #374151;';
    // }

    // Convert to string and lowercase for comparison
    const status = String(props.$status).toLowerCase().trim();
    
    switch (status) {
      case '1st attempt':
      case 'new':
      case 'paid':
      case '1':
        return 'background-color: #D4F8D3; color: #008000;';
      case '2nd attempt':
      case 'pending':
      case 'un_paid':
      case '0':
        return 'background-color: #FFF0BB; color: #E78E00;';
      case '3rd attempt':
        return 'background-color: #FFE5E5; color: #B71C1C;';
      case 'in transit':
        return 'background-color: #F2F2F2; color: #6585FE;';
      case 'completed':
        return 'background-color: #8B5CF6; color: white;';
      case 'active':
        return 'background-color: #FF5B5B; color: white;';
      case 'on_hold':
        return 'background-color: #6B7280; color: white;';
      default:
        return 'background-color: #e5e7eb; color: #374151;';
    }
  }}
`;

export default CustomDataTable;