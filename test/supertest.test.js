import chai from "chai";
import supertest from "supertest";
import config from "../src/config/config.js";

const port = config.port;
const expect = chai.expect;
const requester = supertest(`http://localhost:${port}`);

describe("Testing Ecommerce", () => {
  describe("Test de productos", () => {
    it("El endpoint GET api/products debe devolver un objeto con la configuración de paginación y los productos en un array de nombre 'payload' ", async function () {
      const { statusCode, ok, _body } = await requester.get("/api/products");

      expect(Array.isArray(_body.payload)).to.be.ok;
    });
  });

  describe("Test avanzado de login", () => {
    let cookie;
    it("Debe registrar correctamente a un usuario", async function () {
      const userMock = {
        first_name: "Elba",
        last_name: "Gallo",
        email: "gallo_elba@gmail.com",
        age: 54,
        password: "elba123",
      };

      const { _body } = await requester
        .post("/api/sessions/register")
        .send(userMock);
      expect(_body).to.be.ok;
    });

    it("Debe loguear correctamente al usuario y devolver una cookie", async function () {
      const userMock = {
        email: "gallo_elba@gmail.com",
        password: "elba123",
      };
      const result = await requester.post("/api/sessions/login").send(userMock);
      const cookieResult = result.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.eql("tokenCookie");
      expect(cookie.value).to.be.ok;
    });

    it("Debe enviar la cookie que contiene el usuario y desestructurarlo correctamente", async function () {
      const { _body } = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(_body.user.first_name).to.be.eql("Elba");
    });
  });
});
