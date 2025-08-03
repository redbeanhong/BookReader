const { createApp, ref, onMounted, onBeforeUnmount } = Vue;

createApp({
  setup() {
    const isBookmarkOpen = ref(false);
    let pages = ref([]);
    let currentPage = ref(0);

    const readBook = function (e) {
      currentPage.value = 0;
      pages.value = [];
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
    const updateOnePage = function (isAdd) {
      if (isAdd) {
        if (currentPage.value < pages.value.length - 1) {
          changePage(currentPage.value + 1);
        }
      } else {
        if (currentPage.value >= 1) {
          changePage(currentPage.value - 1);
        }
      }
    };
    const changePage = function (pageIndex) {
      currentPage.value = pageIndex;
      toggleBookmarkWin(false);
      window.scrollTo(0, 0);
    };

    function parseContent(text) {
      let lines = text.split("<br>");
      let pageTxt = [];
      let pageTitle = "";
      let pageIndex = 0;
      let isFirst = true;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const matchs = [
          line.match(/^(\d{2})\s+(.+)/), // 01 文章標題
          line.match(/^(\d{1}\.)(.+)?/), // 1.文章標題
          line.match(/^(\d{2}\.)(.+)?/), // 01.文章標題
          line.match(/^第\d+話\s*(.*?)$/), // 第01話
          line.match(/^第\d+章\s*(.*?)$/), // 第01章
          line.match(/^\d+章\s*(.*?)$/), // 第01章
          line.match(/^第\d+卷\s*(.*?)$/), // 第01卷
          line.match(
            /^第[零一二三四五六七八九十百千萬一二三四五六七八九]+話\s*(.*?)$/
          ), // 第一話
          line.match(
            /^第[零一二三四五六七八九十百千萬一二三四五六七八九]+章\s*(.*?)$/
          ), // 第一章
          line.match(
            /^第[零一二三四五六七八九十百千萬一二三四五六七八九]+卷\s*(.*?)$/
          ), // 第一卷
        ];
        let hasMatch = false;
        for (let index = 0; index < matchs.length; index++) {
          const match = matchs[index];
          if (match) {
            if (!isFirst) {
              const page = {
                pageIndex,
                pageTitle,
                pageTxt,
              };
              pages.value.push(page);

              pageTitle = "";
              pageTxt = [];
              pageIndex++;
            }

            pageTitle = line;
            hasMatch = true;
            isFirst = false;
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
    }
    const handleKeyDown = function handleKeyDown(event) {
      if (event.key === "ArrowRight") {
        updateOnePage(true);
      } else if (event.key === "ArrowLeft") {
        updateOnePage(false);
      }
    };

    onMounted(() => {
      window.addEventListener("keydown", handleKeyDown);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
    return {
      isBookmarkOpen,
      pages,
      currentPage,
      readBook,
      toggleBookmarkWin,
      changePage,
      updateOnePage
    };
  },
}).mount("#app");
