// diary.js

let diaryData = {
    keep: '',    // 오늘 좋았던 일
    problem: '', // 오늘 아쉬웠던 일
    try: ''      // 내일은 이렇게 해보자!
};

let diaryContainerElement = null; // .right-pane의 ID를 가진 요소
let onDiaryDataChangeCallback = () => {};

const SECTION_DETAILS = {
    keep: { title: "오늘 좋았던 일 (Keep)", placeholder: "오늘 있었던 긍정적인 경험이나 성과, 계속 이어가고 싶은 좋은 습관 등을 기록해보세요..." },
    problem: { title: "오늘 아쉬웠던 일 (Problem)", placeholder: "개선하고 싶거나 아쉬웠던 점, 어려웠던 문제 상황 등을 솔직하게 적어보세요..." },
    try: { title: "내일은 이렇게 해보자! (Try!)", placeholder: "오늘을 바탕으로 내일 시도해볼 구체적인 액션 아이템, 새로운 다짐 등을 계획해보세요..." }
};

// --- Data Management ---
function saveDiaryToLocalBackup() {
    onDiaryDataChangeCallback(); // 변경 사항을 메인 앱에 알림
}

// --- DOM Manipulation & Event Handlers ---
function createDiarySectionElement(key) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'dv-diary-section'; // << 수정됨
    sectionDiv.id = `diary-${key}`;

    const titleElement = document.createElement('h3');
    titleElement.textContent = SECTION_DETAILS[key].title;

    const textarea = document.createElement('textarea');
    textarea.placeholder = SECTION_DETAILS[key].placeholder;
    textarea.value = diaryData[key] || ''; // Load initial text

    textarea.addEventListener('input', () => {
        diaryData[key] = textarea.value;
        saveDiaryToLocalBackup(); // 입력 시마다 로컬 백업 및 변경 알림
    });

    sectionDiv.appendChild(titleElement);
    sectionDiv.appendChild(textarea);
    return sectionDiv;
}

function renderDiaryInternal() {
    if (!diaryContainerElement) return;
    diaryContainerElement.innerHTML = ''; // Clear previous content

    Object.keys(SECTION_DETAILS).forEach(key => {
        const sectionElement = createDiarySectionElement(key);
        diaryContainerElement.appendChild(sectionElement);
    });
}

// --- Exported Functions ---
export function initDiaryApp(containerSelector, initialData, dataChangedCallback = () => {}) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Diary app container "${containerSelector}" not found.`);
        return;
    }
    diaryContainerElement = container;
    onDiaryDataChangeCallback = dataChangedCallback;

    if (initialData && typeof initialData === 'object') {
        diaryData = {
            keep: initialData.keep || '',
            problem: initialData.problem || '',
            try: initialData.try || ''
        };
    } else {
        diaryData = { keep: '', problem: '', try: '' };
    }
    
    renderDiaryInternal();
}

export function setDiaryDataAndRender(newData) {
    if (newData && typeof newData === 'object') {
        diaryData = {
            keep: newData.keep || '',
            problem: newData.problem || '',
            try: newData.try || ''
        };
    } else {
        diaryData = { keep: '', problem: '', try: '' }; // Fallback to empty
    }
    renderDiaryInternal();
}

export function getDiaryData() {
    // Return a copy of the current diary data
    return JSON.parse(JSON.stringify(diaryData));
}