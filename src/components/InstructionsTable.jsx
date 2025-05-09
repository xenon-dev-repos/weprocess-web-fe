
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
                    active={activeTab === tab.id}
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
                      width={column.width}
                      align={column.align}
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
                          align={column.align}
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
                    <TableCell colSpan={columns.length} align="center">
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
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    border-radius: 10px;
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
  
  ${props => props.active && `
    font-weight: 500;
    color: #126456;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 16px);
      height: 2px;
      background-color: #126456;
    }
  `}

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
  
  @media (min-width: 1025px) {
    table-layout: fixed;
    width: 100%;
  }
  
  
  @media (max-width: 1024px) {
    table-layout: auto;
    min-width: 1024px; 
  }
`;

const TableHead = styled.thead`
  background-color: #F5F5F5;
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  font-family: 'Manrope', sans-serif;
  color: #656565;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  padding: 16px 12px;
  text-align: ${props => props.align || 'left'};
  vertical-align: middle;
  width: ${props => props.width || 'auto'};
  
  &:first-child {
    padding-left: 20px;
  }

  @media (max-width: 1024px) {
    padding: 10px 14px;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: ${props => props.$clickable ? 'rgba(18, 100, 86, 0.08)' : 'transparent'};
    cursor: ${props => props.clickable ? 'pointer' : 'default'};
  }

  ${props => props.$selected && `
    background-color: rgba(18, 100, 86, 0.08) !important;
  `}
`;

const TableCell = styled.td`
  padding: 16px;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0px;
  color: #1f2937;
  vertical-align: middle;
  text-align: ${props => props.align || 'left'};
  
  text-wrap: nowrap;
  
  // &:first-child {
  //   padding-left: 20px;
  // }

    @media (max-width: 1024px) {
    padding: 14px;
    font-size: 13px;
  }


  @media (max-width: 768px) {
    padding: 12px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 12px;
  }
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
