const queries = require("../postgresQueries.js").queries;
const getProblems = require("./problems.js").getProblems;

jest.mock("../postgresQueries.js");

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

  await getProblems(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(problems);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))
});
