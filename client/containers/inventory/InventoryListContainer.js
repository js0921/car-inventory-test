import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import SweetAlert from "react-bootstrap-sweetalert";
import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';

// custom component
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Card from "../components/Card/Card.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardBody from "../components/Card/CardBody.js";
import ReactTable from "../components/ReactTable/ReactTable.js";
import stylesAlert from "../assets/sweetAlertStyle.js";
import { API_URL } from '../../config/config';

// material ui component
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
   ...stylesAlert,
   root: {
		margin: "70px 5px 50px",
      background: 'transparent',
		[theme.breakpoints.down('xs')]: {
			marginBottom: '0px'
		},
   },
   gridContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      margin: '0px !important'
   },
   customHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between !important'
   },
   formControl: {
      margin: theme.spacing(1),
      minWidth: '80%',
      zIndex: '10000',
      marginTop: '20px'
   },
   textField: {
      width: '80%',
      margin: '20px 0px',
   },
   actionCenter: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
   },
   actionDelBtn: {
      minWidth: 0,
      padding: 5,
      marginLeft: 10,
      background: '#f44336',
      color: 'white',
      '&:hover': {
         color: '#f44336',
         background: 'white',
      }
   },
   actionEditBtn: {
      minWidth: 0,
      background: '#3f51b5',
      color: 'white',
      '&:hover': {
         color: '#3f51b5',
         background: 'white',
      }
   },
   link: {
      textDecoration: 'underline',
      color: 'blue',
      fontWeight: '200',
   },
}))


const InventoryListContainer = () => {
   const classes = useStyles();
   const { addToast } = useToasts();
   
   const [showModal, setShowModal] = useState(false);
   const [showDelModal, setShowDelModal] = useState(false);
   
   const [carId, setCarId] = useState(null);
   const [carName, setCarName] = useState('');
   const [carModel, setCarModel] = useState('');
   const [carPrice, setCarPrice] = useState('');
   const [carSku, setCarSku] = useState('');

   const [carList, setCarList] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      getCarList();
   }, [])

   const alertToast = (type, content) => {
      addToast(content, {
        appearance: type,
        autoDismiss: true,
      });
   };
   const handleShowModal = () => {
      setShowModal(true);
      emptyModal();
   }
   const handleCancel = () => {
      setShowModal(false);
      emptyModal();
   }
   const handleDelCancel = () => {
      setShowDelModal(false);
   }
   const emptyModal = () => {
      setCarName('');
      setCarModel('');
      setCarPrice('');
      setCarSku('');
   }

   const getCarList = () => {
      setIsLoading(true);
      axios
         .get(`${API_URL}/inventory/get`)
         .then((res) => {
            if(res.data.success) {
               setCarList(res.data.data);
            } else {
               alertToast('warning', 'Something went wrong!');
               setCarList([]);
            }
            setIsLoading(false);
         })
   }
   const handleCreateCar = () => {
      if(carName && carModel && carPrice && carSku) {
         axios
         .post(`${API_URL}/inventory/create`, { 
            name: carName,
            model: carModel,
            price: carPrice,
            sku: carSku 
         }).then((res) => {
            setShowModal(false);
            if (res.data.success) {
               alertToast('success', 'New Car Profile created!');
               getCarList();
            } else {
               alertToast('warning', 'Something went wrong!');
            }
         });
      } else {
         alertToast('warning', 'Please confirm all input fields!');
      }
   }
   const handleDelete = () => {
      axios
         .post(`${API_URL}/inventory/delete`, { carId })
         .then((res) => {
            setShowDelModal(false);
            if (res.data.success) {
               alertToast('success', 'Car profile delete success!');
               getCarList();
            } else {
               alertToast('warning', 'Something went wrong!');
            }
         });
   }

   let list = [];
   if(carList.length) {
      list = carList.map((car, index) => {
         return {
            id: index + 1,
            carId: car.id,
            name: car.name,
            model: car.model,
            price: '$ ' + car.price,
            sku: car.sku,
            createdAt: moment(car.created_at).format('MM/DD/YYYY'),
            actions: (<div className={classes.actionCenter}>
               <Button
                  variant="contained"
                  className={classes.actionDelBtn}
                  onClick={() => {
                     setShowDelModal(true);
                     setCarId(car.id);
                  }}
               >
                  <DeleteIcon />
               </Button>
            </div>)
         }
      })
   }
   return (
      <div className={classes.root}>
         <GridContainer className={classes.gridContainer}>
            <GridItem xs={12} sm={12} md={12} lg={10} xl={8}>
               <Button
                  variant="contained"
                  className={classes.actionEditBtn}
                  component={Link}
                  to={`/sale`}
               >
                  Go to the sale page
               </Button>
               <Card>
                  <CardHeader className={classes.customHeader}>
                     <h3>Car Inventory List</h3>
                     <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleShowModal}
                     >
                        Create New Car Profile
                     </Button>
                  </CardHeader>
                  <CardBody>
                     <ReactTable
                        columns={[
                           {
                              Header: 'carId',
                              accessor: 'carId'
                           },
                           {
                              Header: "No",
                              accessor: "id",
                              width: '5%'
                           },
                           {
                              Header: "Name",
                              accessor: "name",
                              width: '25%'
                           },
                           {
                              Header: "Model",
                              accessor: "model",
                              width: '15%'
                           },
                           {
                              Header: "Price",
                              accessor: "price",
                              width: '15%'
                           },
                           {
                              Header: "SKU",
                              accessor: "sku",
                              width: '15%'
                           },
                           {
                              Header: "Date Created",
                              accessor: "createdAt",
                              width: '10%'
                           },
                           {
                              Header: "Actions",
                              accessor: "actions",
                              width: '15%'
                           }
                        ]}
                        data={list}
                        isLoading={isLoading}
                        isAdminTable={true}
                     />
                  </CardBody>
               </Card>
            </GridItem>
         </GridContainer>
         <SweetAlert
            custom
            show={showModal}
            title="Create New Car"
            style={{display: 'block', marginTop: '-100px', zIndex: '1200'}}
            onConfirm={handleCreateCar}
            onCancel={handleCancel}
            confirmBtnCssClass={classes.button + " " + classes.success}
            cancelBtnCssClass={classes.button + " " + classes.danger}
            confirmBtnText="Create"
            cancelBtnText="Cancel"
            showCancel
            closeOnClickOutside={false}
         >
            <TextField
               id="name"
               label="Car Name"
               value={carName}
               variant="outlined"
               className={classes.textField}
               InputProps={{
                  className: classes.input
               }}
               onChange={event => {
                  setCarName(event.target.value);
               }}
            />
            <TextField
               id="name1"
               label="Car Model"
               value={carModel}
               variant="outlined"
               className={classes.textField}
               InputProps={{
                  className: classes.input
               }}
               onChange={event => {
                  setCarModel(event.target.value);
               }}
            />
            <TextField
               id="name2"
               label="Car Price"
               value={carPrice}
               variant="outlined"
               className={classes.textField}
               InputProps={{
                  className: classes.input
               }}
               onChange={event => {
                  setCarPrice(event.target.value);
               }}
            />
            <TextField
               id="name3"
               label="Car SKU"
               value={carSku}
               variant="outlined"
               className={classes.textField}
               InputProps={{
                  className: classes.input
               }}
               onChange={event => {
                  setCarSku(event.target.value);
               }}
            />
         </SweetAlert>
         <SweetAlert
            danger
            show={showDelModal}
            style={{ display: "block", marginTop: "-100px" }}
            title="Are you sure remove?"
            onConfirm={handleDelete}
            onCancel={handleDelCancel}
            confirmBtnCssClass={classes.button + " " + classes.success}
            cancelBtnCssClass={classes.button + " " + classes.danger}
            confirmBtnText="Delete"
            cancelBtnText="Cancel"
            showCancel
            closeOnClickOutside={false}
         />
      </div>
   )
}

/**
 * Map the state to props.
 */
 const mapStateToProps = (state) => ({
 });
 
 /**
  * Map the actions to props.
  */
 const mapDispatchToProps = (dispatch) => ({
 });

export default connect(mapStateToProps, mapDispatchToProps)(InventoryListContainer);