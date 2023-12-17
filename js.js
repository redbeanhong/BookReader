window.onload = function () {
  initLinksWindow();
  initNavListener();
  initBookReader();
};

function initLinksWindow() {
  // 開啟window
  const windonButton = document.querySelector("#open-links-window");
  windonButton.addEventListener("click", function (e) {
    toggleWindow(false);
  });
}

function toggleWindow(isOpen) {
  const windowLink = document.querySelector("#links-window");
  if (isOpen) {
    windowLink.classList.remove("d-block");
  } else {
    windowLink.classList.add("d-block");
  }
}

function initNavListener() {
  // 開啟nav
  const bodyElement = document.querySelector("body");
  bodyElement.addEventListener("dblclick", function (e) {
    toggleNav();
  });
}

function toggleNav() {
  const navElement = document.querySelector("#nav");
  navElement.classList.toggle("active");
}

function initBookReader() {
  document.getElementById("fileInput").addEventListener("change", function (e) {
    let file = e.target.files[0];

    if (file) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let fileContents = e.target.result;
        fileContents = fileContents.replace(/\n/g, "<br>"); // 將換行符號替換成<br>標籤
        fileContents = fileContents.replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br>"); // 移除連續的<br>標籤
        const parseContent = createLinks(fileContents);
        document.getElementById("fileContents").innerHTML =
          parseContent.resultTxt;
        document.getElementById("linkContent").innerHTML =
          parseContent.resultLink;
      };

      reader.readAsText(file,'UTF-8');
      toggleNav();
    }
  });
  function createLinks(text) {
    let lines = text.split("<br>");
    let resultTxt = "";
    let resultLink = "";
    let linkIndex = 0;
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
          linkIndex++;
          resultLink += `<li><a href="#title_${linkIndex}" onclick="toggleWindow(true)">${line} </a></li>`;
          resultTxt += `<div id="title_${linkIndex}" class="position-tag"></div>`;
          resultTxt += `<h2>${line}</h2>`;
          hasMatch = true;
        }
      }
      if (!hasMatch) {
        resultTxt += "<p>" + line + "</p>";
      }
    }
    return {
      resultLink,
      resultTxt,
    };
  }
}
