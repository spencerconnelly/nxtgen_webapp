import React, { Component, button} from 'react';
import Modal from 'react-modal';
import './styles.css';


class Portfolio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      dropdownActive: "BTC",
      BuySym: "BTC",
      wallet: {},
      coinQuantities: [],
      usBalance: 0.00,
      coinQuantity: 0,
      showModal: false,
      showBuyModal: true,
    };

    this.fetchData=this.fetchData.bind(this);
    this.printwallet=this.printwallet.bind(this);
    this.openBuyModal=this.openBuyModal.bind(this);
    this.openSellModal=this.openSellModal.bind(this);
    this.closeModal=this.closeModal.bind(this);
    this.handleAddSubmit=this.handleAddSubmit.bind(this);
    this.handleSellSubmit=this.handleSellSubmit.bind(this);
    this.handleDropChange=this.handleDropChange.bind(this);
    this.handleInputChange=this.handleInputChange.bind(this);
  }

  fetchData(){
    var walletSymbols = [];
    fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,LTC,ADA,XLM,NEO,IOT,XMR&tsyms=USD")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          walletData: result.DISPLAY
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

  handleAddSubmit(event){
    if(!(this.state.BuySym in this.state.wallet)  &&  (this.state.coinQuantity > 0)){
      var newInput = Object.assign({}, this.state.wallet, {[this.state.BuySym]: Number(this.state.coinQuantity)});
      this.setState({wallet: newInput});
      this.closeModal();
    } else if(this.state.coinQuantity <= 0) {
      alert("Please Enter a Value Greater than 0 for Coin Quantity");
    } else {
      const num = this.state.wallet[this.state.BuySym] + Number(this.state.coinQuantity);
      this.state.wallet[this.state.BuySym] = num ;

      this.closeModal();
    }
    event.preventDefault();
  }

  handleSellSubmit(event) {
    if(this.state.BuySym in this.state.wallet && this.state.wallet[this.state.BuySym] >= this.state.coinQuantity && (this.state.coinQuantity > 0)){
      this.state.wallet[this.state.BuySym] = this.state.wallet[this.state.BuySym] - this.state.coinQuantity;
      this.closeModal();
    } else if(this.state.wallet[this.state.BuySym] < this.state.coinQuantity){
      alert("You do not have that many "+this.state.BuySym+" in your porfolio.");
    } else if(this.state.coinQuantity <= 0){
      alert("You must remove more than 0 from your porfolio");
    }
    event.preventDefault();
  }

  handleDropChange(event) {
    this.setState({dropdownActive: event.target.value});
    this.setState({BuySym: event.target.value});
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  openBuyModal() {
    this.setState({showBuyModal: true});
    this.setState({showModal: true});
  }

  openSellModal() {
    this.setState({showBuyModal: false});
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false, showBuyModal: false});
  }

 printwallet(){
    console.log(this.state.wallet);
 }

  componentDidMount() {
    
  }

  render() {
      const {showBuyModal} = this.state;
      return (
        <div class="container">
          <h2 class="balancetitle">Balance in USD: ${this.state.usBalance}</h2><br/>
          <h4 class="balancetitle">Percent Change in 24hrs:  %</h4><br/>
          <div class="container col-sm-12">
          <table class="table table-striped">
            <thead class="thead-inverse">
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">Holdings</th>
                <th scope="col">Price</th>
                <th scope="col">Holdings (USD)</th>
                <th scope="col">24hr High</th>
                <th scope="col">24hr Low</th>
                <th scope="col">Change % (24h)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.wallet).map((key) => (
                <tr>
                  <th>{key}</th>
                  <td>{this.state.wallet[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={this.openBuyModal} class="btn btn-primary port-button">Add Coin to Balance</button>
          <button onClick={this.openSellModal} class="btn btn-primary port-button">Remove Coin from Balance</button><br/>
          </div>
         <Modal className="coinmodal" isOpen={this.state.showModal} onRequestClose={this.closeModal} ariaHideApp={false}>
            <div class="container-fluid">
              <div>
                {showBuyModal ? 
                  <form onSubmit={this.handleAddSubmit}>
                    <div class="form-group">
                      <label htmlFor="sel1">Select Coin:</label>
                      <select class="form-control" value={this.state.dropdownActive} onChange={this.handleDropChange}>
                        <option value="BTC">Bitcoin - BTC</option>
                        <option value="ETH">Ether - ETH</option>
                        <option value="XRP">Ripple - XRP</option>
                        <option value="BCH">Bitcoin Cash - BCH</option>
                        <option value="LTC">Litecoin - LTC</option>
                        <option value="ADA">Cardano - ADA</option>
                        <option value="XLM">Stellar - XLM</option>
                        <option value="IOT">IOTA - IOT</option>
                        <option value="NEO">NEO - NEO</option>
                        <option value="XMR">Monero - XMR</option>
                        <option value="other">Other...</option>
                      </select>
                      {this.state.dropdownActive == "other" ? <div><br/><input onChange={this.handleInputChange} name="BuySym" class="form-control" placeholder="Enter Symbol..." type="text"></input></div> : <div></div>}
                    </div>
                    <div class="form-group">
                      <label htmlFor="quantity">Quantity:</label>
                      <input onChange={this.handleInputChange} name="coinQuantity" class="form-control" placeholder="Enter Quantity..." type="number" min="0" step=".00000001"></input>
                    </div>
                    <button type="submit" class="btn btn-default">Add to Portfolio</button>
                  </form>
                 : <form onSubmit={this.handleSellSubmit}>
                    <div class="form-group">
                      <label htmlFor="sel1">Select Coin:</label>
                      <select class="form-control" value={this.state.dropdownActive} onChange={this.handleDropChange}>
                        {Object.keys(this.state.wallet).map((key)=>(
                          <option value={key}>{key}</option>    
                        ))}
                      </select>
                    </div>
                    <div class="form-group">
                      <label htmlFor="quantity">Quantity:</label>
                      <input onChange={this.handleInputChange} name="coinQuantity" class="form-control" placeholder="Enter Quantity..." type="number" min="0" step=".00000001"></input>
                    </div>
                    <button type="submit" class="btn btn-default">Remove from Portfolio</button>
                  </form>}
                <div>
                </div>
              </div>

            </div>
          </Modal>
        </div>);
  }
}

export default Portfolio;