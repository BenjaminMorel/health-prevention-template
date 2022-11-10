import {collection, getDocs, query, where} from "firebase/firestore";
import {useEffect, useState} from "react";
import {auth, db} from "../initFirebase";
import {Link} from "react-router-dom";
import icon from "../images/iconHistory.png";

export default function History() {
    let [myDocs, setMyDocs] = useState([]);
    const myQuery = query(collection(db, "questionnaires"), where("userID", "==", auth.currentUser.uid));

    useEffect(() => {
        getMyDocs(myQuery).then(response => setMyDocs(response));
    }, [])

    const getMyDocs = async (myQuery) => {
        let myList = [];
        const querySnapshot = await getDocs(myQuery);
        querySnapshot.forEach((doc) => {
            let id = doc.id;
            let data = doc.data();
            myList.push({id, data});

        });
        return myList;
    }


    if (myQuery.isLoading) {
        return (<div>loading ...</div>);
    } else {
        return (
            <>
                <h1 className="mainTitleHistory">Your surveys history</h1>
                <div>
                    {myDocs.map((doc, index) => <HistLine infos={doc} id={index}/>)
                    }
                </div>
            </>
        );
    }
}


function HistLine({infos, id}) {
    let myDate = new Date(null);
    myDate.setSeconds(infos.data.date.seconds);
    let year = myDate.getFullYear().toString().padStart(4, '0');
    let month = myDate.getMonth().toString().padStart(2, '0');
    let day = myDate.getDate().toString().padStart(2, '0');
    let hour = myDate.getHours().toString().padStart(2, '0');
    let minutes = myDate.getMinutes().toString().padStart(2, '0');
    return (
        <>
            <div className="historyList" id={id}>
                <img className="iconsHistory" src={icon}/>
                <Link className="linksHistory" to={`/history/${infos.id}`} style={{textDecoration: 'none'}}>
                    {"Survey of " + day + "." + month + "." + year + " - " + hour + ":" + minutes}
                </Link>
            </div>
        </>
        
    
    );
}