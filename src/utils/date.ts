import dayjs from "dayjs";

export const formatFirestoreDate = (
  val: any,
  format: string = "DD/MM/YYYY HH:mm:ss"
): string => {
  if (!val) return "N/A";

  if (val._seconds) {
    const date = new Date(val._seconds * 1000 + val._nanoseconds / 1e6);
    return dayjs(date).format(format);
  }

  const date = new Date(val);
  if (!isNaN(date.getTime())) {
    return dayjs(date).format(format);
  }

  return "Invalid Date";
};
