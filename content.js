chrome.runtime.onMessage.addListener((request) => {
  request === "load" && loadAllResults();
  request === "scrape" && scrape();
});

const Sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const scrape = async () => {
  const hitColl = document.getElementsByClassName("mod-Treffer");
  const hits = Array.prototype.slice.call(hitColl);

  var all = document.getElementsByClassName("mod-Treffer");
  for (var i = 0; i < all.length; i++) {
    all[i].style.contentVisibility = "visible";
  }

  const rows = [
    ["Email", "Homepage", "Name", "Addresse", "Stadt", "Entfernung", "Telefon"],
  ];

  hits.map((hit) => {
    const name = hit.querySelector('[data-wipe-name="Titel"]')?.innerText;
    const address = hit.querySelector('[data-wipe-name="Adresse"]')?.innerText;
    const phone = hit.querySelector(
      '[data-wipe-name="Kontaktdaten"]'
    )?.innerText;
    const email = (() => {
      try {
        const temp = hit
          .querySelector(".contains-icon-email")
          ?.href?.match(
            /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
          )[0];
        return temp ? temp : "no email provided";
      } catch {
        return "no email provided";
      }
    })();
    const homepage = (() => {
      try {
        const temp = hit.querySelector(".contains-icon-homepage")?.href;
        return temp ? temp : "no homepage provided";
      } catch {
        return "no homepage provided";
      }
    })();
    rows.push([
      `${email}`,
      `${homepage}`,
      `${name} `,
      `${address} `,
      `${phone} `,
    ]);
  });

  let csvContent =
    "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "yellow-scraper-results.csv");
  document.body.appendChild(link); // Required for FF

  link.click();
};

const loadAllResults = async () => {
  window.scrollTo({
    top: 0,
  });

  await Sleep(500);

  var all = document.getElementsByClassName("mod-Treffer");
  for (var i = 0; i < all.length; i++) {
    all[i].style.contentVisibility = "visible";
  }
  const loadMoreButton = document.getElementById("mod-LoadMore--button");
  let currentResults = parseInt(
    document.getElementById("loadMoreGezeigteAnzahl").innerText
  );
  let totalResults = parseInt(
    document.getElementById("loadMoreGesamtzahl").innerText
  );
  const loadNext = () => {
    loadMoreButton.click();
  };
  const toLoad = totalResults - currentResults;
  let remainig = totalResults - currentResults;

  while (currentResults < totalResults) {
    var all = document.getElementsByClassName("mod-Treffer");
    for (var i = 0; i < all.length; i++) {
      all[i].style.contentVisibility = "visible";
    }
    loadNext();
    let sleepVar = Math.random() * 500 + 800;
    await Sleep(sleepVar);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    currentResults = parseInt(
      document.getElementById("loadMoreGezeigteAnzahl").innerText
    );
    remainig = totalResults - currentResults;
    chrome.runtime.sendMessage([
      "status",
      `${Math.floor((100 * (toLoad - remainig)) / toLoad)} %`,
    ]);
  }
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
  var all = document.getElementsByClassName("mod-Treffer");
  for (var i = 0; i < all.length; i++) {
    all[i].style.contentVisibility = "visible";
  }

  chrome.runtime.sendMessage("complete");
};
