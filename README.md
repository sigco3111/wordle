# 워들 게임 (Wordle)

React와 TypeScript로 만든 클래식 단어 추측 게임 '워들'의 클론 프로젝트입니다. 플레이어는 6번의 기회 안에 5글자 비밀 단어를 맞혀야 합니다. 이 프로젝트는 모던 웹 기술을 사용하여 깔끔한 UI와 부드러운 사용자 경험을 제공하는 데 중점을 두었습니다.

실행주소1 : https://wordle-one-sigma.vercel.app/

실행주소2 : https://dev-canvas-pi.vercel.app/

## ✨ 주요 기능

- **클래식 워들 게임 플레이**: 6번의 기회, 5글자 단어, 색상을 통한 힌트 제공.
- **세련된 다크 모드 UI**: 눈이 편안한 다크 테마를 기본으로 적용했습니다.
- **동적 애니메이션**:
  - **타일 뒤집기**: 단어 제출 시 타일이 순서대로 뒤집히며 상태를 보여줍니다.
  - **흔들림 효과**: 유효하지 않은(글자 수가 부족한) 단어 제출 시 해당 줄이 흔들립니다.
  - **승리 애니메이션**: 정답을 맞히면 해당 줄의 글자들이 차례로 점프합니다.
- **상태 추적 키보드**: 사용한 글자의 상태(정답, 포함, 빗나감)를 가상 키보드에 표시하여 추측을 돕습니다.
- **게임 통계**: 플레이 횟수, 승률, 현재 및 최대 연승, 추측 분포 등 상세한 통계를 제공하고 `localStorage`에 저장합니다.
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 등 다양한 화면 크기에서 최적의 플레이 경험을 제공합니다.
- **모달 창**: '게임 방법'과 '통계' 정보를 깔끔한 모달 창으로 제공합니다.

## 🛠️ 기술 스택

- **프레임워크**: [React](https://react.dev/)
- **언어**: [TypeScript](https://www.typescriptlang.org/)
- **스타일링**: [Tailwind CSS](https://tailwindcss.com/)
- **상태 관리**: React Hooks (`useState`, `useEffect`, `useCallback`)
- **브라우저 저장소**: `localStorage`를 사용하여 게임 통계와 최초 실행 여부를 저장합니다.
- **모듈 로딩**: `esm.sh`를 통한 네이티브 ES Modules import (빌드 과정 없음).

## 🚀 프로젝트 실행 방법

이 프로젝트는 별도의 빌드 과정 없이 정적 파일을 서비스할 수 있는 환경이면 어디서든 실행할 수 있습니다.

1.  **프로젝트 파일 다운로드**:
    모든 프로젝트 파일을 로컬 컴퓨터에 다운로드합니다.

2.  **로컬 웹 서버 실행**:
    보안상의 이유로 브라우저는 로컬 파일 시스템에서 직접 ES 모듈을 로드하는 것을 제한합니다. 따라서 로컬 웹 서버를 사용해야 합니다. `serve` 패키지를 사용하면 간단히 서버를 실행할 수 있습니다.

    ```bash
    # serve 패키지가 설치되어 있지 않다면 설치합니다.
    npm install -g serve

    # 프로젝트 루트 디렉토리에서 아래 명령어를 실행합니다.
    serve .
    ```

    또는 Python을 사용하여 서버를 실행할 수도 있습니다.
    ```bash
    # Python 3
    python -m http.server

    # Python 2
    python -m SimpleHTTPServer
    ```

3.  **브라우저에서 열기**:
    서버가 실행되면 터미널에 표시된 URL(보통 `http://localhost:3000` 또는 `http://localhost:8000`)을 웹 브라우저에서 열어 게임을 시작합니다.

## 📁 파일 구조

프로젝트는 기능에 따라 체계적으로 구성되어 있습니다.

```
.
├── components/          # React 컴포넌트
│   ├── icons/           # SVG 아이콘 컴포넌트
│   ├── Board.tsx        # 게임 보드 (글자 타일 그리드)
│   ├── HowToPlay.tsx    # '게임 방법' 모달 콘텐츠
│   ├── Keyboard.tsx     # 가상 키보드
│   └── StatsView.tsx    # 통계 모달 콘텐츠
├── services/            # 비즈니스 로직 (UI와 분리)
│   ├── statsService.ts  # 통계 로딩, 저장, 업데이트 로직
│   └── wordService.ts   # 정답 단어 선택 로직
├── App.tsx              # 메인 애플리케이션 컴포넌트 (상태 관리)
├── constants.ts         # 게임 상수 (단어 길이, 단어 목록 등)
├── index.html           # 애플리케이션 진입점 HTML
├── index.tsx            # React 루트 렌더링 스크립트
├── metadata.json        # 프로젝트 메타데이터
├── types.ts             # TypeScript 타입 정의
└── README.md            # 프로젝트 설명 파일
```

### 주요 파일 설명

-   `App.tsx`: 게임의 모든 상태(정답 단어, 추측 목록, 게임 상태 등)를 관리하고, 다른 컴포넌트들을 조립하는 최상위 컴포넌트입니다.
-   `components/Board.tsx`: 추측한 단어들을 표시하는 그리드를 렌더링하며, 타일의 뒤집기, 점프 등 애니메이션을 담당합니다.
-   `components/Keyboard.tsx`: 사용자가 클릭할 수 있는 가상 키보드를 만들고, 각 키의 상태 색상을 관리합니다.
-   `services/wordService.ts`: `constants.ts`에 정의된 `ANSWERS` 배열에서 무작위로 정답 단어를 선택합니다.
-   `services/statsService.ts`: `localStorage`를 사용하여 게임 통계를 관리하는 함수들을 제공합니다.
