// PO 학습 시스템 Service Worker
// v5.98.0 (2026-08-04): '오늘의 단어' 2026-W31 주간분 3장 배포 — 즉흥적(A1)·신경을 곤두세우다(A3)·물꼬를 트다(A3). 확정 N=3(PO_학습기록.xlsx 단어공급 앵커 2026-07-31, 실사용 2기기 동일 — 폴백 아님), 활성 3·예비 1(쩔쩔매다 = N 상한 초과, 품질 HOLD 아님). first_review_date 2026-08-06/08-07/08-05 = class_date 대비 7·8·8일로 전부 6~8일 창 안, 과거 backdate 0건. W30(앵커 2026-07-24)은 첫 인출 창이 이미 닫혀 JH 판정 A안으로 건너뜀 — weekly_A12=0, 4주 벡터 [0,0,0,1]. 신규 월파일 wordcards_2026-08.js 1경로 PRECACHE 추가(85→86항) — word_index.js는 이미 PRECACHE라 이 경로 없이 배포하면 오프라인 기기가 8월 목록만 받고 카드 본문을 못 받는다. 오프라인 ignoreSearch 정규식 wordcards_\d{4}-\d{2}가 새 파일을 이미 잡는다(정규식 무변경). 기존 배포 19장·wordcards_2026-07.js deep-equal 불변. 코드·렌더러·GAS·config·데이터 8파일 불변 — word 데이터 2파일 + PRECACHE 1경로 + 버전 무효화. CACHE bump(v5970→v5980). 변경 4파일: wordcards_2026-08.js(신규)·word_index.js·index.html·sw.js. 검수 FINAL = 02_Working/word-cards/review/2026-W31-주간추출-검수-v4.md.
// 이전 v5.97.0 (2026-08-04): 배치3 7/26~8/8 배포 — '오늘의 한 장' 14장 + '문해력 한 장' 14장(daily 7월 6 + 8월 8, 문해력 7월 6 + 8월 8). 신규 월파일 daily_2026-08.js·munhaerak_2026-08.js 2경로 PRECACHE 추가(이번 릴리스의 핵심 — daily_index.js는 이미 PRECACHE라 이 2경로 없이 배포하면 오프라인 기기가 8월 목록만 받고 본문을 못 받는다). daily_index 49→63항·munhaerak_index 22→36항, rotation history 28건(7/12~8/8) 재계산, calendar 7/29 세계 호랑이의 날(기념일)·8/7 입추(절기) 추가. 기존 July daily 25장·문해력 22장·index 49/22항 deep-equal 불변(HEAD 대조 확인). 8/8 동조(애시) 카드 출처는 1차 문헌 DOI(10.1037/h0093718). 데이터 정본 채택 GO(2026-08-04). 코드·렌더러·GAS·config 불변 — 데이터 8파일 + PRECACHE 2경로 + 버전 무효화. CACHE bump(v5960→v5970). 변경: daily_2026-07.js·daily_2026-08.js(신규)·daily_index.js·daily_one_page/·munhaerak_2026-07.js·munhaerak_2026-08.js(신규)·munhaerak_index.js·index.html·sw.js.
// 이전 v5.96.0 (2026-07-27): 주간 발성수업 연계모드 — 2회차(260726) 주차 콘텐츠 갱신. VR_CURRENT_PROGRAM(voice_recall_260726 / reviewDueDate 2026-08-02)·VR_CUES(3, 스타카토 도입·'배에 힘' 제외)·VR_RECALL_CARDS(2)·VR_TOPICS(3)·VR_EXTRA_ITEMS(8) 교체. VR_HAS_PICTURE_ASSETS=false·낭독 미포함 유지. 로직·데이터·config·GAS·PRECACHE 불변. CACHE bump(v5950→v5960). 변경 2파일: index.html·sw.js. ⚠ 아이 기기는 푸터가 v5.96.0·sw5960인지 먼저 확인한 뒤 부모 패널에서 모드를 재전환해야 새 programId가 적용된다(vrParentActivate는 로드된 상수를 저장 — 설계 §9-1).
// v5.95.0 (2026-07-26): 문해력 한 장·오늘의 단어 시트 기록 연동. 문해력=양방향 union('문해력읽음' 시트, push=markMunhaerakAsRead 최초 읽음·pull=updateHomeScreen+loadMunhaerakToday, syncMunhaerakReadFromCloud). 오늘의 단어=단방향 기록 3탭(단어일별·단어카드·단어공급, poWordPushState, closeWordPage+앱시작, GET 없음=진도 되돌림 방지 D3). 기기 식별자 po_device_id_v1 신설(poGetDeviceId, 개인정보 미수집). GAS: doPost munhaerak_read_sync·word_state_sync + doGet get_munhaerak_read(word는 GET 없음) 신설, 3탭 upsert(키=날짜/카드ID/앵커일 × 기기)·LockService tryLock 멱등·if(got)releaseLock. **GAS 재배포 필수(구버전은 새 type을 세션로그로 흘림 R1)**. 데이터·config·PRECACHE 불변. CACHE bump(v5940→v5950). 변경 3파일: apps-script-v5.js·index.html·sw.js.
// 이전 v5.94.0 (2026-07-21): 주간 발성수업 연계 모드(voice_recall) 신설. 설계 정본 00_Context/2026-07-21-주간발성수업-연계모드-설계안-v1.3.md + 착수문 v1.1. 전용 키 po_voice_speaking_mode_v1{speakingMode,programId,reviewDueDate}(po_v4_settings 미오염, activityType은 record에서 programId 파생) — 누락·손상·미지값은 전부 안전 기본값 cover_read, 오류로 voice_recall 임의 활성화 없음. startSpeakingPracticeSession() 첫 줄에서 분기 → voice_recall이면 startVoiceRecallSession()로 즉시 return(coverReadActive 판정·crLoadCoverReadProgressMap·cleanupCoverReadStorage(만료 삭제)·crBuildCoverReadQueue 실행 전). 종료도 전용 endVoiceRecallSession() — 점수·정답률·streak·전역 학습일/진도·연음 업로드 미호출, 일일 상태만 기록. 아이 화면 page-voice-recall 7단계(회상→힌트 3줄 '배에 힘/성대를 쪼이는 느낌/조금 빠르고 단단하게'→고정카드 야여요유·안녕하세요→주제 3택→앱 두고 대화→자기표시→'오늘의 목소리 시작 ✓'), 점수·정오·판정·타이머·시각화·TTS 재생 0, '오늘 완료/숙제 완료/오늘 훈련 끝' 0건, 아이 단서에 '악쓰듯' 미포함. 일일 상태 po_voice_recall_state_v1은 programId+localDate별 분리 저장(단일 객체 금지 — 덮어쓰기 없음, waiting_parent 재개=대화 단계, 같은 날 중복 없음, 새 programId가 이전 기록 미삭제). IndexedDB po_recordings v3→v4 가산 migration(oldVersion<4에서 voice_recall_recordings만 신설, 기존 3 store·itemId/auditedAt 인덱스·record·blob 불변, upgrade 실패 시 녹음만 불가·흐름 계속) — open 호출부는 openRecordingsDB 1곳뿐. 부모 PIN 화면(#vr-parent-panel)에 '선생님과 했던 목소리 연습 시작'·'연음으로 돌아가기'(명시 복귀, 자동 없음)·'오늘은 쉬기'(rested 무손실)·참고 표본 녹음 2종(앱 시작/다음 수업 전, 고정문장 '안녕하세요', 자동 '마지막 날' 판정 없음)·재생·선생님 확인 표시·부모 전용 안전 안내. 발성 녹음 자동 업로드 없음(부모 PIN 재생 전용), 보존 14일/검수 시 max(14, 검수+7), cleanup은 voice_recall_recordings만 열고 연음 store 미접근하며 startVoiceRecallSession 진입 시 실호출. 홈 버튼 부제 모드별 분기(voice_recall='선생님과 했던 목소리 연습' / cover_read='소리 내어 읽기' 복원, HTML 기본값도 후자). 연음 원본 5종(po_v5_cover_read_progress·po_v5_cover_read_stage_unlocks·po_v4_anchor_uploaded_weeks·cover_read_recordings·cover_read_events) 불변·발성모드 중 transaction 0건. 그림 단어는 원본 미확보로 섹션 미렌더(글자 대체 금지). 부모 런타임 모드 전환에는 SW bump 없음 — 이번은 코드 변경이라 bump. 데이터·GAS·PRECACHE 불변. CACHE bump(v5930→v5940). 변경 2파일: index.html·sw.js.
// 이전 v5.92.0 (2026-07-16): 홈 집중 모드 — 아이 화면을 언어·읽기로 한정. 단일 플래그 PO_HOME_FOCUS_MODE(index.html)로 (1) 과목 그리드(영어·독해·사회·과학) 렌더 경로 조기 return — tileOrder 폴백(빈 배열·구타일→4타일 하드코딩)에 도달하지 않으므로 config.json tileOrder는 4과목 그대로 두고도 그리드 미부활, 추천 배지·카드 풀 조회도 생략, (2) 골고루 학습 버튼 숨김 + .home-top-actions.focus-solo(1열)로 말하기 연습이 상단 행 전체 사용, (3) 개념 정리 타일 숨김(카드 수 조회 생략), (4) renderResumeBanner 허용목록 — 숨긴 과목의 '이어하기' 배너 차단(말하기 연습만 통과, localStorage 미삭제), (5) ★updateHomeScreen이 집중 모드에서 레거시 홈으로 폴백하지 않음 — 레거시 홈의 유일 버튼 '시작하기'가 startSession()=골고루로 직행해, config.json 로드·파싱 실패(APP.config={}) 시 숨김이 통째로 무력화되던 잔여 경로 차단(집중 모드 renderSubjectTileHome은 APP.config 미참조라 안전). 유지: 오늘의 한 장 배너·말하기 연습·키·몸무게. 레이아웃: #page-home이 flex column+align-items:center라 각 줄이 콘텐츠 너비로 들쭉날쭉(배너 212·말하기 124·키몸무게 152) → #page-home.focus-mode에서 앱 관례(width:100%;max-width:400px)로 3줄 400px 통일. 신규: #tile-word(🔤 오늘의 단어) 독립 진입점 자리 예약 — display:none, onclick 미연결(스펙 확정 후 구현). 카드·콘텐츠·JSON·파이프라인·GAS·PRECACHE 불변(데이터 변경 0). 되돌리기: PO_HOME_FOCUS_MODE=false. CACHE bump(v5910→v5920). 변경 2파일: index.html·sw.js.
// 이전 v5.91.0 (2026-07-15): 배치2 7/12~7/25 — '오늘의 한 장' 14장 + '문해력 한 장' 14장(신규 활동 3종 첫 운영 투입: delete_noise 5·generalize 5·reconstruct 4, correct 분포 0/1/2=3/3/3). 두 트랙 같은 날짜·같은 주제이되 지문 각자 작성(연속 15자 공통 0건, 최장 12자). 주제 14건 JH LOCK(과학4·역사5·철학5). 전 주제 WebSearch 권위출처 재검증 — 제헌절 2026 공휴일 재지정(법률 제21338호)·마이야르 120℃(140~165℃는 무출처)·바다 염분은 증발 아닌 축적(NOAA)·선택의 역설은 논쟁 중·온돌 유네스코 미등재 반영. daily 카테고리 매핑 계절2(7/12 유엔 모래·먼지폭풍의 날·7/17 제헌절)+생활12, review_status auto. 신규 실사진 8장(Wikimedia PD/CC0/CC BY/CC BY-SA, 출처·라이선스 기록, 눈확인) + PRECACHE 8장 추가, 철학 5장·가야는 image_url null+fallback. 문해력 review_status parent_review, 누설 게이트 최장 7자(<12). daily_index 49항·munhaerak_index 22항·version_key 20260715-2100·rotation 28d 트림·calendar 제헌절 covered_angle+7/12 신설. 기존 daily 11장·문해력 8장 deep-equal 불변. CACHE bump(v5900→v5910). 변경: daily_2026-07.js·daily_index.js·daily_one_page/·daily-images/·munhaerak_2026-07.js·munhaerak_index.js·index.html·sw.js.
// 이전 v5.90.0 (2026-07-15): 문해력 한 장 interaction 4종 렌더러(선행 앱작업). renderMunhaerakCard가 처음으로 c.interaction을 읽어 STEP1을 타입별 분기 — pick_core_sentence(기존, 명시적 분기 이전)·delete_noise(곁가지 복수토글+확인, 집합 완전일치)·generalize/reconstruct(읽기전용 .mh-read 지문 + 별도 .mh-opt 옵션, option index 채점). 공통 mhSolveStep1 헬퍼(노드 인자·내부 전역검색 금지, 크로스 오채점 부활 차단). 미지원 interaction은 pick_core로 조용히 대체 안 하고 명시 오류카드+console.error+진행차단. 신규 CSS(.mh-read/.mh-opt/.mh-cut+상태). poIsActivityInProgress()에 page-munhaerak 추가(풀이 중 즉시리로드→업데이트 배너, 선택상태 보존). STEP2/3·읽음처리(mh-toStep3 시 markMunhaerakAsRead)·model STEP3 최초공개 불변. PRECACHE·데이터·GAS 불변. CACHE bump(v5890→v5900). 변경 2파일: index.html·sw.js.
// 이전 v5.89.0 (2026-07-05): 오늘의 한 장 → 문해력 한 장 이어가기. 홈 문해력 배너(munhaerak-banner) 제거 — 문해력 유일 입구를 오늘의 한 장 흐름 안으로 이동. renderDailyToday 카드 끝(센티넬 뒤)에 "🧠 오늘의 문해력 한 장 →" 버튼(오늘 큐·아카이브 모두 항상 렌더, goDailyToMunhaerak) + renderDailyQueueEmpty("다 봤어요") 화면에도 버튼(openMunhaerakPage). 홈 배너 HTML/CSS(.munhaerak-banner)/배선 2곳 제거, updateMunhaerakUnreadBadges 유지(페이지 배지 b2 계속 동작). 홈 문해력 숫자 배지 사라짐(JH 승인). 콘텐츠 JSON·GAS·PRECACHE 불변. CACHE bump(v5880→v5890). 변경 2파일: index.html·sw.js.
// v5.88.0 (2026-07-05): 문해력 한 장 8번째 카드 추가(식물 광합성 — 2026-07-11, pick_core_sentence, correct=3). '오늘의 한 장' 남은 8장과 수 맞춤. 교과서 6-1 과학 '잎에서 양분' 단원 정합(빛+이산화 탄소+물→양분, 주로 잎 / 뿌리=물 흡수 오개념 가드). 출처 2개 재검증(Britannica Kids·Smithsonian SSEC). 코드·렌더러·PRECACHE 불변 — 데이터 2파일(munhaerak_2026-07.js append·munhaerak_index.js 8항) + 버전 무효화. CACHE bump(v5870→v5880). 변경: munhaerak_2026-07.js·munhaerak_index.js·index.html·sw.js.
// v5.87.0 (2026-07-04): '문해력 한 장' 코너 신설(배치1 과학 7장 — pick_core_sentence). PO-native 앱내 화면(page-munhaerak) + 홈 진입 배너(munhaerak-banner) + 3단계 렌더러(STEP1 핵심 뽑기 채점 → STEP2 소리내어 요약 → STEP3 모범/구조맵/셀프체크/출처). JSONP 로더(munhaerak_index.js + munhaerak_2026-07.js, 전역 콜백 __loadMunhaerakIndex/__loadMunhaerakMonth) + FIFO 미열람 큐(로컬 po_munhaerak_read_ids, 클라우드 동기화 없음) + '지난 것' 아카이브. 7장 전부 §7 WebSearch 권위출처 재검증(박쥐 반향정위·낙타 혹 지방·금붕어 기억·뇌 10% 미신·새=공룡 후손·우주 무음·별똥별=유성). 아이 영상 버튼 없음(출처만). index.html: CSS(.mh-*·.munhaerak-banner)+DOM(page-munhaerak·홈배너)+JS모듈+홈 렌더러 2곳 대칭 배선+버전 2줄. 신규 파일 2개 PRECACHE 추가. CACHE bump(v5860→v5870). 변경: index.html·sw.js + 신규 munhaerak_index.js·munhaerak_2026-07.js.
// 이전 v5.86.0 (2026-07-01): 독해 58·59·60회 24장 머지(comprehension.json append, displayIndex 244~267). 회차 번호 사용자 확정, parent_review 초안 머지, 카드 무수정. CACHE bump(v5850→v5860).
// 이전 v5.85.0 (2026-07-01): 독해 55·56·57회 24장 머지(comprehension.json append, displayIndex 220~243). parent_review 초안 머지, 카드 무수정. CACHE bump(v5840→v5850).
// 이전 v5.84.0 (2026-06-27): '오늘의 한 장' 6/28~7/11 14장 추가 (교차월 첫 배치 — 6/28~30은 daily_2026-06.js, 7/1~11은 신규 daily_2026-07.js). 시사2(다누리·월드컵규모)·생활7·계절5, review_status auto. 각 카드 실사진(Wikimedia Commons CC/CC0/PD/KOGL, 출처·라이선스 기록, 눈확인) + PRECACHE 14장 + daily_2026-07.js 추가. daily_index version_key 갱신·rotation 28d 트림·calendar 소서 추가. 데이터+이미지 머지 + CACHE bump(v5830→v5840). 변경: daily_2026-06.js·daily_2026-07.js·daily_index.js·daily_one_page/·daily-images/·index.html·sw.js.
// 이전 v5.83.0 (2026-06-14): 서비스워커 자동 업데이트. index.html SW 등록부 교체 — (1) register 후 페이지 로드마다 registration.update()로 새 sw.js 능동 확인, (2) controllerchange 시 sessionStorage 플래그(po_sw_reloaded)로 1회만 location.reload()(무한 새로고침 방지), (3) 카드 풀이(page-card)·개념 카드(page-concept-card) 활성 중에는 즉시 리로드 대신 가벼운 안내 배너(#po-sw-update-banner) 노출, (4) 최초 설치(poHadController=false)는 clients.claim()발 controllerchange여도 리로드 스킵. CACHE_NAME bump(v5820→v5830)으로 배포 캐시 무효화. 데이터·GAS·PRECACHE 변경 0. 변경 2파일: index.html·sw.js.
// 이전 v5.82.0 (2026-06-12): 연음 적용3·4 stage3/4/5 추가 (코드+데이터, GAS·PRECACHE 불변). speech-therapy.json coverReadSets[0].items 41→108(신규 67=stage3 비단어25 nonword·stage4 사자성어12·stage5 의미30, 단독낱말=allForms 생략·step1 폴백). config 앵커 12→14(그은음·심입생 승격)·신규 키 2(coverReadMeaninglessSessionCap=4·coverReadSlowListenRate=0.7). index.html 6곳: ★§3-0 전이 교착 해소(probe 데이터 없는 item은 probeCorrectStreak 요건 면제 — probeAvailable payload+crItemHasProbeData 헬퍼+crSchedulerAdvance 3조건, probe 보유 item은 기존 동작 보존)·§3-1 카드매핑 nonword/meaningless·§3-2 crBuildCoverReadQueue 무의미 세션상한(crMlAdmit, push 3지점, meaninglessSkipped stat)·§3-3 비단어 안내문(step1·2)·§3-4 단독낱말 원리버튼 숨김·§3-5 🐢 천천히 듣기(crPlayModel rate 옵션, modelReplayCount 제외·slowReplayCount 신설). 전이 교착은 v5.79.x 잠복 결함이기도 함(적용2 미등장). 변경 4파일: speech-therapy.json·config.json·index.html·sw.js.
// 이전 v5.81.0 (2026-06-12): 정답 누설 일괄 제거(데이터만, 앱 코드 변경 0) + hint 객체화 + 오탈자. 독해 comprehension.json 64장 지문 끝 정답 문구 제거(끝-고정 누설, passage.text+ttsText 양쪽, 4장은 정답=마지막문장이라 원복·리라이트목록)·사회 social-studies.json 52장 "따라서~입니다" 문장 제거·영어 english.json ttsText 정답 누출 9장(빈칸4=정답문장 제거·문맥유지, "영어로 하면"류+단문장 5=한국어 프롬프트로 교체) + unit6 hint 문자열→객체 13장(hint.text 렌더 빈칸 버그 해소) + 오탈자 가엾슨→가엾은·헬쑥한→핼쑥한 + 독해 차단 5장 id 중복 _dup_blocked suffix(전역 유니크화). 카드 추가·삭제·reviewStatus·displayIndex 변경 0. 정답률 기준선 리셋 시점(공짜 정답 구간 종료). 변경 5파일: comprehension.json·social-studies.json·english.json·index.html(버전 2줄)·sw.js.
// 이전 v5.80.0 (2026-06-10): '오늘의 한 장' 6/15~6/21 7장 추가(6/1~6/14 14장과 합쳐 21일 윈도우, review_status auto). 천둥번개(빛·소리 속도차)·월드컵 한국 대표팀(A조 일정)·사막화와가뭄방지의날(6/17)·여름철식중독예방·단오(6/19)·아이스크림 머리띵(brain freeze)·하지(6/21). 각 카드 실제 이미지(Wikimedia Commons CC BY/CC BY-SA, 출처·라이선스 기록, 눈확인) + PRECACHE 7장 추가. 천둥=먼 바다 번개(위협 아님)·식중독=손씻기(긍정). 3중 회피: 하지↔6/7 해길이(원리 반복 회피)·천둥↔6/9 장마·월드컵대표팀↔6/11 개막 분리. 시사 2건+단오·하지·사막화 WebSearch 사실확인. daily_index version_key 20260610-1100·rotation/calendar 재계산. 데이터+이미지 머지 + 캐시 무효화 CACHE_NAME bump. 변경: daily_2026-06.js·daily_index.js·daily_one_page/·daily-images/·index.html·sw.js.
// 이전 v5.79.1 (2026-06-05): 손상된 stage unlock 값 저장소 정정. v5.79.0은 데이터 유효 상한(maxStage) 초과 손상값(예: 99)을 런타임에서 clamp만 하고 저장 안 해 localStorage에 손상값이 남았음. 정정: crBuildCoverReadQueue가 maxStage 반환 → 호출부에서 prevMax>maxStage면 clamp된 정상값으로 하향 정정 저장(else if=세션당 1회). 정상 범위(<=maxStage) 값은 기존 분기(상승만)로 절대 안 내림 — one-way latch 유지. 빌더 내부 localStorage write 0 불변(저장은 호출부만). 변경 3파일: index.html·config.json(note)·sw.js.
// 이전 v5.79.0 (2026-06-05): 연음 적용2 stage 게이팅 one-way latch 패치. "적용2가 한 번 열린 뒤 적용1 낱말 revert로 다시 닫히는 flapping"을 막음. crBuildCoverReadQueue에 latch(maxUnlockedStage, set 단위) 도입 — dynamic open은 올리기만(one-way), eligible stage(S<=maxUnlockedStage)만 큐 채움, bonus도 열린 stage만 filter. 임계치 기본 2→3(config.speakingPractice.coverReadStageUnlockMaxRemaining, 코드 기본값도 3 = 17/20 안정화). 신규 localStorage 키 po_v5_cover_read_stage_unlocks(corrupt/누락→minStage fallback). 마이그레이션: progressMap에 stage N item "실제 연습 흔적"(lastAttemptTimestamp/distinctProductionDays>0/상태≠learning) 있으면 maxUnlockedStage≥N 추론. 저장은 호출부 세션당 1회(큐 빌더는 순수). 적용1 약점은 재폐쇄 아니라 stage-first 정렬로 우선 노출. GAS·speech-therapy.json·앵커·PRECACHE 변경 0. 변경 3파일: index.html·config.json·sw.js.
// 이전 v5.78.0 (2026-06-04): 독해 48·49·50·51·53·54회 48장 머지(comprehension.json append, displayIndex 172~219). 자동 스케줄러 초안(전부 reviewStatus parent_review·validationStatus pass) 머지. 카드 내용 무수정(displayIndex만 부여). 52회 없음(정상 갭). 코드/GAS 변경 0 — 데이터 머지 + 캐시 무효화 위한 CACHE_NAME bump.
// 이전 v5.77.0 (2026-06-03): 연음 적용2(용언+어미 p.21~22) 추가 + 순차 스케줄러(stage 게이팅). cover_read 풀에 적용2 21낱말 추가(speech-therapy.json coverReadSets[0].items 20→41, 기존 적용1 20개 stage:1·신규 적용2 21개 stage:2·anchor:false). "순서대로": crBuildCoverReadQueue learning 채움 단계를 stage 게이팅으로 교체 — 적용1(낮은 stage)은 항상 노출, 적용2(높은 stage)는 하위 stage learning 수 합 <= unlockThreshold(config.speakingPractice.coverReadStageUnlockMaxRemaining ?? 2)일 때만 개방. 정렬: stage asc→난이도(저<3 먼저, 고>=3 뒤)→버킷내 shuffle. maintenance due 우선·partition·perSession(10)·bonus 불변. 적용2 anchor:false → 부모청취·Drive·말하기추세·config.coverReadAnchorSet(앵커 12개) 변경 0. 원리카드(v5.75.0)·차이듣기는 allForms 자동 호환(코드 변경 0). config.json speakingPractice 블록에 coverReadStageUnlockMaxRemaining:2 신규 키(★최상위 아님). stage 누락→1, config 키 누락→2 폴백. GAS 재배포·PRECACHE 변경 0. 변경 3파일: index.html·speech-therapy.json·sw.js + config.json(1키).
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
const CACHE_NAME = 'po-learning-v5980';
const PRECACHE = [
  './',
  './index.html',
  './growth.js',
  './config.json',
  './daily_index.js',
  './daily_2026-06.js',
  './daily_2026-07.js',
  './daily_2026-08.js',
  './munhaerak_index.js',
  './munhaerak_2026-07.js',
  './munhaerak_2026-08.js',
  './word_index.js',
  './wordcards_2026-07.js',
  './wordcards_2026-08.js',
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
  './daily-images/2026-06-15-thunder.jpg',
  './daily-images/2026-06-16-worldcup-kr.jpg',
  './daily-images/2026-06-17-desert.jpg',
  './daily-images/2026-06-18-handwash.jpg',
  './daily-images/2026-06-19-dano.jpg',
  './daily-images/2026-06-20-icecream.jpg',
  './daily-images/2026-06-21-haji.jpg',
  './daily-images/2026-06-28-danuri.jpg',
  './daily-images/2026-06-29-moon-phases.jpg',
  './daily-images/2026-06-30-cicada.jpg',
  './daily-images/2026-07-01-waterstrider.jpg',
  './daily-images/2026-07-02-laundry.jpg',
  './daily-images/2026-07-03-soap-bubble.jpg',
  './daily-images/2026-07-04-pool.jpg',
  './daily-images/2026-07-05-stars.jpg',
  './daily-images/2026-07-06-spiderweb.jpg',
  './daily-images/2026-07-07-soseo.jpg',
  './daily-images/2026-07-08-airplane.jpg',
  './daily-images/2026-07-09-sunscreen.jpg',
  './daily-images/2026-07-10-fossil.jpg',
  './daily-images/2026-07-11-worldcup-2026.jpg',
  './daily-images/2026-07-12-sandstorm.jpg',
  './daily-images/2026-07-13-ondol.jpg',
  './daily-images/2026-07-15-river-sea.jpg',
  './daily-images/2026-07-16-excavation.jpg',
  './daily-images/2026-07-17-constitution.jpg',
  './daily-images/2026-07-19-turtle-shell.jpg',
  './daily-images/2026-07-20-oracle-bone.jpg',
  './daily-images/2026-07-22-maillard.jpg',
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
      // [v5.67.0] daily 월묶음/인덱스 + [word] 오늘의 단어 인덱스/월묶음: ?v= 쿼리 무시하고 매칭 (오프라인 stale 허용)
      if (/\/(?:daily_(?:\d{4}-\d{2}|index)|word_index|wordcards_\d{4}-\d{2})\.js$/.test(url.pathname)) {
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
