const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTD2SVwi5wjFyuD_7QdwYzU5WVPIzEQaiDrIuxP0BWZGAwRtgPyAsuatOe_Fm96Jg/exec';

const form = document.querySelector('#registration-form');
const submitButton = form.querySelector('button[type="submit"]');
const statusMessage = document.querySelector('#form-status');

function showStatus(message, state = 'success') {
  statusMessage.textContent = message;
  statusMessage.dataset.state = state;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;
  if (!SCRIPT_URL) {
    showStatus('報名服務尚未連線，請完成 Google Apps Script 部署後再試。', 'error');
    return;
  }

  form.action = SCRIPT_URL;
  form.method = 'POST';
  form.target = 'registration-target';
  submitButton.disabled = true;
  showStatus('資料送出中…');
  HTMLFormElement.prototype.submit.call(form);
});

window.addEventListener('message', (event) => {
  if (event.source !== document.querySelector('.submission-frame').contentWindow) return;
  if (event.data?.type !== 'registration-result') return;

  submitButton.disabled = false;
  if (event.data.ok) {
    form.reset();
    showStatus('報名完成！期待與你一同出發。');
  } else {
    showStatus('送出失敗，請稍後再試或聯絡活動窗口。', 'error');
  }
});