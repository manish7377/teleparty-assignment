import React, { useState } from "react";
import { useTable } from "react-table";
import "./UserSearch.css";
import axios from "axios";

const UserSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [timeId, setTimeId] = useState();

  const debounceFunc = (func, limit) => {
    return (...args) => {
      if (timeId) {
        clearTimeout(timeId);
      }
      setTimeId(
        setTimeout(() => {
          func.apply(this, args);
        }, limit)
      );
    };
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Avatar",
        accessor: "avatar_url",
        Cell: ({ value }) => <img src={value} alt="Avatar" width={50} />,
      },
      {
        Header: "Username",
        accessor: "login",
      },
    ],
    []
  );

  const data = React.useMemo(() => users, [users]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const fetchData = async (inputValue) => {
    if (inputValue) {
      try {
        const response = await axios.get(
          `https://api.github.com/search/users?q=${inputValue}+in:login&sort=followers`
        );
        setUsers(response.data.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const debouncedGetUser = debounceFunc(fetchData, 1000);

  const handleOnChange = (e) => {
    setSearchText(e.target.value);
    if (!e.target.value) {
      setUsers([]);
    }
    debouncedGetUser(e.target.value);
  };

  return (
    <div className="user-search-container">
      <h1>Github User Search</h1>
      <div className="input-container">
        <input
          type="text"
          value={searchText}
          onChange={(e) => handleOnChange(e)}
          placeholder="Search users by name"
        />
      </div>
      {rows?.length ? (
        <table {...getTableProps()} className="table-container">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  style={{ borderBottom: "1px solid black" }}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} style={{ padding: "10px" }}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        "No Data Available"
      )}
    </div>
  );
};

export default UserSearch;
