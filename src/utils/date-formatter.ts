export function formatDate({
  local = 'il',
  dateStyle = 'medium',
  date,
}: {
  local?;
  dateStyle?;
  date: string;
}) {
  return new Intl.DateTimeFormat(local, {
    dateStyle: dateStyle,
  }).format(new Date(date));
}
