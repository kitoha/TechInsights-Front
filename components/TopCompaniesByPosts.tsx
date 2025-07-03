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
    <div className="space-y-3">
      {companies.map((company, index) => (
        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
            <Image src={company.logoImage} alt={company.name} width={32} height={32} className="object-contain w-full h-full" />
          </div>
          <span className="text-gray-900 font-medium truncate">{company.name}</span>
        </div>
      ))}
    </div>
  );
} 