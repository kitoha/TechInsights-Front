import { apiGet } from "@/lib/shared/api";
import { PagedResponse } from "@/lib/shared/types";
import { Company, CompanyInfo, TrendingPost } from "@/lib/companies/types";

export async function fetchCompanyInfo(companyId: string): Promise<CompanyInfo | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies/${companyId}`;
    const res = await apiGet<CompanyInfo>(url);

    if (res?.data) {
      return {
        name: res.data.name,
        logoImageName: res.data.logoImageName,
      };
    }

    return null;
  } catch (error) {
    console.error("Company info fetch error:", error);
    return null;
  }
}

export async function fetchTrendingCompanies(): Promise<TrendingPost[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies/top-by-views`;
    const paramsObj = { page: 0, size: 5 };
    const res = await apiGet<PagedResponse<{ logoImageName: string; name: string; totalViewCount: number }>>(url, {
      params: paramsObj,
    });

    if (Array.isArray(res?.data?.content)) {
      return res.data.content
        .filter((company) => company.logoImageName && company.logoImageName.trim() !== "")
        .map(
          (company): TrendingPost => ({
            logoImage: `/logos/${company.logoImageName}`,
            title:
              typeof company.name === "string"
                ? company.name.length > 20
                  ? `${company.name.slice(0, 20)}...`
                  : company.name
                : "",
            viewCount: company.totalViewCount ?? 0,
          })
        );
    }

    return [];
  } catch (error) {
    console.error("Companies fetch error:", error);
    return [];
  }
}

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies`;
    const paramsObj = { page: 0, size: 30 };
    const res = await apiGet<PagedResponse<{ name: string; logoImageName: string }>>(url, {
      params: paramsObj,
    });

    if (Array.isArray(res?.data?.content)) {
      return res.data.content
        .filter((company) => company.logoImageName && company.logoImageName.trim() !== "")
        .map(
          (company): Company => ({
            name: company.name,
            logoImage: `/logos/${company.logoImageName}`,
          })
        );
    }

    return [];
  } catch (error) {
    console.error("Companies fetch error:", error);
    return [];
  }
}
