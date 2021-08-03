import { useEffect, useState } from "react";
import Axios from 'axios';
import { firebaseDB } from "../firebase/firebase.utils";
import {connect} from 'react-redux';

// import VinHistory from './vin.history';
import { Container, Row ,Col, Card} from "react-bootstrap";


function VinDecoder(props){

    const [VIN,setVIN] = useState('');
    const [YearOfManuf,setYearOfManuf] = useState(0);
    const [apiURL,setapiURL] = useState('');
    const [urlComputed,seturlComputed]=useState(false);
    const [VINData,setVINData]=useState();
    const [errorMsg,seterrorMsg]=useState('Please Enter the Details and Click the Button');
    const [VinDataObj,setVINDataObj]=useState();
    const [Values,setValues] = useState();
    const [isFetching,setisFetching] = useState(true);

    

    // 5UXWX7C5*BA?format=json&modelyear=2011
    const apiUrlCompute=()=>{
        let baseURL=`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/`
        let newURL=''
        if (VIN===''){
            seterrorMsg("Dont Leave the VIN number empty");
        }
        else{
            newURL=baseURL+`${VIN}?format=json`
        }

        if (YearOfManuf>2000){
            newURL=newURL+`&modelyear=${YearOfManuf}`
        }

       
        setapiURL(newURL);
        seturlComputed(true);
    }

    const createRow=()=>{

        // console.log("entered add to db");
                    
        firebaseDB.child(`${props.username}`).push(
            VinDataObj,
            err=>{
                console.log(err);
            }
        )
    }

    useEffect(()=>{
        if((props.username) && (isFetching)){
            // console.log('select function called - useEffect');
            const DB_Query=firebaseDB.child(`${props.username}`).orderByChild('timestamp').limitToLast(10);
            DB_Query.on('value',snapshot=>{
                if (snapshot.val()!==null) {
                    setValues({
                        ...snapshot.val()
                    })                
                }
            })
            // console.log(Values);
            // console.log('select function ended - useEffect');
            setisFetching(false)
        }
    },[props.username,isFetching]);


    useEffect(()=>{
        if(VINData){
            let VinDataObj={}
            VinDataObj['VIN']=VIN;
            let timestamp={".sv":"timestamp"};
            VinDataObj["timestamp"]=timestamp
            // "server_timestamp":{  
            //     ".sv":"timestamp"
            //  },

            for (let index = 0; index < VINData.length; index++) {
                const element = VINData[index];
                VinDataObj[element[0]]=element[1];
                
            }
    
            console.log(VinDataObj);
            setVINDataObj(VinDataObj);
    
        createRow();
        // selectRow();
        setisFetching(true);
        }
    },VINData)

    useEffect(()=>{
    
       if (urlComputed){ 

        Axios.get(apiURL)
        .then((res)=>{
            
            let vehicleData=[]
            
            const apiData=res.data.Results;
            
            apiData.forEach((item)=>{
                
                if (item.Variable==="Make" || item.Variable==="Manufacturer Name" || item.Variable==="Model" || item.Variable==="Model Year"){
                    let temp=[]
                    let key=item.Variable.replace(" ", "_");

                    temp.push(key);
                    temp.push(item.Value);
                    vehicleData.push(temp);
                    
                }
            });
            
            
            setVINData(vehicleData);
            // add2DB();
            seturlComputed(false);
            

        }).catch((err)=>{
            console.log(err);
            seterrorMsg("Ensure if the entered details are Correct & Try Again.")
        }
        )

}
    },[apiURL]);

    return (
        <Container>

            <Row><br/></Row>
            <Row><br/></Row>
            <Row><br/></Row>
        <Row>
            
            <Col md={6}>
                <Card>
            <Card.Title><h4 color='warning'>Welcome Back {props.username}...!!</h4></Card.Title>
            <input onChange={(e)=>setVIN(e.target.value)} type='text' placeholder='enter VIN number'/><br/><br/>
            <input onChange={(e)=>setYearOfManuf(e.target.value)} type='number' min='1999' max='2020' placeholder='enter manufactured year'/><br/>
            <button onClick={apiUrlCompute}>Get Data</button>
        
            {
                VINData
                ?
                VINData.map((item,key)=>{
                    return(
                        <div key={key}>{item[0]} : {item[1]}</div>
                    )})
                :
                <div><h4 color='primary'>{errorMsg}</h4></div>
            }
            </Card>
        </Col>
        <Col md={6}>
        <Card>
        <table className='table table-borderless table-stripped'>
                <thead className='thead-light'>
                    <tr>
                        <th>Vehicle Identification Number</th>
                        <th>Make</th>
                        <th>Manufacuturer</th>
                        <th>Model</th>
                        <th>Model Year</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Values
                        ?
                        Object.keys(Values).map(id=>{
                            return <tr key={id}>
                                <td>{Values[id].VIN}</td>
                                <td>{Values[id].Make?Values[id].Make:"N/A"}</td>
                                <td>{Values[id].Manufacturer_Name?Values[id].Manufacturer_Name:"N/A"}</td>
                                <td>{Values[id].Model?Values[id].Model:"N/A"}</td>
                                <td>{Values[id].Model_Year?Values[id].Model_Year:"N/A"}</td>
                            </tr>
                        })
                        :
                        null
                    }
                </tbody>
            </table>
        </Card>
        </Col>
        
        </Row>
        </Container>
    )
  
}

const mapStateToProps=state=>({
    username:state.user.currentUser.username
})


export default connect(mapStateToProps)(VinDecoder);
