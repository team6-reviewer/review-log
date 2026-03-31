# review-log

## <div align="center">📃 개발 규칙 📃</div>

> ### 폴더/파일명 규칙
- 폴더명 : **kebab-case** (`user-profile`, `utils` 등)
- 로직 / 함수 / css 등 일반 파일명 : **camelCase** (`authController`, `api` 등)
- 컴포넌트 파일명 : **PascalCase** (`UserProfile`, `Home` 등)

> ### PR 및 Merge 규칙
- 커밋을 바로 `develop`이나 `main`에 머지하지 않고, 되도록 PR 후 Merge
  - 수업 중이라면 되도록 코드 리뷰까지 받은 후 Merge / 수정 후 Merge

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
