# 이커머스 쇼핑몰 프로젝트

Clean + Layered Architecture 기반의 풀스택 이커머스 쇼핑몰입니다.

## 기술 스택

### 백엔드
- **Spring Boot**: 3.4.1
- **Java**: 17
- **Database**: MySQL 8.0
- **ORM**: JPA + QueryDSL 5.0.0
- **인증**: JWT (Access Token + Refresh Token)
- **캐싱/분산 락**: Redis 7.0.0 + Redisson
- **WAS**: Tomcat 9 (embedded)
- **API 문서**: Swagger (OpenAPI 3.0)
- **빌드 도구**: Gradle

### 프론트엔드
- **React**: 19.0.0
- **라우팅**: React Router v6
- **HTTP 클라이언트**: Axios
- **빌드 도구**: npm

### 인프라
- **Docker & Docker Compose**
- **Nginx** (프론트엔드 서빙 + 리버스 프록시)

## 프로젝트 구조

```
commerce/
├── backend/                # Spring Boot 백엔드
│   ├── src/main/java/com/commerce/
│   │   ├── api/           # API 계층
│   │   ├── application/   # Application 계층
│   │   ├── domain/        # Domain 계층
│   │   ├── infra/         # Infrastructure 계층
│   │   ├── config/        # Configuration 계층
│   │   └── common/        # Common 계층
│   ├── build.gradle
│   └── Dockerfile
│
├── frontend/              # React 프론트엔드
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
└── docker-compose.yml     # Docker Compose 설정
```

## 시작하기

### 사전 요구사항
- Java 17
- Node.js 20+
- Docker & Docker Compose
- Git

### 1. 로컬 개발 환경

#### 백엔드 실행
```bash
cd backend

# Gradle Wrapper 실행 권한 부여 (Linux/Mac)
chmod +x gradlew

# 빌드
./gradlew clean build

# 로컬 실행 (MySQL, Redis는 로컬에 설치되어 있어야 함)
./gradlew bootRun --args='--spring.profiles.active=local'
```

#### 프론트엔드 실행
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

**접속**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1
- Swagger UI: http://localhost:8080/swagger-ui.html

### 2. Docker Compose로 전체 스택 실행

#### Step 1: 환경 변수 설정
```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집 (필요시)
# JWT_SECRET, MySQL 비밀번호 등을 설정
```

#### Step 2: 백엔드 빌드
```bash
cd backend

# Windows
gradlew.bat clean build

# Linux/Mac
./gradlew clean build
```

#### Step 3: Docker Compose 실행
```bash
# 루트 디렉토리로 이동
cd ..

# 모든 서비스 시작 (백그라운드)
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 상태 확인
docker-compose ps
```

#### Step 4: 접속
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api/v1
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

#### 서비스 중지
```bash
# 서비스 중지
docker-compose down

# 볼륨까지 삭제 (데이터 초기화)
docker-compose down -v
```

## API 문서

Swagger UI에서 모든 API 엔드포인트를 확인할 수 있습니다.

**주요 엔드포인트**:

### 인증 API
- `POST /api/v1/auth/signup` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/logout` - 로그아웃
- `POST /api/v1/auth/refresh` - 토큰 갱신

## 아키텍처

### 레이어드 아키텍처

```
┌─────────────────┐
│   API Layer     │  HTTP 요청/응답, DTO 변환
├─────────────────┤
│ Application     │  비즈니스 유스케이스 조율
├─────────────────┤
│   Domain        │  핵심 비즈니스 로직
├─────────────────┤
│ Infrastructure  │  데이터베이스, Redis 구현
└─────────────────┘
```

### 주요 패턴
- **Clean Architecture**: 도메인 중심 설계
- **Repository Pattern**: 의존성 역전 (Domain이 인터페이스, Infra가 구현)
- **Facade Pattern**: Application 계층에서 여러 도메인 서비스 조율
- **DTO Pattern**: 계층 간 데이터 전달

## 구현 기능

### Phase 1: 인증 (완료)
- [x] 회원가입/로그인 (JWT)
- [x] Refresh Token (Redis 저장)
- [x] Spring Security 설정

### Phase 2: 상품 관리 (예정)
- [ ] 상품 CRUD
- [ ] 카테고리 관리
- [ ] Redis 캐싱
- [ ] 상품 검색

### Phase 3: 장바구니 (예정)
- [ ] 장바구니 CRUD
- [ ] 실시간 업데이트

### Phase 4: 주문/결제 (예정)
- [ ] 주문 생성
- [ ] 재고 차감 (Redisson 분산 락)
- [ ] 주문 상태 관리

### Phase 5: 게시판 및 문의 (예정)
- [ ] 공지사항/자유게시판
- [ ] 댓글 기능
- [ ] 상품 문의

### Phase 6: 관리자 기능 (예정)
- [ ] 상품 관리
- [ ] 사용자 관리
- [ ] 주문 관리
- [ ] 통계 대시보드

## 트러블슈팅

### 1. MySQL 연결 오류
```
ERROR: Connection refused
```
**해결**: MySQL이 실행 중인지 확인하고, `application.yml`의 DB 설정을 확인하세요.

### 2. Redis 연결 오류
```
ERROR: Cannot connect to Redis
```
**해결**: Redis가 실행 중인지 확인하세요.

### 3. Docker 빌드 오류
```
ERROR: Cannot find build/libs/*.jar
```
**해결**: 백엔드를 먼저 빌드하세요 (`./gradlew clean build`).

### 4. Frontend가 Backend API를 호출하지 못함
**해결**: `frontend/package.json`의 `proxy` 설정을 확인하거나, Nginx 설정을 확인하세요.

## 개발 가이드

### 새로운 도메인 추가 시
1. `domain/` 아래에 새 패키지 생성
2. Entity, Service, Repository (interface) 작성
3. `infra/` 아래에 RepositoryImpl, JpaRepository 작성
4. `application/` 아래에 Facade, Command, Result 작성
5. `api/` 아래에 Controller, Request, Response 작성

### 테스트 실행
```bash
# 백엔드 테스트
./gradlew test

# 프론트엔드 테스트
npm test
```

## 라이선스
MIT License

## 참고 프로젝트
- C:\project\workspace\server-java - Clean + Layered Architecture 구조 참고
