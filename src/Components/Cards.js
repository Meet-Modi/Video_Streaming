import React from "react";
import "./Cards.css";
import "../fontawesome/css/all.css";
import "../fontawesome/css/fontawesome.css";

class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: props.id,
            image: props.image,
            title: props.title,
            description: props.description,
            link: props.link,
            expanded: false
        }

        this.expandCard = this.expandCard.bind(this)
    }

    handleSearch = () => {
        window.location.assign(this.state.link);
    }

    expandCard() {
        this.setState({ expanded: !this.state.expanded })
    }


    render() {
        //console.log("entered and the data is "+ this.state.title);
        return (
            <div className={this.state.expanded ? "card expanded" : "card"} onClick={this.expandCard}>
                <div className="card-image">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/` + this.state.image + `.jpg`} alt="ima" />
                </div>
                <div className="details">
                    <h3>
                        {this.state.title}
                     
                    </h3>
                    <p>    {this.state.cover}</p>
                    <div className="actions">
                        <button className="action play" onClick={() => { this.handleSearch() }}>
                            <i className="fas fa-play"></i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Cards;