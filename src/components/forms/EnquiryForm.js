import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ENQUIRYURL } from "../../constants/Api";
import Toasts from "../../hooks/useToasts";

const url = ENQUIRYURL;

const schema = yup.object().shape({
  Firstname: yup
    .string()
    .required("Please enter your first name")
    .min(2, "The name must be at least 2 characters"),
  Lastname: yup
    .string()
    .required("Please enter your last name")
    .min(2, "The name must be at least 2 characters"),
  Email: yup
    .string()
    .required("Please enter an email address")
    .email("Please enter a valid email address"),
  Message: yup
    .string()
    .required("Please enter your message")
    .min(10, "The message must be at least 10 characters"),
});

function EnquiryForm({ handleClose, hotelName }) {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastAction, setToastAction] = useState("");

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  // Send a message to a hotel and show toasts
  async function onSubmit(data) {
    data.Hotel = hotelName;
    data.new = true;
    try {
      await axios.post(url, data).then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          setShowToast(true);
          setToastType("success");
          setToastAction("postMessage");
          setTimeout(() => setShowToast(false), 3000);
          setTimeout(() => handleClose(), 3000);
        }
      });
    } catch (error) {
      setShowToast(true);
      setToastType("fail");
      setToastAction("postMessage");
      setTimeout(() => setShowToast(false), 1000);
      setTimeout(() => handleClose(), 3000);
      console.log("error", error);
    }
  }

  return (
    <div className="container">
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
          <Form.Control placeholder="Lastname" name="Lastname" ref={register} />
          {errors.Lastname && (
            <span className="text-danger">{errors.Lastname.message}</span>
          )}
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlInput3">
          <Form.Label>Email</Form.Label>
          <Form.Control placeholder="Email" name="Email" ref={register} />
          {errors.Email && (
            <span className="text-danger">{errors.Email.message}</span>
          )}
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            name="Message"
            placeholder="Please enter a message"
            ref={register}
          />
          {errors.Message && (
            <span className="text-danger">{errors.Message.message}</span>
          )}
        </Form.Group>
        <Button className="primary-button mt-3" type="submit">
          Submit
        </Button>
        <Button variant="secondary" onClick={handleClose} className="ml-3 mt-3">
          Close
        </Button>
      </Form>
      <Toasts type={toastType} action={toastAction} showToast={showToast} />
    </div>
  );
}

export default EnquiryForm;
