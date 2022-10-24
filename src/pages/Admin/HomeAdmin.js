import {useNavigate} from "react-router-dom";
import './Admin.css';
import doctor from '../../images/doctor.png'
import edit from '../../images/editVal.png'


export default function HomeAdmin() {
    const navigate = useNavigate();



    const handleClick = (e) => {
        console.log(e.target.name)
        if(e.target.name === "editBtn") {
            navigate("/normalVal")

            return
        }
        navigate("/addDoctor")
    }

    return (
        <div>
            <h1>Welcome back Admin</h1>
            <h2>What do you want to do?</h2>

            <button name="editBtn" className="buttonHome" role="button" onClick={handleClick}><img className="imgButton" src={edit}/><br/>Edit normal Values</button>
            <button name="doctorBtn" className="buttonHome" role="button" onClick={handleClick}><img className="imgButton" src={doctor}/><br/>Create a new Doctor</button>
        </div>
    )
}