
// dd/mm/yyyy format
export  const formatDate = (dateString : string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // gives dd/mm/yyyy
};


// time in hh:mm:ss format
export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

