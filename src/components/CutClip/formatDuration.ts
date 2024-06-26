export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  const fractionalSeconds = seconds.toString().split('.')[1] || '0';

  return `${hours}:${minutes}:${sec}.${fractionalSeconds}`;
};
