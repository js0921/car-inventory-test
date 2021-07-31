import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import SweetAlert from "react-bootstrap-sweetalert";
import { useToasts } from 'react-toast-notifications';

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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
   instock: {
      color: 'green',
      fontWeight: 'bold'
   },
   outstock: {
      color: 'red',
      fontWeight: 'bold'
   },
   saveBtn: {
      marginRight: 10
   }
}))

const saleTypes = [
   {title: 'In', value: 1},
   {title: 'Out', value: 2}
]
const SaleContainer = () => {
   const classes = useStyles();
   const history = useHistory();
   const { addToast } = useToasts();
   
   const [showModal, setShowModal] = useState(false);
   const [showDelModal, setShowDelModal] = useState(false);
   const [openDrop, setOpenDrop] = useState(false);
   const [openDropType, setOpenDropType] = useState(false);
   const [selectCar, setSelectCar] = useState(null);
   const [type, setType] = useState(1);

   const [saleId, setSaleId] = useState(null);
   const [amount, setAmount] = useState(0);
   const [description, setDescription] = useState('');

   const [saleList, setSaleList] = useState([]);
   const [carList, setCarList] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      getSaleList();
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
      setDescription('');
      setAmount('');
      setType(1);
      setSelectCar('');
   }

   const getSaleList = () => {
      setIsLoading(true);
      axios
         .get(`${API_URL}/inventory/sale/get`)
         .then((res) => {
            if(res.data.success) {
               setSaleList(res.data.data);
            } else {
               alertToast('warning', 'Something went wrong!');
               setSaleList([]);
            }
            setIsLoading(false);
         })
   }
   const getCarList = () => {
      axios
         .get(`${API_URL}/inventory/get`)
         .then((res) => {
            if(res.data.success) {
               setCarList(res.data.data);
            } else {
               alertToast('warning', 'Something went wrong!');
               setCarList([]);
            }
         })
   }
   const handleCreateCar = () => {
      if(selectCar) {
         axios
         .post(`${API_URL}/inventory/sale/create`, { 
            amount,
            description,
            car_id: selectCar,
            type_out: type,
         }).then((res) => {
            setShowModal(false);
            if (res.data.success) {
               alertToast('success', 'New Car Profile created!');
               getSaleList();
            } else {
               alertToast('warning', 'Something went wrong!');
            }
         });
      } else {
         alertToast('warning', 'Please select the car!');
      }
   }
   const handleDelete = () => {
      axios
         .post(`${API_URL}/inventory/sale/delete`, { saleId })
         .then((res) => {
            setShowDelModal(false);
            if (res.data.success) {
               alertToast('success', 'Car profile delete success!');
               getSaleList();
            } else {
               alertToast('warning', 'Something went wrong!');
            }
         });
   }

   let list = [];
   if(saleList.length) {
      list = saleList.map((sale, index) => {

         return {
            id: index + 1,
            saleId: sale.id,
            carName: sale.carName,
            amount: sale.amount,
            type: (
               <div>
                  {
                     sale.type == '1' ?
                     <span className={classes.instock}>In</span> :
                     <span className={classes.outstock}>Out</span>
                  }
               </div>
            ),
            description: sale.description,
            createdAt: moment(sale.created_at).format('MM/DD/YYYY'),
            actions: (<div className={classes.actionCenter}>
               <Button
                  variant="contained"
                  className={classes.actionDelBtn}
                  onClick={() => {
                     setShowDelModal(true);
                     setSaleId(sale.id);
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
               <Card>
                  <CardHeader className={classes.customHeader}>
                     <h3>Sales List</h3>
                     <div>
                        <Button
                           variant="contained"
                           className={classes.saveBtn}
                           onClick={() => {
                              history.goBack();
                           }}
                        > BACK </Button>
                        <Button
                           variant="contained"
                           startIcon={<AddIcon />}
                           onClick={handleShowModal}
                        >
                           Add Sales
                        </Button>
                     </div>
                  </CardHeader>
                  <CardBody>
                     <ReactTable
                        columns={[
                           {
                              Header: 'saleId',
                              accessor: 'saleId'
                           },
                           {
                              Header: "No",
                              accessor: "id",
                              width: '5%'
                           },
                           {
                              Header: "Car Name",
                              accessor: "carName",
                              width: '10%'
                           },
                           {
                              Header: "Amount",
                              accessor: "amount",
                              width: '15%'
                           },
                           {
                              Header: "In/Out Stock",
                              accessor: "type",
                              width: '15%'
                           },
                           {
                              Header: "Description",
                              accessor: "description",
                              width: '30%'
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
            <FormControl variant="outlined" className={classes.formControl}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectCar ? selectCar : ''}
                  open={openDrop}
                  onOpen={() => setOpenDrop(true)}
                  onClose={() => setOpenDrop(false)}
                  onChange={(event) => {
                     setSelectCar(event.target.value);
                  }}
               >
                  {carList.length && carList.map((type, index) => {
                     return (
                        <MenuItem key={index} value={type.id}>
                           {type.name}
                        </MenuItem>
                  )})}
               </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
               <Select
                  labelId="demo-simple-select-label-1"
                  id="demo-simple-select-1"
                  value={type}
                  open={openDropType}
                  onOpen={() => setOpenDropType(true)}
                  onClose={() => setOpenDropType(false)}
                  onChange={(event) => {
                     setType(event.target.value);
                  }}
               >
                  {saleTypes.map((type, index) => {
                     return (
                        <MenuItem key={index} value={type.value}>
                           {type.title}
                        </MenuItem>
                  )})}
               </Select>
            </FormControl>
            <TextField
               id="name"
               label="Amount"
               type="number"
               value={amount}
               variant="outlined"
               className={classes.textField}
               InputProps={{
                  className: classes.input
               }}
               onChange={event => {
                  setAmount(event.target.value);
               }}
            />
            <TextField
               id="name1"
               label="Description"
               value={description}
               multiline
               rows={4}
               variant="outlined"
               className={classes.textField}
               InputProps={{
                  className: classes.input
               }}
               onChange={event => {
                  setDescription(event.target.value);
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

export default connect(mapStateToProps, mapDispatchToProps)(SaleContainer);