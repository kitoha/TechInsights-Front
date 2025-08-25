import Image from "next/image";

interface Company {
  name: string;
  logoImage: string;
}

interface FeaturedCompaniesProps {
  companies: Company[];
}

export default function FeaturedCompanies({ companies }: FeaturedCompaniesProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {companies.map((company, idx) => (
        <div key={idx} className="flex flex-col items-center w-20">
          <Image
            src={company.logoImage}
            alt={company.name}
            width={40}
            height={40}
            className="rounded-full bg-white border border-gray-200 dark:border-gray-700"
          />
          <span className="mt-2 text-xs text-center text-gray-700 dark:text-gray-300 truncate w-full">{company.name}</span>
        </div>
      ))}
    </div>
  );
} 