
// Format time as HH:MM
export const formatTime = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Calculate working hours and extra hours
export const calculateWorkingHours = (clockIn: string, clockOut: string): { workTime: string, extraHours: string } => {
  if (!clockIn || !clockOut) {
    // Both missing - mark as day off
    if (!clockIn && !clockOut) {
      return { workTime: '00:00', extraHours: '00:00' };
    }
    // One is missing - standard 4:30 work time
    return { workTime: '04:30', extraHours: '00:00' };
  }
  
  // Handle special case for FOLGA
  if (clockIn === 'FOLGA' || clockOut === 'FOLGA') {
    return { workTime: '00:00', extraHours: '00:00' };
  }
  
  // Handle special cases for missing data
  if (clockIn === 'nao entrada' || clockOut === 'nao saida') {
    return { workTime: '04:30', extraHours: '00:00' };
  }

  try {
    // Parse time strings
    const [inHours, inMinutes] = clockIn.split(':').map(Number);
    const [outHours, outMinutes] = clockOut.split(':').map(Number);
    
    // Calculate total hours
    let totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts
    
    const workHours = totalMinutes / 60;
    const workTime = formatTime(workHours);
    
    // Calculate extra hours (if work time > 8 hours)
    const extraMinutes = Math.max(0, totalMinutes - 8 * 60); // 8 hours = 480 minutes
    const extraHourTime = extraMinutes > 0 ? formatTime(extraMinutes / 60) : '00:00';
    
    return { workTime, extraHours: extraHourTime };
  } catch (error) {
    console.error("Error calculating work time:", error);
    return { workTime: '00:00', extraHours: '00:00' };
  }
};

// Format month in Portuguese
export const formatMonthInPortuguese = (monthIndex: number): string => {
  const months = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL',
    'MAIO', 'JUNHO', 'JULHO', 'AGOSTO',
    'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];
  return months[monthIndex];
};

// Format date in Portuguese with uppercase month
export const formatDateInPortuguese = (date: Date): string => {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  return `${day} DE ${formatMonthInPortuguese(monthIndex)}`;
};
