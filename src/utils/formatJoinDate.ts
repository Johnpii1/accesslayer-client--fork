export function formatJoinDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (diffDays === 0) {
    return 'Joined today';
  }
  
  if (diffDays < 30) {
    return `Joined ${rtf.format(-diffDays, 'day').replace(' ago', ' ago')}`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `Joined ${rtf.format(-diffMonths, 'month')}`;
  }
  
  const diffYears = Math.floor(diffDays / 365);
  return `Joined ${rtf.format(-diffYears, 'year')}`;
}
