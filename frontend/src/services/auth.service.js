import axios from "axios";
import variables from '../env';
var URL=variables.getURL();
const API_URL = URL+"/api/auth/";
class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "signin", {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password, project, roles) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
      project,
      roles
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

}
export default new AuthService();