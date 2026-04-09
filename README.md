# <div align="center"> 영화 도서 아카이브 서비스 Review Log </div>

> ### Review Log 레포지토리 
> 개발 기간 : 2026.04.02. ~ 2025.04.10.

## <div align="center">팀원 소개</div>

<table align="center">
  <thead>
    <tr>
      <th>
        <a href="https://github.com/heegon1205">
          <img src="https://avatars.githubusercontent.com/u/164067821?v=4" width="100" />
        </a>
      </th>
      <th>
        <a href="https://github.com/roof1004">
          <img src="https://avatars.githubusercontent.com/u/200786070?v=4" width="100" />
        </a>
      </th>
      <th>
        <a href="https://github.com/paksak4">
          <img src="https://avatars.githubusercontent.com/u/91010366?v=4" width="100" />
        </a>
      </th>
      <th>
        <a href="https://github.com/zer0p01nt">
          <img src="https://avatars.githubusercontent.com/u/189887138?v=4" width="100" />
        </a>
      </th>
      <th>
        <a href="https://github.com/alsrud1114">
          <img src="https://avatars.githubusercontent.com/u/106427816?v=4" width="100" />
        </a>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">BE</td>
      <td align="center">DB</td>
      <td align="center">BE</td>
      <td align="center">FE</td>
      <td align="center">BE</td>
    </tr>
  </tbody>
</table>


## <div align="center">기술 스택</div>

> ### Front-End
<table align="center">
  <thead>
    <tr>
      <th>
        용도
      </th>
      <th>
        사용한 스택
      </th>
      <th>
        선택 이유
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">Language</td>
      <td align="center">
        <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
      </td>
      <td align="center">정적 타입을 통한 런타임 에러 방지 및 코드 안정성 확보</td>
    </tr>
    <tr>
      <td align="center">Library</td>
      <td align="center">
        <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
      </td>
      <td align="center">컴포넌트 기반 UI 개발 및 선언적 프로그래밍을 통한 효율적 관리</td>
    </tr>
    <tr>
      <td align="center">Routing</td>
      <td align="center">
        <img src="https://img.shields.io/badge/reactrouter-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white">
      </td>
      <td align="center">SPA 환경에서 선언적인 라우팅 및 동적 경로 처리 구현</td>
    </tr>
    <tr>
      <td align="center">Data Fetching</td>
      <td align="center">
        <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>
        <img src="https://img.shields.io/badge/React%20Query-FF4154?style=for-the-badge&logo=React%20Query&logoColor=white">
      </td>
      <td align="center">안정적이고 간소화된 서버 통신 및 서버 데이터 캐싱</td>
    </tr>
    <tr>
      <td align="center">State Management</td>
      <td align="center">
        <img src="https://img.shields.io/badge/zustand-orange?style=for-the-badge&logo=zustand&logoColor=white">
      </td>
      <td align="center">쉬운 사용 방법과 직관적인 상태 업데이트 방식</td>
    </tr>
    <tr>
      <td align="center">Styling</td>
      <td align="center">
        <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=Tailwind%20CSS&logoColor=white">
        <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white">
      </td>
      <td align="center">Utility-first 기반의 빠른 스타일링과 일관된 UI 컴포넌트 활용</td>
    </tr>
    <tr>
      <td align="center">Build</td>
      <td align="center">
        <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
      </td>
      <td align="center">빠르고 효율적인 번들링 환경 구축</td>
    </tr>
  </tbody>
</table>

> ### Back-End
<table align="center">
  <thead>
    <tr>
      <th>
        용도
      </th>
      <th>
        사용한 스택
      </th>
      <th>
        선택 이유
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">Language</td>
      <td align="center">
        <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">
      </td>
      <td align="center">Node.js 기반의 비동기 I/O를 활용한 효율적인 서버 로직 구현</td>
    </tr>
    <tr>
      <td align="center">Runtime</td>
      <td align="center">
        <img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=Node.js&logoColor=white">
      </td>
      <td align="center">JavaScript 환경의 비동기 이벤트 기반 런타임 활용</td>
    </tr>
    <tr>
      <td align="center">Framework</td>
      <td align="center">
        <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white">
      </td>
      <td align="center">유연한 라우팅과 미들웨어 중심의 서버 구조 설계</td>
    </tr>
    <tr>
      <td align="center">Database</td>
      <td align="center">
        <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
      </td>
      <td align="center">사용자 리뷰 및 작품 데이터 간의 관계형 DB 관리</td>
    </tr>
    <tr>
      <td align="center">Authentication</td>
      <td align="center">
        <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20Web%20Tokens&logoColor=white">
        <img src="https://img.shields.io/badge/Bcrypt-4E5F71?style=for-the-badge">
      </td>
      <td align="center">JWT 기반 보안 인증 및 비밀번호 해싱 암호화 구현</td>
    </tr>
    <tr>
      <td align="center">Environment</td>
      <td align="center">
        <img src="https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black">
      </td>
      <td align="center">API Key, DB 접속 정보 등 환경 변수의 안전한 분리</td>
    </tr>
    <tr>
      <td align="center">Communication</td>
      <td align="center">
        <img src="https://img.shields.io/badge/CORS-FF6A00?style=for-the-badge">
        <img src="https://img.shields.io/badge/Cookie--Parser-4E5F71?style=for-the-badge">
      </td>
      <td align="center">프론트엔드 교차 출처 리소스 공유 및 쿠키 제어</td>
    </tr>
  </tbody>
</table>

> ### Architecture
<img width="1456" height="671" alt="image" src="https://github.com/user-attachments/assets/6d3d401c-16c8-4b4f-a54b-180b9e550c46" align="center" />


## <div align="center">개발 시작하기</div>

> ### .env 파일 설정하기
- FE
```
VITE_API_URL=your_api_url
```
- BE
```
TMDB_ACCESS_TOKEN=your_tmdb_access_token
ALADIN_TTB_KEY=your_aladin_ttb_key

DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
PORT=your_port

ACCESS_SECRET=your_access_secret_key
REFRESH_SECRET=your_refresh_secret_key
```

> ### 로컬 서버 접속하기
- FE
```
cd client
npm install
npm run dev
```
- BE
```
cd server
npm install
npm run dev
```


## <div align="center">폴더 구조</div>
```
review-log/
├─ 📁 .github/
│  ├─ 📁 ISSUE_TEMPLATE/
│  │  └─ 📃 issue_template.md (이슈 템플릿)
│  │
│  └─ 📃 PULL_REQUEST_TEMPLATE.md (PR 템플릿)
│  
│                
├─ 📁 client/ (FE)
│  ├─ 📁 .vscode/ 
│  │  └─ 📃 settings.json (vs code 내 TS 설정 파일)
│  │
│  ├─ 📁 public/ 
│  │  └─ 📃 favicon.svg
│  │
│  ├─ 📁 src/
│  │  ├─ 📁 assets/ (정적 이미지 파일 관리)
│  │  │
│  │  ├─ 📁 components/ (재사용되는 컴포넌트 파일 모음)
│  │  │  ├─ 📁 layout/ (메인화면 레이아웃 컴포넌트)
│  │  │  ├─ 📁 review/ (리뷰 작성 모달 관련 컴포넌트)
│  │  │  └─ 📁 ui/ (shadcn/ui 제공 컴포넌트)
│  │  │
│  │  ├─ 📁 constants/ (태그 목록 상수 배열로 관리)  
│  │  │
│  │  ├─ 📁 lib/ (스타일링 관련 유틸리티)          
│  │  │
│  │  ├─ 📁 pages/ (홈 화면 등 페이지 컴포넌트 관리)
│  │  │
│  │  ├─ 📁 services/ (axios 인터셉터 및 API 페칭 로직 관리)    
│  │  │
│  │  ├─ 📁 stores/ (zustand 전역 상태 관리)                 
│  │  │
│  │  ├─ 📁 styles/ (css 관련 폴더)
│  │  │  ├─ 📃 GlobalStyles.tsx (전역 스타일 관리)
│  │  │  └─ 📃 theme.ts (css 전역 변수 관리)
│  │  │
│  │  ├─ 📁 types/ (전역에서 쓰이는 type 파일 관리)          
│  │  │
│  │  ├─ 📁 utils/ (유틸리티 함수 관리)          
│  │  │
│  │  ├─ 📃 App.tsx
│  │  ├─ 📃 index.css
│  │  └─ 📃 main.tsx
│  │
│  ├─ 📃 .env.example (.env 파일 템플릿)
│  ├─ 📃 .gitignore
│  ├─ 📃 components.json (shadcn/ui 컴포넌트 설정 파일)
│  ├─ 📃 eslint.config.js (eslint 설정 파일)
│  ├─ 📃 index.html
│  ├─ 📃 package-lock.json                  
│  ├─ 📃 package.json
│  ├─ 📃 postcss.config.js (tailwind 설정 파일)
│  ├─ 📃 README.md
│  ├─ 📃 postcss.config.js (tailwind 설정 파일)
│  ├─ 📃 tsconfig.app.json
│  ├─ 📃 tsconfig.json
│  ├─ 📃 tsconfig.node.json
│  └─ 📃 vite.config.ts
│
│
├─ 📁 server/ (BE)
│  ├─ 📁 config/ (MySQL 연결 풀 생성 로직 관리)
│  │
│  ├─ 📁 controllers/ (컨트롤러 파일 관리)
│  │
│  ├─ 📁 middleware/ (JWT 토큰 인증 미들웨어 관리)  
│  │
│  ├─ 📁 models/ (모델링 파일 관리)  
│  │
│  ├─ 📁 routes/ (BE 라우팅 관리)            
│  │
│  ├─ 📁 sql/ (서버 DB 초기화 sql 파일 관리)
│  │
│  ├─ 📁 utils/ (JWT 토큰 유틸리티 로직 관리)                    
│  │
│  ├─ 📃 .env.example (.env 파일 템플릿)
│  ├─ 📃 .gitignore
│  ├─ 📃 app.js                   
│  ├─ 📃 package-lock.json         
│  └─ 📃 package.json          
│
├─ 📃 README.md
```


## <div align="center">개발 규칙</div>

> ### 폴더/파일명 규칙
- 폴더명 : **kebab-case** (`user-profile`, `utils` 등)
- 로직 / 함수 / css 등 일반 파일명 : **camelCase** (`authController`, `api` 등)
- 컴포넌트 파일명 : **PascalCase** (`UserProfile`, `Home` 등)

> ### PR 및 Merge 규칙
- 커밋을 바로 `develop`이나 `main`에 머지하지 않고, 되도록 PR 후 Merge

> ### 커밋 규칙

- 커밋의 끝맺음은 "~ 기능 추가", "~ 작업", "~ 개발" 과 같이 명사로 통일
- 너무 많은 변경을 하나의 커밋에 담지 말기 (세부 작업마다 틈틈이 커밋하기!)

```
Init: 프로젝트 세팅
Feat: 새로운 기능 추가
Fix: 버그 수정
Design: UI 스타일/디자인 수정
Refactor: 코드 리팩토링
Typo: 오타 수정,타입 수정
Rename: 폴더 구조 이동, 파일명 변경
Assets: 이미지, 폰트 등 리소스 추가/삭제
Del: 파일 삭제
Docs: 문서 수정, 목데이터 작업 등
Chore: 설정파일 보완, 환경 설정
Deps: 새로운 라이브러리 설치
Deps: 불필요한 라이브러리 삭제
Revert : 커밋 내용 복구
```

예시

```
Feat: 메인페이지 개발
Refactor: 등록 플로우 - 글 작성 페이지 로직 정리
```

> ### 브랜치 전략

- 이슈를 사용하지 않는다면 `feat/기능이름` 처럼 작성

| 태그이름                    | 설명                       |
| --------------------------- | -------------------------- |
| main                        | 실제 배포용 브랜치         |
| develop                     | 개발용 브랜치(기능 통합용) |
| feat/#이슈번호/기능이름     | 새로운 기능 개발 시        |
| refactor/#이슈번호/기능이름 | 코드 리팩토링              |
| fix/#이슈번호/버그이름      | 버그 수정                  |
| design/#이슈번호/요소       | 디자인 및 스타일 변경      |
| chore/#이슈번호/내용        | 설정, 의존성 등 기타 작업  |

예시

```
feat/#12/login-page  // 로그인 기능 개발
refactor/#34/reduce-duplicated-code  // 코드 리팩토링
chore/#56/update-eslint  // eslint 설정 수정
```
