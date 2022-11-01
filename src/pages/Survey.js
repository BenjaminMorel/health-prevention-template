import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeConsumer } from "styled-components";
import {doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

import {auth, db} from "../initFirebase";
import "../Survey.css"
import { collection, addDoc } from "firebase/firestore"; 
import Avatar from "../components/Avatar";
import swal from "sweetalert";

const type = {
    numeric: 0,
    boolean: 1,
    sex: 2,
    sport: 3,
    alcohol: 4,
    alim: 5,

}




export default function Survey() {

    const idUser = auth.currentUser.uid;



    const [survey, setSurvey] = useState({ sex: 0, age: 40, weight: 80, height: 180, systolic: true, chol: 3.5, glyc: 3.5, hdl: 1.9, diabete: 0, infarctus: 1, afInfarctus: 1, afCancer: 1, smoke: 1, alim: 3, alcohol: 2, physical: 3},[]);

    useEffect(() => {
        
        getMyDoc(idUser).then(response => setSurvey({...response}) );
        

    }, []);
    
    var onInputChange = (event) => {
        setSurvey({ ...survey, [event.target.name]: parseInt(event.target.value) });
        console.log(survey);

    };

    var onClickButton = async (event)=>{
        var idUser = null
        try{
            idUser = auth.currentUser.uid;

        }
        catch(error){
            idUser = null;
        }
        let date  = new Date();
        
        console.log("survey:");
        console.log(survey);
        var surveyUser = {userID: idUser  , date : date, ...survey};
        const docRef = await addDoc(collection(db, "questionnaires"), surveyUser);
        console.log("surveyUser:");

        console.log(surveyUser);
        console.log("document added");
          console.log("Document written with ID: ", docRef.id);

         // Add success pop up
        swal("We receive your infos!", "Thanks for completing the survey, please have a look at your result"
            , "success");

          /* db.collection('questionnaires')
        .add(survey)
        .then(() => {
            console.log('Survey added successfully!');
        }); */
    }







    const questYouList = [
        { text: "what is your sex?", var: "sex", type: type.sex },
        { text: "how old are you?", var: "age", type: type.numeric },
        { text: "how much do you weight?", var: "weight", type: type.numeric },
        { text: "how tall are you?", var: "height", type: type.numeric },
        { text: "are you known for high blood pressure ?", var: "systolic", type: type.boolean },
        { text: "are you known for high cholesterol ?", var: "chol", type: type.boolean },
        { text: "are you diabetic ?", var: "diabete", type: type.boolean },
        { text: "have you ever had an infarctus ?", var: "infarctus", type: type.boolean },
        //{ text: "have you ever had a cerebral attack ?", var: "AVC", type: type.boolean },
    ];

    const questFamilyList = [

        { text: "has one of your parent ever had an infarctus (dad before 55 and mom before 65?)", var: "afInfarctus", type: type.boolean },
        { text: "do you have a close relative who had cancer", var: "afCancer", type: type.boolean },
    ];

    const questHabitsList = [
        { text: "have you ever smoked regularly? ", var: "smoke", type: type.boolean },
        { text: "how often do you eat fruits, olive oil, nuts, fat fishes, less meat, less cream, less charcute  ", var: "alim", type: type.alim },
        { text: "my physical activ is :", var: "physical", type: type.sport },
        { text: "my alcohol consumption is :", var: "alcohol", type: type.alcohol },

    ];


    return (

        <div className="survey">
            <table className="table">
                <tr><td colspan="2"><h2>Questions about you</h2></td></tr>
                <tr><td><br></br></td></tr>
                {questYouList.map(question => <Question question={question} onInputChange={onInputChange} survey={survey}/>)}
                <tr><td><br></br></td></tr>

                <tr><td colspan="2"><h2>Questions about your family</h2></td></tr>
                <tr><td><br></br></td></tr>

                {questFamilyList.map(question => <Question question={question} onInputChange={onInputChange} survey={survey} />)}
                <tr><td><br></br></td></tr>

                <tr><td colspan="2"><h2>Questions about your habits</h2></td></tr>
                <tr><td><br></br></td></tr>

                {questHabitsList.map(question => <Question question={question} onInputChange={onInputChange} survey={survey}/>)}
            </table>

            
            <br/>
            


            <Link to="/results" state={{ infos: survey }} >
                <button onClick={onClickButton}>calculate results</button>
            </Link>


        </div>


    );
}

async function getMyDoc(idUser) {
    const myQuery = query(collection(db, "questionnaires"), where("userID", "==", idUser));

    let latestseconds = 0;
    let resultData  = null;
    const querySnapshot = await getDocs(myQuery);

    querySnapshot.forEach((doc) => {
        let data =  doc.data();
        console.log(data.date.seconds);
        if(data.date.seconds>latestseconds)
        {
            latestseconds = data.date.seconds;
            resultData = data;
        }
        

    });
    if(resultData === null)
    {
        resultData ={ sex: 0, age: 40, weight: 80, height: 180, systolic: true, chol: 3.5, glyc: 3.5, hdl: 1.9, diabete: 0, infarctus: 1, afInfarctus: 1, afCancer: 1, smoke: 1, alim: 3, alcohol: 2, physical: 3};

    }
    console.log("my latest Element");
    console.log(resultData);
    return resultData;
}




function Question({question ,onInputChange,survey})
{
    let value = survey[question.var];
    return (

        <tr className="row-question">
            <td className="column-table">
                {question.text}
            </td>
            <td>
                <Answer id={question.var} typeAnswer={question.type} inputChange={onInputChange} value={value} />
            </td>
        </tr>


    );
}



function Answer({ id, typeAnswer, inputChange ,value}) {
    switch (typeAnswer) {
        case type.numeric:
            return (<input onChange={inputChange} id={id} name={id} type="number" value={value}></input>);
            break;
        case type.boolean:
            return (
                <select name={id} id={id} onChange={inputChange} value={value}>
                    <option value="none" selected disabled hidden>Select an Option</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>

                </select>);
            break;
        case type.sex:
            return (
                <select name={id} id={id} onChange={inputChange} value={value}>
                    <option value="none" selected disabled hidden>Select an Option</option>
                    <option value="0">Female</option>
                    <option value="1">Male</option>

                </select>);
            break;
        case type.sport:
            return (
                <select name={id} id={id} onChange={inputChange} value={value}>
                    <option value="none" selected disabled hidden>Select an Option</option>
                    <option value="0">i don't move a lot</option>
                    <option value="1">half an hour 2-3 days a week</option>
                    <option value="2">half an hour 5 days a week</option>
                    <option value="3">more than 2 hours a week</option>

                </select>);
            break;
        case type.alcohol:
            return (
                <select name={id} id={id} onChange={inputChange} value={value}>
                    <option value="none" selected disabled hidden>Select an Option</option>
                    <option value="0">every day</option>
                    <option value="1">3 to 6 days a week</option>
                    <option value="2">1 to 2 days a week</option>
                    <option value="3">less than once a week</option>
                    <option value="4">i don't drink</option>

                </select>);
            break;

            case type.alim:
                return (
                    <select name={id} id={id} onChange={inputChange} value={value}>
                        <option value="none" selected disabled hidden>Select an Option</option>
                        <option value="0">never</option>
                        <option value="1">some times</option>
                        <option value="2">frequently</option>
                        <option value="3">most of the time</option>
    
                    </select>);
                break;

    }
}










