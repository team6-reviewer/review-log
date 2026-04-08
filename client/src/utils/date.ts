/**
 * 날짜 문자열을 한국 시간대로 바꾸어 "yyyy-MM-dd" 형식으로 반환하는 함수
 * @param dateString 날짜 문자열 (예: "2026-04-08T15:00:00Z")
 * @returns
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  // 날짜가 유효하지 않은 경우 예외 처리
  if (isNaN(date.getTime())) return dateString;

  // 한국 시간(KST)은 UTC보다 9시간 빠름
  const KOREA_TIME_DIFF = 9 * 60 * 60 * 1000;
  const korDate = new Date(date.getTime() + KOREA_TIME_DIFF);
  const year = korDate.getUTCFullYear();
  const month = String(korDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(korDate.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
