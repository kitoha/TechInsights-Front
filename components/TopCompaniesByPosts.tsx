import Image from "next/image";

interface Company {
  name: string;
  logoImage: string;
}

interface TopCompaniesByPostsProps {
  companies: Company[];
}

export default function TopCompaniesByPosts({ companies }: TopCompaniesByPostsProps) {
  return (
    <div className="flex flex-col gap-3">
      {companies.map((company, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <span className="w-6 text-center font-bold text-lg text-emerald-600 dark:text-emerald-400">{idx + 1}</span>
          <Image
            src={company.logoImage}
            alt={company.name}
            width={28}
            height={28}
            className="rounded-full bg-white border border-gray-200 dark:border-gray-700"
          />
          <span className="flex-1 truncate font-medium text-gray-800 dark:text-gray-200">{company.name}</span>
        </div>
      ))}
    </div>
  );
} 