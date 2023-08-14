import { Dispatch, SetStateAction } from "react";
import { ExternalNewsI } from "../types/news";

export function filterNewsBySearchQuery(
  externalNews: ExternalNewsI[],
  searchQuery: string,
  setExternalNews: Dispatch<SetStateAction<ExternalNewsI[]>>,
  setSearchHasOccured: Dispatch<SetStateAction<boolean>>
) {
  const filteredNews = externalNews?.filter(
    (news: ExternalNewsI) =>
      news.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.source.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  setSearchHasOccured(true);
  setExternalNews(filteredNews);
}
