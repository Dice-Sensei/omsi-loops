export const saveTextFile = (content: string, title: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.txt`;
  a.click();

  URL.revokeObjectURL(url);
  a.remove();
};
