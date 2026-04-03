export interface TagItem {
  id: number;
  tagname: string;
  type: "genre" | "mood";
}

export const GENRE_TAGS: TagItem[] = [
  { id: 1, tagname: "SF", type: "genre" },
  { id: 2, tagname: "로맨스", type: "genre" },
  { id: 3, tagname: "스릴러", type: "genre" },
  { id: 4, tagname: "드라마", type: "genre" },
  { id: 5, tagname: "공포", type: "genre" },
  { id: 6, tagname: "액션", type: "genre" },
  { id: 7, tagname: "판타지", type: "genre" },
  { id: 8, tagname: "예술", type: "genre" },
  { id: 9, tagname: "코미디", type: "genre" },
  { id: 10, tagname: "인문", type: "genre" },
  { id: 11, tagname: "자기계발", type: "genre" },
  { id: 12, tagname: "추리", type: "genre" },
  { id: 13, tagname: "미스터리", type: "genre" },
  { id: 14, tagname: "에세이", type: "genre" },
  { id: 15, tagname: "스토리", type: "genre" },
  { id: 16, tagname: "스포츠", type: "genre" },
  { id: 17, tagname: "애니메이션", type: "genre" },
];

export const MOOD_TAGS: TagItem[] = [
  { id: 18, tagname: "잔잔한", type: "mood" },
  { id: 19, tagname: "몽환적인", type: "mood" },
  { id: 20, tagname: "유쾌한", type: "mood" },
  { id: 21, tagname: "무거운", type: "mood" },
  { id: 22, tagname: "우울한", type: "mood" },
  { id: 23, tagname: "신나는", type: "mood" },
  { id: 24, tagname: "속도감 있는", type: "mood" },
  { id: 25, tagname: "무서운", type: "mood" },
  { id: 26, tagname: "흥미진진한", type: "mood" },
  { id: 27, tagname: "따듯한", type: "mood" },
  { id: 28, tagname: "어두운", type: "mood" },
  { id: 29, tagname: "청량한", type: "mood" },
  { id: 30, tagname: "서정적인", type: "mood" },
  { id: 31, tagname: "유익한", type: "mood" },
  { id: 32, tagname: "현실적인", type: "mood" },
  { id: 33, tagname: "철학적인", type: "mood" },
  { id: 34, tagname: "여운이 남는", type: "mood" },
  { id: 35, tagname: "애절한", type: "mood" },
  { id: 36, tagname: "감동적인", type: "mood" },
];
