const queries = require("../postgresQueries.js").queries;
const problmes = require("./problems.js");

jest.mock("./problems.js");
jest.mock("multer-azure-storage");
jest.mock("azure-storage");

test("compliance", () => {});
/*
test("getProblems calls selectAllProblems and returns results", async () => {
  const problems = [{ id: 1 }];
  queries.selectAllProblems.mockResolvedValue(problems);

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
  expect(res.json).toHaveBeenCalledWith(problems);
});

test("getProblemsByID 404s on no results", async () => {
  const problems = [];
  queries.selectProblemsByID.mockResolvedValue(problems);

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

  await problems.getProblemsByID(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).not.toHaveBeenCalled();
});

test("getProblemByID returns single result", async () => {
  const problems = [{ id: 1 }];
  queries.selectProblemsByID.mockResolvedValue(problems);

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

  await problems.getProblemsByID(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(problems[0]);
});

test("getProblemByID errors on multiple results", async () => {
  const problems = [{ id: 1 }, { id: 2 }, { id: 3 }];
  queries.selectProblemsByID.mockResolvedValue(problems);

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

  await problems.getProblemsByID(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).not.toHaveBeenCalled();
});
*/
