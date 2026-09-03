(() => {
"use strict";

const STORAGE_KEY = "alon_articles";

function getArticles() {
try {
const data = JSON.parse(
localStorage.getItem(STORAGE_KEY) || "[]"
);

  return Array.isArray(data) ? data : [];
} catch (error) {
  console.error("ALON Articles: Unable to read articles.", error);
  return [];
}

}

function saveArticle(article) {
const articles = getArticles();

if (!article || typeof article !== "object") {
  return null;
}

articles.push(article);

localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(articles)
);

return article;

}

window.ALONArticles = {
list: getArticles,
save: saveArticle
};
})();