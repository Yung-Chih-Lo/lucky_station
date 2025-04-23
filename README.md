# 坐火行 (chò-hué kiânn) 🚆

## 專案概述 (Project Overview)

在現代生活中，隨機旅行成為許多人尋求新鮮感與冒險體驗的方式。然而，規劃未知旅程可能面臨選擇困難。受到探索台灣鐵道與各地風景相關影片的啟發，我們設計了「坐火行」這個方便且互動性高的應用程式，旨在協助使用者以更有趣、更直觀的方式隨機抽選台灣各地的台鐵車站，輕鬆開啟一場未知的鐵道小旅行。

透過「坐火行」，您可以擺脫選擇的煩惱，讓緣分帶您前往下一站的未知風景。

## 展示影片 (Demo Video)

您可以觀看以下介紹影片，快速了解「坐火行」的功能與操作方式：

[觀看介紹影片](intro.mp4) 

## 功能特色 (Features)

-   **🗺️ 互動式台灣地圖 (Interactive Taiwan Map):**
    直觀呈現各縣市的選取狀態。點擊地圖上的縣市可切換選取，已選縣市會亮起，未選則變暗，提供良好的視覺回饋。
-   **✅ 縣市篩選與互動 (County Filtering & Interaction):**
    提供台灣各縣市的 Checkbox 列表，使用者可自由勾選或取消勾選想前往的縣市。
    -   提供「全選」與「全部取消」按鈕，快速調整篩選範圍。
    -   列表與地圖互動同步，操作任一方都會更新另一方的狀態。
-   **💡 各縣市車站列表查閱 (View Station List by County):**
    在縣市選擇文字旁提供資訊圖標，點擊後可彈出 Modal 視窗，查看各縣市完整的台鐵車站列表。
-   **🎯 隨機抽取車站 (Random Station Picker):**
    根據使用者勾選的縣市範圍，隨機選擇一個台鐵車站作為目的地。
-   **✨ 抽取動畫效果 (Random Pick Animation):**
    抽取結果顯示前，會有一段快速隨機跳動車站名稱的動畫，增加抽取過程的趣味性與儀式感。
-   **📍 車站資訊連結 (Station Info Links):**
    抽取結果 Modal 顯示最終車站後，提供直接連結到該車站的維基百科頁面和 Google Map 位置，方便使用者進一步了解和規劃行程。
-   **📱 響應式設計 (Responsive Design):**
    介面適應不同螢幕尺寸，在行動裝置上會自動調整佈局，提供更佳的使用者體驗（例如：地圖與選擇控制項改為垂直堆疊）。

## 安裝與設定 (Installation & Setup)

若要在您的本地環境運行此專案，請依照以下步驟：

1.  **複製儲存庫 (Clone the repository):**
    ```bash
    git clone https://github.com/Yung-Chih-Lo/lucky_station.git
    cd lucky_station
    ```
2.  **安裝依賴套件 (Install dependencies):**
    請確保您已安裝 [Node.js](https://nodejs.org/) 和 npm 。
    ```bash
    npm install
    ```
3.  **啟動開發伺服器 (Start the development server):**
    ```bash
    npm run dev
    ```
4.  啟動成功後，在瀏覽器中打開終端機顯示的網址，通常是 `http://localhost:5173`。

## 使用方式 (Usage)

1.  應用程式載入後，您會在畫面左側 (桌機版) 或地圖下方 (行動版) 看到台灣地圖和各縣市的 Checkbox 列表。
2.  透過**點擊地圖上的縣市**或**勾選左側列表中的 Checkbox** 來選擇您希望隨機抽取的車站所在的縣市範圍。已選取的縣市在地圖上會變亮。
3.  您可以使用「**全選**」或「**全部取消**」按鈕來快速修改選取的縣市範圍。
4.  選好縣市後，點擊 Sidebar 最下方的「**抽取幸運車站！**」按鈕。
5.  系統會彈出一個 Modal 視窗，伴隨著車站名稱的跳動動畫，最後顯示隨機抽取的車站結果。
6.  結果視窗中包含車站的名稱、所屬縣市，以及前往該車站維基百科和 Google Map 的連結。

## 致謝 

react-svg-map:https://github.com/VictorCazanave/svg-maps?tab=readme-ov-file

## 如何貢獻 (Contributing)

如果您有任何建議或想為此專案貢獻，歡迎提交 [Issue](https://github.com/Yung-Chih-Lo/lucky_station/issues) 或發起 [Pull Request](https://github.com/Yung-Chih-Lo/lucky_station/pulls)。

