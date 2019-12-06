import React, { Component } from 'react'
import { ContractData } from "@drizzle/react-components";


export default class LookUpStar extends Component {
  state = {
    starId: ""
  }

  handleChange = (e) => {
    this.setState({
      starId: e.target.value,
    })
  }

  render() {

    return (
      <div className="section">
        <h2>Look Up Star</h2>

          <input 
            type='number'
            name='starId'
            placeholder="(uint) Star Id"
            value={this.state.starId}
            onChange={this.handleChange}
            style={{marginBottom: 20}}
          />
          <br></br>

          <strong>Star Id:  </strong>
            <span>{this.state.starId}</span>
          <br></br>

          <strong>Star Name:  </strong>
            <span>
              <ContractData
                contract="StarNotary"
                method="lookUpStarInfo"
                methodArgs={[this.state.starId]}
              />
            </span>
      </div>
    )
  }
}