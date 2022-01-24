import { toast } from 'react-toastify';

const options = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: true,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: true,
	theme : 'colored'
};

export function ToastSuccess(message){
	toast.success(message,options)     
}

export function ToastError(err,setErrors = (errors) => {}){	
	if(err.response && err.response.status === 422){
		toast.error(err.response.data.message || 'Terjadi Kesalahan',options);
	}else if(err.response && err.response.status === 500){
		toast.error(err.response.data.message || 'Terjadi Kesalahan',options);
	}else if(err.response && err.response.status === 503){
		toast.error("Maintenance",options);
	}else{                    
		toast.error("Terjadi Kesalahan",options)     
	}
}
