import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { format, eachDayOfInterval, addDays, subDays, isWeekend, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { ChevronLeft, ChevronRight, Event } from '@mui/icons-material';

const PTOCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysToShow = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subDays(prevDate, daysToShow.length));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addDays(prevDate, daysToShow.length));
  };

  const findContinuousPTOPeriods = (ptoDates) => {
    if (!ptoDates.length) return [];
    
    const sortedDates = [...ptoDates].sort();
    const periods = [];
    let currentPeriod = [sortedDates[0]];

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = parseISO(sortedDates[i]);
      const previousDate = parseISO(sortedDates[i - 1]);
      
      if (Math.abs(currentDate.getTime() - previousDate.getTime()) === 24 * 60 * 60 * 1000) {
        currentPeriod.push(sortedDates[i]);
      } else {
        periods.push([...currentPeriod]);
        currentPeriod = [sortedDates[i]];
      }
    }
    periods.push(currentPeriod);
    return periods;
  };

  const columns = [
    {
      field: 'employee',
      headerName: 'Employees',
      width: 170,
      fixed: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        const initials = params.value
          .split(' ')
          .map(name => name[0])
          .join('');
        
        return (
          <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex', 
            alignItems: 'center',
            pl: 1,
            gap: 1.5,
            py: 1,
          }}>
            <Avatar sx={{ 
              width: 40, 
              height: 40,
              bgcolor: '#e1d7fb',
              color: '#1f1f20',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              border: '1px solid #fafafa',
              flexShrink: 0,
            }}>
              {initials}
            </Avatar>
            <Typography sx={{
              flex: 1,
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              lineHeight: 1.5,
              fontSize: '0.875rem',
            }}>
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    ...daysToShow.map((day) => ({
      field: format(day, 'yyyy-MM-dd'),
      headerName: format(day, 'EEE d'),
      description: format(day, 'MMMM d, yyyy'),
      minWidth: 32,
      width: 32,
      editable: true,
      type: 'boolean',
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => {
        const isCurrentDay = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
        
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            height: '100%',
            py: 0,
            justifyContent: 'center',
          }}>
            <Typography variant="body2" sx={{ 
              fontWeight: 'normal',
              color: isCurrentDay ? 'black' : 'text.secondary',
              fontSize: '0.75rem',
              lineHeight: 1,
              mb: 0,
            }}>
              {format(day, 'd')}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: isCurrentDay ? 'black' : 'text.secondary',
              fontSize: '0.70rem',
              lineHeight: 1,
              mt: 0,
            }}>
              {format(day, 'EEE')}
            </Typography>
          </Box>
        );
      },
      renderCell: (params) => {
        const ptoPeriods = findContinuousPTOPeriods(samplePTOData[params.row.employee] || []);
        const currentPeriod = ptoPeriods.find(period => period.includes(params.field));
        const isCurrentDay = params.field === format(new Date(), 'yyyy-MM-dd');
        
        return (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: isCurrentDay 
                ? '#2074b3'
                : currentPeriod 
                  ? '#f5f5f5' 
                  : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentPeriod 
                ? isCurrentDay 
                  ? '#ffffff' 
                  : '#2074b3' 
                : 'transparent',
              '&:hover': {
                backgroundColor: isCurrentDay
                  ? '#1a5c8f'
                  : currentPeriod 
                    ? '#eeeeee' 
                    : '#e3f2fd',
              },
              borderRight: '0.7px solid #e0e0e0',
            }}
          >
            {currentPeriod && (
              <Event sx={{ fontSize: '1rem' }} />
            )}
          </Box>
        );
      }
    })),
  ];

  const samplePTOData = {
    'Faustino Shields': ['2025-03-11', '2025-03-12', '2025-03-13'],
    'Aliya Schinner': ['2025-03-20', '2025-03-21', '2025-03-22'],
    'Damien Roob': ['2025-03-25', '2025-03-26'],
    'Mae Flatley': ['2025-03-18', '2025-03-19'],
    'Loraine Stracke': ['2025-03-28', '2025-03-29'],
  };

  const rows = Object.entries(samplePTOData).map(([name, ptoDates], index) => {
    const row = {
      id: index + 1,
      employee: name,
    };
    
    daysToShow.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      row[dateStr] = ptoDates.includes(dateStr);
    });
    
    return row;
  });

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <IconButton onClick={handlePreviousMonth} size="small">
          <ChevronLeft />
        </IconButton>
        <Typography variant="h4" sx={{ flex: 1, textAlign: 'center' }}>
          {format(daysToShow[0], 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight />
        </IconButton>
      </Box>
      <Box sx={{ 
        height: 430,
        width: '100%', 
        overflow: 'hidden' 
      }}>
        <Box sx={{ 
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          overflow: 'hidden',
          height: '100%',
          pt: 5,
        }}>
          <Box sx={{ height: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection={false}
              disableSelectionOnClick
              hideFooter
              disableExtendRowFullWidth
              columnHeaderHeight={40}
              rowHeight={65}
              experimentalFeatures={{ newEditingApi: true }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-main': {
                  border: 'none',
                },
                '& .MuiDataGrid-virtualScroller': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  cursor: 'pointer',
                  p: 0,
                  borderRight: '0.7px solid #e0e0e0',
                },
                '& .MuiDataGrid-columnHeader': {
                  p: 0,
                  borderRight: '0.7px solid #e0e0e0',
                  backgroundColor: '#fafafa',
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  p: 0,
                  fontSize: '0.75rem',
                },
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: '0.7px solid #e0e0e0',
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: 'rgba(250,250,250,255)',
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none',
                },
                '& .MuiDataGrid-cell[data-field="employee"]': {
                  padding: '12px 8px',
                },
                '& .MuiDataGrid-columnHeader[data-field="employee"]': {
                  padding: '8px',
                  '& .MuiDataGrid-columnHeaderTitleContainer': {
                    pl: 2,
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PTOCalendar;
