const queries = require("../postgresQueries.js").queries;
const problems = require("./problems.js");

jest.mock("../postgresQueries.js");
jest.mock("multer-azure-storage");
jest.mock("azure-storage");

test("getProblems calls selectAllProblems and returns results", async () => {
  const testProblems = [{ id: 1 }];
  queries.selectAllProblems.mockResolvedValue(testProblems);

  const mockRequest = () => {
    return {};
  };

  const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.getProblems(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(testProblems);
});

test("getProblemsByID 404s on no results", async () => {
  const testProblems = [];
  queries.selectProblemsByID.mockResolvedValue(testProblems);

  const mockRequest = () => {
    return {
      params: { id: 1 },
    };
  };

  const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.getProblemByID(req, res);

  expect(queries.selectProblemsByID).toHaveBeenCalledWith(req.params.id);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).not.toHaveBeenCalled();
});

test("getProblemByID returns single result", async () => {
  const testProblems = [{ id: 1 }];
  queries.selectProblemsByID.mockResolvedValue(testProblems);

  const mockRequest = () => {
    return {
      params: { id: 1 },
    };
  };

  const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.getProblemByID(req, res);

  expect(queries.selectProblemsByID).toHaveBeenCalledWith(req.params.id);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(testProblems[0]);
});

test("getProblemByID errors on multiple results", async () => {
  const testProblems = [{ id: 1 }, { id: 2 }, { id: 3 }];
  queries.selectProblemsByID.mockResolvedValue(testProblems);

  const mockRequest = () => {
    return {
      params: { id: 1 },
    };
  };

  const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.getProblemByID(req, res);

  expect(queries.selectProblemsByID).toHaveBeenCalledWith(req.params.id);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).not.toHaveBeenCalled();
});

test("getStagesByProblem returns results", async () => {
  const testStages = [{ id: 1 }, { id: 2 }];
  queries.selectStages.mockResolvedValue(testStages);

  const mockRequest = () => {
    return {
      params: { id: 1 },
    };
  };

  const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.getStagesByProblem(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(testStages);
});

test("getPublicationsByProblemAndStage returns results", async () => {
  const testPublications = [{ id: 1 }, { id: 2 }];
  queries.selectOriginalPublicationsByProblemAndStage.mockResolvedValue(
    testPublications
  );
  queries.selectStagesByID.mockResolvedValue([{ id: 1 }]);
  queries.selectProblemsByID.mockResolvedValue([{ id: 1 }]);

  const mockRequest = () => {
    return {
      params: { id: 1, stage: 1 },
    };
  };

  const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.getPublicationsByProblemAndStage(req, res);

  expect(
    queries.selectOriginalPublicationsByProblemAndStage
  ).toHaveBeenCalledWith(req.params.id, req.params.stage);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(testPublications);
});

/*test("postPublicationToProblemAndStage does something", async () => {
  const testPublications = [{ id: 1 }];
  queries.insertPublication.mockResolvedValue(testPublications);

  const mockRequest = () => {
    return {
      params: { id: 1, stage: 1 },
      body: { title: " ", summary: " ", description: " ", review: false },
    };
  };

  const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.postPublicationToProblemAndStage(req, res);

  expect(queries.insertPublication).toHaveBeenCalledWith(
    req.params.id,
    req.params.stage,
    req.body.title,
    req.body.summary,
    req.body.description,
    req.body.review
  );
  //expect(res.status).toHaveBeenCalledWith(200);
  //expect(res.json).toHaveBeenCalledWith(testPublications);
});*/
