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

/**
 * Основной класс библиотеки. Инстансы имеют методы get() и post()
 * которые можно чейнить.
 *
 * @class Req
 * @extends {EventEmitter}
 */
class Req extends EventEmitter {
  queryChain: Query[];
  callbacks: any;
  queryProcessingInProgress: boolean;
  prevResponse: Response | null;

  constructor(params = {}) {
    super();
    this.queryChain = [];
    this.callbacks = new Map();
    // Подписываемся на события `query`.
    this.on("query", async () => {
      this.processQueryChain();
    });
    this.queryProcessingInProgress = false;
    this.prevResponse = null;
  }

  /**
   * Добавляет в цепочку запросов объект, реализующий интерфейс Query
   *
   * @param {string} url URL запроса
   * @param {RespCallback} onResolve колбэк для успешных запросов. В него приходит объект типа
   * Response, вторым аргументом приходит Response предыдущего запроса, либо null
   * @param {RespCallback} onReject Аналогично onResolve, но возникает когда статус Response не ok
   * @returns {Req} возвращает инстанс Req
   * @memberof Req
   */
  get(url: string, onResolve: RespCallback, onReject: RespCallback): Req {
    this.queryChain.push({ url, onResolve, onReject, method: "get" });
    if (!this.queryProcessingInProgress) {
      this.emit("query");
      this.queryProcessingInProgress = true;
    }
    return this;
  }

  /**
   * Аналогично get(). Дополнительно принимает объект data {}, либо строку c данными
   * для post запроса
   *
   * @param {string} url
   * @param {(object | string)} [data={}]
   * @param {RespCallback} onResolve
   * @param {RespCallback} onReject
   * @returns {Req}
   * @memberof Req
   */
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

  /**
   * Предназначен для последовательного вызова цепочки запросов. Возникает при событии
   * 'query', которое триггерится методами post() и get()
   *
   * @memberof Req
   */
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
