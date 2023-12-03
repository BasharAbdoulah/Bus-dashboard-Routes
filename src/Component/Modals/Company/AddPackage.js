import { message, Switch } from "antd";
import axios from "axios";
import useFetch from "hooks/useFetch";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function AddPackage({ onAddOk, packageData, editMode }) {
  const Pref = useRef();
  const user = useSelector((state) => state.auth);
  const [isSwitch, setIsSwitch] = useState(false);
  const [price, setPrice] = useState("");
  const [kind, setKind] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  console.log(user.token);
  useEffect(() => {
    setDescription(packageData?.desc);
    setKind(packageData?.kind);
    setName(packageData?.name);
    setPrice(packageData?.price);
  }, [packageData]);

  const {
    data: data,
    error: error,
    loading: loading,
    executeFetch: executeFetch,
  } = useFetch(`${process.env.REACT_APP_API_HOST}api/AddPackage`, "post", {}, false);

  const {
    data: editData,
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(`${process.env.REACT_APP_API_HOST}api/EditPackage`, "post", {}, false);

  const emptyFields = () => {
    setDescription("");
    setKind(0);
    setName("");
    setPrice(0);
  };

  useEffect(() => {
    if (!editMode) {
      emptyFields();
    }
  }, [editMode]);

  // Handle add package
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!editMode) {
      emptyFields();
      executeFetch({
        Name: e.target.name.value,
        Desc: e.target.description.value,
        Price: e.target.price.value,
        Active: isSwitch,
        Kind: parseInt(e.target.kind.value),
      });
    } else {
      editExecuteFetch({
        id: packageData?.id,
        Name: name,
        Desc: description,
        Price: price,
        Kind: kind,
      });
    }
  };

  useEffect(() => {
    if (data?.status) {
      message.success("The package has been added");
      onAddOk();
    } else if (error) {
      console.error(error);
      message.error("Sorry, something went wrong!");
    }
  }, [data?.status]);

  useEffect(() => {
    if (editData?.status) {
      message.success("The package has been edited");
      onAddOk();
    } else if (error) {
      console.error(error);
      message.error("Sorry, something went wrong!");
    }
  }, [editData?.status]);

  return (
    <div className="add-backage-co">
      <h2>Add Package</h2>
      <form onSubmit={handleAdd} ref={Pref}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            required
            type={"text"}
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Decription:</label>
          <input
            required
            type={"text"}
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            required
            type={"text"}
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
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
          <label htmlFor="kind">Kind Number:</label>
          <input
            required
            type={"number"}
            id="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
        </div>
        <input className="submit" type={"submit"} />
      </form>
    </div>
  );
}

export default AddPackage;
