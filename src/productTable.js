import { React, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Button, Box } from '@mui/material';
import { Edit, Delete, Download, Add, Close } from '@mui/icons-material';
import productData from './productData.json'; 
import './productTable.css'
// var XLSX = require("xlsx");
var XlsxPopulate = require('xlsx-populate');

export default function BasicTable() {

  const [productsList, setProductsList] = useState(productData.products);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [colour, setColour] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [availability, setAvailability] = useState('');
  const [openCard, setOpenCard] = useState('');
  const [option, setOption] = useState('');
  const [productId, setProductId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit');

    if(option==='add'){
      console.log('add');
        const newProduct = {
            id: (productsList.length+1)+"",
            product_name: name,
            brand: brand,
            color: colour,
            price: parseFloat(price),
            rating: parseFloat(rating),
            availability: availability === 'true', 
        };

        setProductsList([...productsList, newProduct]);
    }
    else if(option==='edit'){
      productsList[productId-1].product_name=name;
      productsList[productId-1].brand=brand;
      productsList[productId-1].color=colour;
      productsList[productId-1].price=parseFloat(price);
      productsList[productId-1].rating=parseFloat(rating);
      productsList[productId-1].availability=availability;  
    }

    setOpenCard(false);
    setOption('');
    setName('');
    setBrand('');
    setColour('');
    setPrice('');
    setRating('');
    setAvailability('');
    setProductId('');
  }

  const handleEdit=(id)=>{
      setOpenCard(true); 
      setOption('edit'); 
      setProductId(id);
      setName(productsList[id-1].product_name);
      setBrand(productsList[id-1].brand);
      setColour(productsList[id-1].color);
      setPrice(productsList[id-1].price);
      setRating(productsList[id-1].rating);
      setAvailability(productsList[id-1].availability);
  }

  const handleDelete=(id)=>{
    const filterList=productsList.filter(product => product.id!==id);
    setProductsList(filterList);
  }

  const handleClose=()=>{
    setOpenCard(false);
    setOption('');
    setName('');
    setBrand('');
    setColour('');
    setPrice('');
    setRating('');
    setAvailability('');
    setProductId('');
  }

  // const handleDownload=()=>{
  //   const book= XLSX.utils.book_new();
  //   const sheet= XLSX.utils.json_to_sheet(productsList);
  //   XLSX.utils.book_append_sheet(book, sheet, "ProductSheet1");
  //   XLSX.writeFile(book, "ProductList.xlsx");
  // }


const handleDownload = () => {
  XlsxPopulate.fromBlankAsync()
    .then(workbook => {
      const sheet = workbook.sheet(0);
      sheet.name("ProductSheet1");

      // Add title
      sheet.cell("A1").value("My Products").style({
        bold: true,
        fontSize: 15,
        horizontalAlignment: "center",
        verticalAlignment: "center"
      });

      // Merge cells for title
      sheet.range("A1:G1").merged(true);

      // Add headers
      const headers = ["No.", "Product Name", "Brand", "Color", "Price", "Rating", "Availability"];
      headers.forEach((header, index) => {
        sheet.cell(2, index + 1).value(header).style({
          bold: true,
          fill: "ECECEC", 
          fontColor: "000000", 
          horizontalAlignment: "left",
          verticalAlignment: "center"
        });
      });

      // Add data
      productsList.forEach((product, rowIndex) => {
        const productIdAsNumber = Number(rowIndex+1);
        sheet.cell(rowIndex + 3, 1).value(productIdAsNumber).style({
          horizontalAlignment: "left",
          verticalAlignment: "center"
        });
        sheet.cell(rowIndex + 3, 2).value(product.product_name).style({
          horizontalAlignment: "left",
          verticalAlignment: "center"
        });
        sheet.cell(rowIndex + 3, 3).value(product.brand).style({
          horizontalAlignment: "left",
          verticalAlignment: "center"
        });
        sheet.cell(rowIndex + 3, 4).value(product.color).style({
          horizontalAlignment: "left",
          verticalAlignment: "center"
        });
        sheet.cell(rowIndex + 3, 5).value(product.price).style({
          horizontalAlignment: "left",
          verticalAlignment: "center"
        });
        sheet.cell(rowIndex + 3, 6).value(product.rating).style({
          horizontalAlignment: "left",
          verticalAlignment: "center"
        });
        sheet.cell(rowIndex + 3, 7).value(product.availability ? 'Available' : 'Not Available').style({
          horizontalAlignment: "left",
          verticalAlignment: "center"
        });
      });

      // Adjust column widths
      sheet.column("A").width(5);
      sheet.column("B").width(20);
      sheet.column("C").width(15);
      sheet.column("D").width(12);
      sheet.column("E").width(10);
      sheet.column("F").width(10);
      sheet.column("G").width(15);

      // Save workbook to file
      return workbook.outputAsync()
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'Product_list.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
    })
    .catch(err => {
      console.error("Error creating Excel file:", err);
    });
};


  return (
    <div className="product-table">
      <div className="table-header">
        <Button onClick={()=>{setOpenCard(true); setOption('add');}}>
            <Add sx={{paddingRight:'5px', fontSize:22}}/>
            <p>Add Product</p>
        </Button>
        <Button onClick={()=>handleDownload()}>
            <Download sx={{paddingRight:'5px', fontSize:20}}/>
            <p>Download</p>
        </Button>
      </div>
      <h2>Products</h2>
    <TableContainer component={Paper} sx={{marginTop:'10px'}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className='column'>
          <TableRow>
            <TableCell align="left" className='column-val'>No.</TableCell>
            <TableCell align="left" className='column-val'>Product Name</TableCell>
            <TableCell align="left" className='column-val'>Brand</TableCell>
            <TableCell align="left" className='column-val'>Color</TableCell>
            <TableCell align="left" className='column-val'>Price ($)</TableCell>
            <TableCell align="left" className='column-val'>Rating</TableCell>
            <TableCell align="left" className='column-val'>Availability</TableCell>
            <TableCell align="left" className='column-val'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productsList.map((product, index) => (
            <TableRow
              key={product.id} 
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{index+1}</TableCell>
              <TableCell align="left">{product.product_name}</TableCell>
              <TableCell align="left">{product.brand}</TableCell>
              <TableCell align="left">{product.color}</TableCell>
              <TableCell align="left">{product.price}</TableCell>
              <TableCell align="left">{product.rating}</TableCell>
              <TableCell align="left">{product.availability ? 'Available' : 'Not Available'}</TableCell>
              <TableCell align="left" sx={{margin:'5px'}}>
                <IconButton onClick={() =>{handleEdit(product.id);}}>
                  <Edit style={{ fontSize: 18 }} />
                </IconButton>
                <IconButton onClick={() => handleDelete(product.id)}>
                  <Delete style={{ fontSize: 18 }}/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {openCard && <Box
      component="form" onSubmit={handleSubmit} noValidate autoComplete="off"
      sx={{display:'flex', flexDirection:'column',  width: { xs: '90%', sm: '350px' }, boxShadow:'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', backgroundColor:"white",
        justifyContent:'center', alignItems:'center', padding:'20px', borderRadius:'10px', position:'absolute', top:'20%', left:'40%'
      }} >
    
    <div className="card-header">
        <div className="close-icon">
            <Close style={{ fontSize: 20 }} onClick={()=>{handleClose();}}/>
        </div>
        <h3 style={{color:'black'}}>Add Product</h3>
    </div>

    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
    <input id="brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand"/>
    <input id="colour" type="text" value={colour} onChange={(e) => setColour(e.target.value)} placeholder="Colour"/>
    <input id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price"/>
    <input id="rating" type="text" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating"/>
    <select id="availability" value={availability} onChange={(e) => setAvailability(e.target.value)}>
        <option style={{ color: 'gray' }}>Select Availability</option>
        <option value="true">Available</option>
        <option value="false">Not Available</option>
    </select>
    <Button type="submit" variant="contained" color="primary" sx={{marginTop:'10px', fontSize:"12px", width:"50px"}}>
    Submit
    </Button>
  </Box>}
</div>
  );
}
