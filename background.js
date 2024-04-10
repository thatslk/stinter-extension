chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);
    if (
      details.method === "GET" &&
      url.pathname.startsWith("/api/user-activities/")
    ) {
      const activityJson = loadLocalJsonFile("jsons/activity.json");
      activityJson["user-activities"][0]["id"] = getUserId(url.pathname);

      return {
        redirectUrl:
          "data:application/json;charset=UTF-8," +
          encodeURIComponent(JSON.stringify(activityJson)),
      };
    } else if (
      details.method === "GET" &&
      url.pathname.startsWith("/api/user-activity-summaries/")
    ) {
      const activityJson = loadLocalJsonFile("jsons/activity.json");
      const summariesJson = loadLocalJsonFile("jsons/summaries.json");

      summariesJson["user-activity-summaries"][0]["id"] = getUserId(
        url.pathname
      );

      // fill pins array of summariesJson with last 7 values of activityJson's pins array
      summariesJson["user-activity-summaries"][0]["pins"] = activityJson[
        "user-activities"
      ][0]["pins"].slice(0, 7);

      return {
        redirectUrl:
          "data:application/json;charset=UTF-8," +
          encodeURIComponent(JSON.stringify(summariesJson)),
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
  return JSON.parse(xhr.responseText);
};

const getUserId = (pathname) => {
  const parts = pathname.split("/");
  return parseInt(parts[parts.length - 1]);
};
