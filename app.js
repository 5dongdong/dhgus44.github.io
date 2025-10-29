import { supabase } from './supabaseClient.js';

const createForm = document.getElementById('createForm');
const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const postsList = document.getElementById('postsList');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');

// 유틸: 날짜 포맷!
const fmt = (ts) => new Date(ts).toLocaleString();

// CREATE!
createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title) {
    alert('제목은 필수예요!');
    return;
  }
  const { error } = await supabase.from('posts').insert([{ title, content }]);
  if (error) {
    console.error(error);
    alert('등록 실패!');
    return;
  }
  titleInput.value = '';
  contentInput.value = '';
  await loadPosts();
});

// READ + 검색!
refreshBtn.addEventListener('click', async () => {
  searchInput.value = '';
  await loadPosts();
});
searchInput.addEventListener('input', () => {
  render(currentRows.filter(row =>
    row.title.toLowerCase().includes(searchInput.value.toLowerCase())
  ));
});

let currentRows = [];

// 목록 불러오기!
async function loadPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    alert('불러오기 실패!');
    return;
  }
  currentRows = data || [];
  render(currentRows);
}

// 렌더링!
function render(rows) {
  postsList.innerHTML = '';
  if (!rows || rows.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  rows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'item';

    const left = document.createElement('div');
    const titleEl = document.createElement('div');
    titleEl.innerHTML = `<strong>${escapeHtml(row.title)}</strong>`;
    const contentEl = document.createElement('div');
    contentEl.textContent = row.content || '';
    const metaEl = document.createElement('div');
    metaEl.className = 'meta';
    metaEl.textContent = `ID: ${row.id} · ${fmt(row.created_at)}`;

    left.appendChild(titleEl);
    left.appendChild(contentEl);
    left.appendChild(metaEl);

    const right = document.createElement('div');
    right.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'secondary';
    editBtn.textContent = '수정!';
    editBtn.addEventListener('click', () => openEdit(row));

    const delBtn = document.createElement('button');
    delBtn.className = 'danger';
    delBtn.textContent = '삭제!';
    delBtn.addEventListener('click', () => onDelete(row.id));

    right.appendChild(editBtn);
    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);
    postsList.appendChild(li);
  });
}

// UPDATE 다이얼로그!
async function openEdit(row) {
  const newTitle = prompt('새 제목을 입력하세요!', row.title);
  if (newTitle === null) return;
  const newContent = prompt('새 내용을 입력하세요!', row.content || '');
  if (newContent === null) return;

  if (!newTitle.trim()) {
    alert('제목은 비울 수 없어요!');
    return;
  }

  const { error } = await supabase
    .from('posts')
    .update({ title: newTitle.trim(), content: newContent })
    .eq('id', row.id);

  if (error) {
    console.error(error);
    alert('수정 실패!');
    return;
  }
  await loadPosts();
}

// DELETE!
async function onDelete(id) {
  if (!confirm('정말 삭제할까요!')) return;
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) {
    console.error(error);
    alert('삭제 실패!');
    return;
  }
  await loadPosts();
}

// XSS 방지용 escape!
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// 첫 로드!
loadPosts();
