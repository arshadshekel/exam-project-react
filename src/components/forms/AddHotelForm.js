import { React, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ADDHOTELS } from "../../constants/Api";
import AuthContext from "../../context/AuthContext";
import defaultThumbnail from "../../images/placeholder.png";
import Toasts from "../../hooks/useToasts";

const url = ADDHOTELS;

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter your first name")
    .min(2, "The name must be at least 2 characters"),
  phone: yup
    .string()
    .required("Please enter your last name")
    .min(2, "The name must be at least 2 characters"),
  Address: yup
    .string()
    .required("Please enter an address")
    .min(2, "The name must be at least 2 characters"),
  City: yup
    .string()
    .required("Please enter a city")
    .min(2, "The name must be at least 2 characters"),
  standard: yup
    .number()
    .positive()
    .typeError("Please enter a standard")
    .integer()
    .max(5, "The standard must be maximum 5 stars"),
  Zipcode: yup
    .number()
    .positive()
    .typeError("Please enter a zipcode")
    .integer(),
  price: yup.number().typeError("Please enter a price").positive().integer(),
  description: yup
    .string()
    .required("Please enter your message")
    .min(10, "The message must be at least 10 characters"),
  picture: yup
    .mixed()
    .test("fileExists", "Please upload a file", (value) => !!value.length),
});

function AddHotelForm() {
  const [auth] = useContext(AuthContext);
  
  const [file, setFile] = useState(null);

  //toast variables
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastAction, setToastAction] = useState("");

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  // update current picture
  const handleInputChange = (event) => {
    setFile(event.target.files[0]);
  };

  let history = useHistory();

  async function onSubmit(data) {
    // get JWT token from localstorage
    const token = auth.jwt;
    console.log(data);

    // Create new formData object to hold data to send in API call
    let formData = new FormData();

    //Delete picture file which gets attached during yup validation
    delete data["picture"];

    //Append picture and data
    formData.append(`files.picture`, file, file.name);
    formData.append("data", JSON.stringify(data));
    // create hotel and show toast
    try {
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      await axios.post(url, formData).then((response) => {
        console.log(response);
        const slug = response.data.slug;
        if (response.status === 200) {
          setShowToast(true);
          setToastType("success");
          setToastAction("addHotel");
          setTimeout(() => setShowToast(false), 3000);
          setTimeout(() => history.push("/hotels/" + slug), 3000); 
        }
      });
    } catch (error) {
      setShowToast(true);
      setToastType("fail");
      setToastAction("addHotel");
      console.log("error", error);
    }
  }

  return (
    <div className="container contact-form">
      <h1 className="text-center my-5">Add new hotel</h1>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Hotel name</Form.Label>
          <Form.Control placeholder="Hotel name" name="name" ref={register} />
          {errors.name && (
            <span className="text-danger">{errors.name.message}</span>
          )}
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput2">
          <Form.Label>Phone</Form.Label>
          <Form.Control placeholder="Phonenumber" name="phone" ref={register} />
          {errors.phone && (
            <span className="text-danger">{errors.phone.message}</span>
          )}
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput5">
          <Form.Label>Address</Form.Label>
          <Form.Control placeholder="Address" name="Address" ref={register} />
          {errors.Address && (
            <span className="text-danger">{errors.Address.message}</span>
          )}
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput2">
          <Form.Label>Zipcode</Form.Label>
          <Form.Control placeholder="Zipcode" name="Zipcode" ref={register} />
          {errors.Zipcode && (
            <span className="text-danger">{errors.Zipcode.message}</span>
          )}
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput2">
          <Form.Label>City</Form.Label>
          <Form.Control placeholder="City" name="City" ref={register} />
          {errors.City && (
            <span className="text-danger">{errors.City.message}</span>
          )}
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlInput3">
          <Form.Label>Standard</Form.Label>
          <Form.Control placeholder="Standard" name="standard" ref={register} />
          {errors.standard && (
            <span className="text-danger">{errors.standard.message}</span>
          )}
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlInput3">
          <Form.Label>Price</Form.Label>
          <Form.Control placeholder="Price" name="price" ref={register} />
          {errors.price && (
            <span className="text-danger">{errors.price.message}</span>
          )}
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={12}
            name="description"
            placeholder="Please enter a message"
            ref={register}
          />
          {errors.description && (
            <span className="text-danger">{errors.description.message}</span>
          )}
        </Form.Group>

        <Form.Check
          custom
          type="checkbox"
          name="featured"
          id="featured"
          label="featured"
          ref={register}
          className="my-3"
        />

        <img
          src={file ? URL.createObjectURL(file) : defaultThumbnail}
          alt={file ? file.name : "Default thumbnail"}
          height="100%"
          width="300px"
          className="my-3"
        />
        <Form.Group>
          <Form.Label
            className="custom-file-upload my-3"
            htmlFor="file-upload"
            type="submit"
          >
            Upload a picture
          </Form.Label>

          <Form.File
            name="picture"
            type="file"
            ref={register}
            id="file-upload"
            onChange={handleInputChange}
            accept="image/*"
          />
          {errors.picture && (
            <span className="text-danger">{errors.picture.message}</span>
          )}
        </Form.Group>
        <Button className="primary-button mb-5" type="submit">
          Submit
        </Button>
      </Form>
      <Toasts type={toastType} action={toastAction} showToast={showToast} />
    </div>
  );
}

export default AddHotelForm;
