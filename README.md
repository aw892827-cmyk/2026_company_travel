# 2026 首創公司員工旅遊

活動報名網站與 Google Apps Script 試算表端點。

## 網站

Pages 網址：待 GitHub Pages 部署完成後填入。

本機預覽：在專案根目錄執行 `py -m http.server 8000`，再開啟 `http://localhost:8000`。

## Google Sheet 與 Apps Script

1. 在 Google Apps Script 建立專案，將 `apps-script/Code.gs` 貼入編輯器。
2. 選取並執行 `setup`，登入 Google 帳號並授權。這會建立或連結 `2026_公司旅遊` 試算表、設定標題列，並把電話欄設為純文字。
3. 建立網頁應用程式部署，執行身分選擇「我」，存取權選擇「任何人」。公開存取代表任何知道網站的人都能提交報名；部署前請確認符合公司個資政策。
4. 複製部署產生的 `/exec` 網址，填入 `app.js` 的 `SCRIPT_URL`。
5. 將更新後的網站推送至 GitHub Pages，再用兩筆核准的測試資料確認試算表新增資料及電話前導零。

## GitHub Pages

GitHub Pages 請使用 `main` 分支的根目錄。`spec/` 已透過 `.gitignore` 排除，不會推送。