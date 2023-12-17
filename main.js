const { createApp, ref, mounted, methods } = Vue;

createApp({
  setup() {
    const isBookmarkOpen = ref(false);
    let pages = ref([]);
    let currentPage = ref(0);
    const readBook = function (e) {
      let file = e.target.files[0];

      if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
          let fileContents = e.target.result;
          fileContents = fileContents.replace(/\n/g, "<br>"); // 將換行符號替換成<br>標籤
          fileContents = fileContents.replace(
            /<br\s*\/?>\s*<br\s*\/?>/g,
            "<br>"
          ); // 移除連續的<br>標籤
          parseContent(fileContents);
        };

        reader.readAsText(file, "UTF-8");
      }
    };
    const toggleBookmarkWin = function (isOpen) {
      isBookmarkOpen.value = isOpen;
    };

    function parseContent(text) {
      let lines = text.split("<br>");
      let pageTxt = [];
      let pageTitle = "";
      let pageIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const matchs = [
          line.match(/^(\d{2})\s+(.+)/), // 01 文章標題
          line.match(/^(\d{1}\.)(.+)?/), // 1.文章標題
          line.match(/^(\d{2}\.)(.+)?/), // 01.文章標題
          line.match(/^第\d+話\s*(.*?)$/), // 第01話
          line.match(/^第\d+章\s*(.*?)$/), // 第01章
          line.match(/^第\d+卷\s*(.*?)$/), // 第01卷
          line.match(
            /^第[一二三四五六七八九十百千萬一二三四五六七八九]+話\s*(.*?)$/
          ), // 第一話
          line.match(
            /^第[一二三四五六七八九十百千萬一二三四五六七八九]+章\s*(.*?)$/
          ), // 第一章
          line.match(
            /^第[一二三四五六七八九十百千萬一二三四五六七八九]+卷\s*(.*?)$/
          ), // 第一卷
        ];
        let hasMatch = false;
        for (let index = 0; index < matchs.length; index++) {
          const match = matchs[index];
          if (match) {
            if (pageIndex != 0) {
              pages.value.push({
                pageIndex,
                pageTitle,
                pageTxt,
              });
              pageTitle = "";
              pageTxt = [];
            }
            pageIndex++;
            pageTitle = line;
            hasMatch = true;
          }
        }
        if (!hasMatch) {
          pageTxt.push(line);
        }
      }
      if (pageTxt.length > 0) {
        pages.value.push({
          pageIndex,
          pageTitle,
          pageTxt,
        });
      }
      console.log(pages.value);
    }

    return {
      isBookmarkOpen,
      pages,
      currentPage,
      readBook,
      toggleBookmarkWin,
    };
  },
  mounted() {},
}).mount("#app");
