import "../styles/statsCard.css";


function StatsCard({title,value,icon}){

    return (

        <div className= "stats-card">

            <div className= "stats-icon">{icon}</div>

            <div>
                <h3>{title}</h3>

                <p>{value}</p>
            </div>
        </div>
    );
}


export default StatsCard;