import { message, Switch } from "antd";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

function AddPackage() {
  const Pref = useRef();
  const user = useSelector((state) => state.auth);
  const [isSwitch, setIsSwitch] = useState(false);

  // Handle add package
  const handleAdd = async (e) => {
    e.preventDefault();
    console.log(
      e.target.active,
      e.target.name.value,
      e.target.description.value,
      parseInt(e.target.price.value),
      parseInt(e.target.kind.value)
    );
    await axios
      .post(
        `${process.env.REACT_APP_API_HOST}api/AddPackage`,
        {
          Name: e.target.name.value,
          Desc: e.target.description.value,
          Price: parseInt(e.target.price.value),
          Active: isSwitch,
          Kind: parseInt(e.target.kind.value),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((res) => {
        e.target.name.value = "";
        e.target.description.value = "";
        e.target.kind.value = "";
        e.target.price.value = "";
        message.success("The package is added");
      })
      .catch((err) => {
        console.error(err);
        message.error("Sorry, something went wrong!");
      });
  };

  return (
    <div className="add-backage-co">
      <h2>Add Package</h2>
      <form onSubmit={handleAdd} ref={Pref}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input required type={"text"} id="name" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Decription:</label>
          <input required type={"text"} id="description" />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input required type={"text"} id="price" />
        </div>
        <div className="form-group">
          <label htmlFor="active">Is active?</label>
          {/* <input type={"radio"} id="active" /> */}
          <Switch
            className="switch"
            id="active"
            defaultChecked
            onChange={(checked) => setIsSwitch(checked)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="kind">Kind:</label>
          <input required type={"text"} id="kind" />
        </div>
        <input className="submit" type={"submit"} />
      </form>
    </div>
  );
}

export default AddPackage;
