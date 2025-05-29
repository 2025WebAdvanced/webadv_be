<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=250&section=header&text=community%20backend&fontAlignY=45&fontSize=60&desc=2025%20web%20programming%20advenced%20project&descAlign=39.5" />

# webadv_be
2025년 1학기 웹프로그래밍응용 게시판 팀 프로젝트 백엔드 리포지토리

## 기술 스택
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

> - 서버: 구글 클라우드 컴퓨팅 서비스
> - 웹서버: Nginx
> - 웹앱 프레임워크: Express
> - DB: MySQL

## 서버 세팅
### 1. 클라우드 컴퓨팅 인스턴스 만들기
#### 구글 클라우드 접속
Google Cloud 접속 후, Compute Engine - VM 인스턴스 클릭
![1](./readmeIamges/image1.png)
인스턴스 만들기 클릭<br>
#### 인스턴스 생성 (머신 구성)
이름 작성 후, 리전: asia-northeast3(서울) 선택, 머신 유형: e2-micro 선택
![2](./readmeIamges/image2.png)

#### 인스턴스 생성 (OS 및 스토리지)
Ubuntu 24.04 LTS Minimal x86/64 선택
![3](./readmeIamges/image3.png)

#### 인스턴스 생성
- 데이터 보호: 백업 없음 체크
- 네트워킹: HTTP, HTTPS 트래픽 허용, 네트워크 인터페이스 - 네트워크 서비스 계층: 표준 체크

### 2. 인스턴스 연결
생성된 인스턴스 가장 오른쪽의 SSH 버튼 클릭해서 접속
![4](./readmeIamges/image4.png)

```bash
sudo apt-get update
```

vim 에디터조차 안깔려있기 때문에 설치
```bash
sudo apt-get install vim
```

git 설치
```bash
sudo apt-get install git
```

### 3. Nginx 웹서버 설치
#### 우분투에 Nginx 설치
```bash
sudo apt-get install nginx
```
```bash
sudo nginx -v
```
![5](./readmeIamges/image5.png)
#### 우분투 패키지 설치
```bash
sudo wget https://nginx.org/keys/nginx_signing.key
```
![6](./readmeIamges/image6.png)

#### 동작 확인
구글 클라우드 VM 인스턴스에서 **외부 IP** 복사<br>
웹 브라우저 주소창에 **http://복사한IP** 붙여넣기
![7](./readmeIamges/image7.png)
위와 같은 화면이 나오면 정상 작동

### 4. 프로젝트 클론
#### ssh 키 생성 및 등록
##### ssh 키 생성
```bash
ssh-keygen
```
![8](./readmeIamges/image8.png)
##### 공개 키 등록
```bash
cat ~/.ssh/id_rsa.pub
```
결과 복사 후 깃허브 - settings - SSH and GPG keys 접속해서 공개 키 등록

#### 깃허브 리포지토리 clone
```bash
git clone git@github.com:2025WebAdvanced/webadv_be.git
```
![9](./readmeIamges/image9.png)

### 5. 서버 실행
#### 8080포트로 포트포워딩
```bash
sudo vim /etc/nginx/sites-available/default
```
입력해서 편집

![10](./readmeIamges/image10.png)
location 블럭 내의 내용 수정 후 저장

프로젝트 폴더로 이동 후 `npm start` 입력 후, 웹 브라우저에서 IP 주소를 입력하면 Express 앱으로 연결된다.

#### nodeJS 프로젝트 서비스 등록
```bash
sudo vim /etc/systemd/system/api.service
```
![11](./readmeIamges/image11.png)
서비스 작성 후 저장

```bash
cd ~/webadv_be/src
sudo chmod +x app.js
```
입력하여 app.js 파일에 실행 권한 추가

```bash
sudo systemctl daemon-reload
sudo systemctl start api
sudo systemctl enable api
sudo systemctl status api
```
![12](./readmeIamges/image12.png)
서비스 정상 실행 확인, 이제 npm start 입력하지 않아도 IP로 접속 시 앱에 접속된다.

#### 📁 프로젝트 구조 및 기능 설명

webadv_be/
├── app.js # 📌 서버 시작점
├── package.json # 프로젝트 메타 정보 및 의존성
│
├── config/
│ └── db.js # 🛠️ MySQL 데이터베이스 연결 설정
│
├── routes/ # 📂 라우터
│ ├── index.js # 기본 페이지 라우터
│ ├── auth.js # 🔐 로그인 / 회원가입 라우터
│ └── board.js # 📋 게시판 라우터
│
├── views/ # 📂 EJS 파일
│ ├── index.ejs # 메인 페이지
│ ├── login.ejs # 🔐 로그인 페이지
│ ├── register.ejs # 🧾 회원가입 페이지
│ └── board.ejs # 📋 게시판 목록 / 작성 페이지
├── public/
│ └── style.css # 🎨 기본 스타일시트
