// Class to standardize API responses across the application
class ApiResponce{
    constructor(statusCode,data, message= "Success" ){
        this.statusCode = statusCode;//HTTP status code
        this.message = message;//Response message 
        this.data = data;//Response data payload 
        this.success =statusCode<300; //true if status code is less than 300 

    }}        