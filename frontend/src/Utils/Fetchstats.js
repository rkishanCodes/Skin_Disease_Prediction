import axios from 'axios'
const fetchstats = async (doctorId) =>{
    try {
        const response = await axios.get(`http://localhost:8000/api/v1/doctor/${doctorId}/stats`)
        return response.data
    }
    catch(err){
        console.log(err)
        return err
    }
}

export default fetchstats