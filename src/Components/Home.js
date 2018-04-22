import React, { Component, button} from 'react';
import Modal from 'react-modal';
import './styles.css';


class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      coins: [],
      showModal: false,
      modalKey: null,
      imageURLS: {},
    };


    this.fetchData=this.fetchData.bind(this);
    this.openModal=this.openModal.bind(this);
    this.closeModal=this.closeModal.bind(this);
  }

  fetchData() {
    const url = "https://min-api.cryptocompare.com/data/";
    fetch(url+"pricemultifull?fsyms=BTC,ETH,XRP,BCH,LTC,ADA,XLM,NEO,IOT,XMR&tsyms=USD")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          coins: result.DISPLAY
        });
      })
    .then(
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );

    fetch(url+"coin/generalinfo?fsyms=BTC,ETH,XRP,BCH,LTC,ADA,XLM,NEO,IOT,XMR&tsym=USD")
      .then(res => res.json())
      .then(
        (result) => {
          var images = {};
          var i = 0;
          Object.keys(this.state.coins).map((key) => {
            images = Object.assign({}, images, {[key]: result.Data[i].CoinInfo.ImageUrl});
            i++;
          });
          this.setState({
            imageURLS: images
          });
        })
      .then(
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  


  openModal(key) {
    this.setState({showModal: true, modalKey: key});
  }

  closeModal() {
    this.setState({showModal: false, modalKey: null});
  }

  componentDidMount() {
    this.fetchData();
    setInterval(this.fetchData,3000);
  }

 

  render() {
    const {error, isLoaded, coins} = this.state;
      if(isLoaded){
      return (
        <div class="container">
          <table class="table">
            <thead class="thead-inverse">
              <tr>
                <th scope="col">Avatar</th>
                <th scope="col">Symbol</th>
                <th scope="col">Market Cap</th>
                <th scope="col">Price</th>
                <th scope="col">24hr High</th>
                <th scope="col">24hr Low</th>
                <th scope="col">Volume (24h)</th>
                <th scope="col">Change % (24h)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.coins).map((key) => (
                <tr onClick={() => this.openModal(key)} class="hover-row">
                  <td>{this.state.imageURLS.length != 0 ? <img class="small-pic" alt="" src={"https://www.cryptocompare.com"+this.state.imageURLS[key]} alt="oops" /> : <div></div>}</td>
                  <th scope="row">{this.state.coins[key].USD.FROMSYMBOL}</th>
                  <td>{this.state.coins[key].USD.MKTCAP}</td>
                  <td>{this.state.coins[key].USD.PRICE}</td>
                  <td>{this.state.coins[key].USD.HIGH24HOUR}</td>
                  <td>{this.state.coins[key].USD.LOW24HOUR}</td>
                  <td>{this.state.coins[key].USD.VOLUME24HOURTO}</td>
                  <td class={this.state.coins[key].USD.CHANGEPCT24HOUR > 0 ? "growth" : "loss"}>{this.state.coins[key].USD.CHANGEPCT24HOUR}%</td>
                </tr>
              ))}
            </tbody>
          </table>  
          <div class="footer">
            All currency in USD
          </div>
          <Modal className="coinmodal" isOpen={this.state.showModal} onRequestClose={this.closeModal} ariaHideApp={false}>
            <div class="container-fluid">
              <h4>{this.state.modalKey}</h4>
              <div class="row">
                
              </div>
              <button class="btn btn-primary" onClick={this.closeModal}>close</button>
            </div>
          </Modal>
        </div>);
      } else {
        return(<div>Loading ...</div>);
      }
    }
  }


export default Home;
