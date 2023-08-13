import { Timestamp } from "firebase/firestore";
import { NewsFilter } from "../types/news";

export function applyNewsFilter({
  selectedOption,
  selectedInterest,
  dataToUse,
  setDataToUse,
  toggleBottomSheet,
  toggleOverlay,
}: NewsFilter) {
  let filteredNews;

  switch (selectedOption) {
    case "VerfiedOnly":
      filteredNews = dataToUse.filter((news) => news.isVerified === true);
      break;
    case "VerfiedAndUnverified":
      filteredNews = dataToUse;
      break;
    case "UnVerfiedOnly":
      filteredNews = dataToUse.filter((news) => news.isVerified === false);
      break;
    default:
      filteredNews = dataToUse;
  }

  if (selectedInterest !== "All") {
    filteredNews = filteredNews.filter((news) =>
      news.category.toLowerCase().includes(selectedInterest.toLowerCase())
    );
  }

  setDataToUse(filteredNews);
  toggleBottomSheet();
  toggleOverlay();
}
