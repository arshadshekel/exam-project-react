import { Jumbotron, Row, Col } from "react-bootstrap";

import { useEffect, useState } from "react";
import { API } from "../../constants/Api";

import Hotelcard from "../hotel/Hotelcard";
import SearchDropDown from "../forms/SearchDropDown";

function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Holidaze - Find hotels in Bergen";
  }, []);

  // get hotels
  useEffect(function () {
    async function fetchData() {
      try {
        const response = await fetch(API);

        if (response.ok) {
          const json = await response.json();
          setHotels(json);
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

  return (
    <div>
      <Jumbotron className="jumbotron-img">
        <div className="jumbotron-content container overlay">
          <div className="py-5">
            <h1 className="landingpage-title">DISCOVER BERGEN</h1>
            <h2 className="landingpage-subtitle">Book a hotel today!</h2>
            <SearchDropDown search={search} setSearch={setSearch} />
          </div>
        </div>
      </Jumbotron>

      <div className="container container-md-fluid  featured-hotels">
        <h2 className="my-5 font-weight-bold">Some featured hotels</h2>
        <Row>
          {hotels.map((hotel) => {
            if (hotel.featured) {
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
            } else {
              return null;
            }
          })}
        </Row>
      </div>
    </div>
  );
}

export default HomePage;
