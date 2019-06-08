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

  reject = value => {
    if (this._catch !== undefined) {
      this._catch(value);
    }

    if (this._finally !== undefined) {
      this._finally();
    }
  };
}

class Store {
  store = {};

  static clone = data => JSON.parse(JSON.stringify(data));

  static pathBreaker = path => path.split("/");

  static getPath = (store, [next, ...rest]) => {
    if (store === undefined) {
      return undefined;
    }

    if (next === undefined) {
      return store;
    }

    return Store.getPath(store[next], rest);
  };

  static ensurePath = (store, [next, ...rest]) => {
    if (store === undefined) {
      store = { _data: undefined };
    }

    if (next === undefined) {
      return store;
    }

    store[next] = Store.ensurePath(store[next], rest);

    return store;
  };

  get = path => {
    const broken = Store.pathBreaker(path);

    Store.ensurePath(this.store, broken);
    let container = Store.getPath(this.store, broken);

    let promise;

    if (container._data === undefined) {
      promise = new MultiPromise();
      console.log(`get(${path})`);
      Axios.get(path).then(result => {
        container._data = result.data;

        if (
          typeof result.data === "array" &&
          result.headers["x-total-count"] === undefined
        ) {
          result.headers["x-total-count"] = result.data.length;
        }

        container._head = result.headers;

        promise.resolve(Store.clone(container._data));
      });
    } else {
      promise = new MultiPromise(Store.clone(container._data));
      console.log(`cache(${path})`);
    }

    return promise;
  };

  head = path => {
    const broken = Store.pathBreaker(path);

    Store.ensurePath(this.store, broken);
    let container = Store.getPath(this.store, broken);

    let promise;

    if (container._head === undefined) {
      promise = new MultiPromise();
      console.log(`head(${path})`);
      Axios.head(path).then(result => {
        container._head = result.headers;

        promise.resolve(Store.clone(container._head));
      });
    } else {
      promise = new MultiPromise(Store.clone(container._head));
      console.log(`cache(${path})`);
    }

    return promise;
  };
}

let store = new Store();

const root = "/api";

class LinkBuilder {
  path = "";

  log = () => {
    console.log(this.path);
    return this;
  };

  link = () => this.path;

  /*fetch = () => {
    console.error(`fetch(${this.path})`);
    return fetch(this.path);
  };*/

  get = () => store.get(this.path);

  head = () =>
    store.head(
      this.path,
    ); /*{
    console.error(`head({$this.path})`);
    return Axios.head(this.path).then(x => x.headers);
  }*/

  count = () => {
    let promise = store.head(this.path);

    const promise_then = promise.then;

    promise.then = callback =>
      promise_then(head => callback(head["x-total-count"]));

    return promise;
  }; /*{
    console.error(`count({$this.path})`);
    return this.head()
      .then(x => x["x-total-count"])
      .catch(console.err);
  }*/

  /*getFull = () => {
    console.error(`getFull({$this.path})`);
    return Axios.get(this.path);
  };*/

  post = data => {
    console.error(`post({$this.path})`);
    return Axios.post(this.path, data);
  };

  _resetPath() {
    this.path = root;
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

  constructor(root, problemId) {
    super();
    this.path = root + "/problems/" + problemId;
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
  constructor(root, pubId) {
    super();
    this.path = root + "/publications/" + pubId;
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
  constructor(root, userId) {
    super();
    this.path = root + "/users/" + userId;
  }
}

class AuthenticationBuilder extends LinkBuilder {
  constructor(root, userId) {
    super();
    this.path = root + "/oauth-flow";
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
  path = root;

  publication = pubId => {
    this._checkNotFinal();

    return new PublicationBuilder(root, pubId);
  };

  problem = problemId => {
    this._checkNotFinal();

    return new ProblemBuilder(root, problemId);
  };

  problems = () => {
    this._checkNotFinal();

    this.path += "/problems";

    this._final();
    return this;
  };

  user = userId => {
    this._checkNotFinal();

    return new UserBuilder(root, userId);
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

    return new AuthenticationBuilder(root);
  };
}

const Api = () => new ApiBuilder();

export default Api;
