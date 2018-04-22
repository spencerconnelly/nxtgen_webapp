import React, { Component, button} from 'react';
import Modal from 'react-modal';
import './styles.css';


class Portfolio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      wallet: {},
      walletData: {},
      walletDataDisplay: {},
      coinQuantities: [],
      usBalance: 0.00,
      percentChange: 0.000,
      coinQuantity: 0,
      showModal: false,
      showBuyModal: true,
    };

    this.fetchData=this.fetchData.bind(this);
    this.getInitialState=this.getInitialState.bind(this);
    this.updateBalance=this.updateBalance.bind(this);
    this.openBuyModal=this.openBuyModal.bind(this);
    this.openSellModal=this.openSellModal.bind(this);
    this.closeModal=this.closeModal.bind(this);
    this.handleAddSubmit=this.handleAddSubmit.bind(this);
    this.handleSellSubmit=this.handleSellSubmit.bind(this);
    this.handleInputChange=this.handleInputChange.bind(this);
  }

  fetchData(){
    var walletSymbols = [];
    Object.keys(this.state.wallet).map((key)=>{
        walletSymbols.push(key);
      });
    walletSymbols=this.arrayToString(walletSymbols,',');
    if(walletSymbols[0] !== undefined){
      fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms="+walletSymbols+"&tsyms=USD")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            walletData: result.RAW,
            walletDataDisplay: result.DISPLAY
          }, () => {
            this.updateBalance();
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
    } else {
      this.setState({
            walletData: {},
            walletDataDisplay: {}
          }, () => {
            this.updateBalance();
          });
    } 
  }

  //Helper function to turn array of strings, s, to a string segregated by d  
  //Helps fetch the data from the api
  arrayToString(s, d){
    var x = '';
    Object.keys(s).map((key) => {
      if(x != ''){
        x = x + d + s[key];
      } else{
        x=s[key];
      }
      
    });
    return x;
  }

  getInitialState(s) {
    return JSON.parse(localStorage.getItem(s) || '{}');
  }

  handleAddSubmit(event){
    if(!(document.getElementById("buyform").value in this.state.wallet)  &&  (this.state.coinQuantity > 0)){
      var newInput = Object.assign({}, this.state.wallet, {[document.getElementById("buyform").value]: Number(this.state.coinQuantity)});
      this.setState({ wallet: newInput }, () => {
        this.fetchData();
        localStorage.setItem('myWallet', JSON.stringify(this.state.wallet));
      });
      this.setState({coinQuantity: 0});
      this.closeModal();
    } else if(this.state.coinQuantity <= 0) {
      alert("Please Enter a Value Greater than 0 for Coin Quantity");
    } else {
      const num = this.state.wallet[this.state.BuySym] + Number(this.state.coinQuantity);
      this.state.wallet[document.getElementById("buyform").value] = num ;
      this.fetchData();
      localStorage.setItem('myWallet', JSON.stringify(this.state.wallet));
      this.closeModal();
    }
    event.preventDefault();
  }

  handleSellSubmit(event) {
    alert(this.state.dropdownActive);
    if(document.getElementById("sellform").value in this.state.wallet && this.state.wallet[document.getElementById("sellform").value] >= this.state.coinQuantity && (this.state.coinQuantity > 0)){
      this.state.wallet[document.getElementById("sellform").value] = this.state.wallet[document.getElementById("sellform").value] - this.state.coinQuantity;
      this.fetchData();
      if(this.state.wallet[document.getElementById("sellform").value] == 0){
        const holder = this.state.wallet;
        const sym = document.getElementById("sellform").value;
        const index = Object.keys(holder).indexOf(sym);
        if (index !== -1) {
          delete holder[sym];
          localStorage.setItem('myWallet', JSON.stringify(holder));
          this.setState({wallet: holder}, () => {
          this.fetchData();
          });
        }
      }
      this.closeModal();
    } else if(this.state.wallet[document.getElementById("sellform").value] < this.state.coinQuantity){
      alert("You do not have that many "+this.state.BuySym+" in your porfolio.");
    } else if(this.state.coinQuantity <= 0){
      alert("You must remove more than 0 from your porfolio");
    }
    event.preventDefault();
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

  //called before entering "other"
  updateBalance() {
    var bal = 0;
    Object.keys(this.state.walletData).map((key)=>{
      bal += this.state.walletData[key].USD.PRICE * this.state.wallet[key];
    });
    this.setState({usBalance: bal});

  }

  updatePercentChange() {
    var oldbalance = 0;
    Object.keys(this.state.walletData).map((key) => {

    });

    var newpercent = (this.state.usBalance - oldbalance) / this.state.usBalance;
    this.setState({percentChange: newpercent});
  }

  componentDidMount() {
    const oldWallet =  JSON.parse(localStorage.getItem('myWallet'));
    if(oldWallet){
      this.setState({wallet: oldWallet, dropdownActive: Object.keys(oldWallet)[0]}, () => {
          this.fetchData();
      });
    }
    setInterval(this.fetchData,10000);
  }

  render() {
      const {showBuyModal} = this.state;
      return (
        <div class="container">
          <h2 class="balancetitle">Balance in USD: <br/>$ {(this.state.usBalance).toFixed(2)}</h2><br/>
          <h2 class="balancetitle">Percent Change in 24hrs:  <div class={this.state.percentChange > 0 ? "growth" : "loss"}>{(this.state.percentChange).toFixed(3)} %</div></h2><br/>
          <div class="container col-sm-12">
          <table class="table">
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
              {Object.keys(this.state.walletDataDisplay).map((key) => (
                <tr class="center">
                  <th>{this.state.walletDataDisplay[key].USD.FROMSYMBOL}</th>
                  <td>{this.state.wallet[key]}</td>
                  <td>{this.state.walletDataDisplay[key].USD.PRICE}</td>
                  <td>$ {(this.state.walletData[key].USD.PRICE * this.state.wallet[key]).toFixed(2)}</td>
                  <td>{this.state.walletDataDisplay[key].USD.HIGH24HOUR}</td>
                  <td>{this.state.walletDataDisplay[key].USD.LOW24HOUR}</td>
                  <td class={this.state.walletData[key].USD.CHANGEPCT24HOUR > 0 ? "growth" : "loss"}>{(this.state.walletData[key].USD.CHANGEPCT24HOUR).toFixed(3)}%</td>
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
                      <select class="form-control" id="buyform" onChange={this.handleDropChange}>
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
                      <select class="form-control" id="sellform" onChange={this.handleDropChange}>
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