import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { LOGINURL } from "../../constants/Api";
import Form from "react-bootstrap/Form";
import AuthContext from "../../context/AuthContext";


import Toasts from "../../hooks/useToasts"
const url = LOGINURL;

const schema = yup.object().shape({
  identifier: yup.string().required("Please enter your username"),
  password: yup.string().required("Please enter your password"),
});

export default function LoginForm({ handleClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastAction, setToastAction] = useState("");

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const [, setAuth] = useContext(AuthContext);
  
  // Send login rquest and show toast
    async function onSubmit(data) {
    setSubmitting(true);
    setLoginError(null);

    console.log(data);

    try {
      await axios.post(url, data).then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          
          setAuth(response.data);
           setShowToast(true);
           setToastType("success");
           setToastAction("login");
           setTimeout(() => setShowToast(false), 1500);
           setTimeout(() => handleClose(), 1500);
        }
      });
    } catch (error) {
      console.log("error", error);
       setShowToast(true);
       setToastType("fail");
       setToastAction("login");
       setTimeout(() => setShowToast(false), 1000);
      setLoginError(error.toString());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={submitting}>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="identifier"
              defaultValue="admin@admin.com"
              ref={register}
            />
            {errors.identifier && (
              <span className="text-danger">{errors.identifier.message}</span>
            )}
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              placeholder="Pass1234"
              defaultValue="Pass1234"
              ref={register}
              type="password"
            />
            {errors.password && (
              <span className="text-danger">{errors.password.message}</span>
            )}
            {loginError && (
              <h4 className="text-danger text-center mt-3 text-bold">Login failed</h4>
            )}
          </Form.Group>
          <button className="btn primary-button mt-3">
            {submitting ? "Loggin in..." : "Login"}
          </button>
          <button
            variant="secondary"
            className="btn btn-secondary ml-3 mt-3"
            onClick={handleClose}
          >
            Close
          </button>
        </fieldset>
      </Form>
      <Toasts type={toastType} action={toastAction} showToast={showToast} />
    </>
  );
}
