var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.callbacks = new Map();
    }
    EventEmitter.prototype.emit = function (eventName) {
        var handlersSet = this.callbacks.get(eventName);
        if (handlersSet) {
            handlersSet.forEach(function (h) {
                h();
            });
        }
    };
    EventEmitter.prototype.on = function (eventName, cb) {
        var handlersSet = this.callbacks.get(eventName);
        if (!handlersSet) {
            this.callbacks.set(eventName, new Set([cb]));
        }
        else {
            handlersSet.add(cb);
        }
    };
    EventEmitter.prototype.off = function (eventName, cb) {
        var handlersSet = this.callbacks.get(eventName);
        if (handlersSet) {
            handlersSet["delete"](cb);
            if (handlersSet.size === 0)
                this.callbacks["delete"](eventName);
        }
    };
    return EventEmitter;
}());
var fetch = require("node-fetch");
var Req = /** @class */ (function (_super) {
    __extends(Req, _super);
    function Req(params) {
        if (params === void 0) { params = {}; }
        var _this = _super.call(this) || this;
        _this.processQueryChain = function () { return __awaiter(_this, void 0, void 0, function () {
            var tmpPrevResp, _a, url, data, method, onResolve_1, onReject_1, currResponse, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.queryChain.length > 0)) return [3 /*break*/, 5];
                        tmpPrevResp = this.prevResponse;
                        _a = this.queryChain.shift(), url = _a.url, data = _a.data, method = _a.method, onResolve_1 = _a.onResolve, onReject_1 = _a.onReject;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch(url, {
                                method: method,
                                body: typeof data === "string" ? data : JSON.stringify(data)
                            })];
                    case 2:
                        currResponse = _b.sent();
                        this.prevResponse = currResponse;
                        if (currResponse.ok) {
                            onResolve_1(currResponse, tmpPrevResp);
                        }
                        else {
                            onReject_1(currResponse, tmpPrevResp);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        console.log("Network Error");
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 0];
                    case 5:
                        this.queryProcessingInProgress = false;
                        return [2 /*return*/];
                }
            });
        }); };
        _this.queryChain = [];
        _this.callbacks = new Map();
        _this.on("query", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.processQueryChain();
                return [2 /*return*/];
            });
        }); });
        _this.queryProcessingInProgress = false;
        _this.prevResponse = null;
        return _this;
    }
    Req.prototype.get = function (url, onResolve, onReject) {
        this.queryChain.push({ url: url, onResolve: onResolve, onReject: onReject, method: "get" });
        if (!this.queryProcessingInProgress) {
            this.emit("query");
        }
        return this;
    };
    Req.prototype.post = function (url, data, onResolve, onReject) {
        this.queryChain.push({ url: url, data: data, onResolve: onResolve, onReject: onReject, method: "post" });
        if (!this.queryProcessingInProgress) {
            this.emit("query");
        }
        return this;
    };
    return Req;
}(EventEmitter));
var r = new Req();
var onResolve = function (resp, prevResp) {
    console.log(prevResp);
    console.log(resp);
};
var onReject = function (resp, prevResp) {
    console.log(prevResp);
    console.log("Boom");
};
r
    .get("http://google.com/3453", onResolve, onReject)
    .get("http://yandex.ru/", onResolve, onReject)
    .get("http://google.com/", onResolve, onReject);
