import { cn } from "@/lib/utils";

const tagStyles = {
  type: {
    // 영화/도서 태그는 항상 이 스타일로만 고정
    unselected:
      "bg-tag-blue-bg text-tag-blue-text border-tag-blue-text cursor-default",
    selected: "bg-tag-blue-text text-tag-blue-bg border-tag-blue-text", // 실제론 안 쓰임
  },
  genre: {
    unselected: "bg-tag-green-bg text-tag-green-text border-tag-green-text",
    selected: "bg-tag-green-text text-tag-green-bg border-tag-green-text",
  },
  mood: {
    unselected: "bg-tag-purple-bg text-tag-purple-text border-tag-purple-text",
    selected: "bg-tag-purple-text text-tag-purple-bg border-tag-purple-text",
  },
};

interface TagProps {
  label: string;
  type: "type" | "genre" | "mood";
  isSelected?: boolean;
  onClick?: () => void;
}

export default function Tag({
  label,
  type,
  isSelected = false,
  onClick,
}: TagProps) {
  const styles = tagStyles[type];

  // type이 "type"이면 강제로 선택 해제 상태로 고정
  const isTypeTag = type === "type";
  const activeSelected = isTypeTag ? false : isSelected;

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        "px-2 py-1 rounded-lg text-[16px] font-medium transition-all duration-200 border",
        activeSelected ? styles.selected : styles.unselected,
      )}
    >
      {label}
    </button>
  );
}
