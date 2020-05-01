export const quickGet = (url): Promise<string> => {
  return new Promise((resolve) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        resolve(xmlHttp.responseText);
    };
    xmlHttp.open('GET', url, true); // true for asynchronous
    xmlHttp.send(null);
  });
};
