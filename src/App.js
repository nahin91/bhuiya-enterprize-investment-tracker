import { Fragment, useEffect, useState } from "react";

import {
  Box,
  Container,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  TextField,
  Button,
  InputAdornment,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const current = new Date();
const currentDate = `${
  current.getMonth() + 1
}/${current.getDate()}/${current.getFullYear()}`;

const defaultShipmentFields = {
  date: moment(currentDate).format("DD/MM/YYYY"),
  profit: 0,
  incentive: 0,
};

function App() {

  const [formValues, setFormValues] = useState(defaultShipmentFields);
  const [date, setDate] = useState(currentDate);
  const [shipments, setShipments] = useState([]);
  const [investment, setInvestment] = useState("");
  const [toast, setToast] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  const { vertical, horizontal, open } = toast;

  const handleClick = (newState) => () => {
    setToast({ open: true, ...newState });
  };

  const handleCloseSnack = () => {
    setToast({ ...toast, open: false });
  };

  const handleChange = (event) => {
    setInvestment(event.target.value);
  };

  useEffect(() => {
    console.log("sideEffect FormVal", formValues);
    console.log("sideEffect Shipment", shipments);
  }, [formValues, shipments]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const dateChangeHandler = (value) => {
    const formatedDate = moment(value).format("DD/MM/YYYY");
    console.log("value: ", formatedDate);
    setDate(value);
    setFormValues({
      ...formValues,
      date: formatedDate,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShipments([...shipments, formValues]);
    handleClick({
      vertical: "top",
      horizontal: "right",
    });
    console.log("inside submit: ", shipments);
  };

  const table = (
    <TableContainer component={Paper}>
      <Table sx={{}} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Profit</TableCell>
            <TableCell align="center">Incentive</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.map((shipment, idx) => (
            <TableRow
              key={idx}
              // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="shipment">
                {idx + 1}
              </TableCell>
              <TableCell align="center">{shipment.date}</TableCell>
              <TableCell align="center">{shipment.profit}</TableCell>
              <TableCell align="center">{shipment.incentive}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Fragment>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" gap={3} height="100vh">
          <Box>
            <Box display="flex" justifyContent="center" m={2.5}>
              <Typography variant="h5">Bhuiya Enterprise Investment</Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Investment
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={investment}
                    label="Investment"
                    onChange={handleChange}
                  >
                    <MenuItem value={4}>Italy (400k ৳)</MenuItem>
                    <MenuItem value={2}>Jeddah (200k ৳)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" flexDirection="column" gap={2} mt={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Shipment Date"
                    value={date}
                    maxDate={current}
                    inputFormat="MM/dd/yyyy"
                    onChange={dateChangeHandler}
                    renderInput={(params) => <TextField {...params} required />}
                  />
                </LocalizationProvider>

                {/* profit */}
                <FormControl fullWidth>
                  <InputLabel htmlFor="profit">Profit</InputLabel>
                  <OutlinedInput
                    id="profit"
                    name="profit"
                    type="number"
                    value={formValues.profit}
                    onChange={inputChangeHandler}
                    startAdornment={
                      <InputAdornment position="start">৳</InputAdornment>
                    }
                    label="Amount"
                  />
                </FormControl>

                {/* incentive */}
                <FormControl fullWidth>
                  <InputLabel htmlFor="incentive">Incentive</InputLabel>
                  <OutlinedInput
                    required
                    id="incentive"
                    name="incentive"
                    type="number"
                    value={formValues.incentive}
                    onChange={inputChangeHandler}
                    startAdornment={
                      <InputAdornment position="start">৳</InputAdornment>
                    }
                    label="Amount"
                  />
                </FormControl>

                <Button variant="contained" color="primary" type="submit">
                  Update
                </Button>
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={open}
                  onClose={handleCloseSnack}
                  message="successfully updated!"
                  key={vertical + horizontal}
                />
              </Box>
            </form>
          </Box>

          <Box>{table}</Box>

          {/* <Box>
            {shipments.map((shipment, index) => (
              <Box key={index}>
                <Typography>date: {shipment.date}</Typography>
                <Typography>profit: {shipment.profit}</Typography>
                <Typography>incentive: {shipment.incentive}</Typography>
              </Box>
            ))}
          </Box> */}
        </Box>
      </Container>
    </Fragment>
  );
}

export default App;
