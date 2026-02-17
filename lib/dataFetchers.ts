import { apiGet } from './api';
import { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';
import { Post, Company, TrendingPost, ApiResponse, RecommendedPost } from './types';

// 게시물 데이터 페칭
export async function fetchPosts(
  page: number = 0,
  category: string = "All"
): Promise<{ content: Post[]; totalPages: number }> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`;
    const paramsObj = {
      page,
      size: 10,
      ...(category && category !== "All" ? { category } : {})
    };
    
    const res = await apiGet<ApiResponse<Post>>(url, { params: paramsObj });

    if (res && typeof res === 'object' && 'data' in res && res.data && 'content' in res.data) {
      return {
        content: res.data.content,
        totalPages: res.data.totalPages
      };
    }
    
    return { content: [], totalPages: 1 };
  } catch (error: unknown) {
    const status: number | undefined = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 503) {
      redirect('/maintenance.html');
    }
    console.error('Posts fetch error:', error);
    return { content: [], totalPages: 1 };
  }
}

// 회사별 게시물 데이터 페칭
export async function fetchPostsByCompany(
  companyId: string,
  page: number = 0
): Promise<{ content: Post[]; totalPages: number }> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`;
    const paramsObj = {
      page,
      size: 10,
      companyId
    };
    
    const res = await apiGet<ApiResponse<Post>>(url, { params: paramsObj });

    if (res && typeof res === 'object' && 'data' in res && res.data && 'content' in res.data) {
      return {
        content: res.data.content,
        totalPages: res.data.totalPages
      };
    }
    
    return { content: [], totalPages: 1 };
  } catch (error: unknown) {
    const status: number | undefined = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 503) {
      redirect('/maintenance.html');
    }
    console.error('Company posts fetch error:', error);
    return { content: [], totalPages: 1 };
  }
}

export async function fetchCompanyInfo(companyId: string): Promise<{ name: string; logoImageName: string } | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies/${companyId}`;
    const res = await apiGet<{ name: string; logoImageName: string }>(url);
    
    if (res && typeof res === 'object' && 'data' in res && res.data) {
      return {
        name: res.data.name,
        logoImageName: res.data.logoImageName
      };
    }
    
    return null;
  } catch (error) {
    console.error('Company info fetch error:', error);
    return null;
  }
}

// 트렌딩 회사 데이터 페칭
export async function fetchTrendingCompanies(): Promise<TrendingPost[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies/top-by-views`;
    const paramsObj = { page: 0, size: 5 };
    const res = await apiGet<ApiResponse<{logoImageName: string; name: string; totalViewCount: number}>>(url, {
      params: paramsObj
    });
    
    if (res && typeof res === 'object' && 'data' in res && res.data && 'content' in res.data && Array.isArray(res.data.content)) {
      return res.data.content
        .filter((company) => company.logoImageName && company.logoImageName.trim() !== '')
        .map((company): TrendingPost => ({
          logoImage: `/logos/${company.logoImageName}`,
          title: typeof company.name === 'string' ? (company.name.length > 20 ? `${company.name.slice(0, 20)}...` : company.name) : '',
          viewCount: company.totalViewCount ?? 0
        }));
    }
    
    return [];
  } catch (error) {
    console.error('Companies fetch error:', error);
    return [];
  }
}

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies`;
    const paramsObj = { page: 0, size: 30 };
    const res = await apiGet<ApiResponse<{name: string; logoImageName: string}>>(url, {
      params: paramsObj
    });
    
    if (res && typeof res === 'object' && 'data' in res && res.data && 'content' in res.data && Array.isArray(res.data.content)) {
      return res.data.content
        .filter((company) => company.logoImageName && company.logoImageName.trim() !== '')
        .map((company): Company => ({
          name: company.name,
          logoImage: `/logos/${company.logoImageName}`
        }));
    }
    
    return [];
  } catch (error) {
    console.error('Companies fetch error:', error);
    return [];
  }
}

export async function fetchRecommendedPosts(): Promise<RecommendedPost[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/recommendations`;
    const res = await apiGet<{postId: string; title: string; logoImageName: string}[]>(url);

    if (res && typeof res === 'object' && 'data' in res && res.data && Array.isArray(res.data)) {
      return res.data.map((item) => ({
        postId: item.postId,
        title: item.title,
        logoImageName: item.logoImageName,
      }));
    }

    return [];
  } catch {
    return [];
  }
}
