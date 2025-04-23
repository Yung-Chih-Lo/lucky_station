// src/utils/stationUtils.js
import stationsData from '../data/stations.json'; // 引入你的 JSON 資料

/**
 * 從 JSON 資料中獲取所有縣市的列表
 * @returns {string[]} - 排序後的縣市名稱陣列
 */
export function getAllCounties() {
  // 直接獲取 JSON 物件的所有 key (即縣市名稱)
  const counties = Object.keys(stationsData);
  // 可以選擇是否過濾掉沒有車站的縣市，這裡我們先不過濾，保留所有縣市選項
  // const countiesWithStations = counties.filter(county => stationsData[county].length > 0);
  return counties.sort(); // 返回排序後的縣市列表
}

/**
 * 從指定縣市列表中隨機抽取一個車站
 * @param {string[]} selectedCounties - 被選中的縣市名稱陣列
 * @returns {object | null} - 隨機抽中的車站物件 { name: string, county: string } 或 null
 */
export function getRandomStation(selectedCounties) {
  if (!selectedCounties || selectedCounties.length === 0) {
    return null;
  }

  // 1. 收集所有選中縣市的可用車站，並轉換成物件格式 { name, county }
  const availableStations = [];
  selectedCounties.forEach(county => {
    // 確保該縣市存在於資料中，並且有車站列表
    if (stationsData[county] && stationsData[county].length > 0) {
      const stationsInCounty = stationsData[county]; // 獲取該縣市的車站名稱陣列
      // 將車站名稱轉換為物件，並加入到可用列表中
      stationsInCounty.forEach(stationName => {
        availableStations.push({ name: stationName, county: county });
      });
    }
  });

  // 2. 如果沒有任何可用車站 (可能選中的縣市都沒有車站)
  if (availableStations.length === 0) {
    return null;
  }

  // 3. 從可用車站列表中隨機選取一個
  const randomIndex = Math.floor(Math.random() * availableStations.length);
  return availableStations[randomIndex];
}