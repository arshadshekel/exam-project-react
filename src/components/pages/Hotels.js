import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState} from "react";
import { API } from "../../constants/Api";
import Hotelcard from "../hotel/Hotelcard";
import SearchDropDown from "../forms/SearchDropDown";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minprice, setMinprice] = useState(null);
  const [maxprice, setMaxprice] = useState(null);
  const [stars, setStars] = useState(5);
  const [minpriceError, setMinpriceError] = useState(false);
  const [maxpriceError, setMaxpriceError] = useState(false);
  const [filteredhotels, setFilteredhotels] = useState([]);
  const [nohotels, setNohotels] = useState(false);
  const [search, setSearch] = useState("");
  /* function that checks that the input is a number and converts
  string to int. Sets the minimum/maximum price if there is an error set the variable
  Is to be used for filtering hotels in the list
  */
  const checkPrice = (event, type) => {
    const reg = /^[+-]?[1-9][1-9]*|0$/;

    if (reg.test(event.target.value) && event.target.value > 0) {
      if (type === "min") {
        const newMinPrice = parseInt(event.target.value);
        setMinprice(newMinPrice);
        setMinpriceError(false);
      }
      if (type === "max") {
        const newMaxPrice = parseInt(event.target.value);
        setMaxprice(newMaxPrice);
        setMaxpriceError(false);
      }
    } else {
      if (type === "min") {
        setMinpriceError(true);
      }
      if (type === "max") {
        setMaxpriceError(true);
      }
    }
  };

  useEffect(() => {
    document.title = "Holidaze - View hotels in Bergen";
  }, []);

  /* API call to fetch all hotels and set the default values
   min/max of the inputs */
  useEffect(function () {
    async function fetchData() {
      try {
        const response = await fetch(API);

        if (response.ok) {
          const json = await response.json();
          setHotels(json);
          setDefaultValues(json);
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
  }, []);

  /* filter hotels according to inputs/select. 
  Searchbar was implemented 2 days before delivery,
  so no filtering based on search. Ideally I would 
  implement that too */
  useEffect(
    function () {
      function filterHotels() {
        const filteredHotels = hotels.filter((hotel) => {
          if (search) {
            if (
              hotel.standard <= stars &&
              hotel.price >= minprice &&
              hotel.price <= maxprice &&
              hotel.name.toLowerCase().includes(search)
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            if (
              hotel.standard <= stars &&
              hotel.price >= minprice &&
              hotel.price <= maxprice
            ) {
              return true;
            } else {
              return false;
            }
          
          }
        });
        if (filteredHotels.length > 0) {
          setNohotels(false);
        } else {
          setNohotels(true);
        }
        setFilteredhotels(filteredHotels);
      }
      filterHotels();
;
    },
    [minprice, maxprice, stars, hotels, nohotels, minpriceError, maxpriceError, search]
  );

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

  // function to set the min and max default values of inputs
  function setDefaultValues(hotels) {
    const minValueOfHotel = Math.min(...hotels.map((hotel) => hotel.price));
    const maxValueOfHotel = Math.max(...hotels.map((hotel) => hotel.price));
    setMaxprice(maxValueOfHotel);
    setMinprice(minValueOfHotel);
  }

  return (
    <div>
      <h1 className="text-center mt-5">Hotels</h1>
      <div className="mb-5 px-md-5 container container-md-fluid d-flex justify-content-center">
        <div>
          <SearchDropDown search={search} setSearch={setSearch}/>
          <h4>Sort by:</h4>
          <Form noValidate>
            <Form.Row>
              <Form.Group as={Col} sm="4" controlId="validationCustom01">
                <Form.Label>Min price</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Minimum price"
                  defaultValue={minprice}
                  isInvalid={minpriceError}
                  onChange={(event) => checkPrice(event, "min")}
                />
                <Form.Control.Feedback type="invalid">
                  Enter a minimum price
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} sm="4" controlId="validationCustom02">
                <Form.Label>Max price</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Maximum price"
                  defaultValue={maxprice}
                  isInvalid={maxpriceError}
                  onChange={(event) => checkPrice(event, "max")}
                />
                <Form.Control.Feedback type="invalid">
                  Enter a maximum price
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} sm="4" controlId="validationCustom05">
                <Form.Label>Select stars (up to)</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  defaultValue={5}
                  onChange={(event) => {
                    const newStar = parseInt(event.target.value);
                    setStars(newStar);
                  }}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Form>
        </div>
      </div>
      <div className="my-5 container container-md-fluid">
        <Row>
          {nohotels ? (
            <Col xs={12}>
              <h2 className="text-center">No hotels found</h2>
            </Col>
          ) : (
            filteredhotels.map((hotel) => {
              return (
                <Col xs={12} xl={6} key={hotel.id}>
                  <Hotelcard
                    id={hotel.id}
                    name={hotel.name}
                    standard={hotel.standard}
                    price={hotel.price}
                    email={hotel.email}
                    slug={hotel.slug}
                    description={hotel.description}
                    picture={hotel.picture.url}
                  />
                </Col>
              );
            })
          )}
        </Row>
      </div>
    </div>
  );
}

export default Hotels;
