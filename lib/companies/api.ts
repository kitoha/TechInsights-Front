import { PagedResponse } from "@/lib/shared/types";
import { Company, CompanyInfo, TrendingPost } from "@/lib/companies/types";
import { fetchBackendJson } from "@/lib/shared/server-fetch";

export async function fetchCompanyInfo(companyId: string): Promise<CompanyInfo | null> {
  try {
    const data = await fetchBackendJson<CompanyInfo>(`/api/v1/companies/${companyId}`, {
      revalidate: 300,
    });

    if (data) {
      return {
        name: data.name,
        logoImageName: data.logoImageName,
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
    const paramsObj = { page: 0, size: 5 };
    const data = await fetchBackendJson<PagedResponse<{ logoImageName: string; name: string; totalViewCount: number }>>("/api/v1/companies/top-by-views", {
      params: paramsObj,
      revalidate: 300,
    });

    if (Array.isArray(data?.content)) {
      return data.content
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
    const paramsObj = { page: 0, size: 30 };
    const data = await fetchBackendJson<PagedResponse<{ name: string; logoImageName: string }>>("/api/v1/companies", {
      params: paramsObj,
      revalidate: 300,
    });

    if (Array.isArray(data?.content)) {
      return data.content
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
