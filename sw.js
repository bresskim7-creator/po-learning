// PO 학습 시스템 Service Worker
// v5.77.0 (2026-06-03): 연음 적용2(용언+어미 p.21~22) 추가 + 순차 스케줄러(stage 게이팅). cover_read 풀에 적용2 21낱말 추가(speech-therapy.json coverReadSets[0].items 20→41, 기존 적용1 20개 stage:1·신규 적용2 21개 stage:2·anchor:false). "순서대로": crBuildCoverReadQueue learning 채움 단계를 stage 게이팅으로 교체 — 적용1(낮은 stage)은 항상 노출, 적용2(높은 stage)는 하위 stage learning 수 합 <= unlockThreshold(config.speakingPractice.coverReadStageUnlockMaxRemaining ?? 2)일 때만 개방. 정렬: stage asc→난이도(저<3 먼저, 고>=3 뒤)→버킷내 shuffle. maintenance due 우선·partition·perSession(10)·bonus 불변. 적용2 anchor:false → 부모청취·Drive·말하기추세·config.coverReadAnchorSet(앵커 12개) 변경 0. 원리카드(v5.75.0)·차이듣기는 allForms 자동 호환(코드 변경 0). config.json speakingPractice 블록에 coverReadStageUnlockMaxRemaining:2 신규 키(★최상위 아님). stage 누락→1, config 키 누락→2 폴백. GAS 재배포·PRECACHE 변경 0. 변경 3파일: index.html·speech-therapy.json·sw.js + config.json(1키).
// 이전 v5.76.0 (2026-06-03): 시트 주소 1회 세팅 — #sheets=<encodeURIComponent(exec)> 해시 링크(쿼리 폴백)로 sheetsUrl 저장. 기기마다 수동 입력하던 걸 링크 1회 온보딩으로(새 기기/캐시 초기화 후 재입력 해소, QR 다기기 가능). 레포 public+GAS 무인증이라 하드코딩 기각, 옵션B 채택. 해시=서버 로그에 키 안 남음(Codex 자문). 신규 동기 함수 applySheetsUrlFromParam(getSettings 근처): 해시 우선·쿼리 폴백 sheets 값 읽기→new URL() 검증(https+script.google.com+/macros/s/<id>/exec)→origin+pathname 정규화(쿼리·프래그먼트 제거, 스펙리뷰 MEDIUM)→confirm(기존 있으면 교체 문구)→po_v4_settings 저장→stripParam(sheets 토큰만 제거, 다른 파라미터 보존, replaceState). 거부/취소/성공 모두 stripParam, 전부 try/catch. init() 최상단(loadSettingsUI·downloadSettingsFromCloud 전) 호출 1줄. 기존 수동 입력 필드(set-sheets-url) 폴백 유지. sheets 토큰 없는 일반 진입 부작용 0. GAS·데이터·config 변경 0(재배포·PRECACHE 불필요). 변경 2파일: index.html·sw.js.
// 이전 v5.75.0 (2026-06-03): 원리 카드("🔎 왜 이렇게 소리 날까?") 일반화 개편 — 같은 받침이 두 모음형(에/이 + 을/은)으로 똑같이 넘어가는 것을 함께 노출(예: 옷에→[오세]·옷을→[오슬]) + 공통 규칙 한 줄 명시(비예외="받침이 모음을 만나면 뒤 글자로 넘어가요"·예외="받침 ㅇ은 모음을 만나도 넘어가지 않아요"). 규칙 일반화(변산성/다중예시) 목적. crShowPrinciple() explainHtml만 교체(allForms vowel 2개 분기, <2 폴백=기존 단일 예시 보존). 소리[..]만 파랑·진짜 글자 검정·escapeHtml 유지. 데이터·녹음·자기비교·차이듣기·부모청취·백엔드 변경 0(GAS 재배포·PRECACHE 불필요). currentStep/selfBlobUrl/recordingRawId 미접촉(닫으면 step5 내 녹음 재생 정상). 변경 2파일: index.html(crShowPrinciple+버전2줄)·sw.js.
// 이전 v5.74.0 (2026-06-03): 오늘의 한 장 읽음 상태 기기 간 동기화 — 읽음 기록을 구글 시트에 저장해 폰·탭 공유. 화면은 localStorage로 즉시 렌더, 시트 동기화는 백그라운드(배지만 보정, 렌더 비차단). 저장=단일 셀 날짜 JSON 배열, 서버가 기존∪신규 union(덮어쓰기 금지)+LockService 보호. 신규 GAS: handleDailyReadSync(POST daily_read_sync, yyyy-MM-dd 필터, tryLock 실패해도 멱등 write 1회=push 유실 방지, if(got) releaseLock 가드)·handleGetDailyRead(GET get_daily_read)·getDailyReadSheet('오늘의한장읽음' A1배열/B1시각). 프론트: pushDailyReadToCloud(POST fire-and-forget, markDailyAsRead 끝)·syncDailyReadFromCloud(GET 비차단, 로컬∪서버 병합→배지 보정→로컬-only 날짜 서버 수렴push). 호출: 앱시작 홈배지·loadDailyToday 진입(둘 다 await 없이, 큐 선택 안 기다림). 실패/오프라인/시트주소 없음→로컬만 폴백(안 깨짐). 큐 staleness 수용(보던 카드 안 뺏고 다음 열때 정상화). **GAS 재배포 필수**. config·speech-therapy·daily_*.js 변경 없음. v5.73 발음 색구분·type=button 무손상(daily 영역만).
// 이전 v5.73.0 (2026-06-03): 발음 들어보기 단어 목록 녹음 유무 색 구분 — 녹음 있음=파랑(현재)·없음=회색. 진입 시 가벼운 요약 1콜(get_anchor_summary, 음성 제외 메타만: 단어별 count·latestDate). 음성(base64)은 §8대로 단어 클릭 시 on-demand 1건 유지(진입 시 get_recording_audio 0건). 신규 GAS 액션 handleGetAnchorSummary(녹음목록 1회 스캔, auditMap 스킵, 빈시트 가드). 프론트: parentRenderAnchorWordList async화(버튼 먼저 파랑 즉시렌더→요약 도착 후 recolor, data-itemid 스코프), parentLoadAnchorSummary(raw fetch), _pronAuditLoaded 가드 제거→open마다 재조회(색 갱신). 요약 실패/네트워크끊김→null→전부 파랑 폴백(안 깨짐). 회색 버튼도 type="button" 유지(v5.72.1 form-submit 회귀 금지)·클릭 가능(누르면 "아직 녹음 없어요" 안내). 양쪽 진입점(#parent-result·설정) 색 반영. **GAS 재배포 필수**(get_anchor_summary 신규). config·speech-therapy 변경 없음.
// 이전 v5.72.1 (2026-06-03): 발음 들어보기(설정 독립 진입) form-submit 리로드 버그 수정. 원인: page-settings가 <form>인데 audit 동적 버튼에 type 누락→기본 submit→앱 첫화면 리로드. 같은 렌더 경로 버튼 5종(앵커 단어목록·예전▶·오늘▶·전체기록·정확/애매/틀림 평가)에 type="button" 추가. 부모결과 화면(#parent-result <div>)은 영향 없어 회귀 0. 순수 버그픽스(기능 변경 0).
// 이전 v5.72.0 (2026-06-03): 연음 적용(1) 대조쌍 cover_read 개편 — 단독 낱말 → 대조쌍(차이듣기 + 연음형 녹음). 책대로(종 ㅇ받침 예외 포함, 조사 4칸 전부). (1) 콘텐츠: speech-therapy.json coverReadSets items 17→20개(p.19 체언9+p.20 체언11, 각 allForms[자음2:도/까지·과/부터 + 모음2:이/은·에/을]), 평탄 스키마 유지+칼럼 증설(contrastOrtho/contrastPron/allForms/particle*/difficulty/anchor/liaisonException). 앵커 12개 itemId 불변→Drive·부모청취·추세 회귀0. (2) 차이듣기 신규 단계(CR_STEP_DIFF, crStartItem 분기): 4칸 진짜 글자만 노출+각 모범 소리(🔊 차례로 듣기/단발), 녹음·정오 없음. (3) 소리글자 텍스트 기본 OFF — config.speakingPractice.showSoundSpelling(기본 false, 런타임 토글). 모범은 오디오로만(crPlayModel pronunciation TTS 그대로, H2/H3 TTS-of-ortho 안 함). (4) 원리 카드 on-demand 오버레이(🔎): 책이→[채기] 받침이동 시각화, 여기서만 소리글자 노출. (5) 난이도 후순위: difficulty 3(대궐/가마솥/뙤약볕) crBuildCoverReadQueue learning 티어 분할 후순위. 녹음·자기비교는 모음형(이/에) 앵커 1개만(자음칸 녹음 안 함=기본). STT 0·부팅 프리로드 0·on-demand 오디오 유지. v5.70~5.71 자기비교/녹음IDB/부모청취/추세/Drive 회귀0. 서브에이전트 스펙리뷰 조건부PASS 반영(HIGH-1 currentStep 분기+리셋공유, MEDIUM-1 원리 selfBlob revoke 금지, MEDIUM-2 카드매핑 칼럼+diff 폴백).
// 이전 v5.71.1 (2026-06-03): 발음 들어보기 독립 진입 추가 — 설정 페이지(설정 PIN 게이트 뒤)에 "🔊 발음 들어보기 (예전 vs 오늘)" 버튼 추가, 세션 완료·기기와 무관하게 앵커 단어 예전▶/오늘▶ 청취. 기존 #parent-result 진입은 유지(중복 허용, 제거 안 함). 백엔드·GAS·Drive·시트 변경 없음 — 순수 진입 UI. 렌더는 parentRenderAnchorWordList/parentLoadWordRecordings/parentSubmitAudit 단일 함수 공유, _pronAuditBodyId로 대상만 분기(로직 복제 없음). 녹음 조회는 단어 클릭 시 on-demand 1건(설정 진입 시 자동 프리로드 없음).
// 이전 v5.71.0 (2026-05-31): 말하기 개편 2차 청크 — 부모 then-vs-now 청취 + 추세 시트. (1) IDB→업로드 브리지(H3): 앵커 12개 itemId 녹음만 ISO주당 1개 대표(config perWordWeeklyCap=12)로 Drive 업로드, 소급 스캔, 이미 올린 주 스킵. (2) 말하기추세 시트(신설): 자기평가비율·모범재생 평균·재시도 평균 — 행동·추세만, 정오 점수 없음. (3) 부모 발음 들어보기(설정→PIN→부모결과): 앵커 단어별 예전▶/오늘▶ Drive 재생(GAS base64 중계, on-demand 1건), 정확/애매/틀림 선택 평가→발음검수 시트. 아이 화면 비노출. apps-script-v5.js: speaking_trend·audit_recording POST + get_anchor_recordings·get_recording_audio GET 추가(JH GAS 재배포 필요). IDB v3 인덱스 재사용. config perWordWeeklyCap.
// 이전 v5.70.0 (2026-05-31): 말하기 STT 자동채점 제거·자기비교 통일 1차 청크. 전 5경로(LR·RA/ST·toggleRecording·processPendingRecordings·stt_engine_compare) STT 채점·강등·점수 제거. 공유 자기비교 모듈(scState: 모범재생→자기재생→같았어/달랐어, '같았어'는 자기녹음 1회 청취 가드, '달랐어' cap2 후 자동진행). LR 3단계 사다리→1패스 붕괴+adjustLrLevel 중립화. RA/ST·generic 모범음원=Web Speech TTS. writeCoverReadAttempt에 blockType 필드(데이터계약 단일화). STT 인프라는 죽은코드로 정의만 보존. IndexedDB v2→3(cover_read_recordings itemId·auditedAt 인덱스). ST문구 '듣고 따라 읽어봐'. config coverReadAnchorSet 12개. 부모 then-vs-now 청취·시트적재·앵커 Drive는 2차 청크.
// 이전 v5.69.0 (2026-05-31): '오늘의 한 장' 6/8~6/14 7장 추가(14일 윈도우 완성, review_status auto). 세계 해양의 날·장마·누리호5차·2026월드컵개막·모기·선풍기·세계 헌혈자의 날. 각 카드 실제 이미지(Wikimedia Commons CC/PD/CC0/공공누리 KOGL, 출처·라이선스 기록, 눈확인) + PRECACHE 7장 추가. 헌혈 카드는 피·바늘 묘사 없이 적십자 헌혈버스(나눔 각도). daily_index version_key 갱신·rotation/calendar 재계산. 시사 2건 WebSearch 사실확인.
// 이전 v5.68.0 (2026-05-31): '오늘의 한 장' 시드 7장(6/1~6/7) 실제 이미지 추가 — daily-images/ 신설(Wikimedia Commons CC/PD/CC0, 출처·라이선스 기록). image_url/image_credit 채움(image_fallback 유지). PRECACHE에 7장 추가(오프라인 표시). 무지개·친근한 휴머노이드·수박단면·페트병수거함·블루마블(아폴로17 PD)·국립서울현충원(차분한 추모)·여름 파란하늘+해. 각 이미지 내용 눈 확인.
// 이전 v5.67.1 (2026-05-31): '오늘의 한 장' 순수 FIFO — pickNextQueueDate()·getDailyUnreadCount()에서 미래 날짜 게이트(d > today) 제거. 안 읽은 카드는 날짜 무관 가장 이른 미열람 순으로 노출(orphan 없음). 날짜 라벨/isToday 표시는 유지.
// 이전 v5.67.0 (2026-05-30): '오늘의 한 장' PO 이식 — daily 코너 신규. JSONP 월묶음(daily_YYYY-MM.js) + daily_index.js(version_key 캐시 분기) + 홈 재배치(배너+골고루학습+말하기 상단 2버튼+과목2×2+개념·기록 하단). 제목+리드 TTS는 Web Speech 로컬 전용(chirp3 미호출). FIFO 미열람 큐+지난글 archive+읽음 처리. daily_index.js·daily_2026-06.js PRECACHE 추가 + daily_*.js 오프라인 매칭 ignoreSearch(?v= 무시). 기존 말하기개편 Phase 2a(v5.66.0) 불변.
// 이전 v5.66.0 (2026-05-25): 말하기 개편 Phase 2a — 자율학습 판정 루프 (T1·T3·T2·T6·T5·T11·T9·T12·T13a). 3-state scheduler 전이 (learning↔auto_stable↔maintenance) + qualifying attempt (KST 00:00 day-key, sameDayDuplicate·scaffold·preReveal·modelReplayGt2·bonusPractice disqualify) + 비대칭 reset (probe miss vs self 다르게) + probe 출현 (mastery_gate + delayed_review, risk_gate Phase 2b 활성화) + phonetic_text_choice 3지선다 UI Step 6 (1.5s/2.5s pause) + scheduler-aware queue builder (learning · maintenance due · auto_stable excluded · bonus practice 4분리, bonus는 transition evidence 미반영) + writer payload 흐름 (schedulerStateBefore/After 실값, summary qualifyingAttempts·probesShown·probesCorrect 실값) + progress drift detection (cover_read_events 최신 20개 scan, console.warn 1회). spec v1.2 §2.2·§2.3·§2.4·§3.3·§3.5·§3.6·§3.7·§4.2·§11-3 정합. Phase 2b (calibration risk telemetry) · Phase 2c (Sheets upload) · Phase 3 (부모 audit UI) 제외.
// 이전 v5.65.3 (2026-05-23): Step 5 사용자 행동 안내 보강 + 버튼 문구 문법 정합화. selfPlayedOnce=true 메시지에 "아래 버튼을 누르면 다음 단어로 가" 추가 (사용자 "왜 안 넘어가지?" 신호 부재 보강). 버튼 라벨 "같게/다르게" → "같았어 ▶/달랐어 ▶" (질문 과거형 "같았어?" ↔ 응답 부사형 불일치 정정 + 화살표로 진행 신호). data 값 'same'/'different' 와 attempt event selfCompareRating 계약 불변 (closure memo §2-1). UI 라벨 ↔ 데이터 계약 분리.
// 이전 v5.65.2 (2026-05-23): cover_read UI 클릭 4건으로 감소 — Step 3→4(모범 TTS 종료) + Step 4→5(자기 녹음 재생 종료) 자동 전환 (PAUSE_AFTER_TTS_MS=1500 / PAUSE_AFTER_SELF_PLAY_MS=1500). Step 5에 🔊 모범 다시 듣기 버튼 추가 (modelReplayCount 누적·비교 능력 보존). 자기 녹음 onerror/play-reject 시 selfPlayFailed=true → Step 5에서 같게 disabled 유지 + 🎤 다시 녹음 버튼 노출. self-playback guardrail (§3.4 의식적 자기 청취) 유지. 자동 자기 재생 추가 안 함. attempt event schema 불변.
// 이전 v5.65.1 (2026-05-23): cover_read 활성 시 초기 파일럿 — Block 1 legacy quiz·Block 2 LR 모두 0장 기본 숨김 (config.json speakingPractice.coverReadLegacyQuizCardsPerSession=0 + coverReadLRCardsPerSession=0 신규 키). Block 2 LR cap 분기는 zero-safe typeof===number + 0~2 clamp + fallback 1. cover_read 비활성 시 기존 LR 3장 유지.
// 이전 v5.65.0 (2026-05-22 v7): 말하기 개편 Phase 1 — cover_read 첫 production loop + self-playback guardrail + RA 슬롯 교대 + legacy quiz count cap + IndexedDB v2 local write-path. Phase 2/3 (probe·scheduler·calibration risk·Sheets summary·부모 audit) 제외. closure memo §4 완료 기준 8건 + task spec 추가 검증 4건 충족.
// 이전 v5.64.7 (2026-05-22 v5): isChildVisibleCard()에 error_found 차단 line 추가 (Codex 2026-05-22 자문 §11-7 권고 + 사용자 결정). parentOnly와 의미 분리 주석 명시. 농짱짱 카드(crd_2026W14_sth_phon_06)는 disabled:true로 이미 차단되어 있었으나, error_found 자체가 노출 경로에 들어가는 정책 안전망 보강.
// 이전 v5.64.6 (2026-05-22): 개념 정리 과학 U4 5장 추가 (하루 동안 태양·별 위치 변화·지구의 자전·낮과 밤·지구의 공전·계절별 별자리) + index.html CONCEPT_UNIT_TITLE 'science::U4': '지구의 운동' 추가
// 이전 v5.64.5 (2026-05-20): 개념 정리 과학 U3 7장 추가 (세포·뿌리·줄기·잎 광합성·잎 증산 작용·꽃·식물 기관 연결성) + U2 라벨 정합화('물체의 운동'). U2 카드 #5(속력과 안전)는 사용자 결정으로 제외.
// 이전 v5.64.4 (2026-05-18): 개념 정리 과학 U2 4장 추가 (운동의 정의·운동의 표현·빠르기 비교·속력)
// 이전 v5.64.3 (2026-05-17): science.json sourceUnit 정합화 (37장) — U3·U4 단원 카드 0장 누수 해결, U2 부당 disabled 8장 복구, sci_u5 5장 disabled 통일
// 이전 v5.64.2 (2026-05-17): 개념정리 "관련 문제 풀어보기" 단원 내 미니 세션 (relatedCardIds 기반) 수정
// 이전 v5.64.1 (2026-05-17): index.html 중복 tail 정정
// 이전 v5.64 (2026-05-17): 개념 정리 v1 (과학 U1 5장) 추가
// 이전 v5.63 (2026-05-15): 성장 기록 Google Sheets 내려받기 반영
const CACHE_NAME = 'po-learning-v5770';
const PRECACHE = [
  './',
  './index.html',
  './growth.js',
  './config.json',
  './daily_index.js',
  './daily_2026-06.js',
  './english.json',
  './comprehension.json',
  './phrase-pool.json',
  './speech-therapy.json',
  './social-studies.json',
  './science.json',
  './weekly-anchor.json',
  './concept-cards.json',
  './concept-images/science/U1/cncpt_sci_u1_001.webp',
  './concept-images/science/U1/cncpt_sci_u1_002.webp',
  './concept-images/science/U1/cncpt_sci_u1_003.webp',
  './concept-images/science/U1/cncpt_sci_u1_004.webp',
  './concept-images/science/U1/cncpt_sci_u1_005.webp',
  './concept-images/science/U2/cncpt_sci_u2_001.webp',
  './concept-images/science/U2/cncpt_sci_u2_002.webp',
  './concept-images/science/U2/cncpt_sci_u2_003.webp',
  './concept-images/science/U2/cncpt_sci_u2_004.webp',
  './concept-images/science/U3/cncpt_sci_u3_001.webp',
  './concept-images/science/U3/cncpt_sci_u3_002.webp',
  './concept-images/science/U3/cncpt_sci_u3_003.webp',
  './concept-images/science/U3/cncpt_sci_u3_004.webp',
  './concept-images/science/U3/cncpt_sci_u3_005.webp',
  './concept-images/science/U3/cncpt_sci_u3_006.webp',
  './concept-images/science/U3/cncpt_sci_u3_007.webp',
  './concept-images/science/U4/cncpt_sci_u4_001.webp',
  './concept-images/science/U4/cncpt_sci_u4_002.webp',
  './concept-images/science/U4/cncpt_sci_u4_003.webp',
  './concept-images/science/U4/cncpt_sci_u4_004.webp',
  './concept-images/science/U4/cncpt_sci_u4_005.webp',
  './daily-images/2026-06-01-rainbow.jpg',
  './daily-images/2026-06-02-robot.jpg',
  './daily-images/2026-06-03-watermelon.jpg',
  './daily-images/2026-06-04-recycling.jpg',
  './daily-images/2026-06-05-earth.jpg',
  './daily-images/2026-06-06-memorial.jpg',
  './daily-images/2026-06-07-sun.jpg',
  './daily-images/2026-06-08-ocean.jpg',
  './daily-images/2026-06-09-rain.jpg',
  './daily-images/2026-06-10-nuri.jpg',
  './daily-images/2026-06-11-worldcup.jpg',
  './daily-images/2026-06-12-mosquito.jpg',
  './daily-images/2026-06-13-fan.jpg',
  './daily-images/2026-06-14-blooddonor.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // POST 등 비GET은 캐싱하지 않고 네트워크 직행
  if (req.method !== 'GET') {
    event.respondWith(fetch(req));
    return;
  }

  // cross-origin 또는 /api/ 는 캐시하지 않음
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  const isNavigation = req.mode === 'navigate' || req.destination === 'document';

  // same-origin GET 정적 자산: network-first + cache fallback
  event.respondWith(
    fetch(req).then(response => {
      if (response && response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
      }
      return response;
    }).catch(() => caches.match(req).then(cached => {
      if (cached) return cached;
      // [v5.67.0] daily 월묶음/인덱스: ?v= 쿼리 무시하고 매칭 (오프라인 stale 허용)
      if (/\/daily_(\d{4}-\d{2}|index)\.js$/.test(url.pathname)) {
        return caches.match(req, { ignoreSearch: true }).then(c2 => {
          if (c2) return c2;
          if (isNavigation) return caches.match('./index.html');
          return new Response('', { status: 504, statusText: 'Offline and not cached' });
        });
      }
      if (isNavigation) return caches.match('./index.html');
      return new Response('', { status: 504, statusText: 'Offline and not cached' });
    }))
  );
});
