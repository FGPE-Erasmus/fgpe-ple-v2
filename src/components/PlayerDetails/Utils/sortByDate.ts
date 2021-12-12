export const sortByDate = () => (rowA: any, rowB: any) => {
  const a = new Date(rowA.original.submittedAt);

  const b = new Date(rowB.original.submittedAt);

  if (a > b) return 1;

  if (b > a) return -1;

  return 0;
};
