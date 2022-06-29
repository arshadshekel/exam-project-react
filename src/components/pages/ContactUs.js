import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { CONTACTURL } from "../../constants/Api";
import Toasts from "../../hooks/useToasts";

const url = CONTACTURL;

const schema = yup.object().shape({
  Firstname: yup
    .string()
    .required("Please enter your first name")
    .min(2, "The name must be at least 2 characters"),
  Lastname: yup
    .string()
    .required("Please enter your last name")
    .min(2, "The name must be at least 2 characters"),
  email: yup
    .string()
    .required("Please enter an email address")
    .email("Please enter a valid email address"),
  Message: yup
    .string()
    .required("Please enter your message")
    .min(10, "The message must be at least 10 characters"),
});

function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  //toast variables
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastAction, setToastAction] = useState("");
  const [error, setError] = useState(null);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    document.title = "Holidaze - Contact us";
  }, []);

  // Send a message to admin and show toasts
  async function onSubmit(data) {
    try {
      await axios.post(url, data).then((response) => {
        if (response.status === 200) {
          setShowToast(true);
          setToastType("success");
          setToastAction("postMessage");
          setTimeout(() => setShowToast(false), 3000);
          setSubmitted(true);
        }
      });
    } catch (error) {
      setShowToast(true);
      setToastType("fail");
      setTimeout(() => setShowToast(false), 2000);
      setToastAction("postMessage");
      setError(error.toString());
    }
  }

  return (
    <div className="container my-5 contact-form">
      <h1 className="text-center">Contact us</h1>

      {submitted ? (
        <h2 className="text-center text-bold mt-5 color-primary">
          Thanks for contacting us
        </h2>
      ) : (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>First name</Form.Label>
            <Form.Control
              placeholder="Firstname"
              name="Firstname"
              ref={register}
            />
            {errors.Firstname && (
              <span className="text-danger">{errors.Firstname.message}</span>
            )}
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              placeholder="Lastname"
              name="Lastname"
              ref={register}
            />
            {errors.Lastname && (
              <span className="text-danger">{errors.Lastname.message}</span>
            )}
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlInput3">
            <Form.Label>Email</Form.Label>
            <Form.Control placeholder="Email" name="email" ref={register} />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={8 }
              name="Message"
              placeholder="Please enter a message"
              ref={register}
            />
            {errors.Message && (
              <span className="text-danger">{errors.Message.message}</span>
            )}
          </Form.Group>
          {error ? (
            <h4 className="text-danger">Failed to send message</h4>
          ) : null}
          <Button className="primary-button mt-3" type="submit">
            Submit
          </Button>
        </Form>
      )}
      <Toasts type={toastType} action={toastAction} showToast={showToast} />
    </div>
  );
}

export default ContactUs;
