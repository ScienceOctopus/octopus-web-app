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
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.getProblemByID(req, res);

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
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.getProblemByID(req, res);

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
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  req = mockRequest();
  res = mockResponse();

  await problems.getProblemByID(req, res);

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
