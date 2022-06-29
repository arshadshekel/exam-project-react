import { useParams, useHistory } from "react-router-dom";
import { React, useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { ADDHOTELS } from "../../constants/Api";
import AuthContext from "../../context/AuthContext";

import Toasts from "../../hooks/useToasts";

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
});

function EditHotelForm() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { slug } = useParams();

  const [show, setShow] = useState(false);
  const [auth] = useContext(AuthContext);
  const [file, setFile] = useState(null);

  
  const [uploadedFile, setUploadedFile] = useState(null);

  //toast variables
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastAction, setToastAction] = useState("");

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  // functions to show and close modals
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [newSlug, setNewSlug] = useState("");
  let history = useHistory();

  // API call to fetch hotels
  useEffect(
    function () {
      async function fetchData() {
        try {
          const fetchurl = ADDHOTELS + "?slug=" + slug;
          const response = await fetch(fetchurl);

          if (response.ok) {
            const json = await response.json();
            
            setHotel(json[0]);
            setFile(json[0].picture);
            setNewSlug(slug);

          } else {
            setError("An error occured");
          }
        } catch (error) {
          setError(error.toString());
        } finally {
          setLoading(false);
        }
      }
      fetchData();
      
    },
    [slug]
  );

  async function onSubmit(data) {
    // get JWT token from localstorage
    const token = auth.jwt;
    const url = ADDHOTELS + "/" + hotel.id;

    // Create new formData object to hold data to send in API call
    let formData = new FormData();

    //Delete picture file which gets attached during yup validation
    delete data["picture"];

    //Append picture if uploaded and data
    if (uploadedFile) {
      formData.append(`files.picture`, uploadedFile, uploadedFile.name);
    }
    formData.append("data", JSON.stringify(data));
    // update hotel and show toast
    try {
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      await axios.put(url, formData).then((response) => {
        
           if (response.status === 200) {
             console.log(response.data);
          setShowToast(true);
          setToastType("success");
          setToastAction("editHotel");
             setTimeout(() => setShowToast(false), 3000);
             /* setTimeout(() => history.push(/hotels/resonse.data)) */
             setNewSlug(response.data.slug);
            
        }  
      });
      /*  console.log(newSlug); */
    } catch (error) {
      setShow(false);
      setShowToast(true);
      setToastType("fail");
      setToastAction("editHotel");
      console.log("error", error);
    }
  }

  if (loading) {
    return (
      <div className="mt-5 container">
        <h1 className="text-center">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 container">
        <h1>An error occured: {error}</h1>
      </div>
    );
  }

  async function deleteItem() {
    const token = auth.jwt;
    const url = ADDHOTELS + "/" + hotel.id;

    try {
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      await axios.delete(url, {}).then((response) => {
        if (response.status === 200) {
          setShowToast(true);
          setToastType("success");
          setToastAction("deleteHotel");
          setTimeout(() => setShowToast(false), 1000);
          setTimeout(() => history.push("/hotels"), 3000);
        }
      });
    } catch (error) {
      setShowToast(true);
      setToastType("fail");
      setToastAction("deleteHotel");
      console.log("error", error);
    }
  }

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  function updateTitle() {
    document.title = "Holidaze - Edit - " + hotel.name;
  }

  return (

    <div className="my-5 container contact-form">
      <h1 className="my-5 text-center">Edit {hotel.name}</h1>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Hotel name</Form.Label>
          <Form.Control
            placeholder="Hotel name"
            name="name"
            ref={register}
            defaultValue={hotel.name}
          />
          {errors.name && (
            <span className="text-danger">{errors.name.message}</span>
          )}
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput2">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            placeholder="Phonenumber"
            name="phone"
            ref={register}
            defaultValue={hotel.phone}
          />
          {errors.phone && (
            <span className="text-danger">{errors.phone.message}</span>
          )}
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput5">
          <Form.Label>Address</Form.Label>
          <Form.Control
            placeholder="Address"
            name="Address"
            ref={register}
            defaultValue={hotel.Address}
          />
          {errors.Address && (
            <span className="text-danger">{errors.Address.message}</span>
          )}
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput2">
          <Form.Label>Zipcode</Form.Label>
          <Form.Control
            placeholder="Zipcode"
            name="Zipcode"
            ref={register}
            defaultValue={hotel.Zipcode}
          />
          {errors.Zipcode && (
            <span className="text-danger">{errors.Zipcode.message}</span>
          )}
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput2">
          <Form.Label>City</Form.Label>
          <Form.Control
            placeholder="City"
            name="City"
            ref={register}
            defaultValue={hotel.City}
          />
          {errors.City && (
            <span className="text-danger">{errors.City.message}</span>
          )}
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlInput3">
          <Form.Label>Standard</Form.Label>
          <Form.Control
            placeholder="Standard"
            name="standard"
            ref={register}
            defaultValue={hotel.standard}
          />
          {errors.standard && (
            <span className="text-danger">{errors.standard.message}</span>
          )}
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlInput3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            placeholder="Price"
            name="price"
            ref={register}
            defaultValue={hotel.price}
          />
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
            defaultValue={hotel.description}
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
          defaultChecked={hotel.featured}
          ref={register}
        />

        <img
          src={uploadedFile ? URL.createObjectURL(uploadedFile) : file.url}
          alt={uploadedFile ? uploadedFile.name : file.name}
          height="100%"
          width="150px"
          className="mt-5 my-3"
          onLoad={updateTitle}
        />
        <Form.Group>
          <Form.Label
            className="custom-file-upload mt-3 mb-4"
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
            onChange={handleFileChange}
            accept="image/*"
          />
          {errors.picture && (
            <span className="text-danger">{errors.picture.message}</span>
          )}
        </Form.Group>

        <Button variant="success" className="mb-3" type="submit">
          Update
        </Button>
        <Button
          className="primary-button ml-3 mr-3 mb-3"
          onClick={() => history.push("/hotels/" + newSlug)}
        >
          View hotel
        </Button>
        <Button variant="danger" className="mb-3" onClick={handleShow}>
          Delete item
        </Button>
      </Form>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header className="modal-no-border" closeButton>
          <h3 className="ml-auto">Delete hotel?</h3>
        </Modal.Header>
        <Modal.Body className="modal-no-border">
          Do you wish to delete hotel?
        </Modal.Body>

        <Modal.Footer className="modal-no-border mr-auto">
          <Button
            variant="danger"
            onClick={() => {
              handleClose();
              deleteItem();
            }}
          >
            Delete
          </Button>
          <Button className="primary-button px-3" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <Toasts type={toastType} action={toastAction} showToast={showToast} />
    </div>
  );
}

export default EditHotelForm;
