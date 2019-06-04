import Axios from "axios";

const root = "/api";

class LinkBuilder {
  path = "";

  log = () => {
    console.log(this.path);
    return this;
  };

  link = () => this.path;

  fetch = () => fetch(this.path);

  get = () => Axios.get(this.path).then(x => x.data);

  getFull = () => Axios.get(this.path);

  post = data => Axios.post(this.path, data);

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
    return this;
  };

  publications = () => {
    this._checkNotFinal();
    if (!this.stageSelected) {
      throw Error("Need to select stage to select publications for problem");
    }

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
}

const Api = () => new ApiBuilder();

export default Api;
