chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);
    if (
      details.method === "GET" &&
      url.pathname.startsWith("/api/user-activities")
    ) {
      const activityJson = loadLocalJsonFile("jsons/activity.json");

      return {
        redirectUrl:
          "data:application/json;charset=UTF-8," +
          encodeURIComponent(activityJson),
      };
    }
  },
  { urls: ["*://stepik.org/*"] },
  ["blocking"]
);

const loadLocalJsonFile = (filename) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", chrome.runtime.getURL(filename), false);
  xhr.send();
  return xhr.responseText;
};
