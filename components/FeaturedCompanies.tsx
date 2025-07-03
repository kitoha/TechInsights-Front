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
    <div className="space-y-3">
      {companies.map((company, index) => (
        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
            <Image src={company.logoImage} alt={company.name} width={40} height={40} className="object-contain w-full h-full" />
          </div>
          <span className="text-gray-900 font-medium truncate">{company.name}</span>
        </div>
      ))}
    </div>
  );
} 