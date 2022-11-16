import { message, Modal, Spin, Switch, Table } from "antd";
import axios from "axios";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AllPackages() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const user = useSelector((state) => state.auth);
  const [modal2Open, setModal2Open] = useState(false);
  const [isSwitch, setIsSwitch] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [kind, setKind] = useState();
  const [name, setName] = useState();
  const [deletedId, setDeletedId] = useState();

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListPackageByCompanyID",
    "post",
    {
      id: user?.companyID,
      PageNumber: 1,
      PageSize: 10,
    },
    true
  );

  useEffect(async () => {
    setTableData(data?.description);
  }, [data, error, loading]);

  useEffect(() => {
    if (true) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  // Handle edit function
  const handleEdit = (item) => {
    console.log("id is", item.id);
    setModal2Open(true);
    console.log(item);
    setCompanyName(item.companyName);
    setDescription(item.desc);
    setKind(item.kind);
    setName(item.name);
    setDeletedId(item.id);
    setPrice(item.price);
  };

  // handle ok action
  const onOk = async (e) => {
    e.preventDefault();
    console.log(name, description, kind, price);

    await axios
      .post(
        `${process.env.REACT_APP_API_HOST}api/EditPackage`,
        {
          id: deletedId,
          Name: name,
          Desc: description,
          Price: price,
          Kind: kind,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((res) => {
        console.log("res", res.data);
        if (res.data.status) {
          message.success("The package has edited");
          executeFetch();
          setModal2Open(false);
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Sorry, something went wrong!");
      });
  };

  return (
    <>
      <Modal
        title="Edit your package"
        centered
        visible={modal2Open}
        onOk={onOk}
        okText="Submit"
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <div className="add-backage-co">
          <form onSubmit={onOk}>
            <div className="form-group edit">
              <label htmlFor="name">Company Name:</label>
              <input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                type={"text"}
                id="name"
              />
            </div>
            <div className="form-group edit">
              <label htmlFor="description">Decription:</label>
              <input
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type={"text"}
                id="description"
              />
            </div>
            <div className="form-group edit">
              <label htmlFor="price">Price:</label>
              <input
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type={"number"}
                id="price"
              />
            </div>

            <div className="form-group">
              <label htmlFor="kind">Kind:</label>
              <input
                required
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                type={"text"}
                id="kind"
              />
            </div>
            <div className="form-group">
              <label htmlFor="kind">Name:</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                type={"text"}
                id="kind"
              />
            </div>
            <input type="submit" className="submit" />
          </form>
        </div>
      </Modal>
      <div className="packages-table-co">
        <p>Company Packages</p>
        <table>
          <thead>
            <tr>
              <th>Company name</th>
              <th>Description</th>
              <th>Kind number</th>
              <th>Kind </th>
              <th>Price</th>
              <th>Create date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.companyName}</td>
                  <td>{item.desc}</td>
                  <td>{item.kind}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    {item.create_Date.substring(0, 10)}{" "}
                    {item.create_Date.substring(11, 16)}
                  </td>
                  <td>
                    <a onClick={() => handleEdit(item)}>Edit</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && (
          <Spin style={{ width: "100%", margin: "20px" }} tip="Loading..." />
        )}
      </div>
    </>
  );
}

export default AllPackages;
