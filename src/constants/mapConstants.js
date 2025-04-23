// src/constants/mapConstants.js

// 地圖 SVG ID 到中文縣市名稱的映射
export const mapIdToChineseName = {
    'changhua-county': '彰化縣',
    'chiayi-city': '嘉義市',
    'chiayi-county': '嘉義縣',
    'hualien-county': '花蓮縣',
    'hsinchu-city': '新竹市',
    'hsinchu-county': '新竹縣',
    'kaohsiung-city': '高雄市',
    'keelung-city': '基隆市',
    'miaoli-county': '苗栗縣',
    'nantou-county': '南投縣',
    'new-taipei-city': '新北市',
    //'penghu-county': '澎湖縣', // 包含澎湖
    'pingtung-county': '屏東縣',
    'taichung-city': '台中市',
    'tainan-city': '台南市',
    'taipei-city': '台北市',
    'taitung-county': '台東縣',
    'taoyuan-city': '桃園市',
    'yilan-county': '宜蘭縣',
    'yunlin-county': '雲林縣',
    // 注意：金門縣 (kinmen-county) 和 連江縣 (lienchiang-county) 不在此地圖中
  };
  
  // (可選) 反向映射：中文名稱到地圖 ID，雖然目前可能用不到
  export const chineseNameToMapId = Object.fromEntries(
    Object.entries(mapIdToChineseName).map(([id, name]) => [name, id])
  );
  
  // 從映射表中獲取所有此地圖包含的中文縣市名稱列表
  export const mainIslandChineseCounties = Object.values(mapIdToChineseName).sort();