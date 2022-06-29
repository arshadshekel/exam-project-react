import { Typeahead } from "react-bootstrap-typeahead";
import { useState, useEffect, useRef } from "react";
import { API } from "../../constants/Api";
import { useHistory, useLocation } from "react-router-dom";
import { Button, InputGroup, Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

// This component uses code from the react-bootstrap-typeahead examples
const SearchDropDown = ({ search, setSearch }) => {
  const [options, setOptions] = useState([]);
  const inputValue = useRef();

  // Get all hotels
  useEffect(function () {
    async function getHotels() {
      try {
        const response = await fetch(API);
        const result = await response.json();
        const options = result.map((hotel) => ({
          avatar_url: hotel.picture.formats.thumbnail.url,
          slug: hotel.slug,
          name: hotel.name,
        }));
        setOptions(options);
      } catch (error) {}
    }
    getHotels();
  }, []);

  const history = useHistory();
  const page = useLocation();

  /*Initially this was written so that I could redirect when clicking on the
    view hotel button. Or that pressing enter redirects. This was due to me using
    onClick in a wrong way. I later found out how to fix, but kept this function regardless
  */

  function viewHotel(event) {
    event.preventDefault();

    const input = inputValue.current.inputNode.value;
    options.forEach((hotel) => {
      if (hotel.name === input) {
        history.push(`hotels/` + hotel.slug);
      }
    });
  }

  // After finding the right hotel redirect to the details page

  return (
    <Form noValidate onSubmit={viewHotel}>
      <InputGroup
        className={page.pathname === "/home" ? "searchbar-width my-5" : "my-5"}
      >
        <InputGroup.Prepend>
          <InputGroup.Text className="rounded-corners">
            <FaSearch />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <>
          <Typeahead
            id="custom-filtering-example"
            labelKey="name"
            options={options}
            onInputChange={(value) => setSearch(value)}
            ref={inputValue}
            placeholder="Search for a hotel..."
            renderMenuItemChildren={(option) => (
              <div
                onClick={() => {
                  history.push(`hotels/` + option.slug);
                }}
                key={option.slug}
                style={{
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              >
                <img
                  alt={option.name}
                  src={option.avatar_url}
                  style={{
                    height: "24px",
                    marginRight: "10px",
                    width: "24px",
                  }}
                />
                <span>{option.name}</span>
              </div>
            )}
          />
          <InputGroup.Append>
            <Button id="submit-search" className="d-none" type="submit">
              View hotel
            </Button>
          </InputGroup.Append>
        </>
      </InputGroup>
    </Form>
  );
};

export default SearchDropDown;
