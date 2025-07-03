# Tech Insights Frontend

이 프로젝트는 기술 블로그 포스트를 모아서 보여주는 프론트엔드 애플리케이션입니다.

## 환경 설정

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

프로덕션 환경에서는 실제 API 서버 URL로 변경하세요:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### 로고 이미지 설정

`public/logos/` 디렉토리에 회사 로고 이미지들을 추가하세요. 이미지 파일명은 API 응답의 `logoImageName` 필드와 일치해야 합니다.

예시:
- `public/logos/socar.png`
- `public/logos/woowahan.png`
- `public/logos/kakao.png`
- `public/logos/toss.png`
- `public/logos/naver_d2.png`
- `public/logos/line.png`
- `public/logos/banksalad.png`
- `public/logos/aws.png`
- `public/logos/hyperconnect.png`
- `public/logos/kurly.png`

## 설치 및 실행

```bash
npm install
npm run dev
```

## 주요 기능

- 최신 기술 블로그 포스트 목록
- 인기 회사별 트렌딩 포스트 (조회수 기준)
- 카테고리별 필터링
- 페이지네이션
- 반응형 디자인

## API 연동

이 프로젝트는 다음 API 엔드포인트를 사용합니다:

- `GET /api/v1/posts` - 최신 포스트 목록
- `GET /api/v1/companies/top-by-views` - 조회수 기준 상위 회사 목록
