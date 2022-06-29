import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { API, GMAPSAPI } from "../../constants/Api";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Col, Row, Modal, Button } from "react-bootstrap";
import EnquiryForm from "../forms/EnquiryForm";
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function Hoteldetails() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { slug } = useParams();
  //functions to show and hide modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // variable to show / hide toasts
  const [show, setShow] = useState(false);

  const fetchurl = API + "?slug="+ slug;
  let history = useHistory();
  const [auth] = useContext(AuthContext);

  const APIKEY = GMAPSAPI;
  const [mapsAddress, setMapsAddress] = useState(null);
  const [mapsCity, setMapsCity] = useState(null);

  // API call to get the current hotel
  useEffect(
    function () {
      async function fetchData() {
        try {
          const response = await fetch(fetchurl);

          if (response.ok) {
            const json = await response.json();
            setHotel(json[0]);
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
    [fetchurl]
  );

  // Encode the address so that it can be used as query string
  function convertAddress() {
    const Address = encodeURI(hotel.Address);
    setMapsAddress(Address);
    const City = encodeURI(hotel.City);
    setMapsCity(City);
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
        <h1 className="text-center text-danger">An error occured</h1>
      </div>
    );
  }

  /* Initially I tried to implement other peoples components but ended up 
   writing one myself. I also learned that template literals end up showing
   as text. So I got help and he suggested arrays 
  */
  function populateStars() {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < hotel.standard) {
        stars.push(
          <span className="star-color" key={i}>
            <FaStar size={22} />
          </span>
        );
      }
      if (i >= hotel.standard) {
        stars.push(
          <span className="star-color" key={i}>
            <FaRegStar size={22} />
          </span>
        );
      }
    }
    document.title = "Holidaze - " + hotel.name;
    return stars;
  }

  return (
    <>
      <div className="container mt-5">
        <Row className="d-flex justify-content-between">
          <Col xs={12} md={4}>
            <img
              src={hotel.picture?.url}
              alt={hotel.name}
              width="285px"
              className="d-block mx-auto img-fluid"
              onLoad={convertAddress}
            ></img>
            <p className="text-center mt-3 mb-0">{hotel.Address}</p>
            <p className="text-center mb-0">
              {hotel.Zipcode} {hotel.City}
            </p>
            <p className="text-center mb-0">{hotel.phone}</p>
          </Col>
          <Col xs={12} md={7}>
            <h1 className="mt-5 mt-md-0 text-center text-md-left">
              {hotel.name}
            </h1>

            <div className="text-center text-md-left">
              {populateStars().map((star) => {
                return star;
              })}
            </div>
            <p className="mt-5" style={{ whiteSpace: "break-spaces" }}>
              {hotel.description}
            </p>
            <p className="mt-5 font-weight-bold">Price: {hotel.price}NOK</p>
            <Button className="mr-3 mt-5 primary-button" onClick={handleShow}>
              Contact hotel
            </Button>
            {auth ? (
              <Button
                className="ml-3 mt-5"
                variant="success"
                onClick={() => history.push("/admin/edit/" + slug)}
              >
                {" "}
                Edit hotel
              </Button>
            ) : null}

            {mapsAddress !== null ? (
              <iframe
                title="gmaps"
                width="100%"
                height="400px"
                style={{ border: "0" }}
                loading="lazy"
                allowFullScreen
                className="my-5"
                src={
                  "https://www.google.com/maps/embed/v1/place?&q=" +
                  mapsAddress +
                  "," +
                  mapsCity +
                  "&key=" +
                  APIKEY
                }
              ></iframe>
            ) : null}
          </Col>
        </Row>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
          className="modal-background"
        >
          <Modal.Header className="modal-no-border" closeButton>
            <h3 className="ml-auto">Contact {hotel.name}</h3>
          </Modal.Header>
          <Modal.Body>
            <EnquiryForm handleClose={handleClose} hotelName={hotel.name} />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Hoteldetails;
