import "./styles.css";
import React, { useState, useEffect } from "react";
import { useFormik, Field } from "formik";
import {
  Row,
  Col,
  Accordion,
  Card,
  Form,
  Table,
  Button
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";

export default function App() {
  const [status, setStatus] = useState(null);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"]
    ]
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "video"
  ];

  function isValidTextEditor(message) {
    console.log(content);
    return this.test("test-name", message, function (value) {
      const { path, createError } = this;

      console.log("value", value);
      let condition1 =
        value?.trim() === "" ||
        value?.trim() === "<p><br></p>" ||
        value === undefined;
      console.log("condition1: ", condition1);

      return !condition1 || createError({ path, message: message });
    });
  }
  Yup.addMethod(Yup.string, "isValidTextEditor", isValidTextEditor);

  const EmailSchema = Yup.object().shape({
    from: Yup.string().email("Invalid email").required("From is required"),
    to: Yup.string().email("Invalid email").required("To is required"),
    subject: Yup.string().required("Subject is required"),
    body: Yup.string().isValidTextEditor("Email body cannot be empty.")
  });

  const formik = useFormik({
    initialValues: {
      from: "email@from.com",
      to: "email@to.com",
      subject: "",
      body: ""
    },
    validationSchema: EmailSchema,
    validateOnBlur: false,
    onSubmit: (values, { setSubmitting }) => {
      //api call
      console.log(values);
    }
  });

  return (
    <div>
      <div className="email-form">
        <Form autoComplete="off" onSubmit={formik.handleSubmit}>
          <Form.Group as={Col} className="py-2" md={2}>
            <Form.Label>
              From
              <span className="text-danger">*</span>
            </Form.Label>
            <input
              autoComplete="off"
              className="form-control validate alphaOnly"
              id="from"
              name="from"
              placeholder="from"
              type="email"
              {...formik.getFieldProps("from")}
            />
            {formik.touched.from && formik.errors.from ? (
              <span className="text-start w-100 my-2 text-danger">
                {formik.errors.from}
              </span>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} className="py-2" md={2}>
            <Form.Label>
              To
              <span className="text-danger">*</span>
            </Form.Label>
            <input
              autoComplete="off"
              className="form-control validate alphaOnly"
              id="to"
              name="to"
              placeholder="to"
              type="email"
              {...formik.getFieldProps("to")}
            />
            {formik.touched.to && formik.errors.to ? (
              <span className="text-start w-100 my-2 text-danger">
                {formik.errors.to}
              </span>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} className="py-2" md={5}>
            <Form.Label>
              Subject
              <span className="text-danger">*</span>
            </Form.Label>
            <input
              autoComplete="off"
              className="form-control validate alphaOnly"
              id="subject"
              name="subject"
              placeholder="Email Subject..."
              type="text"
              {...formik.getFieldProps("subject")}
            />
            {formik.touched.subject && formik.errors.subject ? (
              <span className="text-start w-100 my-2 text-danger">
                {formik.errors.subject}
              </span>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} className="py-2" md={12}>
            <Form.Label>
              Body
              <span className="text-danger">*</span>
            </Form.Label>

            <div className="mail-body">
              <ReactQuill
                theme="snow"
                id="body"
                name="body"
                value={formik.values.body}
                onChange={(value) => {
                  console.log(formik.body);
                  setContent(value);
                  formik.setFieldValue("body", value);
                }}
                modules={modules}
                formats={formats}
                placeholder="Write your email here..."
                className="rte"
                // {...formik.getFieldProps("body")}
              />
              {formik.touched.body && formik.errors.body ? (
                <span className="text-start w-100 my-2 text-danger">
                  {formik.errors.body}
                </span>
              ) : null}
            </div>
          </Form.Group>

          {status === "success" && (
            <div style={{ color: "green" }}>Email sent successfully!</div>
          )}
          {status === "error" && (
            <div style={{ color: "red" }}>
              There was an error sending the email.
            </div>
          )}

          <Form.Group as={Col} className="pt-5" md={6}>
            <Button
              variant="primary"
              type="submit"
              className="btn btn-dark"
              style={{
                background: "linear-gradient(180deg,#ff4438 0%,#ff4438 100%)",
                border: "1px solid transparent"
              }}
              // disabled={formik.isSubmitting}
            >
              Send Email
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
