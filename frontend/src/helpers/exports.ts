export const exportAsCSV = (
  header: string[],
  data: unknown[][],
  filename: string,
) => {
  const rows = data.map((i) => i.join(","));
  const csvData = [header, ...rows].join("\n");

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};
