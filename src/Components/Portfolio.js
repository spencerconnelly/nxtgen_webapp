import React, { Component, button} from 'react';
import Modal from 'react-modal';
import './styles.css';


class Portfolio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      coinBalances: [],
      usBalance: 0.00
    };


    this.fetchData=this.fetchData.bind(this);
  }

  fetchData() {
    fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,LTC,ADA,XLM,NEO,IOT,XMR&tsyms=USD")
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
  }

  componentDidMount() {
    this.fetchData();
    setInterval(this.fetchData,10000);
  }

  render() {
      const {error, isLoaded, usBalance} = this.state;
      return (
        <div class="container">
          <h2 class="balancetitle">Balance in USD: ${usBalance}</h2><br/>
          <h4 class="balancetitle">Percent Change in 24hrs:  %</h4><br/>
          <div class="container col-sm-12">
          <table class="table">
            <thead class="thead-inverse">
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">Price</th>
                <th scope="col">24hr High</th>
                <th scope="col">24hr Low</th>
                <th scope="col">Holdings</th>
                <th scope="col">Holdings (USD)</th>
                <th scope="col">Change % (24h)</th>
              </tr>
            </thead>
            <tbody>
              
            </tbody>
          </table>
          <button class="btn btn-primary port-button">Add Coin to Balance</button>
          <button class="btn btn-primary port-button">Remove Coin from Balance</button><br/>
          </div>
         <Modal className="coinmodal" isOpen={this.state.showModal} onRequestClose={this.closeModal} ariaHideApp={false}>
            <div class="container-fluid">
              <h4>{this.state.modalKey}</h4>
              <div class="row">
                <div class="col">
                  <div class="container">
                    <div class="dropdown">
                      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown button
                      </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="container">
                    sup
                  </div>
                </div>
              </div>
              <button class="btn btn-primary" onClick={this.closeModal}>close</button>
            </div>
          </Modal>  
        </div>);
  }
}

export default Portfolio;