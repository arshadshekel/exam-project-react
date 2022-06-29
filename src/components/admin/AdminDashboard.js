import { React, useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { CONTACTURL, ENQUIRYURL } from "../../constants/Api";
import AuthContext from "../../context/AuthContext";
import { BsEnvelope, BsEnvelopeOpen } from "react-icons/bs";
import { Accordion, Card, Button, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import moment from "moment";

import Toasts from "../../hooks/useToasts";

function AdminDashboard() {
  const [auth] = useContext(AuthContext);
  const [contactForms, setContactForms] = useState([]);
  const [enquiries, setEnquiry] = useState([]);
  const [filterMessages, setFilterMessages] = useState([]);
  const [show, setShow] = useState(false);
  const [entryID, setEntryID] = useState(false);
  const [entryType, setEntryType] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (id, type) => {
    setShow(true);
    setEntryID(id);
    setEntryType(type);
  };
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastAction, setToastAction] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    document.title = "Holidaze - Admin dashboard";
  }, []);

  useEffect(
    function () {
      async function getForms() {
        // get JWT token from localstorage
        const token = auth.jwt;
        // API call to get both contactmessages and enquiries
        // its 2130 and I realized I could have implemented the enquiry
        // functionality onto messages with easy. Oh well
        try {
          axios
            .get(CONTACTURL, { headers: { Authorization: `Bearer ${token}` } })
            .then((resp) => {
              setContactForms(resp.data);
            });
          axios
            .get(ENQUIRYURL, { headers: { Authorization: `Bearer ${token}` } })
            .then((resp) => {
              setEnquiry(resp.data);
            });
        } catch (error) {
          console.log("error", error);
        }
      }
      getForms();
      setUpdateList(false);

      // check for update every 30 secs

      intervalRef.current = setInterval(() => {
        getForms();
      }, 30000);

      //clear the interval when done
      return () => clearInterval(intervalRef.current);
    },

    [auth, updateList]
  );

  // sorting the messages so most recent is first
  useEffect(() => {
    if (enquiries.length) {
      const sortedArray = enquiries.sort(function (a, b) {
        const d = new Date(a.created_at);
        const c = new Date(b.created_at);
        return c - d;
      });

      setFilterMessages(sortedArray);
    }
  }, [enquiries]);

  // Function to delete a specific messsage
  async function deleteItem(id, type) {
    const token = auth.jwt;
    let url = "";

    if (type === "contact") {
      url = CONTACTURL + id;
    }
    if (type === "enquiry") {
      url = ENQUIRYURL + id;
    }

    try {
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      await axios.delete(url, {}).then((response) => {
        if (response.status === 200) {
          handleClose();
          setShowToast(true);
          setToastType("success");
          setToastAction("deleteMessage");
          setTimeout(() => setShowToast(false), 1000);
          setUpdateList(true);
        }
      });
    } catch (error) {
      handleClose();
      setShowToast(true);
      setToastType("fail");
      setToastAction("deleteMessage");
      setTimeout(() => setShowToast(false), 1000);
      console.log("error", error);
    }
  }

  // update the new variable after opening enquiry
  async function viewMessage(id) {
    const token = auth.jwt;
    const url = ENQUIRYURL + id;

    try {
      await axios
        .put(
          url,
          { new: false },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            //clear the interval and fire up DOM updates
            clearInterval(intervalRef.current);
            setUpdateList(true);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <>
      <h1 className="text-center text-bold mt-5 color-primary">
        Admin Dashboard
      </h1>

      <LinkContainer to="/admin/add">
        <div className="my-3 d-flex justify-content-center">
          <Button variant="success" className="my-3 rounded-corners">
            Add hotel
          </Button>
        </div>
      </LinkContainer>

      <h2 className="text-center text-bold mb-5">Messages received</h2>

      <Accordion className="my-5 admin-dashboard-width mx-auto">
        <Card className="my-3">
          <Accordion.Toggle
            as={Card.Header}
            className="accordion-title"
            eventKey="0"
          >
            Messages to Holidaze
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              {contactForms.length !== 0 ? (
                contactForms.map((form) => {
                  return (
                    <Accordion key={form.id}>
                      <Card className="my-3">
                        <Accordion.Toggle
                          as={Card.Header}
                          onClick={() => {
                            if (form.new) viewMessage(form.id);
                          }}
                          className={
                            form.new
                              ? "accordion-title d-flex"
                              : "accordion-subtitle d-flex"
                          }
                          eventKey="0"
                        >
                          <span className="mr-3">
                            {form.new ? <BsEnvelope /> : <BsEnvelopeOpen />}
                          </span>
                          <span className="mr-3">
                            {form.Firstname} {form.Lastname}
                          </span>
                          <span className="ml-auto d-none d-md-block">
                            {moment(form.created_at).format("LLL")}
                          </span>
                        </Accordion.Toggle>

                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div className="my-2">
                              Date:{" "}
                              <span className="ml-3">
                                {moment(form.created_at).format(
                                  "MMMM Do YYYY, h:mm:ss a"
                                )}
                              </span>
                            </div>
                            <div className="my-2">
                              Name:{" "}
                              <span className="ml-3">
                                {form.Firstname} {form.Lastname}
                              </span>
                            </div>
                            <div className="my-2">
                              Email:{" "}
                              <a className="ml-3" href={"mailto:" + form.email}>
                                {form.email}
                              </a>
                            </div>
                            <div className="my-2">
                              Message:{" "}
                              <span className="ml-3">{form.Message}</span>
                            </div>
                            <Button
                              variant="danger"
                              className="my-3 rounded-corners"
                              onClick={() => handleShow(form.id, "contact")}
                            >
                              Delete message
                            </Button>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  );
                })
              ) : (
                <p>No messages to be found</p>
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="1"
            className="accordion-title"
          >
            Enquires to Hotels
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              {filterMessages.length !== 0 ? (
                filterMessages.map((form) => {
                  return (
                    <Accordion key={form.id}>
                      <Card className="my-3">
                        <Accordion.Toggle
                          as={Card.Header}
                          onClick={() => {
                            if (form.new) viewMessage(form.id);
                          }}
                          className={
                            form.new
                              ? "accordion-title d-flex"
                              : "accordion-subtitle d-flex"
                          }
                          eventKey="0"
                        >
                          <span className="mr-3">
                            {form.new ? <BsEnvelope /> : <BsEnvelopeOpen />}
                          </span>
                          <span className="mr-3">{form.Hotel}</span>
                          <span className="ml-auto d-none d-md-block">
                            {moment(form.created_at).format("LLL")}
                          </span>
                        </Accordion.Toggle>

                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div className="my-2">
                              Date:{" "}
                              <span className="ml-3">
                                {moment(form.created_at).format(
                                  "MMMM Do YYYY, h:mm:ss a"
                                )}
                              </span>
                            </div>
                            <div className="my-2">
                              Name:{" "}
                              <span className="ml-3">
                                {form.Firstname} {form.Lastname}
                              </span>
                            </div>
                            <div className="my-2">
                              Email:{" "}
                              <a className="ml-3" href={"mailto:" + form.Email}>
                                {form.Email}
                              </a>
                            </div>
                            <div className="my-2">
                              Message:{" "}
                              <span className="ml-3">{form.Message}</span>
                            </div>
                            <Button
                              variant="danger"
                              className="my-3 rounded-corners"
                              onClick={() => handleShow(form.id, "enquiry")}
                            >
                              Delete message
                            </Button>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  );
                })
              ) : (
                <p>No messages to be found</p>
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header className="modal-no-border" closeButton>
          <h3 className="ml-auto">Delete message?</h3>
        </Modal.Header>
        <Modal.Body>Do you wish to delete message?</Modal.Body>

        <Modal.Footer className="modal-no-border mr-auto">
          <Button
            variant="danger"
            onClick={() => deleteItem(entryID, entryType)}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <Toasts type={toastType} action={toastAction} showToast={showToast} />
    </>
  );
}
export default AdminDashboard;
