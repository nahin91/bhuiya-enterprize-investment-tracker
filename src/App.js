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

import SHIPMENT_DATA from "./shipment_data";
import {
  addCollectionAndDocuments,
  getInvestmentAndDocuments,
  addShipmentInfo,
} from "./firebase";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

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
  const [investmentSelection, setInvestmentSelection] = useState("");
  const [investmentMap, setInvestmentMap] = useState({});
  const [totalPayable, setTotalPayable] = useState(0);
  const [toast, setToast] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  const { vertical, horizontal, open } = toast;

  // useEffect(() => {
  //   addCollectionAndDocuments("investmentMap", SHIPMENT_DATA);
  // }, []);

  useEffect(() => {
    const getInvestmentMap = async () => {
      const fetchedInvestmentMap = await getInvestmentAndDocuments();
      setInvestmentMap(fetchedInvestmentMap);
      setInvestmentSelection(Object.keys(fetchedInvestmentMap)[0]);
    };

    getInvestmentMap();
  }, []);

  useEffect(() => {
    setShipments(investmentMap[investmentSelection]?.shipments);
  }, [investmentSelection]);

  useEffect(() => {
    const subTotal = shipments?.reduce(
      (accumulator, currentItem) => {
        console.log('acc: ', accumulator)
        return accumulator + currentItem.incentive},
      0
    );
    setTotalPayable(subTotal);
  }, [shipments]);

  const handleClick = (newState) => () => {
    setToast({ open: true, ...newState });
  };

  const handleCloseSnack = () => {
    setToast({ ...toast, open: false });
  };

  const handleChange = (event) => {
    console.log("handleChange: ", event.target.value);
    setInvestmentSelection(event.target.value);
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: Number(value),
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
    addShipmentInfo(investmentSelection, {
      ...investmentMap[investmentSelection],
      shipments: shipments,
    });
  };

  const table = shipments ? (
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
            <TableRow key={idx}>
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
  ) : (
    <Typography variant="body1" sx={{ color: "gray" }}>
      {" "}
      select investment for shipment informations!{" "}
    </Typography>
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
                    value={investmentSelection}
                    label="Investment"
                    onChange={handleChange}
                  >
                    {Object.keys(investmentMap).map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
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

          <Box
            display="flex"
            justifyContent="space-between"
            bgcolor="#ffa95e"
            p={1}
          >
            <Typography variant="h5">Total Payable</Typography>
            <Typography variant="h5">{totalPayable || 0} ৳</Typography>
          </Box>

          <Box overflow="auto">{table}</Box>
        </Box>
      </Container>
    </Fragment>
  );
}

export default App;
