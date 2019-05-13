import { SequelizeError } from "../src/SequelizeError";
import { expect } from "chai";
import Support from "./support";

describe("Error", () => {
  it("Create object with validation errors", done => {
    let support = new Support("mysql");
    support.model
      .create({
        id: null,
        name: null,
        email: "abcd"
      })
      .then(() => {
        done(new Error("Creation must generate an error"));
      })
      .catch(error => {
        let sqError = new SequelizeError(error);
        if (sqError.isValidationError()) {
          let result = sqError.getResults("There are some errors");
          let _result = {
            success: false,
            message: "There are some errors",
            subresults: [{ success: false, message: "table.name cannot be null" }, { success: false, message: "Email is not valid" }]
          };
          expect(result).to.be.deep.equal(_result);
          done();
        } else {
          done(new Error("Validation error not recognised"));
        }
      });
  });
});
