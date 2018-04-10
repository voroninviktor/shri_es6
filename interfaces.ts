/**
 * Интерфейс колбэков, передаваеых методам get() и post()
 * 
 * @export
 * @interface RespCallback
 */
export interface RespCallback {
  (resp: Response, prevResp: Response | null): void;
}

export interface Query {
  url: string;
  data?: object | string;
  onResolve: RespCallback;
  onReject: RespCallback;
  method: "get" | "post";
}
