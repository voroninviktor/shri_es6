import EventEmitter from "./eventEmitter";
import { Query, RespCallback } from "./interfaces";
import fetch_ from "node-fetch";

let fetch;
try {
  if (window && typeof window.fetch === "function") {
    fetch = window.fetch;
  }
} catch (e) {
  fetch = fetch_;
}

class Req extends EventEmitter {
  queryChain: Query[];
  callbacks: any;
  queryProcessingInProgress: boolean;
  prevResponse: Response | null;

  constructor(params = {}) {
    super();
    this.queryChain = [];
    this.callbacks = new Map();
    this.on("query", async () => {
      this.processQueryChain();
    });
    this.queryProcessingInProgress = false;
    this.prevResponse = null;
  }

  get(url: string, onResolve: RespCallback, onReject: RespCallback): Req {
    this.queryChain.push({ url, onResolve, onReject, method: "get" });
    if (!this.queryProcessingInProgress) {
      this.emit("query");
      this.queryProcessingInProgress = true;
    }
    return this;
  }

  post(
    url: string,
    data: object | string = {},
    onResolve: RespCallback,
    onReject: RespCallback,
  ): Req {
    this.queryChain.push({ url, data, onResolve, onReject, method: "post" });
    if (!this.queryProcessingInProgress) {
      this.emit("query");
    }
    return this;
  }

  processQueryChain = async () => {
    while (this.queryChain.length > 0) {
      const { url, data, method, onResolve, onReject } = this.queryChain.shift();
      try {
        const currResponse = await fetch(url, {
          method,
          body: typeof data === "string" ? data : JSON.stringify(data),
          mode: "cors",
        });
        let tmpPrevResp: Response | null = currResponse;
        if (currResponse.ok) {
          await onResolve(currResponse, this.prevResponse);
        } else {
          await onReject(currResponse, this.prevResponse);
        }
        this.prevResponse = tmpPrevResp;
      } catch (e) {
        console.log(e);
      }
    }
    this.queryProcessingInProgress = false;
  };
}

export default Req;
