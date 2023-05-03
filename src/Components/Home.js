import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import "../Home.css";

function createData(rank, username, points) {
  return { rank, username, points };
}

const mostPoints = async () => {
  const response = await fetch("http://localhost:4000/mostPoints", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  const rows = [];
  for (let i = 0; i < data.length; i++) {
    rows.push(createData(i, data[i].username, data[i].points));
  }
  return rows;
};

const SERVER_BASE_URL = "http://localhost:4000/";
const IMAGE_PATH = `${SERVER_BASE_URL}uploads/images`;
const THUMB_PATH = `${SERVER_BASE_URL}uploads/thumbs`;

function getUserProfilePicture(user) {
  let image = null;

  if (user.thumb) {
    image = `${THUMB_PATH}/${user.thumb}`;
    return image;
  }

  if (user.image) {
    image = `${IMAGE_PATH}/${user.image}`;
    return image;
  }

  return image;
}

export default function Home() {
  let token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const rows = await mostPoints();
      setRows(rows);
    }
    fetchData();
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  if (token) {
    return (
      <div>
        <br />
        <br />
        <div className="user">
          <Avatar
            alt="user profile picture"
            src={getUserProfilePicture(user)}
            sx={{ width: 50, height: 50 }}
          />
          <Typography variant="h4"> Hello, {user.username}!</Typography>
        </div>
        <br />
        <Typography variant="h4" style={{ textAlign: "center" }}>
          Your points:
        </Typography>
        <br />
        <br />
        <div className="table">
          <h2>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              Top 10 users with most points
            </Typography>
          </h2>

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="points rank table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>rank</TableCell>
                  <TableCell>username</TableCell>
                  <TableCell>points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.rank}
                    </TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/auth/login" />;
  }
}
