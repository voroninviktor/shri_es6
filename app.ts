import Req from "./req";
import { delay } from "./utils";

const req = new Req();
let iterator = 1;

const output = document.getElementById("out");

const render = (currRespUrl, prevRespUrl) => {
  const content = `<p>Request#: ${iterator}</p><p>Previous response url: ${prevRespUrl}</p><p>Current response url ${currRespUrl}</p><hr>`;
  const div = document.createElement("div");
  div.innerHTML = content;
  output.appendChild(div);
};

const renderError = (status, currRespUrl, prevRespUrl) => {
  const content = `<p>Request#: ${iterator} <b>Error</b></p><p>Previous response url: ${prevRespUrl}</p><p>Current response url ${currRespUrl}</p><p>Current response status: ${status}</p><hr>`;
  const div = document.createElement("div");
  div.innerHTML = content;
  output.appendChild(div);
};

const onResolve = async (resp: Response | null, prevResp: Response | null) => {
  const prevRespUrl = prevResp ? prevResp.url : null;
  const currRespUrl = resp.url;
  render(currRespUrl, prevRespUrl);
  await delay(700);
  iterator += 1;
};
const onReject = async (resp: Response | null, prevResp: Response | null) => {
  const prevRespUrl = prevResp ? prevResp.url : null;
  const currRespUrl = resp.url;
  const status = resp.status;
  renderError(status, currRespUrl, prevRespUrl);
  iterator += 1;
};

req
  .get("https://swapi.co/api/films/", onResolve, onReject)
  .get("https://swapi.co/api/people/", onResolve, onReject)
  .get("https://yandex.ru/404", onResolve, onReject);
