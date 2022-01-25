/*
  NOT EDIT YET
*/

import { useEffect,useState } from "react";
import DefaultLayout  from "@/layouts/default";
import axiosClient  from "@/librarys/axiosClient";
import { ToastError,ToastSuccess } from "@/librarys/toaster"
import { Formik,Form,Field, ErrorMessage,useFormik } from 'formik';
import * as Yup from 'yup';

const Category = () => {
  const [products,setProducts] = useState([]);

  const [params,setParams] = useState({
  	search : '',
  	per_page : 5, 
  })

  const [loadings,setLoadings] = useState({
    isDelete : false,
  })
  
  const [showForm,setShowForm] = useState(false);

  const { values, errors, handleChange, setFieldValue,setValues } = useFormik({
    initialValues: {
      _id : 0,
      title : '',
      price : 0,
      photo : '',
      stock : 0,
      description : '',
      isEditable : false,      
    }
  });

  useEffect(() => {
  	onLoad();
  },[]);

  const onNext = () => {    	
  	setParams({
  		...params,
  		per_page : params.per_page + 10 
  	});

   	onLoad();
  }

  const onLoad = async () => {
  	try{
  	 let { data }  = await axiosClient.get("/product",{ 
  	 	params 
  	 });        

  	 setProducts([...data]);
  	}catch(err){
   	  console.log(err)
      ToastError(err)     
  	}
  }

  const onSearch = (event) => {
    setParams({     
      search : event.target.value,
      per_page : 5
    })

    if(event.key == 'Enter'){
      onLoad();
    }
  }

  const onDelete = async (item) => {
    try{
   	  if(loadings.isDelete) return;

      setLoadings({
        ...loadings,
        isDelete : true
      })

      await axiosClient.delete("/product/"+item._id)

      ToastSuccess("Berhasil menghapus data")

      onLoad();
    }catch(err){    
      console.log(err)
      ToastError(err)     
    }finally{
      setLoadings({
        ...loadings,
        isDelete : false
      })
    }
  }
   
  const onResetForm = () => {
    setValues({
        _id : 0,
        title : '',
        price : 0,
      	photo : '',
      	stock : 0,
      	description : '',
      	isEditable : false,
    })    
  }

  const onSubmit = async (values,{setSubmitting }) => {      
    try{  
      let formData = new FormData(document.getElementById("form-product"))            

      if(values.isEditable){
        await axiosClient.put("/product/"+values._id,formData)
      }else{
        await axiosClient.post("/product",formData);
      }

      ToastSuccess(`Berhasil ${values.isEditable ? 'Edit' : 'Tambah'} Data`)

      setShowForm(false)  

      onLoad();

      onResetForm()
    }catch(err){                 
      console.log(err)
      ToastError(err)                              
    }finally{
      setSubmitting(false)
    }  
  }
   
  const onAdd = async () => {  
  	setShowForm(true)   

    setValues({
      ...values,       
    });
  }

  const onEdit = (item) => {
    setShowForm(true)

    setValues({         
      ...item,
      isEditable : true
    })
  }

  const onChangePhoto = (evt) => {
    if(!evt.target.files[0]){
        return false;
    } 

    if(!['image/jpeg','image/jpg','image/png'].includes(evt.target.files[0].type)){
        evt.target.value = "";              
        return false;
    }  
  }

  return (
    <DefaultLayout>
      <h1>Product</h1>

      {showForm && <div>
        Add/Edit 
        <Formik
          initialValues={values}
          enableReinitialize={true}        
          validationSchema={() => Yup.lazy((values) => {          
            return Yup.object()
            .shape({            
              title : Yup.string().required("Reuqired"),             
              price : Yup.number().required("Required"),
              stock : Yup.number().required("Required"),            
            });    
          })}
          onSubmit={onSubmit}>        
          {({isSubmitting}) => (          
            <Form id="form-product">             
              <label>Judul</label>
              <Field  type="text" name="title"/>
              <ErrorMessage  
                name="title" 
                component="div" />
              <br/>

              <label>Price</label>
              <Field type="text" name="price"/>
              <ErrorMessage  
                name="price" 
                component="div" />
              <br/>

              <label>Stock</label>
              <Field type="text" name="stock"/>
              <ErrorMessage  
                name="stock" 
                component="div" />
              <br/>          
                          
              <label>Deskripsi</label>
              <Field as="textarea" name="description"/>
              <ErrorMessage  
                name="description" 
                component="div" />
              <br/>

              <label>Photo</label>
              <input type="file" name="photo" onChange={onChangePhoto}/>             
            
              <div>
                  <button 
                      type="submit" 
                      disabled={isSubmitting}>
                      { isSubmitting ? '...' : 'Submit' }
                  </button>
                  <button type="reset"
                      onClick={ onResetForm }>
                      Reset
                  </button>
              </div>
            </Form>
          )}
        </Formik>
        <br/>
      </div> }         

      <div>
        { !showForm && (
        	<div>
            	<button onClick={ onAdd }>Tambah</button>
        	</div>
        ) }

        <div>
          Searching 
          <input type="text" onKeyUp={ onSearch }/>
        </div>

        <table>
          <thead>
          <tr>
            <td>Gambar</td>
            <td>Nama</td>
            <td>Harga</td>
            <td>Stock</td>            
            <td>Opsi</td>
          </tr>
          </thead>
          <tbody>
          { products.map(item => (
            <tr key={ item._id }>
              <td>
                <img src={
                	item.photo 
                		? process.env.NEXT_PUBLIC_API_ASSET_URL + "products/" + item.photo 
                		: process.env.NEXT_PUBLIC_API_ASSET_URL + "products/default.png"
                	}
                  width="100px"/></td>
              <td>{item.title}</td>
              <td>{item.price}</td>
              <td>{item.stock}</td>
              <td>
                <button onClick={() => onEdit(item)}>
                	Edit
                </button>
                <button onClick={() => onDelete(item)}>
                  { loadings.isDelete ? '...' : 'Delete' }
                </button>
              </td>
            </tr>
          ))}

          { !products.length && (
            <tr>
              <td colSpan="3">
                Data tidak ditemukan
              </td>
            </tr>
          ) }
          </tbody>
        </table>

      
      	<button onClick={onNext}>
          Selanjutnya
        </button> 
      </div>     
    </DefaultLayout>
  )
}

export default Category;