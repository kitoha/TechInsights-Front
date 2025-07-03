export const rankStyles = [
  "text-yellow-500", // 1위
  "text-gray-400",   // 2위
  "text-amber-700",  // 3위
];

export const getRankStyle = (rank: number) =>
  rankStyles[rank] || "text-gray-400"; 