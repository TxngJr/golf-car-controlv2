function formatDateThai(date: Date): string {
    const months: { [key: number]: string } = {
      0: 'มกราคม',
      1: 'กุมภาพันธ์',
      2: 'มีนาคม',
      3: 'เมษายน',
      4: 'พฤษภาคม',
      5: 'มิถุนายน',
      6: 'กรกฎาคม',
      7: 'สิงหาคม',
      8: 'กันยายน',
      9: 'ตุลาคม',
      10: 'พฤศจิกายน',
      11: 'ธันวาคม',
    };
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    return `วันที่ ${day} ${month} ${year} เวลา ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  export default formatDateThai;