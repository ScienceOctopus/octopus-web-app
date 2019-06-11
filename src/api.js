import Axios from "axios";

class MultiPromise {
  constructor(result) {
    this._then = undefined;
    this._catch = undefined;
    this._finally = undefined;

    this._result = [result, result !== undefined];
  }

  then = callback => {
    if (this._then !== undefined || typeof callback !== "function") {
      return;
    }

    this._then = callback;

    if (this._result[0] !== undefined) {
      this._then(this._result[0]);

      this._result[0] = undefined;
    }

    return this;
  };

  catch = callback => {
    if (this._catch !== undefined || typeof callback !== "function") {
      return;
    }

    this._catch = callback;

    return this;
  };

  finally = callback => {
    if (this._finally !== undefined || typeof callback !== "function") {
      return;
    }

    this._finally = callback;

    if (this._result[1] === true) {
      this._result[1] = false;

      this._finally();
    }

    return this;
  };

  resolve = value => {
    if (this._then !== undefined) {
      this._then(value);
    }

    if (this._finally !== undefined) {
      this._finally();
    }
  };

  reject = reason => {
    if (this._catch !== undefined) {
      this._catch(reason);
    }

    if (this._finally !== undefined) {
      this._finally();
    }
  };
}

const root = "/api";
const port = process.env.NODE_ENV === "development" ? ":3001" : "";

const promise_dummy = { resolve: value => {} };

class Store {
  constructor() {
    this.store = new Map();
    this.keys = new Map();

    this.ws_queue = new Set();

    this._connect();
  }

  _connect = () => {
    this.ws = new WebSocket(
      `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
        window.location.hostname
      }${port}${root}`,
    );

    this.ws.onopen = event => {
      if (process.DEBUG_MODE) {
        console.log(`Established WebSocket connection with`, event);
      }

      this.ws_queue.forEach(message => this.ws.send(message));

      this.ws_queue.clear();
    };

    this.ws.onmessage = event => {
      if (process.DEBUG_MODE) {
        console.log(`Notified of update on ${event.data}`);
      }

      this._update(event.data);
    };

    this.ws.onerror = event => {
      if (process.DEBUG_MODE) {
        console.log(`Error in WebSocket connection with`, event);
      }

      this.ws.close();
    };

    this.ws.onclose = event => {
      if (process.DEBUG_MODE) {
        console.log(`Closes WebSocket connection with`, event);
      }

      this.store.forEach((cache, path, store) => {
        if (cache.subscribed === Store.SUBSCRIBED_NONE) {
          return;
        }

        this._subscribe(path);
      });

      setTimeout(this._connect, 1000);
    };
  };

  static _clone = data =>
    data === undefined ? undefined : JSON.parse(JSON.stringify(data));

  _update = path => {
    let cache = this.store.get(path);

    if (
      cache === undefined &&
      cache.callbacks.size > 0 &&
      cache.subscribed !== Store.SUBSCRIBED_NONE
    ) {
      return;
    }

    if (cache.subscribed === Store.SUBSCRIBED_HEADERS) {
      Axios.head(root + path).then(result => {
        let cache = this.store.get(path);

        if (cache === undefined) {
          return;
        }

        cache.headers = Store._clone(result.headers);

        cache.callbacks.forEach(
          ([callback, subscribed], primary, callbacks) => {
            if (subscribed === Store.SUBSCRIBED_HEADERS) {
              callback.resolve(Store._clone(cache.headers));
            }
          },
        );
      });
    } else if (cache.subscribed === Store.SUBSCRIBED_BOTH) {
      Axios.get(root + path).then(result => {
        let cache = this.store.get(path);

        if (cache === undefined) {
          return;
        }

        cache.data = Store._clone(result.data);

        if (
          typeof result.data === "object" &&
          result.data.length !== undefined &&
          result.headers["x-total-count"] === undefined
        ) {
          result.headers["x-total-count"] = result.data.length;
        }

        cache.headers = Store._clone(result.headers);

        cache.callbacks.forEach(
          ([callback, subscribed], primary, callbacks) => {
            if (subscribed === Store.SUBSCRIBED_HEADERS) {
              callback.resolve(Store._clone(cache.headers));
            } else if (subscribed === Store.SUBSCRIBED_DATA) {
              callback.resolve(Store._clone(cache.data));
            }
          },
        );
      });
    }
  };

  _subscribe = path => {
    this._send(`GO ${path}`);
  };

  _unsubscribe = path => {
    this._send(`NO ${path}`);
  };

  _send = message => {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.ws_queue.add(message);
    }
  };

  // remove all callbacks with same primary but different secondary
  // save that this primary currently uses this secondary
  open = (primary, secondary) => {
    const purge = this.keys.get(primary) !== secondary;

    this.keys.set(primary, secondary);

    this.store.forEach((cache, path, store) => {
      const changed = cache.callbacks.delete(primary);

      if (purge && changed && cache.callbacks.size <= 0) {
        this._unsubscribe(path);

        store.delete(path);
      }
    });
  };

  close = primary => {
    this.store.forEach((cache, path, store) => {
      let callback = cache.callbacks.get(primary);

      if (callback !== undefined) {
        cache.callbacks.set(primary, [promise_dummy, callback[1]]);
      }
    });
  };

  getOrInit = path => {
    let cache = this.store.get(path);

    if (cache === undefined) {
      cache = {
        subscribed: Store.SUBSCRIBED_NONE,
        data: undefined,
        headers: undefined,
        callbacks: new Map(),
      };

      this.store.set(path, cache);
    }

    return cache;
  };

  get = (path, primary) => {
    let cache = this.getOrInit(path);

    if (process.DEBUG_MODE) {
      console.log(cache.data !== undefined ? "cache" : "get", path, primary);
    }

    let promise = new MultiPromise(Store._clone(cache.data));

    if (primary !== undefined) {
      cache.callbacks.set(primary, [promise, Store.SUBSCRIBED_DATA]);
    }

    if (primary === undefined) {
      if (cache.data === undefined) {
        Axios.get(root + path).then(result => {
          promise.resolve(Store._clone(result.data));
        });
      }
    } else if (
      (cache.subscribed & Store.SUBSCRIBED_BODY) ===
      Store.SUBSCRIBED_NONE
    ) {
      cache.subscribed |= Store.SUBSCRIBED_BOTH;

      if (cache.data === undefined || cache.headers === undefined) {
        this._update(path);
      }

      this._subscribe(path);
    }

    return promise;
  };

  head = (path, primary) => {
    let cache = this.getOrInit(path);

    if (process.DEBUG_MODE) {
      console.log(cache.data !== undefined ? "cache" : "head", path);
    }

    let promise = new MultiPromise(Store._clone(cache.headers));

    if (primary !== undefined) {
      cache.callbacks.set(primary, [promise, Store.SUBSCRIBED_HEADERS]);
    }

    if (primary === undefined) {
      if (cache.headers === undefined) {
        Axios.head(root + path).then(result => {
          promise.resolve(Store._clone(result.headers));
        });
      }
    } else if (
      (cache.subscribed & Store.SUBSCRIBED_HEADERS) ===
      Store.SUBSCRIBED_NONE
    ) {
      cache.subscribed |= Store.SUBSCRIBED_HEADERS;

      if (cache.headers === undefined) {
        this._update(path);
      }

      this._subscribe(path);
    }

    return promise;
  };
}

Store.SUBSCRIBED_NONE = 0;
Store.SUBSCRIBED_HEADERS = 1;
Store.SUBSCRIBED_DATA = 2;
Store.SUBSCRIBED_BOTH = 3;

let store = (global.store = new Store());

class LinkBuilder {
  constructor(key) {
    this.path = "";
    this.key = key;
  }

  log = () => {
    console.log(this.path);
    return this;
  };

  link = () => this.path;

  /*fetch = () => {
    console.error(`fetch(${this.path})`);
    return fetch(this.path);
  };*/

  get = () => store.get(this.path, this.key);

  getQuery = q => Axios.get(root + this.path + "?q=" + q).then(x => x.data);

  head = () => store.head(this.path, this.key);

  count = () => {
    let promise = store.head(this.path, this.key);

    const promise_then = promise.then;

    promise.then = callback =>
      promise_then(head => callback(head["x-total-count"]));

    return promise;
  };

  /*getFull = () => {
    console.error(`getFull({$this.path})`);
    return Axios.get(this.path);
  };*/

  post = data => {
    return Axios.post(root + this.path, data);
  };

  _resetPath() {
    this.path = "";
  }

  _final() {
    this.isFinal = true;
  }

  _checkNotFinal() {
    if (this.isFinal) this._badUrl();
  }

  _badUrl() {
    throw Error("Attempted to build bad url: " + this.path);
  }
}

class ProblemBuilder extends LinkBuilder {
  stageSelected = false;

  constructor(key, problemId) {
    super(key);
    this.path = "/problems/" + problemId;
  }

  stages = () => {
    this._checkNotFinal();
    if (this.stageSelected) {
      this._badUrl();
    }

    this.path += "/stages";

    this._final();
    return this;
  };

  stage = stageId => {
    this._checkNotFinal();

    this.path += "/stages/" + stageId;

    this.stageSelected = true;
    this._final();
    return this;
  };

  publications = () => {
    // TODO: proper DFA this._checkNotFinal();

    this.path += "/publications";

    this._final();
    return this;
  };
}

class PublicationBuilder extends LinkBuilder {
  constructor(key, pubId) {
    super(key);
    this.path = "/publications/" + pubId;
  }

  resources = () => {
    this.path += "/resources";
    return this;
  };

  references = () => {
    this.path += "/references";
    return this;
  };

  /* referencedBy = () => {
    this.path += "/referencedBy";
    return this;
    }; */

  linksBefore = () => {
    this.path += "/linksBefore";
    return this;
  };

  linksAfter = () => {
    this.path += "/linksAfter";
    return this;
  };

  reviews = () => {
    this.path += "/reviews";
    return this;
  };

  collaborators = () => {
    this.path += "/collaborators";
    return this;
  };
}

class UserBuilder extends LinkBuilder {
  constructor(key, userId) {
    super(key);
    this.path = "/users/" + userId;
  }
}

class AuthenticationBuilder extends LinkBuilder {
  constructor(key, userId) {
    super(key);
    this.path = "/oauth-flow";
  }

  state = () => {
    this.path += "/acquire-state";
    return this;
  };

  discard = () => {
    this.path += "/discard-state";
    return this;
  };
}

class ApiBuilder extends LinkBuilder {
  constructor() {
    super(undefined);
  }

  subscribeClass = (primary, secondary) => {
    store.open(primary, secondary);

    return this.subscribe(primary);
  };

  subscribe = primary => {
    this.key = primary;

    return this;
  };

  unsubscribeClass = primary => {
    store.close(primary);
  };

  publication = pubId => {
    this._checkNotFinal();

    return new PublicationBuilder(this.key, pubId);
  };

  problem = problemId => {
    this._checkNotFinal();

    return new ProblemBuilder(this.key, problemId);
  };

  problems = () => {
    this._checkNotFinal();

    this.path += "/problems";

    this._final();
    return this;
  };

  user = userId => {
    this._checkNotFinal();

    return new UserBuilder(this.key, userId);
  };

  feedback = () => {
    this._checkNotFinal();

    this.path += "/feedback";

    this._final();
    return this;
  };

  image = () => {
    this._checkNotFinal();

    this.path += "/image";

    this._final();
    return this;
  };

  authentication = () => {
    this._checkNotFinal();

    return new AuthenticationBuilder(this.key);
  };
}

const Api = () => new ApiBuilder();

export default Api;
