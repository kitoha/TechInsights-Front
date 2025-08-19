import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getRankStyle } from "@/lib/rankingConfig";

interface RankingItemProps {
  rank: number;
  logo: string;
  name: string;
  score: number;
}

export function RankingItem({ rank, logo, name, score }: RankingItemProps) {
  return (
    <div className="flex items-center py-2 px-1 gap-3">
      <div className={`w-6 text-right font-bold text-lg ${getRankStyle(rank)}`}>{rank + 1}</div>
      <Avatar className="w-8 h-8">
        <AvatarImage src={logo} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 font-medium truncate text-gray-800 dark:text-gray-200">{name}</div>
      <div className="text-right tabular-nums font-semibold text-gray-800 dark:text-gray-200 min-w-[90px]">
        {score.toLocaleString()}회
      </div>
    </div>
  );
} 