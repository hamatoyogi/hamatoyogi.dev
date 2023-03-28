export function formatDate({
  local = 'il',
  dateStyle = 'medium',
  date,
}: {
  local?;
  dateStyle?;
  date: string | number;
}) {
  try {
    return new Intl.DateTimeFormat(local, {
      dateStyle: dateStyle,
    })?.format(new Date(date));
  } catch (e) {
    return 'invalid date';
  }
}
