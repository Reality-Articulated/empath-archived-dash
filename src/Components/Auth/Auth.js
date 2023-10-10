import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import blurImage from "../../Images/blur.png";
import authIcon from "../../Images/authIcon.png";
import axios from "axios";
import "./Auth.css";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      console.error("Username or password is missing.");
      return;
    }

    // let hashedPassword;
    // try {
    //   hashedPassword = await hashPassword(password);
    // } catch (err) {
    //   console.error("Error hashing the password:", err);
    //   return;
    // }

    const data = {
      email: email,
      password: password,
    };

    axios
        .post(
            `${process.env.REACT_APP_BACK_END_URL}/api/users/dashboardAuth`,
            data,
            { withCredentials: true }
        )
        .then((res) => {
            console.log(res.data);
            navigate("/Dashboard");
        })
        .catch((err) => {
            console.error("Error during authentication:", err);
        });
  };

  // async function hashPassword(password) {
  //   // Convert password to ArrayBuffer
  //   const encoder = new TextEncoder();
  //   const data = encoder.encode(password);

  //   // Hash the password
  //   const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  //   // Convert the hash to a hex string
  //   const hashArray = Array.from(new Uint8Array(hashBuffer));
  //   const hashHex = hashArray
  //     .map((b) => b.toString(16).padStart(2, "0"))
  //     .join("");

  //   return hashHex;
  // }

  return (
    <div
      className="authContainer"
      style={{ backgroundImage: `url(${blurImage})` }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-12">
            <div className="authContent">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h1>Welcome</h1>
                  <p>We are glad to see you back with us</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="form-control-icon"
                      />
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="form-control-icon"
                      />
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <button className="btn next-button">NEXT</button>
                    </div>
                    <div className="login-divider">
                      <span>
                        <b>Login</b> with Others
                      </span>
                    </div>

                    <button className="btn btn-light">
                      <FontAwesomeIcon icon={faGoogle} /> Login with{" "}
                      <b>Google</b>
                    </button>
                    <button className="btn btn-light">
                      <FontAwesomeIcon icon={faFacebookF} /> Login with{" "}
                      <b>Facebook</b>
                    </button>
                  </form>
                </div>

                <div className="col-md-6">
                  <div className="imageContainer">
                    <img
                      src={authIcon}
                      alt="Illustration"
                      className="authImage"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
